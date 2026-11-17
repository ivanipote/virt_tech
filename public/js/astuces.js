// --- astuces.js ---
// Page Astuces VirtTech. Le serveur fait le filtrage, le tri et la pagination.
// Chaque requête envoie le jeton du visiteur dans l'en-tête "x-visiteur-token".
(function () {
'use strict';

// ---------------------------------------------------------------------
// Constantes (identiques à astuceService.js et schema.sql)
// ---------------------------------------------------------------------
const LANGAGES = ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'PHP', 'SQL', 'Bash', 'Autre'];
const NIVEAUX = ['Débutant', 'Intermédiaire', 'Avancé'];
const LIMITE = 6; // astuces par page (le serveur accepte de 1 à 24)

// Nom du langage Prism (cartes) et mode CodeMirror (formulaire)
const PRISM = { HTML: 'markup', CSS: 'css', JavaScript: 'javascript', TypeScript: 'typescript', React: 'jsx', 'Node.js': 'javascript', Python: 'python', PHP: 'php', SQL: 'sql', Bash: 'bash', Autre: 'none' };
const CM_MODES = { HTML: 'htmlmixed', CSS: 'css', JavaScript: 'javascript', TypeScript: 'text/typescript', React: 'jsx', 'Node.js': 'javascript', Python: 'python', PHP: 'application/x-httpd-php', SQL: 'text/x-sql', Bash: 'shell', Autre: 'text/plain' };

// Icônes Font Awesome
const ICONES = {
    eye: 'fa-solid fa-eye', plus: 'fa-solid fa-plus', copy: 'fa-regular fa-copy', check: 'fa-solid fa-check',
    trash: 'fa-solid fa-trash', pen: 'fa-solid fa-pen', link: 'fa-solid fa-link', bulb: 'fa-solid fa-lightbulb',
    alerte: 'fa-solid fa-circle-exclamation'
};
function ico(nom) { return '<i class="' + ICONES[nom] + '" aria-hidden="true"></i>'; }
function coeur(aime) { return '<i class="fa-heart ' + (aime ? 'fa-solid' : 'fa-regular') + '" aria-hidden="true"></i>'; }

// ---------------------------------------------------------------------
// Utilitaires
// ---------------------------------------------------------------------
const $ = (id) => document.getElementById(id);
const memoire = {};
function lire(cle) { try { return localStorage.getItem(cle); } catch (e) { return memoire[cle] || null; } }
function ecrire(cle, valeur) { try { localStorage.setItem(cle, valeur); } catch (e) { memoire[cle] = valeur; } }
function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
function pluriel(n, mot) { return n + ' ' + mot + (n > 1 ? 's' : ''); }
function debounce(fn, ms) { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; }
function tempsEcoule(iso) {
    const d = new Date(iso);
    const minutes = Math.floor((Date.now() - d) / 60000);
    if (minutes < 1) return "À l'instant";
    if (minutes < 60) return 'Il y a ' + minutes + ' min';
    const heures = Math.floor(minutes / 60);
    if (heures < 24) return 'Il y a ' + heures + ' h';
    const jours = Math.floor(heures / 24);
    if (jours < 30) return 'Il y a ' + jours + ' j';
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ---------------------------------------------------------------------
// Jeton visiteur (même clé qu'avant : les astuces déjà publiées restent à leur auteur)
// ---------------------------------------------------------------------
let monToken = lire('virttech_user_token');
if (!monToken || monToken.length < 8) {
    monToken = (window.crypto && crypto.randomUUID)
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2) + Date.now().toString(36);
    ecrire('virttech_user_token', monToken);
}

// ---------------------------------------------------------------------
// API
// ---------------------------------------------------------------------
async function api(chemin, { methode = 'GET', corps } = {}) {
    const options = { method: methode, headers: { 'x-visiteur-token': monToken } };
    if (corps) {
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(corps);
    }
    let reponse;
    try {
        reponse = await fetch('/api/astuces' + chemin, options);
    } catch (e) {
        throw new Error('Connexion impossible. Vérifiez votre réseau et réessayez.');
    }
    let data = null;
    try { data = await reponse.json(); } catch (e) { /* réponse non JSON */ }
    if (!reponse.ok || !data || !data.succes) {
        const err = new Error((data && data.message) || 'Une erreur est survenue. Réessayez dans un instant.');
        err.status = reponse.status; // 400, 403, 404, 429...
        throw err;
    }
    return data;
}

// ---------------------------------------------------------------------
// État de la page
// ---------------------------------------------------------------------
const etat = {
    onglet: 'toutes', recherche: '', langage: '', niveau: '', tri: 'recentes',
    page: 0, aPlus: false, total: 0, charge: false, req: 0,
    items: new Map(),            // astuces connues, par id
    vuesEnvoyees: new Set(),     // évite de rappeler /vue pendant la session
    edition: null,               // id en cours de modification, ou null
    duJourId: null
};
const grille = $('grilleAstuces');
let editeur = null;              // CodeMirror (ou null s'il n'a pas chargé)

// ---------------------------------------------------------------------
// Messages courts et confirmation
// ---------------------------------------------------------------------
function toast(message, type) {
    const t = document.createElement('div');
    t.className = 'toast' + (type === 'erreur' ? ' erreur' : '');
    t.innerHTML = ico(type === 'erreur' ? 'alerte' : 'check') + '<span>' + esc(message) + '</span>';
    $('toasts').appendChild(t);
    setTimeout(() => t.remove(), type === 'erreur' ? 5000 : 3200);
}
function confirmer(titre, message, actions) {
    $('ovTitre').textContent = titre;
    $('ovMessage').textContent = message;
    const conteneur = $('ovActions');
    conteneur.innerHTML = '';
    actions.forEach((a) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'btn-ov ' + a.classe;
        b.textContent = a.texte;
        b.onclick = () => { fermerConfirm(); if (a.fn) a.fn(); };
        conteneur.appendChild(b);
    });
    $('overlayGlobal').classList.add('ouvert');
    if (conteneur.lastElementChild) conteneur.lastElementChild.focus();
}
function fermerConfirm() { $('overlayGlobal').classList.remove('ouvert'); }

