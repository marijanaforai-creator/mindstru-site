CREATE TABLE IF NOT EXISTS system_runtime_events (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 event_type TEXT NOT NULL,
 source TEXT,
 payload JSONB NOT NULL DEFAULT '{}'::jsonb,
 processed BOOLEAN NOT NULL DEFAULT FALSE,
 processed_at TIMESTAMPTZ,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS system_runtime_triggers (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 name TEXT NOT NULL,
 event_type TEXT NOT NULL,
 operation TEXT NOT NULL,
 enabled BOOLEAN NOT NULL DEFAULT TRUE,
 conditions JSONB NOT NULL DEFAULT '{}'::jsonb,
 payload JSONB NOT NULL DEFAULT '{}'::jsonb,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_runtime_events_user ON system_runtime_events(user_id,created_at DESC);
CREATE INDEX IF NOT EXISTS idx_runtime_events_pending ON system_runtime_events(processed,created_at);
CREATE INDEX IF NOT EXISTS idx_runtime_triggers_user ON system_runtime_triggers(user_id,enabled,event_type);