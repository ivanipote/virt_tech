// --- appareilService.js : détection de l'appareil depuis le User-Agent ---

function detecter(userAgent, entetes = {}) {
    const ua = String(userAgent || "");
    const bas = ua.toLowerCase();

    // 1. Type d'appareil
    let type = "ordinateur";
    if (/bot|crawler|spider|crawl|facebookexternalhit|slurp|bingpreview/.test(bas)) {
        type = "bot";
    } else if (/ipad|tablet|playbook|silk|kindle/.test(bas)) {
        type = "tablette";
    } else if (/android/.test(bas) && !/mobile/.test(bas)) {
        type = "tablette";
    } else if (/mobi|iphone|ipod|android|blackberry|opera mini|iemobile/.test(bas)) {
        type = "mobile";
    }

    // 2. Marque
    const marques = [
        [/iphone|ipad|ipod|macintosh|mac os x/, "Apple"],
        [/samsung|sm-[a-z]\d|gt-[a-z]\d/, "Samsung"],
        [/tecno/, "Tecno"],
        [/infinix/, "Infinix"],
        [/itel/, "Itel"],
        [/redmi|poco|xiaomi/, "Xiaomi"],
        [/huawei|honor/, "Huawei"],
        [/oppo/, "Oppo"],
        [/vivo/, "Vivo"],
        [/oneplus/, "OnePlus"],
        [/pixel/, "Google"],
        [/nokia/, "Nokia"],
        [/windows/, "PC"]
    ];

    let marque = "";
    for (const [motif, nom] of marques) {
        if (motif.test(bas)) { marque = nom; break; }
    }

    // 3. Modèle (série) — souvent présent sur Android : "SM-A125F Build/..."
    let modele = "";

    const modeleAndroid = ua.match(/Android[^;)]*;\s*([^;)]+?)(?:\s+Build\/|\))/i);
    if (modeleAndroid) {
        const brut = modeleAndroid[1].trim();
        if (brut.length <= 60 && !/^(wv|mobile|linux|android|k)$/i.test(brut)) {
            modele = brut;
        }
    }

    if (!modele && /iphone/i.test(ua)) modele = "iPhone";
    if (!modele && /ipad/i.test(ua)) modele = "iPad";

    // Client Hints (Chrome / Android) : plus précis quand disponible
    if (!modele && entetes["sec-ch-ua-model"]) {
        modele = String(entetes["sec-ch-ua-model"]).replace(/"/g, "");
    }
    if (!marque && entetes["sec-ch-ua-platform"]) {
        marque = String(entetes["sec-ch-ua-platform"]).replace(/"/g, "");
    }

    // 4. Système
    let os = "";
    let m;

    if ((m = ua.match(/Android\s+([\d.]+)/i))) os = "Android " + m[1];
    else if ((m = ua.match(/iPhone OS\s+([\d_]+)/i))) os = "iOS " + m[1].replace(/_/g, ".");
    else if ((m = ua.match(/iPad; CPU OS\s+([\d_]+)/i))) os = "iPadOS " + m[1].replace(/_/g, ".");
    else if (/Windows NT 10/.test(ua)) os = "Windows 10/11";
    else if ((m = ua.match(/Mac OS X\s+([\d_.]+)/i))) os = "macOS " + m[1].replace(/_/g, ".");
    else if (/Linux/.test(ua)) os = "Linux";

    // 5. Navigateur
    let navigateur = "";
    if (/Edg\//.test(ua)) navigateur = "Edge";
    else if (/OPR\/|Opera/.test(ua)) navigateur = "Opera";
    else if (/SamsungBrowser/.test(ua)) navigateur = "Samsung Internet";
    else if (/Firefox\//.test(ua)) navigateur = "Firefox";
    else if (/Chrome\//.test(ua)) navigateur = "Chrome";
    else if (/Safari\//.test(ua)) navigateur = "Safari";

    return { type, marque, modele, os, navigateur };
}

module.exports = { detecter };
