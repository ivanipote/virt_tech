-- Table pour stocker les liens raccourcis
CREATE TABLE IF NOT EXISTS links (
    id SERIAL PRIMARY KEY,
    short_code VARCHAR(20) UNIQUE NOT NULL,
    original_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table pour les histoires de la Journée de la Paix
CREATE TABLE IF NOT EXISTS histoires (
    id SERIAL PRIMARY KEY,
    contenu TEXT NOT NULL,
    device_id VARCHAR(255) NOT NULL, 
    auteur VARCHAR(100) DEFAULT 'Anonyme',
    likes INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table pour empêcher un même appareil de liker deux fois
CREATE TABLE IF NOT EXISTS likes_histoires (
    id SERIAL PRIMARY KEY,
    histoire_id INTEGER REFERENCES histoires(id) ON DELETE CASCADE,
    device_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(histoire_id, device_id)
);

-- =====================================================================
-- ASTUCES VIRTTECH (version riche)
-- =====================================================================
-- ⚠️ À exécuter UNE SEULE FOIS pour supprimer l'ancienne table, puis
-- remets la ligne en commentaire (sinon elle effacerait tes astuces
-- à chaque redémarrage si ce fichier est rejoué au lancement du serveur) :
--
-- DROP TABLE IF EXISTS astuces CASCADE;
-- =====================================================================

-- Table principale des astuces
CREATE TABLE IF NOT EXISTS astuces (
    id SERIAL PRIMARY KEY,
    auteur VARCHAR(50) NOT NULL,
    titre VARCHAR(120) NOT NULL,
    contenu TEXT NOT NULL,                       -- Explication de l'astuce
    langage VARCHAR(30) NOT NULL DEFAULT 'Autre',
    niveau VARCHAR(20) NOT NULL DEFAULT 'Débutant',
    code TEXT,                                   -- Code optionnel
    likes INTEGER NOT NULL DEFAULT 0,            -- Compteur (mis à jour via astuces_likes)
    vues INTEGER NOT NULL DEFAULT 0,             -- Compteur (mis à jour via astuces_vues)
    owner_token VARCHAR(255) NOT NULL,           -- Jeton privé du propriétaire (ne JAMAIS l'envoyer au client)
    date_creation TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP,                 -- Rempli quand l'auteur modifie son astuce

    CONSTRAINT astuces_auteur_len   CHECK (char_length(trim(auteur)) BETWEEN 2 AND 50),
    CONSTRAINT astuces_titre_len    CHECK (char_length(trim(titre)) BETWEEN 3 AND 120),
    CONSTRAINT astuces_contenu_len  CHECK (char_length(trim(contenu)) BETWEEN 5 AND 2000),
    CONSTRAINT astuces_code_len     CHECK (code IS NULL OR char_length(code) <= 10000),
    CONSTRAINT astuces_likes_pos    CHECK (likes >= 0),
    CONSTRAINT astuces_vues_pos     CHECK (vues >= 0),
    CONSTRAINT astuces_langage_ok   CHECK (langage IN (
        'HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Node.js',
        'Python', 'PHP', 'SQL', 'Bash', 'Autre'
    )),
    CONSTRAINT astuces_niveau_ok    CHECK (niveau IN ('Débutant', 'Intermédiaire', 'Avancé'))
);

-- Un appareil ne peut liker une astuce qu'une seule fois (anti-triche côté serveur)
CREATE TABLE IF NOT EXISTS astuces_likes (
    id SERIAL PRIMARY KEY,
    astuce_id INTEGER NOT NULL REFERENCES astuces(id) ON DELETE CASCADE,
    visiteur_token VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (astuce_id, visiteur_token)
);

-- Un appareil ne compte qu'une seule vue par astuce (anti-triche côté serveur)
CREATE TABLE IF NOT EXISTS astuces_vues (
    id SERIAL PRIMARY KEY,
    astuce_id INTEGER NOT NULL REFERENCES astuces(id) ON DELETE CASCADE,
    visiteur_token VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (astuce_id, visiteur_token)
);

-- Index pour les filtres, le tri et "Mes astuces"
CREATE INDEX IF NOT EXISTS idx_astuces_date      ON astuces (date_creation DESC);
CREATE INDEX IF NOT EXISTS idx_astuces_likes     ON astuces (likes DESC);
CREATE INDEX IF NOT EXISTS idx_astuces_vues      ON astuces (vues DESC);
CREATE INDEX IF NOT EXISTS idx_astuces_langage   ON astuces (langage);
CREATE INDEX IF NOT EXISTS idx_astuces_niveau    ON astuces (niveau);
CREATE INDEX IF NOT EXISTS idx_astuces_owner     ON astuces (owner_token);
CREATE INDEX IF NOT EXISTS idx_astuces_likes_tok ON astuces_likes (visiteur_token);
CREATE INDEX IF NOT EXISTS idx_astuces_vues_tok  ON astuces_vues (visiteur_token);

-- =====================================================================
-- COMPTEUR DE « RUN » (page Historique)
-- =====================================================================
-- Une ligne par activité (virtdev, arborescence, erreurs, corriger, balises).
-- Incrémenté à chaque clic sur le bouton Run.
CREATE TABLE IF NOT EXISTS activites_clics (
    slug VARCHAR(40) PRIMARY KEY,
    clics INTEGER NOT NULL DEFAULT 0,
    derniere_maj TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT activites_clics_positif CHECK (clics >= 0)
);

-- =====================================================================
-- IA : un enregistrement par échange (analyse + avis) — 90 jours
-- =====================================================================
CREATE TABLE IF NOT EXISTS ia_echanges (
    id SERIAL PRIMARY KEY,
    conversation_id VARCHAR(64),
    question TEXT NOT NULL,
    reponse TEXT NOT NULL,
    modele VARCHAR(40),
    tokens_entree INTEGER,
    tokens_sortie INTEGER,
    latence_ms INTEGER,
    appareil_type VARCHAR(20),
    appareil_marque VARCHAR(40),
    appareil_modele VARCHAR(80),
    os VARCHAR(40),
    navigateur VARCHAR(40),
    langue VARCHAR(20),
    ip_hash CHAR(64),
    note SMALLINT NOT NULL DEFAULT 0,
    cree_le TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    note_le TIMESTAMP,

    CONSTRAINT ia_echanges_note_ok CHECK (note IN (-1, 0, 1))
);

CREATE INDEX IF NOT EXISTS idx_ia_echanges_date ON ia_echanges (cree_le DESC);
CREATE INDEX IF NOT EXISTS idx_ia_echanges_note ON ia_echanges (note);
CREATE INDEX IF NOT EXISTS idx_ia_echanges_marque ON ia_echanges (appareil_marque);
-- =====================================================================
-- COURS « Cours De Base » (éditables depuis l'administration)
-- =====================================================================
CREATE TABLE IF NOT EXISTS cours (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(80) NOT NULL UNIQUE,
    titre VARCHAR(160) NOT NULL,
    contenu TEXT NOT NULL,
    ordre INTEGER NOT NULL DEFAULT 0,
    visible BOOLEAN NOT NULL DEFAULT TRUE,
    date_creation TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_cours_ordre ON cours (ordre ASC, id ASC);

-- Nombre de vues par cours
ALTER TABLE cours ADD COLUMN IF NOT EXISTS vues INTEGER NOT NULL DEFAULT 0;
