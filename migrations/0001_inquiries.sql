CREATE TABLE IF NOT EXISTS inquiries (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  project TEXT NOT NULL DEFAULT '',
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewing', 'replied', 'archived')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'preview'
);

CREATE INDEX IF NOT EXISTS inquiries_created_at ON inquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS inquiries_status_created_at ON inquiries(status, created_at DESC);

CREATE TABLE IF NOT EXISTS inquiry_rate_limits (
  ip_hash TEXT NOT NULL,
  window_start INTEGER NOT NULL,
  count INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (ip_hash, window_start)
);
