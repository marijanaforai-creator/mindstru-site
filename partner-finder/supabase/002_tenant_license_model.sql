-- Partner Finder tenant, membership and licensing foundation

alter table tenants add column if not exists max_users integer not null default 1;
alter table tenants add column if not exists license_expires_at timestamptz;
alter table tenants add column if not exists updated_at timestamptz not null default now();

create table if not exists tenant_invites (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  email text not null,
  role text not null default 'agent',
  token_hash text not null unique,
  expires_at timestamptz not null,
  accepted_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists license_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  event_type text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists tenant_invites_tenant_idx on tenant_invites(tenant_id);
create index if not exists license_events_tenant_created_idx on license_events(tenant_id,created_at desc);

alter table tenant_invites enable row level security;
alter table license_events enable row level security;

create policy tenant_invites_member_read on tenant_invites
for select using (tenant_id in (select public.my_tenant_ids()));

create policy license_events_member_read on license_events
for select using (tenant_id in (select public.my_tenant_ids()));

-- License status values should be enforced server-side:
-- active | trial | suspended | expired | revoked
-- A license event is an audit record; it is not itself authorization.
-- Never place license secrets or token hashes in browser code.