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
    name TEXT NOT NULL,
    skill_level TEXT NOT NULL,
    playing_style TEXT NOT NULL,
    availability TEXT NOT NULL,
    wins INTEGER NOT NULL DEFAULT 0 CHECK (wins >= 0),
    losses INTEGER NOT NULL DEFAULT 0 CHECK (losses >= 0),
    points INTEGER NOT NULL DEFAULT 0 CHECK (points >= 0)
);