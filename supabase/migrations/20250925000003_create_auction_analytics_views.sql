-- Create auction-specific analytics views for the OVK analytics dashboard
-- Migration: 20250925000003_create_auction_analytics_views

-- Auction section engagement tracking
CREATE OR REPLACE VIEW v_auction_section_engagement AS
SELECT 
  COALESCE((meta->>'section_name')::text, 'unknown') as section_name,
  COUNT(*) as total_views,
  AVG(COALESCE((meta->>'time_visible_ms')::integer, duration_ms, 0)) as avg_time_visible_ms,
  COUNT(DISTINCT session_id) as unique_sessions
FROM analytics_event 
WHERE created_at > NOW() - INTERVAL '30 days'
  AND type = 'section_view'
  AND (meta->>'auction_id') IS NOT NULL
GROUP BY section_name
ORDER BY total_views DESC
LIMIT 20;

-- Auction data interactions (clicks on data points)
CREATE OR REPLACE VIEW v_auction_data_interactions AS
SELECT 
  COALESCE((meta->>'data_type')::text, 'unknown') as data_type,
  COALESCE((meta->>'item_name')::text, 'unknown') as item_name,
  COUNT(*) as interactions
FROM analytics_event 
WHERE created_at > NOW() - INTERVAL '30 days'
  AND type = 'custom'
  AND (meta->>'event_name')::text = 'auction_data_click'
GROUP BY data_type, item_name
ORDER BY interactions DESC
LIMIT 20;

-- Auction chart interactions
CREATE OR REPLACE VIEW v_auction_chart_engagement AS
SELECT 
  COALESCE((meta->>'chart_type')::text, 'unknown') as chart_type,
  COALESCE((meta->>'interaction_type')::text, 'unknown') as interaction_type,
  COUNT(*) as count
FROM analytics_event 
WHERE created_at > NOW() - INTERVAL '30 days'
  AND type = 'custom'
  AND (meta->>'event_name')::text = 'auction_chart_interaction'
GROUP BY chart_type, interaction_type
ORDER BY count DESC
LIMIT 20;

-- Auction tab flow analysis
CREATE OR REPLACE VIEW v_auction_tab_flow AS
SELECT 
  COALESCE((meta->>'from_tab')::text, 'unknown') as from_tab,
  COALESCE((meta->>'to_tab')::text, 'unknown') as to_tab,
  COUNT(*) as transitions
FROM analytics_event 
WHERE created_at > NOW() - INTERVAL '30 days'
  AND type = 'custom'
  AND (meta->>'event_name')::text = 'auction_tab_change'
GROUP BY from_tab, to_tab
ORDER BY transitions DESC
LIMIT 20;

-- Real-time auction activity
CREATE OR REPLACE VIEW v_realtime_auction_activity AS
SELECT 
  COALESCE((meta->>'event_name')::text, type) as event_name,
  COALESCE((meta->>'auction_id')::text, REGEXP_REPLACE(path, '^/([0-9]+).*', '\1')) as auction_id,
  path,
  COUNT(*) as event_count,
  MAX(created_at) as latest_event
FROM analytics_event 
WHERE created_at > NOW() - INTERVAL '5 minutes'
  AND (path ~ '^/[0-9]+' OR (meta->>'auction_id') IS NOT NULL)
GROUP BY event_name, auction_id, path
ORDER BY latest_event DESC
LIMIT 20;

-- Create a sessionization function for computing session rollups
CREATE OR REPLACE FUNCTION compute_session_rollups()
RETURNS void AS $$
BEGIN
  -- Insert or update session rollups
  INSERT INTO analytics_session_rollup (
    session_id,
    first_seen,
    last_seen,
    duration_minutes,
    pageviews,
    is_engaged,
    computed_at
  )
  SELECT 
    s.session_id,
    MIN(e.created_at) as first_seen,
    MAX(e.created_at) as last_seen,
    EXTRACT(EPOCH FROM (MAX(e.created_at) - MIN(e.created_at))) / 60 as duration_minutes,
    COUNT(*) FILTER (WHERE e.type = 'pageview') as pageviews,
    -- Consider engaged if session > 30 seconds OR > 2 pageviews OR has interactions
    (
      EXTRACT(EPOCH FROM (MAX(e.created_at) - MIN(e.created_at))) > 30 OR
      COUNT(*) FILTER (WHERE e.type = 'pageview') > 2 OR
      COUNT(*) FILTER (WHERE e.type IN ('click', 'download', 'custom')) > 0
    ) as is_engaged,
    NOW() as computed_at
  FROM analytics_session s
  JOIN analytics_event e ON s.session_id = e.session_id
  WHERE s.session_id NOT IN (
    SELECT session_id FROM analytics_session_rollup 
    WHERE computed_at > NOW() - INTERVAL '1 hour'
  )
  GROUP BY s.session_id
  ON CONFLICT (session_id) 
  DO UPDATE SET
    last_seen = EXCLUDED.last_seen,
    duration_minutes = EXCLUDED.duration_minutes,
    pageviews = EXCLUDED.pageviews,
    is_engaged = EXCLUDED.is_engaged,
    computed_at = EXCLUDED.computed_at;
END;
$$ LANGUAGE plpgsql;

-- Channel classification function
CREATE OR REPLACE FUNCTION derive_channel(referrer TEXT, utm_data JSONB)
RETURNS TEXT AS $$
DECLARE
  medium TEXT;
  source TEXT;
  ref TEXT;
BEGIN
  medium := LOWER(COALESCE(utm_data->>'medium', ''));
  source := LOWER(COALESCE(utm_data->>'source', ''));
  ref := LOWER(COALESCE(referrer, ''));

  -- Paid traffic
  IF medium IN ('cpc', 'ppc', 'ads', 'paid') THEN
    RETURN 'Paid';
  END IF;

  -- Direct traffic (no referrer)
  IF ref = '' OR ref IS NULL THEN
    RETURN 'Direct';
  END IF;

  -- Social media
  IF ref LIKE '%facebook%' OR ref LIKE '%instagram%' OR ref LIKE '%twitter%' 
     OR ref LIKE '%t.co%' OR ref LIKE '%linkedin%' OR ref LIKE '%tiktok%' THEN
    RETURN 'Social';
  END IF;

  -- Search engines
  IF ref LIKE '%google%' OR ref LIKE '%bing%' OR ref LIKE '%yahoo%' 
     OR ref LIKE '%duckduckgo%' THEN
    RETURN 'Organic';
  END IF;

  -- Email
  IF source = 'email' OR medium = 'email' THEN
    RETURN 'Email';
  END IF;

  -- Default to referral
  RETURN 'Referral';
END;
$$ LANGUAGE plpgsql;
