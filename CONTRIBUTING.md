# Mitarbeit am Bücherei-Portal

## Branchregeln

- Es wird **nie** direkt auf `main` committed.
- Neue Arbeit beginnt immer auf dem aktuellen `develop`:

  ```bash
  git checkout develop
  git pull --rebase origin develop
  git checkout -b feature/mein-feature
  ```

- Namensschema:
  - `feature/…` – neue Funktionalität, z. B. `feature/backend-flask-api`
  - `fix/…` – Fehlerbehebung, z. B. `fix/buch-loeschen-404`
  - `docs/…` – Dokumentation
- Pull Requests gehen immer nach `develop`. `main` wird nur zu Release-Zeiten aus `develop` gemergt.
- Bei zwei Devs gilt: Der andere Dev reviewed den PR, bevor er gemergt wird.

## Commits

- Kurz, im Imperativ: `add buch detail view`, `fix delete endpoint status code`.
- Ein Commit = eine inhaltliche Änderung. Keine „WIP"-Commits in PRs.
- Vor dem Push: `git fetch origin` und ggf. `git rebase origin/develop`.

## PR-Checkliste

- [ ] Branch ist auf dem neuesten Stand von `develop`
- [ ] Backend: `python -m compileall .` läuft ohne Fehler
- [ ] Frontend: `npm run build` läuft ohne Fehler
- [ ] Neue Endpunkte/Routen sind in der README dokumentiert
- [ ] Keine Secrets oder `.venv`/`node_modules` eingecheckt
