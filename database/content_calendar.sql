CREATE TABLE IF NOT EXISTS content_items (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
 title TEXT NOT NULL,
 channel TEXT NOT NULL DEFAULT 'Instagram',
 format TEXT NOT NULL DEFAULT 'Objava',
 status TEXT NOT NULL DEFAULT 'Ideja',
 scheduled_at TIMESTAMPTZ,
 content TEXT,
 metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_content_items_user_date ON content_items(user_id,scheduled_at);
