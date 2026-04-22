-- Initial Setup for Grimoire Vault

CREATE TABLE users (
    player_id VARCHAR(255) PRIMARY KEY,
    identifier VARCHAR(255) NOT NULL UNIQUE,
    user_tag VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP,
    last_login TIMESTAMP
);

CREATE TABLE characters (
    id VARCHAR(255) PRIMARY KEY,
    player_id VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    rpg_class VARCHAR(255),
    level INTEGER,
    xp INTEGER,
    hp_max INTEGER,
    hp_current INTEGER,
    ac INTEGER,
    attributes_json TEXT,
    equipment_json TEXT,
    CONSTRAINT fk_user_char FOREIGN KEY (player_id) REFERENCES users(player_id)
);

CREATE TABLE session_entity (
    id VARCHAR(255) PRIMARY KEY,
    master_id VARCHAR(255)
);

CREATE TABLE session_entity_logs (
    session_entity_id VARCHAR(255) NOT NULL,
    logs VARCHAR(1000),
    CONSTRAINT fk_session_logs FOREIGN KEY (session_entity_id) REFERENCES session_entity(id)
);

CREATE TABLE session_entity_players (
    session_entity_id VARCHAR(255) NOT NULL,
    players VARCHAR(255),
    CONSTRAINT fk_session_players FOREIGN KEY (session_entity_id) REFERENCES session_entity(id)
);
