// --- historique.js : cours, slide et compteur de « Run » ---

document.addEventListener("DOMContentLoaded", function () {

    // ===============================================================
    // 1. CONTENU DES ACTIVITÉS
    // ===============================================================
    const cours = {
        virtdev: {
            titre: "Concours Virt_Dev",
            contenu: `
                <p><strong>30 octobre → 4 novembre 2026.</strong> Les participants devaient reproduire une page de connexion (Login Page) en HTML et CSS. L'utilisation de l'IA était autorisée.</p>

                <h4>Le podium</h4>
                <ul>
                    <li><strong>1re place :</strong> Horo David — 2 000 F CFA</li>
                    <li><strong>2e place :</strong> Koudouss — 1 000 F CFA</li>
                </ul>
                <p>Les paiements ont été faits par Mobile Money (Wave), en direct sur le groupe.</p>

                <h4>Ce que le jury a regardé</h4>
                <ul>
                    <li>L'intégration du logo en <strong>Base64</strong>.</li>
                    <li>Les <strong>animations 3D</strong> et les effets de survol.</li>
                    <li>La <strong>propreté du code</strong>.</li>
                </ul>

                <p><a href="/virt-dev">Voir la page des résultats</a></p>
            `
        },

        arborescence: {
            titre: "Formation : arborescence et liaison",
            contenu: `
                <p>Un dossier, c'est une boîte où l'on range les fichiers d'un projet. L'<strong>arborescence</strong>, c'est la façon dont ces dossiers et fichiers sont organisés.</p>

                <h4>Exemple simple (tout à la racine)</h4>
                <div class="bloc-code">Mon-Ecole/
├── index.html
├── contact.html
├── style.css
├── script.js
└── images/
    ├── logo.png
    └── banniere.jpg</div>

                <h4>Exemple structuré (avec sous-dossiers)</h4>
                <div class="bloc-code">Mon-Portfolio/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
└── assets/
    └── images/
        └── profil.jpg</div>

                <h4>Lier le CSS</h4>
                <p>Dans le <code>&lt;head&gt;</code> :</p>
                <pre class="bloc-code"><code class="language-html">&lt;link rel="stylesheet" href="css/style.css"&gt;</code></pre>

                <h4>Lier le JS</h4>
                <p>Juste avant la fermeture du <code>&lt;body&gt;</code> :</p>
                <pre class="bloc-code"><code class="language-html">&lt;script src="js/script.js"&gt;&lt;/script&gt;</code></pre>

                <h4>La règle des chemins</h4>
                <p>On met le <strong>nom du dossier</strong>, un slash, jusqu'au fichier. Pour une image :</p>
                <pre class="bloc-code"><code class="language-html">&lt;img src="assets/images/logo.png" alt="Logo"&gt;</code></pre>
            `
        },

        erreurs: {
            titre: "Cours : les codes d'erreur du web",
            contenu: `
                <p>Chaque réponse d'un serveur commence par un code à trois chiffres. Le premier chiffre donne la <strong>famille</strong> :</p>
                <ul>
                    <li><strong>2xx</strong> — ça marche (200 OK)</li>
                    <li><strong>3xx</strong> — redirection (301, 302)</li>
                    <li><strong>4xx</strong> — erreur du visiteur</li>
                    <li><strong>5xx</strong> — erreur du serveur</li>
                </ul>

                <h4>Les erreurs côté visiteur (4xx)</h4>
                <ul class="liste-codes">
                    <li><span class="code-num">400</span> <strong>Bad Request</strong> — la demande est mal formée. <em>Cause :</em> formulaire incomplet, données invalides.</li>
                    <li><span class="code-num">401</span> <strong>Unauthorized</strong> — il faut être connecté. <em>Cause :</em> session expirée, mauvais mot de passe.</li>
                    <li><span class="code-num">403</span> <strong>Forbidden</strong> — tu es reconnu, mais tu n'as pas le droit. <em>Cause :</em> permissions du fichier ou du dossier.</li>
                    <li><span class="code-num">404</span> <strong>Not Found</strong> — l'adresse ne mène à rien. <em>Cause :</em> fichier renommé, chemin mal écrit, page supprimée.</li>
                    <li><span class="code-num">405</span> <strong>Method Not Allowed</strong> — la méthode (GET, POST…) n'est pas acceptée sur cette adresse. <em>Cause :</em> formulaire envoyé au mauvais endroit.</li>
                    <li><span class="code-num">408</span> <strong>Request Timeout</strong> — le serveur a attendu trop longtemps. <em>Cause :</em> connexion trop lente.</li>
                    <li><span class="code-num">410</span> <strong>Gone</strong> — la page a existé, mais elle est retirée définitivement.</li>
                    <li><span class="code-num">429</span> <strong>Too Many Requests</strong> — trop de demandes en peu de temps. <em>Cause :</em> un limiteur anti-abus.</li>
                </ul>

                <h4>Les erreurs côté serveur (5xx)</h4>
                <ul class="liste-codes">
                    <li><span class="code-num">500</span> <strong>Internal Server Error</strong> — le code du serveur a planté. <em>Cause :</em> bug, variable absente, base de données en erreur.</li>
                    <li><span class="code-num">502</span> <strong>Bad Gateway</strong> — un service intermédiaire ne répond pas correctement.</li>
                    <li><span class="code-num">503</span> <strong>Service Unavailable</strong> — le serveur est surchargé ou en maintenance.</li>
                    <li><span class="code-num">504</span> <strong>Gateway Timeout</strong> — un service intermédiaire a mis trop de temps à répondre.</li>
                </ul>

                <h4>À retenir</h4>
                <p>Un <strong>4xx</strong> vient presque toujours de l'adresse ou des droits. Un <strong>5xx</strong> vient du serveur : c'est lui qui a un problème, pas ton navigateur.</p>
            `
        },

        corriger: {
            titre: "Cours : corriger ces erreurs",
            contenu: `
                <p>Une erreur n'est pas une fin : c'est une <strong>information</strong>. Voici la méthode, étape par étape.</p>

                <h4>1. Lire le code</h4>
                <p>404, 403, 500… Note le code avant de toucher à quoi que ce soit.</p>

                <h4>2. Comprendre la famille</h4>
                <p><strong>4xx</strong> = toi (adresse, fichier, droits). <strong>5xx</strong> = le serveur (bug, panne).</p>

                <h4>3. Vérifier le chemin</h4>
                <p>Un 404 sur ton CSS ? Le fichier est peut-être dans <code>css/</code> alors que tu écris <code>style.css</code>. Vérifie le <strong>nom</strong>, la <strong>casse</strong> et l'<strong>extension</strong>.</p>
                <div class="bloc-code">Mon-Portfolio/
├── index.html
└── css/
    └── style.css</div>
                <pre class="bloc-code"><code class="language-html">&lt;!-- Correct : on indique le dossier --&gt;
&lt;link rel="stylesheet" href="css/style.css"&gt;</code></pre>

                <h4>4. Regarder la console</h4>
                <p><strong>F12</strong> → onglet <strong>Console</strong> pour le JavaScript, onglet <strong>Réseau</strong> pour voir quel fichier renvoie 404.</p>

                <h4>5. Lire les logs</h4>
                <p>Un 500 ne se voit pas dans le navigateur : il faut les <strong>logs du serveur</strong> (sur Render, par exemple) pour connaître la vraie erreur.</p>

                <h4>Le réflexe</h4>
                <p>Une erreur à la fois : on corrige, on recharge, on vérifie. Et on garde le message d'erreur sous les yeux.</p>
            `
        },

        balises: {
            titre: "Cours : les balises HTML usuelles",
            contenu: `
                <p>Une balise dit au navigateur <strong>ce que représente</strong> le contenu. Voici les plus utilisées.</p>

                <h4>Structure de la page</h4>
                <ul>
                    <li><code>html</code> — toute la page</li>
                    <li><code>head</code> — les informations invisibles (titre, styles)</li>
                    <li><code>body</code> — ce que le visiteur voit</li>
                    <li><code>title</code> — le titre de l'onglet</li>
                    <li><code>link</code> — brancher le CSS</li>
                    <li><code>script</code> — brancher le JavaScript</li>
                </ul>

                <h4>Texte</h4>
                <ul>
                    <li><code>h1</code> à <code>h6</code> — les titres, du plus important au moins important</li>
                    <li><code>p</code> — un paragraphe</li>
                    <li><code>strong</code> — un mot important (gras)</li>
                    <li><code>em</code> — un mot accentué (italique)</li>
                    <li><code>br</code> — un retour à la ligne</li>
                </ul>

                <h4>Liens et images</h4>
                <ul>
                    <li><code>a</code> — un lien (attribut <code>href</code>)</li>
                    <li><code>img</code> — une image (attributs <code>src</code> et <code>alt</code>)</li>
                </ul>

                <h4>Listes</h4>
                <ul>
                    <li><code>ul</code> + <code>li</code> — liste à puces</li>
                    <li><code>ol</code> + <code>li</code> — liste numérotée</li>
                </ul>

                <h4>Structure sémantique</h4>
                <ul>
                    <li><code>header</code> — l'en-tête</li>
                    <li><code>nav</code> — le menu</li>
                    <li><code>main</code> — le contenu principal</li>
                    <li><code>section</code> — une section</li>
                    <li><code>footer</code> — le pied de page</li>
                </ul>

                <h4>Formulaires</h4>
                <ul>
                    <li><code>form</code>, <code>label</code>, <code>input</code>, <code>textarea</code>, <code>button</code></li>
                </ul>

                <h4>Conteneurs</h4>
                <ul>
                    <li><code>div</code> — un bloc</li>
                    <li><code>span</code> — un morceau de texte</li>
                </ul>

                <h4>À retenir</h4>
                <p>Une balise = un rôle. On choisit celle qui <strong>décrit le mieux</strong> le contenu, pas celle qui « fait joli ».</p>
            `
        },

        structure: {
            titre: "Cours : la structure d'une page web",
            contenu: `
                <p>Toute page web commence par le même <strong>squelette</strong>. On l'écrit avant le contenu : c'est lui qui prévient le navigateur de ce qu'il va lire.</p>

                <h4>Le squelette complet</h4>
                <pre class="bloc-code"><code class="language-html">&lt;!DOCTYPE html&gt;
&lt;html lang="fr"&gt;
&lt;head&gt;
    &lt;meta charset="UTF-8"&gt;
    &lt;meta name="viewport" content="width=device-width, initial-scale=1.0"&gt;
    &lt;title&gt;Ma page&lt;/title&gt;
    &lt;link rel="stylesheet" href="style.css"&gt;
&lt;/head&gt;
&lt;body&gt;
    &lt;header&gt;...&lt;/header&gt;
    &lt;main&gt;...&lt;/main&gt;
    &lt;footer&gt;...&lt;/footer&gt;
    &lt;script src="script.js"&gt;&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>

                <h4>1. &lt;!DOCTYPE html&gt;</h4>
                <p>La toute première ligne, avant même <code>&lt;html&gt;</code>. Elle dit au navigateur : « ceci est du <strong>HTML5</strong> ». Sans elle, le navigateur passe en mode « compatibilité » et certains styles s'affichent mal.</p>

                <h4>2. &lt;html lang="fr"&gt;</h4>
                <p>La <strong>racine</strong> : tout le document est à l'intérieur. <code>lang="fr"</code> indique la langue — utile pour Google, la traduction automatique et les lecteurs d'écran.</p>

                <h4>3. &lt;head&gt; : l'invisible</h4>
                <p>Rien de ce qui est ici ne s'affiche dans la page. C'est la <strong>carte d'identité</strong> du document :</p>
                <ul>
                    <li><code>&lt;meta charset="UTF-8"&gt;</code> : l'encodage. Sans lui, les accents deviennent des <code>Ã©</code>.</li>
                    <li><code>&lt;meta name="viewport" ...&gt;</code> : la page s'adapte au téléphone. Sans lui, le mobile affiche une version minuscule.</li>
                    <li><code>&lt;title&gt;</code> : le nom de l'onglet… et le titre affiché par Google.</li>
                    <li><code>&lt;link rel="stylesheet" href="style.css"&gt;</code> : branche le CSS.</li>
                </ul>

                <h4>4. &lt;body&gt; : le visible</h4>
                <p>Tout ce que le visiteur voit. On y range le contenu par zones :</p>
                <ul>
                    <li><code>&lt;header&gt;</code> : l'en-tête (logo, menu).</li>
                    <li><code>&lt;main&gt;</code> : le contenu principal — un seul par page.</li>
                    <li><code>&lt;footer&gt;</code> : le pied de page (contact, copyright).</li>
                </ul>

                <h4>5. &lt;script&gt; : le comportement</h4>
                <p>Le JavaScript se place <strong>juste avant &lt;/body&gt;</strong> : comme ça, le contenu s'affiche d'abord et le script ne bloque pas le chargement.</p>

                <h4>Pourquoi cet ordre ?</h4>
                <p>Le navigateur lit <strong>de haut en bas</strong>. Le CSS est dans le <code>head</code> pour que la page soit déjà habillée quand elle s'affiche (sinon : un flash de contenu sans style). Le JS est à la fin pour que le HTML soit prêt quand le script s'exécute.</p>

                <h4>À retenir</h4>
                <p>Trois zones : <strong>head</strong> = les infos invisibles, <strong>body</strong> = ce qu'on voit, <strong>script</strong> = ce qui bouge.</p>
            `
        },

        deepseek: {
            titre: "Formation : DeepSeek Harness (dsh)",
            contenu: `
                <p><strong>DeepSeek Harness</strong> (commande <code>dsh</code>) est un agent de code qui s'exécute sur ton ordinateur : il lit ton projet, propose des modifications et lance des commandes. Voici comment l'installer et l'utiliser, pas à pas.</p>

                <h4>1. Ce qu'il te faut</h4>
                <ul>
                    <li>Un ordinateur Windows, macOS ou Linux.</li>
                    <li><strong>Node.js 24.9 ou plus</strong>.</li>
                    <li>Une clé API DeepSeek (à créer sur platform.deepseek.com).</li>
                    <li>Un terminal (PowerShell sur Windows).</li>
                </ul>

                <h4>2. Vérifier Node.js</h4>
                <pre class="bloc-code"><code class="language-powershell">node -v</code></pre>
                <p>Tu dois voir <code>v24.9.0</code> ou plus. Sinon :</p>
                <pre class="bloc-code"><code class="language-powershell">winget install OpenJS.NodeJS.LTS</code></pre>
                <p>Ferme et rouvre le terminal, puis revérifie.</p>

                <h4>3. Installer DSH</h4>
                <pre class="bloc-code"><code class="language-powershell">npm install -g @deepseek-ai/dsh</code></pre>
                <p>Vérifier l'installation :</p>
                <pre class="bloc-code"><code class="language-powershell">dsh --version</code></pre>
                <p>Si un numéro de version s'affiche (par exemple <code>0.2.2</code>), c'est bon.</p>

                <h4>4. Lancer DSH</h4>
                <p>Place-toi dans le dossier de ton projet : ce dossier devient le <strong>workspace</strong>.</p>
                <pre class="bloc-code"><code class="language-powershell">cd C:\Users\ipote\virt_tech
dsh web</code></pre>
                <p>Ouvre l'adresse affichée : <strong>http://127.0.0.1:3080</strong>.</p>
                <p>Autres modes :</p>
                <ul>
                    <li><code>dsh tui</code> : interface dans le terminal.</li>
                    <li><code>dsh headless "explique ce projet"</code> : une tâche, une réponse, puis quitter.</li>
                    <li><code>dsh --profile web --port 8080</code> : changer le port.</li>
                </ul>

                <h4>5. La clé API</h4>
                <p>Au premier lancement, DSH crée le dossier <code>C:\Users\ipote\.dsh</code> (profils, sessions, identifiants). Renseigne ta <strong>clé API</strong> dans l'interface : elle est stockée dans <code>.credentials.yaml</code>, jamais dans le code.</p>

                <h4>6. Commandes utiles</h4>
                <ul>
                    <li><code>dsh --help</code> : l'aide générale.</li>
                    <li><code>dsh web --help</code> : les options du mode web.</li>
                    <li><code>dsh plugin --profile web add &lt;paquet&gt;</code> : ajouter un plugin.</li>
                    <li><code>npm i -g @deepseek-ai/dsh@latest</code> : mettre à jour.</li>
                    <li><code>Ctrl + C</code> : arrêter DSH.</li>
                </ul>

                <h4>7. Erreurs fréquentes et solutions</h4>
                <ul>
                    <li><strong>« dsh n'est pas reconnu »</strong> : le dossier npm n'est pas dans le PATH. Regarde <code>npm config get prefix</code>, ajoute ce dossier au PATH, puis rouvre le terminal.</li>
                    <li><strong>Node trop ancien</strong> : installe Node 24 avec <code>winget install OpenJS.NodeJS.LTS</code> (ou nvm).</li>
                    <li><strong>EPERM / accès refusé sur .dsh</strong> : ferme les autres fenêtres DSH, vérifie l'antivirus, relance le terminal en administrateur.</li>
                    <li><strong>Port déjà utilisé</strong> : <code>dsh --profile web --port 8080</code>.</li>
                    <li><strong>Script PowerShell bloqué</strong> : <code>Set-ExecutionPolicy -Scope CurrentUser RemoteSigned</code>.</li>
                    <li><strong>EACCES (macOS / Linux)</strong> : n'installe pas en sudo, utilise nvm.</li>
                    <li><strong>Rien ne s'ouvre</strong> : vérifie l'URL affichée dans le terminal et les messages d'erreur.</li>
                </ul>

                <h4>8. À retenir</h4>
                <ul>
                    <li>Le dossier où tu lances <code>dsh</code> est le workspace : l'agent lit et modifie ce dossier.</li>
                    <li>Une clé API est un accès : ne la partage jamais.</li>
                    <li>En cas de doute : <code>dsh --help</code>.</li>
                </ul>

                <h4>9. Bloqué ? Envoie ce prompt à une IA</h4>
                <p>Copie le texte ci-dessous, complète les champs entre crochets et envoie-le à une IA externe :</p>
                <pre class="bloc-code"><code class="language-text">Je suis bloqué en installant DeepSeek Harness (commande dsh).
Système : [Windows 11 / macOS 14 / Ubuntu 24.04]
Version de Node : [résultat de node -v]
Commande exécutée : [ex. npm install -g @deepseek-ai/dsh]
Message d'erreur complet : [colle l'erreur]
Ce que j'ai déjà essayé : [ex. réinstallé Node, changé le port]
Je veux : [ex. lancer dsh web sur le port 3080]
Explique-moi la cause et donne les commandes exactes pour corriger, étape par étape.</code></pre>
            `
        }
    };

    // ===============================================================
    // 2. SLIDE
    // ===============================================================
    const overlay = document.getElementById("slide-overlay");
    const panel = document.getElementById("slide-panel");
    const titre = document.getElementById("slide-title");
    const contenu = document.getElementById("slide-contenu");
    const fermer = document.getElementById("btn-fermer-slide");

    let dernierFocus = null;

    // Bouton « Copier » sur chaque bloc de code
    function ajouterBoutonsCopier() {
        contenu.querySelectorAll(".bloc-code").forEach(function (bloc) {
            if (bloc.querySelector(".btn-copier-code")) return;

            const bouton = document.createElement("button");
            bouton.type = "button";
            bouton.className = "btn-copier-code";
            bouton.setAttribute("aria-label", "Copier ce code");
            bouton.innerHTML = '<i class="fa-regular fa-copy" aria-hidden="true"></i> Copier';

            bouton.addEventListener("click", async function (e) {
                e.stopPropagation();

                const code = bloc.querySelector("code");
                let texte;

                if (code) {
                    texte = code.textContent;
                } else {
                    const copie = bloc.cloneNode(true);
                    copie.querySelectorAll(".btn-copier-code").forEach(function (b) { b.remove(); });
                    texte = copie.textContent;
                }

                function succes() {
                    bouton.innerHTML = '<i class="fa-solid fa-check" aria-hidden="true"></i> Copié';
                    setTimeout(function () {
                        bouton.innerHTML = '<i class="fa-regular fa-copy" aria-hidden="true"></i> Copier';
                    }, 1600);
                }

                try {
                    await navigator.clipboard.writeText(texte);
                    succes();
                } catch (err) {
                    const zone = document.createElement("textarea");
                    zone.value = texte;
                    zone.style.position = "fixed";
                    zone.style.opacity = "0";
                    document.body.appendChild(zone);
                    zone.select();
                    try { document.execCommand("copy"); succes(); } catch (e2) { zone.remove(); }
                    zone.remove();
                }
            });

            bloc.appendChild(bouton);
        });
    }

    function colorerCode() {
        if (!window.Prism || !Prism.highlightAllUnder) return;
        try {
            Prism.highlightAllUnder(contenu);
        } catch (e) {
            // Si un langage ne charge pas, le code reste en texte brut
        }
    }

    function ouvrirSlide(id, declencheur) {
        const data = cours[id];
        if (!data) return;

        titre.textContent = data.titre;
        contenu.innerHTML = data.contenu;
        colorerCode();
        ajouterBoutonsCopier();
        contenu.scrollTop = 0;
        dernierFocus = declencheur || document.activeElement;

        overlay.classList.add("ouvert");
        panel.classList.add("ouvert");
        document.body.style.overflow = "hidden";
        fermer.focus();
    }

    function fermerSlide() {
        overlay.classList.remove("ouvert");
        panel.classList.remove("ouvert");
        document.body.style.overflow = "";
        if (dernierFocus) dernierFocus.focus();
    }

    overlay.addEventListener("click", fermerSlide);
    fermer.addEventListener("click", fermerSlide);

    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && panel.classList.contains("ouvert")) fermerSlide();
    });

    // ===============================================================
    // 3. COMPTEUR DE CLICS « RUN »
    // ===============================================================
    function badgeDe(bouton) {
        return bouton.querySelector(".nb-run");
    }

    async function chargerCompteurs() {
        try {
            const reponse = await fetch("/api/activites/stats");
            const data = await reponse.json();
            if (!data.succes) return;

            document.querySelectorAll(".btn-run").forEach(function (bouton) {
                const slug = bouton.dataset.slug;
                const badge = badgeDe(bouton);
                const valeur = data.data[slug];

                if (badge && typeof valeur === "number") {
                    badge.textContent = valeur;
                    badge.hidden = false;
                }
            });
        } catch (e) {
            // Pas de stats : on masque simplement les compteurs
        }
    }

    async function compterClic(slug, bouton) {
        try {
            const reponse = await fetch("/api/activites/" + encodeURIComponent(slug) + "/run", {
                method: "POST"
            });
            const data = await reponse.json();
            const badge = badgeDe(bouton);

            if (data.succes && badge) {
                badge.textContent = data.clics;
                badge.hidden = false;
            }
        } catch (e) {
            // Le compteur est un bonus : l'ouverture du cours ne doit pas en dépendre
        }
    }

    // ===============================================================
    // 4. BOUTONS RUN
    // ===============================================================
    document.querySelectorAll(".btn-run").forEach(function (bouton) {
        bouton.addEventListener("click", function () {
            const id = bouton.dataset.slide;
            const slug = bouton.dataset.slug || id;

            ouvrirSlide(id, bouton);
            compterClic(slug, bouton);
        });
    });

    // ===============================================================
    // 5. DÉMARRAGE
    // ===============================================================
    chargerCompteurs();

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
