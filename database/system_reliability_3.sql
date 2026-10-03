CREATE TABLE IF NOT EXISTS system_reliability_actions (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 incident_id UUID REFERENCES system_incidents(id) ON DELETE SET NULL,
 action TEXT NOT NULL,
 status TEXT NOT NULL DEFAULT 'planned',
 result JSONB NOT NULL DEFAULT '{}'::jsonb,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 finished_at TIMESTAMPTZ
);
CREATE TABLE IF NOT EXISTS system_service_health (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 service TEXT NOT NULL,
 status TEXT NOT NULL DEFAULT 'healthy',
 score INTEGER NOT NULL DEFAULT 100,
 latency_ms NUMERIC(12,2),
 error_rate NUMERIC(8,4),
 updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 UNIQUE(user_id,service)
);