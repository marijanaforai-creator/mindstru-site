CREATE TABLE IF NOT EXISTS system_agent_security_policies (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 policy_key TEXT NOT NULL,
 agent_type TEXT,
 risk_level TEXT NOT NULL DEFAULT 'medium',
 config JSONB NOT NULL DEFAULT '{}'::jsonb,
 enabled BOOLEAN NOT NULL DEFAULT TRUE,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS system_agent_sandboxes (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 identity_id UUID,
 sandbox_key TEXT NOT NULL,
 status TEXT NOT NULL DEFAULT 'active',
 network_policy JSONB NOT NULL DEFAULT '{}'::jsonb,
 filesystem_policy JSONB NOT NULL DEFAULT '{}'::jsonb,
 tool_policy JSONB NOT NULL DEFAULT '{}'::jsonb,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS system_agent_security_events (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 identity_id UUID,
 event_type TEXT NOT NULL,
 severity TEXT NOT NULL DEFAULT 'info',
 action TEXT,
 detail JSONB NOT NULL DEFAULT '{}'::jsonb,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS system_agent_tool_grants (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 identity_id UUID NOT NULL,
 tool_key TEXT NOT NULL,
 allowed BOOLEAN NOT NULL DEFAULT FALSE,
 scope JSONB NOT NULL DEFAULT '{}'::jsonb,
 expires_at TIMESTAMPTZ,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_agent_sec_policy_user ON system_agent_security_policies(user_id,enabled);
CREATE INDEX IF NOT EXISTS idx_agent_sandbox_user ON system_agent_sandboxes(user_id,status);
CREATE INDEX IF NOT EXISTS idx_agent_sec_event_user ON system_agent_security_events(user_id,created_at DESC);
CREATE INDEX IF NOT EXISTS idx_agent_tool_grant_user ON system_agent_tool_grants(user_id,identity_id);