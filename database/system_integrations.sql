create table if not exists integration_connections (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null,
  provider text not null,
  name text not null,
  status text not null default 'draft',
  external_url text,
  external_id text,
  config jsonb not null default '{}'::jsonb,
  last_sync_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists integration_field_mappings (
  id uuid primary key default gen_random_uuid(),
  connection_id uuid not null references integration_connections(id) on delete cascade,
  external_field text not null,
  internal_field text not null,
  transform text,
  required boolean not null default false,
  created_at timestamptz not null default now()
);
create table if not exists integration_sync_runs (
  id uuid primary key default gen_random_uuid(),
  connection_id uuid not null references integration_connections(id) on delete cascade,
  direction text not null,
  status text not null default 'running',
  rows_seen integer not null default 0,
  rows_created integer not null default 0,
  rows_updated integer not null default 0,
  rows_failed integer not null default 0,
  error_log jsonb not null default '[]'::jsonb,
  started_at timestamptz not null default now(),
  finished_at timestamptz
);
create index if not exists integration_connections_workspace_idx on integration_connections(workspace_id);
create index if not exists integration_connections_provider_idx on integration_connections(provider);
create index if not exists integration_sync_runs_connection_idx on integration_sync_runs(connection_id,started_at desc);