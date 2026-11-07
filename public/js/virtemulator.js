// --- virtemulator.js ---
document.addEventListener("DOMContentLoaded", function() {
    let files = {}; 
    let activeFile = "index.html";
    let editor;
    let zoomLevel = 1;
    const iphoneFrame = document.querySelector('.iphone-frame');

    // --- INITIALISATION ---
    function init() {
        // 1. On charge les fichiers sauvegardés s'ils existent
        const savedFiles = localStorage.getItem('virtemulator_files');
        if (savedFiles) {
            try {
                files = JSON.parse(savedFiles);
            } catch (e) {
                console.error("Erreur de lecture du localStorage", e);
                files = {};
            }
        }
        
        // 2. Si aucun fichier n'est trouvé, on crée l'index.html par défaut
        if (!files["index.html"]) {
            files["index.html"] = `<!DOCTYPE html>
<html>
<head><title>Mon site</title></head>
<body>
  <h1>Bienvenue sur VirtEmulator !</h1>
  <p>Crée un nouveau fichier avec le bouton +</p>
</body>
</html>`;
        }

        // 3. Initialisation de CodeMirror
        editor = CodeMirror.fromTextArea(document.getElementById('codeInput'), {
            mode: "htmlmixed", theme: "dracula", lineNumbers: true,
            lineWrapping: false, indentUnit: 2, tabSize: 2, viewportMargin: Infinity,
            autoCloseBrackets: true, autoCloseTags: true, matchBrackets: true
        });
        document.getElementById('editorBody').appendChild(editor.getWrapperElement());

        // 4. On ouvre le premier fichier (ou l'index.html)
        ouvrirFichier(files["index.html"] ? "index.html" : Object.keys(files)[0]);
        mettreAJourOnglets();
        
        // 5. Horloge Android
        function updateTime() {
            const now = new Date();
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const timeElement = document.querySelector('.status-time');
            if (timeElement) timeElement.textContent = `${hours}:${minutes}`;
        }
        setInterval(updateTime, 1000);
        updateTime();

        // 6. SAUVEGARDE INSTANTANÉE À CHAQUE FRAPPE
        editor.on('change', function() {
            files[activeFile] = editor.getValue();
            localStorage.setItem('virtemulator_files', JSON.stringify(files));
        });
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
    }

    function supprimerFichier(nomFichier) {
        if (Object.keys(files).length <= 1) {
            alert("Tu ne peux pas supprimer le dernier fichier.");
            return;
        }
        delete files[nomFichier];
        if (activeFile === nomFichier) {
            activeFile = Object.keys(files)[0];
        }
        ouvrirFichier(activeFile);
    }

    // --- CREATION DE FICHIER (MODAL) ---
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
        if (files[nom]) {
            alert("Ce fichier existe déjà !");
            return;
        }
        files[nom] = `<!DOCTYPE html>\n<html>\n<head><title>${nom}</title></head>\n<body>\n  <h1>Fichier ${nom}</h1>\n</body>\n</html>`;
        overlayCreate.classList.remove('ouvert');
        ouvrirFichier(nom);
    };

    // --- BOUTON PLAY (Aperçu) ---
    document.getElementById('btnPlay').onclick = () => {
        const code = editor.getValue();
        const doc = document.getElementById('mobileIframe').contentDocument;
        doc.open(); doc.write(code); doc.close();

        document.getElementById('slideTitle').textContent = "Aperçu de " + activeFile;
        document.getElementById('slideOverlay').classList.add('ouvert');
        document.getElementById('slidePanel').classList.add('ouvert');
        zoomLevel = 1; updateZoom();
    };

    // --- GESTION DU SLIDE ---
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
    function updateZoom() { iphoneFrame.style.transform = `scale(${zoomLevel})`; }
    btnZoomIn.onclick = () => { if (zoomLevel < 1.5) { zoomLevel += 0.1; updateZoom(); } };
    btnZoomOut.onclick = () => { if (zoomLevel > 0.5) { zoomLevel -= 0.1; updateZoom(); } };

    // --- BOUTONS SAVE ET EXPORT ---
    const btnSave = document.getElementById('btnSaveCode');
    const btnExport = document.getElementById('btnExportCode');

    if (btnSave) {
        btnSave.onclick = function() {
            files[activeFile] = editor.getValue();
            localStorage.setItem('virtemulator_files', JSON.stringify(files));
            
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
            a.href = url;
            a.download = activeFile;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            btnExport.innerHTML = "✅ Exporté";
            setTimeout(() => {
                btnExport.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg> Exporter`;
            }, 2000);
        };
    }

    // --- LANCEMENT ---
    init();
});