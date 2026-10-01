-- Partner Finder MVP data model
-- PostgreSQL/Supabase-ready schema. Production deployment should enable row-level tenant isolation.

create table if not exists tenants (
  id uuid primary key default gen_random_uuid(),
  client_id text unique not null,
  company_name text not null,
  license_id text unique not null,
  plan text not null default 'professional',
  license_status text not null default 'active',
  created_at timestamptz not null default now()
);

create table if not exists candidates (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  name text not null,
  email text,
  phone text,
  city text,
  primary_profile text,
  secondary_profile text,
  interest_level text,
  capacity text,
  scores_json jsonb not null default '{}'::jsonb,
  answers_json jsonb not null default '{}'::jsonb,
  status text not null default 'new',
  consent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists candidate_notes (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  candidate_id uuid not null references candidates(id) on delete cascade,
  author_user_id uuid,
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists followups (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  candidate_id uuid not null references candidates(id) on delete cascade,
  due_at timestamptz not null,
  status text not null default 'open',
  message text,
  created_at timestamptz not null default now()
);

create index if not exists candidates_tenant_status_idx on candidates(tenant_id,status);
create index if not exists candidates_tenant_created_idx on candidates(tenant_id,created_at desc);
create index if not exists followups_tenant_due_idx on followups(tenant_id,due_at);

-- Important: production access policies must enforce tenant_id isolation.
-- Do not expose service-role credentials in browser code.
