# Arbeitsteilung im Bücherei-Portal

Stand: 2026-11-19 · 2 Developer

## Rollen

| Developer | Verantwortung | Besitzt (Dateien) |
| --- | --- | --- |
| **Noah** | Frontend & Design | `frontend/**` |
| **Sülo** | Backend & Daten | `backend/**` |
| **Beide** | Vertrag, Integration, Reviews, README | `docs/**`, `README.md`, `CONTRIBUTING.md` |

Grundsatz: Noah baut die Oberfläche, Sülo liefert die Daten. Was beide betrifft, wird vorab gemeinsam festgelegt und per PR vom jeweils anderen gegengelesen.

## Phase 0 – gemeinsam erledigen

Bevor die Pakete parallel starten, gemeinsam festlegen und in `docs/API_VERTRAG.md` bzw. `docs/DATENMODELL.md` festhalten:

- **Entitäten:** `Buch`, `Autor`, `Mitglied`, `Ausleihe` mit Feldern und Beziehungen
- **Endpunkte:** `/api/buecher`, `/api/ausleihen`, `/api/autoren`, `/api/mitglieder`
- **JSON-Formate:** z. B. `Buch = { id, titel, autor, isbn, erscheinungsjahr, genre, verfuegbar }`
- **Statuscodes:** `200/201/204`, `400` Validierung, `404` nicht gefunden, `409` Löschen mit aktiver Ausleihe
- **Listenantwort:** `GET /api/buecher?suchbegriff=&genre=&seite=` → `{ "ergebnisse": [...], "gesamt": n, "seite": n }`

Branch dafür: `docs/api-vertrag` (eine Person schreibt, die andere reviewed).

---

## Noah – Frontend & Design

| Paket | Branch | Inhalt | Ergebnis |
| --- | --- | --- | --- |
| F1 API-Client | `feature/frontend-api-binding` | Mock-Store in `src/api/buecher.js` durch `fetch('/api/...')` ersetzen, Lade- und Fehlerzustände einbauen | Frontend spricht mit Flask |
| F2 Listenansicht | `feature/frontend-buch-liste` | Tabelle mit Suche, Genre-Filter, Sortierung und Pagination | `/buecher` fertig |
| F3 Detailansicht | `feature/frontend-buch-detail` | Buchdetails, Status und zugehörige Ausleihen als Liste | `/buecher/:id` fertig |
| F4 Formulare | `feature/frontend-buch-formulare` | Anlegen und Ändern mit Validierung, Löschen mit Bestätigung | `/buecher/neu` und `/bearbeiten` fertig |
| F5 Ausleihen-UI | `feature/frontend-ausleihen` | Ausleihen auflisten, ausleihen, zurückgeben, verlängern | `/ausleihen` fertig |
| F6 Design/UX | `feature/frontend-design` | Navigation, Farben, Typografie, Responsive Layout, Barrierefreiheit, `npm run build` | poliertes Frontend |

**Noah entscheidet allein über:** `frontend/**` und den UI-Teil der README.

Als Startpunkt dient der vorhandene Branch `feature/frontend-vue-portal`; neue Pakete werden aber frisch von `develop` abgezweigt.

---

## Sülo – Backend & Daten

| Paket | Branch | Inhalt | Ergebnis |
| --- | --- | --- | --- |
| B1 Datenmodell | `feature/backend-datenmodell` | SQLAlchemy-Modelle + Alembic-Migrationen für Buch/Autor/Mitglied/Ausleihe, Seed-Daten | DB-Schema steht |
| B2 Data Binding | `feature/backend-db-binding` | In-Memory-Mock in `api/data.py` durch DB-Queries ersetzen, Routen bleiben stabil | API liefert echte Daten |
| B3 Ausleihen-API | `feature/backend-ausleihen-api` | `GET/POST /api/ausleihen`, `PUT /api/ausleihen/{id}/rueckgabe`, Verlängerung, `GET /api/autoren`, `GET /api/mitglieder` | komplette Bücherei-API |
| B4 Suche/Validierung | `feature/backend-validation-search` | Filter, Suche, Pagination, saubere 400/404/409-Fehler | stabile API |
| B5 Tests & Doku | `feature/backend-tests` | `pytest`-Tests für CRUD und Fehlerfälle, API-Doku aktualisieren | `pytest` grün |
| B6 Auth (optional) | `feature/backend-auth` | Login für Mitarbeiter:innen, Schutz schreibender Endpunkte | geschützte API |

**Sülo entscheidet allein über:** `backend/**` und den API-Teil der README.

Als Startpunkt dient der vorhandene Branch `feature/backend-flask-api`; neue Pakete werden aber frisch von `develop` abgezweigt.

---

## Ablauf mit Synchronisation

| Schritt | Noah | Sülo | Sync |
| --- | --- | --- | --- |
| 1 | Phase 0: API-Vertrag | Phase 0: Datenmodell | ✅ Vertrag steht |
| 2 | F1 API-Client (mit Mock-Fallback) | B1 Datenmodell | ✅ Schnittstelle passt |
| 3 | F2 Listenansicht | B2 Data Binding | ✅ erster Full-Stack-Test |
| 4 | F3 Detail + F4 Formulare | B3 Ausleihen-API | ✅ CRUD komplett nutzbar |
| 5 | F5 Ausleihen-UI + F6 Design | B4 Suche/Validierung | ✅ Features komplett |
| 6 | Build/Checks | B5 Tests | ✅ Release auf `main` |

## Gemeinsame Regeln

- Alle neuen Branches von `develop` abzweigen, per PR nach `develop` mergen.
- Kein direkter Commit auf `main`; `main` nur per Release-Merge aus `develop`.
- Jeder PR wird vom jeweils anderen reviewed (24 h als Faustregel).
- `README.md`, `CONTRIBUTING.md` und `docs/**` nur mit Review des anderen ändern.
- Shared Files nicht gleichzeitig auf beiden Branches anfassen.

## Definition of Done

**Frontend (Noah):** Route erreichbar · nutzt den API-Client statt Mock · Lade-/Fehlerzustand sichtbar · `npm run build` grün · PR von Sülo reviewed · in `develop` gemergt.

**Backend (Sülo):** Endpunkt im API-Vertrag dokumentiert · Statuscodes korrekt · `pytest` deckt Erfolg, 400, 404 und 409 ab · PR von Noah reviewed · in `develop` gemergt.
