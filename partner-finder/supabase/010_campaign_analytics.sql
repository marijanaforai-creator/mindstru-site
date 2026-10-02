create or replace view campaign_funnel_summary as
select
  c.id as campaign_id,
  c.tenant_id,
  c.name as campaign_name,
  c.source,
  count(distinct ca.candidate_id) as contacted_candidates,
  count(distinct case when x.status = 'CONVERSATION' then x.id end) as conversations,
  count(distinct case when x.status = 'ONBOARDING' then x.id end) as onboarding
from campaigns c
left join candidate_attribution ca on ca.campaign_id = c.id
left join candidates x on x.id = ca.candidate_id
group by c.id, c.tenant_id, c.name, c.source;

-- Keep this view behind the authenticated API.
-- The API must enforce tenant scope before returning rows.