// ---------------------------------------------------------------------
// Rendu d'une carte
// ---------------------------------------------------------------------
function niveauHTML(niveau) {
    const rang = Math.max(0, NIVEAUX.indexOf(niveau)) + 1;
    return '<div class="niveau"><span class="niveau-barres" aria-hidden="true">'
        + '<i class="' + (rang >= 1 ? 'on' : '') + '"></i><i class="' + (rang >= 2 ? 'on' : '') + '"></i><i class="' + (rang >= 3 ? 'on' : '') + '"></i>'
        + '</span><span>' + esc(niveau) + '</span></div>';
}

function carteHTML(a, detail) {
    let code = '';
    if (a.code) {
        const longCode = a.code.split('\n').length > 8;
        const coupe = !detail && longCode;
        code = '<div class="code-wrapper' + (coupe ? ' coupe-wrap' : '') + '">'
            + '<div class="code-header"><span class="code-lang">' + esc(a.langage) + '</span>'
            + '<button class="btn-copy" type="button" data-act="copier" data-id="' + a.id + '">' + ico('copy') + ' Copier</button></div>'
            + '<div class="code-content' + (coupe ? ' coupe' : '') + '"><pre><code class="language-' + (PRISM[a.langage] || 'none') + '">' + esc(a.code) + '</code></pre></div>'
            + '</div>';
    }
    const moi = a.est_proprietaire;
    const actionsProprio = moi
        ? '<button class="social-btn" type="button" data-act="modifier" data-id="' + a.id + '" title="Modifier" aria-label="Modifier">' + ico('pen') + '</button>'
        + '<button class="social-btn danger" type="button" data-act="supprimer" data-id="' + a.id + '" title="Supprimer" aria-label="Supprimer">' + ico('trash') + '</button>'
        : '';
    const modifiee = a.date_modification ? ' · modifiée' : '';

    return '<article class="card-astuce' + (detail ? ' detail' : '') + '" id="' + (detail ? 'detail-' : 'card-') + a.id + '" data-id="' + a.id + '" data-act="ouvrir">'
        + '<div class="card-header"><h3>' + esc(a.titre) + '</h3><span class="tag-langage">' + esc(a.langage) + '</span></div>'
        + niveauHTML(a.niveau)
        + '<div class="card-content">' + esc(a.contenu) + '</div>'
        + code
        + '<div class="card-footer"><div class="social-actions">'
        + '<button class="social-btn' + (a.a_like ? ' liked' : '') + '" type="button" data-act="like" data-like="' + a.id + '" aria-pressed="' + (!!a.a_like) + '" aria-label="J\'aime">'
        + '<span class="ico-coeur">' + coeur(a.a_like) + '</span><span class="n-like">' + a.likes + '</span></button>'
        + '<span class="social-btn statique" title="Vues">' + ico('eye') + '<span data-vues="' + a.id + '">' + a.vues + '</span></span>'
        + '<button class="social-btn" type="button" data-act="partager" data-id="' + a.id + '" title="Copier le lien" aria-label="Copier le lien">' + ico('link') + '</button>'
        + actionsProprio
        + '</div><div class="author-info"><strong>' + esc(a.auteur) + (moi ? '<span class="badge-moi">Vous</span>' : '') + '</strong>'
        + '<span class="time-post">' + esc(tempsEcoule(a.date_creation) + modifiee) + '</span></div></div>'
        + '</article>';
}

