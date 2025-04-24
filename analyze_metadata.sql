-- Query to analyze signature metadata with IP addresses (All times in EST)
WITH signature_stats AS (
  SELECT 
    s.*,
    sm.metadata,
    timezone('America/New_York', sm.created_at::timestamp) as est_created_at
  FROM signatures s
  LEFT JOIN signature_metadata sm ON s.id = sm.signature_id
)
SELECT 
  -- Location statistics
  jsonb_path_query_first(metadata, '$.location.country') as country,
  jsonb_path_query_first(metadata, '$.location.region') as region,
  jsonb_path_query_first(metadata, '$.location.city') as city,
  jsonb_path_query_first(metadata, '$.location.ip_address') as ip_address,
  COUNT(*) as signature_count,
  
  -- Device statistics
  jsonb_path_query_first(metadata, '$.device.browser') as browser,
  jsonb_path_query_first(metadata, '$.device.device_type') as device_type,
  jsonb_path_query_first(metadata, '$.device.screen_resolution') as screen_resolution,
  jsonb_path_query_first(metadata, '$.device.language') as language,
  jsonb_path_query_first(metadata, '$.device.timezone') as timezone,
  
  -- Time statistics (in EST)
  TO_CHAR(est_created_at, 'YYYY-MM-DD HH12:MI:SS AM TZ') as signature_date_est,
  DATE_TRUNC('day', est_created_at) as signature_day_est,
  EXTRACT(HOUR FROM est_created_at) as hour_of_day_est
FROM signature_stats
WHERE metadata IS NOT NULL
GROUP BY 
  jsonb_path_query_first(metadata, '$.location.country'),
  jsonb_path_query_first(metadata, '$.location.region'),
  jsonb_path_query_first(metadata, '$.location.city'),
  jsonb_path_query_first(metadata, '$.location.ip_address'),
  jsonb_path_query_first(metadata, '$.device.browser'),
  jsonb_path_query_first(metadata, '$.device.device_type'),
  jsonb_path_query_first(metadata, '$.device.screen_resolution'),
  jsonb_path_query_first(metadata, '$.device.language'),
  jsonb_path_query_first(metadata, '$.device.timezone'),
  est_created_at
ORDER BY est_created_at DESC, signature_count DESC;

-- Get hourly signature distribution (EST)
SELECT 
  EXTRACT(HOUR FROM timezone('America/New_York', sm.created_at::timestamp)) as hour_est,
  COUNT(*) as signature_count,
  ROUND(COUNT(*)::numeric / SUM(COUNT(*)) OVER () * 100, 2) as percentage
FROM signature_metadata sm
GROUP BY hour_est
ORDER BY hour_est;

-- Get browser and device type distribution with location context and time (EST)
SELECT 
  jsonb_path_query_first(metadata, '$.device.browser') as browser,
  jsonb_path_query_first(metadata, '$.device.device_type') as device_type,
  jsonb_path_query_first(metadata, '$.location.country') as country,
  jsonb_path_query_first(metadata, '$.location.ip_address') as ip_address,
  TO_CHAR(timezone('America/New_York', sm.created_at::timestamp), 'YYYY-MM-DD HH12:MI:SS AM TZ') as signature_date_est,
  COUNT(*) as count,
  ROUND(COUNT(*)::numeric / SUM(COUNT(*)) OVER () * 100, 2) as percentage
FROM signature_metadata sm
GROUP BY 
  jsonb_path_query_first(metadata, '$.device.browser'),
  jsonb_path_query_first(metadata, '$.device.device_type'),
  jsonb_path_query_first(metadata, '$.location.country'),
  jsonb_path_query_first(metadata, '$.location.ip_address'),
  sm.created_at
ORDER BY signature_date_est DESC, count DESC;

-- Get geographical distribution with IP addresses and time (EST)
SELECT 
  jsonb_path_query_first(metadata, '$.location.country') as country,
  jsonb_path_query_first(metadata, '$.location.region') as region,
  jsonb_path_query_first(metadata, '$.location.city') as city,
  jsonb_path_query_first(metadata, '$.location.ip_address') as ip_address,
  TO_CHAR(timezone('America/New_York', sm.created_at::timestamp), 'YYYY-MM-DD HH12:MI:SS AM TZ') as signature_date_est,
  COUNT(*) as count,
  ROUND(COUNT(*)::numeric / SUM(COUNT(*)) OVER () * 100, 2) as percentage
FROM signature_metadata sm
GROUP BY 
  jsonb_path_query_first(metadata, '$.location.country'),
  jsonb_path_query_first(metadata, '$.location.region'),
  jsonb_path_query_first(metadata, '$.location.city'),
  jsonb_path_query_first(metadata, '$.location.ip_address'),
  sm.created_at
ORDER BY signature_date_est DESC, count DESC;

-- Get daily signature trends (EST)
SELECT 
  DATE_TRUNC('day', timezone('America/New_York', sm.created_at::timestamp)) as day_est,
  COUNT(*) as signatures_per_day,
  ROUND(COUNT(*)::numeric / SUM(COUNT(*)) OVER () * 100, 2) as percentage
FROM signature_metadata sm
GROUP BY day_est
ORDER BY day_est DESC;

-- Get timezone and language distribution with location context and time (EST)
SELECT 
  jsonb_path_query_first(metadata, '$.device.timezone') as timezone,
  jsonb_path_query_first(metadata, '$.device.language') as language,
  jsonb_path_query_first(metadata, '$.location.country') as country,
  jsonb_path_query_first(metadata, '$.location.ip_address') as ip_address,
  TO_CHAR(timezone('America/New_York', sm.created_at::timestamp), 'YYYY-MM-DD HH12:MI:SS AM TZ') as signature_date_est,
  COUNT(*) as count,
  ROUND(COUNT(*)::numeric / SUM(COUNT(*)) OVER () * 100, 2) as percentage
FROM signature_metadata sm
GROUP BY 
  jsonb_path_query_first(metadata, '$.device.timezone'),
  jsonb_path_query_first(metadata, '$.device.language'),
  jsonb_path_query_first(metadata, '$.location.country'),
  jsonb_path_query_first(metadata, '$.location.ip_address'),
  sm.created_at
ORDER BY signature_date_est DESC, count DESC; 