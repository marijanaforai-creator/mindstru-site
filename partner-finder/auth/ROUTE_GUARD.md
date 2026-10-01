# Partner Finder — Route Guard

## Public
- `/partner-finder/` — public campaign/landing
- `/partner-finder/questionnaire.html` — public questionnaire
- `/partner-finder/result.html` — candidate informational result
- `/partner-finder/contact.html` — candidate contact request

## Protected
- `/partner-finder/dashboard.html`
- `/partner-finder/candidate.html`
- future manager/admin screens

Protected pages must be backed by server-side session validation. Frontend redirects are only a user-experience layer and are not authorization.

## Authentication flow
1. User opens login.
2. Server authenticates credentials with the configured auth provider.
3. Server creates an httpOnly secure session.
4. Protected API resolves the authenticated user.
5. `tenant_members` determines tenant access.
6. RLS and server authorization restrict records to that tenant.
7. License status gates protected commercial features.

Never put passwords, service-role keys, license secrets, or authorization decisions in client-side JavaScript.