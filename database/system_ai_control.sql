CREATE TABLE IF NOT EXISTS system_ai_controls (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 autonomy_level INTEGER NOT NULL DEFAULT 0,
 require_confirmation BOOLEAN NOT NULL DEFAULT TRUE,
 allowed_operations JSONB NOT NULL DEFAULT '[]'::jsonb,
 blocked_operations JSONB NOT NULL DEFAULT '[]'::jsonb,
 max_actions_per_run INTEGER NOT NULL DEFAULT 10,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 UNIQUE(user_id)
);