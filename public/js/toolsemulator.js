// --- toolsemulator.js ---
// Gère TOUTE la barre d'outils de VirtEmulator :
// - Les 4 switches (HTML / CSS / JS / Mini-projets)
// - L'insertion des balises HTML / propriétés CSS / éléments JS
// - Le chargement des 20 mini-projets (via window.PROJETS)
//
// Dépend de : CodeMirror (fourni par emulateur.js) + window.PROJETS (projets.js)

(function() {
    'use strict';

    // ==========================================
    // TOAST (partagé avec emulateur.js)
    // ==========================================
    function toast(message, duree) {
        duree = duree || 2000;
        let el = document.getElementById('virtToast');
        if (!el) {
            el = document.createElement('div');
            el.id = 'virtToast';
            el.style.cssText = [
                'position:fixed',
                'bottom:100px',
                'left:50%',
                'transform:translateX(-50%)',
                'background:rgba(11,37,69,0.95)',
                'color:#fff',
                'padding:12px 24px',
                'border-radius:10px',
                'font-size:0.85rem',
                'z-index:9999',
                'box-shadow:0 8px 20px rgba(0,0,0,0.3)',
                'opacity:0',
                'transition:opacity 0.3s',
                'pointer-events:none',
                'border:1px solid #D4AF37',
                'font-family:Segoe UI, sans-serif'
            ].join(';');
            document.body.appendChild(el);
        }
        el.textContent = message;
        el.style.opacity = '1';
        clearTimeout(el._timeout);
        el._timeout = setTimeout(function() {
            el.style.opacity = '0';
        }, duree);
    }
    window.virtToast = toast;

    // ==========================================
    // RÉFÉRENCE À CODEMIRROR (fournie par emulateur.js)
    // ==========================================
    let editor = null;

    window.setEditorInstance = function(instance) {
        editor = instance;
    };

    function getEditor() {
        return editor;
    }

    // ==========================================
    // SÉLECTEUR DE LANGAGE (HTML / CSS / JS / Mini-projets)
    // ==========================================
    function initLangSwitcher() {
        const btnSwitch = document.getElementById('btnSwitch');
        const langMenu = document.getElementById('langMenu');
        if (!btnSwitch || !langMenu) return;

        btnSwitch.addEventListener('click', function(e) {
            e.stopPropagation();
            langMenu.classList.toggle('ouvert');
        });

        document.addEventListener('click', function(e) {
            if (!btnSwitch.contains(e.target) && !langMenu.contains(e.target)) {
                langMenu.classList.remove('ouvert');
            }
        });
    }

    window.setLang = function(lang, btn) {
        const labels = {
            html: 'HTML',
            css: 'CSS',
            js: 'JS',
            projets: 'Mini-projets'
        };

        // Mettre à jour le texte du switch
        const currentLang = document.getElementById('currentLang');
        if (currentLang) {
            currentLang.textContent = labels[lang] || lang.toUpperCase();
        }

        // Mettre à jour le bouton actif dans le menu
        const menu = document.getElementById('langMenu');
        if (menu) {
            const buttons = menu.querySelectorAll('button');
            buttons.forEach(function(b) {
                b.classList.remove('active');
            });
            if (btn) btn.classList.add('active');
        }

        // Afficher le bon groupe de boutons
        const groups = ['html', 'css', 'js', 'projets'];
        groups.forEach(function(g) {
            const grp = document.getElementById('grp-' + g);
            if (!grp) return;
            if (g === lang) {
                grp.classList.add('active');
            } else {
                grp.classList.remove('active');
            }
        });

        // Fermer le menu
        if (menu) menu.classList.remove('ouvert');
    };

    // ==========================================
    // INSERTION DANS CODEMIRROR
    // ==========================================
    function insererTexte(texte) {
        if (!getEditor()) {
            toast('❌ Éditeur non prêt');
            return;
        }

        // Remplacer les \n littéraux par de vrais sauts de ligne
        texte = texte.replace(/\\n/g, '\n');

        const cursor = getEditor().getCursor();
        getEditor().replaceRange(texte, cursor);

        // Placer le curseur à la fin du texte inséré
        const lignes = texte.split('\n');
        const derniereLigne = cursor.line + lignes.length - 1;
        const dernierCh = lignes.length === 1
            ? cursor.ch + texte.length
            : lignes[lignes.length - 1].length;

        getEditor().setCursor({ line: derniereLigne, ch: dernierCh });
        getEditor().focus();
    }

    // ==========================================
    // BOUTONS DE BALISES / PROPRIÉTÉS / FONCTIONS
    // ==========================================
    function initBalises() {
        document.querySelectorAll('.btn-symbol[data-insert]').forEach(function(btn) {
            btn.addEventListener('click', function() {
                const texte = this.getAttribute('data-insert');
                if (!texte) return;
                insererTexte(texte);
            });
        });
    }

    // ==========================================
    // MINI-PROJETS (via window.PROJETS)
    // ==========================================
    let onProjetClick = null;

    window.setOnProjetClick = function(callback) {
        onProjetClick = callback;
    };

    function initProjets() {
        document.querySelectorAll('[data-project]').forEach(function(btn) {
            btn.addEventListener('click', function() {
                const projKey = this.getAttribute('data-project');

                // Vérifier que projets.js est chargé
                if (!window.PROJETS) {
                    toast('❌ projets.js non chargé');
                    console.error('window.PROJETS introuvable. Vérifie que /js/projets.js est inclus AVANT toolsemulator.js');
                    return;
                }

                if (!window.PROJETS[projKey]) {
                    toast('❌ Projet introuvable : ' + projKey);
                    console.error('Projet manquant dans PROJETS :', projKey);
                    return;
                }

                // Déléguer la création du fichier à emulateur.js
                if (typeof onProjetClick === 'function') {
                    onProjetClick(projKey, window.PROJETS[projKey]);
                } else {
                    toast('❌ Gestion projets non initialisée');
                    console.error('setOnProjetClick() non appelé par emulateur.js');
                }
            });
        });
    }

    // ==========================================
    // BOUTONS DE DÉFILEMENT HORIZONTAL
    // ==========================================
    function initScrollButtons() {
        const container = document.getElementById('symbolsContainer');
        const btnLeft = document.getElementById('btnScrollLeft');
        const btnRight = document.getElementById('btnScrollRight');

        if (!container) return;

        if (btnLeft) {
            btnLeft.addEventListener('click', function() {
                container.scrollBy({ left: -200, behavior: 'smooth' });
            });
        }

        if (btnRight) {
            btnRight.addEventListener('click', function() {
                container.scrollBy({ left: 200, behavior: 'smooth' });
            });
        }
    }

    // ==========================================
    // INITIALISATION
    // ==========================================
    function init() {
        initLangSwitcher();
        initBalises();
        initProjets();
        initScrollButtons();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();