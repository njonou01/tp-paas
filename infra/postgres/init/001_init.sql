
-- =============================================
-- Description: Liste du personnel et des étudiants autorisés à entrer dans le bâtiment
-- =============================================

CREATE TABLE IF NOT EXISTS people (
  id SERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT,
  badge_id TEXT UNIQUE NOT NULL,
  last_entry TIMESTAMP 
);


INSERT INTO people (first_name, last_name, email, role, badge_id, last_entry)
VALUES
  ('Sophia', 'Kim', 'sophia.kim@episen.fr', 'Staff', 'A32F92', NOW() - INTERVAL '2 hours'),
  ('Alexandre', 'Dupont', 'alex.dupont@etu.episen.fr', 'Student', 'B47E12', NOW() - INTERVAL '1 day'),
  ('Marie', 'Chen', 'marie.chen@episen.fr', 'Admin', 'C98Z20', NOW() - INTERVAL '5 hours'),
  ('Lucas', 'Moreau', 'lucas.moreau@etu.episen.fr', 'Student', 'D11X43', NOW() - INTERVAL '3 days'),
  ('Inès', 'Martin', 'ines.martin@episen.fr', 'Staff', 'E76Y88', NOW() - INTERVAL '4 hours');
