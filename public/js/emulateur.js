// --- emulateur.js ---
// Cœur de VirtEmulator : CodeMirror, fichiers, slide, téléphones, navigation,
// paramètres, horloge, chrono, save/export.
//
// Reçoit de toolsemulator.js : window.setEditorInstance + window.setOnProjetClick
// Utilise : window.virtToast (défini par toolsemulator.js)

document.addEventListener("DOMContentLoaded", function() {
    'use strict';

    // ==========================================
    // ÉTAT GLOBAL
    // ==========================================
    let files = {};
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
        return nom.endsWith('.html') ? nom : nom + '.html';
    }

    function getPrefix() {
        return modeleActif === 'iphone' ? 'iphone' : 'samsung';
    }

    function getEl(suffixe) {
        return document.getElementById(getPrefix() + '-' + suffixe);
    }

    function sauvegarder() {
        localStorage.setItem('virtemulator_files', JSON.stringify(files));
    }

    function toast(message, duree) {
        if (window.virtToast) {
            window.virtToast(message, duree);
        } else {
            console.log(message);
        }
    }

    // ==========================================
    // INITIALISATION
    // ==========================================
    function init() {
        // Charger les fichiers sauvegardés
        const savedFiles = localStorage.getItem('virtemulator_files');
        if (savedFiles) {
            try {
                files = JSON.parse(savedFiles) || {};
            } catch (e) {
                files = {};
            }
        }
        if (!files["index.html"]) {
            files["index.html"] = CODE_BIENVENUE;
        }

        // Restaurer le modèle choisi
        const savedModele = localStorage.getItem('virtemulator_modele');
        if (savedModele === 'iphone' || savedModele === 'samsung') {
            modeleActif = savedModele;
        }

        // INIT CODEMIRROR
        editor = CodeMirror.fromTextArea(document.getElementById('codeInput'), {
            mode: "htmlmixed",
            theme: "dracula",
            lineNumbers: true,
            lineWrapping: false,
            indentUnit: 2,
            tabSize: 2,
            viewportMargin: Infinity,
            autoCloseBrackets: true,
            autoCloseTags: true,
            matchBrackets: true
        });
        document.getElementById('editorBody').appendChild(editor.getWrapperElement());

        // Donner l'instance CodeMirror à toolsemulator.js
        if (window.setEditorInstance) {
            window.setEditorInstance(editor);
        }

        // Brancher le callback projets de toolsemulator.js
        if (window.setOnProjetClick) {
            window.setOnProjetClick(gererCreationProjet);
        }

        activeFile = Object.keys(files)[0] || "index.html";
        editor.setValue(files[activeFile] || CODE_BIENVENUE);

        // Mise à jour UI
        mettreAJourOnglets();
        mettreAJourPreviewPC();
        mettreAJourHorloge();
        appliquerModele();
        genererUserApps();
        brancherEvenements();

        setInterval(mettreAJourHorloge, 1000);

        // ÉCOUTE MODIFICATIONS CODEMIRROR
        editor.on('change', function() {
            files[activeFile] = editor.getValue();
            sauvegarder();
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(function() {
                mettreAJourPreviewPC();
                rafraichirNavigateurSiOuvert();
            }, 500);
        });

        // Restauration nom téléphone
        const savedName = localStorage.getItem('virttech_device_name');
        if (savedName) {
            ['samsung', 'iphone'].forEach(function(prefix) {
                const input = document.getElementById(prefix + '-deviceNameInput');
                if (input) input.value = savedName;
            });
        }

        // Restauration mode nuit
        if (localStorage.getItem('virttech_dark_mode') === 'true') {
            modeNuit = false;
            basculerTheme();
        }
    }

    // ==========================================
    // GESTION DES PROJETS (appelée par toolsemulator.js)
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
    // BRANCHEMENT DES ÉVÉNEMENTS (hors toolbar)
    // ==========================================
    function brancherEvenements() {
        // Play
        const btnPlay = document.getElementById('btnPlay');
        if (btnPlay) btnPlay.onclick = ouvrirSlide;

        // Fermer slide
        if (btnFermerSlide) btnFermerSlide.onclick = fermerSlide;
        if (slideOverlay) slideOverlay.onclick = fermerSlide;

        // Zoom
        if (btnZoomIn) btnZoomIn.onclick = function() {
            if (zoomLevel < 1.5) {
                zoomLevel += 0.1;
                appliquerZoom();
                localStorage.setItem('virtemulator_zoom', zoomLevel);
            }
        };
        if (btnZoomOut) btnZoomOut.onclick = function() {
            if (zoomLevel > 0.5) {
                zoomLevel -= 0.1;
                appliquerZoom();
                localStorage.setItem('virtemulator_zoom', zoomLevel);
            }
        };

        // Accueil header
        if (btnAccueilHeader) btnAccueilHeader.onclick = function() {
            afficherPage('launcher');
        };

        // Modal création
        const btnAnnuler = document.getElementById('btnAnnulerCreate');
        const btnValider = document.getElementById('btnValiderCreate');
        if (btnAnnuler) btnAnnuler.onclick = function() {
            document.getElementById('overlayCreate').classList.remove('ouvert');
        };
        if (btnValider) btnValider.onclick = validerCreationFichier;

        brancherSaveExport();
    }

    // ==========================================
    // PREVIEW PC
    // ==========================================
    function mettreAJourPreviewPC() {
        const pcIframe = document.getElementById('pcIframe');
        if (pcIframe) {
            const doc = pcIframe.contentDocument || pcIframe.contentWindow.document;
            doc.open();
            doc.write(editor.getValue());
            doc.close();
        }
    }

    // ==========================================
    // ONGLETS
    // ==========================================
    function mettreAJourOnglets() {
        const header = document.getElementById('editorHeader');
        if (!header) return;
        header.innerHTML = '<button class="btn-add-tab" id="btnAddTab" title="Nouveau fichier">+</button>';

        Object.keys(files).forEach(function(nomFichier) {
            const tab = document.createElement('div');
            tab.className = 'tab' + (nomFichier === activeFile ? ' active' : '');
            tab.innerHTML = `
                <span class="tab-name">${nomFichier}</span>
                <span class="tab-close" data-file="${nomFichier}">✕</span>
            `;
            tab.onclick = function(e) {
                if (e.target.classList.contains('tab-close')) {
                    supprimerFichier(e.target.getAttribute('data-file'));
                } else {
                    ouvrirFichier(nomFichier);
                }
            };
            header.insertBefore(tab, header.lastChild);
        });

        const btnAddTab = document.getElementById('btnAddTab');
        if (btnAddTab) btnAddTab.onclick = ouvrirModalCreate;
    }

    function ouvrirFichier(nomFichier) {
        if (activeFile && files[activeFile] !== undefined) {
            files[activeFile] = editor.getValue();
            sauvegarder();
        }
        activeFile = nomFichier;
        editor.setValue(files[nomFichier] || "");
        mettreAJourOnglets();
        mettreAJourPreviewPC();
        rafraichirNavigateurSiOuvert();
    }

    function supprimerFichier(nomFichier) {
        if (Object.keys(files).length <= 1) {
            toast("❌ Impossible : dernier fichier");
            return;
        }
        if (nomFichier === "index.html") {
            toast("❌ Impossible : index.html protégé");
            return;
        }
        delete files[nomFichier];
        sauvegarder();
        if (activeFile === nomFichier) activeFile = Object.keys(files)[0];
        ouvrirFichier(activeFile);
        genererUserApps();
    }

    // ==========================================
    // MODAL CRÉATION
    // ==========================================
    function ouvrirModalCreate() {
        const overlayCreate = document.getElementById('overlayCreate');
        const inputNomFichier = document.getElementById('inputNomFichier');
        if (!overlayCreate || !inputNomFichier) return;
        overlayCreate.classList.add('ouvert');
        inputNomFichier.value = "";
        inputNomFichier.focus();
    }

    function validerCreationFichier() {
        const inputNomFichier = document.getElementById('inputNomFichier');
        const overlayCreate = document.getElementById('overlayCreate');
        let nom = inputNomFichier.value.trim();
        if (!nom) return;
        nom = normaliserNom(nom);
        if (files[nom]) {
            toast("❌ Ce fichier existe déjà");
            return;
        }
        files[nom] = `<!DOCTYPE html>\n<html>\n<head>\n<title>${nom}</title>\n</head>\n<body>\n  <h1>Fichier ${nom}</h1>\n</body>\n</html>`;
        sauvegarder();
        overlayCreate.classList.remove('ouvert');
        ouvrirFichier(nom);
        genererUserApps();
    }

    // ==========================================
    // SLIDE
    // ==========================================
    function ouvrirSlide() {
        slideOverlay.classList.add('ouvert');
        slidePanel.classList.add('ouvert');
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
        slideOverlay.classList.remove('ouvert');
        slidePanel.classList.remove('ouvert');
        afficherPage('launcher');
        chromeMasque = false;
        appliquerMasquageChrome();
        if (iconToggleChrome) iconToggleChrome.className = 'fa-solid fa-eye';
    }

    function appliquerZoom() {
        if (phoneSamsung) phoneSamsung.style.transform = 'scale(' + zoomLevel + ')';
        if (phoneIphone) phoneIphone.style.transform = 'scale(' + zoomLevel + ')';
    }

    // ==========================================
    // MODÈLE (Samsung / iPhone)
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
        if (modeleActif === 'iphone') {
            phoneSamsung.style.display = 'none';
            phoneIphone.style.display = 'flex';
            document.getElementById('btnModelSamsung').classList.remove('active');
            document.getElementById('btnModelIphone').classList.add('active');
        } else {
            phoneIphone.style.display = 'none';
            phoneSamsung.style.display = 'flex';
            document.getElementById('btnModelIphone').classList.remove('active');
            document.getElementById('btnModelSamsung').classList.add('active');
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
            Object.keys(files).forEach(function(nom) {
                const div = document.createElement('div');
                div.className = 'app-icon';
                div.onclick = function() { ouvrirNavigateur(nom); };
                div.innerHTML = `
                    <span class="icon-box icon-web"><i class="fa-solid fa-code"></i></span>
                    <span class="app-label">${nom.replace('.html', '')}</span>
                `;
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
        ouvrirNavigateur(activeFile);
    };

    window.fermerEmulateur = function() {
        fermerSlide();
    };

    window.ouvrirModalNouveauFichier = function() {
        fermerSlide();
        setTimeout(ouvrirModalCreate, 300);
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

        pageContent.style.display = 'none';
        page404.style.display = 'none';
        iframe.style.display = 'none';
        loadingBar.classList.add('active');

        setTimeout(function() {
            loadingBar.classList.remove('active');
            if (files[nomComplet]) {
                iframe.style.display = 'block';
                const doc = iframe.contentDocument || iframe.contentWindow.document;
                doc.open();
                doc.write(files[nomComplet]);
                doc.close();
                if (urlInput) urlInput.value = nomComplet.replace('.html', '');
            } else {
                page404.style.display = 'flex';
                if (urlInput) urlInput.value = nomComplet + " (introuvable)";
            }
            mettreAJourBoutonsNavigation();
        }, 500);
    }

    function rafraichirNavigateurSiOuvert() {
        if (pageActive === 'browser' && indexHistorique >= 0) {
            const nomActuel = historique[indexHistorique];
            if (nomActuel && files[nomActuel]) {
                const iframe = getEl('browserIframe');
                if (iframe && iframe.style.display !== 'none') {
                    const doc = iframe.contentDocument || iframe.contentWindow.document;
                    doc.open();
                    doc.write(files[nomActuel]);
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
        phoneSamsung.classList.toggle('dark-mode', modeNuit);
        phoneIphone.classList.toggle('dark-mode', modeNuit);

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
                a.download = activeFile;
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