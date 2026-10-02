CREATE TABLE IF NOT EXISTS system_execution_steps (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 execution_id UUID NOT NULL REFERENCES system_executions(id) ON DELETE CASCADE,
 step_key TEXT NOT NULL,
 name TEXT NOT NULL,
 status TEXT NOT NULL DEFAULT 'queued',
 position INTEGER NOT NULL DEFAULT 0,
 progress INTEGER NOT NULL DEFAULT 0,
 detail TEXT,
 attempts INTEGER NOT NULL DEFAULT 0,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_execution_steps_execution ON system_execution_steps(execution_id,position);