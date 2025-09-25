-- Create analytics tables for the OVK analytics system
-- Migration: 20250925000001_create_analytics_tables

-- Session tracking table
CREATE TABLE IF NOT EXISTS analytics_session (
  session_id TEXT PRIMARY KEY,
  ua TEXT,
  lang TEXT,
  tz TEXT,
  ip_hash TEXT,
  country TEXT,
  region TEXT,
  city TEXT,
  is_internal BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_seen TIMESTAMPTZ DEFAULT NOW()
);

-- Event tracking table
CREATE TABLE IF NOT EXISTS analytics_event (
  id BIGSERIAL PRIMARY KEY,
  session_id TEXT REFERENCES analytics_session(session_id),
  type TEXT NOT NULL DEFAULT 'pageview',
  path TEXT NOT NULL,
  page_title TEXT,
  referrer TEXT,
  utm JSONB,
  channel TEXT,
  screen_w INTEGER,
  screen_h INTEGER,
  duration_ms INTEGER,
  meta JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Session rollups for aggregated data
CREATE TABLE IF NOT EXISTS analytics_session_rollup (
  session_id TEXT PRIMARY KEY REFERENCES analytics_session(session_id),
  first_seen TIMESTAMPTZ,
  last_seen TIMESTAMPTZ,
  duration_minutes INTEGER,
  pageviews INTEGER DEFAULT 0,
  is_engaged BOOLEAN DEFAULT FALSE,
  computed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_analytics_event_session_id ON analytics_event(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_event_created_at ON analytics_event(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics_event(type);
CREATE INDEX IF NOT EXISTS idx_analytics_event_path ON analytics_event(path);
CREATE INDEX IF NOT EXISTS idx_analytics_session_created_at ON analytics_session(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_session_country ON analytics_session(country);

-- Enable RLS (Row Level Security)
ALTER TABLE analytics_session ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_event ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_session_rollup ENABLE ROW LEVEL SECURITY;

-- Create policy for service role access
CREATE POLICY "Service role can manage analytics_session" ON analytics_session
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage analytics_event" ON analytics_event
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage analytics_session_rollup" ON analytics_session_rollup
  FOR ALL USING (auth.role() = 'service_role');

-- Create policy for authenticated users to read analytics
CREATE POLICY "Authenticated users can read analytics_session" ON analytics_session
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read analytics_event" ON analytics_event
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read analytics_session_rollup" ON analytics_session_rollup
  FOR SELECT USING (auth.role() = 'authenticated');
