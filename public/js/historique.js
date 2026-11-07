// --- historique.js ---

document.addEventListener("DOMContentLoaded", function() {
    
    // ==========================================
    // 1. DONNEES DES ACTIVITES
    // ==========================================
    const activites = {
        'virtdev': {
            titre: "🏆 Concours Virt_Dev",
            contenu: `
                <h4>📅 Déroulement</h4>
                <p>Du 30 octobre au 4 novembre 2026. Les participants devaient reproduire une maquette de page de connexion (Login Page) en HTML et CSS. L'utilisation de l'IA était autorisée.</p>
                
                <h4>🥇 Les Gagnants</h4>
                <div class="badge-gagnant">1ère Place : Horo David (2 000 F CFA)</div><br>
                <div class="badge-gagnant" style="background:var(--surface); color:var(--ombre);">2ème Place : Koudouss (1 000 F CFA)</div>
                <p style="margin-top:10px; font-size:0.85rem;">Les paiements ont été effectués par Mobile Money (Wave) en direct sur le groupe WhatsApp.</p>

                <h4>⚖️ Décision du Jury</h4>
                <p>Le jury a départagé les deux candidats sur la base de plusieurs critères :</p>
                <ul>
                    <li>L'intégration du logo via la technique du <strong>Base64</strong> (Horo).</li>
                    <li>L'ajout d'<strong>animations 3D</strong> et d'effets de survol très fluides (Horo).</li>
                    <li>La propreté générale du code (Les deux candidats).</li>
                </ul>

                <h4>💰 Bilan Financier</h4>
                <p>Frais d'inscription : 1 000 F CFA (2 x 500 F).<br>
                Prix distribués : 3 000 F CFA (complétés par le fondateur).</p>

                <a href="/virt-dev" class="lien-resultats">Voir la page des résultats complète ➔</a>
            `
        },
        'formation': {
            titre: "📚 Formation : Arborescence et Liaison",
            contenu: `
                <h4>📁 C'est quoi un dossier ?</h4>
                <p>Un dossier, c'est comme une <strong>boîte</strong>, un <strong>sac</strong>, ou un <strong>lieu</strong> où l'on range tout ce dont on a besoin pour atteindre un objectif. En informatique, c'est l'espace où l'on stocke les fichiers d'un projet.</p>

                <h4>🌳 C'est quoi l'arborescence ?</h4>
                <p>L'arborescence, c'est la <strong>structure</strong> que tu vois dans ton dossier de travail. En un mot, ce sont tous les fichiers et dossiers qui constituent ton projet, organisés de manière logique.</p>

                <h4>🎯 Comment choisir une bonne arborescence ?</h4>
                <p>Tout dépend du projet. Si ton projet est uniquement du <strong>front-end</strong> (pas de backend/serveur), tu as la liberté de structurer tes fichiers comme tu veux. Voici des exemples concrets :</p>

                <h4>📂 Exemple 1 : Projet Minimal (Tout à la racine)</h4>
                <p>C'est le plus simple pour débuter. Idéal pour un site vitrine statique.</p>
                
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">STRUCTURE</span>
                        <button class="btn-copier" data-code="Mon-Ecole/&#10;├── index.html&#10;├── contact.html&#10;├── style.css&#10;├── script.js&#10;└── images/&#10;    ├── logo.png&#10;    └── banniere.jpg">📋 Copier</button>
                    </div>
                    <div class="code-content">
<span class="hl-folder">Mon-Ecole/</span>
├── index.html
├── contact.html
├── style.css
├── script.js
└── <span class="hl-folder">images/</span>
    ├── logo.png
    └── banniere.jpg</div>
                </div>

                <h4>📂 Exemple 2 : Projet Structuré (Avec sous-dossiers)</h4>
                <p>Quand le projet grandit, on sépare le CSS, le JS et les médias dans des dossiers dédiés.</p>
                
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">STRUCTURE</span>
                        <button class="btn-copier" data-code="Mon-Portfolio/&#10;├── index.html&#10;├── a-propos.html&#10;├── css/&#10;│   ├── style.css&#10;│   └── responsive.css&#10;├── js/&#10;│   └── script.js&#10;└── assets/&#10;    ├── images/&#10;    │   └── profil.jpg&#10;    └── videos/&#10;        └── presentation.mp4">📋 Copier</button>
                    </div>
                    <div class="code-content">
<span class="hl-folder">Mon-Portfolio/</span>
├── index.html
├── a-propos.html
├── <span class="hl-folder">css/</span>
│   ├── style.css
│   └── responsive.css
├── <span class="hl-folder">js/</span>
│   └── script.js
└── <span class="hl-folder">assets/</span>
    ├── <span class="hl-folder">images/</span>
    │   └── profil.jpg
    └── <span class="hl-folder">videos/</span>
        └── presentation.mp4</div>
                </div>

                <h4>🔗 Lier les fichiers entre eux</h4>
                <p>Une fois l'arborescence créée, il faut dire au fichier HTML où trouver le CSS et le JS.</p>
                
                <p><strong>1. Lier le CSS</strong> (dans la balise <code>&lt;head&gt;</code>) :</p>
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">HTML</span>
                        <button class="btn-copier" data-code="<link rel='stylesheet' href='style.css'>">📋 Copier</button>
                    </div>
                    <div class="code-content"><span class="hl-tag">&lt;link</span> <span class="hl-attr">rel</span>=<span class="hl-str">"stylesheet"</span> <span class="hl-attr">href</span>=<span class="hl-str">"style.css"</span><span class="hl-tag">&gt;</span></div>
                </div>
                <p><em>Si le CSS est dans un dossier (ex: <code>css/style.css</code>), on précise le chemin :</em></p>
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">HTML</span>
                        <button class="btn-copier" data-code="<link rel='stylesheet' href='css/style.css'>">📋 Copier</button>
                    </div>
                    <div class="code-content"><span class="hl-tag">&lt;link</span> <span class="hl-attr">rel</span>=<span class="hl-str">"stylesheet"</span> <span class="hl-attr">href</span>=<span class="hl-str">"css/style.css"</span><span class="hl-tag">&gt;</span></div>
                </div>

                <p><strong>2. Lier le JS</strong> (juste avant la fermeture de <code>&lt;/body&gt;</code>) :</p>
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">HTML</span>
                        <button class="btn-copier" data-code="<script src='script.js'></script>">📋 Copier</button>
                    </div>
                    <div class="code-content"><span class="hl-tag">&lt;script</span> <span class="hl-attr">src</span>=<span class="hl-str">"script.js"</span><span class="hl-tag">&gt;&lt;/script&gt;</span></div>
                </div>

                <h4>💡 Le secret des chemins</h4>
                <p>La règle d'or : <strong>mettre le nom du sous-dossier, un slash, jusqu'à atteindre le fichier cible.</strong></p>
                <p>Exemple : si ton image est dans <code>assets/images/logo.png</code>, tu écriras dans ton HTML :</p>
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">HTML</span>
                        <button class="btn-copier" data-code="<img src='assets/images/logo.png' alt='Logo'>">📋 Copier</button>
                    </div>
                    <div class="code-content"><span class="hl-tag">&lt;img</span> <span class="hl-attr">src</span>=<span class="hl-str">"assets/images/logo.png"</span> <span class="hl-attr">alt</span>=<span class="hl-str">"Logo"</span><span class="hl-tag">&gt;</span></div>
                </div>
            `
        }
    };

    // ==========================================
    // 2. LOGIQUE DU SLIDE
    // ==========================================
    const overlay = document.getElementById('slide-overlay');
    const panel = document.getElementById('slide-panel');
    const title = document.getElementById('slide-title');
    const contenu = document.getElementById('slide-contenu');

    window.ouvrirSlide = function(id) {
        const data = activites[id];
        if (!data) return;

        title.innerText = data.titre;
        contenu.innerHTML = data.contenu;

        overlay.classList.add('ouvert');
        panel.classList.add('ouvert');
        document.body.style.overflow = 'hidden';
        
        contenu.scrollTop = 0; 
    }

    window.fermerSlide = function() {
        overlay.classList.remove('ouvert');
        panel.classList.remove('ouvert');
        document.body.style.overflow = '';
    }

    // ==========================================
    // 3. LOGIQUE DU BOUTON COPIER
    // ==========================================
    // On utilise la délégation d'événements car les boutons sont injectés dynamiquement
    document.addEventListener('click', async function(e) {
        if (e.target && e.target.classList.contains('btn-copier')) {
            const codeACopier = e.target.getAttribute('data-code');
            try {
                await navigator.clipboard.writeText(codeACopier);
                const originalText = e.target.innerHTML;
                e.target.innerHTML = "✅ Copié !";
                setTimeout(() => { e.target.innerHTML = originalText; }, 2000);
            } catch (err) {
                alert("Erreur lors de la copie.");
            }
        }
    });

    // ==========================================
    // 4. ANIMATIONS AU DEFILEMENT
    // ==========================================
    var els = document.querySelectorAll('.reveal');
    if('IntersectionObserver' in window){
        var io = new IntersectionObserver(function(entries){
            entries.forEach(function(entry){
                if(entry.isIntersecting){
                    entry.target.classList.add('vu');
                    io.unobserve(entry.target);
                }
            });
        }, {threshold: .12});
        
        els.forEach(function(e){ io.observe(e); });
    } else {
        els.forEach(function(e){ e.classList.add('vu'); });
    }
});