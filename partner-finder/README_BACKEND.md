# Partner Finder — Backend Setup

## Current foundation
- PostgreSQL/Supabase schema: `data-model.sql`
- Tenant membership + Row Level Security: `supabase/001_partner_finder_rls.sql`
- Candidate API contract: `api/candidate-contract.json`
- Public questionnaire must resolve the tenant server-side; never trust `tenant_id` from the browser.

## Deployment order
1. Create a Supabase project.
2. Run `data-model.sql`.
3. Run `supabase/001_partner_finder_rls.sql`.
4. Create an authenticated user for the first team member.
5. Create the first tenant and `tenant_members` record through a trusted server/admin flow.
6. Add environment variables only to the server/runtime; never commit secrets.
7. Replace dashboard mock data with authenticated database reads.
8. Replace public candidate submission with a server endpoint.
9. Add audit logging, rate limits, validation and production privacy controls.

## Tenant security
Every authenticated dashboard query must be constrained by the current user's tenant membership. The browser must not be able to select another tenant by changing an ID.

## Important
RLS is a security layer, not a substitute for server-side authorization, validation, audit logging, backups, or legal/privacy review.