
CREATE TABLE IF NOT EXISTS people (
  id SERIAL PRIMARY KEY,
  first_name   TEXT NOT NULL,
  last_name    TEXT NOT NULL,
  email        TEXT UNIQUE NOT NULL,
  role         TEXT,
  badge_id     TEXT UNIQUE NOT NULL,
  last_entry   TIMESTAMP,
  last_update  TIMESTAMP DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS doors (
   id BIGSERIAL PRIMARY KEY,
   door_id VARCHAR(50) NOT NULL UNIQUE,
   name VARCHAR(100) NOT NULL,
   location VARCHAR(255),
   active BOOLEAN NOT NULL DEFAULT true
);
INSERT INTO people (first_name, last_name, email, role, badge_id, last_entry, last_update)
VALUES
  ('Seulgi',    'Shin',      'seulgi.shin@etu.episen.fr',         'Student',   'A32F92', NOW() - INTERVAL '2 hours',  NOW() - INTERVAL '1 hours'),
  ('Nawel', 'Ghazal',   'nawel.ghazal@etu.episen.fr',    'Student', 'B47E12', NOW() - INTERVAL '1 day',   NOW() - INTERVAL '12 hours'),
  ('Michel',     'Eloka',     'michel.eloka@etu.episen.fr',         'Student',   'C98Z20', NOW() - INTERVAL '5 hours', NOW() - INTERVAL '3 hours'),
  ('Nawres',     'Haj Abouda',   'nawres.haj-abouda@etu.episen.fr',   'Student', 'D11X43', NOW() - INTERVAL '3 days',  NOW() - INTERVAL '1 days'),
  ('Gaby',      'Njonou',   'gaby.njonou@etu.episen.fr',        'Student',   'E76Y88', NOW() - INTERVAL '4 hours', NOW() - INTERVAL '2 hours'),

  ('Emma',      'Dubois',   'emma.dubois@etu.episen.fr',    'Student', 'F01A01', NOW() - INTERVAL '30 minutes',  NOW() - INTERVAL '10 minutes'),
  ('Noah',      'Leroy',    'noah.leroy@etu.episen.fr',     'Student', 'F01A02', NOW() - INTERVAL '6 hours',      NOW() - INTERVAL '2 hours'),
  ('Chloé',     'Renard',   'chloe.renard@episen.fr',       'Staff',   'F01A03', NOW() - INTERVAL '2 days',       NOW() - INTERVAL '1 days'),
  ('Hugo',      'Garcia',   'hugo.garcia@etu.episen.fr',    'Student', 'F01A04', NOW() - INTERVAL '3 hours',      NOW() - INTERVAL '1 hours'),
  ('Léa',       'Petit',    'lea.petit@etu.episen.fr',      'Student', 'F01A05', NOW() - INTERVAL '12 hours',     NOW() - INTERVAL '4 hours'),

  ('Nathan',    'Roche',    'nathan.roche@episen.fr',       'Staff',   'F01A06', NOW() - INTERVAL '1 days',       NOW() - INTERVAL '8 hours'),
  ('Manon',     'Faure',    'manon.faure@etu.episen.fr',    'Student', 'F01A07', NOW() - INTERVAL '20 minutes',   NOW() - INTERVAL '5 minutes'),
  ('Tom',       'Lambert',  'tom.lambert@etu.episen.fr',    'Student', 'F01A08', NOW() - INTERVAL '5 days',       NOW() - INTERVAL '2 days'),
  ('Sarah',     'Lopez',    'sarah.lopez@episen.fr',        'Admin',   'F01A09', NOW() - INTERVAL '7 hours',      NOW() - INTERVAL '1 hours'),
  ('Gabriel',   'Martin',   'gabriel.martin@etu.episen.fr', 'Student', 'F01A0A', NOW() - INTERVAL '3 days',       NOW() - INTERVAL '10 hours'),

  ('Julie',     'Nguyen',   'julie.nguyen@episen.fr',       'Staff',   'F01A0B', NOW() - INTERVAL '40 minutes',   NOW() - INTERVAL '15 minutes'),
  ('Maxime',    'Robert',   'maxime.robert@etu.episen.fr',  'Student', 'F01A0C', NOW() - INTERVAL '8 hours',      NOW() - INTERVAL '2 hours'),
  ('Camille',   'Blanc',    'camille.blanc@etu.episen.fr',  'Student', 'F01A0D', NOW() - INTERVAL '15 minutes',   NOW() - INTERVAL '5 minutes'),
  ('Jules',     'Henry',    'jules.henry@episen.fr',        'Staff',   'F01A0E', NOW() - INTERVAL '10 days',      NOW() - INTERVAL '3 days'),
  ('Anna',      'Park',     'anna.park@etu.episen.fr',      'Student', 'F01A0F', NOW() - INTERVAL '2 days',       NOW() - INTERVAL '6 hours'),

  ('Yanis',     'Morel',    'yanis.morel@etu.episen.fr',    'Student', 'F01A10', NOW() - INTERVAL '1 hours',      NOW() - INTERVAL '20 minutes'),
  ('Zoé',       'Gillet',   'zoe.gillet@etu.episen.fr',     'Student', 'F01A11', NOW() - INTERVAL '4 days',       NOW() - INTERVAL '1 days'),
  ('Louis',     'Arnaud',   'louis.arnaud@episen.fr',       'Staff',   'F01A12', NOW() - INTERVAL '6 hours',      NOW() - INTERVAL '1 hours'),
  ('Nina',      'Perrot',   'nina.perrot@etu.episen.fr',    'Student', 'F01A13', NOW() - INTERVAL '50 minutes',   NOW() - INTERVAL '10 minutes'),
  ('Adam',      'Riviere',  'adam.riviere@etu.episen.fr',   'Student', 'F01A14', NOW() - INTERVAL '9 hours',      NOW() - INTERVAL '3 hours'),

  ('Elisa',     'Charpentier', 'elisa.charpentier@episen.fr',    'Admin',   'F01A15', NOW() - INTERVAL '2 days',   NOW() - INTERVAL '1 days'),
  ('Pauline',   'Colin',       'pauline.colin@etu.episen.fr',    'Student', 'F01A16', NOW() - INTERVAL '25 minutes', NOW() - INTERVAL '5 minutes'),
  ('Enzo',      'Barbier',     'enzo.barbier@etu.episen.fr',     'Student', 'F01A17', NOW() - INTERVAL '3 hours',  NOW() - INTERVAL '1 hours'),
  ('Laura',     'Andre',       'laura.andre@episen.fr',          'Staff',   'F01A18', NOW() - INTERVAL '3 days',  NOW() - INTERVAL '12 hours'),
  ('Rayan',     'Picard',      'rayan.picard@etu.episen.fr',     'Student', 'F01A19', NOW() - INTERVAL '6 days',  NOW() - INTERVAL '2 days'),

  ('Elise',     'Marechal',    'elise.marechal@etu.episen.fr',   'Student', 'F01A1A', NOW() - INTERVAL '1 days',  NOW() - INTERVAL '8 hours'),
  ('Théo',      'Poirier',     'theo.poirier@episen.fr',         'Staff',   'F01A1B', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '30 minutes'),
  ('Mila',      'Renault',     'mila.renault@etu.episen.fr',     'Student', 'F01A1C', NOW() - INTERVAL '5 hours', NOW() - INTERVAL '1 hours'),
  ('Clara',     'Gomez',       'clara.gomez@etu.episen.fr',      'Student', 'F01A1D', NOW() - INTERVAL '4 days',  NOW() - INTERVAL '1 days'),
  ('Oscar',     'Boucher',     'oscar.boucher@episen.fr',        'Security','F01A1E', NOW() - INTERVAL '30 hours',NOW() - INTERVAL '20 hours');

  INSERT INTO doors (door_id, name, location, active) VALUES
   ('DOOR-1', 'Entrée Principale', 'EPISEN - Campus Saint-Simon', true),
   ('DOOR-2', 'Entrée Arrière', 'EPISEN - Bâtiment Recherche, Campus Saint-Simon', true),
   ('DOOR-3', 'Autre campus', 'EPISEN - MIEE (Maison Innovation et Entrepreneuriat)', true);