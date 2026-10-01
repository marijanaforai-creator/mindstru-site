CREATE TABLE IF NOT EXISTS contacts (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 name TEXT,
 email TEXT NOT NULL,
 source TEXT,
 lead_magnet TEXT,
 product TEXT,
 status TEXT NOT NULL DEFAULT 'new',
 tags JSONB NOT NULL DEFAULT '[]'::jsonb,
 metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
 last_activity_at TIMESTAMPTZ,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 UNIQUE(user_id,email)
);
CREATE INDEX IF NOT EXISTS idx_contacts_user ON contacts(user_id,updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(user_id,status);
