// --- cours.js ---
// Page Â« Cours De Base Â» : les cours viennent de l'API (base de donnÃ©es).

document.addEventListener('DOMContentLoaded', function () {
    const liste = document.getElementById('liste-cours');
    const overlay = document.getElementById('slide-overlay');
    const panel = document.getElementById('slide-panel');
    const titre = document.getElementById('slide-title');
    const contenu = document.getElementById('slide-contenu');
    const fermer = document.getElementById('btn-fermer-slide');

    if (!liste) return;

    function colorerCode() {
        if (window.Prism && Prism.highlightAllUnder) {
            try { Prism.highlightAllUnder(contenu); } catch (e) { /* texte brut */ }
        }
    }

    function ajouterBoutonsCopier() {
        contenu.querySelectorAll('.bloc-code').forEach(function (bloc) {
            if (bloc.querySelector('.btn-copier-code')) return;

            const bouton = document.createElement('button');
            bouton.type = 'button';
            bouton.className = 'btn-copier-code';
            bouton.setAttribute('aria-label', 'Copier ce code');
            bouton.innerHTML = '<i class="fa-regular fa-copy" aria-hidden="true"></i> Copier';

            bouton.addEventListener('click', async function (e) {
                e.stopPropagation();

                const code = bloc.querySelector('code');
                let texte;

                if (code) {
                    texte = code.textContent;
                } else {
                    const copie = bloc.cloneNode(true);
                    copie.querySelectorAll('.btn-copier-code').forEach(function (b) { b.remove(); });
                    texte = copie.textContent;
                }

                function succes() {
                    bouton.innerHTML = '<i class="fa-solid fa-check" aria-hidden="true"></i> CopiÃ©';
                    setTimeout(function () {
                        bouton.innerHTML = '<i class="fa-regular fa-copy" aria-hidden="true"></i> Copier';
                    }, 1600);
                }

                try {
                    await navigator.clipboard.writeText(texte);
                    succes();
                } catch (err) {
                    const zone = document.createElement('textarea');
                    zone.value = texte;
                    zone.style.position = 'fixed';
                    zone.style.opacity = '0';
                    document.body.appendChild(zone);
                    zone.select();
                    try { document.execCommand('copy'); succes(); } catch (e2) { /* rien */ }
                    zone.remove();
                }
            });

            bloc.appendChild(bouton);
        });
    }

    function ouvrirSlide(slug) {
        fetch('/api/cours/' + encodeURIComponent(slug) + '/vue', { method: 'POST' })
            .catch(function () { /* compteur non bloquant */ });

        titre.textContent = 'Chargementâ€¦';
        contenu.innerHTML = '';
        overlay.classList.add('ouvert');
        panel.classList.add('ouvert');
        document.body.style.overflow = 'hidden';

        fetch('/api/cours/' + encodeURIComponent(slug))
            .then(function (r) { return r.json(); })
            .then(function (data) {
                if (!data.succes) throw new Error(data.message || 'Cours introuvable');

                titre.textContent = data.cours.titre;
                contenu.innerHTML = data.cours.contenu;
                contenu.scrollTop = 0;
                colorerCode();
                ajouterBoutonsCopier();
            })
            .catch(function (e) {
                titre.textContent = 'Erreur';
                contenu.innerHTML = '<p>' + e.message + '</p>';
            });
    }

    function fermerSlide() {
        overlay.classList.remove('ouvert');
        panel.classList.remove('ouvert');
        document.body.style.overflow = '';
    }

    overlay.addEventListener('click', fermerSlide);
    fermer.addEventListener('click', fermerSlide);

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && panel.classList.contains('ouvert')) fermerSlide();
    });

    function formatDate(iso) {
        try {
            return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso));
        } catch (e) {
            return '';
        }
    }

    function animerNombre(el, cible) {
        const depart = performance.now();
        const duree = 700;

        function pas(maintenant) {
            const p = Math.min(1, (maintenant - depart) / duree);
            el.textContent = String(Math.round(cible * p));
            if (p < 1) requestAnimationFrame(pas);
        }

        requestAnimationFrame(pas);
    }

    function rendre(cours) {
        liste.innerHTML = '';

        if (!cours.length) {
            liste.innerHTML = '<p class="sous-titre">Aucun cours pour le moment.</p>';
            return;
        }

        cours.forEach(function (c, i) {
            const article = document.createElement('article');
            article.className = 'cours-carte';
            article.style.animationDelay = (i * 70) + 'ms';

            const icone = document.createElement('div');
            icone.className = 'cours-icone';
            icone.innerHTML = '<i class="fa-solid fa-graduation-cap" aria-hidden="true"></i>';

            const contenu = document.createElement('div');
            contenu.className = 'cours-contenu';

            const h2 = document.createElement('h2');
            h2.textContent = c.titre;

            const date = document.createElement('span');
            date.className = 'cours-date';
            date.innerHTML = '<i class="fa-regular fa-calendar" aria-hidden="true"></i> ' + formatDate(c.date_creation);

            contenu.append(h2, date);

            const bouton = document.createElement('button');
            bouton.type = 'button';
            bouton.className = 'btn-run';
            bouton.innerHTML = '<i class="fa-solid fa-play" aria-hidden="true"></i> Run <span class="nb-run">' + (Number(c.vues) || 0) + '</span>';

            bouton.addEventListener('click', function () {
                const nb = bouton.querySelector('.nb-run');
                nb.textContent = String((Number(nb.textContent) || 0) + 1);
                nb.classList.remove('pulse');
                void nb.offsetWidth;
                nb.classList.add('pulse');

                ouvrirSlide(c.slug);
            });

            article.append(icone, contenu, bouton);
            liste.appendChild(article);
        });
    }

    // Animation d'apparition du titre et du sous-titre
    var els = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('vu');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });
        els.forEach(function (el) { io.observe(el); });
    } else {
        els.forEach(function (el) { el.classList.add('vu'); });
    }

    fetch('/api/cours')
        .then(function (r) { return r.json(); })
        .then(function (data) {
            if (!data.succes) throw new Error(data.message || 'Erreur');
            rendre(data.cours || []);
        })
        .catch(function () {
            liste.innerHTML = '<p class="sous-titre">Impossible de charger les cours pour le moment.</p>';
        });
});
