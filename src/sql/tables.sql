-- 1. Users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE users
ADD COLUMN is_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN verification_token TEXT,
ADD COLUMN verification_token_expires TIMESTAMP

ALTER TABLE users
    DROP COLUMN is_verified,
    DROP COLUMN verification_token,
    DROP COLUMN verification_token_expires

ALTER TABLE users
ADD COLUMN country VARCHAR(100) NOT NULL DEFAULT 'Unknown';

-- 2. Refresh Tokens
CREATE TABLE refresh_tokens (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    revoked_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_refresh_tokens_user_Id ON refresh_tokens(user_id);

-- 3. Countries
CREATE TABLE countries (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 4. Game Modes

CREATE TYPE game_mode_enum AS ENUM ('adventure', 'challenge');
CREATE TABLE game_modes (
    id SERIAL PRIMARY KEY,
    mode_key game_mode_enum UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 5. Scores / Progress
CREATE TABLE scores (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    mode_id INT NOT NULL REFERENCES game_modes(id) ON DELETE CASCADE,
    score INT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, mode_id)
);