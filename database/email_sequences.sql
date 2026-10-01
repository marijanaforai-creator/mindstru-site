CREATE TABLE IF NOT EXISTS email_sequences (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 name TEXT NOT NULL,
 type TEXT NOT NULL DEFAULT 'custom',
 goal TEXT NOT NULL DEFAULT '',
 audience TEXT NOT NULL DEFAULT '',
 offer TEXT NOT NULL DEFAULT '',
 emails JSONB NOT NULL DEFAULT '[]'::jsonb,
 status TEXT NOT NULL DEFAULT 'draft',
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_email_sequences_user ON email_sequences(user_id,updated_at DESC);
