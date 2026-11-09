// --- virtemulator.js ---
document.addEventListener("DOMContentLoaded", function() {
    let files = {}; 
    let activeFile = "index.html";
    let editor;
    let zoomLevel = 1;
    let debounceTimer;
    const iphoneFrame = document.querySelector('.iphone-frame');

    // --- INITIALISATION ---
    function init() {
        const savedFiles = localStorage.getItem('virtemulator_files');
        if (savedFiles) {
            try { files = JSON.parse(savedFiles); } catch (e) { files = {}; }
        }
        
        if (!files["index.html"]) {
            files["index.html"] = `<!DOCTYPE html>\n<html>\n<head>\n  <title>Mon site</title>\n</head>\n<body>\n  <h1>Bienvenue sur VirtEmulator !</h1>\n  <p>Crée un nouveau fichier avec le bouton +</p>\n</body>\n</html>`;
        }

        editor = CodeMirror.fromTextArea(document.getElementById('codeInput'), {
            mode: "htmlmixed", theme: "dracula", lineNumbers: true,
            lineWrapping: false, indentUnit: 2, tabSize: 2, viewportMargin: Infinity,
            autoCloseBrackets: true, autoCloseTags: true, matchBrackets: true
        });
        document.getElementById('editorBody').appendChild(editor.getWrapperElement());

        ouvrirFichier(files["index.html"] ? "index.html" : Object.keys(files)[0]);
        mettreAJourOnglets();
        
        // Horloge Android
        function updateTime() {
            const now = new Date();
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const timeElement = document.querySelector('.status-time');
            if (timeElement) timeElement.textContent = `${hours}:${minutes}`;
        }
        setInterval(updateTime, 1000);
        updateTime();

        // Mise à jour temps réel PC
        editor.on('change', function() {
            files[activeFile] = editor.getValue();
            localStorage.setItem('virtemulator_files', JSON.stringify(files));
            
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                mettreAJourPreviewPC();
            }, 500); 
        });
        
        mettreAJourPreviewPC();

        // Restauration zoom
        const savedZoom = localStorage.getItem('virtemulator_zoom');
        if (savedZoom) { zoomLevel = parseFloat(savedZoom); }
        updateZoom(); 
    }

    // --- MISE A JOUR PREVIEW PC ---
    function mettreAJourPreviewPC() {
        const pcIframe = document.getElementById('pcIframe');
        if (pcIframe) {
            const code = editor.getValue();
            const doc = pcIframe.contentDocument || pcIframe.contentWindow.document;
            doc.open(); doc.write(code); doc.close();
        }
    }

    // --- GESTION DES ONGLETS ---
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
        if (activeFile && files[activeFile] !== undefined) {
            files[activeFile] = editor.getValue();
        }
        activeFile = nomFichier;
        editor.setValue(files[nomFichier]);
        mettreAJourOnglets();
        mettreAJourPreviewPC();
    }

    function supprimerFichier(nomFichier) {
        if (Object.keys(files).length <= 1) { alert("Tu ne peux pas supprimer le dernier fichier."); return; }
        delete files[nomFichier];
        if (activeFile === nomFichier) { activeFile = Object.keys(files)[0]; }
        ouvrirFichier(activeFile);
    }

    // --- MODAL CREATION ---
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

    // --- PLAY MOBILE ---
    document.getElementById('btnPlay').onclick = () => {
        const code = editor.getValue();
        const doc = document.getElementById('mobileIframe').contentDocument;
        doc.open(); doc.write(code); doc.close();

        document.getElementById('slideTitle').textContent = "Aperçu de " + activeFile;
        document.getElementById('slideOverlay').classList.add('ouvert');
        document.getElementById('slidePanel').classList.add('ouvert');
    };

    // --- SLIDE ---
    document.getElementById('btnFermerSlide').onclick = () => {
        document.getElementById('slideOverlay').classList.remove('ouvert');
        document.getElementById('slidePanel').classList.remove('ouvert');
    };
    document.getElementById('slideOverlay').onclick = () => {
        document.getElementById('slideOverlay').classList.remove('ouvert');
        document.getElementById('slidePanel').classList.remove('ouvert');
    };

    // --- ZOOM ---
    const btnZoomIn = document.getElementById('btnZoomIn');
    const btnZoomOut = document.getElementById('btnZoomOut');

    function updateZoom() { 
        iphoneFrame.style.transform = `scale(${zoomLevel})`; 
        localStorage.setItem('virtemulator_zoom', zoomLevel);
    }
    btnZoomIn.onclick = () => { if (zoomLevel < 1.5) { zoomLevel += 0.1; updateZoom(); } };
    btnZoomOut.onclick = () => { if (zoomLevel > 0.5) { zoomLevel -= 0.1; updateZoom(); } };

    // --- SAVE & EXPORT ---
    const btnSave = document.getElementById('btnSaveCode');
    const btnExport = document.getElementById('btnExportCode');

    if (btnSave) {
        btnSave.onclick = function() {
            files[activeFile] = editor.getValue();
            localStorage.setItem('virtemulator_files', JSON.stringify(files));
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

    // --- LOGIQUE DE LA BARRE D'OUTILS (TOOLBAR) ---
    const btnSwitch = document.getElementById('btnSwitch');
    const langMenu = document.getElementById('langMenu');
    const currentLangText = document.getElementById('currentLang');

    if(btnSwitch) {
        btnSwitch.addEventListener('click', (e) => {
            if(e.target.closest('.lang-menu')) return;
            langMenu.classList.toggle('ouvert');
        });

        document.addEventListener('click', (e) => {
            if (!btnSwitch.contains(e.target)) langMenu.classList.remove('ouvert');
        });
    }

    window.setLang = function(lang, btn) {
        currentLangText.innerText = lang.toUpperCase();
        const buttons = langMenu.querySelectorAll('button');
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        document.querySelectorAll('.group-symbols').forEach(g => g.classList.remove('active'));
        document.getElementById(`grp-${lang}`).classList.add('active');
        langMenu.classList.remove('ouvert');

        if(lang === 'html') editor.setOption("mode", "htmlmixed");
        if(lang === 'css') editor.setOption("mode", "css");
        if(lang === 'js') editor.setOption("mode", "javascript");
        if(lang === 'projets') editor.setOption("mode", "htmlmixed");
    }

    // --- DICTIONNAIRE DES PROJETS ---
    const projets = {
        'calc': `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Calculatrice</title>
  <style>
    body { display: flex; justify-content: center; align-items: center; height: 100vh; background: #f0f0f0; margin: 0; font-family: sans-serif; }
    .calc { background: #333; padding: 20px; border-radius: 10px; width: 250px; }
    .ecran { background: #fff; padding: 15px; text-align: right; font-size: 1.5rem; border-radius: 5px; margin-bottom: 10px; }
    .touches { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
    button { padding: 15px; font-size: 1.1rem; border: none; border-radius: 5px; background: #555; color: white; cursor: pointer; }
    button:hover { background: #777; }
    .op { background: #D4AF37; color: #000; }
  </style>
</head>
<body>
  <div class="calc">
    <div class="ecran" id="ecran">0</div>
    <div class="touches">
      <button onclick="clearE()">C</button>
      <button onclick="append('/')">/</button>
      <button onclick="append('*')">*</button>
      <button class="op" onclick="append('-')">-</button>
      <button onclick="append('7')">7</button>
      <button onclick="append('8')">8</button>
      <button onclick="append('9')">9</button>
      <button class="op" onclick="append('+')">+</button>
      <button onclick="append('4')">4</button>
      <button onclick="append('5')">5</button>
      <button onclick="append('6')">6</button>
      <button class="op" onclick="calculer()">=</button>
      <button onclick="append('1')">1</button>
      <button onclick="append('2')">2</button>
      <button onclick="append('3')">3</button>
      <button onclick="append('0')">0</button>
    </div>
  </div>
  <script>
    let ecran = document.getElementById('ecran');
    function append(val) { if(ecran.innerText === '0') ecran.innerText = val; else ecran.innerText += val; }
    function clearE() { ecran.innerText = '0'; }
    function calculer() { try { ecran.innerText = eval(ecran.innerText); } catch(e) { ecran.innerText = 'Erreur'; } }
  </script>
</body>
</html>`,
        'login': `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Page de Login</title>
  <style>
    body { display: flex; justify-content: center; align-items: center; height: 100vh; background: #0B2545; margin: 0; font-family: sans-serif; color: white; }
    .box { background: rgba(255,255,255,0.1); padding: 30px; border-radius: 15px; width: 300px; text-align: center; box-shadow: 0 10px 20px rgba(0,0,0,0.3); }
    input { width: 100%; padding: 12px; margin: 10px 0; border: none; border-radius: 8px; box-sizing: border-box; }
    button { width: 100%; padding: 12px; background: #D4AF37; color: #000; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; margin-top: 10px; }
    button:hover { background: #fff; }
  </style>
</head>
<body>
  <div class="box">
    <h2>Connexion</h2>
    <input type="text" placeholder="Nom d'utilisateur">
    <input type="password" placeholder="Mot de passe">
    <button>Se connecter</button>
  </div>
</body>
</html>`,
        'btn': `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Bouton Animé</title>
  <style>
    body { display: flex; justify-content: center; align-items: center; height: 100vh; background: #f4f4f4; margin: 0; }
    .btn { padding: 15px 40px; font-size: 1.2rem; background: #0B2545; color: white; border: none; border-radius: 50px; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 5px 15px rgba(0,0,0,0.2); }
    .btn:hover { background: #D4AF37; color: #000; transform: translateY(-5px) scale(1.1); box-shadow: 0 10px 20px rgba(212, 175, 55, 0.4); }
  </style>
</head>
<body>
  <button class="btn">Survole-moi !</button>
</body>
</html>`,
        'text': `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Texte Stylé</title>
  <style>
    body { display: flex; justify-content: center; align-items: center; height: 100vh; background: #222; margin: 0; font-family: sans-serif; }
    h1 { font-size: 4rem; color: transparent; -webkit-text-stroke: 2px #D4AF37; text-transform: uppercase; letter-spacing: 5px; }
  </style>
</head>
<body>
  <h1>VirtTech</h1>
</body>
</html>`,
        'carte': `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Carte de Profil</title>
  <style>
    body { display: flex; justify-content: center; align-items: center; height: 100vh; background: #e0e0e0; margin: 0; font-family: sans-serif; }
    .card { background: white; width: 250px; padding: 20px; border-radius: 15px; text-align: center; box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
    .avatar { width: 80px; height: 80px; background: #ccc; border-radius: 50%; margin: 0 auto 15px; }
    h3 { margin: 0; color: #333; }
    p { color: #777; font-size: 0.9rem; }
    .btn-follow { background: #0B2545; color: white; border: none; padding: 10px 20px; border-radius: 20px; cursor: pointer; width: 100%; margin-top: 10px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="avatar"></div>
    <h3>Ivan Ipote</h3>
    <p>Développeur Web & Fondateur de VirtTech</p>
    <button class="btn-follow">Suivre</button>
  </div>
</body>
</html>`,
        'anim': `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Animation CSS</title>
  <style>
    body { display: flex; justify-content: center; align-items: center; height: 100vh; background: #111; margin: 0; }
    .cercle { width: 100px; height: 100px; background: #D4AF37; border-radius: 50%; animation: pulse 2s infinite; }
    @keyframes pulse { 0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(212,175,55, 0.7); } 70% { transform: scale(1.1); box-shadow: 0 0 0 20px rgba(212,175,55, 0); } 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(212,175,55, 0); } }
  </style>
</head>
<body>
  <div class="cercle"></div>
</body>
</html>`,
        'menu': `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Menu Burger</title>
  <style>
    body { margin: 0; font-family: sans-serif; }
    .navbar { display: flex; justify-content: space-between; padding: 15px 20px; background: #0B2545; color: white; align-items: center; }
    .menu { display: none; background: #13315C; color: white; padding: 20px; }
    .menu.open { display: block; }
    .menu p { margin: 10px 0; cursor: pointer; }
    button { background: none; border: 2px solid white; color: white; padding: 5px 10px; border-radius: 5px; cursor: pointer; }
  </style>
</head>
<body>
  <div class="navbar">
    <span>Mon Site</span>
    <button onclick="toggleMenu()">☰</button>
  </div>
  <div class="menu" id="menu">
    <p>Accueil</p>
    <p>Services</p>
    <p>Contact</p>
  </div>
  <script>
    function toggleMenu() {
      document.getElementById('menu').classList.toggle('open');
    }
  </script>
</body>
</html>`,
        'form': `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Formulaire de Contact</title>
  <style>
    body { display: flex; justify-content: center; align-items: center; height: 100vh; background: #f4f4f4; margin: 0; font-family: sans-serif; }
    form { background: white; padding: 25px; border-radius: 10px; width: 300px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
    h2 { text-align: center; margin-top: 0; }
    input, textarea { width: 100%; padding: 10px; margin: 8px 0; border: 1px solid #ddd; border-radius: 5px; box-sizing: border-box; }
    button { width: 100%; padding: 10px; background: #D4AF37; border: none; border-radius: 5px; font-weight: bold; cursor: pointer; }
  </style>
</head>
<body>
  <form>
    <h2>Contact</h2>
    <input type="text" placeholder="Nom">
    <input type="email" placeholder="Email">
    <textarea rows="4" placeholder="Message"></textarea>
    <button>Envoyer</button>
  </form>
</body>
</html>`,
        'galerie': `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Galerie</title>
  <style>
    body { background: #222; margin: 0; padding: 20px; }
    .galerie { display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 10px; }
    .photo { background: #444; height: 100px; border-radius: 8px; transition: transform 0.3s; }
    .photo:hover { transform: scale(1.05); background: #D4AF37; }
  </style>
</head>
<body>
  <div class="galerie">
    <div class="photo"></div>
    <div class="photo"></div>
    <div class="photo"></div>
    <div class="photo"></div>
    <div class="photo"></div>
    <div class="photo"></div>
  </div>
</body>
</html>`,
        'chrono': `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Chronomètre</title>
  <style>
    body { display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100vh; background: #111; color: white; margin: 0; font-family: monospace; }
    .temps { font-size: 4rem; margin-bottom: 20px; }
    button { padding: 10px 20px; margin: 0 5px; font-size: 1rem; cursor: pointer; border-radius: 5px; border: none; }
    #start { background: #4CAF50; color: white; }
    #stop { background: #f44336; color: white; }
  </style>
</head>
<body>
  <div class="temps" id="affichage">00:00:00</div>
  <div>
    <button id="start">Démarrer</button>
    <button id="stop">Arrêter</button>
  </div>
  <script>
    let sec = 0; let interval;
    function format(t) { return t < 10 ? '0' + t : t; }
    document.getElementById('start').onclick = function() {
      clearInterval(interval);
      interval = setInterval(() => {
        sec++;
        let h = Math.floor(sec/3600), m = Math.floor((sec%3600)/60), s = sec%60;
        document.getElementById('affichage').innerText = format(h)+':'+format(m)+':'+format(s);
      }, 1000);
    };
    document.getElementById('stop').onclick = function() { clearInterval(interval); };
  </script>
</body>
</html>`
    };

    // Injection des projets
    document.querySelectorAll('[data-project]').forEach(btn => {
        btn.addEventListener('click', function() {
            const projKey = this.getAttribute('data-project');
            if(projets[projKey]) {
                // Remplace TOUT le code de l'éditeur par le projet
                editor.setValue(projets[projKey]);
                // Met à jour l'aperçu PC
                mettreAJourPreviewPC();
            }
        });
    });

    // Injection des balises basiques
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

    // --- LANCEMENT ---
    init();
});