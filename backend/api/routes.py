"""REST-Endpunkte des Bücherei-Portals.

Die Routen arbeiten aktuell mit den In-Memory-Mock-Daten aus ``data.py``.
Für die spätere Datenbindung müssen nur die Zugriffe auf ``BUECHER`` und
``AUSLEIHEN`` durch Datenbankoperationen ersetzt werden.
"""

from copy import deepcopy

from flask import Blueprint, jsonify, request

from .data import AUSLEIHEN, BUECHER

api = Blueprint("api", __name__, url_prefix="/api")

AENDERBARE_FELDER = (
    "titel",
    "autor",
    "isbn",
    "erscheinungsjahr",
    "genre",
    "verfuegbar",
)


def _buch_finden(buch_id: int):
    """Sucht ein Buch anhand seiner ID."""
    return next((buch for buch in BUECHER if buch["id"] == buch_id), None)


@api.get("/buecher")
def buecher_liste():
    """Listenansicht: alle Bücher liefern."""
    return jsonify(deepcopy(BUECHER))


@api.get("/buecher/<int:buch_id>")
def buch_detail(buch_id: int):
    """Detailansicht: ein einzelnes Buch liefern."""
    buch = _buch_finden(buch_id)
    if buch is None:
        return jsonify({"fehler": "Buch nicht gefunden"}), 404
    return jsonify(deepcopy(buch))


@api.post("/buecher")
def buch_anlegen():
    """Ein neues Buch anlegen."""
    daten = request.get_json(silent=True) or {}
    if not daten.get("titel") or not daten.get("autor"):
        return jsonify({"fehler": "titel und autor sind Pflichtfelder"}), 400

    buch = {
        "id": max((b["id"] for b in BUECHER), default=0) + 1,
        "titel": daten["titel"],
        "autor": daten["autor"],
        "isbn": daten.get("isbn", ""),
        "erscheinungsjahr": daten.get("erscheinungsjahr"),
        "genre": daten.get("genre", ""),
        "verfuegbar": daten.get("verfuegbar", True),
    }
    BUECHER.append(buch)
    return jsonify(deepcopy(buch)), 201


@api.put("/buecher/<int:buch_id>")
def buch_aendern(buch_id: int):
    """Ein vorhandenes Buch ändern."""
    buch = _buch_finden(buch_id)
    if buch is None:
        return jsonify({"fehler": "Buch nicht gefunden"}), 404

    daten = request.get_json(silent=True) or {}
    for feld in AENDERBARE_FELDER:
        if feld in daten:
            buch[feld] = daten[feld]
    return jsonify(deepcopy(buch))


@api.delete("/buecher/<int:buch_id>")
def buch_loeschen(buch_id: int):
    """Ein Buch löschen."""
    buch = _buch_finden(buch_id)
    if buch is None:
        return jsonify({"fehler": "Buch nicht gefunden"}), 404
    BUECHER.remove(buch)
    return "", 204


@api.get("/ausleihen")
def ausleihen_liste():
    """Listenansicht: alle Ausleihen liefern."""
    return jsonify(deepcopy(AUSLEIHEN))
