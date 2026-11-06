// --- contact.js : Logique du formulaire de contact ---

document.addEventListener("DOMContentLoaded", function() {
    
    // 1. GESTION DU FORMULAIRE
    const form = document.getElementById('formContact');
    const btn = document.getElementById('btnEnvoyer');
    const rep = document.getElementById('reponse');

    if(form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const data = {
                nom: document.getElementById('nom').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value
            };

            // État de chargement
            btn.disabled = true;
            btn.innerHTML = "<span>Envoi en cours...</span>";
            rep.className = "reponse-message";
            rep.innerText = "";

            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (result.succes) {
                    rep.innerText = "✅ " + result.message;
                    rep.className = "reponse-message succes";
                    form.reset();
                } else {
                    rep.innerText = "❌ " + result.message;
                    rep.className = "reponse-message erreur";
                }
            } catch (error) {
                rep.innerText = "❌ Erreur de connexion au serveur.";
                rep.className = "reponse-message erreur";
            } finally {
                // Remettre le bouton en état initial
                btn.disabled = false;
                btn.innerHTML = "<span>Envoyer le message</span><svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><line x1='22' y1='2' x2='11' y2='13'></line><polygon points='22 2 15 22 11 13 2 9 22 2'></polygon></svg>";
            }
        });
    }

    // 2. ANIMATIONS AU DEFILEMENT
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