create table if not exists campaigns (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  name text not null,
  source text not null default 'other',
  status text not null default 'active',
  token_hash text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table candidates add column if not exists campaign_id uuid references campaigns(id) on delete set null;

create index if not exists campaigns_tenant_idx on campaigns(tenant_id);
create index if not exists candidates_campaign_idx on candidates(campaign_id);

alter table campaigns enable row level security;
create policy campaigns_member_read on campaigns
for select using (tenant_id in (select public.my_tenant_ids()));
create policy campaigns_member_insert on campaigns
for insert with check (tenant_id in (select public.my_tenant_ids()));
create policy campaigns_member_update on campaigns
for update using (tenant_id in (select public.my_tenant_ids()))
with check (tenant_id in (select public.my_tenant_ids()));

-- Public attribution must resolve token_hash server-side before candidate creation.
-- Never expose raw token hashes or tenant IDs to public clients.