CREATE TABLE IF NOT EXISTS drive_folders (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 parent_id UUID REFERENCES drive_folders(id) ON DELETE CASCADE,
 name TEXT NOT NULL,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_drive_folders_user ON drive_folders(user_id,updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_drive_folders_parent ON drive_folders(user_id,parent_id);