# Agent-Übergabe – Bücherei-Portal

Stand: 2026-11-26

Dieses Dokument übergibt den kompletten Projektstand an einen neuen Agenten. Bitte zusätzlich `README.md`, `CONTRIBUTING.md` und `docs/ARBEITSTEILUNG.md` lesen.

## 1. Projekt und Ort

- **Lokaler Pfad:** `C:\Users\noahbaumann\SWP_Projekt_S-lo_Noah`
- **Remote (`origin`):** `https://github.com/SxloXX/SWP_Projekt_S-lo_Noah.git`
- **Ziel:** Bücherei-Portal. Flask-Webserver liefert Daten, Vue 3 stellt sie dar (Listenansicht, Detailansicht, Anlegen/Ändern/Löschen, Tabellen und Listen).
- **Datenbindung:** Bewusst noch nicht echt an eine DB angebunden. Backend nutzt In-Memory-Mock (`backend/api/data.py`), Frontend nutzt einen Mock-Store mit Umschalter. Das ist gewollt und kommt später.

## 2. Rollen

| Developer | Verantwortung | Besitzt |
| --- | --- | --- |
| **Noah** (der User) | Frontend & Design | `frontend/**` |
| **Sülo** | Backend & Daten | `backend/**` |
| **Beide** | Vertrag, Doku, Reviews | `docs/**`, `README.md`, `CONTRIBUTING.md` |

## 3. Branch- und Commit-Stand

| Branch | Stand | Zweck |
| --- | --- | --- |
| `main` | Release-Stand – aktuellen Hash mit `git log` prüfen | enthält Gerüst + Arbeitsteilung + Handoff |
| `develop` | Integrationsbranch – aktuellen Hash mit `git log` prüfen | enthält alle gemergten Feature- und Docs-Branches |
| `feature/frontend-api-binding` | `64dac5f` | **Noahs aktueller Arbeitsbranch** – 3 neue Commits, noch nicht gemergt |
| `feature/backend-flask-api` | `5e9f6fe` | Sülos Flask-API (bereits nach develop gemergt) |
| `feature/frontend-vue-portal` | `3c8869d` | Ursprüngliches Vue-Gerüst (bereits gemergt) |
| `docs/arbeitsteilung` | `9b1946f` | Rollenverteilung (bereits gemergt) |
| `docs/handoff` | – | Dieses Dokument (bereits nach develop und main gemergt) |

Alle Branches sind gepusht. `feature/frontend-api-binding` ist **noch nicht** nach `develop` gemergt und liegt deshalb mehrere Docs-Commits hinter `develop` – ein PR sollte konfliktfrei möglich sein. Arbeitsverzeichnis zuletzt sauber.

## 4. Was Noah in der letzten Runde gemacht hat (~1,3 h)

Drei Commits auf `feature/frontend-api-binding`:

1. `bf3ede7` – `feat(frontend): add small fetch client for the Flask API`  
   Neue Datei `frontend/src/api/client.js`: kleiner `fetch`-Wrapper mit Prefix `/api`, JSON-Parsing und Fehlermeldungen aus dem Backend.

2. `276d3d4` – `refactor(frontend): add async data service with mock fallback`  
   `frontend/src/api/buecher.js`: neue async-Funktionen `ladeBuecher`, `ladeBuch`, `legeBuchAn`, `aendereBuch`, `loescheBuch`, `ladeAusleihen`. Umschalter `USE_MOCK = true`. Die **alten** Exports `useBuecher` / `useAusleihen` wurden absichtlich noch gelassen, damit die restlichen Views weiterlaufen.

3. `64dac5f` – `feat(frontend): load book list through async service`  
   `frontend/src/views/BuecherListeView.vue`: lädt über den Service, mit `laden`- und `fehler`-State; Löschen geht ebenfalls über den async Service.

**Wichtig:** Ein halbfertiger Umbau von `BuchDetailView.vue` wurde bewusst **verworfen** (mit `git restore`). Die Datei ist wieder im Ursprungszustand. Es gibt keine uncommitteten Änderungen.

## 5. Entscheidungen und Fallen

