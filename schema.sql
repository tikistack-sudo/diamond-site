CREATE TABLE IF NOT EXISTS bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  zip TEXT NOT NULL,
  service TEXT NOT NULL,
  bedrooms TEXT NOT NULL,
  bathrooms TEXT NOT NULL,
  frequency TEXT NOT NULL DEFAULT 'One time',
  preferred_date TEXT,
  notes TEXT,
  user_agent TEXT,
  status TEXT NOT NULL DEFAULT 'new'
);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
