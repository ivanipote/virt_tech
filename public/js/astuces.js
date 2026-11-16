// --- astuces.js ---
let toutesLesAstuces = [];
let currentTab = 'toutes';
let pageActuelle = 0;
const astucesParPage = 6;
let filtreAstuces = [];
let editor;
let idASupprimer = null;
let myToken;

document.addEventListener("DOMContentLoaded", () => {
    // 1. Initialisation du Token du navigateur
    myToken = localStorage.getItem('virttech_user_token');
    if (!myToken) {
        myToken = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
        localStorage.setItem('virttech_user_token', myToken);
    }

    // 2. Init CodeMirror
    editor = CodeMirror.fromTextArea(document.getElementById('inputCode'), {
        mode: "htmlmixed", theme: "dracula", lineNumbers: true, lineWrapping: true
    });

    document.getElementById('inputLangage').addEventListener('change', function() {
        let mode = this.value.toLowerCase();
        if(mode === 'html') mode = 'htmlmixed';
        if(mode === 'autre') mode = 'text/plain';
        editor.setOption("mode", mode);
    });

    // 3. Chargement initial
    setTimeout(() => {
        chargerAstuces();
    }, 1000);

    // 4. Écouter le scroll infini
    window.addEventListener('scroll', () => {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 200) {
            if (pageActuelle * astucesParPage < filtreAstuces.length) {
                chargerPageSuivante();
            }
        }
    });
});

// --- CHARGEMENT ---
async function chargerAstuces() {
    document.getElementById('loader').style.display = 'flex';
    document.getElementById('grilleAstuces').style.display = 'none';

    try {
        const res = await fetch('/api/astuces');
        const data = await res.json();
        if (data.succes) {
            toutesLesAstuces = data.data;
            filtrerEtAfficher();
        }
    } catch (error) {
        afficherOverlay("Erreur", "Impossible de charger les astuces.", [{ texte: "OK", class: "btn-ov-confirmer", fonction: fermerOverlay }]);
    } finally {
        document.getElementById('loader').style.display = 'none';
        document.getElementById('grilleAstuces').style.display = 'grid';
    }
}

function filtrerEtAfficher() {
    pageActuelle = 0;
    document.getElementById('grilleAstuces').innerHTML = "";
    
    filtreAstuces = (currentTab === 'toutes') 
        ? toutesLesAstuces 
        : toutesLesAstuces.filter(a => a.owner_token === myToken);
        
    chargerPageSuivante();
}

function chargerPageSuivante() {
    document.getElementById('loaderFin').style.display = "block";

    setTimeout(() => {
        const debut = pageActuelle * astucesParPage;
        const fin = debut + astucesParPage;
        const astucesDeLaPage = filtreAstuces.slice(debut, fin);

        if (astucesDeLaPage.length === 0 && pageActuelle === 0) {
            afficherEtatVide();
        } else {
            afficherCartes(astucesDeLaPage);
        }

        pageActuelle++;
        document.getElementById('loaderFin').style.display = "none";
    }, 500);
}

// --- AFFICHAGE DES CARTES ---
function afficherCartes(astuces) {
    const grille = document.getElementById('grilleAstuces');
    
    astuces.forEach(astuce => {
        const card = document.createElement('div');
        card.className = 'card-astuce';
        card.id = 'card-' + astuce.id;
        
        let codeHTML = "";
        if (astuce.code && astuce.code.trim() !== "") {
            const langClass = `language-${astuce.langage.toLowerCase()}`;
            codeHTML = `
            <div class="code-wrapper">
                <div class="code-header">
                    <span class="code-lang">${astuce.langage}</span>
                    <button class="btn-copy" onclick="copierCode(this, \`${astuce.code.replace(/`/g, '\\`')}\`)">
                        <i class="fa-regular fa-copy"></i> Copier
                    </button>
                </div>
                <div class="code-content">
                    <pre><code class="${langClass}">${escapeHTML(astuce.code)}</code></pre>
                </div>
            </div>`;
        }

        const btnDelete = (currentTab === 'mes' && astuce.owner_token === myToken) ? `
            <button class="social-btn delete-btn" onclick="demanderSuppression(${astuce.id})">
                <i class="fa-solid fa-trash"></i>
            </button>
        ` : "";

        const isLiked = localStorage.getItem('liked_' + astuce.id) ? 'liked' : '';
        const temps = tempsEcoule(astuce.date_creation);

        card.onclick = (e) => {
            if(e.target.closest('button') || e.target.closest('a')) return;
            enregistrerVue(astuce.id);
        };

        card.innerHTML = `
            <div class="card-header">
                <h3>${escapeHTML(astuce.titre)}</h3>
                <span class="tag-langage">${astuce.langage}</span>
            </div>
            <div class="card-content">${escapeHTML(astuce.contenu)}</div>
            ${codeHTML}
            <div class="card-footer">
                <div class="social-actions">
                    <button class="social-btn ${isLiked}" onclick="toggleLike(this, ${astuce.id})">
                        <i class="fa-solid fa-heart"></i> <span class="like-count">${astuce.likes}</span>
                    </button>
                    <div class="social-btn" style="cursor: default;">
                        <i class="fa-solid fa-eye"></i> <span id="vues-${astuce.id}">${astuce.vues}</span>
                    </div>
                    ${btnDelete}
                </div>
                <div class="author-info">
                    <strong>${escapeHTML(astuce.auteur)}</strong>
                    <span class="time-post">${temps}</span>
                </div>
            </div>
        `;
        grille.appendChild(card);
    });

    if(window.Prism) Prism.highlightAll();
}

