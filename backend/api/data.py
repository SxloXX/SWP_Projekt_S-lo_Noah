"""Mock-Daten des Bücherei-Portals.

TODO(Data Binding): Diese Listen werden später durch Datenbankabfragen
bzw. ein ORM ersetzt. Die API-Routen bleiben davon unberührt.
"""

BUECHER = [
    {
        "id": 1,
        "titel": "Der Zauberberg",
        "autor": "Thomas Mann",
        "isbn": "978-3-16-148410-0",
        "erscheinungsjahr": 1924,
        "genre": "Roman",
        "verfuegbar": True,
    },
    {
        "id": 2,
        "titel": "Die Verwandlung",
        "autor": "Franz Kafka",
        "isbn": "978-3-16-148411-7",
        "erscheinungsjahr": 1915,
        "genre": "Erzählung",
        "verfuegbar": True,
    },
    {
        "id": 3,
        "titel": "Die Hauptstadt",
        "autor": "Robert Menasse",
        "isbn": "978-3-10-002249-4",
        "erscheinungsjahr": 2017,
        "genre": "Roman",
        "verfuegbar": False,
    },
]

AUSLEIHEN = [
    {
        "id": 1,
        "buch_id": 3,
        "mitglied": "Anna Schmidt",
        "ausgeliehen_am": "2026-10-12",
        "rueckgabe_am": "2026-11-12",
    },
    {
        "id": 2,
        "buch_id": 1,
        "mitglied": "Jonas Weber",
        "ausgeliehen_am": "2026-11-01",
        "rueckgabe_am": "2026-12-01",
    },
]