- `USE_MOCK` steht in `frontend/src/api/buecher.js` auf `true`. Erst auf `false` setzen, wenn Sülos API läuft.
- Der Vite-Proxy leitet `/api` bereits an `http://localhost:5000` weiter (`frontend/vite.config.js`).
- Alte Mock-Exports erst entfernen, wenn **alle** Views auf die async-Funktionen umgestellt sind – sonst bricht der Build.
- Optisch hat sich noch nichts geändert: die Mock-Daten sind identisch mit den alten Daten. Sichtbarer Fortschritt kommt mit Suche/Filter und Design.
- **Python-Befehl:** `python` ist auf diesem Rechner nicht verfügbar. Stattdessen `py` benutzen (Python 3.14).
- Node/npm sind verfügbar (Node 24). `npm install` wurde schon ausgeführt, `package-lock.json` ist committet.
- Der zuletzt gestartete Dev-Server wurde beendet („cancelled because the server restarted“). Neu starten mit `npm run dev` im Ordner `frontend`.
- GitHub CLI (`gh`) ist **nicht** installiert. Branch-Schutz konnte deshalb nicht per API geprüft oder gesetzt werden.

## 6. Offene Aufgaben – Noah (Frontend)

| Aufgabe | Datei | ca. Aufwand |
| --- | --- | --- |
| Detailansicht auf `ladeBuch` / `ladeAusleihen` umstellen | `src/views/BuchDetailView.vue` | 45 min |
| Formulare auf `legeBuchAn` / `aendereBuch` umstellen | `src/views/BuchFormView.vue` | 45 min |
| Ausleihen-Ansicht auf `ladeAusleihen` / `ladeBuecher` umstellen | `src/views/AusleihenView.vue` | 30 min |
| Alte Exports `useBuecher` / `useAusleihen` entfernen | `src/api/buecher.js` | 15 min |
| Suche, Genre-Filter, Sortierung, Pagination | `src/views/BuecherListeView.vue` | 2–3 h |
| Design/UX, Responsive, Barrierefreiheit | `src/style.css` | 2–4 h |
| Ausleihen-UI (hängt von Sülos B3 ab) | `src/views/AusleihenView.vue` | 3 h |
| Reviews und Integration | – | laufend |

Details stehen in `docs/ARBEITSTEILUNG.md` (Pakete F1–F6).

## 7. Offene Aufgaben – Sülo (Backend)

Pakete B1–B6 aus `docs/ARBEITSTEILUNG.md`: Datenmodell/SQLAlchemy, Data Binding, Ausleihen-API, Suche/Validierung, Tests, optional Auth.

## 8. Workflow und Reviews

- Kein direkter Commit auf `main` oder `develop`.
- Neue Branches immer von `develop` abzweigen.
- PR geht nach `develop`; der **andere** Dev reviewed (1 Approval genügt).
- `main` nur per Release-Merge aus `develop`.
- Aktuell ist **kein** GitHub-Branch-Schutz technisch eingerichtet – die Regel steht nur in `CONTRIBUTING.md`.
- Es kann jetzt schon ein **Draft-PR** `feature/frontend-api-binding` → `develop` geöffnet werden. Gemergt wird erst nach Review und abgeschlossenem F1.
- Branch-Schutz falls gewünscht: GitHub → Settings → Branches → Ruleset für `main` und `develop` mit „Require a pull request before merging“ und „Require approvals: 1“. „Require status checks“ erst mit CI aktivieren.

## 9. Nützliche Befehle

```bash
# Frontend starten
cd C:\Users\noahbaumann\SWP_Projekt_S-lo_Noah\frontend
npm run dev                 # http://localhost:5173

# Frontend bauen
npm --prefix frontend run build

# Backend starten
cd C:\Users\noahbaumann\SWP_Projekt_S-lo_Noah\backend
py -m pip install -r requirements.txt
py app.py                   # http://localhost:5000

# Backend-Syntax prüfen
py -m compileall -q backend

# Git-Stand
git status --short --branch
git log --oneline --graph --all --decorate
```

## 10. Letzte Verifikation

- `npm --prefix frontend run build`: grün
- `py -m compileall -q backend`: grün
- Browser unter `http://127.0.0.1:5173/buecher`: 3 Bücher sichtbar, keine Konsolenfehler

## 11. Bewusst noch nicht erledigt

- `docs/VUE_CHEATSHEET.md` wurde angeboten, aber **nicht** erstellt.
- GitHub-Actions-CI nicht eingerichtet.
- Branch-Schutz nicht eingerichtet.
- Kein Merge von `feature/frontend-api-binding` nach `develop`.
