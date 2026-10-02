CREATE TABLE IF NOT EXISTS system_executions (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 operation TEXT NOT NULL,
 target TEXT,
 status TEXT NOT NULL DEFAULT 'queued',
 progress INTEGER NOT NULL DEFAULT 0,
 payload JSONB NOT NULL DEFAULT '{}'::jsonb,
 result JSONB NOT NULL DEFAULT '{}'::jsonb,
 error TEXT,
 attempts INTEGER NOT NULL DEFAULT 0,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 started_at TIMESTAMPTZ,
 finished_at TIMESTAMPTZ,
 updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_system_executions_user ON system_executions(user_id,created_at DESC);
CREATE INDEX IF NOT EXISTS idx_system_executions_status ON system_executions(user_id,status);