function colorer(racine) {
    if (!window.Prism || !Prism.highlightElement) return;
    racine.querySelectorAll('code[class*="language-"]').forEach((c) => {
        if (/language-none/.test(c.className)) return;
        try { Prism.highlightElement(c); } catch (e) { /* langage non chargé : le code reste en texte brut */ }
    });
}
function memoriser(liste) { liste.forEach((a) => etat.items.set(a.id, a)); }

// ---------------------------------------------------------------------
// Liste (filtrée, triée et paginée par le serveur)
// ---------------------------------------------------------------------
function parametresListe() {
    const p = new URLSearchParams({ page: etat.page + 1, limite: LIMITE, tri: etat.tri });
    if (etat.recherche) p.set('recherche', etat.recherche);
    if (etat.langage) p.set('langage', etat.langage);
    if (etat.niveau) p.set('niveau', etat.niveau);
    if (etat.onglet === 'mes') p.set('mes', '1');
    return p;
}
function filtresActifs() { return !!(etat.recherche || etat.langage || etat.niveau || etat.tri !== 'recentes'); }

async function charger(reinit) {
    if (etat.charge && !reinit) return;
    const numero = ++etat.req; // ignore les réponses devenues obsolètes
    etat.charge = true;
    if (reinit) {
        etat.page = 0; etat.aPlus = false;
        grille.hidden = true; grille.innerHTML = '';
        $('loader').hidden = false; $('plus').hidden = true; $('finListe').hidden = true;
    } else {
        $('loaderFin').hidden = false; $('plus').hidden = true;
    }
    try {
        const r = await api('?' + parametresListe());
        if (numero !== etat.req) return;
        memoriser(r.data);
        etat.page = r.page; etat.aPlus = r.aPlus; etat.total = r.total;
        if (r.data.length === 0 && r.page === 1) {
            afficherVide();
        } else {
            grille.insertAdjacentHTML('beforeend', r.data.map((a) => carteHTML(a, false)).join(''));
            colorer(grille);
        }
    } catch (e) {
        if (numero !== etat.req) return;
        toast(e.message, 'erreur');
        if (reinit) {
            grille.innerHTML = '<div class="etat-vide">' + ico('alerte') + '<h3>Impossible de charger les astuces</h3><p>' + esc(e.message)
                + '</p><button class="btn-principal" type="button" data-act="recharger">Réessayer</button></div>';
        }
    } finally {
        if (numero === etat.req) {
            etat.charge = false;
            $('loader').hidden = true; grille.hidden = false; $('loaderFin').hidden = true;
            $('plus').hidden = !etat.aPlus;
            majCompteur();
        }
    }
}

function majCompteur() {
    const vide = grille.querySelector('.etat-vide');
    let texte = '';
    if (!vide) texte = etat.onglet === 'mes' ? pluriel(etat.total, 'astuce') + ' publiée' + (etat.total > 1 ? 's' : '') + ' par vous' : pluriel(etat.total, 'astuce');
    $('compteur').textContent = texte;
    $('btnReset').hidden = !filtresActifs();
    const fin = $('finListe');
    if (!vide && !etat.aPlus && etat.total > LIMITE) {
        fin.textContent = 'Vous avez tout vu : ' + pluriel(etat.total, 'astuce') + ' au total.';
        fin.hidden = false;
    } else {
        fin.hidden = true;
    }
}

