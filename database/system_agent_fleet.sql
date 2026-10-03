CREATE TABLE IF NOT EXISTS system_agent_registry (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 identity_id UUID,
 agent_key TEXT NOT NULL,
 display_name TEXT,
 version TEXT NOT NULL DEFAULT '1.0.0',
 status TEXT NOT NULL DEFAULT 'draft',
 environment TEXT NOT NULL DEFAULT 'development',
 capabilities JSONB NOT NULL DEFAULT '[]'::jsonb,
 config JSONB NOT NULL DEFAULT '{}'::jsonb,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS system_agent_heartbeats (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 agent_id UUID NOT NULL,
 status TEXT NOT NULL,
 load_percent NUMERIC(6,2),
 last_seen TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 metadata JSONB NOT NULL DEFAULT '{}'::jsonb
);
CREATE TABLE IF NOT EXISTS system_agent_versions (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 agent_id UUID NOT NULL,
 version TEXT NOT NULL,
 release_notes TEXT,
 status TEXT NOT NULL DEFAULT 'available',
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS system_agent_lifecycle_events (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 agent_id UUID NOT NULL,
 event_type TEXT NOT NULL,
 from_status TEXT,
 to_status TEXT,
 detail JSONB NOT NULL DEFAULT '{}'::jsonb,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_agent_registry_user ON system_agent_registry(user_id,status);
CREATE INDEX IF NOT EXISTS idx_agent_heartbeat_user ON system_agent_heartbeats(user_id,last_seen DESC);
CREATE INDEX IF NOT EXISTS idx_agent_versions_user ON system_agent_versions(user_id,agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_lifecycle_user ON system_agent_lifecycle_events(user_id,created_at DESC);