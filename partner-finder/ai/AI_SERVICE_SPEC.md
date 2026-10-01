# Partner Finder — AI Service Architecture

## Request flow
Candidate Detail → authenticated API → tenant authorization → license check → AI service → structured response → dashboard.

## Data minimization
Send only the fields required for conversation preparation. Do not send unrelated tenant data, credentials or private platform configuration.

## Authorization
The AI endpoint must verify the authenticated user and candidate tenant before reading candidate data.

## Licensing
AI usage is a protected commercial capability. The server must verify the tenant license/plan before execution.

## Observability
Record request metadata needed for operational monitoring without storing unnecessary sensitive candidate content in logs.

## Human control
AI output is an assistant draft. The agent decides what to use, edit, send or ignore.

## Future extensions
- conversation summary after a meeting
- follow-up timing suggestions
- email draft
- CRM synchronization
- team analytics

All future extensions must preserve tenant isolation, data minimization and the no-automated-employment-decision rule.