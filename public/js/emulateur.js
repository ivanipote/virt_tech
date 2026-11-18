// --- emulateur.js ---
// Cœur de VirtEmulator MOBILE : CodeMirror, fichiers, slide, téléphones,
// navigation, paramètres, horloge, chrono, save/export.
//
// + DÉTECTION PC : affiche un overlay "Mauvaise version détectée"
// + Détecte si l'utilisateur est sur PC (>= 900px) et bloque l'accès mobile.

document.addEventListener("DOMContentLoaded", function() {
    'use strict';

    // ==========================================
    // DÉTECTION PC — OVERLAY
    // ==========================================
    const estPC = window.matchMedia('(min-width: 900px)').matches;

    if (estPC) {
        afficherOverlayPC();
    }

    function afficherOverlayPC() {
        // Éviter les doublons
        if (document.getElementById('pcOverlay')) return;

        // Cacher le contenu mobile
        const mainLayout = document.querySelector('.main-layout');
        if (mainLayout) mainLayout.style.display = 'none';

        const btnPlay = document.getElementById('btnPlay');
        if (btnPlay) btnPlay.style.display = 'none';

        const slidePanel = document.getElementById('slidePanel');
        if (slidePanel) slidePanel.style.display = 'none';

        const slideOverlay = document.getElementById('slideOverlay');
        if (slideOverlay) slideOverlay.style.display = 'none';

        // Bloquer le scroll
        document.body.style.overflow = 'hidden';

        // Créer l'overlay
        const overlay = document.createElement('div');
        overlay.id = 'pcOverlay';
        overlay.className = 'pc-overlay';
        overlay.innerHTML = `
            <div class="pc-modal">
                <div class="pc-icon">
                    <i class="fa-solid fa-desktop"></i>
                </div>
                <div class="pc-content">
                    <h3>Mauvaise version détectée</h3>
                    <p>Tu utilises VirtEmulator Mobile sur PC. Pour une meilleure expérience, utilise la version PC.</p>
                    <a href="/virtemulator-pc" class="pc-btn">
                        <i class="fa-solid fa-arrow-right"></i>
                        Aller sur VirtEmulator PC
                    </a>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
    }

    // ==========================================
    // ÉTAT GLOBAL
    // ==========================================
    let files = {};
    let dossiers = [];                  // dossiers vides (chemins)
    const dossiersFermes = new Set();   // dossiers repliés dans le slide
    let activeFile = "index.html";
    let editor;
    let zoomLevel = 1;
    let debounceTimer;
    let modeNuit = false;
    let modeleActif = 'samsung';
    let chromeMasque = false;
    let pageActive = 'launcher';
    let historique = ["index.html"];
    let indexHistorique = 0;
    let chronoEnCours = false;
    let chronoStartTime = 0;
    let chronoElapsed = 0;
    let chronoInterval = null;

    // ==========================================
    // ÉLÉMENTS DOM
    // ==========================================
    const slideOverlay = document.getElementById('slideOverlay');
    const slidePanel = document.getElementById('slidePanel');
    const btnFermerSlide = document.getElementById('btnFermerSlide');
    const btnAccueilHeader = document.getElementById('btnAccueil');
    const btnZoomIn = document.getElementById('btnZoomIn');
    const btnZoomOut = document.getElementById('btnZoomOut');
    const btnToggleChrome = document.getElementById('btnToggleChrome');
    const iconToggleChrome = document.getElementById('iconToggleChrome');
    const phoneSamsung = document.getElementById('phoneSamsung');
    const phoneIphone = document.getElementById('phoneIphone');

    // ==========================================
    // CODE DE BIENVENUE
    // ==========================================
    const CODE_BIENVENUE = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>VirtEmulator</title>
  <style>
    body { margin: 0; height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; background: #1a1a1a; color: white; font-family: 'Segoe UI', sans-serif; text-align: center; padding: 20px; }
    img { width: 120px; height: 120px; margin-bottom: 20px; border-radius: 20px; box-shadow: 0 10px 20px rgba(0,0,0,0.5); }
    h1 { color: #D4AF37; font-size: 1.5rem; margin-bottom: 10px; }
    p { color: #aaa; font-size: 0.9rem; line-height: 1.5; max-width: 250px; }
    .badge { margin-top: 20px; padding: 5px 15px; border: 1px solid #444; border-radius: 20px; font-size: 0.8rem; color: #888; }
  </style>
</head>
<body>
  <img src="https://virttech.site/virtemulator-logo.png" alt="Logo VirtEmulator">
  <h1>Bienvenue sur VirtEmulator</h1>
  <p>Commence à écrire ton code dans l'éditeur.</p>
  <div class="badge">VirtTech - Apprends, crée, partage</div>
</body>
</html>`;

    // ==========================================
    // UTILITAIRES
    // ==========================================
    function normaliserNom(nom) {
        if (!nom) return "";
        nom = nom.replace(' (introuvable)', '').trim();
        return nom.indexOf('.') === -1 ? nom + '.html' : nom;
    }

    function getPrefix() {
        return modeleActif === 'iphone' ? 'iphone' : 'samsung';
    }

    function getEl(suffixe) {
        return document.getElementById(getPrefix() + '-' + suffixe);
    }

    function sauvegarder() {
        try {
            localStorage.setItem('virtemulator_files', JSON.stringify(files));
            localStorage.setItem('virtemulator_dossiers', JSON.stringify(dossiers));
        } catch (e) {
            console.error('Erreur sauvegarde:', e);
        }
    }

    function toast(message, duree) {
        if (window.virtToast) {
            window.virtToast(message, duree);
        } else {
            console.log('[Toast]', message);
        }
    }

    // ==========================================
    // INITIALISATION
    // ==========================================
    function init() {
        // Si on est sur PC, on ne charge rien (l'overlay est déjà affiché)
        if (estPC) {
            return;
        }

        // 1. Charger les fichiers sauvegardés
        const savedFiles = localStorage.getItem('virtemulator_files');
        if (savedFiles) {
            try {
                files = JSON.parse(savedFiles) || {};
            } catch (e) {
                files = {};
            }
        }

        const savedDossiers = localStorage.getItem('virtemulator_dossiers');
        if (savedDossiers) {
            try {
                dossiers = JSON.parse(savedDossiers) || [];
            } catch (e) {
                dossiers = [];
            }
        }

        if (files["index.html"] === undefined) {
            files["index.html"] = "";
        }

        // 2. Restaurer le modèle choisi
        const savedModele = localStorage.getItem('virtemulator_modele');
        if (savedModele === 'iphone' || savedModele === 'samsung') {
            modeleActif = savedModele;
        }

        // 3. INIT CODEMIRROR
        const codeInput = document.getElementById('codeInput');
        const editorBody = document.getElementById('editorBody');
        if (!codeInput || !editorBody) {
            console.error('CodeMirror : éléments DOM manquants');
            return;
        }

        editor = CodeMirror.fromTextArea(codeInput, {
            mode: "htmlmixed",
            theme: "dracula",
            lineNumbers: true,
            lineWrapping: false,
            indentUnit: 2,
            tabSize: 2,
            viewportMargin: Infinity,
            autoCloseBrackets: true,
            autoCloseTags: true,
            matchBrackets: true,
            extraKeys: {
                "Ctrl-Space": "autocomplete",
                "Ctrl-/": "toggleComment"
            }
        });
        editorBody.appendChild(editor.getWrapperElement());

        // 4. Donner l'instance à toolsemulator.js
        if (window.setEditorInstance) {
            window.setEditorInstance(editor);
        }

        // 5. Brancher le callback projets
        if (window.setOnProjetClick) {
            window.setOnProjetClick(gererCreationProjet);
        }

        // 6. Charger le premier fichier
        activeFile = Object.keys(files)[0] || "index.html";
        editor.setOption('mode', modeDe(activeFile));
        editor.setValue(files[activeFile] !== undefined ? files[activeFile] : "");

        // 7. Mise à jour UI
        mettreAJourOnglets();
        mettreAJourHorloge();
        appliquerModele();
        genererUserApps();
        brancherEvenements();

        // 8. Horloge en temps réel
        setInterval(mettreAJourHorloge, 1000);

        // 9. Écoute des modifications
        editor.on('change', function() {
            files[activeFile] = editor.getValue();
            sauvegarder();
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(function() {
                rafraichirNavigateurSiOuvert();
            }, 500);
        });

        // 10. Restaurer nom téléphone
        const savedName = localStorage.getItem('virttech_device_name');
        if (savedName) {
            ['samsung', 'iphone'].forEach(function(prefix) {
                const input = document.getElementById(prefix + '-deviceNameInput');
                if (input) input.value = savedName;
            });
        }

        // 11. Restaurer mode nuit
        if (localStorage.getItem('virttech_dark_mode') === 'true') {
            modeNuit = false;
            basculerTheme();
        }

        // 12. Restaurer zoom
        const savedZoom = localStorage.getItem('virtemulator_zoom');
        if (savedZoom) zoomLevel = parseFloat(savedZoom);
        appliquerZoom();
    }

    // ==========================================
    // GESTION DES PROJETS
    // ==========================================
    function gererCreationProjet(projKey, contenuProjet) {
        const nomFichier = 'projet-' + projKey + '.html';

        if (files[nomFichier]) {
            ouvrirFichier(nomFichier);
            toast('📂 Projet ouvert');
            return;
        }

        files[nomFichier] = contenuProjet;
        sauvegarder();
        ouvrirFichier(nomFichier);
        genererUserApps();
        toast('✅ Projet "' + projKey + '" créé !');
    }

    // ==========================================
    // BRANCHEMENT DES ÉVÉNEMENTS
    // ==========================================
    function brancherEvenements() {
        // --- Play (ouvre le slide) ---
        const btnPlay = document.getElementById('btnPlay');
        if (btnPlay) btnPlay.onclick = ouvrirSlide;

        // --- Fermer slide ---
        if (btnFermerSlide) btnFermerSlide.onclick = fermerSlide;
        if (slideOverlay) slideOverlay.onclick = fermerSlide;

        // --- Zoom ---
        if (btnZoomIn) {
            btnZoomIn.onclick = function() {
                if (zoomLevel < 1.5) {
                    zoomLevel = Math.min(1.5, zoomLevel + 0.1);
                    appliquerZoom();
                    localStorage.setItem('virtemulator_zoom', zoomLevel);
                }
            };
        }
        if (btnZoomOut) {
            btnZoomOut.onclick = function() {
                if (zoomLevel > 0.5) {
                    zoomLevel = Math.max(0.5, zoomLevel - 0.1);
                    appliquerZoom();
                    localStorage.setItem('virtemulator_zoom', zoomLevel);
                }
            };
        }

        // --- Accueil header ---
        if (btnAccueilHeader) {
            btnAccueilHeader.onclick = function() {
                afficherPage('launcher');
            };
        }

        // --- Dossier (remplace l'onglet « + ») ---
        const btnFolder = document.getElementById('btnFolder');
        if (btnFolder) btnFolder.onclick = ouvrirDossier;

        const fldFermer = document.getElementById('fldFermer');
        if (fldFermer) fldFermer.onclick = fermerDossier;

        const fldOverlay = document.getElementById('fldOverlay');
        if (fldOverlay) fldOverlay.onclick = fermerDossier;

        const fldOuvrir = document.getElementById('fldOuvrir');
        if (fldOuvrir) {
            fldOuvrir.onclick = function () {
                if (fldSelection) ouvrirDepuisDossier(fldSelection);
            };
        }

        const fldAnnuler = document.getElementById('fldAnnuler');
        if (fldAnnuler) fldAnnuler.onclick = fermerModalFichier;

        const fldValider = document.getElementById('fldValider');
        if (fldValider) fldValider.onclick = validerModalFichier;

        const fldModal = document.getElementById('fldModal');
        if (fldModal) {
            fldModal.onclick = function (e) { if (e.target === fldModal) fermerModalFichier(); };
        }

        const fldNom = document.getElementById('fldNom');
        if (fldNom) {
            fldNom.addEventListener('keydown', function (e) {
                if (e.key === 'Enter') validerModalFichier();
            });
        }

        document.addEventListener('keydown', function (e) {
            if (e.key !== 'Escape') return;

            const modal = document.getElementById('fldModal');
            if (modal && !modal.hidden) { fermerModalFichier(); return; }

            const dossierPanel = document.getElementById('fldPanel');
            if (dossierPanel && dossierPanel.classList.contains('ouvert')) fermerDossier();
        });

        // --- Save & Export ---
        brancherSaveExport();
    }

    // ==========================================
    // ZOOM
    // ==========================================
    function appliquerZoom() {
        if (phoneSamsung) phoneSamsung.style.transform = 'scale(' + zoomLevel + ')';
        if (phoneIphone) phoneIphone.style.transform = 'scale(' + zoomLevel + ')';
    }

    // ==========================================
    // CHANGER DE MODÈLE
    // ==========================================
    window.changerModele = function(modele) {
        if (modele !== 'samsung' && modele !== 'iphone') return;
        modeleActif = modele;
        localStorage.setItem('virtemulator_modele', modele);
        appliquerModele();
        afficherPage('launcher');
        genererUserApps();
        mettreAJourHorloge();
        chromeMasque = false;
        appliquerMasquageChrome();
        if (iconToggleChrome) iconToggleChrome.className = 'fa-solid fa-eye';
        if (btnToggleChrome) btnToggleChrome.style.display = 'none';
    };

    function appliquerModele() {
        if (!phoneSamsung || !phoneIphone) return;
        const btnSamsung = document.getElementById('btnModelSamsung');
        const btnIphone = document.getElementById('btnModelIphone');

        if (modeleActif === 'iphone') {
            phoneSamsung.style.display = 'none';
            phoneIphone.style.display = 'flex';
            if (btnSamsung) btnSamsung.classList.remove('active');
            if (btnIphone) btnIphone.classList.add('active');
        } else {
            phoneIphone.style.display = 'none';
            phoneSamsung.style.display = 'flex';
            if (btnIphone) btnIphone.classList.remove('active');
            if (btnSamsung) btnSamsung.classList.add('active');
        }
    }

    // ==========================================
    // NAVIGATION INTERNE
    // ==========================================
    window.afficherPage = function(nom) {
        const pages = ['launcher', 'googleHome', 'browser', 'settings', 'clock'];
        pageActive = nom;

        pages.forEach(function(p) {
            const id = getPrefix() + '-' + p + 'Page';
            const el = document.getElementById(id);
            if (!el) return;
            el.className = 'page';
            if (p === (nom === 'google' ? 'googleHome' : nom)) {
                el.classList.add('active');
            } else {
                el.classList.add('behind');
            }
        });

        if (btnToggleChrome) {
            btnToggleChrome.style.display = (nom === 'browser') ? 'flex' : 'none';
        }
        appliquerMasquageChrome();
    };

    // ==========================================
    // GÉNÉRATION DES APPS USER
    // ==========================================
    function genererUserApps() {
        ['samsung', 'iphone'].forEach(function(prefix) {
            const grid = document.getElementById(prefix + '-userAppsGrid');
            if (!grid) return;
            grid.innerHTML = '';
            Object.keys(files).forEach(function(chemin) {
                if (!/\.html?$/i.test(chemin)) return;

                const div = document.createElement('div');
                div.className = 'app-icon';
                div.onclick = function() { ouvrirNavigateur(chemin); };

                const boite = document.createElement('span');
                boite.className = 'icon-box icon-web';
                boite.innerHTML = '<i class="fa-solid fa-code"></i>';

                const label = document.createElement('span');
                label.className = 'app-label';
                label.textContent = chemin.split('/').pop().replace(/\.html?$/i, '');

                div.append(boite, label);
                grid.appendChild(div);
            });
        });
    }

    // ==========================================
    // NAVIGATEUR
    // ==========================================
    window.ouvrirNavigateur = function(page) {
        const nom = normaliserNom(page || 'index');
        historique = [nom];
        indexHistorique = 0;
        afficherPage('browser');
        chargerPage(nom, false);
    };

    window.ouvrirPageActuelle = function() {
        const estPage = /\.html?$/i.test(activeFile);
        if (estPage) { ouvrirNavigateur(activeFile); return; }

        if (files["index.html"] !== undefined) { ouvrirNavigateur("index.html"); return; }

        const premiere = Object.keys(files).find(function (n) { return /\.html?$/i.test(n); });
        if (premiere) ouvrirNavigateur(premiere);
        else toast("Crée une page HTML pour lancer l'aperçu");
    };

    window.fermerEmulateur = function() {
        fermerSlide();
    };

    window.ouvrirModalNouveauFichier = function() {
        fermerSlide();
        setTimeout(function() {
            ouvrirDossier();
            setTimeout(function() { ouvrirModalFichier('fichier', '', null); }, 350);
        }, 300);
    };

    window.homeSearchEnter = function(e) {
        if (e.key === 'Enter') {
            const input = getEl('homeSearchInput');
            if (!input) return;
            const val = input.value.trim();
            if (!val) return;
            const nom = normaliserNom(val);
            ouvrirNavigateur(nom);
            input.value = '';
        }
    };

    function chargerPage(nom, ajouterHistorique) {
        if (ajouterHistorique === undefined) ajouterHistorique = true;

        const iframe = getEl('browserIframe');
        const pageContent = getEl('pageContent');
        const page404 = getEl('page404');
        const loadingBar = getEl('loadingBar');
        const urlInput = getEl('urlInput');
        const nomComplet = normaliserNom(nom);

        if (!iframe) return;

        if (ajouterHistorique) {
            historique = historique.slice(0, indexHistorique + 1);
            if (historique[historique.length - 1] !== nomComplet) {
                historique.push(nomComplet);
                indexHistorique = historique.length - 1;
            }
        }

        if (pageContent) pageContent.style.display = 'none';
        if (page404) page404.style.display = 'none';
        iframe.style.display = 'none';
        if (loadingBar) loadingBar.classList.add('active');

        setTimeout(function() {
            if (loadingBar) loadingBar.classList.remove('active');
            if (files[nomComplet] !== undefined && /\.html?$/i.test(nomComplet)) {
                iframe.style.display = 'block';
                const doc = iframe.contentDocument || iframe.contentWindow.document;
                doc.open();
                doc.write(construirePage(nomComplet));
                doc.close();
                if (urlInput) urlInput.value = nomComplet;
            } else {
                if (page404) page404.style.display = 'flex';
                if (urlInput) urlInput.value = nomComplet + " (introuvable)";
            }
            mettreAJourBoutonsNavigation();
        }, 500);
    }

    function rafraichirNavigateurSiOuvert() {
        if (pageActive === 'browser' && indexHistorique >= 0) {
            const nomActuel = historique[indexHistorique];
            if (nomActuel && files[nomActuel] !== undefined) {
                const iframe = getEl('browserIframe');
                if (iframe && iframe.style.display !== 'none') {
                    const doc = iframe.contentDocument || iframe.contentWindow.document;
                    doc.open();
                    doc.write(construirePage(nomActuel));
                    doc.close();
                }
            }
        }
    }

    window.handleEnter = function(e) {
        if (e.key === 'Enter') {
            const input = getEl('urlInput');
            if (!input) return;
            let nom = input.value.trim();
            if (!nom) return;
            nom = normaliserNom(nom);
            chargerPage(nom, true);
        }
    };

    window.retourArriere = function() {
        if (indexHistorique > 0) {
            indexHistorique--;
            chargerPage(historique[indexHistorique], false);
        }
    };

    window.allerAvant = function() {
        if (indexHistorique < historique.length - 1) {
            indexHistorique++;
            chargerPage(historique[indexHistorique], false);
        }
    };

    window.rechargerPage = function() {
        if (indexHistorique >= 0) chargerPage(historique[indexHistorique], false);
    };

    function mettreAJourBoutonsNavigation() {
        const btnBack = getEl('btnBack');
        const btnForward = getEl('btnForward');
        if (btnBack) btnBack.classList.toggle('desactive', indexHistorique <= 0);
        if (btnForward) btnForward.classList.toggle('desactive', indexHistorique >= historique.length - 1);
    }

    // ==========================================
    // TOGGLE CHROME BAR
    // ==========================================
    window.toggleChromeBar = function() {
        chromeMasque = !chromeMasque;
        appliquerMasquageChrome();
        if (iconToggleChrome) {
            iconToggleChrome.className = chromeMasque ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye';
        }
        if (btnToggleChrome) {
            btnToggleChrome.title = chromeMasque ? 'Afficher la barre' : 'Masquer la barre';
        }
    };

    function appliquerMasquageChrome() {
        ['samsung', 'iphone'].forEach(function(prefix) {
            const bar = document.getElementById(prefix + '-chromeBar');
            if (bar) bar.classList.toggle('hidden', chromeMasque);
        });
    }

    // ==========================================
    // EXTENSIONS, APERÇU, FUSION DES FICHIERS
    // ==========================================
    function modeDe(chemin) {
        const ext = String(chemin).split('.').pop().toLowerCase();
        if (ext === 'html' || ext === 'htm') return 'htmlmixed';
        if (ext === 'css') return 'css';
        if (ext === 'js' || ext === 'mjs') return 'javascript';
        if (ext === 'json') return { name: 'javascript', json: true };
        if (ext === 'md') return 'markdown';
        return null;
    }

    function estImage(chemin) {
        return /\.(png|jpe?g|gif|webp|svg)$/i.test(chemin);
    }

    // Résout un chemin relatif par rapport au dossier du fichier
    function resoudreChemin(base, href) {
        if (!href || /^(https?:|data:|blob:|mailto:|tel:|#)/i.test(href)) return null;

        const cible = href.split('?')[0].split('#')[0];
        if (!cible) return null;
        if (cible.charAt(0) === '/') return cible.slice(1);

        const parties = (base ? base.split('/') : []).concat(cible.split('/'));
        const sortie = [];

        parties.forEach(function (p) {
            if (!p || p === '.') return;
            if (p === '..') { sortie.pop(); return; }
            sortie.push(p);
        });

        return sortie.join('/');
    }

    // Construit la page : le CSS et le JS liés sont fusionnés dans le HTML
    function construirePage(chemin) {
        let html = files[chemin];
        if (html === undefined) return "";

        const base = chemin.indexOf('/') !== -1 ? chemin.slice(0, chemin.lastIndexOf('/')) : "";

        html = html.replace(/<link\b[^>]*>/gi, function (tag) {
            if (!/rel\s*=\s*["']stylesheet["']/i.test(tag)) return tag;
            const m = tag.match(/href\s*=\s*["']([^"']+)["']/i);
            if (!m) return tag;
            const cible = resoudreChemin(base, m[1]);
            if (!cible || files[cible] === undefined) return tag;
            return '<style>\n' + files[cible] + '\n</style>';
        });

        html = html.replace(/<script\b([^>]*)><\/script>/gi, function (tag, attrs) {
            const m = attrs.match(/src\s*=\s*["']([^"']+)["']/i);
            if (!m) return tag;
            const cible = resoudreChemin(base, m[1]);
            if (!cible || files[cible] === undefined) return tag;
            return '<script>\n' + files[cible] + '\n</script>';
        });

        return html;
    }

    // ==========================================
    // ONGLETS
    // ==========================================
    function mettreAJourOnglets() {
        const header = document.getElementById('editorHeader');
        if (!header) return;
        header.innerHTML = '';

        Object.keys(files).forEach(function (chemin) {
            const tab = document.createElement('div');
            tab.className = 'tab' + (chemin === activeFile ? ' active' : '');
            tab.title = chemin;

            const nom = document.createElement('span');
            nom.className = 'tab-name';
            nom.textContent = chemin.split('/').pop();

            const croix = document.createElement('span');
            croix.className = 'tab-close';
            croix.dataset.file = chemin;
            croix.textContent = '✕';

            tab.append(nom, croix);
            tab.onclick = function (e) {
                if (e.target.classList.contains('tab-close')) {
                    supprimerFichier(e.target.dataset.file);
                } else {
                    ouvrirFichier(chemin);
                }
            };

            header.appendChild(tab);
        });
    }

    function ouvrirFichier(chemin) {
        if (activeFile && files[activeFile] !== undefined) {
            files[activeFile] = editor.getValue();
            sauvegarder();
        }

        activeFile = chemin;
        editor.setOption('mode', modeDe(chemin));
        editor.setValue(files[chemin] !== undefined ? files[chemin] : "");
        mettreAJourOnglets();
        rafraichirNavigateurSiOuvert();
    }

    function supprimerFichier(chemin) {
        if (Object.keys(files).length <= 1) {
            toast("Impossible : dernier fichier");
            return;
        }
        if (chemin === "index.html") {
            toast("index.html protégé");
            return;
        }

        delete files[chemin];
        sauvegarder();

        if (activeFile === chemin) {
            activeFile = Object.keys(files)[0] || "index.html";
            if (files[activeFile] === undefined) files[activeFile] = "";
            editor.setOption('mode', modeDe(activeFile));
            editor.setValue(files[activeFile]);
        }

        mettreAJourOnglets();
        genererUserApps();
    }

    // ==========================================
    // DOSSIER : ARBORESCENCE
    // ==========================================
    function construireArbre() {
        const racine = { type: 'dossier', nom: 'VirtEmulator', chemin: '', enfants: [] };
        const index = new Map();
        index.set('', racine);

        function dossierPour(chemin) {
            if (index.has(chemin)) return index.get(chemin);

            const parties = chemin.split('/');
            let courant = '';
            let noeud = racine;

            parties.forEach(function (p) {
                const suivant = courant ? courant + '/' + p : p;
                let enfant = null;

                noeud.enfants.forEach(function (e) {
                    if (e.type === 'dossier' && e.nom === p) enfant = e;
                });

                if (!enfant) {
                    enfant = { type: 'dossier', nom: p, chemin: suivant, enfants: [] };
                    noeud.enfants.push(enfant);
                }

                index.set(suivant, enfant);
                noeud = enfant;
                courant = suivant;
            });

            return noeud;
        }

        dossiers.forEach(function (d) { if (d) dossierPour(d); });

        Object.keys(files).forEach(function (chemin) {
            const parties = chemin.split('/');
            const nom = parties.pop();
            const parent = dossierPour(parties.join('/'));
            parent.enfants.push({ type: 'fichier', nom: nom, chemin: chemin });
        });

        (function trier(noeud) {
            noeud.enfants.sort(function (a, b) {
                if (a.type !== b.type) return a.type === 'dossier' ? -1 : 1;
                return a.nom.localeCompare(b.nom, 'fr');
            });
            noeud.enfants.forEach(function (e) { if (e.type === 'dossier') trier(e); });
        })(racine);

        return racine;
    }

    let fldSelection = "";
    let fldMode = null;
    let fldParent = null;
    let fldNoeud = null;

    function ouvrirDossier() {
        const overlay = document.getElementById('fldOverlay');
        const panel = document.getElementById('fldPanel');
        if (!overlay || !panel) return;

        rendreDossier();
        overlay.classList.add('ouvert');
        panel.classList.add('ouvert');
        document.body.style.overflow = 'hidden';

        const fermer = document.getElementById('fldFermer');
        if (fermer) fermer.focus();
    }

    function fermerDossier() {
        const overlay = document.getElementById('fldOverlay');
        const panel = document.getElementById('fldPanel');
        if (overlay) overlay.classList.remove('ouvert');
        if (panel) panel.classList.remove('ouvert');
        document.body.style.overflow = '';
    }

    function rendreDossier() {
        const cible = document.getElementById('fldArbre');
        if (!cible) return;

        cible.innerHTML = '';
        cible.appendChild(construireNoeudDossier(construireArbre(), true));
        majSelectionDossier();
    }

    function boutonMini(action, titre, icone) {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'fld-mini' + (action === 'supprimer' ? ' danger' : '');
        b.title = titre;
        b.setAttribute('aria-label', titre);
        b.dataset.action = action;
        b.innerHTML = '<i class="' + icone + '" aria-hidden="true"></i>';
        return b;
    }

    function construireNoeudDossier(noeud, racine) {
        const ouvert = racine || !dossiersFermes.has(noeud.chemin);

        const bloc = document.createElement('div');
        bloc.className = 'fld-noeud' + (racine ? ' fld-racine' : '');
        bloc.setAttribute('role', 'treeitem');
        bloc.setAttribute('aria-expanded', ouvert ? 'true' : 'false');

        const ligne = document.createElement('div');
        ligne.className = 'fld-ligne';

        const chevron = document.createElement('button');
        chevron.type = 'button';
        chevron.className = 'fld-chevron';
        chevron.setAttribute('aria-label', (ouvert ? 'Replier ' : 'Déplier ') + noeud.nom);
        chevron.innerHTML = '<i class="fa-solid fa-chevron-' + (ouvert ? 'down' : 'right') + '" aria-hidden="true"></i>';
        chevron.addEventListener('click', function () {
            if (dossiersFermes.has(noeud.chemin)) dossiersFermes.delete(noeud.chemin);
            else dossiersFermes.add(noeud.chemin);
            rendreDossier();
        });

        const icone = document.createElement('i');
        icone.className = 'fa-solid ' + (ouvert ? 'fa-folder-open' : 'fa-folder') + ' fld-icone dossier';
        icone.setAttribute('aria-hidden', 'true');

        const nom = document.createElement('span');
        nom.className = 'fld-nom' + (racine ? ' fld-nom-racine' : '');
        nom.textContent = noeud.nom;

        const actions = document.createElement('span');
        actions.className = 'fld-actions';

        const bFichier = boutonMini('fichier', 'Nouveau fichier dans ' + noeud.nom, 'fa-solid fa-file-circle-plus');
        const bDossier = boutonMini('dossier', 'Nouveau dossier dans ' + noeud.nom, 'fa-solid fa-folder-plus');

        bFichier.addEventListener('click', function (e) {
            e.stopPropagation();
            ouvrirModalFichier('fichier', noeud.chemin, null);
        });
        bDossier.addEventListener('click', function (e) {
            e.stopPropagation();
            ouvrirModalFichier('dossier', noeud.chemin, null);
        });

        actions.append(bFichier, bDossier);

        if (!racine) {
            const bRenommer = boutonMini('renommer', 'Renommer ' + noeud.nom, 'fa-solid fa-pen');
            const bSupprimer = boutonMini('supprimer', 'Supprimer ' + noeud.nom, 'fa-solid fa-trash');

            bRenommer.addEventListener('click', function (e) {
                e.stopPropagation();
                ouvrirModalFichier('renommer', null, noeud);
            });
            bSupprimer.addEventListener('click', function (e) {
                e.stopPropagation();
                if (!confirm('Supprimer « ' + noeud.nom + ' » et tout son contenu ?')) return;
                supprimerChemin(noeud.chemin, true);
                rendreDossier();
                toast('Supprimé : ' + noeud.nom);
            });

            actions.append(bRenommer, bSupprimer);
        }

        ligne.append(chevron, icone, nom, actions);
        bloc.appendChild(ligne);

        const enfants = document.createElement('div');
        enfants.className = 'fld-enfants';
        enfants.setAttribute('role', 'group');
        if (!ouvert) enfants.hidden = true;

        if (!noeud.enfants.length && ouvert) {
            const vide = document.createElement('div');
            vide.className = 'fld-vide';
            vide.textContent = 'Dossier vide';
            enfants.appendChild(vide);
        }

        noeud.enfants.forEach(function (enfant) {
            enfants.appendChild(enfant.type === 'dossier'
                ? construireNoeudDossier(enfant, false)
                : construireNoeudFichier(enfant));
        });

        bloc.appendChild(enfants);
        return bloc;
    }

    function construireNoeudFichier(noeud) {
        const ext = noeud.nom.split('.').pop().toLowerCase();
        let classe = 'fa-solid fa-file';
        let teinte = 'texte';

        if (ext === 'html' || ext === 'htm') { classe = 'fa-brands fa-html5'; teinte = 'html'; }
        else if (ext === 'css') { classe = 'fa-brands fa-css3-alt'; teinte = 'css'; }
        else if (ext === 'js' || ext === 'mjs') { classe = 'fa-brands fa-js'; teinte = 'js'; }
        else if (ext === 'json') { classe = 'fa-solid fa-file-code'; teinte = 'json'; }
        else if (ext === 'md' || ext === 'txt') { classe = 'fa-solid fa-file-lines'; teinte = 'texte'; }
        else if (estImage(noeud.nom)) { classe = 'fa-solid fa-file-image'; teinte = 'image'; }

        const bloc = document.createElement('div');
        bloc.className = 'fld-noeud fld-fichier' + (fldSelection === noeud.chemin ? ' selectionne' : '');
        bloc.setAttribute('role', 'treeitem');
        bloc.setAttribute('tabindex', '0');
        bloc.dataset.chemin = noeud.chemin;

        const ligne = document.createElement('div');
        ligne.className = 'fld-ligne';

        const vide = document.createElement('span');
        vide.className = 'fld-chevron-vide';

        const icone = document.createElement('i');
        icone.className = classe + ' fld-icone ' + teinte;
        icone.setAttribute('aria-hidden', 'true');

        const nom = document.createElement('span');
        nom.className = 'fld-nom';
        nom.textContent = noeud.nom;

        const actions = document.createElement('span');
        actions.className = 'fld-actions';

        const bRenommer = boutonMini('renommer', 'Renommer ' + noeud.nom, 'fa-solid fa-pen');
        const bSupprimer = boutonMini('supprimer', 'Supprimer ' + noeud.nom, 'fa-solid fa-trash');

        bRenommer.addEventListener('click', function (e) {
            e.stopPropagation();
            ouvrirModalFichier('renommer', null, noeud);
        });
        bSupprimer.addEventListener('click', function (e) {
            e.stopPropagation();
            if (!confirm('Supprimer « ' + noeud.nom + ' » ?')) return;
            supprimerChemin(noeud.chemin, false);
            if (fldSelection === noeud.chemin) fldSelection = "";
            rendreDossier();
            toast('Supprimé : ' + noeud.nom);
        });

        actions.append(bRenommer, bSupprimer);
        ligne.append(vide, icone, nom, actions);
        bloc.appendChild(ligne);

        function choisir() {
            fldSelection = noeud.chemin;
            rendreDossier();
        }

        bloc.addEventListener('click', choisir);
        bloc.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                choisir();
            }
        });

        return bloc;
    }

    function majSelectionDossier() {
        const el = document.getElementById('fldSelection');
        const bouton = document.getElementById('fldOuvrir');
        if (!el || !bouton) return;

        if (!fldSelection) {
            el.textContent = 'Aucun fichier sélectionné';
            bouton.disabled = true;
            return;
        }

        el.innerHTML = '';
        const fort = document.createElement('strong');
        fort.textContent = fldSelection;
        el.append('Fichier : ', fort);
        bouton.disabled = false;
    }

    function ouvrirDepuisDossier(chemin) {
        if (estImage(chemin)) {
            toast('Les images seront éditables plus tard');
            return;
        }
        fermerDossier();
        ouvrirFichier(chemin);
        toast('Ouvert : ' + chemin);
    }

    // ==========================================
    // DOSSIER : MODALE + ACTIONS
    // ==========================================
    function ouvrirModalFichier(mode, parentChemin, noeud) {
        const overlay = document.getElementById('fldModal');
        const titre = document.getElementById('fldModalTitre');
        const nom = document.getElementById('fldNom');
        const typeWrap = document.getElementById('fldTypeWrap');
        const erreur = document.getElementById('fldErreur');
        const valider = document.getElementById('fldValider');
        if (!overlay || !titre || !nom) return;

        fldMode = mode;
        fldParent = parentChemin;
        fldNoeud = noeud;

        if (erreur) erreur.hidden = true;

        if (mode === 'fichier') {
            titre.textContent = 'Nouveau fichier';
            if (typeWrap) typeWrap.hidden = false;
            nom.value = '';
            nom.placeholder = 'ex : style.css';
            if (valider) valider.textContent = 'Créer';
        } else if (mode === 'dossier') {
            titre.textContent = 'Nouveau dossier';
            if (typeWrap) typeWrap.hidden = true;
            nom.value = '';
            nom.placeholder = 'ex : assets';
            if (valider) valider.textContent = 'Créer';
        } else {
            titre.textContent = 'Renommer';
            if (typeWrap) typeWrap.hidden = true;
            nom.value = noeud ? noeud.nom : '';
            if (valider) valider.textContent = 'Renommer';
        }

        overlay.hidden = false;
        setTimeout(function () { nom.focus(); nom.select(); }, 50);
    }

    function fermerModalFichier() {
        const overlay = document.getElementById('fldModal');
        if (overlay) overlay.hidden = true;
        fldMode = null;
        fldParent = null;
        fldNoeud = null;
    }

    function erreurModalFichier(message) {
        const erreur = document.getElementById('fldErreur');
        const nom = document.getElementById('fldNom');
        if (erreur) { erreur.textContent = message; erreur.hidden = false; }
        if (nom) nom.focus();
    }

    function validerModalFichier() {
        const nomEl = document.getElementById('fldNom');
        const typeEl = document.getElementById('fldType');
        if (!nomEl) return;

        let nom = nomEl.value.trim();

        if (!nom) return erreurModalFichier('Donne un nom.');
        if (nom.length > 40) return erreurModalFichier('40 caractères maximum.');
        if (/\/|\\|\.\./.test(nom)) return erreurModalFichier('Pas de / ni de .. dans le nom.');
        if (/\.$/.test(nom)) return erreurModalFichier('Nom invalide.');

        if (fldMode === 'fichier' && nom.indexOf('.') === -1 && typeEl) {
            nom = nom + '.' + typeEl.value;
        }

        const base = fldParent || '';
        const chemin = base ? base + '/' + nom : nom;

        if (fldMode === 'renommer') {
            if (!fldNoeud) return;
            if (chemin === fldNoeud.chemin) { fermerModalFichier(); return; }

            const existe = files[chemin] !== undefined
                || dossiers.indexOf(chemin) !== -1
                || Object.keys(files).some(function (c) { return c.indexOf(chemin + '/') === 0; });

            if (existe) return erreurModalFichier('Ce nom existe déjà ici.');

            renommerChemin(fldNoeud.chemin, chemin);
            const ancien = fldNoeud.nom;
            fermerModalFichier();
            rendreDossier();
            toast('Renommé : ' + ancien + ' → ' + nom);
            return;
        }

        const existe = files[chemin] !== undefined
            || dossiers.indexOf(chemin) !== -1
            || Object.keys(files).some(function (c) { return c.indexOf(chemin + '/') === 0; });

        if (existe) return erreurModalFichier('Ce nom existe déjà ici.');

        if (fldMode === 'fichier') {
            files[chemin] = '';
            sauvegarder();
            fermerModalFichier();
            genererUserApps();
            fermerDossier();
            ouvrirFichier(chemin);
            toast('Créé : ' + chemin);
        } else {
            dossiers.push(chemin);
            sauvegarder();
            fermerModalFichier();
            rendreDossier();
            toast('Créé : ' + chemin);
        }
    }

    function renommerChemin(ancien, nouveau) {
        if (files[ancien] !== undefined) {
            files[nouveau] = files[ancien];
            delete files[ancien];
            if (activeFile === ancien) activeFile = nouveau;
        } else {
            Object.keys(files).forEach(function (c) {
                if (c.indexOf(ancien + '/') === 0) {
                    const suite = c.slice(ancien.length);
                    files[nouveau + suite] = files[c];
                    delete files[c];
                    if (activeFile === c) activeFile = nouveau + suite;
                }
            });

            dossiers = dossiers.map(function (d) {
                if (d === ancien) return nouveau;
                if (d.indexOf(ancien + '/') === 0) return nouveau + d.slice(ancien.length);
                return d;
            });
        }

        sauvegarder();
        mettreAJourOnglets();
        genererUserApps();
    }

    function supprimerChemin(chemin, estDossier) {
        if (estDossier) {
            Object.keys(files).forEach(function (c) {
                if (c.indexOf(chemin + '/') === 0) delete files[c];
            });
            dossiers = dossiers.filter(function (d) {
                return d !== chemin && d.indexOf(chemin + '/') !== 0;
            });
        } else {
            delete files[chemin];
        }

        if (activeFile === chemin || activeFile.indexOf(chemin + '/') === 0) {
            activeFile = Object.keys(files)[0] || 'index.html';
            if (files[activeFile] === undefined) files[activeFile] = '';
            editor.setOption('mode', modeDe(activeFile));
            editor.setValue(files[activeFile]);
            mettreAJourOnglets();
        }

        sauvegarder();
        genererUserApps();
    }

    // ==========================================
    // SLIDE
    // ==========================================
    function ouvrirSlide() {
        if (slideOverlay) slideOverlay.classList.add('ouvert');
        if (slidePanel) slidePanel.classList.add('ouvert');
        afficherPage('launcher');
        chromeMasque = false;
        appliquerMasquageChrome();
        if (iconToggleChrome) iconToggleChrome.className = 'fa-solid fa-eye';

        const savedZoom = localStorage.getItem('virtemulator_zoom');
        if (savedZoom) zoomLevel = parseFloat(savedZoom);
        appliquerZoom();

        mettreAJourHorloge();
        genererUserApps();
    }

    function fermerSlide() {
        if (slideOverlay) slideOverlay.classList.remove('ouvert');
        if (slidePanel) slidePanel.classList.remove('ouvert');
        afficherPage('launcher');
        chromeMasque = false;
        appliquerMasquageChrome();
        if (iconToggleChrome) iconToggleChrome.className = 'fa-solid fa-eye';
    }

    // ==========================================
    // HORLOGE
    // ==========================================
    function mettreAJourHorloge() {
        const maintenant = new Date();
        const heure = String(maintenant.getHours()).padStart(2, '0') + ':' + String(maintenant.getMinutes()).padStart(2, '0');

        const jours = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
        const mois = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
        const dateStr = jours[maintenant.getDay()] + ' ' + maintenant.getDate() + ' ' + mois[maintenant.getMonth()];

        ['samsung', 'iphone'].forEach(function(prefix) {
            ['statusTime', 'googleStatusTime', 'browserStatusTime', 'settingsStatusTime', 'clockStatusTime'].forEach(function(suffix) {
                const el = document.getElementById(prefix + '-' + suffix);
                if (el) el.textContent = heure;
            });
            const bigTime = document.getElementById(prefix + '-bigTime');
            if (bigTime) bigTime.textContent = heure;
            const clockT = document.getElementById(prefix + '-clockCurrentTime');
            if (clockT) clockT.textContent = heure;

            const bigDate = document.getElementById(prefix + '-bigDate');
            if (bigDate) bigDate.textContent = dateStr;
            const clockD = document.getElementById(prefix + '-clockCurrentDate');
            if (clockD) clockD.textContent = dateStr;
        });
    }

    // ==========================================
    // CHRONO
    // ==========================================
    function formaterChrono(ms) {
        const tc = Math.floor(ms / 10);
        const c = tc % 100;
        const ts = Math.floor(tc / 100);
        const s = ts % 60;
        const m = Math.floor(ts / 60);
        return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0') + '.' + String(c).padStart(2, '0');
    }

    window.toggleStopwatch = function() {
        const btn = getEl('swStartBtn');
        const icon = getEl('swStartIcon');
        const reset = getEl('swResetBtn');
        if (!btn) return;

        if (!chronoEnCours) {
            chronoEnCours = true;
            chronoStartTime = Date.now() - chronoElapsed;
            chronoInterval = setInterval(function() {
                chronoElapsed = Date.now() - chronoStartTime;
                const disp = getEl('stopwatchDisplay');
                if (disp) disp.textContent = formaterChrono(chronoElapsed);
            }, 10);
            btn.classList.add('running');
            if (icon) icon.className = 'fa-solid fa-pause';
            if (reset) reset.classList.remove('disabled');
        } else {
            chronoEnCours = false;
            clearInterval(chronoInterval);
            btn.classList.remove('running');
            if (icon) icon.className = 'fa-solid fa-play';
        }
    };

    window.resetStopwatch = function() {
        chronoEnCours = false;
        clearInterval(chronoInterval);
        chronoElapsed = 0;
        const disp = getEl('stopwatchDisplay');
        if (disp) disp.textContent = '00:00.00';
        const startBtn = getEl('swStartBtn');
        if (startBtn) startBtn.classList.remove('running');
        const startIcon = getEl('swStartIcon');
        if (startIcon) startIcon.className = 'fa-solid fa-play';
        const resetBtn = getEl('swResetBtn');
        if (resetBtn) resetBtn.classList.add('disabled');
    };

    // ==========================================
    // PARAMÈTRES
    // ==========================================
    window.basculerTheme = function() {
        modeNuit = !modeNuit;
        if (phoneSamsung) phoneSamsung.classList.toggle('dark-mode', modeNuit);
        if (phoneIphone) phoneIphone.classList.toggle('dark-mode', modeNuit);

        ['samsung', 'iphone'].forEach(function(prefix) {
            const toggle = document.getElementById(prefix + '-themeToggle');
            const value = document.getElementById(prefix + '-themeValue');
            const icon = document.getElementById(prefix + '-themeIcon');
            if (toggle) toggle.classList.toggle('active', modeNuit);
            if (value) value.textContent = modeNuit ? 'Activé' : 'Désactivé';
            if (icon) icon.className = modeNuit ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
        });

        localStorage.setItem('virttech_dark_mode', modeNuit ? 'true' : 'false');
    };

    window.changerNom = function(val) {
        localStorage.setItem('virttech_device_name', val);
        ['samsung', 'iphone'].forEach(function(prefix) {
            const input = document.getElementById(prefix + '-deviceNameInput');
            if (input && input.value !== val) input.value = val;
        });
    };

    // ==========================================
    // SAVE & EXPORT
    // ==========================================
    function brancherSaveExport() {
        const btnSave = document.getElementById('btnSaveCode');
        const btnExport = document.getElementById('btnExportCode');

        if (btnSave) {
            btnSave.onclick = function() {
                files[activeFile] = editor.getValue();
                sauvegarder();
                genererUserApps();
                btnSave.innerHTML = "✅ Sauvegardé";
                setTimeout(function() {
                    btnSave.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg> Save';
                }, 2000);
            };
        }

        if (btnExport) {
            btnExport.onclick = function() {
                const code = editor.getValue();
                const blob = new Blob([code], { type: 'text/html' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = activeFile.split('/').pop() || 'fichier.html';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                btnExport.innerHTML = "✅ Exporté";
                setTimeout(function() {
                    btnExport.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg> Exporter';
                }, 2000);
            };
        }
    }

    // ==========================================
    // LANCEMENT
    // ==========================================
    init();
});