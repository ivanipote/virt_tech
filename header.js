// header.js
document.addEventListener("DOMContentLoaded", function() {
    // On récupère le nom de la page actuelle pour l'onglet actif
    const path = window.location.pathname.split("/").pop() || "index.html";

    // Le code HTML du menu
    const headerHTML = `
    <header class="top">
      <button class="burger" id="burger" aria-label="Ouvrir le menu" aria-expanded="false" aria-controls="side"><i></i>Menu</button>
      <a href="index.html" class="brand">VIRT<span>TECH</span></a>
      <a href="resultats.html" class="top-lien">Résultats</a>
    </header>

    <div class="voile" id="voile"></div>

    <aside class="side" id="side" aria-label="Menu principal">
      <div class="side-tete">
        <div class="side-id">
          <div class="mini"><img src="logo.png" alt="Logo VirtTech"></div>
          <a href="index.html" class="brand">VIRT<span>TECH</span></a>
        </div>
        <button class="fermer" id="fermer" aria-label="Fermer le menu">✕</button>
      </div>
      <nav aria-label="Navigation principale">
        <ul>
          <li><a href="index.html" class="${path === 'index.html' ? 'actif' : ''}">Accueil</a></li>
          <li><a href="index.html#concours">Concours Virt_Dev</a></li>
          <li><a href="resultats.html" class="${path === 'resultats.html' ? 'actif' : ''}">Résultats</a></li>
          <li><a href="index.html#actus">Actualités</a></li>
          <li><a href="index.html#apropos">À propos</a></li>
          <li><a href="index.html#contact">Contact</a></li>
        </ul>
      </nav>
      <small>En transition vers le domaine .com</small>
    </aside>
    `;

    // On injecte le code HTML au tout début du body
    document.body.insertAdjacentHTML('afterbegin', headerHTML);

    // Logique d'ouverture/fermeture du menu
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