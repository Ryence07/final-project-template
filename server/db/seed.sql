TRUNCATE TABLE
    sessions,
    matches,
    paddle_recommendations,
    paddle_styles,
    paddles,
    players
RESTART IDENTITY CASCADE;


-- =========================
-- PADDLES
-- =========================

INSERT INTO paddles (
    brand,
    model,
    price,
    description,
    weight,
    shape,
    power,
    control,
    spin
) VALUES

(
    'Selkirk',
    'SLK Evo Control',
    4999,
    'A balanced paddle designed for players who want more control.',
    '7.5–8.0 oz',
    'Widebody',
    'Medium',
    'High',
    'High'
),

(
    'JOOLA',
    'Essentials',
    3999,
    'A beginner-friendly paddle with a comfortable feel and balanced performance.',
    '7.8 oz',
    'Standard',
    'Medium',
    'Medium',
    'Medium'
),

(
    'Franklin',
    'Signature',
    2999,
    'An affordable option for recreational pickleball players.',
    '7.6 oz',
    'Standard',
    'Medium',
    'Medium',
    'Medium'
),

(
    'Selkirk',
    'SLK Halo Power',
    5999,
    'A power-focused paddle for players who want stronger shots.',
    '7.8–8.2 oz',
    'Standard',
    'High',
    'Medium',
    'High'
),

(
    'JOOLA',
    'Ben Johns Hyperion',
    6999,
    'A performance-oriented paddle offering a balance of power and control.',
    '8.0 oz',
    'Elongated',
    'High',
    'High',
    'High'
);


-- =========================
-- PADDLE RECOMMENDATIONS
-- =========================

INSERT INTO paddle_recommendations (paddle_id, skill_level) VALUES
(1, 'Beginner'),
(1, 'Recreational'),
(2, 'Beginner'),
(2, 'Recreational'),
(3, 'Beginner'),
(3, 'Recreational'),
(4, 'Recreational'),
(4, 'Intermediate'),
(5, 'Intermediate');


-- =========================
-- PADDLE STYLES
-- =========================

INSERT INTO paddle_styles (paddle_id, style) VALUES
(1, 'Control'),
(1, 'Balanced'),
(2, 'Balanced'),
(2, 'Control'),
(3, 'Balanced'),
(4, 'Power'),
(4, 'Balanced'),
(5, 'Power'),
(5, 'Balanced'),
(5, 'Control');


-- =========================
-- PLAYERS / ACCOUNTS
-- =========================

INSERT INTO players (
    username,
    password_hash,
    name,
    skill_level,
    playing_style,
    availability,
    wins,
    losses,
    points
) VALUES

(
    'alucard',
    'a4c0b5b58936ff409699997c466a7015:6a0682c0c74fc88ea2208e3d646c501751964794b30730a54bb93cddd855953bf806fc22e2d9e027a575ad3caf8702324f0c03d1eefdc6d84e810f8a302348bd',
    'Alucard Reyes',
    'Beginner',
    'Control',
    'Weekends',
    8,
    4,
    120
),

(
    'gusion',
    '830b0f9aa47835f4d6f3df735031efd0:48f5d1966d0239f841274471815a8dd22dda08b9877b5906e756b5948b1770f3b3915b7ba84e2c1eb838492554ab2da44b7bae6d328f9f643c83fb4ea331e120',
    'Gusion Navarro',
    'Recreational',
    'Balanced',
    'Weekday Evenings',
    15,
    7,
    185
),

(
    'granger',
    'baa2135a2dda4e3de8a72307fd12fb54:4f32e70ab0886fec4a9325a2498e03d6ba8f42de224f18c16e15cf6e164a876112d21212f3d65fa981076c7807142b7afde51c34d977208aa400c2d9a490838e',
    'Granger Santos',
    'Intermediate',
    'Power',
    'Weekends',
    21,
    6,
    240
),

(
    'julian',
    '338dd330bedfc8bc8b29977febb17986:aabe72090e1065b5674b71be1cbd1e0106bb2dd3e2eeb409ffb49bdcd6e83ded1f9c20cd7e296f618a3a8b54720b7e167fd0fe02a2ed5ce4756529a0aea45d88',
    'Julian Cruz',
    'Recreational',
    'Control',
    'Friday Evenings',
    12,
    8,
    160
),

(
    'xavier',
    '01bf268cb3b8bd106399a5bc2b4aa60d:4e7f5b5c6d76f752957549de780b784e5cefafca737b03f8d26025e6d15923ccab4dc7bcc769dd607445a29539392b5e4bb7240b01ea3909e2076cf5df72f71c',
    'Xavier Mendoza',
    'Beginner',
    'Balanced',
    'Saturday',
    6,
    5,
    100
);