// --- ETAT VIDE (Mise à jour selon l'onglet) ---
function afficherEtatVide() {
    const grille = document.getElementById('grilleAstuces');
    
    let titre, message, boutonTexte;
    
    if (currentTab === 'mes') {
        titre = "Vous n'avez rien publié !";
        message = "Commencez maintenant et partagez votre première astuce avec la communauté.";
        boutonTexte = "Publier ma première astuce";
    } else {
        titre = "Soyez le premier à publier ici !";
        message = "Aucune astuce n'a encore été partagée sur VirtTech.";
        boutonTexte = "Écrire une astuce";
    }

    grille.innerHTML = `
        <div class="etat-vide">
            <i class="fa-solid fa-lightbulb"></i>
            <h3>${titre}</h3>
            <p>${message}</p>
            <button class="btn-add-astuce" onclick="ouvrirSlideForm()">
                <i class="fa-solid fa-plus" style="margin-right: 8px;"></i> ${boutonTexte}
            </button>
        </div>
    `;
}

// --- VUES ET LIKES ---
async function enregistrerVue(id) {
    if (localStorage.getItem('vue_' + id)) return; 

    try {
        const res = await fetch(`/api/astuces/${id}/vue`, { method: 'POST' });
        const data = await res.json();
        if (data.succes) {
            const vuesSpan = document.querySelector(`#vues-${id}`);
            if(vuesSpan) vuesSpan.innerText = data.vues;
            localStorage.setItem('vue_' + id, 'true'); 
        }
    } catch (error) { console.error(error); }
}

async function toggleLike(btn, id) {
    const isLiked = btn.classList.contains('liked');
    const endpoint = isLiked ? 'unlike' : 'like';
    
    try {
        const res = await fetch(`/api/astuces/${id}/${endpoint}`, { method: 'POST' });
        const data = await res.json();
        if (data.succes) {
            btn.querySelector('.like-count').innerText = data.likes;
            if (isLiked) {
                btn.classList.remove('liked');
                localStorage.removeItem('liked_' + id);
            } else {
                btn.classList.add('liked');
                localStorage.setItem('liked_' + id, 'true');
            }
        }
    } catch (error) { console.error(error); }
}

// --- SUPPRESSION ---
function demanderSuppression(id) {
    idASupprimer = id;
    afficherOverlay(
        "Supprimer l'astuce ?",
        "Cette action est définitive.",
        [
            { texte: "Annuler", class: "btn-ov-annuler", fonction: fermerOverlay },
            { texte: "OK", class: "btn-ov-confirmer", fonction: confirmerSuppression }
        ]
    );
}

async function confirmerSuppression() {
    fermerOverlay();
    try {
        const res = await fetch(`/api/astuces/${idASupprimer}`, { 
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ownerToken: myToken })
        });
        const data = await res.json();
        
        if (data.succes) {
            toutesLesAstuces = toutesLesAstuces.filter(a => a.id !== idASupprimer);
            filtrerEtAfficher();
            afficherOverlay("Supprimée !", "L'astuce a été retirée.", [{ texte: "Fermer", class: "btn-ov-confirmer", fonction: fermerOverlay }]);
        } else {
            afficherOverlay("Erreur", data.message, [{ texte: "Fermer", class: "btn-ov-confirmer", fonction: fermerOverlay }]);
        }
    } catch (error) {
        afficherOverlay("Erreur", "Erreur de connexion.", [{ texte: "Fermer", class: "btn-ov-confirmer", fonction: fermerOverlay }]);
    }
}

