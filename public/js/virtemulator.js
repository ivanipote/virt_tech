// --- virtemulator.js ---
document.addEventListener("DOMContentLoaded", function() {
    let files = {}; 
    let activeFile = "index.html";
    let editor;
    let zoomLevel = 1;
    let debounceTimer;
    
    // Éléments du DOM de l'éditeur
    const iphoneFrame = document.querySelector('.phone-samsung');
    const phoneOverlay = document.getElementById('phoneOverlay');
    const homePage = document.getElementById('homePage');
    const browserPage = document.getElementById('browserPage');

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
        // Chargement des fichiers sauvegardés
        const savedFiles = localStorage.getItem('virtemulator_files');
        if (savedFiles) {
            try { 
                let parsed = JSON.parse(savedFiles);
                delete parsed["index.html"];
                files = parsed;
            } catch (e) { files = {}; }
        }

        // Initialisation de CodeMirror
        editor = CodeMirror.fromTextArea(document.getElementById('codeInput'), {
            mode: "htmlmixed", theme: "dracula", lineNumbers: true,
            lineWrapping: false, indentUnit: 2, tabSize: 2, viewportMargin: Infinity,
            autoCloseBrackets: true, autoCloseTags: true, matchBrackets: true
        });
        document.getElementById('editorBody').appendChild(editor.getWrapperElement());

        // On met le code de bienvenue
        files["index.html"] = CODE_BIENVENUE;
        editor.setValue(CODE_BIENVENUE);

        mettreAJourOnglets();
        mettreAJourPreviewPC();
        
        // Horloge Android
        function updateTime() {
            const now = new Date();
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const timeString = `${hours}:${minutes}`;
            const timeElement = document.querySelector('#heure-status');
            const timeElement2 = document.querySelector('#heure-status-2');
            if (timeElement) timeElement.textContent = timeString;
            if (timeElement2) timeElement2.textContent = timeString;
        }
        setInterval(updateTime, 1000);
        updateTime();

        // Mise à jour temps réel (on ne sauvegarde pas index.html)
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
    // 5. LOGIQUE DU TÉLÉPHONE (Play)
    // ==========================================
    document.getElementById('btnPlay').onclick = function() {
        // On affiche l'overlay du téléphone
        phoneOverlay.classList.add('ouvert');
        
        // On force l'accueil à être visible et le navigateur caché
        homePage.classList.remove('slide-out-left');
        browserPage.style.transition = 'none';
        browserPage.style.transform = 'translateX(100%)';
        
        // On met à jour l'horloge
        const now = new Date();
        const h = now.getHours().toString().padStart(2, '0');
        const m = now.getMinutes().toString().padStart(2, '0');
        document.getElementById('heure-status').textContent = `${h}:${m}`;
        document.getElementById('heure-status-2').textContent = `${h}:${m}`;
    };

    // ==========================================
    // 6. NAVIGATION DU TÉLÉPHONE
    // ==========================================
    let historique = [];
    let indexHistorique = -1;

    // Fonction pour ouvrir une page depuis l'accueil
    window.ouvrirNavigateur = function(nomFichier) {
        nomFichier = nomFichier.replace('.html', '');
        
        // On glisse l'accueil vers la gauche
        homePage.classList.add('slide-out-left');
        
        // On fait glisser le navigateur
        browserPage.style.transition = 'none';
        browserPage.style.transform = 'translateX(100%)';
        void browserPage.offsetWidth;
        browserPage.style.transition = 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)';
        browserPage.style.transform = 'translateX(0)';
        
        // On charge la page
        chargerPage(nomFichier, true);
    };

    // Retour à l'accueil du navigateur
    window.retourAccueil = function() {
        browserPage.style.transform = 'translateX(100%)';
        homePage.classList.remove('slide-out-left');
    };

    // Fermer l'émulateur (retour à l'éditeur)
    window.fermerEmulateur = function() {
        phoneOverlay.classList.remove('ouvert');
    };

    // Ouvrir le modal nouveau fichier depuis le téléphone
    window.ouvrirModalNouveauFichier = function() {
        phoneOverlay.classList.remove('ouvert');
        setTimeout(ouvrirModalCreate, 300); // On attend que l'overlay se ferme
    };

    // Ouvrir la page actuellement dans l'éditeur
    window.ouvrirPageActuelle = function() {
        let nom = activeFile.replace('.html', '');
        window.ouvrirNavigateur(nom);
    };

    // Fonction de recherche depuis l'accueil du téléphone
    window.homeSearchEnter = function(e) {
        if (e.key === 'Enter') {
            const val = document.getElementById('homeSearchInput').value.trim();
            if (!val) return;
            window.ouvrirNavigateur(val);
            document.getElementById('homeSearchInput').value = '';
        }
    };

    // ==========================================
    // 7. LOGIQUE DU NAVIGATEUR (Chargement)
    // ==========================================
    function chargerPage(nom, ajouterHistorique = true) {
        const iframe = document.getElementById('browserIframe');
        const pageContent = document.getElementById('pageContent');
        const page404 = document.getElementById('page404');
        const loadingBar = document.getElementById('loadingBar');

        // Gestion de l'historique
        if (ajouterHistorique) {
            historique = historique.slice(0, indexHistorique + 1);
            if (historique[historique.length - 1] !== nom) {
                historique.push(nom);
                indexHistorique = historique.length - 1;
            }
        }

        // Affichage du chargement
        pageContent.style.display = 'none';
        page404.style.display = 'none';
        iframe.style.display = 'none';
        loadingBar.classList.add('active');

        // On cherche le fichier
        setTimeout(() => {
            loadingBar.classList.remove('active');

            // On regarde dans nos fichiers
            let nomFichierComplet = nom + ".html";
            if (files[nomFichierComplet]) {
                iframe.style.display = 'block';
                const doc = iframe.contentDocument || iframe.contentWindow.document;
                doc.open();
                doc.write(files[nomFichierComplet]);
                doc.close();
                document.getElementById('urlInput').value = nom;
            } else {
                // 404
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
    // 8. BARRE D'OUTILS (Balises & Projets)
    // ==========================================
    // (Le code de la toolbar reste inchangé, il est déjà bon)
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

    // Injection des projets (Le dictionnaire existe déjà)
    const projets = {
        'calc': `<!DOCTYPE html><html><head><style>body{display:flex;justify-content:center;align-items:center;height:100vh;background:#f0f0f0;margin:0;font-family:sans-serif}.calc{background:#333;padding:20px;border-radius:10px;width:250px}.ecran{background:#fff;padding:15px;text-align:right;font-size:1.5rem;border-radius:5px;margin-bottom:10px}.touches{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}button{padding:15px;font-size:1.1rem;border:none;border-radius:5px;background:#555;color:white;cursor:pointer}button:hover{background:#777}.op{background:#D4AF37;color:#000}</style></head><body><div class="calc"><div class="ecran" id="ecran">0</div><div class="touches"><button onclick="clearE()">C</button><button onclick="append('/')">/</button><button onclick="append('*')">*</button><button class="op" onclick="append('-')">-</button><button onclick="append('7')">7</button><button onclick="append('8')">8</button><button onclick="append('9')">9</button><button class="op" onclick="append('+')">+</button><button onclick="append('4')">4</button><button onclick="append('5')">5</button><button onclick="append('6')">6</button><button class="op" onclick="calculer()">=</button><button onclick="append('1')">1</button><button onclick="append('2')">2</button><button onclick="append('3')">3</button><button onclick="append('0')">0</button></div></div><script>let ecran=document.getElementById('ecran');function append(val){if(ecran.innerText==='0')ecran.innerText=val;else ecran.innerText+=val}function clearE(){ecran.innerText='0'}function calculer(){try{ecran.innerText=eval(ecran.innerText)}catch(e){ecran.innerText='Erreur'}}<\/script></body></html>`,
        'login': `<!DOCTYPE html><html><head><style>body{display:flex;justify-content:center;align-items:center;height:100vh;background:#0B2545;margin:0;font-family:sans-serif;color:white}.box{background:rgba(255,255,255,0.1);padding:30px;border-radius:15px;width:300px;text-align:center}input{width:100%;padding:12px;margin:10px 0;border:none;border-radius:8px;box-sizing:border-box}button{width:100%;padding:12px;background:#D4AF37;color:#000;border:none;border-radius:8px;font-weight:bold;cursor:pointer;margin-top:10px}</style></head><body><div class="box"><h2>Connexion</h2><input type="text" placeholder="Nom"><input type="password" placeholder="Mot de passe"><button>Se connecter</button></div></body></html>`,
        'btn': `<!DOCTYPE html><html><head><style>body{display:flex;justify-content:center;align-items:center;height:100vh;background:#f4f4f4;margin:0}.btn{padding:15px 40px;font-size:1.2rem;background:#0B2545;color:white;border:none;border-radius:50px;cursor:pointer;transition:all 0.3s ease;box-shadow:0 5px 15px rgba(0,0,0,0.2)}.btn:hover{background:#D4AF37;color:#000;transform:translateY(-5px) scale(1.1)}</style></head><body><button class="btn">Survole-moi !</button></body></html>`,
        'text': `<!DOCTYPE html><html><head><style>body{display:flex;justify-content:center;align-items:center;height:100vh;background:#222;margin:0;font-family:sans-serif}h1{font-size:4rem;color:transparent;-webkit-text-stroke:2px #D4AF37;text-transform:uppercase;letter-spacing:5px}</style></head><body><h1>VirtTech</h1></body></html>`
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
    // 9. LANCEMENT
    // ==========================================
    init();
});