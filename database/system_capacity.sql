CREATE TABLE IF NOT EXISTS system_capacity_metrics (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 resource_type TEXT NOT NULL,
 resource_key TEXT NOT NULL,
 usage_value NUMERIC NOT NULL DEFAULT 0,
 capacity_value NUMERIC NOT NULL DEFAULT 100,
 unit TEXT,
 recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS system_capacity_policies (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 resource_type TEXT NOT NULL,
 warning_percent NUMERIC(6,2) NOT NULL DEFAULT 70,
 critical_percent NUMERIC(6,2) NOT NULL DEFAULT 85,
 target_percent NUMERIC(6,2) NOT NULL DEFAULT 60,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_system_capacity_metrics_user ON system_capacity_metrics(user_id,resource_type,recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_system_capacity_policies_user ON system_capacity_policies(user_id);