function afficherVide() {
    let titre, message, bouton = '';
    if (etat.recherche || etat.langage || etat.niveau) {
        titre = 'Aucune astuce ne correspond';
        message = 'Essayez un autre mot, un autre langage ou retirez un filtre.';
        bouton = '<button class="btn-principal" type="button" data-act="reset">Réinitialiser les filtres</button>';
    } else if (etat.onglet === 'mes') {
        titre = "Vous n'avez rien publié";
        message = 'Partagez votre première astuce avec la communauté. Elle apparaîtra ici.';
        bouton = '<button class="btn-principal" type="button" data-act="nouvelle">' + ico('plus') + ' Publier ma première astuce</button>';
    } else {
        titre = 'Soyez le premier à publier ici';
        message = "Aucune astuce n'a encore été partagée sur VirtTech.";
        bouton = '<button class="btn-principal" type="button" data-act="nouvelle">' + ico('plus') + ' Écrire une astuce</button>';
    }
    grille.innerHTML = '<div class="etat-vide">' + ico('bulb') + '<h3>' + titre + '</h3><p>' + message + '</p>' + bouton + '</div>';
}

function remplacerCarte(a) {
    etat.items.set(a.id, a);
    const carte = $('card-' + a.id);
    if (carte) { const t = document.createElement('div'); t.innerHTML = carteHTML(a, false); const n = t.firstElementChild; carte.replaceWith(n); colorer(n); }
    const det = $('detail-' + a.id);
    if (det) { const t = document.createElement('div'); t.innerHTML = carteHTML(a, true); const n = t.firstElementChild; det.replaceWith(n); colorer(n); }
}

// ---------------------------------------------------------------------
// Stats et astuce du jour (la première astuce publiée depuis 00h00)
// ---------------------------------------------------------------------
async function chargerStats() {
    try {
        const s = (await api('/stats')).data;
        $('stats').innerHTML = '<b>' + s.astuces + '</b> astuces · <b>' + s.contributeurs + '</b> contributeurs · <b>' + s.langages + '</b> langages';
    } catch (e) { $('stats').textContent = ''; }
}

async function chargerDuJour() {
    const zone = $('duJourZone');
    try {
        const a = (await api('/du-jour')).data;
        if (!a) { zone.hidden = true; etat.duJourId = null; return; }
        etat.items.set(a.id, a);
        etat.duJourId = a.id;
        const d = new Date(a.date_creation);
        const jour = d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
        const heure = d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        zone.innerHTML = '<button class="du-jour" type="button" data-act="ouvrir" data-id="' + a.id + '">'
            + '<span class="dj-icone">' + ico('bulb') + '</span>'
            + '<span class="dj-texte"><span class="dj-label">Astuce du jour · ' + esc(jour) + '</span>'
            + '<span class="dj-titre">' + esc(a.titre) + '</span>'
            + '<span class="dj-meta">' + esc(a.langage) + ' · ' + esc(a.niveau) + ' · première publiée par ' + esc(a.auteur) + ' à ' + esc(heure) + '</span></span>'
            + '<span class="dj-cta">Lire l\'astuce</span></button>';
        zone.hidden = false;
    } catch (e) { zone.hidden = true; }
}

// ---------------------------------------------------------------------
// Détail d'une astuce (et lien de partage /astuces#12)
// ---------------------------------------------------------------------
async function ouvrirDetail(id, depuisLien) {
    let a = etat.items.get(id);
    if (!a || depuisLien) {
        try { a = (await api('/' + id)).data; etat.items.set(id, a); }
        catch (e) { toast(e.status === 404 ? "Cette astuce n'existe plus." : e.message, 'erreur'); return; }
    }
    $('detailCorps').innerHTML = carteHTML(a, true);
    colorer($('detailCorps'));
    $('detailBg').classList.add('ouvert');
    $('detailFermer').focus();
    try { history.replaceState(null, '', location.pathname + location.search + '#' + id); } catch (e) { /* ignoré */ }
    enregistrerVue(id);
}
function fermerDetail() {
    $('detailBg').classList.remove('ouvert');
    try { history.replaceState(null, '', location.pathname + location.search); } catch (e) { /* ignoré */ }
}

