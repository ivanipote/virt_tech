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