CREATE TABLE IF NOT EXISTS system_event_correlations (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 correlation_key TEXT NOT NULL,
 event_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
 incident_id UUID REFERENCES system_incidents(id) ON DELETE SET NULL,
 confidence NUMERIC(5,2) NOT NULL DEFAULT 0,
 summary TEXT,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS system_slo_policies (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 name TEXT NOT NULL,
 service TEXT NOT NULL,
 target_percent NUMERIC(6,3) NOT NULL,
 window_days INTEGER NOT NULL DEFAULT 30,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS system_recovery_plans (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 name TEXT NOT NULL,
 trigger_type TEXT NOT NULL,
 actions JSONB NOT NULL DEFAULT '[]'::jsonb,
 approval_required BOOLEAN NOT NULL DEFAULT TRUE,
 enabled BOOLEAN NOT NULL DEFAULT TRUE,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_event_correlations_user ON system_event_correlations(user_id,created_at DESC);
CREATE INDEX IF NOT EXISTS idx_slo_policies_user ON system_slo_policies(user_id);
CREATE INDEX IF NOT EXISTS idx_recovery_plans_user ON system_recovery_plans(user_id,enabled);