ALTER TABLE hero_banners ADD COLUMN media_type TEXT NOT NULL DEFAULT 'image' CHECK (media_type IN ('image', 'episode'));
ALTER TABLE hero_banners ADD COLUMN episode_id TEXT NOT NULL DEFAULT '';
ALTER TABLE hero_banners ADD COLUMN starts_at TEXT NOT NULL DEFAULT '';
ALTER TABLE hero_banners ADD COLUMN ends_at TEXT NOT NULL DEFAULT '';

CREATE INDEX IF NOT EXISTS hero_banners_schedule
  ON hero_banners(enabled, starts_at, ends_at, position);
