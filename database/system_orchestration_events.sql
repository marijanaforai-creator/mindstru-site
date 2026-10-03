CREATE TABLE IF NOT EXISTS system_orchestration_events (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 orchestration_id UUID REFERENCES system_orchestrations(id) ON DELETE CASCADE,
 step_id UUID REFERENCES system_orchestration_steps(id) ON DELETE SET NULL,
 event_type TEXT NOT NULL,
 detail JSONB NOT NULL DEFAULT '{}'::jsonb,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_system_orchestration_events_user ON system_orchestration_events(user_id,created_at DESC);
CREATE INDEX IF NOT EXISTS idx_system_orchestration_events_orch ON system_orchestration_events(orchestration_id,created_at DESC);