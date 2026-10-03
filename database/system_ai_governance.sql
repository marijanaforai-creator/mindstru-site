CREATE TABLE IF NOT EXISTS system_ai_policies (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 name TEXT NOT NULL,
 autonomy_level INTEGER NOT NULL DEFAULT 0,
 require_approval BOOLEAN NOT NULL DEFAULT TRUE,
 allowed_actions JSONB NOT NULL DEFAULT '[]'::jsonb,
 blocked_actions JSONB NOT NULL DEFAULT '[]'::jsonb,
 data_boundaries JSONB NOT NULL DEFAULT '{}'::jsonb,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS system_ai_decisions (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 execution_id UUID REFERENCES system_executions(id) ON DELETE SET NULL,
 action TEXT NOT NULL,
 decision TEXT NOT NULL,
 reason TEXT,
 context JSONB NOT NULL DEFAULT '{}'::jsonb,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_system_ai_policies_user ON system_ai_policies(user_id);
CREATE INDEX IF NOT EXISTS idx_system_ai_decisions_user ON system_ai_decisions(user_id,created_at DESC);