TRUNCATE TABLE
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
  'A beginner-friendly paddle with a comfortable feel.',
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
-- PLAYERS
-- =========================

INSERT INTO players (
  name,
  skill_level,
  playing_style,
  availability,
  wins,
  losses,
  points
) VALUES
(
  'Alucard Reyes',
  'Beginner',
  'Control',
  'Weekends',
  8,
  4,
  120
),
(
  'Gusion Navarro',
  'Recreational',
  'Balanced',
  'Weekday Evenings',
  15,
  7,
  185
),
(
  'Granger Santos',
  'Intermediate',
  'Power',
  'Weekends',
  21,
  6,
  240
),
(
  'Julian Cruz',
  'Recreational',
  'Control',
  'Friday Evenings',
  12,
  8,
  160
),
(
  'Xavier Mendoza',
  'Beginner',
  'Balanced',
  'Saturday',
  6,
  5,
  100
);