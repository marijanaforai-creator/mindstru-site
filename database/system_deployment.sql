CREATE TABLE IF NOT EXISTS system_deployments (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 target TEXT NOT NULL,
 status TEXT NOT NULL DEFAULT 'planned',
 plan JSONB NOT NULL DEFAULT '{}'::jsonb,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_system_deployments_user ON system_deployments(user_id,created_at DESC);