async function enregistrerVue(id) {
    if (etat.vuesEnvoyees.has(id)) return;
    etat.vuesEnvoyees.add(id);
    try {
        const r = await api('/' + id + '/vue', { methode: 'POST' }); // une seule vue par appareil, garanti par la base
        const a = etat.items.get(id);
        if (a) a.vues = r.vues;
        document.querySelectorAll('[data-vues="' + id + '"]').forEach((n) => { n.textContent = r.vues; });
    } catch (e) { etat.vuesEnvoyees.delete(id); }
}

// ---------------------------------------------------------------------
// Likes
// ---------------------------------------------------------------------
function majLike(id) {
    const a = etat.items.get(id);
    if (!a) return;
    document.querySelectorAll('[data-like="' + id + '"]').forEach((b) => {
        b.classList.toggle('liked', !!a.a_like);
        b.setAttribute('aria-pressed', !!a.a_like);
        b.querySelector('.ico-coeur').innerHTML = coeur(a.a_like);
        b.querySelector('.n-like').textContent = a.likes;
    });
}
async function basculerLike(id, bouton) {
    const a = etat.items.get(id);
    if (!a || bouton.dataset.occupe) return;
    bouton.dataset.occupe = '1';
    const avant = { likes: a.likes, a_like: a.a_like };
    const veut = !a.a_like;
    a.a_like = veut; a.likes += veut ? 1 : -1; majLike(id); // affichage immédiat
    try {
        const r = await api('/' + id + '/' + (veut ? 'like' : 'unlike'), { methode: 'POST' });
        a.likes = r.likes; a.a_like = r.aLike;
    } catch (e) {
        Object.assign(a, avant);
        toast(e.message, 'erreur'); // inclut l'erreur 429 (trop d'actions)
    } finally {
        delete bouton.dataset.occupe;
        majLike(id);
    }
}

// ---------------------------------------------------------------------
// Copier le code, copier le lien
// ---------------------------------------------------------------------
async function copierTexte(texte) {
    try { await navigator.clipboard.writeText(texte); return true; }
    catch (e) {
        try {
            const t = document.createElement('textarea');
            t.value = texte; t.style.position = 'fixed'; t.style.opacity = '0';
            document.body.appendChild(t); t.select();
            const ok = document.execCommand('copy');
            t.remove();
            return ok;
        } catch (e2) { return false; }
    }
}
async function copierCode(bouton, id) {
    const a = etat.items.get(id);
    if (!a || !a.code) return;
    const ok = await copierTexte(a.code);
    const original = bouton.innerHTML;
    bouton.innerHTML = ok ? ico('check') + ' Copié' : ico('alerte') + ' Échec';
    bouton.classList.toggle('ok', ok);
    setTimeout(() => { bouton.innerHTML = original; bouton.classList.remove('ok'); }, 1800);
}
async function partager(id) {
    const lien = location.origin + '/astuces#' + id;
    const ok = await copierTexte(lien);
    if (ok) toast('Lien copié'); else toast('Copie impossible. Lien : ' + lien, 'erreur');
}

// ---------------------------------------------------------------------
// Suppression (propriétaire uniquement, vérifié par le serveur)
// ---------------------------------------------------------------------
function demanderSuppression(id) {
    const a = etat.items.get(id);
    confirmer("Supprimer l'astuce ?", '« ' + (a ? a.titre : '') + ' » sera supprimée définitivement, avec ses likes et ses vues.', [
        { texte: 'Annuler', classe: 'btn-ov-annuler' },
        { texte: 'Supprimer', classe: 'btn-ov-danger', fn: () => supprimer(id) }
    ]);
}
async function supprimer(id) {
    try {
        await api('/' + id, { methode: 'DELETE' });
        etat.items.delete(id);
        fermerDetail();
        const carte = $('card-' + id);
        if (carte) carte.remove();
        etat.total = Math.max(0, etat.total - 1);
        if (!grille.querySelector('.card-astuce')) charger(true); else majCompteur();
        chargerStats();
        if (etat.duJourId === id) chargerDuJour(); // la suivante du même jour prend la place
        toast('Astuce supprimée');
    } catch (e) { toast(e.message, 'erreur'); }
}

