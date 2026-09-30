# Marijana Drive — Platforma za automatizaciju i sadržaj

## Cilj

Marijana Drive je modularna platforma za:
- AI pisanje i uređivanje sadržaja
- captione, carousel tekstove i video skripte
- blog i SEO sadržaj
- grupnu (bulk) obradu
- kalendar i zakazivanje
- povezivanje više naloga društvenih mreža
- povezivanje različitih sajtova
- automatizacije zasnovane na okidačima i radnjama
- dokumente i obradu PDF/DOCX/PNG/JPG sadržaja
- analitiku i kasniju monetizaciju kroz pakete

## Princip rada

AI generiše nacrt. Korisnik pregleda, dodaje, briše i menja sadržaj. Tek nakon odobrenja sadržaj može biti zakazan ili objavljen.

**Generate → Review → Edit → Approve → Schedule → Publish**

## Glavni moduli

1. Dashboard
2. Sadržaj
   - AI Pisac
   - Captioni
   - Carousel
   - Video/Reels skripte
   - Pinterest sadržaj
   - Email
   - Oglasi
   - SEO
3. Uređivač
   - Single editor
   - Bulk editor
   - Šabloni
   - Medijska biblioteka
   - Varijante
4. Blog Studio
5. Kalendar i Scheduler
6. Automatizacije
7. Društveni nalozi
   - Pinterest
   - Instagram
   - Facebook Pages
   - LinkedIn
   - X/Twitter
   - Threads
8. Moji sajtovi
   - WordPress
   - GitHub/custom website
   - Custom API
   - Webhook
   - Export
9. Dokumenti
10. Analitika
11. Korisnici, radni prostori i klijenti
12. Billing/planovi

## Multi-account

Platforma se projektuje tako da tehnički podrži više naloga. Limit od 20 naloga treba da bude poslovno pravilo plana, a ne hard-coded arhitektonsko ograničenje.

Svaki povezani nalog ima sopstvenu autorizaciju i identitet.

## Content Atomizer

Jedan izvorni sadržaj može se pretvoriti u:
- blog
- Pinterest Pinove
- Instagram carousel
- Instagram caption
- Facebook objavu
- LinkedIn objavu
- X objavu
- Threads objave
- email/newsletter

Sve izvedene verzije ostaju povezane sa originalnim sadržajem.

## Automation Builder

Osnovni model:

**WHEN → IF → DO → THEN**

Primer:

New blog published
→ generate social variants
→ user review
→ schedule
→ publish to selected accounts

Automatizacije moraju imati istoriju izvršavanja, status i mogućnost pauziranja.

## Website Connector

Korisnik ne mora da koristi GitHub.

Platforma treba da podrži više načina povezivanja:
- WordPress
- GitHub/custom site
- Custom API
- Webhook
- Export-only

Marijana Website System može kasnije biti zaseban proizvod koji se prirodno povezuje sa Marijana Drive platformom.

## UI sistem

Planirani interni design system: **Marijana UI**

Obuhvata:
- tipografiju
- boje
- spacing
- dugmad
- forme
- kartice
- tabele
- dashboard
- editor
- calendar
- modale
- obaveštenja

## Razvojni redosled

### MVP 1
- aplikaciona struktura
- dashboard
- autentikacija
- workspace
- Content Editor
- Caption/Carousel generator
- ručno uređivanje
- Media Library

### MVP 2
- Bulk Editor
- Calendar
- Scheduler
- Pinterest connector
- Account Manager

### MVP 3
- Blog Studio
- Website Connector
- Content Atomizer
- Instagram/Facebook

### MVP 4
- LinkedIn
- X
- Threads
- Automation Builder
- Analytics

### MVP 5
- Billing
- planovi
- account limits
- Agency/workspace funkcije

## Bezbednost

- OAuth umesto čuvanja lozinki društvenih mreža
- secrets samo u server-side environment varijablama
- korisnički nalozi izolovani
- workspace permissions
- audit/automation history
- mogućnost opoziva povezivanja

## Napomena

Ovaj dokument je početna specifikacija. Pre izrade produkcionog koda prvo treba pregledati postojeću strukturu sajta i odlučiti da li se Marijana Drive ugrađuje u postojeći frontend ili dobija zaseban app paket u istom repository-ju.
