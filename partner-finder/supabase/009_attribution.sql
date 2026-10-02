create table if not exists candidate_attribution (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references candidates(id) on delete cascade,
  campaign_id uuid references campaigns(id) on delete set null,
  source text,
  medium text,
  campaign text,
  content text,
  term text,
  landing_at timestamptz,
  submitted_at timestamptz not null default now()
);

create index if not exists candidate_attribution_candidate_idx
  on candidate_attribution(candidate_id);

create index if not exists candidate_attribution_campaign_idx
  on candidate_attribution(campaign_id);

alter table candidate_attribution enable row level security;

-- Tenant access is derived through the related candidate/campaign.
create policy attribution_member_read on candidate_attribution
for select using (
  exists (
    select 1 from campaigns c
    where c.id = candidate_attribution.campaign_id
      and c.tenant_id in (select public.my_tenant_ids())
  )
  or exists (
    select 1 from candidates x
    where x.id = candidate_attribution.candidate_id
      and x.tenant_id in (select public.my_tenant_ids())
  )
);

-- Public submissions must use a server-side endpoint/service role.
-- Never allow an unauthenticated browser to insert arbitrary tenant attribution.