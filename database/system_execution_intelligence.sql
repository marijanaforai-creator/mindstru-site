CREATE TABLE IF NOT EXISTS system_execution_policies (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 name TEXT NOT NULL,
 max_risk INTEGER NOT NULL DEFAULT 50,
 max_cost NUMERIC(14,4),
 require_approval_above_risk INTEGER NOT NULL DEFAULT 70,
 allow_autonomous BOOLEAN NOT NULL DEFAULT FALSE,
 kill_switch_enabled BOOLEAN NOT NULL DEFAULT TRUE,
 rules JSONB NOT NULL DEFAULT '{}'::jsonb,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS system_execution_assessments (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 orchestration_id UUID REFERENCES system_orchestrations(id) ON DELETE CASCADE,
 risk_score INTEGER NOT NULL DEFAULT 0,
 estimated_cost NUMERIC(14,4) NOT NULL DEFAULT 0,
 required_resources JSONB NOT NULL DEFAULT '{}'::jsonb,
 permissions JSONB NOT NULL DEFAULT '{}'::jsonb,
 decision TEXT NOT NULL DEFAULT 'review',
 reasons JSONB NOT NULL DEFAULT '[]'::jsonb,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_execution_policies_user ON system_execution_policies(user_id);
CREATE INDEX IF NOT EXISTS idx_execution_assessments_user ON system_execution_assessments(user_id,created_at DESC);