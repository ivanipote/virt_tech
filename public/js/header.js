// header.js
document.addEventListener("DOMContentLoaded", function() {
    const path = window.location.pathname;

    // On détermine quel onglet est actif
    let actifAccueil = "";
    let actifHistorique = "";
    let actifResultats = "";
    let actifContact = "";
    let actifVirtEmulator = "";

    if (path === "/" || path === "/accueil") { actifAccueil = "actif"; }
    else if (path === "/historique") { actifHistorique = "actif"; }
    else if (path.includes("/virt-dev")) { actifResultats = "actif"; }
    else if (path === "/contact") { actifContact = "actif"; }
    else if (path === "/virtemulator") { actifVirtEmulator = "actif"; }

    const headerHTML = `
    <header class="top">
      <button class="burger" id="burger" aria-label="Ouvrir le menu" aria-expanded="false" aria-controls="side"><i></i>Menu</button>
      <a href="/" class="brand">VIRT<span>TECH</span></a>
    </header>

    <div class="voile" id="voile"></div>

    <aside class="side" id="side" aria-label="Menu principal">
      <div class="side-tete">
        <div class="side-id">
          <div class="mini"><img src="/logo.png" alt="Logo VirtTech"></div>
          <a href="/" class="brand">VIRT<span>TECH</span></a>
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
            <a href="/virt-dev" class="${actifResultats}">
                <span>Résultats Virt_Dev</span>
                <i class="fa-solid fa-trophy"></i>
            </a>
          </li>
          <li>
            <a href="/#actus">
                <span>Actualités</span>
                <i class="fa-solid fa-newspaper"></i>
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
      
      <!-- FOOTER DE LA SIDEBAR (poussé en bas) -->
      <div class="side-footer">
          <a href="/contact" class="btn-side-contact">
              <i class="fa-solid fa-paper-plane"></i> Laissez-nous un mail
          </a>
          <small>En transition vers le domaine .com</small>
      </div>
    </aside>
    `;

    document.body.insertAdjacentHTML('afterbegin', headerHTML);

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