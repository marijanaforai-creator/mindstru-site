# Partner Finder — Tenant & License Model

## Commercial object
Each customer receives:
- Client ID
- License ID
- company/agency name
- plan
- license status
- expiration date
- maximum users
- isolated candidate data

## Roles
- agent: own assigned workflow access
- manager: team/candidate management
- admin: tenant configuration and member administration

## Central platform vs tenant
The central platform owns the application code, releases and shared capabilities.
Each tenant owns its candidates, notes, follow-ups, users and configuration.
Central releases must never expose one tenant's data to another.

## License lifecycle
TRIAL → ACTIVE → SUSPENDED/EXPIRED → REACTIVATED or REVOKED

License checks happen server-side. The browser may display status but cannot authorize itself.

## Future admin control center
Planned central controls:
- tenant list
- license status
- plan
- users
- release version
- feature flags
- audit events
- suspend/reactivate
- staged rollout

Any production implementation still requires secure secret management, backups, audit logging, rate limiting and privacy/legal review.