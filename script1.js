const http = require("http");
const fs = require("fs");
const path = require("path");
const os = require("os");

const PORT = 3000;
const ROOT_DIR = path.resolve(process.cwd());
const PUBLIC_DIR = path.join(ROOT_DIR, "public");

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".htm": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mp3": "audio/mpeg",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".ttf": "font/ttf"
};

function getLocalIPs() {
  const interfaces = os.networkInterfaces();
  const ips = [];

  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name] || []) {
      if (net.family === "IPv4" && !net.internal) {
        ips.push(net.address);
      }
    }
  }

  return ips;
}

function isInsideRoot(targetPath) {
  const resolved = path.resolve(targetPath);
  return resolved === ROOT_DIR || resolved.startsWith(ROOT_DIR + path.sep);
}

function renderDirectoryListing(dirPath, urlPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  const items = entries
    .filter((entry) => !entry.name.startsWith("node_modules") && !entry.name.startsWith(".git"))
    .sort((a, b) => {
      if (a.isDirectory() && !b.isDirectory()) return -1;
      if (!a.isDirectory() && b.isDirectory()) return 1;
      return a.name.localeCompare(b.name);
    })
    .map((entry) => {
      const slash = urlPath.endsWith("/") ? "" : "/";
      const href = `${urlPath}${slash}${encodeURIComponent(entry.name)}${entry.isDirectory() ? "/" : ""}`;
      const label = entry.isDirectory() ? `${entry.name}/` : entry.name;
      return `<li><a href="${href}">${label}</a></li>`;
    })
    .join("");

  const parentLink =
    urlPath !== "/"
      ? `<li><a href="${path.posix.dirname(urlPath.replace(/\/$/, "") || "/")}">.. (Dossier parent)</a></li>`
      : "";

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Index - ${urlPath}</title>
  <style>
    body { font-family: system-ui, sans-serif; background: #0f172a; color: #f8fafc; padding: 24px; max-width: 720px; margin: 0 auto; }
    h1 { font-size: 1.3rem; color: #38bdf8; margin-bottom: 16px; }
    ul { list-style: none; padding: 0; }
    li { margin: 8px 0; }
    a { color: #e2e8f0; text-decoration: none; padding: 8px 12px; display: block; background: #1e293b; border-radius: 6px; }
    a:hover { background: #334155; color: #facc15; }
  </style>
</head>
<body>
  <h1>Fichiers du projet (${urlPath})</h1>
  <ul>${parentLink}${items || "<li>Aucun fichier trouvé</li>"}</ul>
</body>
</html>`;
}

function sendFile(filePath, reqUrl, res) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || "application/octet-stream";

  res.writeHead(200, {
    "Content-Type": contentType,
    "Cache-Control": "no-store"
  });

  const stream = fs.createReadStream(filePath);
  stream.on("error", () => {
    if (!res.headersSent) {
      res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    }
    res.end("Erreur de lecture du fichier");
  });
  stream.pipe(res);
  console.log(`[200] ${reqUrl} -> ${path.relative(ROOT_DIR, filePath)}`);
}

function resolveCandidate(baseDir, relPath) {
  if (!relPath) {
    const idx = path.join(baseDir, "index.html");
    if (fs.existsSync(idx) && fs.statSync(idx).isFile()) {
      return { type: "file", path: idx };
    }
    if (fs.existsSync(baseDir) && fs.statSync(baseDir).isDirectory()) {
      return { type: "dir", path: baseDir };
    }
    return null;
  }

  const direct = path.resolve(baseDir, relPath);
  if (!isInsideRoot(direct)) return { type: "forbidden" };

  if (fs.existsSync(direct)) {
    const stats = fs.statSync(direct);
    if (stats.isFile()) return { type: "file", path: direct };
    if (stats.isDirectory()) {
      const dirIndex = path.join(direct, "index.html");
      if (fs.existsSync(dirIndex) && fs.statSync(dirIndex).isFile()) {
        return { type: "file", path: dirIndex };
      }
      return { type: "dir", path: direct };
    }
  }

  if (!path.extname(relPath)) {
    const withHtml = `${direct}.html`;
    if (isInsideRoot(withHtml) && fs.existsSync(withHtml) && fs.statSync(withHtml).isFile()) {
      return { type: "file", path: withHtml };
    }
  }

  return null;
}

const server = http.createServer((req, res) => {
  const rawUrl = req.url || "/";
  const cleanUrl = rawUrl.split("?")[0];
  let decodedPath;

  try {
    decodedPath = decodeURIComponent(cleanUrl);
  } catch {
    res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Requête invalide");
    return;
  }

  const relativePath = decodedPath.replace(/^\/+/, "");
  const bases = [ROOT_DIR];
  if (fs.existsSync(PUBLIC_DIR) && fs.statSync(PUBLIC_DIR).isDirectory()) {
    bases.push(PUBLIC_DIR);
  }

  let fallbackDir = null;

  for (const base of bases) {
    const match = resolveCandidate(base, relativePath);
    if (!match) continue;

    if (match.type === "forbidden") {
      console.log(`[403] ${cleanUrl}`);
      res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Accès interdit");
      return;
    }

    if (match.type === "file") {
      sendFile(match.path, cleanUrl, res);
      return;
    }

    if (match.type === "dir" && !fallbackDir) {
      fallbackDir = match.path;
    }
  }

  if (fallbackDir) {
    const normalizedUrl = cleanUrl.startsWith("/") ? cleanUrl : `/${cleanUrl}`;
    const html = renderDirectoryListing(fallbackDir, normalizedUrl);
    res.writeHead(200, {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store"
    });
    res.end(html);
    console.log(`[200] ${cleanUrl} (liste dossier)`);
    return;
  }

  console.log(`[404] ${cleanUrl} (introuvable dans ${ROOT_DIR})`);
  res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("Fichier ou page introuvable (404)");
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`Erreur : Le port ${PORT} est déjà utilisé par un autre programme.`);
  } else {
    console.error("Erreur serveur :", err.message);
  }
  process.exit(1);
});

server.listen(PORT, "0.0.0.0", () => {
  const localUrl = `http://localhost:${PORT}`;
  const lanIPs = getLocalIPs();

  console.log("==================================================");
  console.log("  SERVEUR STATIQUE LOCAL ACTIF (PORT " + PORT + ")");
  console.log("==================================================");
  console.log(`Dossier : ${ROOT_DIR}`);
  console.log("");
  console.log(`1. Sur cet ordinateur : ${localUrl}`);

  if (lanIPs.length > 0) {
    console.log("2. Sur un autre appareil du même réseau :");
    lanIPs.forEach((ip) => {
      console.log(`   -> http://${ip}:${PORT}`);
    });
  } else {
    console.log("2. Sur un autre appareil du même réseau :");
    console.log("   -> Aucune adresse réseau détectée (vérifiez le Wi-Fi ou le partage de connexion)");
  }

  console.log("==================================================");
  console.log("Journal des requêtes (Ctrl + C pour arrêter) :");
});