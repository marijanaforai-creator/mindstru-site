-- Central platform release metadata
create table if not exists platform_releases (
  id uuid primary key default gen_random_uuid(),
  version text not null unique,
  channel text not null default 'preview',
  status text not null default 'draft',
  notes text,
  created_at timestamptz not null default now(),
  published_at timestamptz
);

create table if not exists tenant_rollouts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  release_id uuid not null references platform_releases(id) on delete cascade,
  status text not null default 'pending',
  started_at timestamptz,
  completed_at timestamptz,
  error_message text,
  unique(tenant_id, release_id)
);

create index if not exists tenant_rollouts_status_idx on tenant_rollouts(status);
alter table platform_releases enable row level security;
alter table tenant_rollouts enable row level security;

-- Tenant members may read release state relevant to their tenant.
create policy releases_member_read on platform_releases
for select using (true);

create policy rollouts_member_read on tenant_rollouts
for select using (tenant_id in (select public.my_tenant_ids()));

-- Publishing/release creation must be performed by a trusted central admin service.
-- Do not grant publish/rollout write permissions to ordinary tenant users.