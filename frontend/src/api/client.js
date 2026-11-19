/**
 * Kleiner HTTP-Client für die Flask-API.
 *
 * Der Vite-Proxy leitet `/api` an http://localhost:5000 weiter. Deshalb
 * arbeiten alle Pfade hier mit dem Prefix `/api`.
 */

const BASIS_PFAD = '/api'

/**
 * Führt einen Request aus und liefert das JSON-Ergebnis.
 * Bei Fehlern wird eine Error mit der Meldung des Backends geworfen.
 */
export async function request(pfad, optionen = {}) {
  const antwort = await fetch(`${BASIS_PFAD}${pfad}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(optionen.headers ?? {}),
    },
    ...optionen,
  })

  if (!antwort.ok) {
    let nachricht = `HTTP ${antwort.status}`
    try {
      const daten = await antwort.json()
      if (daten?.fehler) nachricht = daten.fehler
    } catch {
      // Keine JSON-Fehlermeldung vorhanden – Statuscode reicht.
    }
    throw new Error(nachricht)
  }

  return antwort.status === 204 ? null : antwort.json()
}
