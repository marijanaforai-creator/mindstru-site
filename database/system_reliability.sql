CREATE TABLE IF NOT EXISTS system_alert_rules (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 name TEXT NOT NULL,
 metric_name TEXT NOT NULL,
 operator TEXT NOT NULL,
 threshold NUMERIC NOT NULL,
 severity TEXT NOT NULL DEFAULT 'medium',
 enabled BOOLEAN NOT NULL DEFAULT TRUE,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS system_health_snapshots (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 score INTEGER NOT NULL,
 components JSONB NOT NULL DEFAULT '{}'::jsonb,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_system_alert_rules_user ON system_alert_rules(user_id,enabled);
CREATE INDEX IF NOT EXISTS idx_system_health_snapshots_user ON system_health_snapshots(user_id,created_at DESC);