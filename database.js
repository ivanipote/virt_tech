const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// 1. Configuration de la connexion
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// 2. Fonction pour créer la table si elle n'existe pas
async function initDB() {
    try {
        // On lit le contenu de schema.sql
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        
        // On l'exécute sur la base de données
        await pool.query(schema);
        
        console.log("✅ Base de données initialisée. Table 'links' prête.");
    } catch (err) {
        console.error("❌ Erreur d'initialisation de la base de données :", err);
    }
}

module.exports = { pool, initDB };