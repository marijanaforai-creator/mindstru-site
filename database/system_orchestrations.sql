CREATE TABLE IF NOT EXISTS system_orchestrations (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 name TEXT NOT NULL,
 status TEXT NOT NULL DEFAULT 'planned',
 trigger TEXT,
 payload JSONB NOT NULL DEFAULT '{}'::jsonb,
 result JSONB NOT NULL DEFAULT '{}'::jsonb,
 error TEXT,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 started_at TIMESTAMPTZ,
 finished_at TIMESTAMPTZ,
 updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_system_orchestrations_user ON system_orchestrations(user_id,created_at DESC);
CREATE INDEX IF NOT EXISTS idx_system_orchestrations_status ON system_orchestrations(user_id,status);