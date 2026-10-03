# Marijana Drive — 50 koraka unapred

## Integracije i podaci
1. Google Forms konekcija
2. Google Sheets transport
3. Apps Script webhook adapter
4. Siguran webhook secret
5. Mapiranje polja
6. Upsert kontakta po emailu
7. Sync log i audit
8. JSON export publike
9. CSV import
10. CSV export

## Publika i CRM
11. Jedinstveni Contact 360
12. Tagovi
13. Segmenti
14. Lead score
15. Consent/status
16. Izvor kontakta
17. Customer journey
18. Duplicate detection
19. Import preview
20. Merge kontakata

## Automatizacije
21. Event bus za audience događaje
22. Trigger: novi lead
23. Trigger: promena segmenta
24. Trigger: promena lead score-a
25. Trigger: novi Google Forms odgovor
26. Action: dodaj tag
27. Action: pokreni email sekvencu
28. Action: kreiraj task
29. Action: obavesti korisnika
30. Retry + dead-letter queue

## Projekti i operacije
31. Project Timeline povezan sa Task Engine
32. Milestone dependency graph
33. Critical path
34. Capacity/workload
35. Forecast završetka
36. Scenario simulator
37. Risk register
38. Budget vs actual
39. Resource assignment
40. Portfolio dashboard

## AI i inteligencija
41. AI Project Planner
42. AI risk detection
43. AI schedule optimizer
44. AI audience segmentation
45. AI lead scoring
46. AI campaign planner
47. AI next-best-action
48. Business Command Center
49. Global Knowledge Graph
50. Marijana AI Operating System

## Pravilo arhitekture
Svaki modul treba da ima UI, API, DB model, audit događaje, permissions, integracioni sloj i jasnu vezu sa ostalim modulima. Ono što je trenutno scaffold/foundation ne tretira se kao produkciono dok se ne poveže sa stvarnim runtime-om, bazom, autentikacijom i providerima.
