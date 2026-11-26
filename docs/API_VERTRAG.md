# API-Vertrag – Bücherei-Portal

Stand: 2026-11-26 · **Entwurf von Noah, Review durch Sülo ausstehend**

Dieses Dokument legt fest, wie Frontend (Vue) und Backend (Flask) miteinander sprechen. Beide Seiten bauen gegen diesen Vertrag; Änderungen nur per PR mit Review des anderen. Das Datenmodell selbst (Tabellen, Beziehungen, Migrationen) beschreibt Sülo in `docs/DATENMODELL.md`.

Legende: ✅ = so schon im Backend umgesetzt · 🆕 = neu, muss noch gebaut werden (Paket in Klammern)

## 1. Allgemeines

- Basis-Pfad: `/api` (Vite-Proxy leitet im Dev-Modus an `http://localhost:5000` weiter)
- Format: JSON, UTF-8, Feldnamen in `snake_case` auf Deutsch ohne Umlaute (`erscheinungsjahr`, `rueckgabe_am`)
- Datumsfelder: ISO-Format `YYYY-MM-DD` als String
- IDs: positive Ganzzahlen, vom Backend vergeben

## 2. Ressourcen

### Buch

```json
{
  "id": 1,
  "titel": "Der Zauberberg",
  "autor": "Thomas Mann",
  "isbn": "978-3-16-148410-0",
  "erscheinungsjahr": 1924,
  "genre": "Roman",
  "verfuegbar": true
}
```

| Feld | Typ | Pflicht beim Anlegen | Regeln |
| --- | --- | --- | --- |
| `id` | int | – (vom Backend) | nur lesend |
| `titel` | string | ja | 1–200 Zeichen, nicht nur Leerzeichen |
| `autor` | string | ja | 1–200 Zeichen |
| `isbn` | string | nein | leer oder ISBN-10/13 (Bindestriche erlaubt) |
| `erscheinungsjahr` | int \| null | nein | 0 bis aktuelles Jahr |
| `genre` | string | nein | frei, max. 50 Zeichen |
| `verfuegbar` | bool | – | **wird vom Backend berechnet**: `false`, sobald es eine aktive Ausleihe gibt (siehe offene Frage 1) |

### Ausleihe

```json
{
  "id": 2,
  "buch_id": 1,
  "mitglied": "Jonas Weber",
  "mitglied_id": 2,
  "ausgeliehen_am": "2026-11-01",
  "rueckgabe_am": "2026-12-01",
  "zurueckgegeben_am": null,
  "verlaengerungen": 0
}
```

| Feld | Typ | Regeln |
| --- | --- | --- |
| `buch_id` | int | muss existieren |
| `mitglied` | string | Anzeigename (bleibt für die Liste erhalten) |
| `mitglied_id` | int | 🆕 (B1) |
| `ausgeliehen_am` | date | vom Backend gesetzt (heute) |
| `rueckgabe_am` | date | Standard: `ausgeliehen_am` + 28 Tage |
| `zurueckgegeben_am` | date \| null | 🆕 (B3) – `null` = Ausleihe ist aktiv |
| `verlaengerungen` | int | 🆕 (B3) – max. 2 |

### Autor:in 🆕 (B3)

```json
{ "id": 1, "name": "Thomas Mann" }
```

### Mitglied 🆕 (B3)

```json
{ "id": 1, "name": "Anna Schmidt", "email": "anna@example.org" }
```

## 3. Endpunkte

### Bücher

| Methode | Pfad | Antwort | Fehler | Stand |
| --- | --- | --- | --- | --- |
| `GET` | `/api/buecher` | `200` Listenantwort (siehe 4) | `400` ungültige Parameter | ✅ als reine Liste · 🆕 Listenantwort (B4) |
| `GET` | `/api/buecher/<id>` | `200` Buch | `404` | ✅ |
| `POST` | `/api/buecher` | `201` angelegtes Buch | `400` Validierung | ✅ (Validierung nur titel/autor) |
| `PUT` | `/api/buecher/<id>` | `200` geändertes Buch | `400`, `404` | ✅ (ohne Validierung) |
| `DELETE` | `/api/buecher/<id>` | `204` leer | `404`, `409` aktive Ausleihe | ✅ ohne `409` · 🆕 `409` (B4) |

`PUT` ist ein Teil-Update: nur mitgeschickte Felder werden geändert. `verfuegbar` wird ignoriert, sobald es berechnet wird.

### Ausleihen

