CREATE TABLE IF NOT EXISTS hero_banners (
  id TEXT PRIMARY KEY,
  position INTEGER NOT NULL,
  enabled INTEGER NOT NULL DEFAULT 0 CHECK (enabled IN (0, 1)),
  eyebrow_es TEXT NOT NULL,
  eyebrow_en TEXT NOT NULL,
  title_first_es TEXT NOT NULL,
  title_first_en TEXT NOT NULL,
  title_second_es TEXT NOT NULL,
  title_second_en TEXT NOT NULL,
  description_es TEXT NOT NULL,
  description_en TEXT NOT NULL,
  cta_es TEXT NOT NULL,
  cta_en TEXT NOT NULL,
  image_path TEXT NOT NULL,
  effect TEXT NOT NULL DEFAULT 'orbit' CHECK (effect IN ('orbit', 'still')),
  alt_es TEXT NOT NULL,
  alt_en TEXT NOT NULL,
  cta_href TEXT NOT NULL DEFAULT '#historietas',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS hero_banners_enabled_position
  ON hero_banners(enabled, position);

INSERT OR IGNORE INTO hero_banners (
  id, position, enabled,
  eyebrow_es, eyebrow_en, title_first_es, title_first_en,
  title_second_es, title_second_en, description_es, description_en,
  cta_es, cta_en, image_path, effect, alt_es, alt_en, cta_href,
  created_at, updated_at
) VALUES (
  'banner-1', 0, 1,
  COALESCE((SELECT es FROM site_content WHERE content_key = 'hero.eyebrow'), 'Humor ilustrado desde República Dominicana'),
  COALESCE((SELECT en FROM site_content WHERE content_key = 'hero.eyebrow'), 'Illustrated humor from the Dominican Republic'),
  COALESCE((SELECT es FROM site_content WHERE content_key = 'hero.title.first'), 'La vida tiene'),
  COALESCE((SELECT en FROM site_content WHERE content_key = 'hero.title.first'), 'Life has'),
  COALESCE((SELECT es FROM site_content WHERE content_key = 'hero.title.second'), 'sus gajos.'),
  COALESCE((SELECT en FROM site_content WHERE content_key = 'hero.title.second'), 'its rough edges.'),
  COALESCE((SELECT es FROM site_content WHERE content_key = 'hero.description'), 'Historietas de esas cosas que nos pasan a todos, pero que nadie cuenta igual. Humor cotidiano, con sabor dominicano y mucha pulpa.'),
  COALESCE((SELECT en FROM site_content WHERE content_key = 'hero.description'), 'Comics about those everyday moments we all go through, but nobody tells quite the same way. Everyday humor, with Dominican flavor and plenty of pulp.'),
  COALESCE((SELECT es FROM site_content WHERE content_key = 'hero.cta'), 'Leer historietas'),
  COALESCE((SELECT en FROM site_content WHERE content_key = 'hero.cta'), 'Read the comics'),
  COALESCE((SELECT es FROM site_content WHERE content_key = 'hero.image'), 'assets/hero-mandy-mando-morita.png'),
  COALESCE((SELECT es FROM site_content WHERE content_key = 'hero.effect'), 'orbit'),
  COALESCE((SELECT es FROM site_content WHERE content_key = 'hero.image.alt'), 'Mandy y Mando Mandarinita sentados en su mueble azul, con Morita en el centro haciendo ojos locos y sacando la lengua.'),
  COALESCE((SELECT en FROM site_content WHERE content_key = 'hero.image.alt'), 'Mandy and Mando Mandarinita seated on their blue couch, with Morita in the middle making silly eyes and sticking out her tongue.'),
  '#historietas',
  strftime('%Y-%m-%dT%H:%M:%fZ', 'now'),
  strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
);
