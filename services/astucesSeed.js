// --- astucesSeed.js ---
// Astuces de dÃ©marrage signÃ©es VirtTech (insÃ©rÃ©es une seule fois au dÃ©marrage).

const { pool } = require('../database');

const AUTEUR = 'VirtTech';

const ASTUCES = [
    {
        titre: "La structure de base d'une page HTML",
        contenu: "Toute page commence par le mÃªme squelette : le doctype, la balise html, le head (les infos invisibles) et le body (ce que le visiteur voit).",
        langage: "HTML",
        niveau: "DÃ©butant",
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
        titre: "Les titres de h1 Ã  h6",
        contenu: "h1 est le titre principal (un seul par page), h2 pour les sections, h3 pour les sous-sections. Ne saute pas de niveau : c'est la hiÃ©rarchie du contenu.",
        langage: "HTML",
        niveau: "DÃ©butant",
        code: `<h1>Titre principal</h1>
<h2>Une section</h2>
<h3>Une sous-section</h3>`
    },
    {
        titre: "Paragraphes et sauts de ligne",
        contenu: "Un paragraphe se met dans p. Pour aller Ã  la ligne Ã  l'intÃ©rieur d'un mÃªme paragraphe, utilise br ; pour sÃ©parer deux blocs, utilise deux paragraphes.",
        langage: "HTML",
        niveau: "DÃ©butant",
        code: `<p>Un premier paragraphe.</p>
<p>Un second paragraphe.</p>`
    },
    {
        titre: "CrÃ©er un lien propre",
        contenu: "La balise a sert Ã  crÃ©er un lien. href contient la destination, et le texte entre les balises est ce sur quoi on clique.",
        langage: "HTML",
        niveau: "DÃ©butant",
        code: `<a href="https://virttech.site">Visiter VirtTech</a>`
    },
    {
        titre: "Afficher une image correctement",
        contenu: "img n'a pas de balise fermante. L'attribut alt dÃ©crit l'image : il s'affiche si l'image ne charge pas et aide les lecteurs d'Ã©cran.",
        langage: "HTML",
        niveau: "DÃ©butant",
        code: `<img src="images/logo.png" alt="Logo de VirtTech" width="120">`
    },
    {
        titre: "Faire une liste Ã  puces ou numÃ©rotÃ©e",
        contenu: "ul pour une liste Ã  puces, ol pour une liste numÃ©rotÃ©e. Chaque Ã©lÃ©ment se met dans li.",
        langage: "HTML",
        niveau: "DÃ©butant",
        code: `<ul>
  <li>HTML</li>
  <li>CSS</li>
</ul>`
    },
    {
        titre: "Un champ de saisie",
        contenu: "input crÃ©e un champ. Le type change son comportement (text, email, password, number). Ajoute un label pour l'accessibilitÃ©.",
        langage: "HTML",
        niveau: "DÃ©butant",
        code: `<label for="nom">Ton nom</label>
<input type="text" id="nom" placeholder="Ivan">`
    },
    {
        titre: "Bouton ou champ de soumission ?",
        contenu: "button est le choix moderne : il peut contenir une icÃ´ne et un texte. input type=submit reste valable dans un formulaire.",
        langage: "HTML",
        niveau: "DÃ©butant",
        code: `<button type="submit">Envoyer</button>`
    },
    {
        titre: "class ou id : lequel choisir ?",
        contenu: "id est unique (une seule fois par page) ; class peut se rÃ©pÃ©ter. Utilise class pour les styles et id pour cibler un Ã©lÃ©ment prÃ©cis.",
        langage: "HTML",
        niveau: "DÃ©butant",
        code: `<p class="important">Ce paragraphe partage un style.</p>
<h1 id="titre-principal">Ce titre est unique.</h1>`
    },
    {
        titre: "Lier une feuille de style CSS",
        contenu: "Le lien vers le CSS se met dans le head. Le chemin est relatif Ã  la page HTML.",
        langage: "CSS",
        niveau: "DÃ©butant",
        code: `<link rel="stylesheet" href="css/style.css">`
    },
    {
        titre: "Comprendre une couleur hexadÃ©cimale",
        contenu: "#D4AF37 se lit en trois paires : rouge, vert, bleu. 00 = rien, ff = maximum. #000000 est noir, #ffffff est blanc.",
        langage: "CSS",
        niveau: "DÃ©butant",
        code: `h1 { color: #D4AF37; }
body { background: #161F27; }`
    },
    {
        titre: "px, rem ou % : quelle unitÃ© ?",
        contenu: "px est fixe, rem suit la taille de police de base (plus accessible), % s'adapte au parent. Pour le texte, prÃ©fÃ¨re rem.",
        langage: "CSS",
        niveau: "DÃ©butant",
        code: `p { font-size: 1rem; }
.bouton { width: 100%; padding: 12px 20px; }`
    },
    {
        titre: "Le box-model en une phrase",
        contenu: "Chaque Ã©lÃ©ment est une boÃ®te : contenu, padding (intÃ©rieur), border (bordure), margin (extÃ©rieur). box-sizing: border-box simplifie les calculs.",
        langage: "CSS",
        niveau: "DÃ©butant",
        code: `* { box-sizing: border-box; }
.carte { padding: 16px; border: 1px solid #ddd; margin: 20px 0; }`
    },
    {
        titre: "Centrer parfaitement avec Flexbox",
        contenu: "display: flex active Flexbox ; justify-content centre sur l'axe horizontal, align-items sur l'axe vertical.",
        langage: "CSS",
        niveau: "DÃ©butant",
        code: `.centre {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}`
    },
    {
        titre: "Adapter le site au tÃ©lÃ©phone",
        contenu: "Une media query applique des styles seulement sous une certaine largeur. C'est la base du responsive.",
        langage: "CSS",
        niveau: "IntermÃ©diaire",
        code: `@media (max-width: 600px) {
  .menu { flex-direction: column; }
}`
    },
    {
        titre: "Des couleurs rÃ©utilisables avec des variables",
        contenu: "DÃ©clare une variable dans :root et rÃ©utilise-la partout avec var(). Changer la valeur une fois met tout le site Ã  jour.",
        langage: "CSS",
        niveau: "IntermÃ©diaire",
        code: `:root { --or: #D4AF37; }
.bouton { background: var(--or); }`
    },
    {
        titre: "OÃ¹ placer le JavaScript",
        contenu: "Place le script juste avant </body> pour que le HTML soit prÃªt quand le code s'exÃ©cute. Sinon, utilise defer dans le head.",
        langage: "JavaScript",
        niveau: "DÃ©butant",
        code: `<script src="js/script.js"></script>`
    },
    {
        titre: "let, const ou var ?",
        contenu: "const pour une valeur qui ne change pas, let pour une valeur qui change, et Ã©vite var (ancien et piÃ©geux).",
        langage: "JavaScript",
        niveau: "DÃ©butant",
        code: `const nom = "VirtTech";
let compteur = 0;
compteur = compteur + 1;`
    },
    {
        titre: "Les fonctions flÃ©chÃ©es",
        contenu: "Une fonction flÃ©chÃ©e s'Ã©crit avec =>. Elle est courte et garde le contexte this du parent.",
        langage: "JavaScript",
        niveau: "IntermÃ©diaire",
        code: `const addition = (a, b) => a + b;
console.log(addition(2, 3));`
    },
    {
        titre: "RÃ©agir Ã  un clic",
        contenu: "querySelector sÃ©lectionne un Ã©lÃ©ment, addEventListener Ã©coute un Ã©vÃ©nement. C'est la base de l'interactivitÃ©.",
        langage: "JavaScript",
        niveau: "IntermÃ©diaire",
        code: `document.querySelector("button").addEventListener("click", () => {
  alert("CliquÃ© !");
});`
    }
];

const { ASTUCES_2 } = require('./astucesSeed2');
const TOUTES = ASTUCES.concat(ASTUCES_2);

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

    for (let i = 0; i < TOUTES.length; i++) {
        const a = TOUTES[i];
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
        console.log(`[astuces] ${ajoutees} astuce(s) VirtTech ajoutÃ©e(s).`);
    }
}

module.exports = { semer, ASTUCES };
