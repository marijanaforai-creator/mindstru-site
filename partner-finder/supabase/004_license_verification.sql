-- License verification records.
-- Store only a hash of the opaque verification token.
create table if not exists license_verification_tokens (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  token_hash text not null unique,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  last_checked_at timestamptz
);

create index if not exists license_tokens_tenant_idx on license_verification_tokens(tenant_id);
alter table license_verification_tokens enable row level security;

-- Public verification must be implemented through a controlled server endpoint.
-- Do not grant anonymous direct table access.
-- The endpoint hashes the supplied opaque token, looks up the record, then
-- returns only public verification fields.
-- Rate limiting and abuse monitoring belong at the API/edge layer.