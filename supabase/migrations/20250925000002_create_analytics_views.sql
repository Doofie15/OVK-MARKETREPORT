-- Create analytics views for the OVK analytics dashboard
-- Migration: 20250925000002_create_analytics_views

-- Active users in last 5 minutes
CREATE OR REPLACE VIEW v_active_users_5m AS
SELECT COUNT(DISTINCT session_id) as active_users
FROM analytics_event 
WHERE created_at > NOW() - INTERVAL '5 minutes';

-- Daily, Weekly, Monthly Active Users
CREATE OR REPLACE VIEW v_dau_wau_mau AS
SELECT 
  (SELECT COUNT(DISTINCT session_id) FROM analytics_session WHERE created_at > NOW() - INTERVAL '1 day') as dau,
  (SELECT COUNT(DISTINCT session_id) FROM analytics_session WHERE created_at > NOW() - INTERVAL '7 days') as wau,
  (SELECT COUNT(DISTINCT session_id) FROM analytics_session WHERE created_at > NOW() - INTERVAL '30 days') as mau;

-- Top pages in last 30 days
CREATE OR REPLACE VIEW v_top_pages_30d AS
SELECT 
  path,
  COUNT(*) as views,
  COUNT(DISTINCT session_id) as unique_sessions
FROM analytics_event 
WHERE created_at > NOW() - INTERVAL '30 days'
  AND type = 'pageview'
GROUP BY path
ORDER BY views DESC
LIMIT 50;

-- Users by country in last 30 days
CREATE OR REPLACE VIEW v_users_by_country_30d AS
SELECT 
  COALESCE(country, 'Unknown') as country,
  COUNT(DISTINCT session_id) as users
FROM analytics_session 
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY country
ORDER BY users DESC;

-- Channel performance in last 30 days
CREATE OR REPLACE VIEW v_channel_performance_30d AS
SELECT 
  COALESCE(channel, 'Direct') as channel,
  COUNT(DISTINCT session_id) as sessions,
  COUNT(*) as pageviews,
  AVG(COALESCE(duration_ms, 0)) / 1000.0 as avg_session_duration
FROM analytics_event 
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY channel
ORDER BY sessions DESC;

-- Device breakdown in last 30 days
CREATE OR REPLACE VIEW v_device_breakdown_30d AS
SELECT 
  CASE 
    WHEN screen_w < 768 THEN 'Mobile'
    WHEN screen_w < 1024 THEN 'Tablet'
    ELSE 'Desktop'
  END as device_type,
  COUNT(DISTINCT session_id) as sessions,
  ROUND(COUNT(DISTINCT session_id) * 100.0 / SUM(COUNT(DISTINCT session_id)) OVER(), 2) as percentage
FROM analytics_event 
WHERE created_at > NOW() - INTERVAL '30 days'
  AND screen_w IS NOT NULL
GROUP BY device_type
ORDER BY sessions DESC;

-- Average time on page in last 30 days
CREATE OR REPLACE VIEW v_avg_time_on_page_30d AS
SELECT 
  path,
  AVG(COALESCE(duration_ms, 0)) / 1000.0 as avg_seconds,
  COUNT(DISTINCT session_id) as sessions
FROM analytics_event 
WHERE created_at > NOW() - INTERVAL '30 days'
  AND type = 'pageview'
  AND duration_ms IS NOT NULL
GROUP BY path
ORDER BY avg_seconds DESC
LIMIT 50;

-- Section leaderboard (placeholder - adjust based on your section tracking)
CREATE OR REPLACE VIEW v_section_leaderboard_30d AS
SELECT 
  COALESCE((meta->>'section_id')::text, 'unknown') as section_id,
  COUNT(*) as views,
  AVG(COALESCE(duration_ms, 0)) / 1000.0 as avg_seconds_visible,
  COUNT(DISTINCT session_id) as unique_sessions
FROM analytics_event 
WHERE created_at > NOW() - INTERVAL '30 days'
  AND type = 'section_view'
  AND meta->>'section_id' IS NOT NULL
GROUP BY section_id
ORDER BY views DESC
LIMIT 20;

-- PWA metrics in last 30 days
CREATE OR REPLACE VIEW v_pwa_metrics_30d AS
SELECT 
  COUNT(*) FILTER (WHERE type = 'pwa_prompt_shown') as prompts_shown,
  COUNT(*) FILTER (WHERE type = 'pwa_install') as installs,
  COUNT(*) FILTER (WHERE type = 'pwa_launch') as launches,
  CASE 
    WHEN COUNT(*) FILTER (WHERE type = 'pwa_prompt_shown') > 0 
    THEN ROUND(COUNT(*) FILTER (WHERE type = 'pwa_install') * 100.0 / COUNT(*) FILTER (WHERE type = 'pwa_prompt_shown'), 2)
    ELSE 0 
  END as install_rate
