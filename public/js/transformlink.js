// --- transformlink.js : formulaire, liens courts et historique local ---

document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("formLien");
    if (!form) return;

    // ---------------------------------------------------------------
    // Stockage local de l'historique (localStorage)
    // ---------------------------------------------------------------
    const CLE = "virttech_liens";

    function lireLiens() {
        try {
            const v = JSON.parse(localStorage.getItem(CLE) || "[]");
            return Array.isArray(v) ? v : [];
        } catch (e) {
            return [];
        }
    }

    function ecrireLiens(liens) {
        try {
            localStorage.setItem(CLE, JSON.stringify(liens.slice(0, 50)));
        } catch (e) { /* stockage plein ou bloqué */ }
    }

    // ---------------------------------------------------------------
    // Éléments de la page
    // ---------------------------------------------------------------
    const urlInput = document.getElementById("urlOriginale");
    const codeInput = document.getElementById("codePersonnalise");
    const btn = document.getElementById("btnRaccourcir");
    const resultat = document.getElementById("resultatBox");
    const lienCourt = document.getElementById("lienCourt");
    const btnCopier = document.getElementById("btnCopier");
    const erreur = document.getElementById("errorMsg");

    const btnMesLiens = document.getElementById("btnMesLiens");
    const nbLiens = document.getElementById("nbLiens");
    const liste = document.getElementById("listeLiens");
    const listeItems = document.getElementById("listeItems");
    const btnVider = document.getElementById("btnVider");

    // ---------------------------------------------------------------
    // Utilitaires
    // ---------------------------------------------------------------
    function afficherErreur(message) {
        erreur.textContent = message;
        erreur.classList.add("visible");
    }

    function cacherErreur() {
        erreur.textContent = "";
        erreur.classList.remove("visible");
    }

    function codeAleatoire() {
        const caracteres = "abcdefghijkmnpqrstuvwxyz23456789";
        let code = "";
        for (let i = 0; i < 6; i++) {
            code += caracteres[Math.floor(Math.random() * caracteres.length)];
        }
        return code;
    }

    async function copier(texte, bouton, contenuRepos) {
        try {
            await navigator.clipboard.writeText(texte);
            bouton.innerHTML = '<i class="fa-solid fa-check"></i> Copié';
            setTimeout(function () { bouton.innerHTML = contenuRepos; }, 1800);
        } catch (e) {
            afficherErreur("Impossible de copier automatiquement. Sélectionne le lien à la main.");
        }
    }

    // ---------------------------------------------------------------
    // Liste : affichage
    // ---------------------------------------------------------------
    function afficherListe() {
        const liens = lireLiens();

        nbLiens.textContent = "(" + liens.length + ")";
        btnVider.hidden = liens.length === 0;
        listeItems.innerHTML = "";

        if (liens.length === 0) {
            const vide = document.createElement("p");
            vide.className = "liens-vide";
            vide.textContent = "Tu n'as pas encore créé de lien. Ton premier lien apparaîtra ici.";
            listeItems.appendChild(vide);
            return;
        }

        liens.forEach(function (l) {
            const ligne = document.createElement("div");
            ligne.className = "lien-item";

            const lien = document.createElement("a");
            lien.href = l.short;
            lien.target = "_blank";
            lien.rel = "noopener";
            lien.textContent = String(l.short).replace(/^https?:\/\//, "");

            const source = document.createElement("span");
            source.className = "lien-source";
            source.textContent = l.url;

            const date = document.createElement("time");
            date.textContent = new Date(l.date).toLocaleDateString("fr-FR", {
                day: "2-digit", month: "short", year: "numeric"
            });

            const copierBtn = document.createElement("button");
            copierBtn.type = "button";
            copierBtn.className = "btn-copier-lien";
            copierBtn.dataset.lien = l.short;
            copierBtn.setAttribute("aria-label", "Copier " + l.short);
            copierBtn.innerHTML = '<i class="fa-solid fa-copy"></i>';

            ligne.append(lien, source, date, copierBtn);
            listeItems.appendChild(ligne);
        });
    }

    // ---------------------------------------------------------------
    // Création d'un lien
    // ---------------------------------------------------------------
    form.addEventListener("submit", async function (e) {
        e.preventDefault();
        cacherErreur();
        resultat.classList.remove("visible");

        const urlBrute = urlInput.value.trim();
        if (!urlBrute) {
            afficherErreur("Colle d'abord un lien à raccourcir.");
            urlInput.focus();
            return;
        }

        let adresse;
        try {
            adresse = new URL(urlBrute);
        } catch (err) {
            afficherErreur("Ce lien n'est pas valide. Exemple : https://github.com/ton-profil/mon-projet");
            urlInput.focus();
            return;
        }

        if (adresse.protocol !== "http:" && adresse.protocol !== "https:") {
            afficherErreur("Le lien doit commencer par http:// ou https://");
            urlInput.focus();
            return;
        }

        let code = codeInput.value.trim().toLowerCase();

        if (code && !/^[a-z0-9-]{1,20}$/.test(code)) {
            afficherErreur("Le mot-clé doit contenir uniquement des lettres, des chiffres ou des tirets (20 caractères max).");
            codeInput.focus();
            return;
        }

        const codeFinal = code || codeAleatoire();

        btn.disabled = true;
        const contenuBouton = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Création…';

        try {
            const reponse = await fetch("/api/shorten", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url: urlBrute, code: codeFinal })
            });

            const data = await reponse.json();

            if (!data.succes) {
                afficherErreur(data.message || "Ce lien n'a pas pu être créé.");
                return;
            }

            lienCourt.textContent = data.short_url;
            lienCourt.href = data.short_url;
            resultat.classList.add("visible");

            const liens = lireLiens();
            liens.unshift({
                url: data.original_url || urlBrute,
                short: data.short_url,
                date: new Date().toISOString()
            });
            ecrireLiens(liens);
            afficherListe();

            urlInput.value = "";
            codeInput.value = "";
        } catch (err) {
            afficherErreur("Erreur de connexion au serveur. Réessaie dans un instant.");
        } finally {
            btn.disabled = false;
            btn.innerHTML = contenuBouton;
        }
    });

    // ---------------------------------------------------------------
    // Copier le dernier lien créé
    // ---------------------------------------------------------------
    btnCopier.addEventListener("click", function () {
        copier(lienCourt.textContent, btnCopier, '<i class="fa-solid fa-copy"></i> Copier');
    });

    // ---------------------------------------------------------------
    // Copier un lien de la liste (délégation)
    // ---------------------------------------------------------------
    listeItems.addEventListener("click", function (e) {
        const bouton = e.target.closest("button[data-lien]");
        if (!bouton) return;
        copier(bouton.dataset.lien, bouton, '<i class="fa-solid fa-copy"></i>');
    });

    // ---------------------------------------------------------------
    // Afficher / masquer la liste
    // ---------------------------------------------------------------
    btnMesLiens.addEventListener("click", function () {
        const ouvert = !liste.hidden;
        liste.hidden = ouvert;
        btnMesLiens.setAttribute("aria-expanded", String(!ouvert));
        if (!ouvert) liste.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });

    // ---------------------------------------------------------------
    // Tout effacer
    // ---------------------------------------------------------------
    btnVider.addEventListener("click", function () {
        if (!confirm("Effacer la liste ? Les liens raccourcis continueront de fonctionner.")) return;
        localStorage.removeItem(CLE);
        afficherListe();
    });

    // ---------------------------------------------------------------
    // Démarrage
    // ---------------------------------------------------------------
    afficherListe();

    // Animations d'apparition
    var els = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("vu");
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });
        els.forEach(function (el) { io.observe(el); });
    } else {
        els.forEach(function (el) { el.classList.add("vu"); });
    }
});
