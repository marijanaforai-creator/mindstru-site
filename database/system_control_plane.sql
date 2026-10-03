CREATE TABLE IF NOT EXISTS system_orchestration_events (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 orchestration_id UUID REFERENCES system_orchestrations(id) ON DELETE CASCADE,
 step_id UUID REFERENCES system_orchestration_steps(id) ON DELETE SET NULL,
 event_type TEXT NOT NULL,
 payload JSONB NOT NULL DEFAULT '{}'::jsonb,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_orch_events_user_time ON system_orchestration_events(user_id,created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orch_events_orch_time ON system_orchestration_events(orchestration_id,created_at DESC);

CREATE TABLE IF NOT EXISTS system_policies (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID REFERENCES users(id) ON DELETE CASCADE,
 name TEXT NOT NULL,
 scope TEXT NOT NULL DEFAULT 'system',
 rules JSONB NOT NULL DEFAULT '{}'::jsonb,
 enabled BOOLEAN NOT NULL DEFAULT TRUE,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_system_policies_scope ON system_policies(user_id,scope,enabled);

CREATE TABLE IF NOT EXISTS system_decision_gates (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 orchestration_id UUID REFERENCES system_orchestrations(id) ON DELETE CASCADE,
 step_id UUID REFERENCES system_orchestration_steps(id) ON DELETE SET NULL,
 decision TEXT NOT NULL DEFAULT 'pending',
 rationale JSONB NOT NULL DEFAULT '{}'::jsonb,
 requires_human BOOLEAN NOT NULL DEFAULT FALSE,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 decided_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS system_recovery_actions (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 execution_id UUID REFERENCES system_executions(id) ON DELETE CASCADE,
 orchestration_id UUID REFERENCES system_orchestrations(id) ON DELETE CASCADE,
 action TEXT NOT NULL,
 status TEXT NOT NULL DEFAULT 'planned',
 attempt INTEGER NOT NULL DEFAULT 0,
 result JSONB NOT NULL DEFAULT '{}'::jsonb,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS system_runtime_registry (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID REFERENCES users(id) ON DELETE CASCADE,
 capability_key TEXT NOT NULL,
 layer TEXT NOT NULL,
 status TEXT NOT NULL DEFAULT 'planned',
 config JSONB NOT NULL DEFAULT '{}'::jsonb,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 UNIQUE(user_id,capability_key)
);
