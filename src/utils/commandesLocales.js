// Orders placed from this browser, so the customer can find the order number again.
const KEY = 'ballons_commandes'
const MAX = 10

export function lireCommandes() {
  try {
    const list = JSON.parse(localStorage.getItem(KEY))
    return Array.isArray(list) ? list : []
  } catch {
    return []
  }
}

export function memoriserCommande({ id, dateCommande, total }) {
  try {
    const list = [{ id, dateCommande, total }, ...lireCommandes().filter((c) => c.id !== id)].slice(0, MAX)
    localStorage.setItem(KEY, JSON.stringify(list))
  } catch {
    // storage unavailable: the order number is still shown on screen
  }
}

export const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
