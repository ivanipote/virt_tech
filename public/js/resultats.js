// --- resultats.js : Scripts spécifiques à la page des résultats ---

document.addEventListener("DOMContentLoaded", function() {
    
    // ==========================================
    // 1. GESTION DU SLIDE (Voir les pages)
    // ==========================================
    const overlay = document.getElementById('slide-overlay');
    const panel = document.getElementById('slide-panel');
    const title = document.getElementById('slide-title');
    const iframe = document.getElementById('slide-iframe');
    const btnFermer = document.getElementById('btn-fermer-slide');
    const boutons = document.querySelectorAll('.btn-ouvrir-slide');

    function ouvrirSlide(src, titre) {
        title.textContent = titre;
        iframe.src = src;
        overlay.classList.add('ouvert');
        panel.classList.add('ouvert');
        document.body.style.overflow = 'hidden'; // Empêche le scroll de la page derrière
    }

    function fermerSlide() {
        overlay.classList.remove('ouvert');
        panel.classList.remove('ouvert');
        document.body.style.overflow = ''; // Rétablit le scroll
        // On vide l'iframe après la transition pour arrêter les animations en fond
        setTimeout(() => { iframe.src = ''; }, 400); 
    }

    boutons.forEach(btn => {
        btn.addEventListener('click', function() {
            const src = this.getAttribute('data-target');
            const titre = this.getAttribute('data-title');
            ouvrirSlide(src, titre);
        });
    });

    if(btnFermer) btnFermer.addEventListener('click', fermerSlide);
    if(overlay) overlay.addEventListener('click', fermerSlide);

    // ==========================================
    // 2. ANIMATIONS AU DEFILEMENT (Intersection Observer)
    // ==========================================
    var els = document.querySelectorAll('.reveal');
    
    if('IntersectionObserver' in window){
        var io = new IntersectionObserver(function(entries){
            entries.forEach(function(entry){
                if(entry.isIntersecting){
                    entry.target.classList.add('vu');
                    io.unobserve(entry.target); // On arrête d'observer une fois l'animation jouée
                }
            });
        }, {threshold: .12});
        
        els.forEach(function(e){ io.observe(e); });
    } else {
        // Si le navigateur est ancien, on affiche tout direct
        els.forEach(function(e){ e.classList.add('vu'); });
    }
});