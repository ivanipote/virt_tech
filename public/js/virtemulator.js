// --- virtemulator.js ---
document.addEventListener("DOMContentLoaded", function() {
    let files = {};
    let activeFile = "index.html";
    let editor;
    let zoomLevel = 1;
    let debounceTimer;
    let modeNuit = false;
    let modeleActif = 'samsung';  // 'samsung' | 'iphone'
    let chromeMasque = false;

    // Éléments du slide
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

    // ==========================================
    // INITIALISATION
    // ==========================================
    function init() {
        const savedFiles = localStorage.getItem('virtemulator_files');
        if (savedFiles) {
            try { files = JSON.parse(savedFiles) || {}; } catch (e) { files = {}; }
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
            mode: "htmlmixed", theme: "dracula", lineNumbers: true,
            lineWrapping: false, indentUnit: 2, tabSize: 2, viewportMargin: Infinity,
            autoCloseBrackets: true, autoCloseTags: true, matchBrackets: true
        });
        document.getElementById('editorBody').appendChild(editor.getWrapperElement());

        activeFile = Object.keys(files)[0] || "index.html";
        editor.setValue(files[activeFile] || CODE_BIENVENUE);

        mettreAJourOnglets();
        mettreAJourPreviewPC();
        mettreAJourHorloge();
        appliquerModele();
        genererUserApps();

        setInterval(mettreAJourHorloge, 1000);

        // MODIFICATIONS CODEMIRROR
        editor.on('change', function() {
            files[activeFile] = editor.getValue();
            localStorage.setItem('virtemulator_files', JSON.stringify(files));
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                mettreAJourPreviewPC();
                rafraichirNavigateurSiOuvert();
            }, 500);
        });

        // Restauration nom téléphone
        const savedName = localStorage.getItem('virttech_device_name');
        if (savedName) {
            ['samsung', 'iphone'].forEach(prefix => {
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

        // Reset état Chrome + réappliquer sur les 2 barres
        chromeMasque = false;
        appliquerMasquageChrome();
        if (iconToggleChrome) iconToggleChrome.className = 'fa-solid fa-eye';
        if (btnToggleChrome) {
            btnToggleChrome.style.display = 'none';
            btnToggleChrome.title = 'Masquer la barre';
        }
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
    // PREVIEW PC
    // ==========================================
    function mettreAJourPreviewPC() {
        const pcIframe = document.getElementById('pcIframe');
        if (pcIframe) {
            const doc = pcIframe.contentDocument || pcIframe.contentWindow.document;
            doc.open(); doc.write(editor.getValue()); doc.close();
        }
    }

    // ==========================================
    // ONGLETS ÉDITEUR
    // ==========================================
    function mettreAJourOnglets() {
        const header = document.getElementById('editorHeader');
        if (!header) return;
        header.innerHTML = '<button class="btn-add-tab" id="btnAddTab" title="Nouveau fichier">+</button>';

        Object.keys(files).forEach(nomFichier => {
            const tab = document.createElement('div');
            tab.className = 'tab' + (nomFichier === activeFile ? ' active' : '');
            tab.innerHTML = `
                <span class="tab-name">${nomFichier}</span>
                <span class="tab-close" data-file="${nomFichier}">✕</span>
            `;
            tab.onclick = (e) => {
                if (e.target.classList.contains('tab-close')) {
                    supprimerFichier(e.target.getAttribute('data-file'));
                } else {
                    ouvrirFichier(nomFichier);
                }
            };
            header.insertBefore(tab, header.lastChild);
        });
        document.getElementById('btnAddTab').onclick = ouvrirModalCreate;
    }

    function ouvrirFichier(nomFichier) {
        if (activeFile && files[activeFile] !== undefined) {
            files[activeFile] = editor.getValue();
            localStorage.setItem('virtemulator_files', JSON.stringify(files));
        }
        activeFile = nomFichier;
        editor.setValue(files[nomFichier] || "");
        mettreAJourOnglets();
        mettreAJourPreviewPC();
        rafraichirNavigateurSiOuvert();
    }

    function supprimerFichier(nomFichier) {
        if (Object.keys(files).length <= 1) { alert("Tu ne peux pas supprimer le dernier fichier."); return; }
        if (nomFichier === "index.html") { alert("Tu ne peux pas supprimer le fichier index.html."); return; }
        delete files[nomFichier];
        localStorage.setItem('virtemulator_files', JSON.stringify(files));
        if (activeFile === nomFichier) activeFile = Object.keys(files)[0];
        ouvrirFichier(activeFile);
        genererUserApps();
    }

    // ==========================================
    // MODAL CREATION
    // ==========================================
    const overlayCreate = document.getElementById('overlayCreate');
    const inputNomFichier = document.getElementById('inputNomFichier');

    function ouvrirModalCreate() {
        overlayCreate.classList.add('ouvert');
        inputNomFichier.value = "";
        inputNomFichier.focus();
    }

    document.getElementById('btnAnnulerCreate').onclick = () => {
        overlayCreate.classList.remove('ouvert');
    };

    document.getElementById('btnValiderCreate').onclick = () => {
        let nom = inputNomFichier.value.trim();
        if (!nom) return;
        nom = normaliserNom(nom);
        if (files[nom]) { alert("Ce fichier existe déjà !"); return; }
        files[nom] = `<!DOCTYPE html>\n<html>\n<head>\n<title>${nom}</title>\n</head>\n<body>\n  <h1>Fichier ${nom}</h1>\n</body>\n</html>`;
        localStorage.setItem('virtemulator_files', JSON.stringify(files));
        overlayCreate.classList.remove('ouvert');
        ouvrirFichier(nom);
        genererUserApps();
    };

    // ==========================================
    // SLIDE
    // ==========================================
    document.getElementById('btnPlay').onclick = function() {
        slideOverlay.classList.add('ouvert');
        slidePanel.classList.add('ouvert');

        // TOUJOURS revenir à l'accueil à l'ouverture
        afficherPage('launcher');

        // Reset Chrome bar (les 2 modèles)
        chromeMasque = false;
        appliquerMasquageChrome();
        if (iconToggleChrome) iconToggleChrome.className = 'fa-solid fa-eye';
        if (btnToggleChrome) btnToggleChrome.title = 'Masquer la barre';

        // Zoom
        const savedZoom = localStorage.getItem('virtemulator_zoom');
        if (savedZoom) zoomLevel = parseFloat(savedZoom);
        appliquerZoom();

        mettreAJourHorloge();
        genererUserApps();
    };

    function appliquerZoom() {
        if (phoneSamsung) phoneSamsung.style.transform = `scale(${zoomLevel})`;
        if (phoneIphone) phoneIphone.style.transform = `scale(${zoomLevel})`;
    }

    function fermerSlide() {
        slideOverlay.classList.remove('ouvert');
        slidePanel.classList.remove('ouvert');
        afficherPage('launcher');
        chromeMasque = false;
        appliquerMasquageChrome();
        if (iconToggleChrome) iconToggleChrome.className = 'fa-solid fa-eye';
    }
    btnFermerSlide.onclick = fermerSlide;
    slideOverlay.onclick = fermerSlide;

    btnZoomIn.onclick = function() {
        if (zoomLevel < 1.5) {
            zoomLevel += 0.1;
            appliquerZoom();
            localStorage.setItem('virtemulator_zoom', zoomLevel);
        }
    };
    btnZoomOut.onclick = function() {
        if (zoomLevel > 0.5) {
            zoomLevel -= 0.1;
            appliquerZoom();
            localStorage.setItem('virtemulator_zoom', zoomLevel);
        }
    };

    btnAccueilHeader.onclick = function() {
        afficherPage('launcher');
    };

    // ==========================================
    // NAVIGATION INTERNE
    // ==========================================
    let pageActive = 'launcher';
    let historique = ["index.html"];
    let indexHistorique = 0;

    window.afficherPage = function(nom) {
        const pages = ['launcher', 'googleHome', 'browser', 'settings', 'clock'];
        pageActive = nom;

        pages.forEach(p => {
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

        // Bouton toggle Chrome visible uniquement sur browser
        btnToggleChrome.style.display = (nom === 'browser') ? 'flex' : 'none';

        // Réappliquer l'état de masquage sur les 2 barres
        appliquerMasquageChrome();
    };

    // ==========================================
    // GÉNÉRATION DES APPS USER (les 2 modèles)
    // ==========================================
    function genererUserApps() {
        ['samsung', 'iphone'].forEach(prefix => {
            const grid = document.getElementById(prefix + '-userAppsGrid');
            if (!grid) return;
            grid.innerHTML = '';
            Object.keys(files).forEach(nom => {
                const div = document.createElement('div');
                div.className = 'app-icon';
                div.onclick = () => ouvrirNavigateur(nom);
                div.innerHTML = `
                    <span class="icon-box icon-web"><i class="fa-solid fa-code"></i></span>
                    <span class="app-label">${nom}</span>
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

    // RECHERCHE dans la barre Google → vraie navigation entre pages user
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

    function chargerPage(nom, ajouterHistorique = true) {
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

        setTimeout(() => {
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
    // BARRE DE NAVIGATION SAMSUNG (si jamais réutilisée)
    // ==========================================
    window.navRetour = function() {
        if (pageActive === 'browser') {
            if (indexHistorique > 0) retourArriere();
            else afficherPage('launcher');
        } else if (['google', 'settings', 'clock'].includes(pageActive)) {
            afficherPage('launcher');
        }
    };

    window.navAccueil = function() {
        afficherPage('launcher');
    };

    // ==========================================
    // TOGGLE CHROME BAR (applique aux 2 modèles)
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

    // Applique l'état de masquage sur LES DEUX barres Chrome
    function appliquerMasquageChrome() {
        ['samsung', 'iphone'].forEach(prefix => {
            const bar = document.getElementById(prefix + '-chromeBar');
            if (bar) {
                bar.classList.toggle('hidden', chromeMasque);
            }
        });
    }

    // ==========================================
    // HORLOGE
    // ==========================================
    function mettreAJourHorloge() {
        const maintenant = new Date();
        const heures = String(maintenant.getHours()).padStart(2, '0');
        const minutes = String(maintenant.getMinutes()).padStart(2, '0');
        const heure = `${heures}:${minutes}`;

        ['samsung', 'iphone'].forEach(prefix => {
            ['statusTime', 'googleStatusTime', 'browserStatusTime', 'settingsStatusTime', 'clockStatusTime'].forEach(suffix => {
                const el = document.getElementById(prefix + '-' + suffix);
                if (el) el.textContent = heure;
            });
            const bigTime = document.getElementById(prefix + '-bigTime');
            if (bigTime) bigTime.textContent = heure;
            const clockT = document.getElementById(prefix + '-clockCurrentTime');
            if (clockT) clockT.textContent = heure;

            const jours = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
            const mois = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
            const dateStr = `${jours[maintenant.getDay()]} ${maintenant.getDate()} ${mois[maintenant.getMonth()]}`;
            const bigDate = document.getElementById(prefix + '-bigDate');
            if (bigDate) bigDate.textContent = dateStr;
            const clockD = document.getElementById(prefix + '-clockCurrentDate');
            if (clockD) clockD.textContent = dateStr;
        });
    }

    // ==========================================
    // CHRONO
    // ==========================================
    let chronoEnCours = false;
    let chronoStartTime = 0;
    let chronoElapsed = 0;
    let chronoInterval = null;

    function formaterChrono(ms) {
        const tc = Math.floor(ms / 10), c = tc % 100, ts = Math.floor(tc / 100), s = ts % 60, m = Math.floor(ts / 60);
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(c).padStart(2, '0')}`;
    }

    window.toggleStopwatch = function() {
        const btn = getEl('swStartBtn');
        const icon = getEl('swStartIcon');
        const reset = getEl('swResetBtn');
        if (!btn) return;

        if (!chronoEnCours) {
            chronoEnCours = true;
            chronoStartTime = Date.now() - chronoElapsed;
            chronoInterval = setInterval(() => {
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

        ['samsung', 'iphone'].forEach(prefix => {
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
        // Synchroniser les 2 champs
        ['samsung', 'iphone'].forEach(prefix => {
            const input = document.getElementById(prefix + '-deviceNameInput');
            if (input && input.value !== val) input.value = val;
        });
    };

    // ==========================================
    // BARRE D'OUTILS ÉDITEUR
    // ==========================================
    document.querySelectorAll('.btn-symbol[data-insert]').forEach(btn => {
        btn.addEventListener('click', function() {
            let textToInsert = this.getAttribute('data-insert');
            if (!textToInsert) return;
            textToInsert = textToInsert.replace(/\\n/g, '\n');
            const cursor = editor.getCursor();
            editor.replaceRange(" " + textToInsert, cursor);
            const lines = textToInsert.split('\n');
            const lastLine = cursor.line + lines.length - 1;
            const lastCh = (lines.length === 1) ? cursor.ch + textToInsert.length + 1 : lines[lines.length - 1].length;
            editor.setCursor({ line: lastLine, ch: lastCh });
            editor.focus();
        });
    });

    const projets = {
        'calc': `<!DOCTYPE html><html><head><style>body{display:flex;justify-content:center;align-items:center;height:100vh;background:#f0f0f0;margin:0;font-family:sans-serif}.calc{background:#333;padding:20px;border-radius:10px;width:250px}.ecran{background:#fff;padding:15px;text-align:right;font-size:1.5rem;border-radius:5px;margin-bottom:10px}.touches{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}button{padding:15px;font-size:1.1rem;border:none;border-radius:5px;background:#555;color:white;cursor:pointer}button:hover{background:#777}.op{background:#D4AF37;color:#000}</style></head><body><div class="calc"><div class="ecran" id="ecran">0</div><div class="touches"><button onclick="clearE()">C</button><button onclick="append('/')">/</button><button onclick="append('*')">*</button><button class="op" onclick="append('-')">-</button><button onclick="append('7')">7</button><button onclick="append('8')">8</button><button onclick="append('9')">9</button><button class="op" onclick="append('+')">+</button><button onclick="append('4')">4</button><button onclick="append('5')">5</button><button onclick="append('6')">6</button><button class="op" onclick="calculer()">=</button><button onclick="append('1')">1</button><button onclick="append('2')">2</button><button onclick="append('3')">3</button><button onclick="append('0')">0</button></div></div><script>let ecran=document.getElementById('ecran');function append(val){if(ecran.innerText==='0')ecran.innerText=val;else ecran.innerText+=val}function clearE(){ecran.innerText='0'}function calculer(){try{ecran.innerText=eval(ecran.innerText)}catch(e){ecran.innerText='Erreur'}}<\/script></body></html>`,
        'login': `<!DOCTYPE html><html><head><style>body{display:flex;justify-content:center;align-items:center;height:100vh;background:#0B2545;margin:0;font-family:sans-serif;color:white}.box{background:rgba(255,255,255,0.1);padding:30px;border-radius:15px;width:300px;text-align:center}input{width:100%;padding:12px;margin:10px 0;border:none;border-radius:8px;box-sizing:border-box}button{width:100%;padding:12px;background:#D4AF37;color:#000;border:none;border-radius:8px;font-weight:bold;cursor:pointer;margin-top:10px}</style></head><body><div class="box"><h2>Connexion</h2><input type="text" placeholder="Nom"><input type="password" placeholder="Mot de passe"><button>Se connecter</button></div></body></html>`
    };

    document.querySelectorAll('[data-project]').forEach(btn => {
        btn.addEventListener('click', function() {
            const projKey = this.getAttribute('data-project');
            if (projets[projKey]) {
                editor.setValue(projets[projKey]);
                mettreAJourPreviewPC();
            }
        });
    });

    // ==========================================
    // SAVE & EXPORT
    // ==========================================
    const btnSave = document.getElementById('btnSaveCode');
    const btnExport = document.getElementById('btnExportCode');

    if (btnSave) {
        btnSave.onclick = function() {
            files[activeFile] = editor.getValue();
            localStorage.setItem('virtemulator_files', JSON.stringify(files));
            genererUserApps();
            btnSave.innerHTML = "✅ Sauvegardé";
            setTimeout(() => {
                btnSave.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg> Save`;
            }, 2000);
        };
    }
    if (btnExport) {
        btnExport.onclick = function() {
            const code = editor.getValue();
            const blob = new Blob([code], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url; a.download = activeFile;
            document.body.appendChild(a); a.click(); document.body.removeChild(a);
            URL.revokeObjectURL(url);
            btnExport.innerHTML = "✅ Exporté";
            setTimeout(() => {
                btnExport.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg> Exporter`;
            }, 2000);
        };
    }
    // Brancher les boutons qui n'ont pas d'onclick dans le HTML
if (btnToggleChrome) {
    btnToggleChrome.onclick = function() { toggleChromeBar(); };
}

    // ==========================================
    // LANCEMENT
    // ==========================================
    init();
});