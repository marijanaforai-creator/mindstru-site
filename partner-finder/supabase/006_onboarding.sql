create table if not exists onboarding_items (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  candidate_id uuid not null references candidates(id) on delete cascade,
  stage_order integer not null,
  title text not null,
  status text not null default 'pending',
  note text,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists onboarding_candidate_stage_idx on onboarding_items(candidate_id,stage_order);
create index if not exists onboarding_tenant_candidate_idx on onboarding_items(tenant_id,candidate_id);

alter table onboarding_items enable row level security;

create policy onboarding_member_read on onboarding_items
for select using (tenant_id in (select public.my_tenant_ids()));

create policy onboarding_member_update on onboarding_items
for update using (tenant_id in (select public.my_tenant_ids()))
with check (tenant_id in (select public.my_tenant_ids()));

create policy onboarding_member_insert on onboarding_items
for insert with check (tenant_id in (select public.my_tenant_ids()));

-- Application code should create the default checklist when a candidate
-- transitions to ONBOARDING, rather than allowing arbitrary cross-tenant inserts.