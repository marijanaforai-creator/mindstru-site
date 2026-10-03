CREATE TABLE IF NOT EXISTS system_finops_costs (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 cost_type TEXT NOT NULL,
 resource_type TEXT NOT NULL,
 resource_key TEXT NOT NULL,
 amount NUMERIC(18,8) NOT NULL DEFAULT 0,
 currency TEXT NOT NULL DEFAULT 'EUR',
 quantity NUMERIC(18,6),
 unit TEXT,
 occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 metadata JSONB NOT NULL DEFAULT '{}'::jsonb
);
CREATE TABLE IF NOT EXISTS system_finops_budgets (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 budget_key TEXT NOT NULL,
 period TEXT NOT NULL DEFAULT 'monthly',
 limit_amount NUMERIC(18,8) NOT NULL,
 warning_percent NUMERIC(6,2) NOT NULL DEFAULT 70,
 critical_percent NUMERIC(6,2) NOT NULL DEFAULT 90,
 currency TEXT NOT NULL DEFAULT 'EUR',
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS system_finops_alerts (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 severity TEXT NOT NULL,
 alert_type TEXT NOT NULL,
 resource_key TEXT,
 amount NUMERIC(18,8),
 threshold NUMERIC(18,8),
 status TEXT NOT NULL DEFAULT 'open',
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_finops_costs_user_time ON system_finops_costs(user_id,occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_finops_budget_user ON system_finops_budgets(user_id);
CREATE INDEX IF NOT EXISTS idx_finops_alert_user ON system_finops_alerts(user_id,created_at DESC);