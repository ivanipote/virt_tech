// --- index.js : Scripts spécifiques à la page d'accueil ---

document.addEventListener("DOMContentLoaded", function() {

    // 1. ANIMATION DU TITRE "VIRTTECH" (lettre par lettre)
    // Le texte est déjà écrit dans le HTML (bon pour le SEO et si le JS ne charge pas) :
    // on le découpe simplement en lettres pour l'animation.
    function animerTexte() {
        const container = document.getElementById('titreAnim');
        if (!container) return;

        // On respecte le réglage système "réduire les animations"
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        const texteComplet = (container.textContent || '').trim() || 'VirtTech';
        container.innerHTML = '';

        for (let i = 0; i < texteComplet.length; i++) {
            const span = document.createElement('span');
            span.classList.add('lettre');
            span.textContent = texteComplet[i];
            span.style.animationDelay = (i * 0.15) + 's';
            container.appendChild(span);
        }
    }

    animerTexte();

    // 2. ANIMATIONS AU DÉFILEMENT (IntersectionObserver)
    var els = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('vu');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: .12 });

        els.forEach(function(e) { io.observe(e); });
    } else {
        // Navigateur ancien : on affiche tout directement
        els.forEach(function(e) { e.classList.add('vu'); });
    }
});
