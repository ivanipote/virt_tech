// --- projets.js ---
// 20 projets prédéfinis pour VirtEmulator
// Chargé AVANT virtemulator.js — expose window.PROJETS

window.PROJETS = {

    // ============================================================
    // 1. CALCULATRICE
    // ============================================================
    calc: `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Calculatrice</title>
<style>
  body { display: flex; justify-content: center; align-items: center; height: 100vh; background: #f0f0f0; margin: 0; font-family: sans-serif; }
  .calc { background: #333; padding: 20px; border-radius: 10px; width: 250px; }
  .ecran { background: #fff; padding: 15px; text-align: right; font-size: 1.5rem; border-radius: 5px; margin-bottom: 10px; min-height: 30px; overflow: hidden; }
  .touches { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
  button { padding: 15px; font-size: 1.1rem; border: none; border-radius: 5px; background: #555; color: white; cursor: pointer; }
  button:hover { background: #777; }
  .op { background: #D4AF37; color: #000; }
  .zero { grid-column: span 3; }
</style>
</head>
<body>
<div class="calc">
  <div class="ecran" id="ecran">0</div>
  <div class="touches">
    <button onclick="clearE()">C</button>
    <button onclick="append('/')">/</button>
    <button onclick="append('*')">*</button>
    <button class="op" onclick="append('-')">-</button>
    <button onclick="append('7')">7</button>
    <button onclick="append('8')">8</button>
    <button onclick="append('9')">9</button>
    <button class="op" onclick="append('+')">+</button>
    <button onclick="append('4')">4</button>
    <button onclick="append('5')">5</button>
    <button onclick="append('6')">6</button>
    <button class="op" onclick="calculer()">=</button>
    <button onclick="append('1')">1</button>
    <button onclick="append('2')">2</button>
    <button onclick="append('3')">3</button>
    <button onclick="append('0')" class="zero">0</button>
    <button onclick="append('.')">.</button>
  </div>
</div>
<script>
  const ecran = document.getElementById('ecran');
  function append(val) {
    if (ecran.innerText === '0' || ecran.innerText === 'Erreur') ecran.innerText = val;
    else ecran.innerText += val;
  }
  function clearE() { ecran.innerText = '0'; }
  function calculer() {
    try { ecran.innerText = eval(ecran.innerText); }
    catch(e) { ecran.innerText = 'Erreur'; }
  }
<\/script>
</body>
</html>`,

    // ============================================================
    // 2. PAGE LOGIN
    // ============================================================
    login: `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Page Login</title>
<style>
  body { display: flex; justify-content: center; align-items: center; height: 100vh; background: linear-gradient(135deg, #0B2545, #13315C); margin: 0; font-family: sans-serif; color: white; }
  .box { background: rgba(255,255,255,0.1); padding: 30px; border-radius: 15px; width: 300px; text-align: center; backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2); }
  h2 { margin-top: 0; color: #D4AF37; }
  input { width: 100%; padding: 12px; margin: 10px 0; border: none; border-radius: 8px; box-sizing: border-box; background: rgba(255,255,255,0.9); outline: none; }
  button { width: 100%; padding: 12px; background: #D4AF37; color: #000; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; margin-top: 10px; font-size: 1rem; }
  button:hover { background: #F6D58E; }
  .message { margin-top: 15px; font-size: 0.85rem; color: #F6D58E; display: none; }
</style>
</head>
<body>
<div class="box">
  <h2>Connexion</h2>
  <input type="text" id="nom" placeholder="Nom d'utilisateur">
  <input type="password" id="mdp" placeholder="Mot de passe">
  <button onclick="seConnecter()">Se connecter</button>
  <div class="message" id="message"></div>
</div>
<script>
  function seConnecter() {
    const nom = document.getElementById('nom').value;
    const msg = document.getElementById('message');
    if (!nom) { msg.textContent = '❌ Entre un nom !'; msg.style.display = 'block'; return; }
    msg.textContent = '✅ Bienvenue ' + nom + ' !';
    msg.style.display = 'block';
  }
<\/script>
</body>
</html>`,

    // ============================================================
    // 3. PORTFOLIO
    // ============================================================
    portfolio: `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Mon Portfolio</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: sans-serif; background: #f2f2f2; color: #202124; }
  header { background: linear-gradient(135deg, #0B2545, #13315C); color: white; padding: 60px 20px; text-align: center; }
  header h1 { font-size: 2.5rem; margin-bottom: 10px; }
  header p { opacity: 0.8; font-size: 1.1rem; }
  main { max-width: 800px; margin: 30px auto; padding: 0 20px; }
  .card { background: white; border-radius: 15px; padding: 25px; margin-bottom: 20px; box-shadow: 0 3px 10px rgba(0,0,0,0.08); }
  .card h2 { color: #0B2545; margin-bottom: 10px; }
  .card p { line-height: 1.6; color: #555; }
  footer { text-align: center; padding: 30px; color: #666; font-size: 0.9rem; }
</style>
</head>
<body>
<header>
  <h1>Mon Portfolio</h1>
  <p>Développeur web débutant</p>
</header>
<main>
  <div class="card"><h2>À propos</h2><p>Bonjour ! Je suis un développeur en herbe passionné par le web. J'apprends HTML, CSS et JavaScript avec VirtEmulator.</p></div>
  <div class="card"><h2>Mes projets</h2><p>Calculatrice, page login, quiz interactifs... et bien d'autres à venir !</p></div>
  <div class="card"><h2>Contact</h2><p>Écris-moi à contact@exemple.com</p></div>
</main>
<footer>© 2025 - Créé avec VirtEmulator</footer>
</body>
</html>`,

    // ============================================================
    // 4. BOUTON STYLÉ
    // ============================================================
    bouton: `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Bouton Stylé</title>
<style>
  body { display: flex; justify-content: center; align-items: center; height: 100vh; background: #1a1a2e; margin: 0; font-family: sans-serif; flex-direction: column; gap: 30px; }
  .btn { padding: 15px 40px; border: none; border-radius: 50px; font-size: 1.1rem; font-weight: bold; cursor: pointer; transition: all 0.3s; text-transform: uppercase; letter-spacing: 1px; }
  .btn-1 { background: linear-gradient(135deg, #667eea, #764ba2); color: white; box-shadow: 0 10px 20px rgba(102,126,234,0.4); }
  .btn-1:hover { transform: translateY(-5px); box-shadow: 0 15px 30px rgba(102,126,234,0.6); }
  .btn-2 { background: transparent; color: #D4AF37; border: 2px solid #D4AF37; }
  .btn-2:hover { background: #D4AF37; color: #000; }
  .btn-3 { background: #ff6b6b; color: white; border-radius: 12px; }
  .btn-3:hover { background: #ee5a6f; transform: scale(1.05); }
  .btn-4 { background: white; color: #333; border: 2px solid #333; }
  .btn-4:hover { background: #333; color: white; }
</style>
</head>
<body>
  <button class="btn btn-1">Dégradé</button>
  <button class="btn btn-2">Contour</button>
  <button class="btn btn-3">Scale</button>
  <button class="btn btn-4">Inversé</button>
</body>
</html>`,

    // ============================================================
    // 5. CARTE DE PROFIL
    // ============================================================
    profil: `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Carte Profil</title>
<style>
  body { display: flex; justify-content: center; align-items: center; height: 100vh; background: #f0f2f5; margin: 0; font-family: sans-serif; }
  .card { background: white; border-radius: 20px; padding: 30px; width: 280px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
  .avatar { width: 100px; height: 100px; border-radius: 50%; background: linear-gradient(135deg, #0B2545, #D4AF37); margin: 0 auto 20px; display: flex; justify-content: center; align-items: center; color: white; font-size: 2.5rem; font-weight: bold; }
  h2 { margin: 0 0 5px; color: #202124; }
  .role { color: #D4AF37; font-size: 0.9rem; margin-bottom: 20px; }
  .stats { display: flex; justify-content: space-around; border-top: 1px solid #eee; padding-top: 20px; }
  .stat strong { display: block; color: #0B2545; font-size: 1.2rem; }
  .stat span { font-size: 0.75rem; color: #888; }
</style>
</head>
<body>
<div class="card">
  <div class="avatar">VT</div>
  <h2>VirtTech</h2>
  <div class="role">Développeur Web</div>
  <div class="stats">
    <div class="stat"><strong>42</strong><span>Projets</span></div>
    <div class="stat"><strong>128</strong><span>Followers</span></div>
    <div class="stat"><strong>89</strong><span>Suivis</span></div>
  </div>
</div>
</body>
</html>`,

    // ============================================================
    // 6. FORMULAIRE CONTACT
    // ============================================================
    contact: `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Formulaire Contact</title>
<style>
  body { display: flex; justify-content: center; align-items: center; min-height: 100vh; background: linear-gradient(135deg, #667eea, #764ba2); margin: 0; font-family: sans-serif; padding: 20px; box-sizing: border-box; }
  .form-box { background: white; padding: 30px; border-radius: 15px; width: 100%; max-width: 400px; box-shadow: 0 20px 40px rgba(0,0,0,0.2); }
  h2 { margin: 0 0 20px; color: #333; text-align: center; }
  .field { margin-bottom: 15px; }
  label { display: block; font-size: 0.85rem; color: #555; margin-bottom: 5px; font-weight: bold; }
  input, textarea { width: 100%; padding: 10px; border: 2px solid #e0e0e0; border-radius: 8px; box-sizing: border-box; outline: none; font-family: inherit; transition: border 0.2s; }
  input:focus, textarea:focus { border-color: #667eea; }
  textarea { resize: vertical; min-height: 100px; }
  button { width: 100%; padding: 12px; background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; border-radius: 8px; font-weight: bold; font-size: 1rem; cursor: pointer; margin-top: 10px; }
  button:hover { opacity: 0.9; }
  .success { color: #34A853; text-align: center; margin-top: 10px; display: none; }
</style>
</head>
<body>
<div class="form-box">
  <h2>Contacte-moi</h2>
  <div class="field"><label>Nom</label><input type="text" id="nom" placeholder="Ton nom"></div>
  <div class="field"><label>Email</label><input type="email" id="email" placeholder="ton@email.com"></div>
  <div class="field"><label>Message</label><textarea id="message" placeholder="Ton message..."></textarea></div>
  <button onclick="envoyer()">Envoyer</button>
  <div class="success" id="success">✅ Message envoyé !</div>
</div>
<script>
  function envoyer() {
    const nom = document.getElementById('nom').value;
    const email = document.getElementById('email').value;
    const msg = document.getElementById('message').value;
    if (!nom || !email || !msg) { alert('Remplis tous les champs !'); return; }
    document.getElementById('success').style.display = 'block';
  }
<\/script>
</body>
</html>`,

    // ============================================================
    // 7. GALERIE PHOTOS
    // ============================================================
    galerie: `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Galerie Photos</title>
<style>
  body { background: #f0f2f5; margin: 0; padding: 40px 20px; font-family: sans-serif; }
  h1 { text-align: center; color: #0B2545; }
  .galerie { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 15px; max-width: 800px; margin: 0 auto; }
  .photo { aspect-ratio: 1; border-radius: 12px; overflow: hidden; cursor: pointer; transition: transform 0.3s, box-shadow 0.3s; }
  .photo:hover { transform: scale(1.05); box-shadow: 0 10px 25px rgba(0,0,0,0.2); }
  .photo img { width: 100%; height: 100%; object-fit: cover; }
</style>
</head>
<body>
<h1>Ma Galerie</h1>
<div class="galerie">
  <div class="photo"><img src="https://picsum.photos/300/300?1" alt="Photo 1"></div>
  <div class="photo"><img src="https://picsum.photos/300/300?2" alt="Photo 2"></div>
  <div class="photo"><img src="https://picsum.photos/300/300?3" alt="Photo 3"></div>
  <div class="photo"><img src="https://picsum.photos/300/300?4" alt="Photo 4"></div>
  <div class="photo"><img src="https://picsum.photos/300/300?5" alt="Photo 5"></div>
  <div class="photo"><img src="https://picsum.photos/300/300?6" alt="Photo 6"></div>
  <div class="photo"><img src="https://picsum.photos/300/300?7" alt="Photo 7"></div>
  <div class="photo"><img src="https://picsum.photos/300/300?8" alt="Photo 8"></div>
</div>
</body>
</html>`,

    // ============================================================
    // 8. HORLOGE DIGITALE
    // ============================================================
    horloge: `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Horloge Digitale</title>
<style>
  body { display: flex; justify-content: center; align-items: center; height: 100vh; background: #000; margin: 0; font-family: 'Courier New', monospace; }
  .horloge { color: #00ff41; font-size: 4rem; font-weight: bold; text-shadow: 0 0 20px #00ff41, 0 0 40px #00ff41; letter-spacing: 5px; }
  .date { color: #00ff41; text-align: center; margin-top: 10px; font-size: 1.2rem; opacity: 0.7; }
</style>
</head>
<body>
<div style="text-align: center;">
  <div class="horloge" id="horloge">--:--:--</div>
  <div class="date" id="date"></div>
</div>
<script>
  function update() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2,'0');
    const m = String(now.getMinutes()).padStart(2,'0');
    const s = String(now.getSeconds()).padStart(2,'0');
    document.getElementById('horloge').textContent = h + ':' + m + ':' + s;
    const jours = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'];
    const mois = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
    document.getElementById('date').textContent = jours[now.getDay()] + ' ' + now.getDate() + ' ' + mois[now.getMonth()] + ' ' + now.getFullYear();
  }
  setInterval(update, 1000);
  update();
<\/script>
</body>
</html>`,

    // ============================================================
    // 9. COMPTEUR DE CLICS
    // ============================================================
    compteur: `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Compteur de Clics</title>
<style>
  body { display: flex; justify-content: center; align-items: center; height: 100vh; background: linear-gradient(135deg, #f093fb, #f5576c); margin: 0; font-family: sans-serif; flex-direction: column; gap: 20px; }
  .compteur { font-size: 6rem; font-weight: bold; color: white; text-shadow: 0 5px 15px rgba(0,0,0,0.3); }
  button { padding: 20px 50px; font-size: 1.2rem; font-weight: bold; border: none; border-radius: 50px; cursor: pointer; background: white; color: #f5576c; box-shadow: 0 10px 25px rgba(0,0,0,0.2); transition: transform 0.1s; }
  button:active { transform: scale(0.95); }
  .reset { background: rgba(255,255,255,0.3); color: white; padding: 10px 30px; font-size: 0.9rem; }
</style>
</head>
<body>
<div class="compteur" id="compteur">0</div>
<button onclick="incrementer()">Clique-moi !</button>
<button class="reset" onclick="reset()">Réinitialiser</button>
<script>
  let count = 0;
  function incrementer() {
    count++;
    document.getElementById('compteur').textContent = count;
  }
  function reset() {
    count = 0;
    document.getElementById('compteur').textContent = count;
  }
<\/script>
</body>
</html>`,

    // ============================================================
    // 10. TO-DO LIST
    // ============================================================
    todo: `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>To-Do List</title>
<style>
  body { display: flex; justify-content: center; align-items: flex-start; min-height: 100vh; background: #f0f2f5; margin: 0; padding-top: 50px; font-family: sans-serif; }
  .app { background: white; border-radius: 15px; padding: 25px; width: 90%; max-width: 400px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
  h1 { margin: 0 0 20px; color: #0B2545; text-align: center; }
  .input-row { display: flex; gap: 10px; margin-bottom: 20px; }
  input { flex: 1; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px; outline: none; }
  input:focus { border-color: #0B2545; }
  .add-btn { padding: 12px 20px; background: #0B2545; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; }
  .add-btn:hover { background: #13315C; }
  ul { list-style: none; padding: 0; margin: 0; }
  li { display: flex; justify-content: space-between; align-items: center; padding: 12px; background: #f9f9f9; border-radius: 8px; margin-bottom: 8px; }
  li.done span { text-decoration: line-through; color: #999; }
  li span { cursor: pointer; flex: 1; }
  .delete { background: #ff6b6b; color: white; border: none; width: 28px; height: 28px; border-radius: 50%; cursor: pointer; font-size: 0.9rem; }
</style>
</head>
<body>
<div class="app">
  <h1>Ma To-Do</h1>
  <div class="input-row">
    <input type="text" id="task" placeholder="Nouvelle tâche..." onkeypress="if(event.key==='Enter') ajouter()">
    <button class="add-btn" onclick="ajouter()">+</button>
  </div>
  <ul id="liste"></ul>
</div>
<script>
  function ajouter() {
    const input = document.getElementById('task');
    const texte = input.value.trim();
    if (!texte) return;
    const li = document.createElement('li');
    li.innerHTML = '<span onclick="this.parentElement.classList.toggle(\\'done\\')">' + texte + '</span><button class="delete" onclick="this.parentElement.remove()">×</button>';
    document.getElementById('liste').appendChild(li);
    input.value = '';
  }
<\/script>
</body>
</html>`,

    // ============================================================
    // 11. MENU NAVIGATION
    // ============================================================
    menu: `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Menu Navigation</title>
<style>
  body { margin: 0; font-family: sans-serif; }
  nav { background: #0B2545; padding: 15px 30px; display: flex; justify-content: space-between; align-items: center; color: white; }
  .logo { font-size: 1.3rem; font-weight: bold; color: #D4AF37; }
  ul { display: flex; gap: 25px; list-style: none; margin: 0; padding: 0; }
  ul a { color: white; text-decoration: none; font-size: 0.9rem; transition: color 0.2s; }
  ul a:hover { color: #D4AF37; }
  .burger { display: none; font-size: 1.5rem; cursor: pointer; background: none; border: none; color: white; }
  .hero { background: linear-gradient(135deg, #13315C, #0B2545); color: white; padding: 80px 30px; text-align: center; }
  .hero h1 { font-size: 2.5rem; margin-bottom: 10px; }
  @media (max-width: 600px) {
    ul { display: none; flex-direction: column; position: absolute; top: 60px; left: 0; right: 0; background: #0B2545; padding: 20px; gap: 15px; }
    ul.open { display: flex; }
    .burger { display: block; }
  }
</style>
</head>
<body>
<nav>
  <div class="logo">MonSite</div>
  <button class="burger" onclick="document.getElementById('menu').classList.toggle('open')">☰</button>
  <ul id="menu">
    <li><a href="#">Accueil</a></li>
    <li><a href="#">Services</a></li>
    <li><a href="#">À propos</a></li>
    <li><a href="#">Contact</a></li>
  </ul>
</nav>
<div class="hero">
  <h1>Bienvenue !</h1>
  <p>Redimensionne la fenêtre pour voir le menu responsive.</p>
</div>
</body>
</html>`,

    // ============================================================
    // 12. EFFET TYPING
    // ============================================================
    typing: `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Effet Typing</title>
<style>
  body { display: flex; justify-content: center; align-items: center; height: 100vh; background: #1a1a2e; margin: 0; font-family: 'Courier New', monospace; }
  .typing { color: #D4AF37; font-size: 2rem; font-weight: bold; border-right: 3px solid #D4AF37; padding-right: 5px; white-space: nowrap; overflow: hidden; animation: blink 0.7s infinite; }
  @keyframes blink { 50% { border-color: transparent; } }
</style>
</head>
<body>
<div class="typing" id="typing"></div>
<script>
  const textes = [
    "Bienvenue sur VirtEmulator...",
    "Apprends à coder en t'amusant !",
    "HTML, CSS, JavaScript...",
    "Crée tes propres projets !"
  ];
  let indexTexte = 0;
  let indexChar = 0;
  let effacer = false;

  function animer() {
    const el = document.getElementById('typing');
    const texte = textes[indexTexte];
    if (!effacer) {
      el.textContent = texte.substring(0, indexChar + 1);
      indexChar++;
      if (indexChar === texte.length) { effacer = true; setTimeout(animer, 1500); return; }
    } else {
      el.textContent = texte.substring(0, indexChar - 1);
      indexChar--;
      if (indexChar === 0) { effacer = false; indexTexte = (indexTexte + 1) % textes.length; }
    }
    setTimeout(animer, effacer ? 50 : 100);
  }
  animer();
<\/script>
</body>
</html>`,

    // ============================================================
    // 13. LOADER ANIMÉ
    // ============================================================
    loader: `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Loader Animé</title>
<style>
  body { display: flex; justify-content: center; align-items: center; height: 100vh; background: #0B2545; margin: 0; flex-direction: column; gap: 30px; font-family: sans-serif; color: white; }
  .spinner { width: 60px; height: 60px; border: 6px solid rgba(255,255,255,0.2); border-top-color: #D4AF37; border-radius: 50%; animation: spin 1s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .dots { display: flex; gap: 10px; }
  .dots span { width: 15px; height: 15px; background: #D4AF37; border-radius: 50%; animation: bounce 1.4s infinite ease-in-out both; }
  .dots span:nth-child(1) { animation-delay: -0.32s; }
  .dots span:nth-child(2) { animation-delay: -0.16s; }
  @keyframes bounce { 0%,80%,100% { transform: scale(0); } 40% { transform: scale(1); } }
  .bar { width: 200px; height: 8px; background: rgba(255,255,255,0.2); border-radius: 4px; overflow: hidden; }
  .bar::after { content: ''; display: block; width: 40%; height: 100%; background: #D4AF37; border-radius: 4px; animation: slide 1.5s ease-in-out infinite; }
  @keyframes slide { 0% { transform: translateX(-100%); } 100% { transform: translateX(300%); } }
</style>
</head>
<body>
  <div class="spinner"></div>
  <div class="dots"><span></span><span></span><span></span></div>
  <div class="bar"></div>
  <p>Chargement...</p>
</body>
</html>`,

    // ============================================================
    // 14. ACCORDÉON FAQ
    // ============================================================
    accordeon: `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Accordéon FAQ</title>
<style>
  body { display: flex; justify-content: center; align-items: flex-start; min-height: 100vh; background: #f0f2f5; margin: 0; padding-top: 50px; font-family: sans-serif; }
  .faq { width: 90%; max-width: 500px; }
  h1 { text-align: center; color: #0B2545; margin-bottom: 30px; }
  .item { background: white; border-radius: 10px; margin-bottom: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); overflow: hidden; }
  .question { padding: 18px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; font-weight: bold; color: #0B2545; }
  .question:hover { background: #f9f9f9; }
  .question::after { content: '+'; font-size: 1.5rem; color: #D4AF37; transition: transform 0.3s; }
  .item.open .question::after { transform: rotate(45deg); }
  .reponse { max-height: 0; overflow: hidden; transition: max-height 0.3s; padding: 0 18px; color: #555; line-height: 1.6; }
  .item.open .reponse { max-height: 200px; padding: 0 18px 18px; }
</style>
</head>
<body>
<div class="faq">
  <h1>FAQ</h1>
  <div class="item"><div class="question" onclick="this.parentElement.classList.toggle('open')">Qu'est-ce que VirtEmulator ?</div><div class="reponse">VirtEmulator est un éditeur de code en ligne pour apprendre le développement web.</div></div>
  <div class="item"><div class="question" onclick="this.parentElement.classList.toggle('open')">Est-ce gratuit ?</div><div class="reponse">Oui, totalement gratuit et accessible à tous.</div></div>
  <div class="item"><div class="question" onclick="this.parentElement.classList.toggle('open')">Faut-il installer quelque chose ?</div><div class="reponse">Non, tout se passe dans ton navigateur.</div></div>
  <div class="item"><div class="question" onclick="this.parentElement.classList.toggle('open')">Puis-je sauvegarder mes projets ?</div><div class="reponse">Oui, tes fichiers sont sauvegardés dans ton navigateur.</div></div>
</div>
</body>
</html>`,

    // ============================================================
    // 15. ONGLETS (TABS)
    // ============================================================
    tabs: `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Onglets</title>
<style>
  body { display: flex; justify-content: center; align-items: center; height: 100vh; background: #f0f2f5; margin: 0; font-family: sans-serif; }
  .tabs { background: white; border-radius: 15px; width: 90%; max-width: 500px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); overflow: hidden; }
  .tab-btns { display: flex; background: #f9f9f9; border-bottom: 2px solid #eee; }
  .tab-btn { flex: 1; padding: 15px; background: none; border: none; cursor: pointer; font-weight: bold; color: #888; transition: all 0.3s; font-size: 0.9rem; }
  .tab-btn.active { color: #0B2545; border-bottom: 3px solid #D4AF37; }
  .tab-btn:hover { background: #f0f0f0; }
  .tab-content { padding: 25px; display: none; }
  .tab-content.active { display: block; animation: fade 0.3s; }
  @keyframes fade { from { opacity: 0; } to { opacity: 1; } }
  h2 { color: #0B2545; margin-top: 0; }
  p { color: #555; line-height: 1.6; }
</style>
</head>
<body>
<div class="tabs">
  <div class="tab-btns">
    <button class="tab-btn active" onclick="showTab(0)">HTML</button>
    <button class="tab-btn" onclick="showTab(1)">CSS</button>
    <button class="tab-btn" onclick="showTab(2)">JS</button>
  </div>
  <div class="tab-content active"><h2>HTML</h2><p>HTML (HyperText Markup Language) est le langage de structure des pages web. Il utilise des balises comme &lt;div&gt;, &lt;p&gt;, &lt;h1&gt;...</p></div>
  <div class="tab-content"><h2>CSS</h2><p>CSS (Cascading Style Sheets) gère l'apparence : couleurs, tailles, positions, animations...</p></div>
  <div class="tab-content"><h2>JavaScript</h2><p>JavaScript rend les pages interactives : clics, animations, calculs, communication avec des serveurs...</p></div>
</div>
<script>
  function showTab(i) {
    document.querySelectorAll('.tab-btn').forEach((b, j) => b.classList.toggle('active', i === j));
    document.querySelectorAll('.tab-content').forEach((c, j) => c.classList.toggle('active', i === j));
  }
<\/script>
</body>
</html>`,

    // ============================================================
    // 16. MODAL POPUP
    // ============================================================
    modal: `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Modal Popup</title>
<style>
  body { display: flex; justify-content: center; align-items: center; height: 100vh; background: #f0f2f5; margin: 0; font-family: sans-serif; }
  .open-btn { padding: 15px 40px; background: #0B2545; color: white; border: none; border-radius: 50px; font-size: 1rem; cursor: pointer; }
  .open-btn:hover { background: #13315C; }
  .modal-overlay { display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.6); justify-content: center; align-items: center; z-index: 100; }
  .modal-overlay.open { display: flex; }
  .modal { background: white; border-radius: 15px; padding: 30px; max-width: 400px; width: 90%; text-align: center; animation: pop 0.3s; }
  @keyframes pop { from { transform: scale(0.7); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  .modal h2 { margin: 0 0 15px; color: #0B2545; }
  .modal p { color: #555; margin-bottom: 25px; line-height: 1.6; }
  .modal button { padding: 12px 30px; background: #D4AF37; color: #000; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; }
</style>
</head>
<body>
<button class="open-btn" onclick="document.getElementById('overlay').classList.add('open')">Ouvrir la modale</button>
<div class="modal-overlay" id="overlay" onclick="if(event.target===this) this.classList.remove('open')">
  <div class="modal">
    <h2>Bienvenue !</h2>
    <p>Ceci est une modale animée. Clique en dehors ou sur le bouton pour fermer.</p>
    <button onclick="document.getElementById('overlay').classList.remove('open')">Fermer</button>
  </div>
</div>
</body>
</html>`,

    // ============================================================
    // 17. QUIZ HTML 🎯
    // ============================================================
    quizHtml: `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Quiz HTML</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { display: flex; justify-content: center; align-items: center; min-height: 100vh; background: linear-gradient(135deg, #0B2545, #13315C); margin: 0; font-family: sans-serif; padding: 20px; }
  .quiz { background: white; border-radius: 20px; padding: 30px; max-width: 450px; width: 100%; box-shadow: 0 20px 50px rgba(0,0,0,0.3); }
  .progress { height: 6px; background: #eee; border-radius: 3px; margin-bottom: 20px; overflow: hidden; }
  .progress-bar { height: 100%; background: linear-gradient(90deg, #0B2545, #D4AF37); transition: width 0.4s; width: 0; }
  .question-num { color: #888; font-size: 0.8rem; margin-bottom: 10px; }
  h2 { color: #0B2545; font-size: 1.1rem; margin-bottom: 20px; line-height: 1.4; }
  .choix { display: flex; flex-direction: column; gap: 10px; }
  .choix button { padding: 14px; background: #f5f5f5; border: 2px solid #eee; border-radius: 10px; text-align: left; cursor: pointer; font-size: 0.9rem; transition: all 0.2s; }
  .choix button:hover { background: #f0f0f0; border-color: #D4AF37; }
  .choix button.correct { background: #34A853; color: white; border-color: #34A853; }
  .choix button.wrong { background: #EA4335; color: white; border-color: #EA4335; }
  .choix button:disabled { cursor: not-allowed; }
  .feedback { margin-top: 15px; padding: 12px; border-radius: 8px; font-weight: bold; text-align: center; display: none; }
  .feedback.ok { background: #d4f4dd; color: #1a7d34; display: block; }
  .feedback.ko { background: #ffe0e0; color: #c42e2e; display: block; }
  .result { text-align: center; display: none; }
  .result h2 { font-size: 1.5rem; }
  .result .score { font-size: 3rem; color: #D4AF37; margin: 15px 0; }
  .result button { padding: 12px 30px; background: #0B2545; color: white; border: none; border-radius: 10px; font-weight: bold; cursor: pointer; margin-top: 20px; }
</style>
</head>
<body>
<div class="quiz">
  <div class="progress"><div class="progress-bar" id="bar"></div></div>
  <div id="questionBox">
    <div class="question-num" id="num">Question 1/5</div>
    <h2 id="question">Chargement...</h2>
    <div class="choix" id="choix"></div>
    <div class="feedback" id="feedback"></div>
  </div>
  <div class="result" id="result">
    <h2>Quiz terminé !</h2>
    <div class="score" id="score">0/5</div>
    <p id="commentaire"></p>
    <button onclick="recommencer()">Recommencer</button>
  </div>
</div>
<script>
  const questions = [
    { q: "Que signifie HTML ?", c: ["HyperText Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyperlink Text Machine Language"], r: 0 },
    { q: "Quelle balise crée un paragraphe ?", c: ["&lt;div&gt;", "&lt;p&gt;", "&lt;span&gt;", "&lt;para&gt;"], r: 1 },
    { q: "Quelle balise crée un lien ?", c: ["&lt;link&gt;", "&lt;a&gt;", "&lt;href&gt;", "&lt;url&gt;"], r: 1 },
    { q: "Quelle balise affiche une image ?", c: ["&lt;picture&gt;", "&lt;img&gt;", "&lt;image&gt;", "&lt;src&gt;"], r: 1 },
    { q: "Comment écrire un commentaire en HTML ?", c: ["// commentaire", "# commentaire", "&lt;!-- commentaire --&gt;", "/* commentaire */"], r: 2 }
  ];
  let current = 0, score = 0;

  function afficher() {
    const box = document.getElementById('questionBox');
    if (current >= questions.length) { finQuiz(); return; }
    const q = questions[current];
    document.getElementById('num').textContent = 'Question ' + (current + 1) + '/' + questions.length;
    document.getElementById('question').innerHTML = q.q;
    document.getElementById('bar').style.width = ((current / questions.length) * 100) + '%';
    const choixDiv = document.getElementById('choix');
    choixDiv.innerHTML = '';
    q.c.forEach((choix, i) => {
      const btn = document.createElement('button');
      btn.innerHTML = choix;
      btn.onclick = () => repondre(i);
      choixDiv.appendChild(btn);
    });
    document.getElementById('feedback').className = 'feedback';
    document.getElementById('feedback').style.display = 'none';
  }

  function repondre(i) {
    const q = questions[current];
    const btns = document.querySelectorAll('#choix button');
    btns.forEach((b, j) => {
      b.disabled = true;
      if (j === q.r) b.classList.add('correct');
      else if (j === i) b.classList.add('wrong');
    });
    const fb = document.getElementById('feedback');
    if (i === q.r) {
      score++;
      fb.textContent = '✅ Bonne réponse !';
      fb.className = 'feedback ok';
    } else {
      fb.textContent = '❌ Mauvaise réponse. La bonne était : ' + q.c[q.r];
      fb.className = 'feedback ko';
    }
    setTimeout(() => { current++; afficher(); }, 1800);
  }

  function finQuiz() {
    document.getElementById('questionBox').style.display = 'none';
    document.getElementById('result').style.display = 'block';
    document.getElementById('bar').style.width = '100%';
    document.getElementById('score').textContent = score + '/' + questions.length;
    const com = document.getElementById('commentaire');
    if (score === questions.length) com.textContent = '🎉 Parfait ! Tu es un pro du HTML !';
    else if (score >= 3) com.textContent = '👍 Pas mal ! Continue comme ça.';
    else com.textContent = '💪 Retente ta chance, tu vas y arriver !';
  }

  function recommencer() {
    current = 0; score = 0;
    document.getElementById('questionBox').style.display = 'block';
    document.getElementById('result').style.display = 'none';
    afficher();
  }

  afficher();
<\/script>
</body>
</html>`,

    // ============================================================
    // 18. QUIZ CSS 🎯
    // ============================================================
    quizCss: `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Quiz CSS</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { display: flex; justify-content: center; align-items: center; min-height: 100vh; background: linear-gradient(135deg, #D4AF37, #F6D58E); margin: 0; font-family: sans-serif; padding: 20px; }
  .quiz { background: white; border-radius: 20px; padding: 30px; max-width: 450px; width: 100%; box-shadow: 0 20px 50px rgba(0,0,0,0.3); }
  .progress { height: 6px; background: #eee; border-radius: 3px; margin-bottom: 20px; overflow: hidden; }
  .progress-bar { height: 100%; background: linear-gradient(90deg, #D4AF37, #0B2545); transition: width 0.4s; width: 0; }
  .question-num { color: #888; font-size: 0.8rem; margin-bottom: 10px; }
  h2 { color: #0B2545; font-size: 1.1rem; margin-bottom: 20px; line-height: 1.4; }
  .choix { display: flex; flex-direction: column; gap: 10px; }
  .choix button { padding: 14px; background: #f5f5f5; border: 2px solid #eee; border-radius: 10px; text-align: left; cursor: pointer; font-size: 0.9rem; transition: all 0.2s; }
  .choix button:hover { background: #f0f0f0; border-color: #D4AF37; }
  .choix button.correct { background: #34A853; color: white; border-color: #34A853; }
  .choix button.wrong { background: #EA4335; color: white; border-color: #EA4335; }
  .feedback { margin-top: 15px; padding: 12px; border-radius: 8px; font-weight: bold; text-align: center; display: none; }
  .feedback.ok { background: #d4f4dd; color: #1a7d34; display: block; }
  .feedback.ko { background: #ffe0e0; color: #c42e2e; display: block; }
  .result { text-align: center; display: none; }
  .result .score { font-size: 3rem; color: #D4AF37; margin: 15px 0; }
  .result button { padding: 12px 30px; background: #0B2545; color: white; border: none; border-radius: 10px; font-weight: bold; cursor: pointer; margin-top: 20px; }
</style>
</head>
<body>
<div class="quiz">
  <div class="progress"><div class="progress-bar" id="bar"></div></div>
  <div id="questionBox">
    <div class="question-num" id="num">Question 1/5</div>
    <h2 id="question">Chargement...</h2>
    <div class="choix" id="choix"></div>
    <div class="feedback" id="feedback"></div>
  </div>
  <div class="result" id="result">
    <h2>Quiz terminé !</h2>
    <div class="score" id="score">0/5</div>
    <p id="commentaire"></p>
    <button onclick="recommencer()">Recommencer</button>
  </div>
</div>
<script>
  const questions = [
    { q: "Que signifie CSS ?", c: ["Cascading Style Sheets", "Computer Style System", "Creative Style Sheets", "Colorful Style Setup"], r: 0 },
    { q: "Quelle propriété change la couleur du texte ?", c: ["background", "font-color", "color", "text-color"], r: 2 },
    { q: "Comment centrer un texte horizontalement ?", c: ["align: center", "text-align: center", "center: true", "justify: center"], r: 1 },
    { q: "Quelle unité est relative à la taille de l'écran ?", c: ["px", "cm", "vw", "pt"], r: 2 },
    { q: "Quelle propriété arrondit les coins ?", c: ["border-radius", "corner-round", "round-border", "border-style"], r: 0 }
  ];
  let current = 0, score = 0;
  function afficher() {
    if (current >= questions.length) { finQuiz(); return; }
    const q = questions[current];
    document.getElementById('num').textContent = 'Question ' + (current + 1) + '/' + questions.length;
    document.getElementById('question').innerHTML = q.q;
    document.getElementById('bar').style.width = ((current / questions.length) * 100) + '%';
    const choixDiv = document.getElementById('choix');
    choixDiv.innerHTML = '';
    q.c.forEach((choix, i) => {
      const btn = document.createElement('button');
      btn.textContent = choix;
      btn.onclick = () => repondre(i);
      choixDiv.appendChild(btn);
    });
    document.getElementById('feedback').style.display = 'none';
  }
  function repondre(i) {
    const q = questions[current];
    const btns = document.querySelectorAll('#choix button');
    btns.forEach((b, j) => {
      b.disabled = true;
      if (j === q.r) b.classList.add('correct');
      else if (j === i) b.classList.add('wrong');
    });
    const fb = document.getElementById('feedback');
    if (i === q.r) { score++; fb.textContent = '✅ Bonne réponse !'; fb.className = 'feedback ok'; }
    else { fb.textContent = '❌ Mauvaise réponse. La bonne était : ' + q.c[q.r]; fb.className = 'feedback ko'; }
    setTimeout(() => { current++; afficher(); }, 1800);
  }
  function finQuiz() {
    document.getElementById('questionBox').style.display = 'none';
    document.getElementById('result').style.display = 'block';
    document.getElementById('bar').style.width = '100%';
    document.getElementById('score').textContent = score + '/' + questions.length;
    const com = document.getElementById('commentaire');
    if (score === questions.length) com.textContent = '🎉 Parfait ! CSS maîtrisé !';
    else if (score >= 3) com.textContent = '👍 Bien joué !';
    else com.textContent = '💪 Continue à apprendre !';
  }
  function recommencer() {
    current = 0; score = 0;
    document.getElementById('questionBox').style.display = 'block';
    document.getElementById('result').style.display = 'none';
    afficher();
  }
  afficher();
<\/script>
</body>
</html>`,

    // ============================================================
    // 19. QUIZ JAVASCRIPT 🎯
    // ============================================================
    quizJs: `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Quiz JavaScript</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { display: flex; justify-content: center; align-items: center; min-height: 100vh; background: linear-gradient(135deg, #F7DF1E, #F0C808); margin: 0; font-family: sans-serif; padding: 20px; }
  .quiz { background: white; border-radius: 20px; padding: 30px; max-width: 450px; width: 100%; box-shadow: 0 20px 50px rgba(0,0,0,0.3); }
  .progress { height: 6px; background: #eee; border-radius: 3px; margin-bottom: 20px; overflow: hidden; }
  .progress-bar { height: 100%; background: linear-gradient(90deg, #F7DF1E, #0B2545); transition: width 0.4s; width: 0; }
  .question-num { color: #888; font-size: 0.8rem; margin-bottom: 10px; }
  h2 { color: #0B2545; font-size: 1.1rem; margin-bottom: 20px; line-height: 1.4; }
  .choix { display: flex; flex-direction: column; gap: 10px; }
  .choix button { padding: 14px; background: #f5f5f5; border: 2px solid #eee; border-radius: 10px; text-align: left; cursor: pointer; font-size: 0.9rem; transition: all 0.2s; }
  .choix button:hover { background: #f0f0f0; border-color: #F7DF1E; }
  .choix button.correct { background: #34A853; color: white; border-color: #34A853; }
  .choix button.wrong { background: #EA4335; color: white; border-color: #EA4335; }
  .feedback { margin-top: 15px; padding: 12px; border-radius: 8px; font-weight: bold; text-align: center; display: none; }
  .feedback.ok { background: #d4f4dd; color: #1a7d34; display: block; }
  .feedback.ko { background: #ffe0e0; color: #c42e2e; display: block; }
  .result { text-align: center; display: none; }
  .result .score { font-size: 3rem; color: #F7DF1E; margin: 15px 0; text-shadow: 1px 1px 2px rgba(0,0,0,0.2); }
  .result button { padding: 12px 30px; background: #0B2545; color: white; border: none; border-radius: 10px; font-weight: bold; cursor: pointer; margin-top: 20px; }
</style>
</head>
<body>
<div class="quiz">
  <div class="progress"><div class="progress-bar" id="bar"></div></div>
  <div id="questionBox">
    <div class="question-num" id="num">Question 1/5</div>
    <h2 id="question">Chargement...</h2>
    <div class="choix" id="choix"></div>
    <div class="feedback" id="feedback"></div>
  </div>
  <div class="result" id="result">
    <h2>Quiz terminé !</h2>
    <div class="score" id="score">0/5</div>
    <p id="commentaire"></p>
    <button onclick="recommencer()">Recommencer</button>
  </div>
</div>
<script>
  const questions = [
    { q: "Quel mot-clé déclare une variable modifiable ?", c: ["const", "let", "var", "def"], r: 1 },
    { q: "Comment afficher dans la console ?", c: ["print()", "console.log()", "echo()", "log()"], r: 1 },
    { q: "Quelle est la syntaxe d'une fonction fléchée ?", c: ["function() {}", "() => {}", "func() {}", "fn() {}"], r: 1 },
    { q: "Que vaut 2 + '2' en JavaScript ?", c: ["4", "'22'", "NaN", "Erreur"], r: 1 },
    { q: "Quelle méthode ajoute à la fin d'un tableau ?", c: ["push()", "pop()", "shift()", "add()"], r: 0 }
  ];
  let current = 0, score = 0;
  function afficher() {
    if (current >= questions.length) { finQuiz(); return; }
    const q = questions[current];
    document.getElementById('num').textContent = 'Question ' + (current + 1) + '/' + questions.length;
    document.getElementById('question').innerHTML = q.q;
    document.getElementById('bar').style.width = ((current / questions.length) * 100) + '%';
    const choixDiv = document.getElementById('choix');
    choixDiv.innerHTML = '';
    q.c.forEach((choix, i) => {
      const btn = document.createElement('button');
      btn.textContent = choix;
      btn.onclick = () => repondre(i);
      choixDiv.appendChild(btn);
    });
    document.getElementById('feedback').style.display = 'none';
  }
  function repondre(i) {
    const q = questions[current];
    const btns = document.querySelectorAll('#choix button');
    btns.forEach((b, j) => {
      b.disabled = true;
      if (j === q.r) b.classList.add('correct');
      else if (j === i) b.classList.add('wrong');
    });
    const fb = document.getElementById('feedback');
    if (i === q.r) { score++; fb.textContent = '✅ Bonne réponse !'; fb.className = 'feedback ok'; }
    else { fb.textContent = '❌ Mauvaise réponse. La bonne était : ' + q.c[q.r]; fb.className = 'feedback ko'; }
    setTimeout(() => { current++; afficher(); }, 1800);
  }
  function finQuiz() {
    document.getElementById('questionBox').style.display = 'none';
    document.getElementById('result').style.display = 'block';
    document.getElementById('bar').style.width = '100%';
    document.getElementById('score').textContent = score + '/' + questions.length;
    const com = document.getElementById('commentaire');
    if (score === questions.length) com.textContent = '🎉 Parfait ! JS maîtrisé !';
    else if (score >= 3) com.textContent = '👍 Bien joué !';
    else com.textContent = '💪 Continue à coder !';
  }
  function recommencer() {
    current = 0; score = 0;
    document.getElementById('questionBox').style.display = 'block';
    document.getElementById('result').style.display = 'none';
    afficher();
  }
  afficher();
<\/script>
</body>
</html>`,

    // ============================================================
    // 20. QUIZ WEB GÉNÉRAL 🎯
    // ============================================================
    quizWeb: `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Quiz Web Général</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { display: flex; justify-content: center; align-items: center; min-height: 100vh; background: linear-gradient(135deg, #667eea, #764ba2); margin: 0; font-family: sans-serif; padding: 20px; }
  .quiz { background: white; border-radius: 20px; padding: 30px; max-width: 450px; width: 100%; box-shadow: 0 20px 50px rgba(0,0,0,0.3); }
  .progress { height: 6px; background: #eee; border-radius: 3px; margin-bottom: 20px; overflow: hidden; }
  .progress-bar { height: 100%; background: linear-gradient(90deg, #667eea, #D4AF37); transition: width 0.4s; width: 0; }
  .question-num { color: #888; font-size: 0.8rem; margin-bottom: 10px; }
  h2 { color: #333; font-size: 1.1rem; margin-bottom: 20px; line-height: 1.4; }
  .choix { display: flex; flex-direction: column; gap: 10px; }
  .choix button { padding: 14px; background: #f5f5f5; border: 2px solid #eee; border-radius: 10px; text-align: left; cursor: pointer; font-size: 0.9rem; transition: all 0.2s; }
  .choix button:hover { background: #f0f0f0; border-color: #667eea; }
  .choix button.correct { background: #34A853; color: white; border-color: #34A853; }
  .choix button.wrong { background: #EA4335; color: white; border-color: #EA4335; }
  .feedback { margin-top: 15px; padding: 12px; border-radius: 8px; font-weight: bold; text-align: center; display: none; }
  .feedback.ok { background: #d4f4dd; color: #1a7d34; display: block; }
  .feedback.ko { background: #ffe0e0; color: #c42e2e; display: block; }
  .result { text-align: center; display: none; }
  .result .score { font-size: 3rem; color: #667eea; margin: 15px 0; }
  .result button { padding: 12px 30px; background: #667eea; color: white; border: none; border-radius: 10px; font-weight: bold; cursor: pointer; margin-top: 20px; }
</style>
</head>
<body>
<div class="quiz">
  <div class="progress"><div class="progress-bar" id="bar"></div></div>
  <div id="questionBox">
    <div class="question-num" id="num">Question 1/5</div>
    <h2 id="question">Chargement...</h2>
    <div class="choix" id="choix"></div>
    <div class="feedback" id="feedback"></div>
  </div>
  <div class="result" id="result">
    <h2>Quiz terminé !</h2>
    <div class="score" id="score">0/5</div>
    <p id="commentaire"></p>
    <button onclick="recommencer()">Recommencer</button>
  </div>
</div>
<script>
  const questions = [
    { q: "Que signifie 'WWW' ?", c: ["World Wide Web", "Web Wide World", "Wide World Web", "World Web Wide"], r: 0 },
    { q: "Quel langage structure une page web ?", c: ["CSS", "JavaScript", "HTML", "Python"], r: 2 },
    { q: "Que fait un serveur web ?", c: ["Affiche les pages", "Stocke et envoie les pages", "Crée les designs", "Compile le code"], r: 1 },
    { q: "Qu'est-ce qu'une URL ?", c: ["Un langage", "Une adresse web", "Un protocole", "Un navigateur"], r: 1 },
    { q: "Quel navigateur est développé par Google ?", c: ["Firefox", "Safari", "Chrome", "Edge"], r: 2 }
  ];
  let current = 0, score = 0;
  function afficher() {
    if (current >= questions.length) { finQuiz(); return; }
    const q = questions[current];
    document.getElementById('num').textContent = 'Question ' + (current + 1) + '/' + questions.length;
    document.getElementById('question').innerHTML = q.q;
    document.getElementById('bar').style.width = ((current / questions.length) * 100) + '%';
    const choixDiv = document.getElementById('choix');
    choixDiv.innerHTML = '';
    q.c.forEach((choix, i) => {
      const btn = document.createElement('button');
      btn.textContent = choix;
      btn.onclick = () => repondre(i);
      choixDiv.appendChild(btn);
    });
    document.getElementById('feedback').style.display = 'none';
  }
  function repondre(i) {
    const q = questions[current];
    const btns = document.querySelectorAll('#choix button');
    btns.forEach((b, j) => {
      b.disabled = true;
      if (j === q.r) b.classList.add('correct');
      else if (j === i) b.classList.add('wrong');
    });
    const fb = document.getElementById('feedback');
    if (i === q.r) { score++; fb.textContent = '✅ Bonne réponse !'; fb.className = 'feedback ok'; }
    else { fb.textContent = '❌ Mauvaise réponse. La bonne était : ' + q.c[q.r]; fb.className = 'feedback ko'; }
    setTimeout(() => { current++; afficher(); }, 1800);
  }
  function finQuiz() {
    document.getElementById('questionBox').style.display = 'none';
    document.getElementById('result').style.display = 'block';
    document.getElementById('bar').style.width = '100%';
    document.getElementById('score').textContent = score + '/' + questions.length;
    const com = document.getElementById('commentaire');
    if (score === questions.length) com.textContent = '🎉 Parfait ! Tu connais bien le web !';
    else if (score >= 3) com.textContent = '👍 Bon score !';
    else com.textContent = '💪 Continue à explorer le web !';
  }
  function recommencer() {
    current = 0; score = 0;
    document.getElementById('questionBox').style.display = 'block';
    document.getElementById('result').style.display = 'none';
    afficher();
  }
  afficher();
<\/script>
</body>
</html>`

};