# SWP_Projekt_S-lo_Noah

Bücherei-Portal: ein kleiner Web-Stack mit **Flask** als Datenlieferant und **Vue 3** als Oberfläche.

> **Aktueller Stand:** Projektgerüst (Scaffold). Die echte Datenbindung an eine Datenbank folgt in einem späteren Schritt. Bis dahin liefert das Backend Mock-Daten und das Frontend nutzt einen lokalen Mock-Store.

## Stack

| Ebene | Technik | Zweck |
| --- | --- | --- |
| Backend | Flask + Flask-CORS | REST-API für Bücher und Ausleihen |
| Frontend | Vue 3 + Vite + Vue Router | Listenansicht, Detailansicht, Anlegen/Ändern/Löschen |
| Daten | In-Memory-Mock (später ORM) | Datenbindung kommt später hinzu |

## Projektstruktur

```text
backend/
  app.py                  Flask-App (Factory + CORS)
  requirements.txt
  api/
    routes.py             REST-Endpunkte (CRUD für Bücher, Liste für Ausleihen)
    data.py               Mock-Daten – werden später durch die DB ersetzt
  models/                 Platzhalter für die späteren Datenmodelle
frontend/
  index.html
  package.json
  vite.config.js          Dev-Server + Proxy /api -> localhost:5000
  src/
    main.js
    App.vue               Navigation und Layout
    router/index.js       Routen für Liste, Detail, Formular, Ausleihen
    api/buecher.js        Mock-Store (später HTTP-Calls ans Backend)
    components/           Wiederverwendbare UI-Bausteine
    views/                Seiten des Portals
.github/
  PULL_REQUEST_TEMPLATE.md
CONTRIBUTING.md
```

## API (Stand: Mock)

| Methode | Pfad | Funktion |
| --- | --- | --- |
| `GET` | `/api/buecher` | Alle Bücher (Listenansicht) |
| `GET` | `/api/buecher/<id>` | Ein Buch (Detailansicht) |
| `POST` | `/api/buecher` | Buch anlegen |
| `PUT` | `/api/buecher/<id>` | Buch ändern |
| `DELETE` | `/api/buecher/<id>` | Buch löschen |
| `GET` | `/api/ausleihen` | Ausleihen (Listenansicht) |

## Lokal starten

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate      # Windows
pip install -r requirements.txt
python app.py               # http://localhost:5000
```

### Frontend

```bash
cd frontend
npm install
npm run dev                 # http://localhost:5173
```

Der Vite-Proxy leitet `/api`-Requests schon an `http://localhost:5000` weiter. Für die spätere Datenbindung muss der Mock-Store in `frontend/src/api/buecher.js` nur durch `fetch('/api/...')` ersetzt werden.

## Branchmodell

- `main` – stabiler Stand, nur Releases per Merge aus `develop`
- `develop` – Integrationsbranch für beide Devs
- `feature/*` – kurze Feature-Branches, von `develop` abgezweigt, per PR zurück nach `develop`
- `fix/*` – Bugfixes
- `docs/*` – reine Dokumentationsänderungen

Details stehen in [CONTRIBUTING.md](CONTRIBUTING.md). Die konkrete Aufteilung auf die beiden Developer (Noah = Frontend/Design, Sülo = Backend/Daten) steht in [docs/ARBEITSTEILUNG.md](docs/ARBEITSTEILUNG.md).

## Offene Punkte

- [ ] Datenbankanbindung / echtes Data Binding (Backend + Frontend)
- [ ] Ausleihen vollständig CRUD (Verlängerung, Rückgabe)
- [ ] Validierung und saubere Fehlerresponses
- [ ] Suche und Filter in der Listenansicht
- [ ] Tests (Backend und Frontend)
- [ ] Authentifizierung für Mitarbeiter:innen
