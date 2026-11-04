// header.js : header flottant + menu latéral communs à toutes les pages (index.html compris)
document.addEventListener("DOMContentLoaded", function () {
    // Page actuelle, pour mettre le bon lien en surbrillance
    const path = window.location.pathname.split("/").pop() || "index.html";
    const estAccueil = path === "index.html";
    const estResultats = path.startsWith("resultats"); // resultats.html, resultats-podium.html...

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
          <li><a href="index.html" class="${estAccueil ? "actif" : ""}">Accueil</a></li>
          <li><a href="index.html#concours">Concours Virt_Dev</a></li>
          <li><a href="resultats.html" class="${estResultats ? "actif" : ""}">Résultats</a></li>
          <li><a href="index.html#actus">Actualités</a></li>
          <li><a href="index.html#apropos">À propos</a></li>
          <li><a href="index.html#contact">Contact</a></li>
        </ul>
      </nav>
      <small>En transition vers le domaine .com</small>
    </aside>
    `;

    // Injection au tout début du body
    document.body.insertAdjacentHTML("afterbegin", headerHTML);

    // Ouverture / fermeture du menu
    const b = document.getElementById("burger");
    const sd = document.getElementById("side");
    const v = document.getElementById("voile");
    const fermer = document.getElementById("fermer");

    function ouvrir(o) {
        sd.classList.toggle("ouvert", o);
        v.classList.toggle("ouvert", o);
        b.setAttribute("aria-expanded", o);
        if (o) fermer.focus(); else b.focus();
    }

    b.addEventListener("click", () => ouvrir(true));
    fermer.addEventListener("click", () => ouvrir(false));
    v.addEventListener("click", () => ouvrir(false));
    sd.addEventListener("click", (e) => { if (e.target.closest("a")) ouvrir(false); });
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && sd.classList.contains("ouvert")) ouvrir(false);
    });
});