// ---------------------------------------------------------------------
// Formulaire (création et modification)
// ---------------------------------------------------------------------
const champs = { auteur: $('inputAuteur'), titre: $('inputTitre'), contenu: $('inputContenu'), code: $('inputCode'), langage: $('inputLangage') };
const LIM = { auteur: [2, 50], titre: [3, 120], contenu: [5, 2000], code: [0, 10000] };
const MSG = {
    auteur: 'Le nom doit faire entre 2 et 50 caractères.',
    titre: 'Le titre doit faire entre 3 et 120 caractères.',
    contenu: "L'explication doit faire entre 5 et 2000 caractères.",
    code: 'Le code est trop long (10 000 caractères maximum).'
};
function lireCode() { return editeur ? editeur.getValue() : champs.code.value; }
function ecrireCode(v) { if (editeur) editeur.setValue(v); else champs.code.value = v; }
function valeurChamp(k) { return (k === 'code' ? lireCode() : champs[k].value).replace(/\r\n/g, '\n').trim(); }
function niveauChoisi() { const r = document.querySelector('input[name="niveau"]:checked'); return r ? r.value : 'Débutant'; }

function compteurs() {
    [['auteur', 'cptAuteur', 50], ['titre', 'cptTitre', 120], ['contenu', 'cptContenu', 2000], ['code', 'cptCode', 10000]].forEach(([k, id, max]) => {
        const n = (k === 'code' ? lireCode() : champs[k].value).length;
        const el = $(id);
        el.textContent = n + '/' + max;
        el.classList.toggle('depasse', n > max);
    });
}
function erreurChamp(k, message) {
    const groupe = document.querySelector('[data-champ="' + k + '"]');
    if (!groupe) return;
    groupe.classList.toggle('invalide', !!message);
    groupe.querySelector('.msg-erreur').textContent = message || '';
    champs[k].setAttribute('aria-invalid', message ? 'true' : 'false');
}
function valider() {
    let premier = null;
    Object.keys(LIM).forEach((k) => {
        const n = valeurChamp(k).length;
        const mauvais = n < LIM[k][0] || n > LIM[k][1];
        erreurChamp(k, mauvais ? MSG[k] : '');
        if (mauvais && !premier) premier = k;
    });
    if (premier) {
        if (premier === 'code' && editeur) editeur.focus(); else champs[premier].focus();
        return false;
    }
    return true;
}

function ouvrirForm(astuce) {
    etat.edition = astuce ? astuce.id : null;
    $('formTitreTexte').textContent = astuce ? "Modifier l'astuce" : 'Nouvelle astuce';
    $('btnPublierTexte').textContent = astuce ? 'Enregistrer' : 'Publier';
    $('formNote').hidden = !!astuce;
    champs.auteur.value = astuce ? astuce.auteur : (lire('virttech_auteur') || '');
    champs.titre.value = astuce ? astuce.titre : '';
    champs.contenu.value = astuce ? astuce.contenu : '';
    champs.langage.value = astuce ? astuce.langage : 'JavaScript';
    if (editeur) editeur.setOption('mode', CM_MODES[champs.langage.value] || 'text/plain');
    ecrireCode(astuce && astuce.code ? astuce.code : '');
    const niveau = astuce ? astuce.niveau : 'Débutant';
    document.querySelectorAll('input[name="niveau"]').forEach((r) => { r.checked = r.value === niveau; });
    Object.keys(LIM).forEach((k) => erreurChamp(k, ''));
    compteurs();
    fermerDetail();
    $('slideOverlay').classList.add('ouvert');
    $('slidePanel').classList.add('ouvert');
    if (editeur) { setTimeout(() => editeur.refresh(), 60); setTimeout(() => editeur.refresh(), 450); }
    setTimeout(() => { (astuce || champs.auteur.value ? champs.titre : champs.auteur).focus(); }, 150);
}

