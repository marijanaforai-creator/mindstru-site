# Marijana AI Studio — Connections

## Canva

1. Create a Canva app in the Canva Developer Portal.
2. Add the redirect URL:
   https://YOUR-DOMAIN.example/api/canva/callback
3. Copy the Canva Client ID and Client Secret into server environment variables:
   CANVA_CLIENT_ID
   CANVA_CLIENT_SECRET
   CANVA_REDIRECT_URI
4. Deploy the `api/` functions on a serverless Node platform.
5. Never put the Canva Client Secret, access token, or refresh token in frontend code, localStorage, or GitHub.

The current callback performs the OAuth Authorization Code + PKCE exchange. The next production step is to persist the returned refresh token in a server-side encrypted database/session store. Canva requires the token exchange to happen from the backend because client authentication uses the client secret.

## OpenAI

Set OPENAI_API_KEY only as a server environment variable. The frontend should call a server endpoint such as `/api/openai/generate`; the browser must never receive the API key.

## Deployment

The current Marijana AI Studio is a static frontend. OAuth cannot be completed securely from static HTML alone. Deploy the `api/` directory with the same public domain as the Studio, then register the exact callback URL with Canva.
