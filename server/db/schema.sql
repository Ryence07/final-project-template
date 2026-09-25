CREATE TABLE IF NOT EXISTS paddles (
    id SERIAL PRIMARY KEY,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    price INTEGER NOT NULL CHECK (price >= 0),
    description TEXT NOT NULL DEFAULT '',
    weight TEXT NOT NULL,
    shape TEXT NOT NULL,
    power TEXT NOT NULL,
    control TEXT NOT NULL,
    spin TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS paddle_recommendations (
    paddle_id INTEGER NOT NULL REFERENCES paddles(id) ON DELETE CASCADE,
    skill_level TEXT NOT NULL,
    PRIMARY KEY (paddle_id, skill_level)
);

CREATE TABLE IF NOT EXISTS paddle_styles (
    paddle_id INTEGER NOT NULL REFERENCES paddles(id) ON DELETE CASCADE,
    style TEXT NOT NULL,
    PRIMARY KEY (paddle_id, style)
);

CREATE TABLE IF NOT EXISTS players (
    id SERIAL PRIMARY KEY,

    username TEXT UNIQUE,
    password_hash TEXT,

    name TEXT NOT NULL,
    skill_level TEXT NOT NULL,
    playing_style TEXT NOT NULL,
    availability TEXT NOT NULL,

    wins INTEGER NOT NULL DEFAULT 0 CHECK (wins >= 0),
    losses INTEGER NOT NULL DEFAULT 0 CHECK (losses >= 0),
    points INTEGER NOT NULL DEFAULT 0 CHECK (points >= 0)
);

CREATE TABLE IF NOT EXISTS matches (
    id SERIAL PRIMARY KEY,

    requester_id INTEGER NOT NULL
        REFERENCES players(id)
        ON DELETE CASCADE,

    opponent_id INTEGER NOT NULL
        REFERENCES players(id)
        ON DELETE CASCADE,

    status TEXT NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'accepted', 'completed')),

    winner_id INTEGER
        REFERENCES players(id)
        ON DELETE SET NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sessions (
    id SERIAL PRIMARY KEY,

    player_id INTEGER NOT NULL
        REFERENCES players(id)
        ON DELETE CASCADE,

    token_hash TEXT UNIQUE NOT NULL,

    expires_at TIMESTAMP NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_sessions_token_hash
ON sessions(token_hash);

CREATE INDEX IF NOT EXISTS idx_matches_requester
ON matches(requester_id);

CREATE INDEX IF NOT EXISTS idx_matches_opponent
ON matches(opponent_id);