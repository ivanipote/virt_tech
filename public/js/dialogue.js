// --- dialogue.js ---
// Overlay de confirmation / information, réutilisable sur tout le site.
// Règle VirtTech : jamais alert() / confirm() / prompt().

(function () {
    'use strict';

    if (window.VirtDialogue) return;

    let styleInjecte = false;

    function injecterStyle() {
        if (styleInjecte) return;
        styleInjecte = true;

        const style = document.createElement('style');
        style.textContent = [
            '.vd-overlay{position:fixed;inset:0;z-index:3000;background:rgba(22,31,39,.78);backdrop-filter:blur(3px);display:flex;align-items:center;justify-content:center;padding:18px}',
            '.vd-boite{width:100%;max-width:400px;background:#fff;border-radius:16px;padding:20px;box-shadow:0 20px 60px rgba(0,0,0,.45);animation:vdIn .22s ease}',
            '@keyframes vdIn{from{opacity:0;transform:translateY(10px) scale(.98)}to{opacity:1;transform:none}}',
            '.vd-titre{margin:0 0 10px;font-size:1rem;color:#161F27}',
            '.vd-message{margin:0 0 16px;font-size:.88rem;line-height:1.55;color:#3F4C55;white-space:pre-wrap}',
            '.vd-actions{display:flex;gap:8px}',
            '.vd-btn{flex:1;padding:12px;border-radius:10px;font-weight:800;font-size:.85rem;cursor:pointer;border:2px solid transparent;font-family:inherit;transition:background .2s,color .2s,border-color .2s}',
            '.vd-annuler{background:transparent;border-color:#dfe5e9;color:#323F48}',
            '.vd-annuler:hover{background:#f1f4f6}',
            '.vd-confirmer{background:#323F48;border-color:#323F48;color:#fff}',
            '.vd-confirmer:hover{background:#D4AF37;border-color:#D4AF37;color:#161F27}',
            '.vd-danger{background:#c0392b;border-color:#c0392b;color:#fff}',
            '.vd-danger:hover{background:#a93226;border-color:#a93226}',
            '@media (prefers-reduced-motion: reduce){.vd-boite{animation:none}}'
        ].join('\n');

        document.head.appendChild(style);
    }

    function creer(demande) {
        injecterStyle();

        return new Promise(function (resolve) {
            const ancienOverflow = document.body.style.overflow;

            const overlay = document.createElement('div');
            overlay.className = 'vd-overlay';
            overlay.setAttribute('role', 'dialog');
            overlay.setAttribute('aria-modal', 'true');

            const boite = document.createElement('div');
            boite.className = 'vd-boite';

            const titre = document.createElement('h3');
            titre.className = 'vd-titre';
            titre.textContent = demande.titre || 'Confirmation';

            const message = document.createElement('p');
            message.className = 'vd-message';
            message.textContent = demande.message || '';

            const actions = document.createElement('div');
            actions.className = 'vd-actions';

            const annuler = document.createElement('button');
            annuler.type = 'button';
            annuler.className = 'vd-btn vd-annuler';
            annuler.textContent = demande.annuler || 'Annuler';

            const confirmer = document.createElement('button');
            confirmer.type = 'button';
            confirmer.className = 'vd-btn ' + (demande.danger ? 'vd-danger' : 'vd-confirmer');
            confirmer.textContent = demande.confirmer || 'Confirmer';

            actions.append(annuler, confirmer);
            boite.append(titre, message, actions);
            overlay.appendChild(boite);

            let ferme = false;

            function fermer(resultat) {
                if (ferme) return;
                ferme = true;

                document.removeEventListener('keydown', surTouche);
                overlay.remove();
                document.body.style.overflow = ancienOverflow;
                resolve(resultat);
            }

            function surTouche(e) {
                if (e.key === 'Escape') fermer(false);
            }

            annuler.addEventListener('click', function () { fermer(false); });
            confirmer.addEventListener('click', function () { fermer(true); });
            overlay.addEventListener('click', function (e) {
                if (e.target === overlay) fermer(false);
            });
            document.addEventListener('keydown', surTouche);

            document.body.appendChild(overlay);
            document.body.style.overflow = 'hidden';

            setTimeout(function () { annuler.focus(); }, 30);
        });
    }

    window.VirtDialogue = {
        confirmer: function (demande) {
            return creer(Object.assign({ danger: true }, demande || {}));
        },
        info: function (demande) {
            return creer({
                titre: (demande && demande.titre) || 'Information',
                message: (demande && demande.message) || '',
                annuler: 'Fermer',
                confirmer: 'Compris',
                danger: false
            });
        }
    };
})();
