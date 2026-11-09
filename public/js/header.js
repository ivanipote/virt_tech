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
        <button class="fermer" id="fermer" aria-label="Fermer le menu">✕</button>
      </div>
      <nav aria-label="Navigation principale">
        <ul>
          <li><a href="/" class="${actifAccueil}">Accueil</a></li>
          <li><a href="/historique" class="${actifHistorique}">Historique d'activité</a></li>
          
          <li>
            <a href="/virtemulator" class="${actifVirtEmulator}">
              VirtEmulator
              <span class="badge-attention" style="background: var(--metal-moyen);">Outil</span>
            </a>
          </li>
          
          <li>
            <a href="/virt-dev" class="${actifResultats}">
              Résultats Virt_Dev
              <span class="badge-attention">Nouveau</span>
            </a>
          </li>
          <li><a href="/#actus">Actualités</a></li>
          <li><a href="/#apropos">À propos</a></li>
          <li><a href="/#contact">Contact</a></li>
        </ul>
      </nav>
      
      <!-- BOUTON CONTACT -->
      <a href="/contact" class="btn-side-contact">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
          Laissez-nous un mail
      </a>

      <small>En transition vers le domaine .com</small>
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