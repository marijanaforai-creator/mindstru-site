-- Partner Finder production security foundation
-- Run in Supabase SQL editor after the base schema.

alter table tenants enable row level security;
alter table candidates enable row level security;
alter table candidate_notes enable row level security;
alter table followups enable row level security;

-- Membership table connects authenticated users to a tenant.
create table if not exists tenant_members (
  user_id uuid not null references auth.users(id) on delete cascade,
  tenant_id uuid not null references tenants(id) on delete cascade,
  role text not null default 'agent',
  created_at timestamptz not null default now(),
  primary key (user_id, tenant_id)
);

create index if not exists tenant_members_tenant_idx on tenant_members(tenant_id);
alter table tenant_members enable row level security;

-- Security helper: returns tenant IDs available to the current authenticated user.
create or replace function public.my_tenant_ids()
returns setof uuid
language sql
stable
security definer
set search_path = public
as $$
  select tenant_id from public.tenant_members where user_id = auth.uid();
$$;

create policy tenant_members_self_read on tenant_members
for select using (user_id = auth.uid());

create policy tenants_member_read on tenants
for select using (id in (select public.my_tenant_ids()));

create policy candidates_member_read on candidates
for select using (tenant_id in (select public.my_tenant_ids()));

create policy candidates_member_insert on candidates
for insert with check (tenant_id in (select public.my_tenant_ids()));

create policy candidates_member_update on candidates
for update using (tenant_id in (select public.my_tenant_ids()))
with check (tenant_id in (select public.my_tenant_ids()));

create policy candidate_notes_member_read on candidate_notes
for select using (tenant_id in (select public.my_tenant_ids()));

create policy candidate_notes_member_insert on candidate_notes
for insert with check (tenant_id in (select public.my_tenant_ids()));

create policy followups_member_read on followups
for select using (tenant_id in (select public.my_tenant_ids()));

create policy followups_member_insert on followups
for insert with check (tenant_id in (select public.my_tenant_ids()));

-- Production rule: candidate creation from the public questionnaire must NOT
-- use a browser-supplied tenant_id. Resolve the tenant server-side from a
-- verified campaign/license token, then insert with trusted backend credentials.
-- Never expose a Supabase service-role key in frontend JavaScript.