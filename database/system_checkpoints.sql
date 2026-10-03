CREATE TABLE IF NOT EXISTS system_checkpoints (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 orchestration_id UUID NOT NULL REFERENCES system_orchestrations(id) ON DELETE CASCADE,
 step_id UUID REFERENCES system_orchestration_steps(id) ON DELETE CASCADE,
 name TEXT NOT NULL,
 status TEXT NOT NULL DEFAULT 'saved',
 state JSONB NOT NULL DEFAULT '{}'::jsonb,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_system_checkpoints_orchestration ON system_checkpoints(orchestration_id,created_at DESC);