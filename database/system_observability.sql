CREATE TABLE IF NOT EXISTS system_metrics (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 metric_name TEXT NOT NULL,
 metric_value NUMERIC NOT NULL DEFAULT 0,
 unit TEXT,
 source TEXT,
 labels JSONB NOT NULL DEFAULT '{}'::jsonb,
 recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS system_incidents (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 severity TEXT NOT NULL DEFAULT 'medium',
 status TEXT NOT NULL DEFAULT 'open',
 title TEXT NOT NULL,
 description TEXT,
 source TEXT,
 metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
 opened_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 resolved_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_system_metrics_user ON system_metrics(user_id,metric_name,recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_system_incidents_user ON system_incidents(user_id,status,opened_at DESC);