# Agent-Übergabe – Bücherei-Portal

Stand: 2026-11-26 (Abend)

Dieses Dokument übergibt den kompletten Projektstand an einen neuen Agenten oder an Sülo. Bitte zusätzlich `README.md`, `CONTRIBUTING.md`, `docs/ARBEITSTEILUNG.md` und – sobald gemergt – `docs/API_VERTRAG.md` lesen.

> **Regel für Agenten:** Nach jedem Arbeitsblock die betroffenen `.md`-Dateien mitziehen (dieses Handoff, `README.md`, `frontend/README.md`, Fortschritt in `docs/ARBEITSTEILUNG.md`, `docs/API_VERTRAG.md` bei API-Annahmen). Feature-Doku gehört in den Feature-Branch, Projekt-Doku auf einen `docs/*`-Branch.

## 1. Projekt und Ort

- **Lokaler Pfad:** `C:\Users\noahbaumann\SWP_Projekt_S-lo_Noah`
- **Remote (`origin`):** `https://github.com/SxloXX/SWP_Projekt_S-lo_Noah.git`
- **Ziel:** Bücherei-Portal. Flask-Webserver liefert Daten, Vue 3 stellt sie dar (Listenansicht, Detailansicht, Anlegen/Ändern/Löschen, Tabellen und Listen).
- **Datenbindung:** Noch keine Datenbank. Das Backend liefert In-Memory-Mock-Daten (`backend/api/data.py`). Das Frontend holt sie inzwischen **echt über die Flask-API** (`USE_MOCK = false`, auf den Feature-Branches – siehe 3).

## 2. Rollen

| Developer | Verantwortung | Besitzt |
| --- | --- | --- |
| **Noah** (der User) | Frontend & Design | `frontend/**` |
| **Sülo** | Backend & Daten | `backend/**` |
| **Beide** | Vertrag, Doku, Reviews | `docs/**`, `README.md`, `CONTRIBUTING.md` |

## 3. Branch-Stand

| Branch | Basis | Stand | Inhalt | Gepusht |
| --- | --- | --- | --- | --- |
| `main` | – | Release – Hash mit `git log` prüfen | Gerüst, Arbeitsteilung, Handoff | ja |
| `develop` | – | Integration – Hash mit `git log` prüfen | alles Gemergte | ja |
| `feature/frontend-api-binding` | `develop` | `4ae578e` | **F1 fertig** | nein (nur bis `64dac5f`) |
| `feature/frontend-buch-liste` | F1 | `37c7df3` | **F2 fertig** | nein |
| `feature/frontend-buch-detail` | F1 | `b50ed73` | **F3 fertig** | nein |
| `docs/api-vertrag` | `develop` | `64dcfa8` | **API-Vertrag (Entwurf)** | nein |
| `docs/handoff` | `develop` | dieses Dokument | Handoff + Fortschritt | nein |

- F2 und F3 bauen auf F1 auf. **Merge-Reihenfolge:** F1 → dann F2 und F3 (vorher auf `develop` rebasen). Vertrag und Handoff unabhängig.
- Geprüft mit `git merge-tree`: F2+F3, `develop`+F3 und `develop`+Vertrag mergen konfliktfrei. F3 setzt seine CSS-Ergänzungen deshalb bewusst in die Mitte von `style.css`, F2 hängt ans Ende an.
- Noah hat Push und PRs bewusst **noch zurückgestellt** – nicht ungefragt pushen.

## 4. Was heute gemacht wurde

### F1 – Frontend an Flask-API angebunden (`feature/frontend-api-binding`)

| Commit | Inhalt |
| --- | --- |
| `bf3ede7` | `src/api/client.js`: fetch-Wrapper für `/api` |
| `276d3d4` | `src/api/buecher.js`: async-Service mit `USE_MOCK`-Umschalter |
| `64dac5f` | Bücherliste lädt über den Service |
| `f60084c` | `USE_MOCK = false`; Detail-, Formular- und Ausleihen-View auf async umgestellt (Lade-/Fehlerzustände); alte `useBuecher`/`useAusleihen` entfernt; verständliche Meldung, wenn das Backend nicht läuft |
| `4ae578e` | README + frontend/README auf F1-Stand |

### F2 – Listenansicht (`feature/frontend-buch-liste`)

| Commit | Inhalt |
| --- | --- |
| `6e3fab8` | `filtereBuecher()` filtert auch API-Antworten (Backend ignoriert Filter bis B4); `ladeGenres()` |
| `08bfad8` | Suchfeld (300 ms Debounce), Genre-Dropdown, „Filter zurücksetzen“, Leerzustand |
| `6a72f43` | Sortierbare Spalten (ID, Titel, Autor:in, Genre, Jahr), `aria-sort` |
| `c080843` | Pagination, 10 pro Seite, Seitenbereich-Anzeige |
| `37c7df3` | Doku: URL-Parameter in frontend/README |

Alle Zustände stehen in der URL: `?suchbegriff=&genre=&sortierung=&richtung=ab&seite=`.

