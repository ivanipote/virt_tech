// --- virtemulator.js ---

document.addEventListener("DOMContentLoaded", function() {
    // 1. Initialisation de CodeMirror
    const textarea = document.getElementById('codeInput');
    const editor = CodeMirror.fromTextArea(textarea, {
        mode: "htmlmixed", // Reconnaît HTML, CSS et JS
        theme: "dracula",  // Thème sombre
        lineNumbers: true, // Numéros de ligne
        lineWrapping: false, // Pas de retour à la ligne (pour le scroll X)
        indentUnit: 2,
        tabSize: 2,
        viewportMargin: Infinity
    });

    // On attache l'éditeur au conteneur
    document.querySelector('.emulator-wrapper').appendChild(editor.getWrapperElement());

    // 2. Logique du Slide
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
        
        // On remet le zoom à 1 par défaut à chaque ouverture
        zoomLevel = 1;
        updateZoom();
    };

    function fermerSlide() {
        overlay.classList.remove('ouvert');
        panel.classList.remove('ouvert');
    }
    
    btnFermer.onclick = fermerSlide;
    overlay.onclick = fermerSlide;

    // 3. Logique du Zoom (Option A)
    let zoomLevel = 1;
    const iphoneFrame = document.querySelector('.iphone-frame');
    const btnZoomIn = document.getElementById('btnZoomIn');
    const btnZoomOut = document.getElementById('btnZoomOut');

    function updateZoom() {
        // On applique le zoom via transform: scale()
        iphoneFrame.style.transform = `scale(${zoomLevel})`;
    }

    btnZoomIn.onclick = function() {
        if (zoomLevel < 1.5) { // Limite max
            zoomLevel += 0.1;
            updateZoom();
        }
    };

    btnZoomOut.onclick = function() {
        if (zoomLevel > 0.5) { // Limite min
            zoomLevel -= 0.1;
            updateZoom();
        }
    };
});