ALTER TABLE hero_banners ADD COLUMN media_style TEXT NOT NULL DEFAULT 'straight'
  CHECK (media_style IN ('straight', 'tilt-left', 'tilt-right'));
ALTER TABLE hero_banners ADD COLUMN media_shadow TEXT NOT NULL DEFAULT 'soft'
  CHECK (media_shadow IN ('none', 'soft', 'lifted'));
ALTER TABLE hero_banners ADD COLUMN is_new TEXT NOT NULL DEFAULT 'false'
  CHECK (is_new IN ('true', 'false'));
