// --- historique.js : Scripts de la page historique ---

document.addEventListener("DOMContentLoaded", function() {
    
    // ==========================================
    // 1. DONNEES DES ACTIVITES (Le contenu du slide)
    // ==========================================
    const activites = {
        'virtdev': {
            titre: "🏆 Concours Virt_Dev",
            contenu: `
                <h4>📅 Déroulement</h4>
                <p>Du 30 octobre au 4 novembre 2026. Les participants devaient reproduire une maquette de page de connexion (Login Page) en HTML et CSS. L'utilisation de l'IA était autorisée.</p>
                
                <h4>🥇 Les Gagnants</h4>
                <div class="badge-gagnant">1ère Place : Horo David (2 000 F CFA)</div><br>
                <div class="badge-gagnant" style="background:var(--surface); color:var(--ombre);">2ème Place : Koudouss (1 000 F CFA)</div>
                <p style="margin-top:10px; font-size:0.85rem;">Les paiements ont été effectués par Mobile Money (Wave) en direct sur le groupe WhatsApp.</p>

                <h4>⚖️ Décision du Jury</h4>
                <p>Le jury a départagé les deux candidats sur la base de plusieurs critères :</p>
                <ul>
                    <li>L'intégration du logo via la technique du <strong>Base64</strong> (Horo).</li>
                    <li>L'ajout d'<strong>animations 3D</strong> et d'effets de survol très fluides (Horo).</li>
                    <li>La propreté générale du code (Les deux candidats).</li>
                </ul>

                <h4>💰 Bilan Financier</h4>
                <p>Frais d'inscription : 1 000 F CFA (2 x 500 F).<br>
                Prix distribués : 3 000 F CFA (complétés par le fondateur).</p>

                <a href="resultats.html" class="lien-resultats">Voir la page des résultats complète ➔</a>
            `
        }
    };

    // ==========================================
    // 2. LOGIQUE DU SLIDE
    // ==========================================
    const overlay = document.getElementById('slide-overlay');
    const panel = document.getElementById('slide-panel');
    const title = document.getElementById('slide-title');
    const contenu = document.getElementById('slide-contenu');

    window.ouvrirSlide = function(id) {
        const data = activites[id];
        if (!data) return;

        title.innerText = data.titre;
        contenu.innerHTML = data.contenu;

        overlay.classList.add('ouvert');
        panel.classList.add('ouvert');
        document.body.style.overflow = 'hidden';
        
        // On remonte le scroll du slide à zéro à chaque ouverture
        contenu.scrollTop = 0; 
    }

    window.fermerSlide = function() {
        overlay.classList.remove('ouvert');
        panel.classList.remove('ouvert');
        document.body.style.overflow = '';
    }

    // ==========================================
    // 3. ANIMATIONS AU DEFILEMENT
    // ==========================================
    var els = document.querySelectorAll('.reveal');
    if('IntersectionObserver' in window){
        var io = new IntersectionObserver(function(entries){
            entries.forEach(function(entry){
                if(entry.isIntersecting){
                    entry.target.classList.add('vu');
                    io.unobserve(entry.target);
                }
            });
        }, {threshold: .12});
        
        els.forEach(function(e){ io.observe(e); });
    } else {
        els.forEach(function(e){ e.classList.add('vu'); });
    }
});