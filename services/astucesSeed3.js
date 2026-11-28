// --- astucesSeed3.js ---
// Astuces CSS liées au HTML : chaque élément, sa manière normale de le styler.
// + mises en page HTML (nav, sidebars, slides, modales) avec leur CSS.

const ASTUCES_3 = [
    // ===================== CSS DE BASE (15) =====================
    {
        titre: "Relier le CSS au HTML",
        contenu: "Le CSS se met dans un fichier .css relié dans le head. Sans ce lien, le navigateur ne connaît pas ton style.",
        langage: "CSS", niveau: "Débutant",
        code: `<!-- HTML : dans le <head> -->
<link rel="stylesheet" href="css/style.css">

/* CSS : dans style.css */
body {
  background: #f4f6f7;
  color: #161F27;
}`
    },
    {
        titre: "Cibler une balise HTML",
        contenu: "On écrit le nom de la balise, puis les styles entre accolades. Tous les paragraphes de la page sont touchés.",
        langage: "CSS", niveau: "Débutant",
        code: `p {
  color: #3F4C55;
  font-size: 16px;
}`
    },
    {
        titre: "Cibler une classe",
        contenu: "La classe commence par un point. Elle s'applique à tous les éléments qui portent class='...'.",
        langage: "CSS", niveau: "Débutant",
        code: `<p class="important">Texte</p>

.important {
  color: #c0392b;
  font-weight: bold;
}`
    },
    {
        titre: "Cibler un id",
        contenu: "L'id commence par un dièse. Il ne doit être utilisé qu'une seule fois par page.",
        langage: "CSS", niveau: "Débutant",
        code: `<h1 id="titre">Bienvenue</h1>

#titre {
  color: #D4AF37;
}`
    },
    {
        titre: "Changer la couleur du texte",
        contenu: "color change la couleur du texte. On peut écrire un nom (red), un code hexadécimal (#c0392b) ou rgb().",
        langage: "CSS", niveau: "Débutant",
        code: `h1 { color: #D4AF37; }`
    },
    {
        titre: "Changer la couleur de fond",
        contenu: "background (ou background-color) change le fond de l'élément.",
        langage: "CSS", niveau: "Débutant",
        code: `body { background: #f4f6f7; }`
    },
    {
        titre: "Changer la police",
        contenu: "font-family choisit la police. Mets une police du système pour rester rapide.",
        langage: "CSS", niveau: "Débutant",
        code: `body {
  font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
}`
    },
    {
        titre: "Changer la taille du texte",
        contenu: "font-size accepte des px ou des rem. 1rem = la taille de base du navigateur (16px en général).",
        langage: "CSS", niveau: "Débutant",
        code: `p { font-size: 1rem; }
h1 { font-size: 2rem; }`
    },
    {
        titre: "Mettre en gras et en italique",
        contenu: "font-weight: 700 met en gras, font-style: italic met en italique.",
        langage: "CSS", niveau: "Débutant",
        code: `.gras { font-weight: 700; }
.italique { font-style: italic; }`
    },
    {
        titre: "Aligner le texte",
        contenu: "text-align accepte left, center, right ou justify.",
        langage: "CSS", niveau: "Débutant",
        code: `h1 { text-align: center; }`
    },
    {
        titre: "Les marges extérieures",
        contenu: "margin crée de l'espace autour de l'élément. margin: 20px 0 met 20px en haut/bas et 0 sur les côtés.",
        langage: "CSS", niveau: "Débutant",
        code: `p { margin: 16px 0; }`
    },
    {
        titre: "Les marges intérieures",
        contenu: "padding crée de l'espace à l'intérieur de l'élément, entre son bord et son contenu.",
        langage: "CSS", niveau: "Débutant",
        code: `.carte { padding: 20px; }`
    },
    {
        titre: "Ajouter une bordure",
        contenu: "border prend l'épaisseur, le style et la couleur. border: 1px solid #ddd est le plus courant.",
        langage: "CSS", niveau: "Débutant",
        code: `.boite {
  border: 1px solid #dde4e8;
  border-radius: 12px;
}`
    },
    {
        titre: "Arrondir les coins",
        contenu: "border-radius arrondit les coins. Mets un grand nombre pour un cercle (50%).",
        langage: "CSS", niveau: "Débutant",
        code: `.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
}`
    },
    {
        titre: "Ajouter une ombre",
        contenu: "box-shadow crée un relief. Plus le flou est grand, plus l'ombre est douce.",
        langage: "CSS", niveau: "Débutant",
        code: `.carte {
  box-shadow: 0 8px 24px rgba(16, 24, 32, .10);
}`
    },

    // ===================== CSS PAR ÉLÉMENT (25) =====================
    {
        titre: "Styler les titres h1 et h2",
        contenu: "Un titre bien stylé a une taille plus grande et un poids fort. Ajoute un peu d'espace en bas.",
        langage: "CSS", niveau: "Débutant",
        code: `h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 12px;
}
h2 {
  font-size: 1.4rem;
  margin: 28px 0 10px;
}`
    },
    {
        titre: "Styler un paragraphe",
        contenu: "Un paragraphe lisible a une taille correcte, un interlignage généreux et un espace entre les paragraphes.",
        langage: "CSS", niveau: "Débutant",
        code: `p {
  font-size: 1rem;
  line-height: 1.6;
  margin: 0 0 14px;
  color: #3F4C55;
}`
    },
    {
        titre: "Styler les liens",
        contenu: "Un lien par défaut est bleu et souligné. Enlève le soulignement et donne-lui la couleur du site.",
        langage: "CSS", niveau: "Débutant",
        code: `a {
  color: #161F27;
  text-decoration: none;
  border-bottom: 2px solid #D4AF37;
}`
    },
    {
        titre: "Styler un lien au survol",
        contenu: ":hover s'applique quand la souris passe sur l'élément. Change la couleur pour montrer que c'est cliquable.",
        langage: "CSS", niveau: "Débutant",
        code: `a:hover {
  color: #D4AF37;
}`
    },
    {
        titre: "Styler une liste",
        contenu: "list-style contrôle les puces. padding-left décale les éléments pour que les puces restent visibles.",
        langage: "CSS", niveau: "Débutant",
        code: `ul {
  list-style: disc;
  padding-left: 22px;
}
li {
  margin-bottom: 6px;
}`
    },
    {
        titre: "Styler un bouton",
        contenu: "Un bouton propre : fond foncé, texte blanc, coins arrondis, curseur main, et un effet au survol.",
        langage: "CSS", niveau: "Débutant",
        code: `.btn {
  padding: 10px 18px;
  background: #161F27;
  color: #fff;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background .2s;
}
.btn:hover { background: #D4AF37; color: #161F27; }`
    },
    {
        titre: "Styler un champ input",
        contenu: "Un champ lisible a une bordure fine, un padding généreux, des coins arrondis et un focus visible.",
        langage: "CSS", niveau: "Débutant",
        code: `input {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #dde4e8;
  border-radius: 10px;
  font-size: 1rem;
}
input:focus {
  outline: none;
  border-color: #D4AF37;
  box-shadow: 0 0 0 3px rgba(212, 175, 55, .15);
}`
    },
    {
        titre: "Styler un textarea",
        contenu: "textarea a besoin d'une hauteur minimale et de resize: vertical pour ne pas être étiré dans tous les sens.",
        langage: "CSS", niveau: "Débutant",
        code: `textarea {
  width: 100%;
  min-height: 120px;
  padding: 12px 14px;
  border: 1px solid #dde4e8;
  border-radius: 10px;
  resize: vertical;
}`
    },
    {
        titre: "Styler un select",
        contenu: "Le select natif est difficile à styler partout. Une bordure, un padding et une hauteur suffisent pour rester propre.",
        langage: "CSS", niveau: "Débutant",
        code: `select {
  width: 100%;
  padding: 12px;
  border: 1px solid #dde4e8;
  border-radius: 10px;
  background: #fff;
}`
    },
    {
        titre: "Styler un label",
        contenu: "Un label doit être au-dessus de son champ, en petit et en gras.",
        langage: "CSS", niveau: "Débutant",
        code: `label {
  display: block;
  font-size: .8rem;
  font-weight: 700;
  margin-bottom: 6px;
  color: #3F4C55;
}`
    },
    {
        titre: "Espacer les champs d'un formulaire",
        contenu: "Un formulaire respire quand ses champs ont de l'espace entre eux. Utilise .champ { margin-bottom }.",
        langage: "CSS", niveau: "Débutant",
        code: `.formulaire .champ { margin-bottom: 16px; }`
    },
    {
        titre: "Styler un tableau",
        contenu: "border-collapse fusionne les bordures, width: 100% prend toute la largeur.",
        langage: "CSS", niveau: "Débutant",
        code: `table {
  width: 100%;
  border-collapse: collapse;
  font-size: .9rem;
}`
    },
    {
        titre: "Styler les cellules th et td",
        contenu: "Un peu de padding et une bordure basse discrète suffisent pour un tableau lisible.",
        langage: "CSS", niveau: "Débutant",
        code: `th, td {
  padding: 10px 12px;
  border-bottom: 1px solid #eef2f4;
  text-align: left;
}
th {
  background: #f7f9fa;
  font-weight: 700;
}`
    },
    {
        titre: "Styler une image",
        contenu: "Une image responsive prend la largeur de son parent sans dépasser, et garde ses proportions.",
        langage: "CSS", niveau: "Débutant",
        code: `img {
  max-width: 100%;
  height: auto;
  display: block;
}`
    },
    {
        titre: "Styler figure et figcaption",
        contenu: "figure regroupe l'image et sa légende ; figcaption est plus petit et discret.",
        langage: "CSS", niveau: "Débutant",
        code: `figure { margin: 16px 0; }
figcaption {
  font-size: .8rem;
  color: #7b8891;
  margin-top: 6px;
}`
    },
    {
        titre: "Styler un header",
        contenu: "Un header propre : fond blanc, bordure basse fine, contenu aligné sur une ligne.",
        langage: "CSS", niveau: "Débutant",
        code: `header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background: #fff;
  border-bottom: 1px solid #eef2f4;
}`
    },
    {
        titre: "Styler un footer",
        contenu: "Le footer est souvent plus petit, avec un texte discret et une bordure haute.",
        langage: "CSS", niveau: "Débutant",
        code: `footer {
  padding: 24px;
  text-align: center;
  font-size: .85rem;
  color: #7b8891;
  border-top: 1px solid #eef2f4;
}`
    },
    {
        titre: "Styler une section",
        contenu: "Une section a de l'espace vertical pour respirer et une largeur limitée pour rester lisible.",
        langage: "CSS", niveau: "Débutant",
        code: `section {
  max-width: 900px;
  margin: 0 auto;
  padding: 32px 20px;
}`
    },
    {
        titre: "Styler une carte",
        contenu: "Une carte est un bloc blanc avec bordure, arrondis, ombre légère et padding.",
        langage: "CSS", niveau: "Débutant",
        code: `.carte {
  background: #fff;
  border: 1px solid #e2e8ec;
  border-radius: 14px;
  padding: 20px;
  box-shadow: 0 6px 18px rgba(16, 24, 32, .06);
}`
    },
    {
        titre: "Styler un badge",
        contenu: "Un badge est un petit texte dans une pastille arrondie, avec un fond coloré.",
        langage: "CSS", niveau: "Débutant",
        code: `.badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 20px;
  background: #D4AF37;
  color: #161F27;
  font-size: .7rem;
  font-weight: 700;
}`
    },
    {
        titre: "Styler une alerte",
        contenu: "Une alerte a un fond clair, une bordure gauche colorée et un texte plus petit.",
        langage: "CSS", niveau: "Débutant",
        code: `.alerte {
  padding: 12px 14px;
  border-left: 4px solid #c0392b;
  background: #fdf3f2;
  border-radius: 8px;
  font-size: .85rem;
}`
    },
    {
        titre: "Styler details et summary",
        contenu: "summary est cliquable : mets cursor: pointer et un fond léger pour montrer qu'on peut ouvrir.",
        langage: "CSS", niveau: "Débutant",
        code: `details {
  border: 1px solid #e2e8ec;
  border-radius: 10px;
  padding: 12px;
}
summary {
  cursor: pointer;
  font-weight: 700;
}`
    },
    {
        titre: "Styler une citation",
        contenu: "blockquote se distingue avec une bordure gauche et une police en italique.",
        langage: "CSS", niveau: "Débutant",
        code: `blockquote {
  margin: 16px 0;
  padding: 10px 16px;
  border-left: 4px solid #D4AF37;
  font-style: italic;
  color: #3F4C55;
}`
    },
    {
        titre: "Styler du code",
        contenu: "code prend une police monospace et un fond gris clair pour ressortir dans le texte.",
        langage: "CSS", niveau: "Débutant",
        code: `code {
  font-family: Consolas, monospace;
  background: #f1f4f6;
  padding: 2px 6px;
  border-radius: 5px;
  font-size: .9em;
}`
    },
    {
        titre: "Styler progress",
        contenu: "progress se stylise par -webkit-progress-bar (le fond) et -webkit-progress-value (la partie remplie).",
        langage: "CSS", niveau: "Intermédiaire",
        code: `progress {
  width: 100%;
  height: 10px;
  border-radius: 10px;
}
progress::-webkit-progress-bar { background: #eef2f4; }
progress::-webkit-progress-value { background: #D4AF37; }`
    },
    {
        titre: "Styler un hr",
        contenu: "hr par défaut est gris et épais. Rend-le fin et discret.",
        langage: "CSS", niveau: "Débutant",
        code: `hr {
  border: none;
  border-top: 1px solid #eef2f4;
  margin: 24px 0;
}`
    },

    // ===================== NAVIGATION (HTML + CSS) (8) =====================
    {
        titre: "Une nav horizontale simple",
        contenu: "HTML : une nav avec des liens. CSS : display: flex aligne les liens sur une ligne.",
        langage: "CSS", niveau: "Débutant",
        code: `<!-- HTML -->
<nav class="nav">
  <a href="/">Accueil</a>
  <a href="/cours">Cours</a>
  <a href="/contact">Contact</a>
</nav>

/* CSS */
.nav {
  display: flex;
  gap: 20px;
  padding: 14px 20px;
  background: #fff;
  border-bottom: 1px solid #eef2f4;
}
.nav a {
  color: #161F27;
  text-decoration: none;
  font-weight: 600;
}
.nav a:hover { color: #D4AF37; }`
    },
    {
        titre: "Une nav avec logo et bouton",
        contenu: "Le logo à gauche, les liens au centre, le bouton à droite : justify-content: space-between et margin-left: auto sur le bouton.",
        langage: "CSS", niveau: "Débutant",
        code: `<!-- HTML -->
<header class="top">
  <a class="logo" href="/">VirtTech</a>
  <nav class="liens">
    <a href="/">Accueil</a>
    <a href="/cours">Cours</a>
  </nav>
  <a class="btn" href="/contact">Contact</a>
</header>

/* CSS */
.top {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 14px 20px;
  background: #fff;
}
.logo { font-weight: 800; color: #161F27; text-decoration: none; }
.liens { display: flex; gap: 18px; }
.liens a { color: #3F4C55; text-decoration: none; }
.btn {
  margin-left: auto;
  padding: 8px 14px;
  border-radius: 8px;
  background: #161F27;
  color: #fff;
  text-decoration: none;
}`
    },
    {
        titre: "Une nav qui reste en haut au scroll",
        contenu: "position: sticky + top: 0 colle la nav en haut quand on fait défiler la page.",
        langage: "CSS", niveau: "Intermédiaire",
        code: `.nav {
  position: sticky;
  top: 0;
  z-index: 20;
  background: #fff;
  border-bottom: 1px solid #eef2f4;
}`
    },
    {
        titre: "Une nav responsive avec menu burger",
        contenu: "HTML : un bouton burger et des liens. CSS : sur mobile les liens passent en colonne et s'ouvrent avec une classe .ouvert.",
        langage: "CSS", niveau: "Intermédiaire",
        code: `<!-- HTML -->
<nav class="nav">
  <button class="burger" id="burger">☰</button>
  <div class="liens" id="liens">
    <a href="/">Accueil</a>
    <a href="/cours">Cours</a>
    <a href="/contact">Contact</a>
  </div>
</nav>

/* CSS */
.nav { display: flex; align-items: center; justify-content: space-between; padding: 14px 20px; }
.burger { display: none; background: none; border: none; font-size: 1.4rem; cursor: pointer; }
.liens { display: flex; gap: 18px; }

@media (max-width: 700px) {
  .burger { display: block; }
  .liens {
    display: none;
    flex-direction: column;
    position: absolute;
    top: 60px; left: 0; right: 0;
    background: #fff;
    padding: 16px 20px;
  }
  .liens.ouvert { display: flex; }
}`
    },
    {
        titre: "Une sidebar à gauche",
        contenu: "HTML : un aside et un contenu principal. CSS : grid avec une colonne fixe et une colonne souple.",
        langage: "CSS", niveau: "Intermédiaire",
        code: `<!-- HTML -->
<div class="layout">
  <aside class="sidebar">...</aside>
  <main class="contenu">...</main>
</div>

/* CSS */
.layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  min-height: 100vh;
}
.sidebar {
  background: #161F27;
  color: #fff;
  padding: 24px 18px;
}
.contenu { padding: 32px; }`
    },
    {
        titre: "Une sidebar à droite",
        contenu: "Même principe, mais la colonne fixe est à droite : grid-template-columns: 1fr 240px.",
        langage: "CSS", niveau: "Intermédiaire",
        code: `.layout {
  display: grid;
  grid-template-columns: 1fr 240px;
}
.sidebar-droite {
  background: #f7f9fa;
  border-left: 1px solid #eef2f4;
  padding: 24px 18px;
}`
    },
    {
        titre: "Une sidebar qui s'ouvre et se ferme",
        contenu: "HTML : un bouton et une sidebar. CSS : la sidebar est décalée hors de l'écran (translateX) ; la classe .ouvert la ramène.",
        langage: "CSS", niveau: "Intermédiaire",
        code: `<!-- HTML -->
<button class="ouvrir" id="ouvrir">☰</button>
<aside class="drawer" id="drawer">Menu</aside>

/* CSS */
.drawer {
  position: fixed;
  top: 0; left: 0; bottom: 0;
  width: 280px;
  background: #161F27;
  color: #fff;
  padding: 24px;
  transform: translateX(-100%);
  transition: transform .3s ease;
  z-index: 50;
}
.drawer.ouvert { transform: translateX(0); }`
    },
    {
        titre: "Une sidebar qui s'ouvre depuis la droite",
        contenu: "Même technique, mais la sidebar part de la droite : right: 0 et translateX(100%).",
        langage: "CSS", niveau: "Intermédiaire",
        code: `.drawer-droite {
  position: fixed;
  top: 0; right: 0; bottom: 0;
  width: 300px;
  background: #fff;
  box-shadow: -10px 0 30px rgba(0, 0, 0, .12);
  transform: translateX(100%);
  transition: transform .3s ease;
}
.drawer-droite.ouvert { transform: translateX(0); }`
    },

    // ===================== SLIDES ET MODALES (HTML + CSS) (8) =====================
    {
        titre: "Un panneau qui monte du bas (bottom sheet)",
        contenu: "HTML : un panneau fixé en bas. CSS : translateY(100%) le cache sous l'écran, .ouvert le remonte.",
        langage: "CSS", niveau: "Intermédiaire",
        code: `<!-- HTML -->
<button class="btn" id="ouvrir">Ouvrir</button>
<div class="sheet" id="sheet">
  <h3>Options</h3>
  <p>Contenu du panneau.</p>
</div>

/* CSS */
.sheet {
  position: fixed;
  left: 0; right: 0; bottom: 0;
  background: #fff;
  border-radius: 20px 20px 0 0;
  padding: 20px;
  transform: translateY(100%);
  transition: transform .3s ease;
  z-index: 50;
}
.sheet.ouvert { transform: translateY(0); }`
    },
    {
        titre: "Un panneau qui descend du haut",
        contenu: "Le slide du haut se cache avec translateY(-100%) et revient à 0 quand il est ouvert.",
        langage: "CSS", niveau: "Intermédiaire",
        code: `.sheet-haut {
  position: fixed;
  left: 0; right: 0; top: 0;
  background: #fff;
  border-radius: 0 0 20px 20px;
  padding: 20px;
  transform: translateY(-100%);
  transition: transform .3s ease;
  z-index: 50;
}
.sheet-haut.ouvert { transform: translateY(0); }`
    },
    {
        titre: "Un voile derrière un panneau",
        contenu: "Le voile assombrit la page et capte le clic pour fermer. Il est fixé sur tout l'écran.",
        langage: "CSS", niveau: "Intermédiaire",
        code: `<div class="voile" id="voile"></div>

.voile {
  position: fixed;
  inset: 0;
  background: rgba(10, 15, 19, .5);
  opacity: 0;
  pointer-events: none;
  transition: opacity .3s;
  z-index: 40;
}
.voile.ouvert {
  opacity: 1;
  pointer-events: auto;
}`
    },
    {
        titre: "Une modale centrée",
        contenu: "La modale est fixée au centre avec display: flex. Le voile derrière la sépare du reste.",
        langage: "CSS", niveau: "Intermédiaire",
        code: `.modale {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(10, 15, 19, .55);
  z-index: 60;
}
.modale-boite {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  max-width: 420px;
  width: calc(100% - 32px);
}`
    },
    {
        titre: "Une galerie en grille",
        contenu: "grid + auto-fit crée une galerie qui s'adapte seule au nombre d'images.",
        langage: "CSS", niveau: "Intermédiaire",
        code: `.galerie {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
}
.galerie img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 10px;
}`
    },
    {
        titre: "Un layout sidebar + contenu",
        contenu: "grid-template-columns: 240px 1fr crée deux colonnes. La première est fixe, la seconde prend le reste.",
        langage: "CSS", niveau: "Intermédiaire",
        code: `.layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  min-height: 100vh;
}

@media (max-width: 800px) {
  .layout { grid-template-columns: 1fr; }
}`
    },
    {
        titre: "Une bannière (hero)",
        contenu: "Un hero centre son contenu verticalement et horizontalement, avec un fond dégradé.",
        langage: "CSS", niveau: "Débutant",
        code: `.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
  padding: 40px 20px;
  background: linear-gradient(135deg, #161F27, #2c3a44);
  color: #fff;
}`
    },
    {
        titre: "Un footer en colonnes",
        contenu: "Un footer en grille de trois colonnes, qui passe en une colonne sur mobile.",
        langage: "CSS", niveau: "Intermédiaire",
        code: `.footer {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  padding: 32px 20px;
  background: #161F27;
  color: #fff;
}
@media (max-width: 700px) {
  .footer { grid-template-columns: 1fr; }
}`
    },

    // ===================== COMPOSANTS CLASSIQUES (HTML + CSS) (8) =====================
    {
        titre: "Des onglets en CSS",
        contenu: "HTML : des boutons et des panneaux. CSS : on cache tous les panneaux, et .actif affiche le bon.",
        langage: "CSS", niveau: "Intermédiaire",
        code: `<!-- HTML -->
<div class="onglets">
  <button class="onglet actif" data-cible="a">Profil</button>
  <button class="onglet" data-cible="b">Cours</button>
</div>
<div class="panneau actif" id="a">Contenu A</div>
<div class="panneau" id="b">Contenu B</div>

/* CSS */
.onglet {
  padding: 8px 14px;
  border: none;
  background: none;
  cursor: pointer;
  border-bottom: 2px solid transparent;
}
.onglet.actif { border-color: #D4AF37; font-weight: 700; }
.panneau { display: none; padding: 16px 0; }
.panneau.actif { display: block; }`
    },
    {
        titre: "Un accordéon en HTML/CSS",
        contenu: "details/summary donne un accordéon natif. Stylise summary et laisse le navigateur gérer l'ouverture.",
        langage: "CSS", niveau: "Débutant",
        code: `details {
  border: 1px solid #e2e8ec;
  border-radius: 10px;
  padding: 12px 14px;
  margin-bottom: 10px;
}
details[open] { border-color: #D4AF37; }
summary {
  cursor: pointer;
  font-weight: 700;
  list-style: none;
}`
    },
    {
        titre: "Une carte cliquable",
        contenu: "Une carte en lien : display: block, texte sans soulignement, et un effet au survol.",
        langage: "CSS", niveau: "Débutant",
        code: `<a class="carte-lien" href="/projet">
  <h3>Mon projet</h3>
  <p>Voir le projet</p>
</a>

.carte-lien {
  display: block;
  padding: 18px;
  border: 1px solid #e2e8ec;
  border-radius: 12px;
  color: inherit;
  text-decoration: none;
  transition: border-color .2s, transform .2s;
}
.carte-lien:hover {
  border-color: #D4AF37;
  transform: translateY(-3px);
}`
    },
    {
        titre: "Une liste de définitions stylée",
        contenu: "dl/dt/dd devient un glossaire propre : terme en gras, définition en dessous.",
        langage: "CSS", niveau: "Débutant",
        code: `dl { margin: 0; }
dt {
  font-weight: 700;
  margin-top: 12px;
}
dd {
  margin: 2px 0 0 0;
  color: #3F4C55;
}`
    },
    {
        titre: "Un fil d'Ariane",
        contenu: "Les liens séparés par un chevron, sur une ligne, en petit.",
        langage: "CSS", niveau: "Intermédiaire",
        code: `<nav class="fil">
  <a href="/">Accueil</a> ›
  <a href="/cours">Cours</a> ›
  <span>HTML</span>
</nav>

.fil { font-size: .8rem; color: #7b8891; }
.fil a { color: #7b8891; text-decoration: none; }`
    },
    {
        titre: "Une barre de recherche",
        contenu: "Un champ et un bouton dans un conteneur flex, avec des coins arrondis.",
        langage: "CSS", niveau: "Débutant",
        code: `<form class="recherche">
  <input type="search" placeholder="Rechercher…">
  <button type="submit">Aller</button>
</form>

.recherche {
  display: flex;
  gap: 8px;
}
.recherche input {
  flex: 1;
  padding: 10px 14px;
  border: 1px solid #dde4e8;
  border-radius: 10px;
}
.recherche button {
  padding: 10px 16px;
  border: none;
  border-radius: 10px;
  background: #161F27;
  color: #fff;
}`
    },
    {
        titre: "Un message de confirmation",
        contenu: "Un bandeau vert, arrondi, avec une icône, qui apparaît en haut de la page.",
        langage: "CSS", niveau: "Débutant",
        code: `.succes {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #eaf5ea;
  border: 1px solid #b7dfb9;
  border-radius: 10px;
  color: #2e7d32;
  font-size: .85rem;
}`
    },
    {
        titre: "Un bouton flottant (action)",
        contenu: "Un bouton rond fixé en bas à droite, au-dessus du contenu.",
        langage: "CSS", niveau: "Intermédiaire",
        code: `.flottant {
  position: fixed;
  right: 20px;
  bottom: 20px;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: #D4AF37;
  color: #161F27;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  box-shadow: 0 10px 24px rgba(0, 0, 0, .2);
  cursor: pointer;
  z-index: 30;
}`
    }
];

module.exports = { ASTUCES_3 };
