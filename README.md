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

## Marijana Workflow

The platform is organized as a guided workflow: Idea → Product → Offer → Landing Page → Lead Magnet → Email → Checkout → Distribution → Automation → Analytics.

## Prompt Library

The prompt catalog is categorized by task and has free and premium tiers. Payment and entitlement enforcement will be connected during the billing phase.

## External platform layer

- Canva: OAuth/API foundation
- Pinterest: OAuth/API foundation
- systeme.io: API adapter foundation
- Marijana Drive: cloud projects and assets
