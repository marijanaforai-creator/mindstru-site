CREATE TABLE IF NOT EXISTS system_notifications (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 type TEXT NOT NULL DEFAULT 'info',
 title TEXT NOT NULL,
 message TEXT NOT NULL,
 priority INTEGER NOT NULL DEFAULT 50,
 read_at TIMESTAMPTZ,
 metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_system_notifications_user ON system_notifications(user_id,read_at,created_at DESC);