// --- FORMULAIRE ET OVERLAY ---
function afficherOverlay(titre, message, actions) {
    document.getElementById('ovTitre').innerText = titre;
    document.getElementById('ovMessage').innerText = message;
    const container = document.getElementById('ovActions');
    container.innerHTML = "";
    
    actions.forEach(action => {
        const btn = document.createElement('button');
        btn.className = `btn-ov ${action.class}`;
        btn.innerText = action.texte;
        btn.onclick = action.fonction;
        container.appendChild(btn);
    });
    document.getElementById('overlayGlobal').classList.add('ouvert');
}

function fermerOverlay() {
    document.getElementById('overlayGlobal').classList.remove('ouvert');
}

function ouvrirSlideForm() {
    document.getElementById('slideOverlay').classList.add('ouvert');
    document.getElementById('slidePanel').classList.add('ouvert');
}

function tenterFermerSlide() {
    const auteur = document.getElementById('inputAuteur').value.trim();
    const titre = document.getElementById('inputTitre').value.trim();
    const contenu = document.getElementById('inputContenu').value.trim();
    const code = editor.getValue().trim();

    if (auteur || titre || contenu || code) {
        afficherOverlay("Annuler la rédaction ?", "Vos modifications seront perdues.", [
            { texte: "Non", class: "btn-ov-annuler", fonction: fermerOverlay },
            { texte: "Oui, quitter", class: "btn-ov-confirmer", fonction: fermerSlideEtOverlay }
        ]);
    } else {
        fermerSlideEtOverlay();
    }
}

function fermerSlideEtOverlay() {
    fermerOverlay();
    document.getElementById('slideOverlay').classList.remove('ouvert');
    document.getElementById('slidePanel').classList.remove('ouvert');
    document.getElementById('inputAuteur').value = "";
    document.getElementById('inputTitre').value = "";
    document.getElementById('inputContenu').value = "";
    editor.setValue("");
}

function tenterPublier() {
    const auteur = document.getElementById('inputAuteur').value.trim();
    const titre = document.getElementById('inputTitre').value.trim();
    const contenu = document.getElementById('inputContenu').value.trim();

    if (!auteur || !titre || !contenu) {
        afficherOverlay("Champs manquants", "Le nom, le titre et le contenu sont obligatoires.", [{ texte: "OK", class: "btn-ov-confirmer", fonction: fermerOverlay }]);
        return;
    }

    afficherOverlay("Publier l'astuce ?", "Voulez-vous vraiment ajouter cette astuce ?", [
        { texte: "Annuler", class: "btn-ov-annuler", fonction: fermerOverlay },
        { texte: "Publier", class: "btn-ov-confirmer", fonction: executerPublication }
    ]);
}

async function executerPublication() {
    const auteur = document.getElementById('inputAuteur').value.trim();
    const titre = document.getElementById('inputTitre').value.trim();
    const contenu = document.getElementById('inputContenu').value.trim();
    const langage = document.getElementById('inputLangage').value;
    const code = editor.getValue().trim();

    try {
        const res = await fetch('/api/astuces', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ auteur, titre, contenu, langage, code, ownerToken: myToken })
        });
        const data = await res.json();
        
        if (data.succes) {
            fermerSlideEtOverlay();
            chargerAstuces();
            afficherOverlay("Publiée !", "Votre astuce a été ajoutée avec succès.", [{ texte: "Super", class: "btn-ov-confirmer", fonction: fermerOverlay }]);
        } else {
            afficherOverlay("Erreur", data.message, [{ texte: "Fermer", class: "btn-ov-confirmer", fonction: fermerOverlay }]);
        }
    } catch (error) {
        afficherOverlay("Erreur", "Erreur de connexion au serveur.", [{ texte: "Fermer", class: "btn-ov-confirmer", fonction: fermerOverlay }]);
    }
}

function changerOnglet(onglet) {
    currentTab = onglet;
    document.getElementById('tabToutes').classList.remove('actif');
    document.getElementById('tabMes').classList.remove('actif');
    
    if (onglet === 'toutes') document.getElementById('tabToutes').classList.add('actif');
    else document.getElementById('tabMes').classList.add('actif');
    
    filtrerEtAfficher();
}

// --- UTILITAIRES ---
function copierCode(btn, code) {
    const realCode = code.replace(/\\`/g, '`').replace(/\\n/g, '\n');
    navigator.clipboard.writeText(realCode).then(() => {
        const original = btn.innerHTML;
        btn.innerHTML = `<i class="fa-solid fa-check"></i> Copié !`;
        setTimeout(() => { btn.innerHTML = original; }, 2000);
    });
}

function tempsEcoule(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "À l'instant";
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours} h`;
    return `Il y a ${diffDays} j`;
}

function escapeHTML(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}