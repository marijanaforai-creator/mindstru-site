CREATE TABLE IF NOT EXISTS system_predictions (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 domain TEXT NOT NULL, subject TEXT, prediction JSONB NOT NULL DEFAULT '{}'::jsonb,
 confidence NUMERIC(5,4), horizon TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS system_decisions (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 title TEXT NOT NULL, context JSONB NOT NULL DEFAULT '{}'::jsonb, options JSONB NOT NULL DEFAULT '[]'::jsonb,
 selected_option TEXT, evidence JSONB NOT NULL DEFAULT '[]'::jsonb, tradeoffs JSONB NOT NULL DEFAULT '{}'::jsonb,
 status TEXT NOT NULL DEFAULT 'draft', created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), decided_at TIMESTAMPTZ
);
CREATE TABLE IF NOT EXISTS system_scenarios (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 name TEXT NOT NULL, baseline JSONB NOT NULL DEFAULT '{}'::jsonb, variables JSONB NOT NULL DEFAULT '{}'::jsonb,
 outcomes JSONB NOT NULL DEFAULT '{}'::jsonb, status TEXT NOT NULL DEFAULT 'draft',
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS system_goals (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 name TEXT NOT NULL, metric TEXT, target NUMERIC, current_value NUMERIC DEFAULT 0,
 status TEXT NOT NULL DEFAULT 'active', deadline TIMESTAMPTZ, metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS system_risks (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 name TEXT NOT NULL, category TEXT NOT NULL, probability NUMERIC(5,4), impact NUMERIC(5,4),
 score NUMERIC(8,4), status TEXT NOT NULL DEFAULT 'open', mitigation JSONB NOT NULL DEFAULT '{}'::jsonb,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS system_resources (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 name TEXT NOT NULL, type TEXT NOT NULL, capacity NUMERIC, allocated NUMERIC DEFAULT 0,
 metadata JSONB NOT NULL DEFAULT '{}'::jsonb, updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS system_experiments (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 name TEXT NOT NULL, hypothesis TEXT, variants JSONB NOT NULL DEFAULT '[]'::jsonb,
 metrics JSONB NOT NULL DEFAULT '{}'::jsonb, status TEXT NOT NULL DEFAULT 'draft',
 result JSONB NOT NULL DEFAULT '{}'::jsonb, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS system_digital_twins (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 name TEXT NOT NULL, model JSONB NOT NULL DEFAULT '{}'::jsonb, state JSONB NOT NULL DEFAULT '{}'::jsonb,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_system_predictions_user ON system_predictions(user_id,created_at DESC);
CREATE INDEX IF NOT EXISTS idx_system_decisions_user ON system_decisions(user_id,created_at DESC);
CREATE INDEX IF NOT EXISTS idx_system_scenarios_user ON system_scenarios(user_id,updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_system_goals_user ON system_goals(user_id,status);
CREATE INDEX IF NOT EXISTS idx_system_risks_user ON system_risks(user_id,status);
