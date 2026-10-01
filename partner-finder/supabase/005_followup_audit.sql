-- Operational audit trail for candidate workflow.
create table if not exists candidate_timeline (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  candidate_id uuid not null references candidates(id) on delete cascade,
  actor_user_id uuid references auth.users(id) on delete set null,
  event_type text not null,
  event_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists candidate_timeline_candidate_idx on candidate_timeline(candidate_id,created_at desc);
create index if not exists candidate_timeline_tenant_idx on candidate_timeline(tenant_id,created_at desc);

alter table candidate_timeline enable row level security;

create policy timeline_member_read on candidate_timeline
for select using (tenant_id in (select public.my_tenant_ids()));

create policy timeline_member_insert on candidate_timeline
for insert with check (tenant_id in (select public.my_tenant_ids()));

-- Follow-up records should remain tenant-isolated through the existing
-- followups RLS policies. Application code must verify candidate ownership
-- before creating or modifying a follow-up.