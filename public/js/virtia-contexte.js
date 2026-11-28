// --- virtia-contexte.js ---
// Contexte projet pour VirtIA : arborescence + fichiers utiles (lecture seule).

(function () {
    'use strict';

    if (window.VirtContexte) return;

    const MAX = 10000;

    function dossierDe(chemin) {
        return chemin.indexOf('/') !== -1 ? chemin.slice(0, chemin.lastIndexOf('/')) : '';
    }

    window.VirtContexte = function (question) {
        if (!window.VirtProjet) return '';

        const fichiers = window.VirtProjet.fichiers() || {};
        const actif = window.VirtProjet.actif() || '';

        const blocs = [];
        const choisis = [];
        let total = 0;

        const lignesArbre = [];
        (function parcourir(noeud, profondeur) {
            (noeud.enfants || []).forEach(function (e) {
                lignesArbre.push(new Array(profondeur + 1).join('  ') + e.nom + (e.type === 'dossier' ? '/' : ''));
                if (e.type === 'dossier') parcourir(e, profondeur + 1);
            });
        })(window.VirtProjet.arbre(), 0);

        function ajouter(chemin, max, numeroter) {
            if (!chemin || choisis.indexOf(chemin) !== -1) return;
            if (fichiers[chemin] === undefined) return;
            if (window.VirtProjet.estMedia(chemin)) return;
            if (choisis.length >= 6) return;

            let contenu = String(fichiers[chemin] || '');
            if (contenu.length > max) contenu = contenu.slice(0, max) + '\n⬦ (tronqué)';

            if (numeroter) {
                contenu = contenu.split('\n').map(function (l, i) {
                    return (i + 1) + ' ' + l;
                }).join('\n');
            }
            if (total + contenu.length > MAX) return;

            choisis.push(chemin);
            total += contenu.length;
            blocs.push('--- Fichier : ' + chemin + (numeroter ? ' (num�ros de ligne)' : '') + ' ---\n' + contenu);
        }

        // 1. Fichier actif
        ajouter(actif, 4000, true);

        // 2. Fichiers liés (CSS / JS / images de la page active)
        const contenuActif = String(fichiers[actif] || '');
        const motif = /(?:href|src)\s*=\s*["']([^"']+)["']/gi;
        let m;

        while ((m = motif.exec(contenuActif)) !== null) {
            const cible = window.VirtProjet.resoudre(dossierDe(actif), m[1]);
            if (cible !== null && fichiers[cible] !== undefined) ajouter(cible, 2000);
        }

        // 3. Fichiers concernés par la question
        const mots = (String(question).toLowerCase().match(/[a-z0-9]{4,}/g) || []).filter(function (mot) {
            return [
                'dans', 'avec', 'pour', 'cette', 'mon', 'mes', 'les', 'des', 'une', 'est',
                'que', 'qui', 'quoi', 'comment', 'pourquoi', 'peux', 'fait', 'faire',
                'projet', 'fichier', 'fichiers', 'page', 'code'
            ].indexOf(mot) === -1;
        });

        const scores = [];

        Object.keys(fichiers).forEach(function (chemin) {
            if (window.VirtProjet.estMedia(chemin)) return;
            if (chemin === actif) return;

            let score = 0;
            const base = chemin.split('/').pop().toLowerCase();
            const contenu = String(fichiers[chemin] || '').toLowerCase();

            mots.forEach(function (mot) {
                if (base.indexOf(mot) !== -1) score += 6;
                if (contenu.indexOf(mot) !== -1) score += 1;
            });

            if (score > 0) scores.push({ chemin: chemin, score: score });
        });

        scores.sort(function (a, b) { return b.score - a.score; });
        scores.forEach(function (s) { ajouter(s.chemin, 2000); });

        const entete = 'Arborescence du projet :\n' + lignesArbre.join('\n') + '\n';
        return blocs.length ? entete + '\n' + blocs.join('\n\n') : entete;
    };
})();
