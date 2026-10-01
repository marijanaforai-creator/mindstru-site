# Partner Finder — MVP Architecture

## Core flow
Landing → 12 questions → scoring → work profile → contact consent → candidate record → agent dashboard → conversation → follow-up → onboarding.

## Data model
- tenants: client_id, company_name, license_id, license_status, plan, created_at
- users: tenant_id, role, email, name, status
- candidates: tenant_id, name, email, phone, city, primary_profile, secondary_profile, interest_level, capacity, scores_json, answers_json, status, consent_at, created_at, updated_at
- notes: tenant_id, candidate_id, author_user_id, body, created_at
- followups: tenant_id, candidate_id, due_at, status, message
- licenses: client_id, license_id, plan, active_from, active_until, status
- audit_log: tenant_id, user_id, action, entity_type, entity_id, created_at

## Status pipeline
NEW → CONTACT → FOLLOW_UP → CONVERSATION → ONBOARDING

## MVP dashboard
- candidate totals
- new candidates
- high-interest candidates
- follow-ups due
- onboarding count
- searchable/filterable candidate table
- candidate detail with answers, scores, notes and AI-prep action

## Security principles
- tenant isolation on every server-side query
- no secrets in frontend
- license verification server-side
- QR contains a verification URL/opaque token, not sensitive data
- AI and cloud functions require active license
- no automated employment suitability decision
- candidate profile is an informational work-preference summary

## Build order
1. Dashboard UI + candidate data model
2. Authentication and tenant isolation
3. Candidate persistence and pipeline
4. License service + Client ID + QR verification
5. AI conversation preparation
6. Email/follow-up automation
7. Admin control plane and central releases
8. Production security, privacy and audit testing
