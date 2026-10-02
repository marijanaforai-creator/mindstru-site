CREATE TABLE IF NOT EXISTS system_workers (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 worker_key TEXT NOT NULL,
 name TEXT NOT NULL,
 status TEXT NOT NULL DEFAULT 'idle',
 capabilities JSONB NOT NULL DEFAULT '[]'::jsonb,
 last_heartbeat TIMESTAMPTZ,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 UNIQUE(user_id,worker_key)
);
CREATE INDEX IF NOT EXISTS idx_system_workers_user ON system_workers(user_id,status);