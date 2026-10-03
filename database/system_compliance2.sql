CREATE TABLE IF NOT EXISTS system_policy_registry (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 policy_key TEXT NOT NULL,
 version INTEGER NOT NULL DEFAULT 1,
 status TEXT NOT NULL DEFAULT 'active',
 policy_type TEXT NOT NULL,
 rules JSONB NOT NULL DEFAULT '[]'::jsonb,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS system_compliance_checks (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 policy_id UUID,
 control_key TEXT NOT NULL,
 status TEXT NOT NULL DEFAULT 'pending',
 score NUMERIC(6,2),
 evidence JSONB NOT NULL DEFAULT '[]'::jsonb,
 checked_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS system_compliance_evidence (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 evidence_type TEXT NOT NULL,
 source TEXT,
 subject_key TEXT,
 content JSONB NOT NULL DEFAULT '{}'::jsonb,
 collected_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS system_compliance_exceptions (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 policy_key TEXT NOT NULL,
 reason TEXT NOT NULL,
 status TEXT NOT NULL DEFAULT 'open',
 expires_at TIMESTAMPTZ,
 approved_by TEXT,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_policy_registry_user ON system_policy_registry(user_id,status);
CREATE INDEX IF NOT EXISTS idx_compliance_checks_user ON system_compliance_checks(user_id,checked_at DESC);
CREATE INDEX IF NOT EXISTS idx_compliance_evidence_user ON system_compliance_evidence(user_id,collected_at DESC);
CREATE INDEX IF NOT EXISTS idx_compliance_exceptions_user ON system_compliance_exceptions(user_id,status);