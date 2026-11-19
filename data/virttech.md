# VirtTech by Ipote — base de connaissances

## 1. Identité

- Nom : **VirtTech by Ipote**
- Site : https://virttech.site
- Fondateur : **Ipote Ivan Gaël**, étudiant entrepreneur ivoirien.
- Localisation : **La Palmeraie, Abidjan**, Côte d'Ivoire.
- Téléphone : +225 05 03 58 83 36
- E-mail : ipoteivan23@gmail.com
- Équipe : le fondateur et plusieurs autres développeurs (outils, contenus, tests).
- Public : débutants en développement web, en Côte d'Ivoire et en Afrique francophone.

## 2. Mission et valeurs

- Rendre l'apprentissage du **développement web gratuit** et **pratique**.
- Apprendre en écrivant du code, pas seulement en lisant.
- Aucune installation, aucun compte payant.
- Valeurs : gratuité, pratique, communauté, respect, bienveillance entre niveaux.

## 3. Le site

- **Accueil** : présentation, compétences, outils, encouragement.
- **VirtEmulator** : éditeur de code en ligne (mobile et PC).
- **TransformLink** : raccourcisseur de liens.
- **Astuces** : bibliothèque d'astuces partagées par la communauté.
- **Historique** : concours, formations et cours.
- **Virt_Dev** : concours de développement.
- **Actualités**, **À propos**, **Contact**.

## 4. VirtEmulator

Éditeur HTML, CSS et JavaScript directement dans le navigateur, sans installation.

### Fonctionnalités
- **Dossier de projet** : créer, renommer, supprimer des fichiers et des dossiers, profondeur libre.
- Types de fichiers : HTML, CSS, JS, JSON, Markdown, texte, images (SVG, PNG, JPG, WEBP), vidéos (MP4, WEBM).
- **Images et vidéos importées** stockées dans le navigateur (IndexedDB), utilisables dans les pages.
- **Aperçu immédiat** : le CSS et le JS liés sont fusionnés dans la page.
- **Navigation interne** : les liens entre les pages du projet restent dans le projet ; page 404 intégrée.
- **Mini-projets** : 20 modèles prêts à l'emploi (calculatrice, to-do, quiz HTML/CSS/JS, login, portfolio, horloge, compteur, onglets, accordéon, galerie, menu, modal, loader, machine à écrire, profil, bouton animé, contact, quiz web).
- **Téléphone simulé** : accueil (launcher), Google, navigateur avec URL, paramètres, horloge.
- **VirtIA** intégrée : lit le projet et répond.
- **Sauvegarde** automatique dans le navigateur ; **export** d'un fichier ; **export/import ZIP** sur PC.
- **Suggestions de code** et auto-fermeture des balises.

### Mobile et PC
- **Mobile** : interface plein écran, les panneaux (téléphone, dossier, VirtIA) s'ouvrent du bas.
- **PC** (`/virtemulator-pc`) : même éditeur, les panneaux s'ouvrent **à droite sur 40 %** de l'écran, un seul à la fois.
- Même code, mêmes boutons ; les fichiers PC sont des copies dédiées.

## 5. VirtIA

Assistant IA intégré à VirtEmulator.

- **Lecture du projet** : arborescence + fichier actif + fichiers liés (CSS/JS) + fichiers concernés par la question, plafonnés à environ 10 000 caractères.
- **Réponses structurées** : étapes, listes, tableaux, blocs de code colorés.
- **Mobile** : lecture seule, il ne modifie jamais le code.
- **PC** : il peut proposer des fichiers complets, avec un **diff avant/après** et un bouton « Appliquer ».
- **Avis** : like/dislike sur les réponses ; partage en `.txt`.
- **Limites** : 10 messages / 10 minutes par personne, 300 messages par jour au total.
- **Politique** : les échanges sont conservés 90 jours (IP hachée) ; pas de données sensibles.

## 6. TransformLink

- Raccourcit les liens longs (GitHub, site, projet).
- Nom personnalisable, historique local des liens créés.
- Lien court au format `virttech.site/...`.

## 7. Astuces

- Publier une astuce avec un bout de code.
- Aimer une astuce, filtrer par langage et par niveau.
- Gérer ses propres publications.

## 8. Historique et cours

Six activités interactives et des cours complets :

1. **Virt_Dev** — le concours et ses résultats.
2. **L'arborescence** — organiser un projet (dossiers, chemins relatifs).
3. **Les erreurs HTTP** — 400, 401, 403, 404, 405, 408, 410, 429, 500, 502, 503, 504.
4. **Corriger les erreurs** — méthode de diagnostic.
5. **Les balises HTML** — les balises usuelles et leur rôle.
6. **La structure d'une page** — `DOCTYPE`, `head`, `body`, `header`, `main`, `footer`.

## 9. Virt_Dev

- Concours de développement organisé par VirtTech.
- Résultats et classement sur `/virt-dev`.

## 10. Technique

- **Serveur** : Node.js + Express, PostgreSQL, hébergé sur Render.
- **Déploiement** : GitHub `main` → Render (déploiement automatique).
- **Front** : HTML, CSS, JavaScript vanilla, mobile-first.
- **Éditeur** : CodeMirror 5 ; coloration : Prism ; icônes : Font Awesome.
- **IA** : API DeepSeek appelée côté serveur uniquement (clé jamais exposée).

## 11. Règles de conception

- Jamais d'alerte native (`alert`, `confirm`, `prompt`) : toujours une **overlay** maison.
- Design sans cartes, orienté texte, accents dorés (`#D4AF37`).
- Pas d'emoji : uniquement des icônes Font Awesome.
- Mobile-first, puis adaptation PC.
- Le clavier mobile ne s'ouvre que sur un champ de texte touché.

## 12. FAQ

- **Créer un fichier** : bouton Folder → « + fichier » sur la racine ou un dossier.
- **Lier un CSS** : `<link rel="stylesheet" href="css/style.css">` dans le `head`.
- **Voir le résultat** : bouton Play (mobile) ou aperçu permanent (PC).
- **Ajouter une image** : choisir le type Image, puis importer le fichier.
- **Page introuvable** : vérifier le nom exact et le chemin relatif.
- **Sauvegarde** : automatique dans le navigateur ; export possible.

## 13. Limites et transparence

- VirtIA est une IA : elle peut se tromper, il faut vérifier le code.
- Elle ne remplace pas un professeur ; elle aide à comprendre et à corriger.
- Elle ne répond qu'aux sujets du développement web et de VirtTech.

## 14. Contacts

- Formulaire : `/contact`
- Téléphone : +225 05 03 58 83 36
- E-mail : ipoteivan23@gmail.com
- Adresse : La Palmeraie, Abidjan, Côte d'Ivoire.
