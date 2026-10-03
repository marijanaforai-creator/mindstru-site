CREATE TABLE IF NOT EXISTS system_time_jobs (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 name TEXT NOT NULL,
 operation TEXT NOT NULL,
 timezone TEXT NOT NULL DEFAULT 'Europe/Belgrade',
 schedule_type TEXT NOT NULL DEFAULT 'once',
 cron_expression TEXT,
 run_at TIMESTAMPTZ,
 enabled BOOLEAN NOT NULL DEFAULT TRUE,
 priority INTEGER NOT NULL DEFAULT 50,
 payload JSONB NOT NULL DEFAULT '{}'::jsonb,
 last_run_at TIMESTAMPTZ,
 next_run_at TIMESTAMPTZ,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_system_time_jobs_due ON system_time_jobs(user_id,enabled,next_run_at);
CREATE INDEX IF NOT EXISTS idx_system_time_jobs_operation ON system_time_jobs(user_id,operation);