### F3 – Detailansicht (`feature/frontend-buch-detail`)

| Commit | Inhalt |
| --- | --- |
| `89c0a05` | Löschen-Button mit Bestätigung auf der Detailseite |
| `48df946` | Ausleihen-Historie als Tabelle, Status-Badges Aktiv / Überfällig / Zurückgegeben, Datum `TT.MM.JJJJ`; Helfer in `src/utils/ausleihe.js` |
| `b50ed73` | Doku in frontend/README |

### Phase 0 – API-Vertrag (`docs/api-vertrag`)

`docs/API_VERTRAG.md`: Ressourcen, Endpunkte mit Statuscodes (✅ vorhanden / 🆕 mit Paket), Listenantwort `{ ergebnisse, gesamt, seite, pro_seite }`, Fehlerformat `{ fehler, felder }`, **4 offene Fragen an Sülo**. Wartet auf Sülos Review. `docs/DATENMODELL.md` (Sülos Teil von Phase 0) fehlt noch.

## 5. Entscheidungen und Fallen

- **`USE_MOCK = false`** ist der Standard ab F1. Ohne laufendes Backend zeigen alle Seiten „Serverfehler … Läuft das Backend?“ → Backend starten oder kurz `USE_MOCK = true` setzen.
- **Filter/Pagination laufen bis B4 im Frontend.** Die Parameter werden schon ans Backend geschickt; nach B4 die Fallbacks in `buecher.js` und `BuecherListeView.vue` entfernen und auf die Listenantwort umstellen.
- **Bekannter Daten-Bug (Backend):** In `backend/api/data.py` ist „Der Zauberberg“ `verfuegbar: true`, obwohl Ausleihe #2 aktiv ist. Vorschlag im Vertrag: `verfuegbar` berechnen. Noch nicht an Sülo gemeldet.
- **`python`** gibt es auf diesem Rechner nicht → **`py`** (Python 3.14). `backend/.venv` ist angelegt (in `.gitignore`).
- **`.claude/launch.json`** liegt untracked im Repo (Startbefehle für die Preview) – nicht committen; ggf. `.claude/` in `.gitignore` aufnehmen.
- **`gh`** ist nicht installiert → PRs über die GitHub-Weboberfläche.
- Zeilenenden: Git meldet LF→CRLF-Warnungen, harmlos.

## 6. Offene Aufgaben – Noah (Frontend)

| Aufgabe | Abhängig von | ca. Aufwand |
| --- | --- | --- |
| F1, Vertrag pushen + PRs; danach F2, F3 | Noahs OK | 15 min |
| Sülo: Vertrag reviewen lassen, Zauberberg-Bug melden | – | 5 min |
| **F4 Formulare:** Validierung pro Feld (ISBN, Jahr), Backend-`felder`-Fehler am Feld anzeigen | Vertrag (Fehlerformat) | 45–60 min |
| **F5 Ausleihen-UI:** ausleihen, zurückgeben, verlängern | Sülos B3 | 3 h |
| **F6 Design/UX:** Tabelle responsive (läuft bei schmalem Fenster über), Barrierefreiheit | – | 2–4 h |
| Nach B4: Listenantwort statt Frontend-Filter | Sülos B4 | 30 min |

## 7. Offene Aufgaben – Sülo (Backend)

- Phase 0: `docs/DATENMODELL.md`, Review von `docs/API_VERTRAG.md` (offene Fragen in Abschnitt 6 dort)
- B1–B6 aus `docs/ARBEITSTEILUNG.md` – noch keiner begonnen

## 8. Workflow und Reviews

- Kein direkter Commit auf `main` oder `develop`; Branches von `develop` (Ausnahme: F2/F3 von F1, weil abhängig).
- PR nach `develop`, der **andere** Dev reviewed (1 Approval).
- `main` nur per Release-Merge aus `develop`.
- Kein GitHub-Branch-Schutz eingerichtet – Regel steht nur in `CONTRIBUTING.md`.

## 9. Nützliche Befehle

```bash
# Backend starten
cd C:\Users\noahbaumann\SWP_Projekt_S-lo_Noah\backend
.venv\Scripts\python.exe app.py      # http://localhost:5000

# Frontend starten
cd C:\Users\noahbaumann\SWP_Projekt_S-lo_Noah\frontend
npm run dev                          # http://localhost:5173

# Prüfen
npm --prefix frontend run build
py -m compileall -q backend
git log --oneline --graph --all --decorate
git merge-tree --write-tree <branch-a> <branch-b>   # Konflikt-Check ohne Merge
```

## 10. Letzte Verifikation (2026-11-26)

- `npm run build` grün auf F1, F2 und F3
- Im Browser gegen das laufende Flask-Backend getestet: Liste, Suche, Genre-Filter, Sortierung, Pagination (mit 12 Testbüchern), Detail mit Ausleihen-Status, Anlegen, Ändern, Löschen (Liste und Detail), unbekannte ID, Fehlerzustand bei gestopptem Backend
- Testdaten wieder entfernt (Backend neu gestartet)
