// --- astucesSeed.js ---
// 100 astuces HTML pour débutants, signées VirtTech.
// Progression : structure -> texte -> liens -> images -> listes -> tableaux -> formulaires -> mise en page -> média -> bonnes pratiques.

const { pool } = require('../database');

const AUTEUR = 'VirtTech';

const ASTUCES = [
    // ---------- 1 à 10 : les bases ----------
    {
        titre: "Le HTML, c'est quoi ?",
        contenu: "Le HTML est le langage qui décrit le contenu d'une page web : les titres, les textes, les images, les liens. Il ne décide pas des couleurs (c'est le CSS), il dit seulement « ceci est un titre », « ceci est une image ».",
        langage: "HTML", niveau: "Débutant", code: null
    },
    {
        titre: "Une balise, comment ça marche ?",
        contenu: "Une balise s'écrit entre chevrons : <p> pour ouvrir et </p> pour fermer. Tout ce qui est entre les deux est le contenu de la balise.",
        langage: "HTML", niveau: "Débutant",
        code: `<p>Ceci est un paragraphe.</p>`
    },
    {
        titre: "La structure de base d'une page",
        contenu: "Toute page HTML a le même squelette : html, head et body. Recopie ce modèle au début de chaque projet.",
        langage: "HTML", niveau: "Débutant",
        code: `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Ma page</title>
</head>
<body>
  <h1>Bonjour</h1>
</body>
</html>`
    },
    {
        titre: "La ligne DOCTYPE",
        contenu: "La première ligne <!DOCTYPE html> dit au navigateur : « ceci est du HTML moderne ». Elle n'a pas de balise fermante.",
        langage: "HTML", niveau: "Débutant",
        code: `<!DOCTYPE html>`
    },
    {
        titre: "La balise html et l'attribut lang",
        contenu: "La balise html entoure toute la page. lang='fr' indique que la page est en français : utile pour les lecteurs d'écran et les moteurs de recherche.",
        langage: "HTML", niveau: "Débutant",
        code: `<html lang="fr">
  ...
</html>`
    },
    {
        titre: "head et body : deux mondes",
        contenu: "head contient les informations invisibles (titre, encodage, liens vers le CSS). body contient tout ce que le visiteur voit.",
        langage: "HTML", niveau: "Débutant",
        code: `<head>
  <title>Ma page</title>
</head>
<body>
  <p>Visible</p>
</body>`
    },
    {
        titre: "Le titre de l'onglet",
        contenu: "La balise title affiche le texte dans l'onglet du navigateur. C'est aussi ce que voit Google.",
        langage: "HTML", niveau: "Débutant",
        code: `<title>Accueil - Mon site</title>`
    },
    {
        titre: "Écrire un commentaire",
        contenu: "Un commentaire n'est pas affiché dans la page. Il sert à laisser une note pour toi ou pour les autres.",
        langage: "HTML", niveau: "Débutant",
        code: `<!-- Ceci est un commentaire -->`
    },
    {
        titre: "Les titres de h1 à h6",
        contenu: "h1 est le titre le plus important, h6 le moins important. Il ne faut qu'un seul h1 par page.",
        langage: "HTML", niveau: "Débutant",
        code: `<h1>Titre principal</h1>
<h2>Section</h2>
<h3>Sous-section</h3>`
    },
    {
        titre: "L'indentation du code",
        contenu: "Décale de deux espaces les balises à l'intérieur des autres. Le code est plus lisible et plus facile à corriger.",
        langage: "HTML", niveau: "Débutant",
        code: `<body>
  <h1>Titre</h1>
  <p>Texte</p>
</body>`
    },

    // ---------- 11 à 25 : le texte ----------
    {
        titre: "Un paragraphe",
        contenu: "Chaque texte se met dans une balise p. Le navigateur ajoute automatiquement un espace après chaque paragraphe.",
        langage: "HTML", niveau: "Débutant",
        code: `<p>Mon premier paragraphe.</p>
<p>Mon second paragraphe.</p>`
    },
    {
        titre: "Aller à la ligne avec br",
        contenu: "br force un saut de ligne à l'intérieur d'un paragraphe. Elle n'a pas de balise fermante.",
        langage: "HTML", niveau: "Débutant",
        code: `<p>Première ligne<br>Deuxième ligne</p>`
    },
    {
        titre: "Une ligne de séparation avec hr",
        contenu: "hr trace une ligne horizontale pour séparer deux parties du contenu.",
        langage: "HTML", niveau: "Débutant",
        code: `<p>Avant</p>
<hr>
<p>Après</p>`
    },
    {
        titre: "Mettre un mot en gras",
        contenu: "strong met en gras et indique que le mot est important. b met aussi en gras, mais sans y donner de sens.",
        langage: "HTML", niveau: "Débutant",
        code: `<p>Ceci est <strong>très important</strong>.</p>`
    },
    {
        titre: "Mettre un mot en italique",
        contenu: "em met en italique et insiste sur le mot. i met en italique sans insister.",
        langage: "HTML", niveau: "Débutant",
        code: `<p>Un mot <em>accentué</em>.</p>`
    },
    {
        titre: "Souligner et barrer",
        contenu: "u souligne, s barre le texte. Utilise-les avec parcimonie : trop de styles tuent le style.",
        langage: "HTML", niveau: "Débutant",
        code: `<p><u>Souligné</u> et <s>barré</s></p>`
    },
    {
        titre: "Surligner un mot",
        contenu: "mark surligne le texte en jaune, comme un surligneur.",
        langage: "HTML", niveau: "Débutant",
        code: `<p>Ce mot est <mark>surligné</mark>.</p>`
    },
    {
        titre: "Un petit texte",
        contenu: "small affiche un texte plus petit, par exemple une mention en bas de page.",
        langage: "HTML", niveau: "Débutant",
        code: `<p><small>© 2026 VirtTech</small></p>`
    },
    {
        titre: "Indice et exposant",
        contenu: "sub place le texte en indice (H₂O), sup en exposant (m²).",
        langage: "HTML", niveau: "Débutant",
        code: `<p>H<sub>2</sub>O et m<sup>2</sup></p>`
    },
    {
        titre: "Afficher du code",
        contenu: "code met un mot ou un bout de code avec une police adaptée.",
        langage: "HTML", niveau: "Débutant",
        code: `<p>La balise <code>&lt;p&gt;</code> fait un paragraphe.</p>`
    },
    {
        titre: "Un bloc de code sur plusieurs lignes",
        contenu: "pre garde les espaces et les retours à la ligne. Idéal pour un exemple de code complet.",
        langage: "HTML", niveau: "Débutant",
        code: `<pre>
function bonjour() {
  console.log("Bonjour");
}
</pre>`
    },
    {
        titre: "Citer un long texte",
        contenu: "blockquote sert à citer un long passage. cite indique la source dans un attribut.",
        langage: "HTML", niveau: "Débutant",
        code: `<blockquote cite="https://exemple.com">
  Le code, c'est de la patience.
</blockquote>`
    },
    {
        titre: "Citer une phrase courte",
        contenu: "q entoure une citation courte. Le navigateur ajoute les guillemets tout seul.",
        langage: "HTML", niveau: "Débutant",
        code: `<p>Il a dit <q>Bienvenue</q>.</p>`
    },
    {
        titre: "Expliquer une abréviation",
        contenu: "abbr avec title affiche l'explication au survol de la souris.",
        langage: "HTML", niveau: "Débutant",
        code: `<abbr title="HyperText Markup Language">HTML</abbr>`
    },
    {
        titre: "Titre d'une œuvre avec cite",
        contenu: "cite entoure le titre d'un livre, d'un film ou d'un site. Il est mis en italique par le navigateur.",
        langage: "HTML", niveau: "Débutant",
        code: `<p>J'ai lu <cite>Le Petit Prince</cite>.</p>`
    },

    // ---------- 26 à 40 : les liens et les images ----------
    {
        titre: "Créer un lien",
        contenu: "La balise a crée un lien. href contient l'adresse de destination.",
        langage: "HTML", niveau: "Débutant",
        code: `<a href="https://virttech.site">Visiter VirtTech</a>`
    },
    {
        titre: "Ouvrir un lien dans un nouvel onglet",
        contenu: "target='_blank' ouvre le lien dans un nouvel onglet. Ajoute rel='noopener' pour la sécurité.",
        langage: "HTML", niveau: "Débutant",
        code: `<a href="https://virttech.site" target="_blank" rel="noopener">Nouvel onglet</a>`
    },
    {
        titre: "Un lien vers une autre page du site",
        contenu: "href contient le chemin du fichier. Si la page est dans le même dossier, il suffit du nom.",
        langage: "HTML", niveau: "Débutant",
        code: `<a href="contact.html">Nous contacter</a>`
    },
    {
        titre: "Un lien vers une section de la page",
        contenu: "href='#nom' fait défiler la page jusqu'à l'élément qui porte id='nom'.",
        langage: "HTML", niveau: "Débutant",
        code: `<a href="#contact">Aller au contact</a>
...
<h2 id="contact">Contact</h2>`
    },
    {
        titre: "Un lien pour envoyer un email",
        contenu: "mailto: ouvre la messagerie du visiteur avec ton adresse déjà remplie.",
        langage: "HTML", niveau: "Débutant",
        code: `<a href="mailto:ipoteivan23@gmail.com">Écris-nous</a>`
    },
    {
        titre: "Un lien pour téléphoner",
        contenu: "tel: ouvre l'application téléphone sur mobile. Très pratique sur un site consulté depuis un téléphone.",
        langage: "HTML", niveau: "Débutant",
        code: `<a href="tel:+2250503588336">+225 05 03 58 83 36</a>`
    },
    {
        titre: "Télécharger un fichier",
        contenu: "L'attribut download indique que le lien doit télécharger le fichier au lieu de l'ouvrir.",
        langage: "HTML", niveau: "Débutant",
        code: `<a href="cv.pdf" download>Télécharger mon CV</a>`
    },
    {
        titre: "Afficher une image",
        contenu: "img affiche une image. src contient le chemin, alt une description. Elle n'a pas de balise fermante.",
        langage: "HTML", niveau: "Débutant",
        code: `<img src="logo.png" alt="Logo VirtTech">`
    },
    {
        titre: "Pourquoi l'attribut alt est obligatoire",
        contenu: "alt décrit l'image quand elle ne charge pas, et les lecteurs d'écran le lisent à voix haute. C'est essentiel.",
        langage: "HTML", niveau: "Débutant",
        code: `<img src="profil.jpg" alt="Photo de profil d'Ivan">`
    },
    {
        titre: "Changer la taille d'une image",
        contenu: "width et height fixent la taille en pixels. Attention : l'image peut être déformée si tu ne gardes pas les proportions.",
        langage: "HTML", niveau: "Débutant",
        code: `<img src="photo.jpg" alt="Photo" width="200" height="150">`
    },
    {
        titre: "Une info-bulle sur une image",
        contenu: "title affiche un petit texte quand la souris s'arrête sur l'image.",
        langage: "HTML", niveau: "Débutant",
        code: `<img src="logo.png" alt="Logo" title="VirtTech by Ipote">`
    },
    {
        titre: "Une image avec sa légende",
        contenu: "figure regroupe l'image et figcaption sa légende. Le tout reste ensemble.",
        langage: "HTML", niveau: "Débutant",
        code: `<figure>
  <img src="projet.png" alt="Aperçu du projet">
  <figcaption>Mon premier projet.</figcaption>
</figure>`
    },
    {
        titre: "Une image pour mobile et une pour PC",
        contenu: "picture choisit l'image selon la largeur de l'écran : plus léger sur téléphone.",
        langage: "HTML", niveau: "Intermédiaire",
        code: `<picture>
  <source media="(max-width: 600px)" srcset="petite.jpg">
  <img src="grande.jpg" alt="Exemple">
</picture>`
    },
    {
        titre: "Les chemins d'images : relatif ou absolu",
        contenu: "images/logo.png est relatif au dossier du fichier HTML. /images/logo.png part de la racine du site. https://... est l'adresse complète.",
        langage: "HTML", niveau: "Débutant", code: null
    },
    {
        titre: "Le dossier images",
        contenu: "Range tes images dans un dossier images à côté de index.html. Ton projet reste propre et les chemins faciles à écrire.",
        langage: "HTML", niveau: "Débutant",
        code: `mon-site/
  index.html
  images/
    logo.png`
    },

    // ---------- 41 à 55 : les listes et les tableaux ----------
    {
        titre: "Une liste à puces",
        contenu: "ul crée la liste, li crée chaque élément. L'ordre n'a pas d'importance.",
        langage: "HTML", niveau: "Débutant",
        code: `<ul>
  <li>HTML</li>
  <li>CSS</li>
  <li>JavaScript</li>
</ul>`
    },
    {
        titre: "Une liste numérotée",
        contenu: "ol numérote automatiquement les éléments. Parfait pour des étapes.",
        langage: "HTML", niveau: "Débutant",
        code: `<ol>
  <li>Ouvrir l'éditeur</li>
  <li>Créer un fichier</li>
  <li>Écrire du code</li>
</ol>`
    },
    {
        titre: "Une liste dans une liste",
        contenu: "On met une nouvelle ul à l'intérieur d'un li pour créer un sous-niveau.",
        langage: "HTML", niveau: "Intermédiaire",
        code: `<ul>
  <li>Front-end
    <ul>
      <li>HTML</li>
      <li>CSS</li>
    </ul>
  </li>
</ul>`
    },
    {
        titre: "Une liste de définitions",
        contenu: "dl regroupe des dt (le terme) et des dd (la définition).",
        langage: "HTML", niveau: "Intermédiaire",
        code: `<dl>
  <dt>HTML</dt>
  <dd>Le langage du contenu.</dd>
</dl>`
    },
    {
        titre: "Créer un tableau",
        contenu: "table crée le tableau, tr une ligne, td une cellule.",
        langage: "HTML", niveau: "Débutant",
        code: `<table>
  <tr>
    <td>Nom</td>
    <td>Note</td>
  </tr>
  <tr>
    <td>Ivan</td>
    <td>18</td>
  </tr>
</table>`
    },
    {
        titre: "Des entêtes de tableau",
        contenu: "th met la cellule en gras et indique que c'est un entête.",
        langage: "HTML", niveau: "Débutant",
        code: `<tr>
  <th>Nom</th>
  <th>Note</th>
</tr>`
    },
    {
        titre: "Organiser un tableau en zones",
        contenu: "thead contient les entêtes, tbody les lignes de données, tfoot le total.",
        langage: "HTML", niveau: "Intermédiaire",
        code: `<table>
  <thead><tr><th>Nom</th></tr></thead>
  <tbody><tr><td>Ivan</td></tr></tbody>
</table>`
    },
    {
        titre: "Un titre pour le tableau",
        contenu: "caption donne un titre au tableau, affiché au-dessus.",
        langage: "HTML", niveau: "Débutant",
        code: `<table>
  <caption>Notes des élèves</caption>
</table>`
    },
    {
        titre: "Fusionner des cellules",
        contenu: "colspan fusionne des colonnes, rowspan des lignes.",
        langage: "HTML", niveau: "Intermédiaire",
        code: `<td colspan="2">Total</td>`
    },
    {
        titre: "Les bordures d'un tableau",
        contenu: "En HTML pur, border='1' affiche une bordure. Aujourd'hui, on préfère le faire en CSS.",
        langage: "HTML", niveau: "Débutant",
        code: `<table border="1">...</table>`
    },
    {
        titre: "Ne pas utiliser un tableau pour la mise en page",
        contenu: "Autrefois on utilisait des tableaux pour positionner les éléments. Aujourd'hui, c'est le rôle du CSS (grid, flex).",
        langage: "HTML", niveau: "Débutant", code: null
    },
    {
        titre: "Un tableau accessible",
        contenu: "Ajoute scope='col' sur les th de colonne et scope='row' sur les th de ligne : les lecteurs d'écran s'y retrouvent.",
        langage: "HTML", niveau: "Intermédiaire",
        code: `<th scope="col">Nom</th>`
    },
    {
        titre: "Un tableau trop large",
        contenu: "Sur mobile, un grand tableau déborde. Le CSS s'en occupe (overflow-x: auto), pas le HTML.",
        langage: "HTML", niveau: "Intermédiaire", code: null
    },
    {
        titre: "Un tableau simple et lisible",
        contenu: "Reste sur peu de colonnes et des textes courts. Si le tableau devient compliqué, change de présentation.",
        langage: "HTML", niveau: "Débutant", code: null
    },
    {
        titre: "Plusieurs tableaux dans une page",
        contenu: "Chaque tableau doit avoir son propre caption ou son titre au-dessus (h2, h3) pour être compréhensible.",
        langage: "HTML", niveau: "Intermédiaire", code: null
    },

    // ---------- 56 à 75 : les formulaires ----------
    {
        titre: "Un formulaire",
        contenu: "form regroupe des champs. action indique où envoyer les données, method comment les envoyer.",
        langage: "HTML", niveau: "Débutant",
        code: `<form action="/envoyer" method="POST">
  ...
</form>`
    },
    {
        titre: "Un champ texte",
        contenu: "input type='text' crée une ligne de saisie. name est le nom utilisé pour envoyer la valeur.",
        langage: "HTML", niveau: "Débutant",
        code: `<input type="text" name="nom" placeholder="Ton nom">`
    },
    {
        titre: "Un champ email",
        contenu: "type='email' vérifie que le visiteur saisit bien une adresse email quand il valide.",
        langage: "HTML", niveau: "Débutant",
        code: `<input type="email" name="email" placeholder="toi@email.com">`
    },
    {
        titre: "Un champ mot de passe",
        contenu: "type='password' cache les caractères pendant la saisie.",
        langage: "HTML", niveau: "Débutant",
        code: `<input type="password" name="mdp">`
    },
    {
        titre: "Un champ nombre",
        contenu: "type='number' n'accepte que des chiffres et affiche des flèches.",
        langage: "HTML", niveau: "Débutant",
        code: `<input type="number" name="age" min="1" max="100">`
    },
    {
        titre: "Un champ date",
        contenu: "type='date' affiche un calendrier natif du navigateur.",
        langage: "HTML", niveau: "Débutant",
        code: `<input type="date" name="naissance">`
    },
    {
        titre: "Une case à cocher",
        contenu: "type='checkbox' permet de choisir plusieurs options. L'utilise avec un label.",
        langage: "HTML", niveau: "Débutant",
        code: `<label>
  <input type="checkbox" name="newsletter"> Recevoir les nouveautés
</label>`
    },
    {
        titre: "Un bouton radio",
        contenu: "type='radio' permet de choisir une seule option. Tous les champs doivent avoir le même name.",
        langage: "HTML", niveau: "Débutant",
        code: `<input type="radio" name="genre" value="h"> Homme
<input type="radio" name="genre" value="f"> Femme`
    },
    {
        titre: "Envoyer un fichier",
        contenu: "type='file' ouvre le sélecteur de fichiers. Le formulaire doit avoir enctype='multipart/form-data'.",
        langage: "HTML", niveau: "Intermédiaire",
        code: `<form action="/upload" method="POST" enctype="multipart/form-data">
  <input type="file" name="photo">
</form>`
    },
    {
        titre: "Une valeur cachée",
        contenu: "type='hidden' stocke une valeur non visible, par exemple un identifiant.",
        langage: "HTML", niveau: "Intermédiaire",
        code: `<input type="hidden" name="id" value="42">`
    },
    {
        titre: "Une liste déroulante",
        contenu: "select crée le menu, option chaque choix. value est la valeur envoyée.",
        langage: "HTML", niveau: "Débutant",
        code: `<select name="langage">
  <option value="html">HTML</option>
  <option value="css">CSS</option>
</select>`
    },
    {
        titre: "Un champ de texte long",
        contenu: "textarea permet d'écrire plusieurs lignes. rows contrôle la hauteur visible.",
        langage: "HTML", niveau: "Débutant",
        code: `<textarea name="message" rows="5"></textarea>`
    },
    {
        titre: "Un label relié au champ",
        contenu: "Le for du label doit être égal à l'id du champ. Cliquer sur le label active le champ.",
        langage: "HTML", niveau: "Débutant",
        code: `<label for="nom">Nom</label>
<input id="nom" name="nom" type="text">`
    },
    {
        titre: "Un bouton d'envoi",
        contenu: "button type='submit' envoie le formulaire. Sans formulaire, il ne fait rien.",
        langage: "HTML", niveau: "Débutant",
        code: `<button type="submit">Envoyer</button>`
    },
    {
        titre: "Grouper les champs",
        contenu: "fieldset entoure un groupe de champs, legend en donne le titre.",
        langage: "HTML", niveau: "Intermédiaire",
        code: `<fieldset>
  <legend>Adresse</legend>
  <input name="ville" placeholder="Ville">
</fieldset>`
    },
    {
        titre: "Un texte indicatif",
        contenu: "placeholder affiche une aide grisée dans le champ. Elle disparaît à la saisie.",
        langage: "HTML", niveau: "Débutant",
        code: `<input type="text" placeholder="Ton prénom">`
    },
    {
        titre: "Rendre un champ obligatoire",
        contenu: "L'attribut required empêche l'envoi si le champ est vide.",
        langage: "HTML", niveau: "Débutant",
        code: `<input type="email" name="email" required>`
    },
    {
        titre: "Désactiver un champ",
        contenu: "disabled grise le champ et l'empêche d'être modifié ou envoyé. readonly le rend non modifiable mais envoyé.",
        langage: "HTML", niveau: "Intermédiaire",
        code: `<input type="text" value="Fixe" readonly>`
    },
    {
        titre: "Limiter la longueur d'un champ",
        contenu: "maxlength limite le nombre de caractères saisis.",
        langage: "HTML", niveau: "Débutant",
        code: `<input type="text" maxlength="20">`
    },
    {
        titre: "Le bon type de champ",
        contenu: "Sur mobile, le clavier s'adapte au type : email affiche @, tel affiche les chiffres, number le pavé numérique.",
        langage: "HTML", niveau: "Débutant", code: null
    },

    // ---------- 76 à 90 : la mise en page sémantique ----------
    {
        titre: "div : une boîte générique",
        contenu: "div regroupe des éléments sans leur donner de sens. Utile pour organiser, mais préfère les balises sémantiques.",
        langage: "HTML", niveau: "Débutant",
        code: `<div class="carte">
  <h2>Titre</h2>
  <p>Texte</p>
</div>`
    },
    {
        titre: "span : une portion de texte",
        contenu: "span entoure un mot dans un paragraphe pour le styler, sans créer de bloc.",
        langage: "HTML", niveau: "Débutant",
        code: `<p>Le mot <span class="or">VirtTech</span> est en doré.</p>`
    },
    {
        titre: "class : un style réutilisable",
        contenu: "class peut être utilisée plusieurs fois sur la page. C'est elle qui sert au CSS.",
        langage: "HTML", niveau: "Débutant",
        code: `<p class="important">Ceci est important.</p>`
    },
    {
        titre: "id : un identifiant unique",
        contenu: "id ne doit apparaître qu'une fois par page. Elle sert à cibler un élément précis (lien, JavaScript).",
        langage: "HTML", niveau: "Débutant",
        code: `<h1 id="titre-principal">Bienvenue</h1>`
    },
    {
        titre: "L'en-tête de page",
        contenu: "header contient le haut de la page : logo, titre, navigation.",
        langage: "HTML", niveau: "Débutant",
        code: `<header>
  <h1>VirtTech</h1>
  <nav>...</nav>
</header>`
    },
    {
        titre: "La navigation",
        contenu: "nav regroupe les liens de navigation. Plus lisible pour les lecteurs d'écran qu'un simple div.",
        langage: "HTML", niveau: "Débutant",
        code: `<nav>
  <a href="/">Accueil</a>
  <a href="/contact">Contact</a>
</nav>`
    },
    {
        titre: "Le contenu principal",
        contenu: "main contient le contenu principal de la page. Il ne doit y en avoir qu'un seul.",
        langage: "HTML", niveau: "Débutant",
        code: `<main>
  <h2>Mes projets</h2>
</main>`
    },
    {
        titre: "Une section",
        contenu: "section regroupe un contenu lié, avec souvent un titre. Elle structure la page.",
        langage: "HTML", niveau: "Débutant",
        code: `<section>
  <h2>À propos</h2>
  <p>...</p>
</section>`
    },
    {
        titre: "Un article",
        contenu: "article représente un contenu autonome (un article de blog, une actu).",
        langage: "HTML", niveau: "Débutant",
        code: `<article>
  <h2>Nouvelle formation</h2>
  <p>...</p>
</article>`
    },
    {
        titre: "Un contenu à côté",
        contenu: "aside contient un contenu secondaire : pub, liens annexes, informations complémentaires.",
        langage: "HTML", niveau: "Intermédiaire",
        code: `<aside>
  <h3>À lire aussi</h3>
</aside>`
    },
    {
        titre: "Le pied de page",
        contenu: "footer contient le bas de la page : copyright, contacts, liens légaux.",
        langage: "HTML", niveau: "Débutant",
        code: `<footer>
  <p>© 2026 VirtTech</p>
</footer>`
    },
    {
        titre: "Un bloc rétractable",
        contenu: "details et summary créent un accordéon natif, sans JavaScript.",
        langage: "HTML", niveau: "Intermédiaire",
        code: `<details>
  <summary>Voir plus</summary>
  <p>Contenu caché.</p>
</details>`
    },
    {
        titre: "Une vidéo",
        contenu: "video affiche une vidéo. controls affiche les boutons lecture/pause.",
        langage: "HTML", niveau: "Débutant",
        code: `<video controls width="400" src="video.mp4"></video>`
    },
    {
        titre: "Un son",
        contenu: "audio affiche un lecteur audio avec les contrôles.",
        langage: "HTML", niveau: "Débutant",
        code: `<audio controls src="son.mp3"></audio>`
    },
    {
        titre: "Intégrer une autre page",
        contenu: "iframe affiche une page externe dans ta page (carte Google Maps, vidéo YouTube).",
        langage: "HTML", niveau: "Intermédiaire",
        code: `<iframe src="https://exemple.com" title="Page externe"></iframe>`
    },

    // ---------- 91 à 100 : l'essentiel à connaître ----------
    {
        titre: "L'encodage des caractères",
        contenu: "charset='UTF-8' affiche correctement les accents (é, à, ç). Sans elle, les accents deviennent des symboles bizarres.",
        langage: "HTML", niveau: "Débutant",
        code: `<meta charset="UTF-8">`
    },
    {
        titre: "L'affichage sur mobile",
        contenu: "Cette balise dit au téléphone d'afficher la page à la bonne taille. Indispensable pour le responsive.",
        langage: "HTML", niveau: "Débutant",
        code: `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
    },
    {
        titre: "La description pour Google",
        contenu: "meta description résume la page dans les résultats de recherche. Une phrase claire de 150 caractères.",
        langage: "HTML", niveau: "Débutant",
        code: `<meta name="description" content="Apprendre le développement web gratuitement avec VirtTech.">`
    },
    {
        titre: "Lier une feuille de style",
        contenu: "Le CSS se lie dans le head avec link. Le fichier doit exister dans le dossier indiqué.",
        langage: "HTML", niveau: "Débutant",
        code: `<link rel="stylesheet" href="css/style.css">`
    },
    {
        titre: "Ajouter une icône d'onglet",
        contenu: "Le favicon est la petite icône de l'onglet.",
        langage: "HTML", niveau: "Débutant",
        code: `<link rel="icon" href="favicon.png" type="image/png">`
    },
    {
        titre: "Où placer le JavaScript",
        contenu: "Place le script juste avant la fermeture de body pour que le HTML soit prêt.",
        langage: "HTML", niveau: "Débutant",
        code: `<script src="js/script.js"></script>`
    },
    {
        titre: "Les caractères spéciaux",
        contenu: "Pour afficher <, > ou &, utilise les entités HTML : &lt;, &gt;, &amp;.",
        langage: "HTML", niveau: "Débutant",
        code: `<p>&lt;balise&gt; et &amp;</p>`
    },
    {
        titre: "L'attribut title",
        contenu: "title affiche une petite bulle d'aide au survol. Fonctionne sur presque toutes les balises.",
        langage: "HTML", niveau: "Débutant",
        code: `<a href="/" title="Retour à l'accueil">Accueil</a>`
    },
    {
        titre: "Écrire du HTML valide",
        contenu: "Ferme toujours tes balises, mets les attributs entre guillemets, et imbrique correctement. Le navigateur pardonne, mais pas les autres outils.",
        langage: "HTML", niveau: "Débutant", code: null
    },
    {
        titre: "Une page complète pour t'entraîner",
        contenu: "Recopie cette page dans VirtEmulator, modifie le titre, le texte et l'image. C'est le meilleur exercice pour démarrer.",
        langage: "HTML", niveau: "Débutant",
        code: `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mon premier site</title>
</head>
<body>
  <header>
    <h1>Bienvenue sur mon site</h1>
  </header>
  <main>
    <section>
      <h2>À propos</h2>
      <p>Je suis <strong>débutant</strong> et j'apprends le HTML.</p>
    </section>
    <section>
      <h2>Mes liens</h2>
      <ul>
        <li><a href="https://virttech.site">VirtTech</a></li>
        <li><a href="contact.html">Contact</a></li>
      </ul>
    </section>
  </main>
  <footer>
    <p><small>© 2026 Mon site</small></p>
  </footer>
</body>
</html>`
    }
];

// Répare les accents abîmés lors d'un copier-coller (Ã© -> é)
function textePropre(valeur) {
    let v = String(valeur || '');

    if (/Ã|Â/.test(v)) {
        try { v = Buffer.from(v, 'latin1').toString('utf8'); } catch (e) { /* inchangé */ }
    }

    return v.normalize('NFC');
}

async function semer() {
    const deja = await pool.query('SELECT titre FROM astuces WHERE auteur = $1', [AUTEUR]);
    const titres = new Set(deja.rows.map(function (r) { return r.titre; }));

    let ajoutees = 0;

    for (let i = 0; i < ASTUCES.length; i++) {
        const a = ASTUCES[i];
        const titre = textePropre(a.titre);
        if (titres.has(titre)) continue;

        const token = 'seed-virttech-' + Date.now() + '-' + i + '-' + Math.random().toString(36).slice(2, 10);

        await pool.query(
            `INSERT INTO astuces (auteur, titre, contenu, langage, niveau, code, owner_token)
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [AUTEUR, titre, textePropre(a.contenu), textePropre(a.langage), textePropre(a.niveau), a.code ? textePropre(a.code) : null, token]
        );

        titres.add(titre);
        ajoutees++;
    }

    if (ajoutees > 0) {
        console.log(`[astuces] ${ajoutees} astuce(s) VirtTech ajoutée(s).`);
    }
}

module.exports = { semer, ASTUCES };
