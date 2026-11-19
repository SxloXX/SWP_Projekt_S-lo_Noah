# Backend (Flask)

Liefert die Daten für das Bücherei-Portal. Aktuell mit In-Memory-Mock-Daten – die echte Datenbindung folgt später.

## Start

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

Der Server läuft dann auf `http://localhost:5000`.

## Endpunkte

| Methode | Pfad | Funktion |
| --- | --- | --- |
| `GET` | `/api/buecher` | Alle Bücher |
| `GET` | `/api/buecher/<id>` | Buch-Detail |
| `POST` | `/api/buecher` | Buch anlegen |
| `PUT` | `/api/buecher/<id>` | Buch ändern |
| `DELETE` | `/api/buecher/<id>` | Buch löschen |
| `GET` | `/api/ausleihen` | Ausleihen-Liste |

## Offen

- [ ] Datenbank / ORM anbinden (`models/buch.py` ist schon vorbereitet)
- [ ] Mock-Daten in `api/data.py` ersetzen
- [ ] Validierung und Fehlerresponses vereinheitlichen