FROM analytics_event 
WHERE created_at > NOW() - INTERVAL '30 days'
  AND type IN ('pwa_prompt_shown', 'pwa_install', 'pwa_launch');

-- Real-time events (last 5 minutes)
CREATE OR REPLACE VIEW v_realtime_events AS
SELECT 
  type,
  path,
  COUNT(*) as event_count,
  MAX(created_at) as latest_event
FROM analytics_event 
WHERE created_at > NOW() - INTERVAL '5 minutes'
GROUP BY type, path
ORDER BY latest_event DESC
LIMIT 20;

-- Engagement metrics in last 30 days
CREATE OR REPLACE VIEW v_engagement_metrics_30d AS
SELECT 
  COUNT(DISTINCT session_id) as total_sessions,
  AVG(COALESCE(duration_ms, 0)) / 1000.0 as avg_session_duration,
  AVG(pageviews) as avg_pages_per_session,
  COUNT(*) FILTER (WHERE is_engaged) * 100.0 / COUNT(*) as engagement_rate
FROM analytics_session_rollup
WHERE computed_at > NOW() - INTERVAL '30 days';

-- Hourly stats materialized view (for performance)
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_hourly_stats AS
SELECT 
  DATE_TRUNC('hour', created_at) as hour,
  COUNT(DISTINCT session_id) as unique_sessions,
  COUNT(*) FILTER (WHERE type = 'pageview') as pageviews,
  COUNT(*) as total_events
FROM analytics_event
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY hour
ORDER BY hour DESC;

-- Daily stats materialized view (for performance)
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_daily_stats AS
SELECT 
  DATE_TRUNC('day', created_at) as day,
  COUNT(DISTINCT session_id) as unique_sessions,
  COUNT(*) FILTER (WHERE type = 'pageview') as pageviews,
  COUNT(*) as total_events,
  COUNT(DISTINCT country) as countries
FROM analytics_event e
JOIN analytics_session s ON e.session_id = s.session_id
WHERE e.created_at > NOW() - INTERVAL '90 days'
GROUP BY day
ORDER BY day DESC;

-- Create indexes on materialized views
CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_hourly_stats_hour ON mv_hourly_stats(hour);
CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_daily_stats_day ON mv_daily_stats(day);

-- Geographic engagement view
CREATE OR REPLACE VIEW v_engagement_by_country AS
SELECT 
  s.country,
  s.region,
  COUNT(DISTINCT s.session_id) as unique_visitors,
  COUNT(*) FILTER (WHERE e.type = 'pageview') as pageviews,
  COUNT(*) FILTER (WHERE e.path LIKE '%auction%' OR e.path ~ '^/[0-9]+$') as auction_views,
  AVG(COALESCE(e.duration_ms, 0)) / 1000.0 as avg_time_on_page
FROM analytics_session s
JOIN analytics_event e ON s.session_id = e.session_id
WHERE s.created_at > NOW() - INTERVAL '30 days'
  AND s.country IS NOT NULL
GROUP BY s.country, s.region
ORDER BY unique_visitors DESC;

-- Auction engagement views
CREATE OR REPLACE VIEW v_auction_engagement_summary AS
SELECT 
  REGEXP_REPLACE(path, '^/([0-9]+).*', '\1') as auction_id,
  COUNT(DISTINCT session_id) as unique_visitors,
  COUNT(*) as pageviews,
  AVG(COALESCE(duration_ms, 0)) / 1000.0 as avg_time_on_page,
  COUNT(*) FILTER (WHERE type = 'download') as downloads
FROM analytics_event 
WHERE created_at > NOW() - INTERVAL '30 days'
  AND (path ~ '^/[0-9]+' OR path LIKE '%auction%')
GROUP BY auction_id
ORDER BY unique_visitors DESC;

CREATE OR REPLACE VIEW v_top_performing_auctions AS
SELECT 
  auction_id,
  'Auction ' || auction_id as catalogue_name,
  'Season ' || EXTRACT(YEAR FROM NOW()) as season_label,
  (unique_visitors * 2 + pageviews + downloads * 5) as engagement_score,
  unique_visitors,
  pageviews,
  avg_time_on_page,
  downloads
FROM v_auction_engagement_summary
ORDER BY engagement_score DESC
LIMIT 10;

-- Refresh function for materialized views
CREATE OR REPLACE FUNCTION refresh_analytics_materialized_views()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_hourly_stats;
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_daily_stats;
END;
$$ LANGUAGE plpgsql;
