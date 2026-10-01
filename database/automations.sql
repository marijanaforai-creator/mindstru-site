CREATE TABLE IF NOT EXISTS automations (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 name TEXT NOT NULL,
 status TEXT NOT NULL DEFAULT 'draft',
 trigger_type TEXT NOT NULL DEFAULT 'manual',
 config JSONB NOT NULL DEFAULT '{}'::jsonb,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS automation_runs (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 automation_id UUID NOT NULL REFERENCES automations(id) ON DELETE CASCADE,
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 status TEXT NOT NULL DEFAULT 'queued',
 input JSONB NOT NULL DEFAULT '{}'::jsonb,
 output JSONB NOT NULL DEFAULT '{}'::jsonb,
 error TEXT,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 completed_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_automations_user ON automations(user_id,updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_automation_runs_user ON automation_runs(user_id,created_at DESC);
