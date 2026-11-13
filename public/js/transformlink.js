// --- transformlink.js ---
document.addEventListener("DOMContentLoaded", function() {
    const btn = document.getElementById('btnRaccourcir');
    const resultatBox = document.getElementById('resultatBox');
    const lienCourt = document.getElementById('lienCourt');
    const errorMsg = document.getElementById('errorMsg');
    const btnCopier = document.getElementById('btnCopier');

    if (btn) {
        btn.addEventListener('click', async function() {
            const url = document.getElementById('urlOriginale').value;
            const code = document.getElementById('codePersonnalise').value;

            resultatBox.classList.remove('visible');
            errorMsg.innerText = "";
            lienCourt.innerText = "";

            if (!url) {
                errorMsg.innerText = "Veuillez entrer un lien long.";
                return;
            }

            btn.disabled = true;
            btn.innerHTML = "<span>Création en cours...</span>";

            try {
                const response = await fetch('/api/shorten', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url: url, code: code })
                });

                const data = await response.json();

                if (data.succes) {
                    lienCourt.innerText = data.short_url;
                    resultatBox.classList.add('visible');
                } else {
                    errorMsg.innerText = data.message;
                }
            } catch (error) {
                errorMsg.innerText = "Erreur de connexion au serveur.";
            } finally {
                btn.disabled = false;
                btn.innerHTML = `<span>Créer le lien</span><svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>`;
            }
        });
    }

    if (btnCopier) {
        btnCopier.addEventListener('click', function() {
            const lien = lienCourt.innerText;
            if (lien) {
                navigator.clipboard.writeText(lien).then(() => {
                    this.innerText = "✅ Copié !";
                    setTimeout(() => { this.innerText = "📋 Copier"; }, 2000);
                });
            }
        });
    }

    // Animations
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