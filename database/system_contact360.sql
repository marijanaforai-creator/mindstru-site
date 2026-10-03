create table if not exists contact_profiles (
 id uuid primary key default gen_random_uuid(),
 workspace_id uuid not null,
 subscriber_id uuid,
 email text,
 name text,
 phone text,
 company text,
 lifecycle_stage text not null default 'lead',
 lead_score integer not null default 0,
 consent_status text not null default 'unknown',
 source text,
 tags jsonb not null default '[]'::jsonb,
 attributes jsonb not null default '{}'::jsonb,
 first_seen_at timestamptz not null default now(),
 last_seen_at timestamptz not null default now(),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create table if not exists contact_interactions (
 id uuid primary key default gen_random_uuid(),
 workspace_id uuid not null,
 contact_id uuid not null references contact_profiles(id) on delete cascade,
 event_type text not null,
 source text,
 value numeric,
 metadata jsonb not null default '{}'::jsonb,
 occurred_at timestamptz not null default now()
);
create table if not exists contact_segments (
 id uuid primary key default gen_random_uuid(),
 workspace_id uuid not null,
 name text not null,
 description text,
 rules jsonb not null default '{}'::jsonb,
 priority integer not null default 0,
 status text not null default 'active',
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create table if not exists contact_segment_memberships (
 contact_id uuid not null references contact_profiles(id) on delete cascade,
 segment_id uuid not null references contact_segments(id) on delete cascade,
 score integer not null default 0,
 assigned_at timestamptz not null default now(),
 primary key(contact_id,segment_id)
);
create index if not exists contact_profiles_workspace_email_idx on contact_profiles(workspace_id,email);
create index if not exists contact_profiles_score_idx on contact_profiles(workspace_id,lead_score desc);
create index if not exists contact_interactions_contact_time_idx on contact_interactions(contact_id,occurred_at desc);