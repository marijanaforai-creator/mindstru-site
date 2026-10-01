# Marijana AI Studio

Marijana AI Studio + Marijana Drive is a modular AI SaaS/source-code product for digital-product creation, marketing, mockups, content workflows and project organization.

## Stack
- Frontend: vanilla HTML/CSS/JavaScript
- API: serverless Node-style functions under /api
- Database: PostgreSQL
- Auth: HttpOnly JWT session cookie
- AI: OpenAI Responses API
- Canva: OAuth 2.0 + PKCE foundation

## Cloud persistence
Set DATABASE_URL, DATABASE_SSL and AUTH_SECRET in the hosting environment.
Run database/schema.sql against PostgreSQL.

## Security
Never commit .env files or API keys. Provider tokens belong server-side, never in localStorage.

## Productization
The repository can later be packaged as a hosted SaaS, white-label starter, commercial source-code license or custom implementation package. Commercial ownership and customer rights should be defined in a separate license agreement.
