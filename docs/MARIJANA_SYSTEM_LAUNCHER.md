# Marijana System Launcher / Control Plane

Centralni komandni sloj za upravljanje Marijana sistemom.

## Cilj
Launcher ne zamenjuje GitHub, bazu ili hosting. On ih povezuje u kontrolisani deployment i operativni sloj.

## Prva faza
- System Health
- Module Registry
- Deployment readiness
- Migration registry
- Audit log
- Serbian-first UI

## Sledeća faza
1. stvarni health API
2. environment readiness API
3. migration runner
4. module dependency graph
5. GitHub release metadata
6. staging/production kontrola
7. backup/rollback
8. smoke test runner
9. deployment provider adapter
10. permissioned production approval

## Bezbednosno pravilo
Launcher nikada ne treba da izvrši produkcijski deployment samo zato što je korisnik otvorio aplikaciju. Produkcija zahteva eksplicitnu potvrdu i validne credentials/secrets.
