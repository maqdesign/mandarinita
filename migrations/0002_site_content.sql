CREATE TABLE IF NOT EXISTS site_content (
  content_key TEXT PRIMARY KEY,
  es TEXT NOT NULL,
  en TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  updated_by TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS site_content_updated_at ON site_content(updated_at DESC);
