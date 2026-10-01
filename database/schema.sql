CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 name TEXT,
 email TEXT UNIQUE NOT NULL,
 password_hash TEXT NOT NULL,
 plan TEXT NOT NULL DEFAULT 'free_trial',
 trial_started_at TIMESTAMPTZ DEFAULT NOW(),
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS projects (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 name TEXT NOT NULL,
 type TEXT NOT NULL DEFAULT 'product',
 status TEXT NOT NULL DEFAULT 'draft',
 data JSONB NOT NULL DEFAULT '{}'::jsonb,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS assets (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
 name TEXT NOT NULL,
 mime_type TEXT,
 storage_key TEXT NOT NULL,
 size_bytes BIGINT,
 metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS connections (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 provider TEXT NOT NULL,
 encrypted_data TEXT NOT NULL,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS usage_events (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 feature TEXT NOT NULL,
 quantity INTEGER NOT NULL DEFAULT 1,
 metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS subscriptions (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 provider TEXT NOT NULL,
 customer_id TEXT,
 subscription_id TEXT,
 plan TEXT NOT NULL,
 status TEXT NOT NULL,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS funnels (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 name TEXT NOT NULL,
 status TEXT NOT NULL DEFAULT 'draft',
 data JSONB NOT NULL DEFAULT '{}'::jsonb,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_projects_user ON projects(user_id,updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_assets_user ON assets(user_id,created_at DESC);
CREATE INDEX IF NOT EXISTS idx_usage_user ON usage_events(user_id,created_at DESC);
CREATE INDEX IF NOT EXISTS idx_funnels_user ON funnels(user_id,updated_at DESC);
