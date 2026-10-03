CREATE TABLE IF NOT EXISTS mockup_projects (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 name TEXT NOT NULL,
 status TEXT NOT NULL DEFAULT 'draft',
 scene JSONB NOT NULL DEFAULT '{}'::jsonb,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS mockup_templates (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID REFERENCES users(id) ON DELETE CASCADE,
 name TEXT NOT NULL,
 category TEXT NOT NULL,
 template_type TEXT NOT NULL,
 config JSONB NOT NULL DEFAULT '{}'::jsonb,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS mockup_assets (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 project_id UUID REFERENCES mockup_projects(id) ON DELETE CASCADE,
 name TEXT NOT NULL,
 asset_type TEXT NOT NULL,
 storage_key TEXT,
 metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_mockup_projects_user ON mockup_projects(user_id,updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_mockup_templates_category ON mockup_templates(category);
CREATE INDEX IF NOT EXISTS idx_mockup_assets_project ON mockup_assets(project_id,created_at DESC);