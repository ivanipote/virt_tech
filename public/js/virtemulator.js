// --- virtemulator.js ---

document.addEventListener("DOMContentLoaded", function() {
    // Récupération du code sauvegardé s'il existe
    const codeSauvegarde = localStorage.getItem('virttech_code_sauvegarde');
    const codeParDefaut = document.getElementById('codeInput').value;
    
    // Initialisation de CodeMirror dans le conteneur .editor-body
    const textarea = document.getElementById('codeInput');
    const editor = CodeMirror.fromTextArea(textarea, {
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

    // On attache l'éditeur au conteneur
    document.querySelector('.editor-body').appendChild(editor.getWrapperElement());

    // Chargement du code
    if (codeSauvegarde) {
        editor.setValue(codeSauvegarde);
    } else {
        editor.setValue(codeParDefaut);
    }

    // Logique du Slide
    const btnPlay = document.getElementById('btnPlay');
    const overlay = document.getElementById('slideOverlay');
    const panel = document.getElementById('slidePanel');
    const btnFermer = document.getElementById('btnFermerSlide');
    const mobileIframe = document.getElementById('mobileIframe');

    btnPlay.onclick = function() {
        const code = editor.getValue();
        const doc = mobileIframe.contentDocument || mobileIframe.contentWindow.document;
        doc.open();
        doc.write(code);
        doc.close();
        
        overlay.classList.add('ouvert');
        panel.classList.add('ouvert');
        
        zoomLevel = 1;
        updateZoom();
    };

    function fermerSlide() {
        overlay.classList.remove('ouvert');
        panel.classList.remove('ouvert');
    }
    
    btnFermer.onclick = fermerSlide;
    overlay.onclick = fermerSlide;

    // Logique du Zoom
    let zoomLevel = 1;
    const iphoneFrame = document.querySelector('.iphone-frame');
    const btnZoomIn = document.getElementById('btnZoomIn');
    const btnZoomOut = document.getElementById('btnZoomOut');

    function updateZoom() {
        iphoneFrame.style.transform = `scale(${zoomLevel})`;
    }

    btnZoomIn.onclick = function() {
        if (zoomLevel < 1.5) { zoomLevel += 0.1; updateZoom(); }
    };

    btnZoomOut.onclick = function() {
        if (zoomLevel > 0.5) { zoomLevel -= 0.1; updateZoom(); }
    };

    // Logique de Sauvegarde
    const btnSave = document.getElementById('btnSaveCode');
    if (btnSave) {
        btnSave.onclick = function() {
            const code = editor.getValue();
            localStorage.setItem('virttech_code_sauvegarde', code);
            
            const blob = new Blob([code], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'mon-code-virttech.html';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            btnSave.innerHTML = "✅ Sauvegardé !";
            setTimeout(() => {
                btnSave.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg> Save`;
            }, 2000);
        };
    }
});