function formModifie() {
    const actuel = [valeurChamp('auteur'), valeurChamp('titre'), valeurChamp('contenu'), valeurChamp('code')];
    const a = etat.edition ? etat.items.get(etat.edition) : null;
    if (a) return actuel.join('\u0001') !== [a.auteur, a.titre, a.contenu, a.code || ''].join('\u0001');
    return actuel.slice(1).some(Boolean);
}
function fermerForm(force) {
    if (!force && formModifie()) {
        confirmer('Quitter sans enregistrer ?', 'Vos modifications seront perdues.', [
            { texte: 'Continuer', classe: 'btn-ov-annuler' },
            { texte: 'Quitter', classe: 'btn-ov-confirmer', fn: () => fermerForm(true) }
        ]);
        return;
    }
    $('slideOverlay').classList.remove('ouvert');
    $('slidePanel').classList.remove('ouvert');
    etat.edition = null;
}

async function envoyerForm() {
    if (!valider()) return;
    const corps = {
        auteur: champs.auteur.value, titre: champs.titre.value, contenu: champs.contenu.value,
        langage: champs.langage.value, niveau: niveauChoisi(), code: lireCode()
    };
    const bouton = $('btnPublier');
    bouton.disabled = true;
    const edition = etat.edition;
    try {
        const r = edition
            ? await api('/' + edition, { methode: 'PUT', corps })
            : await api('', { methode: 'POST', corps });
        ecrire('virttech_auteur', corps.auteur.trim());
        fermerForm(true);
        if (edition) {
            remplacerCarte(r.data);
            toast('Astuce enregistrée');
            if (etat.duJourId === edition) chargerDuJour();
        } else {
            // On revient sur la liste complète, triée par date, pour voir la nouvelle astuce en premier
            etat.onglet = 'toutes'; etat.recherche = ''; etat.langage = ''; etat.niveau = ''; etat.tri = 'recentes';
            majControles();
            charger(true);
            chargerDuJour(); // devient l'astuce du jour si c'est la première depuis 00h00
            window.scrollTo({ top: 0, behavior: 'smooth' });
            toast('Astuce publiée');
        }
        chargerStats();
    } catch (e) {
        toast(e.message, 'erreur');
    } finally {
        bouton.disabled = false;
    }
}

// ---------------------------------------------------------------------
// Contrôles (onglets, filtres)
// ---------------------------------------------------------------------
function majControles() {
    $('fRecherche').value = etat.recherche;
    $('fLangage').value = etat.langage;
    $('fNiveau').value = etat.niveau;
    $('fTri').value = etat.tri;
    document.querySelectorAll('.tab-btn').forEach((t) => {
        const actif = t.dataset.onglet === etat.onglet;
        t.classList.toggle('actif', actif);
        t.setAttribute('aria-selected', actif);
    });
}
function reinitFiltres() {
    etat.recherche = ''; etat.langage = ''; etat.niveau = ''; etat.tri = 'recentes';
    majControles();
    charger(true);
}

