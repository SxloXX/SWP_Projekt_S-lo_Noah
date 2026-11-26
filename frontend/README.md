# Frontend (Vue 3)

Bücherei-Portal mit Listenansicht, Detailansicht und Formularen zum Anlegen und Ändern von Büchern. Löschen geht direkt aus der Tabelle.

## Start

```bash
npm install
npm run dev
```

Danach: `http://localhost:5173`. Für echte Daten zusätzlich das Backend auf Port 5000 starten.

## Ansichten

| Route | Ansicht | Inhalt |
| --- | --- | --- |
| `/buecher` | `BuecherListeView` | Tabelle mit Suche, Genre-Filter, Sortierung und Pagination; Aktionen: Details / Ändern / Löschen |
| `/buecher/neu` | `BuchFormView` | Neues Buch anlegen |
| `/buecher/:id` | `BuchDetailView` | Details und zugehörige Ausleihen (Liste) |
| `/buecher/:id/bearbeiten` | `BuchFormView` | Buch ändern |
| `/ausleihen` | `AusleihenView` | Liste der Ausleihen |

## Datenbindung

Alle Views holen ihre Daten ausschließlich über die async-Funktionen in `src/api/buecher.js`:

| Funktion | Request |
| --- | --- |
| `ladeBuecher(params)` | `GET /api/buecher` |
| `ladeBuch(id)` | `GET /api/buecher/<id>` |
| `legeBuchAn(daten)` | `POST /api/buecher` |
| `aendereBuch(id, daten)` | `PUT /api/buecher/<id>` |
| `loescheBuch(id)` | `DELETE /api/buecher/<id>` |
| `ladeAusleihen()` | `GET /api/ausleihen` |

- `USE_MOCK = false` (Standard): Requests gehen über `src/api/client.js` an Flask. Der Vite-Proxy in `vite.config.js` leitet `/api` an `http://localhost:5000` weiter.
- `USE_MOCK = true`: lokale Mock-Daten, zum Arbeiten ohne Backend.
- Jede View zeigt einen Lade- und einen Fehlerzustand. Ist das Backend nicht erreichbar, erscheint „Serverfehler … Läuft das Backend?“.

## Offen

- [x] Mock-Store durch HTTP-Calls ersetzen (F1)
- [x] Lade- und Fehlerzustände in den Views anzeigen (F1)
- [x] Suche, Filter, Sortierung, Pagination in der Liste (F2) – vorerst im Frontend, bis Backend B4 die Listenantwort liefert
- [ ] Formular-Validierung pro Feld (F4)
- [ ] Ausleihen anlegen, zurückgeben, verlängern (F5, braucht Backend B3)
- [ ] Responsive Layout und Barrierefreiheit (F6)

## Listenansicht: URL-Parameter

Der Zustand der Liste steht in der URL, damit Links und der Zurück-Button funktionieren:

| Parameter | Werte | Standard |
| --- | --- | --- |
| `suchbegriff` | Text, sucht in Titel und Autor:in | – |
| `genre` | exakter Genre-Name | alle |
| `sortierung` | `id`, `titel`, `autor`, `genre`, `erscheinungsjahr` | `id` |
| `richtung` | `ab` für absteigend | aufsteigend |
| `seite` | Seitennummer ab 1, 10 Bücher pro Seite | `1` |

Die Namen entsprechen `docs/API_VERTRAG.md`, Abschnitt 4. Sobald das Backend sie auswertet (B4), entfallen die Filter-Fallbacks in `src/api/buecher.js` und `BuecherListeView.vue`.
