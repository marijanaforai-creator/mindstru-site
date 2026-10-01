ALTER TABLE email_sequences ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'draft';
ALTER TABLE email_sequences ADD COLUMN IF NOT EXISTS timezone TEXT NOT NULL DEFAULT 'Europe/Belgrade';
ALTER TABLE email_sequences ADD COLUMN IF NOT EXISTS next_run_at TIMESTAMPTZ;
ALTER TABLE email_sequences ADD COLUMN IF NOT EXISTS activated_at TIMESTAMPTZ;

CREATE TABLE IF NOT EXISTS email_sequence_runs (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 sequence_id UUID NOT NULL REFERENCES email_sequences(id) ON DELETE CASCADE,
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
 status TEXT NOT NULL DEFAULT 'queued',
 current_email_index INTEGER NOT NULL DEFAULT 0,
 input JSONB NOT NULL DEFAULT '{}'::jsonb,
 output JSONB NOT NULL DEFAULT '{}'::jsonb,
 error TEXT,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 completed_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_email_sequence_runs_user ON email_sequence_runs(user_id,created_at DESC);
CREATE INDEX IF NOT EXISTS idx_email_sequence_runs_sequence ON email_sequence_runs(sequence_id,created_at DESC);
CREATE INDEX IF NOT EXISTS idx_email_sequences_next_run ON email_sequences(status,next_run_at);