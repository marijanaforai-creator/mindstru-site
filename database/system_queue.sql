CREATE TABLE IF NOT EXISTS system_queue (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 execution_id UUID REFERENCES system_executions(id) ON DELETE CASCADE,
 priority INTEGER NOT NULL DEFAULT 50,
 status TEXT NOT NULL DEFAULT 'queued',
 available_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 attempts INTEGER NOT NULL DEFAULT 0,
 locked_at TIMESTAMPTZ,
 locked_by UUID,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_system_queue_ready ON system_queue(status,priority DESC,available_at);