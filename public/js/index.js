// --- index.js : Scripts spécifiques à la page d'accueil ---

document.addEventListener("DOMContentLoaded", function() {
    // On sélectionne tous les éléments qui ont la classe "reveal"
    var els = document.querySelectorAll('.reveal');
    
    // On vérifie si le navigateur supporte l'IntersectionObserver (API moderne pour détecter le défilement)
    if('IntersectionObserver' in window){
        var io = new IntersectionObserver(function(entries){
            entries.forEach(function(entry){
                if(entry.isIntersecting){
                    // Si l'élément est visible à l'écran, on ajoute la classe "vu" (qui le rend visible avec l'animation CSS)
                    entry.target.classList.add('vu');
                    // On arrête d'observer cet élément (il n'a plus besoin d'être animé)
                    io.unobserve(entry.target);
                }
            });
        }, {threshold: .12}); // Se déclenche quand 12% de l'élément est visible
        
        els.forEach(function(e){ io.observe(e); });
    } else {
        // Si le navigateur est ancien (ne supporte pas IntersectionObserver), on affiche tout directement
        els.forEach(function(e){ e.classList.add('vu'); });
    }
});