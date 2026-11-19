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
| `/buecher` | `BuecherListeView` | Tabelle aller Bücher, Aktionen: Details / Ändern / Löschen |
| `/buecher/neu` | `BuchFormView` | Neues Buch anlegen |
| `/buecher/:id` | `BuchDetailView` | Details und zugehörige Ausleihen (Liste) |
| `/buecher/:id/bearbeiten` | `BuchFormView` | Buch ändern |
| `/ausleihen` | `AusleihenView` | Liste der Ausleihen |

## Datenbindung

Aktuell kommt der Inhalt aus `src/api/buecher.js` (Mock-Store). Für die spätere Anbindung an die Flask-API diese Funktionen durch `fetch('/api/...')` ersetzen. Der Vite-Proxy in `vite.config.js` leitet `/api` schon an `http://localhost:5000` weiter.

## Offen

- [ ] Mock-Store durch HTTP-Calls ersetzen
- [ ] Lade- und Fehlerzustände in den Views anzeigen
- [ ] Ausleihen anlegen und zurückgeben
