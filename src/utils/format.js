import { API_URL } from '../api/client'

// One place to change the currency
export const DEVISE = 'DT'

const nf = (n, d) => Number(n).toLocaleString('fr-FR', { minimumFractionDigits: d, maximumFractionDigits: 2 })

// 65 -> "65 DT", 65.5 -> "65,50 DT". With `toujoursDecimales`: 65 -> "65,00 DT" (pack prices).
export const formatPrix = (prix, toujoursDecimales = false) => {
  const entier = Number.isInteger(Number(prix))
  return `${nf(prix, entier && !toujoursDecimales ? 0 : 2)} ${DEVISE}`
}

// Images are served by the API under /uploads/...
export const imageSrc = (url) => (url ? `${API_URL}${url}` : null)

export const formatDateHeure = (iso) =>
  new Date(iso).toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' })

export const formatDate = (iso) => new Date(iso).toLocaleDateString('fr-FR', { dateStyle: 'long' })

export const DISPONIBILITE = {
  disponible: { label: 'En stock', pill: 'bg-stock text-white', dot: 'bg-stock', detail: 'En stock — Expédié sous 24h' },
  stock_faible: { label: 'Stock limité', pill: 'bg-amber-500 text-white', dot: 'bg-amber-500', detail: 'Stock limité — dépêchez-vous' },
  rupture: { label: 'Rupture', pill: 'bg-slate-500 text-white', dot: 'bg-slate-400', detail: 'Rupture de stock' },
}
