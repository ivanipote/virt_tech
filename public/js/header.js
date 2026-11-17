// header.js
document.addEventListener("DOMContentLoaded", function() {
    const path = window.location.pathname.replace(/\/+$/, '') || '/';

    // 1. Nom + icône de la page affichés dans le header et la sidebar
    const PAGES = {
        '/':                    { nom: 'Accueil',      icone: 'fa-house' },
        '/accueil':             { nom: 'Accueil',      icone: 'fa-house' },
        '/historique':          { nom: 'Historique',   icone: 'fa-clock-rotate-left' },
        '/virtemulator':        { nom: 'VirtEmulator', icone: 'fa-code' },
        '/transformlink':       { nom: 'TransformLink', icone: 'fa-link' },
        '/astuces':             { nom: 'Astuces',      icone: 'fa-lightbulb' },
        '/virt-dev':            { nom: 'Virt_Dev',     icone: 'fa-trophy' },
        '/virt-dev/resultat':   { nom: 'Virt_Dev',     icone: 'fa-trophy' },
        '/contact':             { nom: 'Contact',      icone: 'fa-envelope' },
        '/demo.html':           { nom: 'Démo',         icone: 'fa-flask' }
    };
    const page = PAGES[path] || { nom: 'VirtTech', icone: 'fa-code' };
    const entetePage = `<span class="page-courante"><i class="fa-solid ${page.icone}" aria-hidden="true"></i><span>${page.nom}</span></span>`;

    // 2. Détermination de l'onglet actif
    let actifAccueil = "";
    let actifHistorique = "";
    let actifResultats = "";
    let actifVirtEmulator = "";
    let actifTransformLink = "";
    let actifAstuces = "";

    if (path === "/" || path === "/accueil") { actifAccueil = "actif"; }
    else if (path === "/historique") { actifHistorique = "actif"; }
    else if (path.includes("/virt-dev")) { actifResultats = "actif"; }
    else if (path === "/virtemulator") { actifVirtEmulator = "actif"; }
    else if (path === "/transformlink") { actifTransformLink = "actif"; }
    else if (path === "/astuces") { actifAstuces = "actif"; }

    // 3. Injection du header
    const headerHTML = `
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <header class="top">
      <button class="burger" id="burger" aria-label="Ouvrir le menu" aria-expanded="false" aria-controls="side"><i></i>Menu</button>
      ${entetePage}
    </header>

    <div class="voile" id="voile"></div>

    <aside class="side" id="side" aria-label="Menu principal">
      <div class="side-tete">
        <div class="side-id">
          <div class="mini"><img src="/logo.png" alt="Logo VirtTech"></div>
          ${entetePage}
        </div>
        <button class="fermer" id="fermer" aria-label="Fermer le menu"><i class="fa-solid fa-xmark"></i></button>
      </div>
      
      <nav aria-label="Navigation principale">
        <ul>
          <li>
            <a href="/" class="${actifAccueil}">
                <span>Accueil</span>
                <i class="fa-solid fa-house"></i>
            </a>
          </li>
          <li>
            <a href="/historique" class="${actifHistorique}">
                <span>Historique d'activité</span>
                <i class="fa-solid fa-clock-rotate-left"></i>
            </a>
          </li>
          <li>
            <a href="/virtemulator" class="${actifVirtEmulator}">
                <span>VirtEmulator</span>
                <i class="fa-solid fa-code"></i>
            </a>
          </li>
          <li>
            <a href="/transformlink" class="${actifTransformLink}">
                <span>TransformLink</span>
                <i class="fa-solid fa-link"></i>
            </a>
          </li>
          <li>
            <a href="/astuces" class="${actifAstuces}">
                <span>Astuces</span>
                <i class="fa-solid fa-lightbulb"></i>
            </a>
          </li>
          <li>
            <a href="/virt-dev" class="${actifResultats}">
                <span>Résultats Virt_Dev</span>
                <i class="fa-solid fa-trophy"></i>
            </a>
          </li>
          <li>
            <a href="/#apropos">
                <span>À propos</span>
                <i class="fa-solid fa-circle-info"></i>
            </a>
          </li>
          <li>
            <a href="/#contact">
                <span>Contact</span>
                <i class="fa-solid fa-envelope"></i>
            </a>
          </li>
        </ul>
      </nav>
      
      <div class="side-footer">
          <a href="/contact" class="btn-side-contact">
              <i class="fa-solid fa-paper-plane"></i> Laissez-nous un mail
          </a>
          <small>En transition vers le domaine .com</small>
      </div>
    </aside>
    `;

    document.body.insertAdjacentHTML('afterbegin', headerHTML);

    // 4. Gestion de l'ouverture / fermeture du menu
    const b = document.getElementById('burger');
    const sd = document.getElementById('side');
    const v = document.getElementById('voile');
    const fermer = document.getElementById('fermer');

    function ouvrir(o) {
        sd.classList.toggle('ouvert', o);
        v.classList.toggle('ouvert', o);
        b.setAttribute('aria-expanded', o);
        if (o) fermer.focus(); else b.focus();
    }

    b.onclick = () => ouvrir(true);
    fermer.onclick = () => ouvrir(false);
    v.onclick = () => ouvrir(false);
    sd.onclick = (e) => { if(e.target.tagName === 'A') ouvrir(false); };
    document.onkeydown = (e) => {
        if(e.key === 'Escape' && sd.classList.contains('ouvert')) ouvrir(false);
    };
});
