CREATE TABLE IF NOT EXISTS system_orchestration_steps (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 orchestration_id UUID NOT NULL REFERENCES system_orchestrations(id) ON DELETE CASCADE,
 step_key TEXT NOT NULL,
 name TEXT NOT NULL,
 type TEXT NOT NULL DEFAULT 'action',
 action TEXT,
 position INTEGER NOT NULL DEFAULT 0,
 status TEXT NOT NULL DEFAULT 'queued',
 condition JSONB NOT NULL DEFAULT '{}'::jsonb,
 depends_on JSONB NOT NULL DEFAULT '[]'::jsonb,
 parallel_group TEXT,
 input JSONB NOT NULL DEFAULT '{}'::jsonb,
 output JSONB NOT NULL DEFAULT '{}'::jsonb,
 retry_policy JSONB NOT NULL DEFAULT '{}'::jsonb,
 checkpoint BOOLEAN NOT NULL DEFAULT FALSE,
 compensation_action TEXT,
 approval_required BOOLEAN NOT NULL DEFAULT FALSE,
 approval_status TEXT,
 approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
 approved_at TIMESTAMPTZ,
 started_at TIMESTAMPTZ,
 finished_at TIMESTAMPTZ,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 UNIQUE(orchestration_id,step_key)
);
CREATE INDEX IF NOT EXISTS idx_system_orch_steps_order ON system_orchestration_steps(orchestration_id,position);
CREATE INDEX IF NOT EXISTS idx_system_orch_steps_status ON system_orchestration_steps(orchestration_id,status);