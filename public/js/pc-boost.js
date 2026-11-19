// --- pc-boost.js ---
// Booste le mode PC : diff avant application, console d'erreurs,
// recherche/remplacement, raccourcis, export/import ZIP, formatage, plein écran.

(function () {
    'use strict';

    let editor = null;
    let panneauConsole = null;
    let listeConsole = null;
    let compteurConsole = null;
    let erreurs = [];
    let consoleOuverte = false;

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
    // CONSOLE D'ERREURS
    // =========================================================
    function creerConsole() {
        if (panneauConsole) return;

        panneauConsole = document.createElement('div');
        panneauConsole.className = 'pc-console';

        const tete = document.createElement('div');
        tete.className = 'pc-console-tete';

        const titre = document.createElement('span');
        titre.className = 'pc-console-titre';
        titre.innerHTML = '<i class="fa-solid fa-terminal" aria-hidden="true"></i> Console';

        compteurConsole = document.createElement('span');
        compteurConsole.className = 'pc-console-compteur';
        compteurConsole.textContent = '0';

        const effacer = document.createElement('button');
        effacer.type = 'button';
        effacer.className = 'pc-console-btn';
        effacer.textContent = 'Effacer';
        effacer.addEventListener('click', function (e) {
            e.stopPropagation();
            erreurs = [];
            majConsole();
        });

        const basculer = document.createElement('button');
        basculer.type = 'button';
        basculer.className = 'pc-console-btn';
        basculer.textContent = '▾';

        tete.append(titre, compteurConsole, effacer, basculer);

        listeConsole = document.createElement('div');
        listeConsole.className = 'pc-console-liste';

        tete.addEventListener('click', function () {
            consoleOuverte = !consoleOuverte;
            panneauConsole.classList.toggle('ouvert', consoleOuverte);
            basculer.textContent = consoleOuverte ? '▴' : '▾';
        });

        panneauConsole.append(tete, listeConsole);
        document.body.appendChild(panneauConsole);
    }

    function majConsole() {
        if (!panneauConsole) return;

        compteurConsole.textContent = String(erreurs.length);
        panneauConsole.classList.toggle('a-erreur', erreurs.length > 0);

        listeConsole.innerHTML = '';

        erreurs.slice(-40).forEach(function (e) {
            const ligne = document.createElement('div');
            ligne.className = 'pc-console-ligne ' + e.niveau;
            ligne.textContent = e.texte;
            listeConsole.appendChild(ligne);
        });
    }

    function ajouterErreur(niveau, texte) {
        creerConsole();
        erreurs.push({ niveau: niveau, texte: String(texte).slice(0, 400) });
        if (erreurs.length > 80) erreurs.shift();
        majConsole();
    }

    // Appelé depuis emulateur-pc.js après chaque rendu de l'aperçu
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
                ajouterErreur('error', 'Promesse rejetée : ' + e.reason);
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
        t2.textContent = 'Après';
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
            toast('Projet importé');
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
            return toast('Format non supporté');
        }

        try {
            const resultat = await prettier.format(contenu, { parser: parser, plugins: plugins.filter(Boolean) });
            window.VirtProjet.ecrire(chemin, resultat);
            toast('Fichier formaté');
        } catch (e) {
            toast('Formatage impossible : ' + e.message);
        }
    }

    // =========================================================
    // PLEIN ÉCRAN
    // =========================================================
    function basculerPleinEcran() {
        const panel = document.getElementById('slidePanel');
        if (!panel) return;
        panel.classList.toggle('pc-plein');
    }

    // =========================================================
    // DÉMARRAGE
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

            creerConsole();
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

                actions.insertBefore(format, actions.firstChild);
                actions.insertBefore(importer, actions.firstChild);
                actions.insertBefore(zip, actions.firstChild);
            }

            const enteteSlide = document.querySelector('.slide-header .header-actions');
            if (enteteSlide) {
                const plein = bouton('fa-expand', 'Plein écran', basculerPleinEcran);
                enteteSlide.insertBefore(plein, enteteSlide.firstChild);
            }
        }, 250);
    }

    window.PcBoost = {
        proposer: proposer,
        hookConsole: hookConsole,
        exporterZip: exporterZip,
        formater: formater
    };

    document.addEventListener('DOMContentLoaded', demarrer);
})();
