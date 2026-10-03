CREATE TABLE IF NOT EXISTS system_orchestration_plans (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 orchestration_id UUID REFERENCES system_orchestrations(id) ON DELETE CASCADE,
 strategy TEXT NOT NULL DEFAULT 'controlled',
 plan JSONB NOT NULL DEFAULT '{}'::jsonb,
 dependency_map JSONB NOT NULL DEFAULT '{}'::jsonb,
 conditions JSONB NOT NULL DEFAULT '[]'::jsonb,
 status TEXT NOT NULL DEFAULT 'draft',
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS system_approval_requests (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 orchestration_id UUID REFERENCES system_orchestrations(id) ON DELETE CASCADE,
 step_id UUID REFERENCES system_orchestration_steps(id) ON DELETE CASCADE,
 status TEXT NOT NULL DEFAULT 'waiting',
 reason TEXT,
 decision TEXT,
 decided_at TIMESTAMPTZ,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_system_orchestration_plans_user ON system_orchestration_plans(user_id,created_at DESC);
CREATE INDEX IF NOT EXISTS idx_system_approval_requests_user ON system_approval_requests(user_id,status,created_at DESC);