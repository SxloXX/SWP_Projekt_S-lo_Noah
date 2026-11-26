# SWP_Projekt_S-lo_Noah

Bücherei-Portal: ein kleiner Web-Stack mit **Flask** als Datenlieferant und **Vue 3** als Oberfläche.

> **Aktueller Stand:** Projektgerüst (Scaffold). Die echte Datenbindung an eine Datenbank folgt in einem späteren Schritt. Bis dahin liefert das Backend Mock-Daten; das Frontend holt sie über die Flask-API (`USE_MOCK = false`) und kann zum Arbeiten ohne Backend auf einen lokalen Mock-Store umschalten.

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
    api/client.js         fetch-Wrapper für /api mit Fehlermeldungen
    api/buecher.js        Datenservice (async) mit Umschalter USE_MOCK
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

Der Vite-Proxy leitet `/api`-Requests an `http://localhost:5000` weiter. Das Frontend braucht daher das laufende Backend; ohne Backend `USE_MOCK = true` in `frontend/src/api/buecher.js` setzen.

> Hinweis Windows: Ist `python` nicht verfügbar, stattdessen `py` verwenden (`py -m venv .venv`, `py app.py`).

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
- [x] Suche und Filter in der Listenansicht (Frontend, F2) – Backend-Seite folgt mit B4
- [ ] Tests (Backend und Frontend)
- [ ] Authentifizierung für Mitarbeiter:innen
