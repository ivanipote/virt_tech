// --- astucesSeed2.js ---
// 100 astuces avancées signées VirtTech (Git, HTML, CSS, JS, Node, sécurité).

const ASTUCES_2 = [
    // ===================== GIT / VS CODE (15) =====================
    {
        titre: "Installer Git et vérifier",
        contenu: "Git est l'outil qui enregistre l'historique de ton code. Après l'installation, vérifie qu'il est bien reconnu dans le terminal.",
        langage: "Bash", niveau: "Débutant",
        code: `git --version
git config --global user.name "Ton Nom"
git config --global user.email "toi@email.com"`
    },
    {
        titre: "Créer un dépôt Git dans un projet",
        contenu: "git init crée un dépôt local dans le dossier. git status montre les fichiers modifiés.",
        langage: "Bash", niveau: "Débutant",
        code: `cd mon-projet
git init
git status`
    },
    {
        titre: "Connecter VS Code à GitHub",
        contenu: "Clone un dépôt GitHub depuis VS Code : Ctrl+Shift+P → « Git: Clone » → colle l'URL. VS Code ouvre le projet et tu peux travailler directement.",
        langage: "Autre", niveau: "Débutant",
        code: `# Dans le terminal VS Code :
git clone https://github.com/utilisateur/projet.git`
    },
    {
        titre: "git add, commit, push : le trio de base",
        contenu: "add prépare les fichiers, commit enregistre une version, push envoie sur GitHub. Toujours un message clair dans commit.",
        langage: "Bash", niveau: "Débutant",
        code: `git add .
git commit -m "Ajoute la page contact"
git push origin main`
    },
    {
        titre: "Le fichier .gitignore",
        contenu: "Il liste ce que Git ne doit jamais envoyer : node_modules, .env, fichiers temporaires. À créer dès le début du projet.",
        langage: "Bash", niveau: "Débutant",
        code: `node_modules/
.env
*.log`
    },
    {
        titre: "Mettre à jour son dépôt local",
        contenu: "Quand quelqu'un a modifié le dépôt GitHub, récupère les changements avant de pousser.",
        langage: "Bash", niveau: "Intermédiaire",
        code: `git pull origin main`
    },
    {
        titre: "Créer une branche et travailler proprement",
        contenu: "Une branche isole tes changements. Tu la fusionnes dans main quand tout fonctionne.",
        langage: "Bash", niveau: "Intermédiaire",
        code: `git checkout -b ma-fonctionnalite
git add .
git commit -m "Nouvelle fonctionnalité"
git push origin ma-fonctionnalite`
    },
    {
        titre: "Résoudre un conflit simple",
        contenu: "Git signale les fichiers en conflit. Ouvre-les, choisis le bon contenu entre les marqueurs, puis add et commit.",
        langage: "Bash", niveau: "Intermédiaire",
        code: `git status
# corrige le fichier
git add fichier.js
git commit -m "Résout le conflit"`
    },
    {
        titre: "Voir l'historique des commits",
        contenu: "git log affiche les versions, git log --oneline une version compacte.",
        langage: "Bash", niveau: "Débutant",
        code: `git log --oneline -10`
    },
    {
        titre: "Annuler le dernier commit sans perdre le code",
        contenu: "git reset --soft garde tes modifications dans les fichiers et annule seulement le commit.",
        langage: "Bash", niveau: "Intermédiaire",
        code: `git reset --soft HEAD~1`
    },
    {
        titre: "Annuler un commit déjà poussé",
        contenu: "git revert crée un nouveau commit qui annule un ancien : plus sûr que reset quand c'est déjà sur GitHub.",
        langage: "Bash", niveau: "Intermédiaire",
        code: `git revert <hash-du-commit>
git push origin main`
    },
    {
        titre: "Voir les différences avant de commit",
        contenu: "git diff montre ce qui a changé dans les fichiers non préparés. idéal pour éviter les oublis.",
        langage: "Bash", niveau: "Intermédiaire",
        code: `git diff`
    },
    {
        titre: "Le terminal intégré de VS Code",
        contenu: "Ouvre-le avec Ctrl+ù (ou Ctrl+` selon le clavier). Tu peux faire toutes les commandes Git sans quitter l'éditeur.",
        langage: "Autre", niveau: "Débutant",
        code: `Ctrl + ù`
    },
    {
        titre: "Les extensions VS Code indispensables",
        contenu: "Installe Prettier (formatage), Live Server (aperçu), GitLens (historique) et Error Lens (erreurs visibles directement).",
        langage: "Autre", niveau: "Débutant",
        code: `Prettier - Code formatter
Live Server
GitLens
Error Lens`
    },
    {
        titre: "Créer un dépôt GitHub depuis VS Code",
        contenu: "Panneau Source Control → « Publish to GitHub » → choisis le nom et public/privé. VS Code fait le premier push pour toi.",
        langage: "Autre", niveau: "Débutant",
        code: `Source Control → Publish to GitHub`
    },

    // ===================== VARIABLES D'ENVIRONNEMENT (5) =====================
    {
        titre: "Stocker ses secrets dans un .env",
        contenu: "Ne mets jamais une clé API dans le code. Crée un fichier .env à la racine et lis-le avec process.env.",
        langage: "Node.js", niveau: "Débutant",
        code: `# .env
API_KEY=sk-ta-cle-secrete
PORT=3000`
    },
    {
        titre: "Lire un .env avec dotenv",
        contenu: "La bibliothèque dotenv charge le fichier .env dans process.env au démarrage du serveur.",
        langage: "Node.js", niveau: "Débutant",
        code: `require('dotenv').config();
console.log(process.env.PORT);`
    },
    {
        titre: "Ne jamais committer le .env",
        contenu: "Ajoute .env dans .gitignore dès le premier commit. Sinon ta clé est publique sur GitHub.",
        langage: "Bash", niveau: "Débutant",
        code: `# .gitignore
.env`
    },
    {
        titre: "Partager un modèle .env.example",
        contenu: "Crée un fichier .env.example avec les noms de variables sans les valeurs : les autres savent quoi remplir.",
        langage: "Node.js", niveau: "Débutant",
        code: `# .env.example
API_KEY=
PORT=3000`
    },
    {
        titre: "Vérifier une variable manquante au démarrage",
        contenu: "Arrête le serveur avec un message clair si une variable essentielle manque, au lieu de planter plus tard.",
        langage: "Node.js", niveau: "Intermédiaire",
        code: `if (!process.env.API_KEY) {
  console.error("API_KEY manquante dans .env");
  process.exit(1);
}`
    },

    // ===================== HTML (20) =====================
    {
        titre: "Les balises sémantiques",
        contenu: "header, nav, main, section, article, aside, footer décrivent le rôle de chaque zone : meilleur SEO et meilleure accessibilité.",
        langage: "HTML", niveau: "Débutant",
        code: `<header>...</header>
<nav>...</nav>
<main>...</main>
<footer>...</footer>`
    },
    {
        titre: "Ajouter une vidéo ou un audio",
        contenu: "video et audio acceptent plusieurs sources et un fallback texte si le navigateur ne supporte pas.",
        langage: "HTML", niveau: "Débutant",
        code: `<video controls width="400">
  <source src="video.mp4" type="video/mp4">
  Ton navigateur ne supporte pas la vidéo.
</video>`
    },
    {
        titre: "Un accordéon sans JavaScript",
        contenu: "details et summary créent un bloc repliable natif, accessible et sans une ligne de JS.",
        langage: "HTML", niveau: "Débutant",
        code: `<details>
  <summary>Voir la réponse</summary>
  <p>Voici le contenu caché.</p>
</details>`
    },
    {
        titre: "Un tableau lisible",
        contenu: "Utilise thead, tbody, th pour les entêtes et caption pour le titre du tableau.",
        langage: "HTML", niveau: "Débutant",
        code: `<table>
  <caption>Notes</caption>
  <thead><tr><th>Nom</th><th>Note</th></tr></thead>
  <tbody><tr><td>Ivan</td><td>18</td></tr></tbody>
</table>`
    },
    {
        titre: "La balise viewport pour le mobile",
        contenu: "Sans elle, le site s'affiche minuscule sur téléphone. À mettre dans le head de chaque page.",
        langage: "HTML", niveau: "Débutant",
        code: `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
    },
    {
        titre: "Ajouter un favicon",
        contenu: "Le favicon est l'icône de l'onglet. Place le fichier à la racine et déclare-le dans le head.",
        langage: "HTML", niveau: "Débutant",
        code: `<link rel="icon" href="/favicon.png" type="image/png">`
    },
    {
        titre: "Relier un label à son champ",
        contenu: "Le for du label doit correspondre à l'id du champ : cliquer sur le label active le champ.",
        langage: "HTML", niveau: "Débutant",
        code: `<label for="email">Email</label>
<input type="email" id="email" name="email">`
    },
    {
        titre: "Une liste déroulante",
        contenu: "select et option créent un menu déroulant. L'attribut value est la valeur envoyée au serveur.",
        langage: "HTML", niveau: "Débutant",
        code: `<select name="langage">
  <option value="html">HTML</option>
  <option value="css">CSS</option>
</select>`
    },
    {
        titre: "Une zone de texte multiligne",
        contenu: "textarea sert aux messages longs. rows contrôle la hauteur visible.",
        langage: "HTML", niveau: "Débutant",
        code: `<textarea name="message" rows="5" placeholder="Ton message"></textarea>`
    },
    {
        titre: "Envoyer un formulaire",
        contenu: "action indique la destination, method la façon d'envoyer (POST pour un formulaire de contact).",
        langage: "HTML", niveau: "Débutant",
        code: `<form action="/api/contact" method="POST">
  <input name="email" type="email" required>
  <button type="submit">Envoyer</button>
</form>`
    },
    {
        titre: "Grouper des champs",
        contenu: "fieldset et legend regroupent visuellement des champs liés, utile pour les formulaires longs.",
        langage: "HTML", niveau: "Débutant",
        code: `<fieldset>
  <legend>Adresse</legend>
  <input name="ville" placeholder="Ville">
</fieldset>`
    },
    {
        titre: "Citer un texte",
        contenu: "blockquote pour une citation longue, q pour une citation courte. cite donne la source.",
        langage: "HTML", niveau: "Débutant",
        code: `<blockquote cite="https://exemple.com">
  <p>Le code, c'est de la poésie.</p>
</blockquote>`
    },
    {
        titre: "Une image avec sa légende",
        contenu: "figure et figcaption lient une image à sa légende de façon sémantique.",
        langage: "HTML", niveau: "Débutant",
        code: `<figure>
  <img src="projet.png" alt="Aperçu du projet">
  <figcaption>Aperçu de mon projet.</figcaption>
</figure>`
    },
    {
        titre: "Plusieurs images selon l'écran",
        contenu: "picture et source permettent de charger une image différente sur mobile et sur PC.",
        langage: "HTML", niveau: "Intermédiaire",
        code: `<picture>
  <source media="(max-width: 600px)" srcset="petite.jpg">
  <img src="grande.jpg" alt="Exemple">
</picture>`
    },
    {
        titre: "Intégrer une page externe",
        contenu: "iframe affiche une page dans une page. Ajoute loading=lazy pour ne pas ralentir le chargement.",
        langage: "HTML", niveau: "Intermédiaire",
        code: `<iframe src="https://exemple.com" loading="lazy" title="Page externe"></iframe>`
    },
    {
        titre: "Dessiner avec canvas",
        contenu: "canvas est une zone de dessin manipulée en JavaScript. Donne-lui width et height.",
        langage: "HTML", niveau: "Intermédiaire",
        code: `<canvas id="dessin" width="300" height="200"></canvas>`
    },
    {
        titre: "Afficher une progression",
        contenu: "progress montre une barre de progression, meter une jauge (note, niveau).",
        langage: "HTML", niveau: "Débutant",
        code: `<progress value="70" max="100">70 %</progress>
<meter value="8" min="0" max="10">8 / 10</meter>`
    },
    {
        titre: "Définir une abréviation",
        contenu: "abbr avec title affiche l'explication au survol. Les lecteurs d'écran la lisent aussi.",
        langage: "HTML", niveau: "Débutant",
        code: `<abbr title="HyperText Markup Language">HTML</abbr>`
    },
    {
        titre: "Proposer des suggestions de saisie",
        contenu: "datalist offre une liste de suggestions tout en laissant l'utilisateur libre de taper autre chose.",
        langage: "HTML", niveau: "Intermédiaire",
        code: `<input list="villes" name="ville">
<datalist id="villes">
  <option value="Abidjan">
  <option value="Yamoussoukro">
</datalist>`
    },
    {
        titre: "Le template réutilisable",
        contenu: "template garde du HTML inactif que tu clones en JavaScript. Parfait pour des listes générées.",
        langage: "HTML", niveau: "Intermédiaire",
        code: `<template id="ligne">
  <li class="item"></li>
</template>`
    },

    // ===================== CSS ANIMATIONS & MISE EN PAGE (20) =====================
    {
        titre: "Un bouton qui réagit au survol",
        contenu: "Une transition rend le changement de style fluide. Toujours sur la propriété utilisée (background, transform…).",
        langage: "CSS", niveau: "Débutant",
        code: `.btn {
  transition: background .3s, transform .3s;
}
.btn:hover { background: #D4AF37; transform: translateY(-2px); }`
    },
    {
        titre: "Un loader qui tourne",
        contenu: "Un cercle avec une bordure colorée et animation: spin tourne à l'infini.",
        langage: "CSS", niveau: "Débutant",
        code: `.loader {
  width: 40px; height: 40px;
  border: 4px solid #eee;
  border-top-color: #D4AF37;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }`
    },
    {
        titre: "Apparition en fondu",
        contenu: "Une animation d'opacité avec forwards garde l'état final visible.",
        langage: "CSS", niveau: "Débutant",
        code: `.fade-in {
  animation: fade .8s ease forwards;
}
@keyframes fade {
  from { opacity: 0; }
  to { opacity: 1; }
}`
    },
    {
        titre: "Glissement depuis la gauche",
        contenu: "translateX + opacité donne une entrée élégante pour une carte ou un panneau.",
        langage: "CSS", niveau: "Débutant",
        code: `.slide-in {
  animation: slide .6s ease forwards;
}
@keyframes slide {
  from { opacity: 0; transform: translateX(-40px); }
  to { opacity: 1; transform: translateX(0); }
}`
    },
    {
        titre: "Un cœur qui pulse",
        contenu: "Une échelle qui varie légèrement crée un effet de respiration, idéal pour un bouton d'action.",
        langage: "CSS", niveau: "Débutant",
        code: `.pulse {
  animation: pulse 1.6s ease-in-out infinite;
}
@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.08); }
}`
    },
    {
        titre: "Un dégradé animé",
        contenu: "Un dégradé plus large que l'élément, animé en background-position, donne un effet lumineux.",
        langage: "CSS", niveau: "Intermédiaire",
        code: `.gradient {
  background: linear-gradient(90deg, #D4AF37, #161F27, #D4AF37);
  background-size: 200% 100%;
  animation: brillance 4s linear infinite;
}
@keyframes brillance { to { background-position: -200% 0; } }`
    },
    {
        titre: "Effet machine à écrire",
        contenu: "Des steps() avec une largeur animée donnent l'illusion d'un texte tapé, sans JavaScript.",
        langage: "CSS", niveau: "Intermédiaire",
        code: `.typing {
  width: 12ch;
  overflow: hidden;
  white-space: nowrap;
  border-right: 2px solid;
  animation: frappe 3s steps(12) infinite;
}
@keyframes frappe { from { width: 0; } to { width: 12ch; } }`
    },
    {
        titre: "Une carte qui se soulève",
        contenu: "translateY + ombre douce au survol : un classique des interfaces modernes.",
        langage: "CSS", niveau: "Débutant",
        code: `.carte {
  transition: transform .25s, box-shadow .25s;
}
.carte:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 30px rgba(0,0,0,.12);
}`
    },
    {
        titre: "Une grille responsive sans media query",
        contenu: "grid-template-columns: repeat(auto-fit, minmax(...)) crée autant de colonnes que l'écran le permet.",
        langage: "CSS", niveau: "Intermédiaire",
        code: `.grille {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}`
    },
    {
        titre: "Une taille de texte fluide avec clamp",
        contenu: "clamp(min, idéal, max) adapte la taille au viewport sans media query.",
        langage: "CSS", niveau: "Intermédiaire",
        code: `h1 { font-size: clamp(1.5rem, 4vw, 3rem); }`
    },
    {
        titre: "Garder les proportions d'une image",
        contenu: "aspect-ratio réserve la bonne hauteur avant même que l'image charge : plus de saut de mise en page.",
        langage: "CSS", niveau: "Intermédiaire",
        code: `.apercu {
  aspect-ratio: 16 / 9;
  object-fit: cover;
  width: 100%;
}`
    },
    {
        titre: "Un en-tête qui reste collé",
        contenu: "position: sticky colle l'élément au scroll à partir de top: 0.",
        langage: "CSS", niveau: "Intermédiaire",
        code: `header {
  position: sticky;
  top: 0;
  background: #fff;
  z-index: 10;
}`
    },
    {
        titre: "Un défilement qui s'arrête sur chaque section",
        contenu: "scroll-snap-type crée un défilement aimanté, parfait pour un carrousel horizontal.",
        langage: "CSS", niveau: "Intermédiaire",
        code: `.carrousel {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
}
.carrousel > * { scroll-snap-align: center; flex: 0 0 100%; }`
    },
    {
        titre: "Personnaliser la barre de défilement",
        contenu: "Deux propriétés suffisent sur WebKit, et scrollbar-width sur Firefox.",
        langage: "CSS", niveau: "Intermédiaire",
        code: `::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-thumb {
  background: #D4AF37;
  border-radius: 8px;
}`
    },
    {
        titre: "Mode sombre automatique",
        contenu: "prefers-color-scheme applique des styles selon le réglage du système, sans JavaScript.",
        langage: "CSS", niveau: "Intermédiaire",
        code: `@media (prefers-color-scheme: dark) {
  body { background: #161F27; color: #fff; }
}`
    },
    {
        titre: "Afficher le focus clavier",
        contenu: ":focus-visible affiche le contour uniquement au clavier, pas au clic : accessibilité sans nuisance.",
        langage: "CSS", niveau: "Intermédiaire",
        code: `button:focus-visible {
  outline: 3px solid #D4AF37;
  outline-offset: 3px;
}`
    },
    {
        titre: "Respecter les animations réduites",
        contenu: "Certaines personnes désactivent les animations pour des raisons de santé. Désactive-les proprement.",
        langage: "CSS", niveau: "Intermédiaire",
        code: `@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition: none !important; }
}`
    },
    {
        titre: "Une ombre douce réaliste",
        contenu: "Plusieurs couches d'ombre, très légères, donnent un relief plus naturel qu'une seule ombre forte.",
        langage: "CSS", niveau: "Intermédiaire",
        code: `.carte {
  box-shadow:
    0 1px 2px rgba(0,0,0,.06),
    0 8px 24px rgba(0,0,0,.08);
}`
    },
    {
        titre: "Un dégradé de texte",
        contenu: "background-clip: text + transparent colore le texte avec un dégradé.",
        langage: "CSS", niveau: "Intermédiaire",
        code: `.titre {
  background: linear-gradient(90deg, #D4AF37, #161F27);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}`
    },
    {
        titre: "Un bouton avec reflet au survol",
        contenu: "Un pseudo-élément en dégradé qui traverse le bouton au survol : simple et élégant.",
        langage: "CSS", niveau: "Avancé",
        code: `.btn { position: relative; overflow: hidden; }
.btn::after {
  content: "";
  position: absolute; inset: 0;
  background: linear-gradient(120deg, transparent, rgba(255,255,255,.4), transparent);
  transform: translateX(-100%);
  transition: transform .6s;
}
.btn:hover::after { transform: translateX(100%); }`
    },

    // ===================== JAVASCRIPT (20) =====================
    {
        titre: "Les template literals",
        contenu: "Les backticks permettent d'insérer des variables avec ${} et d'écrire du multi-ligne sans concaténation.",
        langage: "JavaScript", niveau: "Débutant",
        code: "const nom = 'VirtTech';\nconsole.log(`Bienvenue sur ${nom}`);"
    },
    {
        titre: "Déstructurer un objet",
        contenu: "Tu extrais des propriétés en une ligne au lieu de répéter objet.propriete.",
        langage: "JavaScript", niveau: "Intermédiaire",
        code: `const user = { nom: "Ivan", age: 21 };
const { nom, age } = user;`
    },
    {
        titre: "Fusionner avec le spread",
        contenu: "Le ... copie ou fusionne des objets et tableaux sans les modifier.",
        langage: "JavaScript", niveau: "Intermédiaire",
        code: `const a = { x: 1 };
const b = { ...a, y: 2 };`
    },
    {
        titre: "map, filter, reduce",
        contenu: "map transforme, filter garde certains éléments, reduce accumule une valeur. Les trois piliers des tableaux.",
        langage: "JavaScript", niveau: "Intermédiaire",
        code: `const nums = [1, 2, 3];
const doubles = nums.map(n => n * 2);
const pairs = nums.filter(n => n % 2 === 0);`
    },
    {
        titre: "Appeler une API avec fetch et async",
        contenu: "await attend la réponse, response.json() lit le corps. Toujours entouré de try/catch.",
        langage: "JavaScript", niveau: "Intermédiaire",
        code: `async function charger() {
  const r = await fetch("/api/data");
  const data = await r.json();
  console.log(data);
}`
    },
    {
        titre: "Gérer les erreurs proprement",
        contenu: "try/catch attrape les erreurs ; finally s'exécute toujours (fermer un loader, par exemple).",
        langage: "JavaScript", niveau: "Intermédiaire",
        code: `try {
  await charger();
} catch (e) {
  console.error(e);
} finally {
  masquerLoader();
}`
    },
    {
        titre: "L'optional chaining",
        contenu: "?.. évite les erreurs quand une propriété intermédiaire est undefined.",
        langage: "JavaScript", niveau: "Intermédiaire",
        code: `const ville = user?.adresse?.ville;`
    },
    {
        titre: "Nullish coalescing",
        contenu: "?? renvoie la valeur de droite seulement si la gauche est null ou undefined (contrairement à ||).",
        langage: "JavaScript", niveau: "Intermédiaire",
        code: `const nom = saisie ?? "Invité";`
    },
    {
        titre: "Sauvegarder un objet dans localStorage",
        contenu: "localStorage ne stocke que du texte : JSON.stringify à l'écriture, JSON.parse à la lecture.",
        langage: "JavaScript", niveau: "Intermédiaire",
        code: `localStorage.setItem("user", JSON.stringify({ nom: "Ivan" }));
const user = JSON.parse(localStorage.getItem("user") || "{}");`
    },
    {
        titre: "Attendre avant d'agir",
        contenu: "setTimeout exécute une fois après un délai, setInterval répète. Pense à clearInterval.",
        langage: "JavaScript", niveau: "Débutant",
        code: `setTimeout(() => console.log("2 secondes"), 2000);`
    },
    {
        titre: "La délégation d'événements",
        contenu: "Écoute le parent plutôt que chaque enfant : plus performant et fonctionne avec les éléments ajoutés après.",
        langage: "JavaScript", niveau: "Avancé",
        code: `liste.addEventListener("click", (e) => {
  if (e.target.matches("li")) console.log(e.target.textContent);
});`
    },
    {
        titre: "Changer une classe proprement",
        contenu: "classList.toggle ajoute ou retire une classe en une ligne.",
        langage: "JavaScript", niveau: "Débutant",
        code: `menu.classList.toggle("ouvert");`
    },
    {
        titre: "Formater une date en français",
        contenu: "Intl.DateTimeFormat formate la date selon la langue, sans bibliothèque.",
        langage: "JavaScript", niveau: "Intermédiaire",
        code: `new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(new Date());`
    },
    {
        titre: "Chercher dans un tableau",
        contenu: "includes teste la présence, find renvoie le premier élément correspondant.",
        langage: "JavaScript", niveau: "Débutant",
        code: `const noms = ["Awa", "Ivan"];
noms.includes("Ivan");           // true
noms.find(n => n === "Awa");     // "Awa"`
    },
    {
        titre: "Parcourir les clés d'un objet",
        contenu: "Object.entries renvoie des paires [clé, valeur] faciles à parcourir.",
        langage: "JavaScript", niveau: "Intermédiaire",
        code: `Object.entries({ a: 1, b: 2 }).forEach(([cle, valeur]) => {
  console.log(cle, valeur);
});`
    },
    {
        titre: "Lancer plusieurs requêtes en parallèle",
        contenu: "Promise.all attend toutes les promesses ; plus rapide que les await successifs.",
        langage: "JavaScript", niveau: "Avancé",
        code: `const [a, b] = await Promise.all([
  fetch("/api/a").then(r => r.json()),
  fetch("/api/b").then(r => r.json())
]);`
    },
    {
        titre: "Annuler une requête",
        contenu: "AbortController permet de stopper un fetch en cours (changement de page, recherche annulée).",
        langage: "JavaScript", niveau: "Avancé",
        code: `const c = new AbortController();
fetch("/api", { signal: c.signal });
c.abort();`
    },
    {
        titre: "Limiter les appels avec un debounce",
        contenu: "Attends une pause de frappe avant d'appeler l'API : moins de requêtes, meilleure expérience.",
        langage: "JavaScript", niveau: "Avancé",
        code: `let t;
input.addEventListener("input", () => {
  clearTimeout(t);
  t = setTimeout(() => chercher(input.value), 400);
});`
    },
    {
        titre: "Copier du texte en un clic",
        contenu: "L'API Clipboard copie proprement, sans sélection manuelle.",
        langage: "JavaScript", niveau: "Intermédiaire",
        code: `await navigator.clipboard.writeText("Texte copié");`
    },
    {
        titre: "Détecter quand un élément devient visible",
        contenu: "IntersectionObserver déclenche une action quand un élément entre dans l'écran : idéal pour les animations au scroll.",
        langage: "JavaScript", niveau: "Avancé",
        code: `new IntersectionObserver((entrees) => {
  entrees.forEach(e => { if (e.isIntersecting) e.target.classList.add("vu"); });
}).observe(document.querySelector(".section"));`
    },

    // ===================== NODE.JS (15) =====================
    {
        titre: "Un serveur Express minimal",
        contenu: "Express simplifie la création de serveurs HTTP : une route, un port, c'est parti.",
        langage: "Node.js", niveau: "Débutant",
        code: `const express = require("express");
const app = express();
app.get("/", (req, res) => res.send("Bonjour"));
app.listen(3000);`
    },
    {
        titre: "Lire du JSON envoyé par le client",
        contenu: "express.json() transforme le corps de la requête en objet JavaScript dans req.body.",
        langage: "Node.js", niveau: "Débutant",
        code: `app.use(express.json());
app.post("/api/contact", (req, res) => {
  console.log(req.body.email);
  res.json({ ok: true });
});`
    },
    {
        titre: "Un middleware, c'est quoi ?",
        contenu: "Une fonction qui s'exécute avant la route : logger, vérifier une clé, bloquer une requête.",
        langage: "Node.js", niveau: "Intermédiaire",
        code: `app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});`
    },
    {
        titre: "Servir des fichiers statiques",
        contenu: "express.static sert un dossier (HTML, CSS, images) sans écrire une route pour chaque fichier.",
        langage: "Node.js", niveau: "Débutant",
        code: `app.use(express.static("public"));`
    },
    {
        titre: "Une gestion d'erreurs centralisée",
        contenu: "Un middleware à 4 arguments attrape les erreurs de toutes les routes. Toujours renvoyer un JSON propre.",
        langage: "Node.js", niveau: "Intermédiaire",
        code: `app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Erreur serveur" });
});`
    },
    {
        titre: "Helmet : sécuriser les en-têtes",
        contenu: "Helmet ajoute des en-têtes de sécurité (CSP, X-Frame-Options…) en une ligne.",
        langage: "Node.js", niveau: "Intermédiaire",
        code: `const helmet = require("helmet");
app.use(helmet());`
    },
    {
        titre: "CORS : autoriser un autre domaine",
        contenu: "Par défaut, un navigateur bloque les requêtes vers un autre domaine. CORS le permet, idéalement pour un domaine précis.",
        langage: "Node.js", niveau: "Intermédiaire",
        code: `const cors = require("cors");
app.use(cors({ origin: "https://virttech.site" }));`
    },
    {
        titre: "Limiter les requêtes abusives",
        contenu: "express-rate-limit bloque les rafales de requêtes par IP, sans bloquer les visiteurs normaux.",
        langage: "Node.js", niveau: "Intermédiaire",
        code: `const rateLimit = require("express-rate-limit");
app.use(rateLimit({ windowMs: 10 * 60 * 1000, max: 100 }));`
    },
    {
        titre: "Hacher un mot de passe avec bcrypt",
        contenu: "On ne stocke jamais un mot de passe en clair : bcrypt le hache avec un sel.",
        langage: "Node.js", niveau: "Intermédiaire",
        code: `const bcrypt = require("bcrypt");
const hash = await bcrypt.hash("monMotDePasse", 10);
const ok = await bcrypt.compare("monMotDePasse", hash);`
    },
    {
        titre: "Valider les données reçues",
        contenu: "Ne fais jamais confiance au client : vérifie les types et les longueurs avant d'utiliser une valeur.",
        langage: "Node.js", niveau: "Intermédiaire",
        code: `const email = String(req.body.email || "").trim();
if (!email.includes("@")) {
  return res.status(400).json({ message: "Email invalide" });
}`
    },
    {
        titre: "Recharger le serveur automatiquement",
        contenu: "Nodemon redémarre le serveur à chaque modification : plus besoin de relancer à la main.",
        langage: "Bash", niveau: "Débutant",
        code: `npm install -D nodemon
npx nodemon server.js`
    },
    {
        titre: "Garder le serveur en vie avec PM2",
        contenu: "PM2 relance ton serveur s'il plante et gère plusieurs instances.",
        langage: "Bash", niveau: "Intermédiaire",
        code: `npm install -g pm2
pm2 start server.js --name virttech
pm2 logs virttech`
    },
    {
        titre: "Lire le fichier .env au démarrage",
        contenu: "Appelle dotenv.config() tout en haut du fichier, avant d'utiliser process.env.",
        langage: "Node.js", niveau: "Débutant",
        code: `require("dotenv").config();
const PORT = process.env.PORT || 3000;`
    },
    {
        titre: "Un timeout sur les appels externes",
        contenu: "Une API qui ne répond pas peut bloquer ton serveur : utilise AbortSignal.timeout().",
        langage: "Node.js", niveau: "Avancé",
        code: `fetch(url, { signal: AbortSignal.timeout(10000) });`
    },
    {
        titre: "Arrêter proprement le serveur",
        contenu: "Sur SIGINT (Ctrl+C), ferme les connexions et la base avant de quitter : pas de données corrompues.",
        langage: "Node.js", niveau: "Avancé",
        code: `process.on("SIGINT", () => {
  console.log("Arrêt propre");
  process.exit(0);
});`
    },

    // ===================== SÉCURITÉ (10) =====================
    {
        titre: "npm audit : vérifier les failles",
        contenu: "npm audit liste les dépendances vulnérables, npm audit fix en corrige une partie.",
        langage: "Bash", niveau: "Débutant",
        code: `npm audit
npm audit fix`
    },
    {
        titre: "Ne jamais exposer les stack traces",
        contenu: "En production, renvoie un message générique au client. Les détails restent dans les logs du serveur.",
        langage: "Node.js", niveau: "Intermédiaire",
        code: `res.status(500).json({ message: "Erreur serveur" });
// et console.error(err) côté serveur uniquement`
    },
    {
        titre: "Restreindre CORS au bon domaine",
        contenu: "N'ouvre pas CORS à tout le monde : autorise seulement ton site.",
        langage: "Node.js", niveau: "Intermédiaire",
        code: `app.use(cors({ origin: ["https://virttech.site"] }));`
    },
    {
        titre: "Dire au navigateur de forcer HTTPS",
        contenu: "Le middleware helmet.hsts ajoute l'en-tête Strict-Transport-Security : plus de downgrade vers HTTP.",
        langage: "Node.js", niveau: "Intermédiaire",
        code: `app.use(helmet.hsts({ maxAge: 15552000 }));`
    },
    {
        titre: "Protéger une route avec un jeton",
        contenu: "Vérifie un en-tête Authorization avant d'exécuter une action sensible.",
        langage: "Node.js", niveau: "Intermédiaire",
        code: `function protege(req, res, next) {
  if (req.headers.authorization !== "Bearer " + process.env.TOKEN) {
    return res.status(401).json({ message: "Non autorisé" });
  }
  next();
}`
    },
    {
        titre: "Limiter la taille des requêtes",
        contenu: "express.json({ limit: '10kb' }) évite qu'un client envoie un JSON géant pour saturer le serveur.",
        langage: "Node.js", niveau: "Intermédiaire",
        code: `app.use(express.json({ limit: "10kb" }));`
    },
    {
        titre: "Éviter les requêtes SQL injectées",
        contenu: "Toujours utiliser des requêtes paramétrées (pool.query avec $1), jamais concaténer une saisie utilisateur.",
        langage: "Node.js", niveau: "Intermédiaire",
        code: `pool.query("SELECT * FROM users WHERE email = $1", [email]);`
    },
    {
        titre: "Masquer les fichiers sensibles",
        contenu: "Ne sers jamais .env, .git ou les fichiers de config. express.static ne sert que le dossier public.",
        langage: "Node.js", niveau: "Intermédiaire",
        code: `app.use(express.static("public"));`
    },
    {
        titre: "Rate limit ciblé sur le login",
        contenu: "Une limite plus stricte sur la connexion bloque les tentatives de force brute.",
        langage: "Node.js", niveau: "Avancé",
        code: `const loginLimite = rateLimit({ windowMs: 15 * 60 * 1000, max: 5 });
app.post("/api/login", loginLimite, connexion);`
    },
    {
        titre: "Mettre à jour ses dépendances",
        contenu: "Une dépendance ancienne est une faille potentielle. npm outdated montre celles à mettre à jour.",
        langage: "Bash", niveau: "Intermédiaire",
        code: `npm outdated
npm update`
    }
];

module.exports = { ASTUCES_2 };
