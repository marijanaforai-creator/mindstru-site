CREATE TABLE IF NOT EXISTS system_governance_policies (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 policy_key TEXT NOT NULL,
 policy_type TEXT NOT NULL,
 severity TEXT NOT NULL DEFAULT 'medium',
 enabled BOOLEAN NOT NULL DEFAULT TRUE,
 config JSONB NOT NULL DEFAULT '{}'::jsonb,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS system_governance_decisions (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 action_key TEXT NOT NULL,
 decision TEXT NOT NULL,
 risk_score NUMERIC(6,2),
 cost_score NUMERIC(12,4),
 capacity_score NUMERIC(6,2),
 reliability_score NUMERIC(6,2),
 autonomy_level TEXT,
 reasons JSONB NOT NULL DEFAULT '[]'::jsonb,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS system_governance_events (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 event_type TEXT NOT NULL,
 severity TEXT NOT NULL DEFAULT 'info',
 detail JSONB NOT NULL DEFAULT '{}'::jsonb,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_gov_policy_user ON system_governance_policies(user_id,enabled);
CREATE INDEX IF NOT EXISTS idx_gov_decision_user ON system_governance_decisions(user_id,created_at DESC);
CREATE INDEX IF NOT EXISTS idx_gov_event_user ON system_governance_events(user_id,created_at DESC);