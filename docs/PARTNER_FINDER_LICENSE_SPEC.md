# Partner Finder — License & Anti-Resale Specification

## Identity
Each customer receives a unique Client ID and License ID.

## Verification
The QR code should point to an official verification endpoint using an opaque token. The server checks license status before enabling protected cloud functions.

## Protected services
- candidate database access
- AI functions
- cloud automations
- premium reports
- central updates

## Invalid license behavior
Return a neutral activation/licensing message. Do not expose internal validation rules, secrets, database credentials, or implementation details.

## Updates
Central releases are applied by the service to active tenants. Customers do not receive source code or manual installation packages.

## Contractual controls
Customer terms should prohibit copying, cloning, sublicensing, redistribution, resale, reverse engineering and unauthorized sharing of access. Legal wording should be reviewed for the applicable jurisdiction.

## QR limitation
A QR code is an identifier/verification mechanism, not copy protection by itself. Technical access control, tenant isolation and contractual terms must work together.
