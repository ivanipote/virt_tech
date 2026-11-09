// --- virtemulator.js ---
document.addEventListener("DOMContentLoaded", function() {
    let files = {}; 
    let activeFile = "index.html";
    let editor;
    let zoomLevel = 1;
    let debounceTimer;
    
    // Éléments du slide et du téléphone
    const slideOverlay = document.getElementById('slideOverlay');
    const slidePanel = document.getElementById('slidePanel');
    const btnFermerSlide = document.getElementById('btnFermerSlide');
    const iphoneFrame = document.getElementById('iphoneFrame');
    const btnAccueilHeader = document.getElementById('btnAccueil');
    const btnZoomIn = document.getElementById('btnZoomIn');
    const btnZoomOut = document.getElementById('btnZoomOut');

    // Code de bienvenue
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
    // 1. INITIALISATION
    // ==========================================
    function init() {
        const savedFiles = localStorage.getItem('virtemulator_files');
        if (savedFiles) {
            try { 
                let parsed = JSON.parse(savedFiles);
                delete parsed["index.html"];
                files = parsed;
            } catch (e) { files = {}; }
        }

        editor = CodeMirror.fromTextArea(document.getElementById('codeInput'), {
            mode: "htmlmixed", theme: "dracula", lineNumbers: true,
            lineWrapping: false, indentUnit: 2, tabSize: 2, viewportMargin: Infinity,
            autoCloseBrackets: true, autoCloseTags: true, matchBrackets: true
        });
        document.getElementById('editorBody').appendChild(editor.getWrapperElement());

        files["index.html"] = CODE_BIENVENUE;
        editor.setValue(CODE_BIENVENUE);

        mettreAJourOnglets();
        mettreAJourPreviewPC();
        mettreAJourHorloge();
        genererUserApps();
        
        setInterval(mettreAJourHorloge, 1000);

        editor.on('change', function() {
            if (activeFile !== "index.html") {
                files[activeFile] = editor.getValue();
                localStorage.setItem('virtemulator_files', JSON.stringify(files));
            }
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(mettreAJourPreviewPC, 500); 
        });
    }

    // ==========================================
    // 2. PREVIEW PC
    // ==========================================
    function mettreAJourPreviewPC() {
        const pcIframe = document.getElementById('pcIframe');
        if (pcIframe) {
            const doc = pcIframe.contentDocument || pcIframe.contentWindow.document;
            doc.open(); doc.write(editor.getValue()); doc.close();
        }
    }

    // ==========================================
    // 3. GESTION DES ONGLETS
    // ==========================================
    function mettreAJourOnglets() {
        const header = document.getElementById('editorHeader');
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
        if (activeFile && files[activeFile] !== undefined && activeFile !== "index.html") {
            files[activeFile] = editor.getValue();
        }
        activeFile = nomFichier;
        editor.setValue(files[nomFichier] || "");
        mettreAJourOnglets();
        mettreAJourPreviewPC();
    }

    function supprimerFichier(nomFichier) {
        if (Object.keys(files).length <= 1) { alert("Tu ne peux pas supprimer le dernier fichier."); return; }
        if (nomFichier === "index.html") { alert("Tu ne peux pas supprimer le fichier index.html."); return; }
        delete files[nomFichier];
        if (activeFile === nomFichier) { activeFile = Object.keys(files)[0]; }
        ouvrirFichier(activeFile);
    }

    // ==========================================
    // 4. MODAL CREATION
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
        if (!nom.endsWith('.html')) nom += '.html';
        if (files[nom]) { alert("Ce fichier existe déjà !"); return; }
        
        files[nom] = `<!DOCTYPE html>\n<html>\n<head>\n<title>${nom}</title>\n</head>\n<body>\n  <h1>Fichier ${nom}</h1>\n</body>\n</html>`;
        overlayCreate.classList.remove('ouvert');
        ouvrirFichier(nom);
    };

    // ==========================================
    // 5. LE SLIDE ET LE TÉLÉPHONE
    // ==========================================
    document.getElementById('btnPlay').onclick = function() {
        slideOverlay.classList.add('ouvert');
        slidePanel.classList.add('ouvert');
        
        // On s'assure que le Launcher est visible
        afficherPage('launcher');
        
        // On applique le zoom sauvegardé
        const savedZoom = localStorage.getItem('virtemulator_zoom');
        if (savedZoom) { zoomLevel = parseFloat(savedZoom); }
        iphoneFrame.style.transform = `scale(${zoomLevel})`;
        
        mettreAJourHorloge();
    };

    function fermerSlide() {
        slideOverlay.classList.remove('ouvert');
        slidePanel.classList.remove('ouvert');
    }
    btnFermerSlide.onclick = fermerSlide;
    slideOverlay.onclick = fermerSlide;

    // Zoom
    btnZoomIn.onclick = function() {
        if (zoomLevel < 1.5) { 
            zoomLevel += 0.1; 
            iphoneFrame.style.transform = `scale(${zoomLevel})`;
            localStorage.setItem('virtemulator_zoom', zoomLevel);
        }
    };
    btnZoomOut.onclick = function() {
        if (zoomLevel > 0.5) { 
            zoomLevel -= 0.1; 
            iphoneFrame.style.transform = `scale(${zoomLevel})`;
            localStorage.setItem('virtemulator_zoom', zoomLevel);
        }
    };

    // Bouton Accueil du header
    btnAccueilHeader.onclick = function() {
        afficherPage('launcher');
    };

    // ==========================================
    // 6. NAVIGATION INTERNE DU TÉLÉPHONE
    // ==========================================
    let pageActive = 'launcher';
    let modeNuit = false;
    let historique = ["index"];
    let indexHistorique = 0;

    window.afficherPage = function(nom) {
        pageActive = nom;
        const pages = ['launcherPage', 'googleHomePage', 'browserPage', 'settingsPage', 'clockPage'];
        
        pages.forEach(p => {
            const el = document.getElementById(p);
            el.className = 'page';
            if (p === nom + 'Page') {
                el.classList.add('active');
            } else {
                el.classList.add('behind');
            }
        });
    };

    function genererUserApps() {
        const grid = document.getElementById('userAppsGrid');
        if (!grid) return;
        grid.innerHTML = '';
        Object.keys(files).forEach(nom => {
            const div = document.createElement('div');
            div.className = 'app-icon';
            div.onclick = () => ouvrirNavigateur(nom.replace('.html', ''));
            div.innerHTML = `
                <span class="icon-box icon-web"><i class="fa-solid fa-code"></i></span>
                <span class="app-label">${nom}</span>
            `;
            grid.appendChild(div);
        });
    }

    // ==========================================
    // 7. LOGIQUE DU NAVIGATEUR
    // ==========================================
    window.ouvrirNavigateur = function(page) {
        historique = [page || 'index'];
        indexHistorique = 0;
        afficherPage('browser');
        chargerPage(page || 'index', false);
    };

    window.ouvrirPageActuelle = function() {
        let nom = activeFile.replace('.html', '');
        ouvrirNavigateur(nom);
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
            const val = document.getElementById('homeSearchInput').value.trim();
            if (!val) return;
            ouvrirNavigateur(val.replace('.html', ''));
            document.getElementById('homeSearchInput').value = '';
        }
    };

    function chargerPage(nom, ajouterHistorique = true) {
        const iframe = document.getElementById('browserIframe');
        const pageContent = document.getElementById('pageContent');
        const page404 = document.getElementById('page404');
        const loadingBar = document.getElementById('loadingBar');

        if (ajouterHistorique) {
            historique = historique.slice(0, indexHistorique + 1);
            if (historique[historique.length - 1] !== nom) {
                historique.push(nom);
                indexHistorique = historique.length - 1;
            }
        }

        pageContent.style.display = 'none';
        page404.style.display = 'none';
        iframe.style.display = 'none';
        loadingBar.classList.add('active');

        setTimeout(() => {
            loadingBar.classList.remove('active');

            let nomFichierComplet = nom + ".html";
            if (files[nomFichierComplet]) {
                iframe.style.display = 'block';
                const doc = iframe.contentDocument || iframe.contentWindow.document;
                doc.open();
                doc.write(files[nomFichierComplet]);
                doc.close();
                document.getElementById('urlInput').value = nom;
            } else {
                page404.style.display = 'flex';
                document.getElementById('urlInput').value = nom + " (introuvable)";
            }
            mettreAJourBoutonsNavigation();
        }, 500);
    }

    window.handleEnter = function(e) {
        if (e.key === 'Enter') {
            let nom = document.getElementById('urlInput').value.trim();
            if (!nom) return;
            nom = nom.replace('.html', '').replace(' (introuvable)', '');
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
        if (indexHistorique >= 0) {
            chargerPage(historique[indexHistorique], false);
        }
    };

    function mettreAJourBoutonsNavigation() {
        const btnBack = document.getElementById('btnBack');
        const btnForward = document.getElementById('btnForward');
        if (btnBack) {
            if (indexHistorique > 0) btnBack.classList.remove('desactive');
            else btnBack.classList.add('desactive');
        }
        if (btnForward) {
            if (indexHistorique < historique.length - 1) btnForward.classList.remove('desactive');
            else btnForward.classList.add('desactive');
        }
    }

    // ==========================================
    // 8. HORLOGE ET CHRONO
    // ==========================================
    function mettreAJourHorloge() {
        const maintenant = new Date();
        const heures = String(maintenant.getHours()).padStart(2, '0');
        const minutes = String(maintenant.getMinutes()).padStart(2, '0');
        const heure = `${heures}:${minutes}`;

        const ids = ['statusTime', 'googleStatusTime', 'browserStatusTime', 'settingsStatusTime', 'clockStatusTime'];
        ids.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.textContent = heure;
        });

        const bigTime = document.getElementById('bigTime');
        if (bigTime) bigTime.textContent = heure;
        const clockCurrentTime = document.getElementById('clockCurrentTime');
        if (clockCurrentTime) clockCurrentTime.textContent = heure;

        const jours = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
        const mois = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
        const dateStr = `${jours[maintenant.getDay()]} ${maintenant.getDate()} ${mois[maintenant.getMonth()]}`;

        const bigDate = document.getElementById('bigDate');
        if (bigDate) bigDate.textContent = dateStr;
        const clockCurrentDate = document.getElementById('clockCurrentDate');
        if (clockCurrentDate) clockCurrentDate.textContent = dateStr;
    }

    // Chrono
    let chronoEnCours = false;
    let chronoStartTime = 0;
    let chronoElapsed = 0;
    let chronoInterval = null;

    function formaterChrono(ms) {
        const totalCentiemes = Math.floor(ms / 10);
        const centiemes = totalCentiemes % 100;
        const totalSecondes = Math.floor(totalCentiemes / 100);
        const secondes = totalSecondes % 60;
        const minutes = Math.floor(totalSecondes / 60);
        return `${String(minutes).padStart(2, '0')}:${String(secondes).padStart(2, '0')}.${String(centiemes).padStart(2, '0')}`;
    }

    window.toggleStopwatch = function() {
        const startBtn = document.getElementById('swStartBtn');
        const startIcon = document.getElementById('swStartIcon');
        const resetBtn = document.getElementById('swResetBtn');

        if (!chronoEnCours) {
            chronoEnCours = true;
            chronoStartTime = Date.now() - chronoElapsed;
            chronoInterval = setInterval(() => {
                chronoElapsed = Date.now() - chronoStartTime;
                document.getElementById('stopwatchDisplay').textContent = formaterChrono(chronoElapsed);
            }, 10);
            startBtn.classList.add('running');
            startIcon.className = 'fa-solid fa-pause';
            resetBtn.classList.remove('disabled');
        } else {
            chronoEnCours = false;
            clearInterval(chronoInterval);
            startBtn.classList.remove('running');
            startIcon.className = 'fa-solid fa-play';
        }
    };

    window.resetStopwatch = function() {
        chronoEnCours = false;
        clearInterval(chronoInterval);
        chronoElapsed = 0;
        document.getElementById('stopwatchDisplay').textContent = '00:00.00';
        document.getElementById('swStartBtn').classList.remove('running');
        document.getElementById('swStartIcon').className = 'fa-solid fa-play';
        document.getElementById('swResetBtn').classList.add('disabled');
    };

    // ==========================================
    // 9. PARAMÈTRES (Mode nuit)
    // ==========================================
    window.basculerTheme = function() {
        modeNuit = !modeNuit;
        const toggle = document.getElementById('themeToggle');
        const value = document.getElementById('themeValue');
        const icon = document.getElementById('themeIcon');

        if (modeNuit) {
            toggle.classList.add('active');
            value.textContent = 'Activé';
            icon.className = 'fa-solid fa-sun';
        } else {
            toggle.classList.remove('active');
            value.textContent = 'Désactivé';
            icon.className = 'fa-solid fa-moon';
        }
    };

    window.changerNom = function(val) {
        localStorage.setItem('virttech_device_name', val);
    };

    // ==========================================
    // 10. BARRE D'OUTILS (Injection & Projets)
    // ==========================================
    document.querySelectorAll('.btn-symbol[data-insert]').forEach(btn => {
        btn.addEventListener('click', function() {
            let textToInsert = this.getAttribute('data-insert');
            if(!textToInsert) return;
            textToInsert = textToInsert.replace(/\\n/g, '\n');
            const cursor = editor.getCursor();
            editor.replaceRange(" " + textToInsert, cursor);
            const lines = textToInsert.split('\n');
            const lastLine = cursor.line + lines.length - 1;
            const lastCh = (lines.length === 1) ? cursor.ch + textToInsert.length + 1 : lines[lines.length - 1].length;
            editor.setCursor({line: lastLine, ch: lastCh});
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
            if(projets[projKey]) {
                editor.setValue(projets[projKey]);
                mettreAJourPreviewPC();
            }
        });
    });

    // ==========================================
    // 11. BOUTONS SAVE & EXPORT
    // ==========================================
    const btnSave = document.getElementById('btnSaveCode');
    const btnExport = document.getElementById('btnExportCode');

    if (btnSave) {
        btnSave.onclick = function() {
            if(activeFile !== "index.html") {
                files[activeFile] = editor.getValue();
                localStorage.setItem('virtemulator_files', JSON.stringify(files));
            }
            btnSave.innerHTML = "✅ Sauvegardé";
            setTimeout(() => { btnSave.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg> Save`; }, 2000);
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
            setTimeout(() => { btnExport.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg> Exporter`; }, 2000);
        };
    }

    // ==========================================
    // 12. LANCEMENT
    // ==========================================
    init();
});