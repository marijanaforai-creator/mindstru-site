CREATE TABLE IF NOT EXISTS system_identities (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 identity_key TEXT NOT NULL,
 identity_type TEXT NOT NULL,
 display_name TEXT,
 status TEXT NOT NULL DEFAULT 'active',
 trust_score NUMERIC(6,2) NOT NULL DEFAULT 50,
 metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS system_capabilities (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 capability_key TEXT NOT NULL,
 resource TEXT NOT NULL,
 action TEXT NOT NULL,
 risk_level TEXT NOT NULL DEFAULT 'medium',
 enabled BOOLEAN NOT NULL DEFAULT TRUE,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS system_access_grants (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 identity_id UUID NOT NULL,
 capability_id UUID,
 scope JSONB NOT NULL DEFAULT '{}'::jsonb,
 expires_at TIMESTAMPTZ,
 status TEXT NOT NULL DEFAULT 'active',
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS system_trust_events (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 identity_id UUID NOT NULL,
 event_type TEXT NOT NULL,
 score_delta NUMERIC(6,2) NOT NULL DEFAULT 0,
 detail JSONB NOT NULL DEFAULT '{}'::jsonb,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_identity_user ON system_identities(user_id,status);
CREATE INDEX IF NOT EXISTS idx_capability_user ON system_capabilities(user_id,enabled);
CREATE INDEX IF NOT EXISTS idx_access_grant_user ON system_access_grants(user_id,status);
CREATE INDEX IF NOT EXISTS idx_trust_event_user ON system_trust_events(user_id,created_at DESC);