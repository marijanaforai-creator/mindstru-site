-- Analytics foundations. Production queries should be exposed through
-- authenticated server endpoints or tightly controlled database views.

create or replace view public.partner_finder_candidate_status_counts as
select tenant_id, status, count(*)::bigint as candidate_count
from public.candidates
group by tenant_id, status;

create or replace view public.partner_finder_profile_counts as
select tenant_id, primary_profile, count(*)::bigint as candidate_count
from public.candidates
group by tenant_id, primary_profile;

create or replace view public.partner_finder_capacity_counts as
select tenant_id, capacity, count(*)::bigint as candidate_count
from public.candidates
group by tenant_id, capacity;

-- Views intentionally contain tenant_id so the server can enforce the
-- authenticated tenant scope. Do not expose unrestricted views directly
-- to anonymous clients.