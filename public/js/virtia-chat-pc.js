// --- virtia-chat.js ---
// Moteur VirtIA (issu de la dÃ©mo validÃ©e) + contexte projet.

document.addEventListener("DOMContentLoaded", function () {

    // ===============================================================
    // 1. Ã‰LÃ‰MENTS
    // ===============================================================
    const overlay = document.getElementById("ia-overlay");
    const panel = document.getElementById("ia-panel");
    const btnIA = document.getElementById("btnVirtIA");
    const fermer = document.getElementById("ia-fermer");
    const nouveau = document.getElementById("ia-nouveau");
    const btnPolitique = document.getElementById("ia-politique");
    const messages = document.getElementById("ia-messages");
    const vide = document.getElementById("ia-vide");
    const bonjour = document.getElementById("ia-bonjour");
    const form = document.getElementById("ia-form");
    const input = document.getElementById("ia-input");
    const envoyer = form.querySelector(".ia-envoyer");
    const alerte = document.getElementById("ia-alerte");
    const suspendu = document.getElementById("ia-suspendu");
    const btnRelire = document.getElementById("btn-relire");
    const politique = document.getElementById("politique-overlay");
    const politiqueAccepter = document.getElementById("politique-accepter");
    const politiqueRefuser = document.getElementById("politique-refuser");

    // ===============================================================
    // 2. CONSTANTES & Ã‰TAT
    // ===============================================================
    const CLE_CONV = "virttech_ia_conversation";
    const CLE_ID = "virttech_ia_conversation_id";
    const CLE_CONSENT = "virttech_ia_consentement";
    const CLE_ENVOIS = "virttech_ia_envois";
    const VERSION_POLITIQUE = 1;
    const MAX_MESSAGES = 50;
    const LIMITE_DOUCE = 8;

    let conversation = lireConversation();
    let conversationId = lireConversationId();
    let consentement = lireConsentement();
    let messageEnAttente = null;
    let dernierFocus = null;
    let voteEnCours = false;

    // ===============================================================
    // 3. STOCKAGE LOCAL
    // ===============================================================
    function lireConversation() {
        try {
            const v = JSON.parse(localStorage.getItem(CLE_CONV) || "[]");
            return Array.isArray(v) ? v.slice(-MAX_MESSAGES) : [];
        } catch (e) {
            return [];
        }
    }

    function sauver() {
        try {
            localStorage.setItem(CLE_CONV, JSON.stringify(conversation.slice(-MAX_MESSAGES)));
        } catch (e) { /* stockage plein */ }
    }

    function lireConversationId() {
        try {
            let id = localStorage.getItem(CLE_ID);
            if (!id) {
                id = uidConversation();
                localStorage.setItem(CLE_ID, id);
            }
            return id;
        } catch (e) {
            return "conv-" + Date.now();
        }
    }

    function uidConversation() {
        return (window.crypto && crypto.randomUUID)
            ? crypto.randomUUID()
            : "conv-" + Date.now() + "-" + Math.random().toString(16).slice(2);
    }

    function uid() {
        return (window.crypto && crypto.randomUUID)
            ? crypto.randomUUID()
            : "m-" + Date.now() + "-" + Math.random().toString(16).slice(2);
    }

    function lireConsentement() {
        try {
            const v = JSON.parse(localStorage.getItem(CLE_CONSENT) || "null");
            return (v && v.version === VERSION_POLITIQUE) ? v : null;
        } catch (e) {
            return null;
        }
    }

    function sauverConsentement(accepte) {
        consentement = {
            version: VERSION_POLITIQUE,
            accepte: accepte,
            date: new Date().toISOString()
        };
        try {
            localStorage.setItem(CLE_CONSENT, JSON.stringify(consentement));
        } catch (e) { /* stockage bloquÃ© */ }
    }

    function estSuspendu() {
        return !!consentement && consentement.accepte === false;
    }

    function aAccepte() {
        return !!consentement && consentement.accepte === true;
    }

    // ===============================================================
    // 4. OUVERTURE / FERMETURE
    // ===============================================================
    function ouvrirAssistant() {
        if (window.Panneaux) window.Panneaux.noter("virtia");
        if (typeof window.VirtFermerAutres === "function") window.VirtFermerAutres("virtia");
        dernierFocus = document.activeElement;
        overlay.classList.add("ouvert");
        panel.classList.add("ouvert");
        if (typeof window.MajClassePanneau === "function") window.MajClassePanneau();
        document.body.style.overflow = "hidden";
    }

    function fermerAssistant() {
        overlay.classList.remove("ouvert");
        panel.classList.remove("ouvert");
        if (typeof window.MajClassePanneau === "function") window.MajClassePanneau();
        document.body.style.overflow = "";
        if (dernierFocus) dernierFocus.focus();
    }

    window.VirtIAFermer = fermerAssistant;
    window.VirtIAOuvrir = ouvrirAssistant;

    btnIA.addEventListener("click", ouvrirAssistant);
    fermer.addEventListener("click", function () {
        fermerAssistant();
        if (window.Panneaux) window.Panneaux.reinitialiser();
    });
    overlay.addEventListener("click", fermerAssistant);

    document.addEventListener("keydown", function (e) {
        if (e.key !== "Escape") return;
        if (!politique.hidden) { fermerPolitique(); return; }
        if (panel.classList.contains("ouvert")) fermerAssistant();
    });

    // ===============================================================
    // 5. POLITIQUE D'UTILISATION
    // ===============================================================
    function ouvrirPolitique() {
        politique.hidden = false;
        politiqueAccepter.focus();
    }

    function fermerPolitique() {
        politique.hidden = true;
    }

    function majSuspendu() {
        const s = estSuspendu();
        suspendu.hidden = !s;
        input.disabled = s;
        envoyer.disabled = s;

        if (s) {
            vide.hidden = true;
        } else if (!conversation.length) {
            vide.hidden = false;
        }
    }

    politiqueAccepter.addEventListener("click", function () {
        sauverConsentement(true);
        fermerPolitique();
        majSuspendu();

        if (messageEnAttente) {
            const texte = messageEnAttente;
            messageEnAttente = null;
            envoyerMessage(texte);
        }
    });

    politiqueRefuser.addEventListener("click", function () {
        sauverConsentement(false);
        messageEnAttente = null;
        fermerPolitique();
        majSuspendu();
    });

    politique.addEventListener("click", function (e) {
        if (e.target === politique) fermerPolitique();
    });

    btnPolitique.addEventListener("click", ouvrirPolitique);
    btnRelire.addEventListener("click", ouvrirPolitique);

    // ===============================================================
    // 6. RENDU DES RÃ‰PONSES
    // ===============================================================
    const MOTS_CLES = [
        "VirtTech by Ipote", "VirtEmulator", "TransformLink", "Virt_Dev", "VirtTech",
        "JavaScript", "Node.js", "HTML", "CSS", "GitHub", "Abidjan",
        "arborescence", "balises", "balise", "404", "403", "500"
    ];

    const MOTIF = new RegExp(
        "(https?:\\/\\/[^\\s]+|virttech\\.site\\/[^\\s]*)" +
        "|(\\*\\*[^*]+\\*\\*)" +
        "|(`[^`]+`)" +
        "|(\\b(?:" + MOTS_CLES.join("|").replace(/\./g, "\\.") + ")\\b)",
        "gi"
    );

    function remplir(cible, texte) {
        const motif = new RegExp(MOTIF.source, "gi");
        let index = 0;
        let m;

        while ((m = motif.exec(texte)) !== null) {
            if (m.index > index) {
                cible.appendChild(document.createTextNode(texte.slice(index, m.index)));
            }

            if (m[1]) {
                const url = m[1].replace(/[.,;:!?)]+$/, "");
                const a = document.createElement("a");
                a.href = /^https?:/i.test(url) ? url : "https://" + url;
                a.target = "_blank";
                a.rel = "noopener";
                a.textContent = url;
                cible.appendChild(a);

                const reste = m[1].slice(url.length);
                if (reste) cible.appendChild(document.createTextNode(reste));
            } else if (m[2]) {
                const fort = document.createElement("strong");
                remplir(fort, m[2].slice(2, -2));
                cible.appendChild(fort);
            } else if (m[3]) {
                const code = document.createElement("code");
                code.className = "code-inline";
                code.textContent = m[3].slice(1, -1);
                cible.appendChild(code);
            } else {
                const mark = document.createElement("mark");
                mark.className = "mot-cle";
                mark.textContent = m[4];
                cible.appendChild(mark);
            }

            index = m.index + m[0].length;
        }

        if (index < texte.length) {
            cible.appendChild(document.createTextNode(texte.slice(index)));
        }
    }

    function construireTableau(lignesTableau) {
        function cellules(ligne) {
            return ligne.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map(function (c) {
                return c.trim();
            });
        }

        const entetes = cellules(lignesTableau[0]);
        let debut = 1;

        if (lignesTableau[1] && /^[\s|:-]+$/.test(lignesTableau[1]) && lignesTableau[1].indexOf("-") !== -1) {
            debut = 2;
        }

        const scroll = document.createElement("div");
        scroll.className = "tableau-scroll";

        const table = document.createElement("table");
        const thead = document.createElement("thead");
        const trh = document.createElement("tr");

        entetes.forEach(function (c) {
            const th = document.createElement("th");
            remplir(th, c);
            trh.appendChild(th);
        });

        thead.appendChild(trh);
        table.appendChild(thead);

        const tbody = document.createElement("tbody");
        for (let k = debut; k < lignesTableau.length; k++) {
            const tr = document.createElement("tr");
            cellules(lignesTableau[k]).forEach(function (c) {
                const td = document.createElement("td");
                remplir(td, c);
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        }
        table.appendChild(tbody);
        scroll.appendChild(table);

        return scroll;
    }

    function normaliserLangage(langage) {
        const l = String(langage || "").toLowerCase();
        if (l === "html" || l === "xml" || l === "markup") return "markup";
        if (l === "js" || l === "javascript") return "javascript";
        if (l === "css") return "css";
        return "none";
    }

    function construireCode(code, langage) {
        const bloc = document.createElement("div");
        bloc.className = "bloc-code-ia";

        const tete = document.createElement("div");
        tete.className = "code-tete";

        const nom = document.createElement("span");
        nom.className = "code-langue";
        nom.textContent = langage || "code";

        const copier = document.createElement("button");
        copier.type = "button";
        copier.className = "code-copier";
        copier.innerHTML = '<i class="fa-regular fa-copy" aria-hidden="true"></i> Copier';
        copier.dataset.code = code;

        tete.append(nom, copier);

        const scroll = document.createElement("div");
        scroll.className = "code-scroll";

        const lignes = document.createElement("div");
        lignes.className = "code-lignes";
        lignes.setAttribute("aria-hidden", "true");
        lignes.textContent = Array.from({ length: code.split("\n").length }, function (_, i) {
            return i + 1;
        }).join("\n");

        const pre = document.createElement("pre");
        pre.className = "code-pre";
        const codeEl = document.createElement("code");
        codeEl.className = "language-" + normaliserLangage(langage);
        codeEl.textContent = code;
        pre.appendChild(codeEl);

        scroll.append(lignes, pre);
        bloc.append(tete, scroll);

        if (window.Prism && Prism.highlightElement) {
            try { Prism.highlightElement(codeEl); } catch (e) { /* texte brut */ }
        }

        return bloc;
    }

    function animerMots(racine) {
        if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        const marcheur = document.createTreeWalker(racine, NodeFilter.SHOW_TEXT, {
            acceptNode: function (noeud) {
                const parent = noeud.parentNode;
                if (parent && parent.closest && (parent.closest(".bloc-code-ia") || parent.closest(".ia-actions"))) {
                    return NodeFilter.FILTER_REJECT;
                }
                return NodeFilter.FILTER_ACCEPT;
            }
        });

        const noeuds = [];
        while (marcheur.nextNode()) noeuds.push(marcheur.currentNode);

        let n = 0;

        noeuds.forEach(function (noeud) {
            const morceaux = noeud.nodeValue.split(/(\s+)/);
            const frag = document.createDocumentFragment();

            morceaux.forEach(function (morceau) {
                if (!morceau) return;

                if (/^\s+$/.test(morceau)) {
                    frag.appendChild(document.createTextNode(morceau));
                    return;
                }

                const span = document.createElement("span");
                span.className = "mot";
                span.style.animationDelay = Math.min(n++ * 10, 1200) + "ms";
                span.textContent = morceau;
                frag.appendChild(span);
            });

            noeud.parentNode.replaceChild(frag, noeud);
        });
    }

    function defilerEnBas() {
        messages.scrollTop = messages.scrollHeight;
    }

    function ajouterMessage(role, texte) {
        if (vide) vide.hidden = true;

        const bulle = document.createElement("div");
        bulle.className = "ia-message " + role;
        const p = document.createElement("p");
        p.textContent = texte;
        bulle.appendChild(p);
        messages.appendChild(bulle);
        defilerEnBas();
        return bulle;
    }

    function construireActions(message) {
        const barre = document.createElement("div");
        barre.className = "ia-actions";

        const like = document.createElement("button");
        like.type = "button";
        like.className = "ia-action ia-like" + (message.avis === 1 ? " actif" : "");
        like.dataset.message = message.id;
        like.setAttribute("aria-label", "RÃ©ponse utile");
        like.setAttribute("aria-pressed", message.avis === 1 ? "true" : "false");
        like.innerHTML = '<i class="fa-' + (message.avis === 1 ? "solid" : "regular") + ' fa-thumbs-up"></i>';

        const dislike = document.createElement("button");
        dislike.type = "button";
        dislike.className = "ia-action ia-dislike" + (message.avis === -1 ? " actif negatif" : "");
        dislike.dataset.message = message.id;
        dislike.setAttribute("aria-label", "RÃ©ponse pas utile");
        dislike.setAttribute("aria-pressed", message.avis === -1 ? "true" : "false");
        dislike.innerHTML = '<i class="fa-' + (message.avis === -1 ? "solid" : "regular") + ' fa-thumbs-down"></i>';

        const simple = document.createElement("button");
        simple.type = "button";
        simple.className = "ia-action ia-plus-simple";
        simple.textContent = "Plus simple";

        const exemple = document.createElement("button");
        exemple.type = "button";
        exemple.className = "ia-action ia-un-exemple";
        exemple.textContent = "Un exemple";

        const partager = document.createElement("button");
        partager.type = "button";
        partager.className = "ia-action ia-partager";
        partager.dataset.message = message.id;
        partager.innerHTML = '<i class="fa-solid fa-download"></i> Partager';

        barre.append(like, dislike, simple, exemple, partager);
        return barre;
    }

    function rafraichirActions(message) {
        const boutons = messages.querySelectorAll('[data-message="' + message.id + '"]');

        boutons.forEach(function (b) {
            if (b.classList.contains("ia-like")) {
                b.classList.toggle("actif", message.avis === 1);
                b.setAttribute("aria-pressed", message.avis === 1 ? "true" : "false");
                b.innerHTML = '<i class="fa-' + (message.avis === 1 ? "solid" : "regular") + ' fa-thumbs-up"></i>';
            }
            if (b.classList.contains("ia-dislike")) {
                b.classList.toggle("actif", message.avis === -1);
                b.classList.toggle("negatif", message.avis === -1);
                b.setAttribute("aria-pressed", message.avis === -1 ? "true" : "false");
                b.innerHTML = '<i class="fa-' + (message.avis === -1 ? "solid" : "regular") + ' fa-thumbs-down"></i>';
            }
        });
    }

    // Mode code (PC) : boutons Â« Appliquer Â» pour les fichiers proposÃ©s
    function proposerFichiers(texte) {
        if (!window.VirtProjet || typeof window.VirtProjet.ecrire !== "function") return;

        const fichiers = [];
        const motif = /```fichier:([^\n`]+)\n([\s\S]*?)```/g;
        let m;

        while ((m = motif.exec(String(texte))) !== null) {
            if (m[1].trim()) fichiers.push({ chemin: m[1].trim(), contenu: m[2].replace(/\n$/, "") });
        }

        if (!fichiers.length) return;

        const bulle = messages.lastElementChild;
        if (!bulle) return;

        const zone = document.createElement("div");
        zone.className = "ia-appliquer";

        fichiers.forEach(function (f) {
            const bouton = document.createElement("button");
            bouton.type = "button";
            bouton.className = "ia-appliquer-btn";

            const icone = document.createElement("i");
            icone.className = "fa-solid fa-file-pen";
            icone.setAttribute("aria-hidden", "true");

            const code = document.createElement("code");
            code.textContent = f.chemin;

            bouton.append(icone, document.createTextNode(" Appliquer "), code);

            bouton.addEventListener("click", function () {
                const appliquer = function () {
                    window.VirtProjet.ecrire(f.chemin, f.contenu);

                    bouton.disabled = true;
                    bouton.innerHTML = "";

                    const ok = document.createElement("i");
                    ok.className = "fa-solid fa-check";
                    ok.setAttribute("aria-hidden", "true");

                    const libelle = document.createElement("code");
                    libelle.textContent = f.chemin;

                    bouton.append(ok, document.createTextNode(" Appliqu\u00e9 "), libelle);
                };

                if (window.PcBoost && typeof window.PcBoost.proposer === "function") {
                    window.PcBoost.proposer(f.chemin, f.contenu, appliquer);
                } else {
                    appliquer();
                }
            });

            zone.appendChild(bouton);
        });

        bulle.appendChild(zone);
        defilerEnBas();
    }

    function ajouterReponse(texte, animer, message) {
        if (vide) vide.hidden = true;

        const bulle = document.createElement("div");
        bulle.className = "ia-message bot";

        const conteneur = document.createElement("div");
        conteneur.className = "ia-reponse";

        const lignes = String(texte).replace(/\r\n/g, "\n").split("\n");
        let i = 0;

        while (i < lignes.length) {
            const ligne = lignes[i];

            // Bloc de code
            if (/^```/.test(ligne.trim())) {
                const langage = ligne.trim().slice(3).trim();
                i++;
                const code = [];
                while (i < lignes.length && !/^```/.test(lignes[i].trim())) {
                    code.push(lignes[i]);
                    i++;
                }
                i++;
                conteneur.appendChild(construireCode(code.join("\n"), langage));
                continue;
            }

            // Tableau
            if (/^\s*\|/.test(ligne)) {
                const lignesTableau = [];
                while (i < lignes.length && /^\s*\|/.test(lignes[i])) {
                    lignesTableau.push(lignes[i]);
                    i++;
                }
                conteneur.appendChild(construireTableau(lignesTableau));
                continue;
            }

            // Liste Ã  puces
            if (/^\s*[-*]\s+/.test(ligne)) {
                const ul = document.createElement("ul");
                while (i < lignes.length && /^\s*[-*]\s+/.test(lignes[i])) {
                    const li = document.createElement("li");
                    remplir(li, lignes[i].replace(/^\s*[-*]\s+/, ""));
                    ul.appendChild(li);
                    i++;
                }
                conteneur.appendChild(ul);
                continue;
            }

            // Liste numÃ©rotÃ©e
            if (/^\s*\d+[.)]\s+/.test(ligne)) {
                const ol = document.createElement("ol");
                while (i < lignes.length && /^\s*\d+[.)]\s+/.test(lignes[i])) {
                    const li = document.createElement("li");
                    remplir(li, lignes[i].replace(/^\s*\d+[.)]\s+/, ""));
                    ol.appendChild(li);
                    i++;
                }
                conteneur.appendChild(ol);
                continue;
            }

            // Paragraphe
            const para = [];
            while (i < lignes.length && lignes[i].trim() !== "" &&
                   !/^```/.test(lignes[i].trim()) &&
                   !/^\s*\|/.test(lignes[i]) &&
                   !/^\s*[-*]\s+/.test(lignes[i]) &&
                   !/^\s*\d+[.)]\s+/.test(lignes[i])) {
                para.push(lignes[i]);
                i++;
            }

            if (para.length) {
                const p = document.createElement("p");
                remplir(p, para.join(" ").trim());
                conteneur.appendChild(p);
            } else {
                i++;
            }
        }

        if (message) conteneur.appendChild(construireActions(message));

        bulle.appendChild(conteneur);
        messages.appendChild(bulle);
        if (animer !== false) animerMots(conteneur);
        defilerEnBas();
    }

    function afficherEcriture() {
        const bulle = document.createElement("div");
        bulle.className = "ia-message bot ia-ecrit";
        bulle.innerHTML = "<span></span><span></span><span></span>";
        messages.appendChild(bulle);
        defilerEnBas();
        return bulle;
    }

    function ajouterErreur(message, question) {
        const bulle = document.createElement("div");
        bulle.className = "ia-message erreur";

        const tete = document.createElement("div");
        tete.className = "erreur-tete";

        const icone = document.createElement("i");
        icone.className = "fa-solid fa-triangle-exclamation";
        icone.setAttribute("aria-hidden", "true");

        const p = document.createElement("p");
        p.textContent = message;

        tete.append(icone, p);

        const bouton = document.createElement("button");
        bouton.type = "button";
        bouton.className = "btn-reessayer";
        bouton.textContent = "RÃ©essayer";
        bouton.dataset.question = question;

        bulle.append(tete, bouton);
        messages.appendChild(bulle);
        defilerEnBas();
    }

    // ===============================================================
    // 7. ACTIONS (avis, plus simple, exemple, partage)
    // ===============================================================
    function trouverMessage(id) {
        return conversation.find(function (m) { return m.id === id; }) || null;
    }

    async function voter(message, note) {
        if (voteEnCours) return;

        const nouvelleNote = message.avis === note ? 0 : note;
        voteEnCours = true;

        try {
            if (message.reponseId) {
                await fetch("/api/ia/" + encodeURIComponent(message.reponseId) + "/avis", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ note: nouvelleNote })
                });
            }

            message.avis = nouvelleNote;
            sauver();
            rafraichirActions(message);
        } catch (e) {
            // silencieux
        } finally {
            voteEnCours = false;
        }
    }

    function partager(message) {
        const index = conversation.findIndex(function (m) { return m.id === message.id; });

        let question = "";
        for (let i = index - 1; i >= 0; i--) {
            if (conversation[i].role === "user") {
                question = conversation[i].texte;
                break;
            }
        }

        const date = new Date(message.date || Date.now());
        const contenu = "VirtIA â€” VirtTech by Ipote\n" +
            date.toLocaleString("fr-FR") + "\n\n" +
            "Question :\n" + (question || "(non disponible)") + "\n\n" +
            "RÃ©ponse :\n" + message.texte + "\n\n" +
            "https://virttech.site\n";

        const blob = new Blob([contenu], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const lien = document.createElement("a");
        lien.href = url;
        lien.download = "virtai-reponse-" + date.toISOString().slice(0, 10) + ".txt";
        document.body.appendChild(lien);
        lien.click();
        lien.remove();
        setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    }

    // ===============================================================
    // 8. ENVOI
    // ===============================================================
    function ajusterHauteur() {
        input.style.height = "auto";
        input.style.height = Math.min(input.scrollHeight, 120) + "px";
    }

    input.addEventListener("input", ajusterHauteur);
    envoyer.addEventListener("mousedown", function (e) { e.preventDefault(); });

    input.addEventListener("keydown", function (e) {
        if (e.key !== "Enter") return;
        if (e.ctrlKey || e.metaKey || e.shiftKey) return; // Ctrl + EntrÃ©e = nouvelle ligne
        if (window.matchMedia && window.matchMedia("(pointer: coarse)").matches) return; // mobile : nouvelle ligne
        e.preventDefault();

        if (typeof modeEcriture !== "undefined" && modeEcriture) ecrireEnDirect(input.value);
        else envoyerMessage(input.value);
    });

    function compterEnvoi() {
        try {
            const maintenant = Date.now();
            const fenetre = 10 * 60 * 1000;
            const envois = JSON.parse(localStorage.getItem(CLE_ENVOIS) || "[]")
                .filter(function (t) { return maintenant - t < fenetre; });

            envois.push(maintenant);
            localStorage.setItem(CLE_ENVOIS, JSON.stringify(envois));

            if (envois.length >= LIMITE_DOUCE) {
                const restants = Math.max(0, 10 - envois.length);
                alerte.textContent = restants > 0
                    ? "Attention : plus que " + restants + " message(s) avant la pause de 10 minutes."
                    : "Limite atteinte : l'assistant va se mettre en pause.";
                alerte.hidden = false;
            }
        } catch (e) { /* stockage bloquÃ© */ }
    }

    async function demanderIA(texte) {
        const ecriture = afficherEcriture();
        envoyer.disabled = true;

        const contexte = conversation
            .slice(0, -1)
            .filter(function (m) { return m.role === "user" || m.role === "assistant"; })
            .slice(-8)
            .map(function (m) { return { role: m.role, content: m.texte }; });

        try {
            const reponse = await fetch("/api/ia", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: texte,
                    historique: contexte,
                    conversation_id: conversationId,
                    contexte: window.VirtContexte(texte),
                    mode: window.VIRTIA_MODE || "lecture"
                })
            });

            const data = await reponse.json();
            ecriture.remove();

            if (!data.succes) {
                ajouterErreur(data.message || "Je n'ai pas pu rÃ©pondre. RÃ©essaie dans un instant.", texte);
                return;
            }

            const msg = {
                id: uid(),
                role: "assistant",
                texte: data.reponse,
                date: new Date().toISOString(),
                reponseId: data.id || null,
                avis: 0
            };

            conversation.push(msg);
            sauver();
            ajouterReponse(data.reponse, true, msg);

            if (window.VIRTIA_MODE === "code") proposerFichiers(data.reponse);
        } catch (err) {
            ecriture.remove();
            ajouterErreur("Connexion impossible. VÃ©rifie ta connexion et rÃ©essaie.", texte);
        } finally {
            envoyer.disabled = false;
        }
    }

    function envoyerMessage(texte) {
        texte = String(texte || "").trim();
        if (!texte) return;

        if (estSuspendu()) {
            suspendu.scrollIntoView({ behavior: "smooth", block: "nearest" });
            return;
        }

        if (!aAccepte()) {
            messageEnAttente = texte;
            ouvrirPolitique();
            return;
        }

        input.value = "";
        ajusterHauteur();
        input.blur();

        const msg = {
            id: uid(),
            role: "user",
            texte: texte,
            date: new Date().toISOString(),
            avis: 0
        };

        conversation.push(msg);
        sauver();
        ajouterMessage("moi", texte);
        compterEnvoi();

        demanderIA(texte);
    }

    // ===============================================================
    // Ã‰CRITURE EN DIRECT DANS LE FICHIER OUVERT (PC)
    // ===============================================================
    let modeEcriture = false;
    let ecritureEnCours = false;
    let fluxControleur = null;
    let avantEcriture = null;

    const btnEcrire = document.getElementById("iaEcrire");

    if (btnEcrire) {
        btnEcrire.addEventListener("click", function () {
            if (ecritureEnCours) {
                if (fluxControleur) fluxControleur.abort();
                return;
            }

            modeEcriture = !modeEcriture;
            btnEcrire.classList.toggle("actif", modeEcriture);
            btnEcrire.title = modeEcriture
                ? "Ã‰criture activÃ©e : clique pour dÃ©sactiver"
                : "Ã‰crire dans le fichier ouvert";
        });
    }

    // Lecture propre d'un flux SSE : ne garde que le texte des deltas
    async function lireFlux(reponse) {
        const lecteur = reponse.body.getReader();
        const decodeur = new TextDecoder();
        let texte = "";
        let reste = "";

        while (true) {
            const { done, value } = await lecteur.read();
            if (done) break;

            reste += decodeur.decode(value, { stream: true });
            const lignes = reste.split("\n");
            reste = lignes.pop() || "";

            for (let i = 0; i < lignes.length; i++) {
                const ligne = lignes[i].trim();
                if (!ligne.startsWith("data:")) continue;

                const contenu = ligne.slice(5).trim();
                if (!contenu || contenu === "[DONE]") continue;

                try {
                    const json = JSON.parse(contenu);
                    const delta = json.delta ||
                        (json.choices && json.choices[0] && json.choices[0].delta && json.choices[0].delta.content);
                    if (delta) texte += delta;
                } catch (e) { /* morceau partiel, ignoré */ }
            }
        }

        return texte;
    }

    // Filet de sécurité : si du transport SSE a fuité dans le texte
    function nettoyerSSE(texte) {
        if (texte.indexOf('data: {"delta"') === -1) return texte;

        let sortie = "";

        texte.split("\n").forEach(function (ligne) {
            const l = ligne.trim();
            if (!l.startsWith("data:")) return;

            const contenu = l.slice(5).trim();
            if (!contenu || contenu === "[DONE]") return;

            try {
                const json = JSON.parse(contenu);
                const delta = json.delta ||
                    (json.choices && json.choices[0] && json.choices[0].delta && json.choices[0].delta.content);
                if (delta) sortie += delta;
            } catch (e) { /* ignoré */ }
        });

        return sortie || texte;
    }
    // Les mots entre backticks deviennent du gras (plus lisible que du code brut)
    function enGras(texte) {
        return String(texte).replace(/`([^`\n]+)`/g, "**$1**");
    }

    // Récap des actions (variante A : liste sobre)
    function iconeAction(action) {
        const a = String(action || "").toLowerCase();
        if (a === "dossier" || a === "creer_dossier") return "fa-folder-plus";
        if (a === "fichier" || a === "creer_fichier") return "fa-file-circle-plus";
        if (a === "ecrire" || a === "modifier" || a === "ecriture" || a === "lignes") return "fa-pen-nib";
        if (a === "supprimer") return "fa-trash-can";
        if (a === "renommer") return "fa-right-left";
        return "fa-circle-check";
    }

    function libelleAction(a) {
        const action = String(a.action || "").toLowerCase();

        if (action === "dossier" || action === "creer_dossier") return "Dossier créé :";
        if (action === "fichier" || action === "creer_fichier") return "Fichier créé :";
        if (action === "ecrire" || action === "modifier" || action === "ecriture") {
            const lignes = String(a.contenu || "").split("\n").length;
            return "Contenu écrit (" + lignes + " lignes) :";
        }
        if (action === "modifier" || action === "lignes") {
            const d = a.debut || "?";
            const f = a.fin || d;
            return (String(d) === String(f) ? "Ligne " + d : "Lignes " + d + "–" + f) + " modifiée(s) :";
        }
        if (action === "supprimer") return "Supprimé :";
        if (action === "renommer") return "Renommé :";
        return "Action :";
    }

    function creerCode(texte) {
        const code = document.createElement("code");
        code.textContent = texte;
        return code;
    }

    function ajouterRecap(actions, resume) {
        if (vide) vide.hidden = true;

        const bulle = document.createElement("div");
        bulle.className = "ia-message bot";

        const conteneur = document.createElement("div");
        conteneur.className = "ia-reponse";

        if (resume) {
            const p = document.createElement("p");
            remplir(p, enGras(resume));
            conteneur.appendChild(p);
        }

        const bloc = document.createElement("div");
        bloc.className = "recap-actions";

        const titre = document.createElement("p");
        titre.className = "recap-titre";
        titre.innerHTML = '<i class="fa-solid fa-circle-check" aria-hidden="true"></i> ' +
            actions.length + (actions.length > 1 ? " actions effectuées" : " action effectuée");

        const liste = document.createElement("ul");
        liste.className = "recap-liste";

        actions.forEach(function (a) {
            const li = document.createElement("li");

            const icone = document.createElement("i");
            icone.className = "fa-solid " + iconeAction(a.action);
            icone.setAttribute("aria-hidden", "true");

            const texte = document.createElement("span");
            texte.appendChild(document.createTextNode(libelleAction(a) + " "));

            if (String(a.action).toLowerCase() === "renommer") {
                texte.appendChild(creerCode(a.ancien || ""));
                texte.appendChild(document.createTextNode(" → "));
                texte.appendChild(creerCode(a.nouveau || ""));
            } else {
                texte.appendChild(creerCode(a.chemin || a.fichier || a.nom || ""));
            }

            li.append(icone, texte);
            liste.appendChild(li);
        });

        bloc.append(titre, liste);
        conteneur.appendChild(bloc);
        bulle.appendChild(conteneur);
        messages.appendChild(bulle);
        defilerEnBas();
    }

    async function ecrireEnDirect(texte) {
        texte = String(texte || "").trim();
        if (!texte) return;

        if (!window.VirtProjet || !window.VirtEditor) {
            ajouterMessage("ia", "L'écriture en direct n'est disponible que dans l'éditeur PC.");
            return;
        }

        if (estSuspendu()) {
            suspendu.scrollIntoView({ behavior: "smooth", block: "nearest" });
            return;
        }

        if (!aAccepte()) {
            messageEnAttente = texte;
            ouvrirPolitique();
            return;
        }

        input.value = "";
        ajusterHauteur();
        input.blur();

        ajouterMessage("moi", texte);
        compterEnvoi();

        ecritureEnCours = true;
        fluxControleur = new AbortController();

        const attente = ajouterMessage("ia", "VirtIA agit sur le projet…");

        let tampon = "";

        function extraireActions(txt) {
            const debutTab = txt.indexOf("[");
            if (debutTab < 0) return null;

            let profondeur = 0;
            let dansChaine = false;
            let echappe = false;

            for (let i = debutTab; i < txt.length; i++) {
                const c = txt[i];

                if (dansChaine) {
                    if (echappe) { echappe = false; continue; }
                    if (c === "\\") { echappe = true; continue; }
                    if (c === '"') dansChaine = false;
                    continue;
                }

                if (c === '"') { dansChaine = true; continue; }
                if (c === "[") profondeur++;
                else if (c === "]") {
                    profondeur--;
                    if (profondeur === 0) {
                        try { return JSON.parse(txt.slice(debutTab, i + 1)); } catch (e) { return null; }
                    }
                }
            }

            return null;
        }

        function normaliser(t) {
            return String(t).replace(/\r/g, "").replace(/[ \t]+$/gm, "").trim();
        }

        function modifierLignes(chemin, a) {
            const ed = window.VirtEditor;
            if (!ed) return false;

            if (window.VirtProjet.actif() !== chemin) {
                const existant = window.VirtProjet.fichiers()[chemin];
                if (existant === undefined) return false;
                window.VirtProjet.ecrire(chemin, existant);
            }

            const avant = String(a.avant || "");
            const apres = String(a.apres !== undefined ? a.apres : (a.contenu || ""));
            const debut = parseInt(a.debut, 10);
            const fin = parseInt(a.fin, 10);

            // 1. Cible exacte par numéros de ligne, vérifiée par le contenu
            if (Number.isInteger(debut) && Number.isInteger(fin) && debut >= 1 && fin >= debut) {
                const finLigne = fin - 1;

                if (finLigne < ed.lineCount()) {
                    const texteLignes = ed.getRange(
                        { line: debut - 1, ch: 0 },
                        { line: finLigne, ch: ed.getLine(finLigne).length }
                    );

                    if (normaliser(texteLignes) === normaliser(avant)) {
                        ed.replaceRange(apres, { line: debut - 1, ch: 0 }, { line: finLigne, ch: ed.getLine(finLigne).length });
                        return true;
                    }
                }
            }

            // 2. Repli : recherche exacte de l'extrait
            if (avant) {
                const index = ed.getValue().indexOf(avant);

                if (index >= 0) {
                    ed.replaceRange(apres, ed.posFromIndex(index), ed.posFromIndex(index + avant.length));
                    return true;
                }
            }

            return false;
        }

        function contexteSelection(texte) {
            let contexte = window.VirtContexte ? window.VirtContexte(texte) : "";

            const ed = window.VirtEditor;
            if (!ed) return contexte;

            const selection = ed.getSelection();
            if (selection && selection.trim()) {
                const depuis = ed.getCursor("from");
                const jusqua = ed.getCursor("to");

                contexte += "\n\n--- SÉLECTION ACTIVE (lignes " + (depuis.line + 1) + " à " + (jusqua.line + 1) + ") ---\n" + selection;
            }

            return contexte;
        }

        function executerAction(a) {
            if (!a || typeof a !== "object") return false;

            const action = String(a.action || "").toLowerCase();
            const chemin = String(a.chemin || a.fichier || a.nom || "");

            if (action === "dossier" || action === "creer_dossier") {
                window.VirtProjet.dossier(chemin);
                return true;
            }

            if (action === "fichier" || action === "creer_fichier") {
                window.VirtProjet.ecrire(chemin, typeof a.contenu === "string" ? a.contenu : "");
                return true;
            }

            if (action === "ecrire" || action === "modifier" || action === "ecriture") {
                window.VirtProjet.ecrire(chemin, String(a.contenu || ""));
                return true;
            }

            if (action === "supprimer" || action === "supprimer_fichier") {
                window.VirtProjet.supprimer(chemin);
                return true;
            }

            if (action === "modifier" || action === "lignes") {
                return modifierLignes(chemin, a);
            }

            if (action === "renommer") {
                window.VirtProjet.renommer(String(a.ancien || ""), String(a.nouveau || ""));
                return true;
            }

            return false;
        }

        try {
            const reponse = await fetch("/api/ia/flux", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: texte,
                    contexte: contexteSelection(texte)
                }),
                signal: fluxControleur.signal
            });

            if (!reponse.ok || !reponse.body) {
                const repli = await fetch("/api/ia", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        message: texte + "\n\nRéponds uniquement par un tableau JSON d'actions (dossier / fichier / ecrire / supprimer / renommer), puis ### RÉSUMÉ.",
                        contexte: contexteSelection(texte),
                        mode: "lecture"
                    }),
                    signal: fluxControleur.signal
                });

                const data = await repli.json();
                if (!data.succes) throw new Error(data.message || "Repli impossible");

                tampon = data.reponse || "";
            } else {
                tampon = await lireFlux(reponse);
            }

            tampon = nettoyerSSE(tampon);

            const actions = extraireActions(tampon);
            let faites = 0;

            const executees = [];

            if (actions && actions.length) {
                actions.forEach(function (a) {
                    try {
                        if (executerAction(a)) {
                            faites++;
                            executees.push(a);
                        }
                    } catch (e) { /* action ignorée */ }
                });
            }

            // Repli : ancien format « blocs CHERCHER / REMPLACER »
            if (faites === 0) {
                const MODELE_BLOCS = /<{5,}\s*(?:CHERCHER|SEARCH)[^\n]*\n([\s\S]*?)\n={5,}\n([\s\S]*?)\n>{5,}\s*(?:REMPLACER|REPLACE)[^\n]*/gi;
                let bloc;

                while ((bloc = MODELE_BLOCS.exec(tampon)) !== null) {
                    const valeur = editeur.getValue();
                    const index = valeur.indexOf(bloc[1]);

                    if (index >= 0) {
                        editeur.replaceRange(bloc[2], editeur.posFromIndex(index), editeur.posFromIndex(index + bloc[1].length));
                        faites++;
                    }
                }
            }

            attente.remove();

            const parties = tampon.split(/###\s*R[ÉE]SUM[ÉE]/i);
            const resume = parties[1] ? parties[1].trim() : "";

            if (faites > 0 && executees.length) {
                ajouterRecap(executees, resume);
            } else if (faites > 0) {
                ajouterMessage("ia", faites + " modification(s) appliquée(s).");
            } else if (resume) {
                ajouterMessage("ia", resume);
            } else {
                ajouterReponse(enGras(tampon.trim().slice(0, 900)) || "Je n'ai pas pu appliquer de modification.", false);
            }

            if (window.VirtSauver) window.VirtSauver();

            if (window.virtToast) {
                window.virtToast(faites > 0 ? faites + " action(s) exécutée(s)" : "Aucune action reconnue");
            }
        } catch (e) {
            if (attente && attente.remove) attente.remove();

            if (e.name === "AbortError") {
                if (window.virtToast) window.virtToast("Écriture arrêtée");
            } else if (window.virtToast) {
                window.virtToast("Écriture impossible");
            }
        } finally {
            ecritureEnCours = false;
            fluxControleur = null;
            modeEcriture = false;
            if (btnEcrire) btnEcrire.classList.remove("actif");
        }
    }

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        if (modeEcriture) ecrireEnDirect(input.value);
        else envoyerMessage(input.value);
    });

    // ===============================================================
    // 9. CLICS DANS LES MESSAGES
    // ===============================================================
    document.querySelectorAll(".ia-suggestion").forEach(function (b) {
        b.addEventListener("click", function () { envoyerMessage(b.dataset.question); });
    });

    messages.addEventListener("mousedown", function (e) {
        if (e.target.closest && (e.target.closest(".code-copier") ||
            e.target.closest(".btn-reessayer") ||
            e.target.closest(".ia-action"))) {
            e.preventDefault();
        }
    });

    messages.addEventListener("click", function (e) {
        const like = e.target.closest ? e.target.closest(".ia-like") : null;
        if (like) {
            const m = trouverMessage(like.dataset.message);
            if (m) voter(m, 1);
            return;
        }

        const dislike = e.target.closest ? e.target.closest(".ia-dislike") : null;
        if (dislike) {
            const m = trouverMessage(dislike.dataset.message);
            if (m) voter(m, -1);
            return;
        }

        const simple = e.target.closest ? e.target.closest(".ia-plus-simple") : null;
        if (simple) {
            envoyerMessage("Reformule ta derniÃ¨re rÃ©ponse plus simplement, pour un dÃ©butant.");
            return;
        }

        const exemple = e.target.closest ? e.target.closest(".ia-un-exemple") : null;
        if (exemple) {
            envoyerMessage("Donne-moi un exemple concret.");
            return;
        }

        const partage = e.target.closest ? e.target.closest(".ia-partager") : null;
        if (partage) {
            const m = trouverMessage(partage.dataset.message);
            if (m) partager(m);
            return;
        }

        const reessayer = e.target.closest ? e.target.closest(".btn-reessayer") : null;
        if (reessayer) {
            const bulle = reessayer.closest(".ia-message");
            if (bulle) bulle.remove();
            demanderIA(reessayer.dataset.question);
            return;
        }

        const copier = e.target.closest ? e.target.closest(".code-copier") : null;
        if (copier) {
            const code = copier.dataset.code || "";
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(code).then(function () {
                    const ancien = copier.innerHTML;
                    copier.innerHTML = '<i class="fa-solid fa-check" aria-hidden="true"></i> CopiÃ©';
                    setTimeout(function () { copier.innerHTML = ancien; }, 1600);
                }).catch(function () {});
            }
        }
    });

    // ===============================================================
    // 10. NOUVELLE CONVERSATION + RESTAURATION
    // ===============================================================
    nouveau.addEventListener("click", function () {
        VirtDialogue.confirmer({
            titre: "Nouvelle conversation",
            message: "Effacer cette conversation ?",
            confirmer: "Effacer",
            danger: true
        }).then(function (ok) {
        if (!ok) return;

        conversation = [];
        try {
            localStorage.removeItem(CLE_CONV);
            localStorage.removeItem(CLE_ID);
        } catch (e) { /* stockage bloquÃ© */ }
        conversationId = lireConversationId();

        messages.querySelectorAll(".ia-message").forEach(function (b) { b.remove(); });
        if (!estSuspendu()) vide.hidden = false;
        alerte.hidden = true;

        input.value = "";
        ajusterHauteur();
        });
    });

    function restaurerConversation() {
        if (!conversation.length) {
            if (!estSuspendu()) vide.hidden = false;
            return;
        }

        vide.hidden = true;

        conversation.forEach(function (m) {
            if (m.role === "user") ajouterMessage("moi", m.texte);
            else ajouterReponse(m.texte, false, m);
        });

        defilerEnBas();
    }

    // ===============================================================
    // 11. DÃ‰MARRAGE
    // ===============================================================
    const heure = new Date().getHours();
    bonjour.textContent = (heure < 12 ? "Bonjour" : heure < 18 ? "Bon aprÃ¨s-midi" : "Bonsoir") + ", je suis VirtIA.";

    majSuspendu();
    restaurerConversation();

    // Animations d'apparition de la page
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
