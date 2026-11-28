// --- pc-boost.js ---
// Booste le mode PC : diff avant application, console d'erreurs,
// recherche/remplacement, raccourcis, export/import ZIP, formatage, plein Ã©cran.

(function () {
    'use strict';

    let editor = null;
    let erreurs = [];

    function toast(message) {
        if (typeof window.virtToast === 'function') window.virtToast(message);
        else console.log('[PC]', message);
    }

    function bouton(icone, titre, action) {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'btn-header-action';
        b.title = titre;
        b.setAttribute('aria-label', titre);
        b.innerHTML = '<i class="fa-solid ' + icone + '" aria-hidden="true"></i>';
        b.addEventListener('click', action);
        return b;
    }

    // =========================================================
    // CONSOLE D'ERREURS (slide)
    // =========================================================
    let listeConsole = null;
    let compteurConsole = null;
    let panneauConsole = null;

    function initConsole() {
        panneauConsole = document.getElementById('consolePanel');
        listeConsole = document.getElementById('consoleListe');
        compteurConsole = document.getElementById('consoleCompteur');

        const bouton = document.getElementById('btnConsole');
        const fermer = document.getElementById('consoleFermer');
        const effacer = document.getElementById('consoleEffacer');

        if (bouton) bouton.addEventListener('click', ouvrirConsole);
        if (fermer) fermer.addEventListener('click', fermerConsole);
        if (effacer) {
            effacer.addEventListener('click', function () {
                erreurs = [];
                majConsole();
            });
        }

        majConsole();
    }

    function ouvrirConsole() {
        if (typeof window.VirtFermerAutres === 'function') window.VirtFermerAutres('console');

        if (panneauConsole) panneauConsole.classList.add('ouvert');
        if (typeof window.MajClassePanneau === 'function') window.MajClassePanneau();

        majConsole();
    }

    function fermerConsole() {
        if (panneauConsole) panneauConsole.classList.remove('ouvert');
        if (typeof window.MajClassePanneau === 'function') window.MajClassePanneau();
    }

    function majConsole() {
        if (!listeConsole) return;

        if (compteurConsole) {
            compteurConsole.textContent = String(erreurs.length);
            compteurConsole.classList.toggle('a-erreur', erreurs.length > 0);
        }

        listeConsole.innerHTML = '';

        if (erreurs.length === 0) {
            const vide = document.createElement('p');
            vide.className = 'console-vide';
            vide.textContent = "Aucune erreur pour le moment. Les erreurs de l'aperÃ§u apparaÃ®tront ici.";
            listeConsole.appendChild(vide);
            return;
        }

        erreurs.slice(-80).forEach(function (e) {
            const ligne = document.createElement('div');
            ligne.className = 'console-ligne ' + e.niveau;
            ligne.textContent = e.texte;
            listeConsole.appendChild(ligne);
        });
    }

    function ajouterErreur(niveau, texte) {
        erreurs.push({ niveau: niveau, texte: String(texte).slice(0, 400) });
        if (erreurs.length > 80) erreurs.shift();
        majConsole();
    }

    function hookConsole(iframe) {
        if (!iframe || !iframe.contentWindow) return;

        const win = iframe.contentWindow;
        if (win.__pcHook) return;
        win.__pcHook = true;

        try {
            const err = win.console.error;
            win.console.error = function () {
                ajouterErreur('error', Array.from(arguments).join(' '));
                if (err) err.apply(win.console, arguments);
            };

            const warn = win.console.warn;
            win.console.warn = function () {
                ajouterErreur('warn', Array.from(arguments).join(' '));
                if (warn) warn.apply(win.console, arguments);
            };

            win.addEventListener('error', function (e) {
                ajouterErreur('error', e.message + ' (ligne ' + e.lineno + ')');
            });

            win.addEventListener('unhandledrejection', function (e) {
                ajouterErreur('error', 'Promesse rejetÃ©e : ' + e.reason);
            });
        } catch (e) { /* iframe inaccessible */ }
    }

    // =========================================================
    // DIFF AVANT APPLICATION
    // =========================================================
    function proposer(chemin, contenu, appliquer) {
        const fichiers = window.VirtProjet ? window.VirtProjet.fichiers() : null;
        const ancien = fichiers ? fichiers[chemin] : undefined;

        if (ancien === undefined || ancien === contenu) {
            appliquer();
            return;
        }

        const overlay = document.createElement('div');
        overlay.className = 'pc-diff';

        const boite = document.createElement('div');
        boite.className = 'pc-diff-boite';

        const titre = document.createElement('h3');
        titre.textContent = 'Appliquer les modifications ?';

        const cheminEl = document.createElement('code');
        cheminEl.className = 'pc-diff-chemin';
        cheminEl.textContent = chemin;

        const cols = document.createElement('div');
        cols.className = 'pc-diff-cols';

        const blocAvant = document.createElement('div');
        const t1 = document.createElement('h4');
        t1.textContent = 'Avant';
        const preAvant = document.createElement('pre');
        preAvant.textContent = ancien;
        blocAvant.append(t1, preAvant);

        const blocApres = document.createElement('div');
        const t2 = document.createElement('h4');
        t2.textContent = 'AprÃ¨s';
        const preApres = document.createElement('pre');
        preApres.textContent = contenu;
        blocApres.append(t2, preApres);

        cols.append(blocAvant, blocApres);

        const actions = document.createElement('div');
        actions.className = 'pc-diff-actions';

        const annuler = document.createElement('button');
        annuler.type = 'button';
        annuler.className = 'pc-diff-annuler';
        annuler.textContent = 'Annuler';

        const ok = document.createElement('button');
        ok.type = 'button';
        ok.className = 'pc-diff-ok';
        ok.textContent = 'Appliquer';

        actions.append(annuler, ok);

        boite.append(titre, cheminEl, cols, actions);
        overlay.appendChild(boite);
        document.body.appendChild(overlay);

        function fermer() { overlay.remove(); }

        annuler.addEventListener('click', fermer);
        overlay.addEventListener('click', function (e) { if (e.target === overlay) fermer(); });
        ok.addEventListener('click', function () { fermer(); appliquer(); });
    }

    // =========================================================
    // RECHERCHE / RACCOURCIS
    // =========================================================
    function brancherRaccourcis() {
        if (!editor) return;

        try {
            editor.addKeyMap({
                'Ctrl-F': 'find',
                'Cmd-F': 'find',
                'Ctrl-H': 'replace',
                'Cmd-H': 'replace',
                'Ctrl-S': function () { if (window.VirtSauver) window.VirtSauver(); }
            });
        } catch (e) { /* commandes indisponibles */ }

        document.addEventListener('keydown', function (e) {
            if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
                e.preventDefault();
                if (window.VirtSauver) window.VirtSauver();
            }
        });
    }

    // =========================================================
    // ZIP
    // =========================================================
    async function exporterZip() {
        if (!window.JSZip || !window.VirtProjet) return toast('Export ZIP indisponible');

        const fichiers = window.VirtProjet.fichiers();
        const zip = new JSZip();

        Object.keys(fichiers).forEach(function (c) {
            if (!window.VirtProjet.estMedia(c)) zip.file(c, fichiers[c]);
        });

        const blob = await zip.generateAsync({ type: 'blob' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'virtemulator-projet.zip';
        a.click();
        URL.revokeObjectURL(a.href);
    }

    async function importerZip(fichier) {
        if (!window.JSZip || !window.VirtProjet) return toast('Import ZIP indisponible');

        try {
            const zip = await JSZip.loadAsync(fichier);
            const textes = {};
            const noms = Object.keys(zip.files);

            for (let i = 0; i < noms.length; i++) {
                const nom = noms[i];
                if (zip.files[nom].dir) continue;
                if (/\.(png|jpe?g|gif|webp|mp4|webm|ogg)$/i.test(nom)) continue;
                textes[nom] = await zip.files[nom].async('string');
            }

            window.VirtProjet.importer(textes);
            toast('Projet importÃ©');
        } catch (e) {
            toast('Import impossible');
        }
    }

    // =========================================================
    // FORMATAGE
    // =========================================================
    async function formater() {
        if (!window.prettier || !window.VirtProjet) return toast('Formateur indisponible');

        const chemin = window.VirtProjet.actif();
        const contenu = window.VirtProjet.fichiers()[chemin];

        if (typeof contenu !== 'string') return;

        let parser = null;
        let plugins = [];
        const P = window.prettierPlugins || {};

        if (/\.html?$/i.test(chemin)) {
            parser = 'html';
            plugins = [P.html, P.babel, P.estree];
        } else if (/\.css$/i.test(chemin)) {
            parser = 'css';
            plugins = [P.postcss];
        } else if (/\.m?js$/i.test(chemin)) {
            parser = 'babel';
            plugins = [P.babel];
        } else if (/\.json$/i.test(chemin)) {
            parser = 'json';
            plugins = [P.estree, P.babel];
        } else {
            return toast('Format non supportÃ©');
        }

        try {
            const resultat = await prettier.format(contenu, { parser: parser, plugins: plugins.filter(Boolean) });
            window.VirtProjet.ecrire(chemin, resultat);
            toast('Fichier formatÃ©');
        } catch (e) {
            toast('Formatage impossible : ' + e.message);
        }
    }

    // =========================================================
    // ENREGISTREUR D'Ã‰CRAN
    // =========================================================
    let enregistreur = null;
    let fluxEcran = null;
    let fluxMicro = null;
    let morceaux = [];
    let chrono = null;
    let secondes = 0;
    let boutonRec = null;
    let boutonPause = null;

    function formatChrono(s) {
        const m = Math.floor(s / 60);
        const r = s % 60;
        return (m < 10 ? '0' + m : m) + ':' + (r < 10 ? '0' + r : r);
    }

    function demarrerChrono() {
        clearInterval(chrono);
        chrono = setInterval(function () {
            secondes++;
            majBoutonRec(true);
        }, 1000);
    }

    function majBoutonRec(actif) {        if (!boutonRec) return;

        boutonRec.classList.toggle('rec-actif', actif);
        boutonRec.innerHTML = actif
            ? '<i class="fa-solid fa-stop" aria-hidden="true"></i> ArrÃªter ' + formatChrono(secondes)
            : '<i class="fa-solid fa-circle-dot" aria-hidden="true"></i> Enregistrer';

        if (boutonPause) boutonPause.hidden = !actif;
    }

    async function demarrerEnregistrement() {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
            return toast("L'enregistrement d'Ã©cran n'est pas disponible sur ce navigateur.");
        }

        if (!window.MediaRecorder) {
            return toast("L'enregistrement vidÃ©o n'est pas disponible sur ce navigateur.");
        }

        try {
            fluxEcran = await navigator.mediaDevices.getDisplayMedia({
                video: { frameRate: 30 },
                audio: true
            });
        } catch (e) {
            return; // l'utilisateur a annulÃ©
        }

        try {
            fluxMicro = await navigator.mediaDevices.getUserMedia({ audio: true });
        } catch (e) {
            fluxMicro = null; // pas de micro : on enregistre sans micro
        }

        const pistes = fluxEcran.getVideoTracks().slice();
        pistes.push.apply(pistes, fluxEcran.getAudioTracks());
        if (fluxMicro) pistes.push.apply(pistes, fluxMicro.getAudioTracks());

        const flux = new MediaStream(pistes);
        const avecAudio = pistes.some(function (p) { return p.kind === 'audio'; });

        const candidats = avecAudio
            ? ['video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm']
            : ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm'];

        let type = 'video/webm';
        for (let i = 0; i < candidats.length; i++) {
            if (window.MediaRecorder && MediaRecorder.isTypeSupported(candidats[i])) {
                type = candidats[i];
                break;
            }
        }

        morceaux = [];
        enregistreur = new MediaRecorder(flux, { mimeType: type });

        enregistreur.ondataavailable = function (e) {
            if (e.data && e.data.size > 0) morceaux.push(e.data);
        };

        enregistreur.onstop = function () {
            const blob = new Blob(morceaux, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);

            const d = new Date();
            const nom = 'virtemulator-' + d.getFullYear() + '-' +
                String(d.getMonth() + 1).padStart(2, '0') + '-' +
                String(d.getDate()).padStart(2, '0') + '-' +
                String(d.getHours()).padStart(2, '0') +
                String(d.getMinutes()).padStart(2, '0') + '.webm';

            const a = document.createElement('a');
            a.href = url;
            a.download = nom;
            a.click();
            URL.revokeObjectURL(url);

            nettoyerEnregistrement();
            toast('VidÃ©o enregistrÃ©e : ' + nom);
        };

        const piste = fluxEcran.getVideoTracks()[0];
        if (piste) piste.addEventListener('ended', arreterEnregistrement);

        enregistreur.start(1000);

        secondes = 0;
        majBoutonRec(true);
        demarrerChrono();
    }

    function arreterEnregistrement() {
        if (enregistreur && enregistreur.state !== 'inactive') {
            enregistreur.stop();
        } else {
            nettoyerEnregistrement();
        }
    }

    function nettoyerEnregistrement() {
        clearInterval(chrono);
        chrono = null;
        secondes = 0;

        if (fluxEcran) fluxEcran.getTracks().forEach(function (t) { t.stop(); });
        if (fluxMicro) fluxMicro.getTracks().forEach(function (t) { t.stop(); });

        fluxEcran = null;
        fluxMicro = null;
        enregistreur = null;

        majBoutonRec(false);
    }

    function basculerPause() {
        if (!enregistreur) return;

        if (enregistreur.state === 'recording') {
            enregistreur.pause();
            clearInterval(chrono);
            chrono = null;
            boutonPause.innerHTML = '<i class="fa-solid fa-play" aria-hidden="true"></i>';
        } else if (enregistreur.state === 'paused') {
            enregistreur.resume();
            demarrerChrono();
            boutonPause.innerHTML = '<i class="fa-solid fa-pause" aria-hidden="true"></i>';
        }
    }

    // =========================================================
    // PLEIN Ã‰CRAN
    // =========================================================
    function basculerPleinEcran() {
        const panel = document.getElementById('slidePanel');
        if (!panel) return;
        panel.classList.toggle('pc-plein');
    }

    // =========================================================
    // DÃ‰MARRAGE
    // =========================================================
    function demarrer() {
        let essais = 0;

        const timer = setInterval(function () {
            essais++;

            if (!editor) {
                if (window.VirtEditor) editor = window.VirtEditor;
                else {
                    const cm = document.querySelector('.CodeMirror');
                    if (cm && cm.CodeMirror) editor = cm.CodeMirror;
                }
            }

            if (!editor || !window.VirtProjet) {
                if (essais > 40) clearInterval(timer);
                return;
            }

            clearInterval(timer);

            initConsole();
            brancherRaccourcis();

            const actions = document.querySelector('.editor-actions');

            if (actions) {
                const zip = bouton('fa-file-zipper', 'Exporter le projet (.zip)', exporterZip);
                const importer = bouton('fa-file-arrow-up', 'Importer un projet (.zip)', function () {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = '.zip';
                    input.addEventListener('change', function () {
                        if (input.files && input.files[0]) importerZip(input.files[0]);
                    });
                    input.click();
                });
                const format = bouton('fa-wand-magic-sparkles', 'Formater le fichier', formater);

                const rec = document.createElement('button');
                rec.type = 'button';
                rec.className = 'btn-header-action';
                rec.title = "Enregistrer l'Ã©cran";
                rec.setAttribute('aria-label', "Enregistrer l'Ã©cran");
                rec.innerHTML = '<i class="fa-solid fa-circle-dot" aria-hidden="true"></i> Enregistrer';
                rec.addEventListener('click', function () {
                    if (enregistreur) arreterEnregistrement();
                    else demarrerEnregistrement();
                });
                boutonRec = rec;

                const pause = document.createElement('button');
                pause.type = 'button';
                pause.className = 'btn-header-action';
                pause.title = 'Pause';
                pause.setAttribute('aria-label', 'Mettre en pause');
                pause.innerHTML = '<i class="fa-solid fa-pause" aria-hidden="true"></i>';
                pause.hidden = true;
                pause.addEventListener('click', basculerPause);
                boutonPause = pause;

                actions.insertBefore(format, actions.firstChild);
                actions.insertBefore(importer, actions.firstChild);
                actions.insertBefore(zip, actions.firstChild);
                actions.insertBefore(pause, actions.firstChild);
                actions.insertBefore(rec, actions.firstChild);
            }

            const enteteSlide = document.querySelector('.slide-header .header-actions');
            if (enteteSlide) {
                const plein = bouton('fa-expand', 'Plein Ã©cran', basculerPleinEcran);
                enteteSlide.insertBefore(plein, enteteSlide.firstChild);
            }
        }, 250);
    }

    window.VirtConsoleOuvrir = ouvrirConsole;
    window.VirtConsoleFermer = fermerConsole;

    window.PcBoost = {
        proposer: proposer,
        hookConsole: hookConsole,
        exporterZip: exporterZip,
        formater: formater
    };

    document.addEventListener('DOMContentLoaded', demarrer);
})();
