CREATE TABLE IF NOT EXISTS system_ai_usage (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 execution_id UUID REFERENCES system_executions(id) ON DELETE SET NULL,
 actions INTEGER NOT NULL DEFAULT 0,
 estimated_cost NUMERIC(14,4) NOT NULL DEFAULT 0,
 metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_system_ai_usage_user ON system_ai_usage(user_id,created_at DESC);