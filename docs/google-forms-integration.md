# Google Forms ↔ Marijana Publika

## Arhitektura
Google Form → Google Sheet → Google Apps Script → Marijana webhook → Marijana Publika/Kontakti → Segmentacija → Newsletter/Funnel.

## Zašto ovako
Trenutno nema aktivnog Google Forms/Drive konektora u okruženju, zato ne pretpostavljamo pristup privatnom Google nalogu. Google Sheet je stabilan transportni sloj i omogućava import, webhook sync i export.

## Mapiranje
Podrazumevana polja:
- Ime → name
- Email → email
- Telefon → phone
- Izvor → source
- Status saglasnosti → status
- sve ostalo → attributes

## Produkcioni sledeći sloj
HMAC/webhook secret, OAuth kada Google konektor bude dostupan, retry/backoff, deduplikacija po external response ID, consent audit, rate limiting, dead-letter queue i scheduler za periodični pull.
