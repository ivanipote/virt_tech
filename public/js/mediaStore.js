// --- mediaStore.js ---
// Stockage des images/vidéos du projet dans IndexedDB
// (localStorage est limité à ~5 Mo, IndexedDB monte à plusieurs centaines de Mo).

(function () {
    'use strict';

    if (window.MediaStore) return;

    const NOM_DB = 'virtemulator-media';
    const VERSION = 1;
    const STORE = 'fichiers';

    let dbPromise = null;

    function ouvrir() {
        if (dbPromise) return dbPromise;

        dbPromise = new Promise(function (resolve, reject) {
            if (!('indexedDB' in window)) {
                reject(new Error('IndexedDB indisponible'));
                return;
            }

            const requete = indexedDB.open(NOM_DB, VERSION);

            requete.onupgradeneeded = function () {
                const db = requete.result;
                if (!db.objectStoreNames.contains(STORE)) {
                    db.createObjectStore(STORE);
                }
            };

            requete.onsuccess = function () { resolve(requete.result); };
            requete.onerror = function () { reject(requete.error); };
        });

        return dbPromise;
    }

    function avecStore(mode, action) {
        return ouvrir().then(function (db) {
            return new Promise(function (resolve, reject) {
                const tx = db.transaction(STORE, mode);
                const store = tx.objectStore(STORE);
                let resultat;

                action(store, function (valeur) { resultat = valeur; });

                tx.oncomplete = function () { resolve(resultat); };
                tx.onerror = function () { reject(tx.error); };
                tx.onabort = function () { reject(tx.error); };
            });
        });
    }

    function enregistrer(chemin, blob) {
        return avecStore('readwrite', function (store) {
            store.put(blob, chemin);
        });
    }

    function supprimer(chemin) {
        return avecStore('readwrite', function (store) {
            store.delete(chemin);
        });
    }

    function lire(chemin) {
        return avecStore('readonly', function (store, set) {
            const req = store.get(chemin);
            req.onsuccess = function () { set(req.result || null); };
        });
    }

    function toutLire() {
        return ouvrir().then(function (db) {
            return new Promise(function (resolve, reject) {
                const tx = db.transaction(STORE, 'readonly');
                const store = tx.objectStore(STORE);
                const cles = store.getAllKeys();
                const valeurs = store.getAll();

                tx.oncomplete = function () {
                    const liste = [];
                    for (let i = 0; i < cles.result.length; i++) {
                        liste.push({ chemin: cles.result[i], blob: valeurs.result[i] });
                    }
                    resolve(liste);
                };
                tx.onerror = function () { reject(tx.error); };
            });
        });
    }

    function renommer(ancien, nouveau) {
        return lire(ancien).then(function (blob) {
            if (!blob) return null;
            return enregistrer(nouveau, blob).then(function () {
                return supprimer(ancien);
            });
        });
    }

    window.MediaStore = {
        enregistrer: enregistrer,
        supprimer: supprimer,
        lire: lire,
        toutLire: toutLire,
        renommer: renommer
    };
})();
