CREATE TABLE IF NOT EXISTS system_schedules (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 name TEXT NOT NULL,
 operation TEXT NOT NULL,
 cron_expression TEXT,
 enabled BOOLEAN NOT NULL DEFAULT TRUE,
 payload JSONB NOT NULL DEFAULT '{}'::jsonb,
 last_run_at TIMESTAMPTZ,
 next_run_at TIMESTAMPTZ,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_system_schedules_user ON system_schedules(user_id,enabled,next_run_at);