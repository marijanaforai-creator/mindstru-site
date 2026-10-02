CREATE TABLE IF NOT EXISTS system_module_states (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 module_id TEXT NOT NULL,
 state TEXT NOT NULL DEFAULT 'planned',
 version TEXT NOT NULL DEFAULT '0.1.0',
 config JSONB NOT NULL DEFAULT '{}'::jsonb,
 updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 UNIQUE(user_id,module_id)
);
CREATE INDEX IF NOT EXISTS idx_module_states_user ON system_module_states(user_id,module_id);