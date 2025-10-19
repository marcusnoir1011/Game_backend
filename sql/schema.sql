CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    country VARCHAR(100) NOT NULL DEFAULT 'Unknown',
    coin INT DEFAULT 0,
    energy INT DEFAULT 0,
    profile_image_id INT REFERENCES profile_images(id),
    avatar_image_id INT REFERENCES avatar_images(id),
    background_image_id INT REFERENCES background_images(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE country (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10),
    capital VARCHAR(100),
    region VARCHAR(50),
    currency VARCHAR(50),
    flag_url TEXT,
    map_url TEXT,
    similar_flags TEXT[],
    popular_places TEXT[],
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE password_reset_token (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_id UUID NOT NULL  UNIQUE,
    token_hash TEXT NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS
idx_password_reset_token_id ON password_reset_tokens(token_id);
CREATE INDEX IF NOT EXISTS
idx_password_reset_user_id ON password_reset_tokens(user_id);

CREATE TABLE refresh_tokens (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL,
    -- token_id VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    revoked_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_refresh_tokens_user_Id ON refresh_tokens(user_id);

CREATE TABLE avatar_images (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    image_url TEXT NOT NULL,
    price INT DEFAULT 0,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE profile_images (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    image_url TEXT NOT NULL,
    price INT DEFAULT 0,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE background_images (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    image_url TEXT NOT NULL,
    price INT DEFAULT 0,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);


CREATE TABLE user_cosmetics (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    item_type VARCHAR(50) NOT NULL,
    item_id INI NOT NULL,
    UNIQUE(user_id, item_type, item_id)
);


-- FROM HERE IS the sql code that i dont know what to do but Ive run it once so may be in the database where we are deploying might need or somrthing

alter table users 
add column coin int default 0,
add column energy int default 10,
add column profile_image_id int,
add column avatar_image_id int,
add column background_image_id int,
add constraint fk_user_profile_image
	foreign key (profile_image)


    create table avatar_images (
	id serial primary key,
	name varchar(100),
	image_url text,
	price int default 0,
	is_default boolean default false,
	created_at timestamp default now(),
	updated_at timestamp default now()
);

create table profile_images (
	id serial primary key,
	name varchar(100),
	image_url text,
	price int default 0,
	is_default boolean default false,
	created_at timestamp default now(),
	updated_at timestamp default now()
);

create table background_images (
	id serial primary key,
	name varchar(100),
	image_url text,
	price int default 0,
	is_default boolean default false,
	created_at timestamp default now(),
	updated_at timestamp default now()
);

INSERT INTO profile_images (name, image_url, is_default)
VALUES ('Default Profile', 'https://example.com/default-profile.png', TRUE);

INSERT INTO avatar_images (name, image_url, is_default)
VALUES ('Default Avatar', 'https://example.com/default-avatar.png', TRUE);

INSERT INTO background_images (name, image_url, is_default)
VALUES ('Default Background', 'https://example.com/default-background.png', TRUE);