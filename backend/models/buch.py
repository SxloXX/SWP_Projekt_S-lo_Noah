"""Vorschau des späteren Buch-Modells (noch nicht an die API angebunden)."""

from dataclasses import dataclass


@dataclass
class Buch:
    titel: str
    autor: str
    isbn: str = ""
    erscheinungsjahr: int | None = None
    genre: str = ""
    verfuegbar: bool = True