| Methode | Pfad | Body | Antwort | Fehler | Stand |
| --- | --- | --- | --- | --- | --- |
| `GET` | `/api/ausleihen?buch_id=&aktiv=true` | – | `200` Liste von Ausleihen | `400` | ✅ ohne Filter · 🆕 Filter (B3) |
| `POST` | `/api/ausleihen` | `{ "buch_id": 1, "mitglied_id": 2 }` | `201` Ausleihe | `400`, `404` Buch/Mitglied, `409` Buch schon ausgeliehen | 🆕 (B3) |
| `PUT` | `/api/ausleihen/<id>/rueckgabe` | – | `200` Ausleihe mit `zurueckgegeben_am` | `404`, `409` schon zurückgegeben | 🆕 (B3) |
| `PUT` | `/api/ausleihen/<id>/verlaengerung` | – | `200` Ausleihe, `rueckgabe_am` + 14 Tage | `404`, `409` max. Verlängerungen erreicht oder zurückgegeben | 🆕 (B3) |

### Stammdaten

| Methode | Pfad | Antwort | Stand |
| --- | --- | --- | --- |
| `GET` | `/api/autoren` | `200` Liste von Autor:innen | 🆕 (B3) |
| `GET` | `/api/mitglieder` | `200` Liste von Mitgliedern | 🆕 (B3) |

## 4. Listenantwort für `/api/buecher` 🆕 (B4)

Query-Parameter (alle optional):

| Parameter | Bedeutung | Standard |
| --- | --- | --- |
| `suchbegriff` | Teilstring in `titel` oder `autor`, ohne Groß-/Kleinschreibung | – |
| `genre` | exakter Genre-Name | – |
| `sortierung` | `id`, `titel`, `autor`, `genre`, `erscheinungsjahr` | `id` |
| `richtung` | `auf` oder `ab` | `auf` |
| `seite` | Seitennummer ab 1 | `1` |
| `pro_seite` | Einträge pro Seite, 1–100 | `10` |

Antwort:

```json
{
  "ergebnisse": [ { "id": 1, "titel": "Der Zauberberg", "...": "..." } ],
  "gesamt": 3,
  "seite": 1,
  "pro_seite": 10
}
```

- `gesamt` = Anzahl aller Treffer nach Filter, nicht nur der aktuellen Seite.
- Seite außerhalb des Bereichs → `200` mit leerem `ergebnisse`, kein Fehler.
- Leere Werte (`null`, `""`) stehen beim Sortieren immer am Ende.

**Frontend-Stand:** Suche, Filter, Sortierung und Pagination laufen bis B4 im Frontend (`frontend/src/api/buecher.js`, `BuecherListeView.vue`) mit genau diesen Parameternamen. Nach B4 wird dort auf die Listenantwort umgestellt.

## 5. Fehlerformat

Jede Fehlerantwort hat denselben Aufbau:

```json
{
  "fehler": "Titel und Autor:in sind Pflichtfelder",
  "felder": {
    "titel": "darf nicht leer sein",
    "erscheinungsjahr": "muss zwischen 0 und 2026 liegen"
  }
}
```

- `fehler` (Pflicht): kurze Meldung, wird im Frontend direkt angezeigt ✅
- `felder` (optional, nur bei `400`): Fehler pro Formularfeld, damit das Frontend sie am Eingabefeld anzeigen kann 🆕 (B4)

| Code | Wann |
| --- | --- |
| `200` | Lesen/Ändern erfolgreich |
| `201` | Angelegt |
| `204` | Gelöscht (leerer Body) |
| `400` | Validierung fehlgeschlagen oder ungültiger Query-Parameter |
| `404` | Ressource nicht gefunden |
| `409` | Konflikt mit dem aktuellen Zustand (Buch hat aktive Ausleihe, schon ausgeliehen, schon zurückgegeben, max. Verlängerungen) |
| `500` | Unerwarteter Serverfehler – Frontend zeigt „Serverfehler … Läuft das Backend?“ |

## 6. Offene Fragen an Sülo

1. **`verfuegbar` berechnen statt speichern?** Vorschlag: ja. In den aktuellen Mock-Daten ist „Der Zauberberg“ `verfuegbar: true`, obwohl Ausleihe #2 (Jonas Weber) aktiv ist. Mit Berechnung kann das nicht mehr passieren; das Formular würde die Checkbox dann entfernen.
2. **`autor` als String oder als Objekt/ID?** Vorschlag: im Buch-JSON bleibt `autor` ein String (Anzeigename), zusätzlich `autor_id` sobald es die Tabelle gibt. So bricht das Frontend nicht.
3. **Ausleihfrist und Verlängerung:** 28 Tage Frist, +14 Tage pro Verlängerung, max. 2 – passt das?
4. **Sortierung im Backend** (`sortierung`/`richtung`) – mit B4 machbar, oder bleibt sie im Frontend?
