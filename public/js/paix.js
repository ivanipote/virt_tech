document.addEventListener("DOMContentLoaded", function() {
    let deviceId = localStorage.getItem('virttech_device_id');
    if (!deviceId) {
        deviceId = 'device_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('virttech_device_id', deviceId);
    }

    const grille = document.getElementById('grilleHistoires');
    let filtreActuel = 'toutes';
    let idASupprimer = null; // Variable pour stocker l'ID de l'histoire à supprimer

    // 1. CHARGER LES HISTOIRES
    async function chargerHistoires() {
        grille.innerHTML = '<div class="loading">Chargement des histoires...</div>';
        try {
            const response = await fetch(`/api/paix/histoires?device_id=${deviceId}&filtre=${filtreActuel}`);
            const data = await response.json();

            if (data.succes) {
                afficherHistoires(data.data);
            } else {
                grille.innerHTML = `<div class="loading">Erreur : ${data.message}</div>`;
            }
        } catch (error) {
            grille.innerHTML = `<div class="loading">Erreur de connexion.</div>`;
        }
    }

    // 2. AFFICHER LES HISTOIRES
    function afficherHistoires(histoires) {
        grille.innerHTML = '';
        if (histoires.length === 0) {
            grille.innerHTML = '<div class="loading">Aucune histoire pour le moment.</div>';
            return;
        }

        histoires.forEach(h => {
            const carte = document.createElement('div');
            carte.className = 'carte-paix';
            const dejaLike = h.a_deja_like;
            
            // Si on est dans "Mes histoires", on ajoute le bouton supprimer
            let boutonSupprimer = '';
            if (filtreActuel === 'miennes') {
                boutonSupprimer = `
                    <button class="btn-delete" data-id="${h.id}">
                        🗑️ Supprimer
                    </button>
                `;
            }

            carte.innerHTML = `
                <p class="histoire">"${h.contenu}"</p>
                <div class="pied">
                    <span class="pseudo">— ${h.auteur}</span>
                    <div class="actions">
                        ${boutonSupprimer}
                        <button class="btn-like ${dejaLike ? 'deja-like' : ''}" data-id="${h.id}">
                            <span class="coeur">${dejaLike ? '❤️' : '🤍'}</span>
                            <span class="compteur">${h.likes}</span>
                        </button>
                    </div>
                </div>
            `;
            grille.appendChild(carte);
        });

        // Événements Like
        document.querySelectorAll('.btn-like').forEach(btn => {
            btn.addEventListener('click', async function() {
                const id = this.getAttribute('data-id');
                if (this.classList.contains('deja-like')) return;
                try {
                    const response = await fetch(`/api/paix/like/${id}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ device_id: deviceId })
                    });
                    const data = await response.json();
                    if (data.succes) {
                        this.classList.add('deja-like');
                        this.querySelector('.coeur').innerText = '❤️';
                        this.querySelector('.compteur').innerText = data.likes;
                    }
                } catch (error) { console.error(error); }
            });
        });

        // Événements Supprimer (Ouvre le modal)
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', function() {
                idASupprimer = this.getAttribute('data-id');
                document.getElementById('modalDelete').classList.add('ouvert');
            });
        });
    }

    // 3. GESTION DU MODAL DE SUPPRESSION
    const modalDelete = document.getElementById('modalDelete');
    
    document.getElementById('btnAnnulerDelete').addEventListener('click', () => {
        modalDelete.classList.remove('ouvert');
        idASupprimer = null;
    });

    document.getElementById('btnValiderDelete').addEventListener('click', async function() {
        if (!idASupprimer) return;

        const btn = this;
        btn.innerText = "Suppression...";

        try {
            const response = await fetch(`/api/paix/histoires/${idASupprimer}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ device_id: deviceId })
            });
            const data = await response.json();

            if (data.succes) {
                modalDelete.classList.remove('ouvert');
                chargerHistoires(); // Recharge la liste
            } else {
                alert(data.message);
            }
        } catch (error) {
            alert("Erreur de connexion.");
        } finally {
            btn.innerText = "Supprimer";
            idASupprimer = null;
        }
    });

    // 4. GESTION DES FILTRES
    document.getElementById('btnToutes').addEventListener('click', function() {
        this.classList.add('actif');
        document.getElementById('btnMiennes').classList.remove('actif');
        filtreActuel = 'toutes';
        chargerHistoires();
    });

    document.getElementById('btnMiennes').addEventListener('click', function() {
        this.classList.add('actif');
        document.getElementById('btnToutes').classList.remove('actif');
        filtreActuel = 'miennes';
        chargerHistoires();
    });

    // 5. GESTION DU MODAL D'ECRITURE
    const modalStory = document.getElementById('modalStory');
    document.getElementById('btnStory').addEventListener('click', () => modalStory.classList.add('ouvert'));
    document.getElementById('btnFermerModal').addEventListener('click', () => modalStory.classList.remove('ouvert'));

    // 6. ENVOI D'UNE HISTOIRE
    document.getElementById('btnEnvoyerStory').addEventListener('click', async function() {
        const texte = document.getElementById('histoireTexte').value;
        const pseudo = document.getElementById('pseudo').value || 'Anonyme';
        if (!texte.trim()) { alert("Veuillez écrire une histoire."); return; }

        const btn = this;
        btn.disabled = true;
        btn.innerText = "Envoi...";

        try {
            const response = await fetch('/api/paix/histoires', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contenu: texte, device_id: deviceId, auteur: pseudo })
            });
            const data = await response.json();
            if (data.succes) {
                document.getElementById('histoireTexte').value = '';
                document.getElementById('pseudo').value = '';
                modalStory.classList.remove('ouvert');
                chargerHistoires();
            } else {
                alert(data.message);
            }
        } catch (error) {
            alert("Erreur de connexion.");
        } finally {
            btn.disabled = false;
            btn.innerText = "Envoyer mon histoire";
        }
    });

    chargerHistoires();
});