// ---------------------------------------------------------------------
// Initialisation
// ---------------------------------------------------------------------
function init() {
    // Listes déroulantes (les valeurs viennent des constantes ci-dessus)
    $('fLangage').innerHTML = '<option value="">Tous les langages</option>' + LANGAGES.map((l) => '<option>' + l + '</option>').join('');
    $('fNiveau').innerHTML = '<option value="">Tous les niveaux</option>' + NIVEAUX.map((n) => '<option>' + n + '</option>').join('');
    champs.langage.innerHTML = LANGAGES.map((l) => '<option>' + l + '</option>').join('');
    $('niveauChoix').innerHTML = NIVEAUX.map((n, i) =>
        '<input type="radio" name="niveau" id="niv' + i + '" value="' + n + '"' + (i === 0 ? ' checked' : '') + '><label for="niv' + i + '">' + niveauHTML(n) + '</label>'
    ).join('');

    // Éditeur de code (si CodeMirror n'a pas chargé, la zone de texte simple prend le relais)
    if (window.CodeMirror) {
        editeur = CodeMirror.fromTextArea(champs.code, {
            mode: CM_MODES[champs.langage.value] || 'text/plain', theme: 'dracula',
            lineNumbers: true, lineWrapping: true, indentUnit: 2, tabSize: 2, indentWithTabs: false,
            extraKeys: {
                Tab: (cm) => { if (cm.somethingSelected()) cm.indentSelection('add'); else cm.replaceSelection('  ', 'end'); },
                'Shift-Tab': (cm) => cm.indentSelection('subtract')
            }
        });
        editeur.on('change', () => { compteurs(); if (document.querySelector('[data-champ="code"].invalide')) erreurChamp('code', ''); });
    } else {
        champs.code.addEventListener('input', compteurs);
    }
    champs.langage.addEventListener('change', () => {
        if (editeur) editeur.setOption('mode', CM_MODES[champs.langage.value] || 'text/plain');
    });
    ['auteur', 'titre', 'contenu'].forEach((k) => champs[k].addEventListener('input', () => {
        compteurs();
        if (champs[k].closest('.invalide')) erreurChamp(k, '');
    }));

    // Onglets et filtres
    document.querySelectorAll('.tab-btn').forEach((t) => {
        t.onclick = () => { etat.onglet = t.dataset.onglet; majControles(); charger(true); };
    });
    $('fRecherche').addEventListener('input', debounce((e) => { etat.recherche = e.target.value.trim(); charger(true); }, 300));
    $('fLangage').onchange = (e) => { etat.langage = e.target.value; charger(true); };
    $('fNiveau').onchange = (e) => { etat.niveau = e.target.value; charger(true); };
    $('fTri').onchange = (e) => { etat.tri = e.target.value; charger(true); };
    $('btnReset').onclick = reinitFiltres;
    $('btnPlus').onclick = () => charger(false);

    // Chargement progressif : la page suivante arrive quand on approche du bas
    if ('IntersectionObserver' in window) {
        new IntersectionObserver((entrees) => {
            if (entrees[0].isIntersecting && etat.aPlus && !etat.charge) charger(false);
        }, { rootMargin: '300px' }).observe($('sentinelle'));
    }

    // Clics sur les cartes, le bandeau du jour et les états vides
    document.addEventListener('click', (e) => {
        const el = e.target.closest('[data-act]');
        if (!el) return;
        const act = el.dataset.act;
        const parent = el.closest('[data-id]');
        const id = parseInt(el.dataset.id || (parent && parent.dataset.id), 10);
        if (act === 'ouvrir') {
            if (e.target.closest('button:not([data-act="ouvrir"]), a')) return;
            ouvrirDetail(id);
        } else if (act === 'like') basculerLike(id, el);
        else if (act === 'copier') copierCode(el, id);
        else if (act === 'partager') partager(id);
        else if (act === 'modifier') ouvrirForm(etat.items.get(id));
        else if (act === 'supprimer') demanderSuppression(id);
        else if (act === 'nouvelle') ouvrirForm(null);
        else if (act === 'reset') reinitFiltres();
        else if (act === 'recharger') charger(true);
    });

    // Formulaire, détail, clavier
    $('btnAjouter').onclick = () => ouvrirForm(null);
    $('btnFormFermer').onclick = () => fermerForm(false);
    $('slideOverlay').onclick = () => fermerForm(false);
    $('btnPublier').onclick = envoyerForm;
    $('formAstuce').addEventListener('submit', (e) => { e.preventDefault(); envoyerForm(); });
    $('detailFermer').onclick = fermerDetail;
    $('detailBg').addEventListener('click', (e) => { if (e.target === $('detailBg')) fermerDetail(); });
    document.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape') return;
        if ($('overlayGlobal').classList.contains('ouvert')) fermerConfirm();
        else if ($('slidePanel').classList.contains('ouvert')) fermerForm(false);
        else if ($('detailBg').classList.contains('ouvert')) fermerDetail();
    });

    // Lien de partage : /astuces#12
    function ouvrirDepuisHash() {
        const m = location.hash.match(/^#(\d+)$/);
        if (m) ouvrirDetail(parseInt(m[1], 10), true);
    }
    window.addEventListener('hashchange', () => {
        if (/^#\d+$/.test(location.hash) && !$('detailBg').classList.contains('ouvert')) ouvrirDepuisHash();
    });

    majControles();
    compteurs();
    charger(true);
    chargerStats();
    chargerDuJour();
    ouvrirDepuisHash();
}

document.addEventListener('DOMContentLoaded', init);
})();