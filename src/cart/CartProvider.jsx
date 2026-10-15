import { useEffect, useMemo, useReducer } from 'react'
import { CartContext } from './CartContext'
import { QTE_MAX } from '../utils/prix'

const KEY = 'ballons_panier'

// A line: { cle, type: 'produit' | 'pack', id, nom, prix, imageUrl, taille, quantite }
const cle = (type, id) => `${type}:${id}`
const borne = (n) => Math.min(QTE_MAX, Math.max(1, Math.floor(n) || 1))

function reducer(lignes, action) {
  switch (action.type) {
    case 'ajouter': {
      const { item, quantite } = action
      const k = cle(item.type, item.id)
      const existe = lignes.find((l) => l.cle === k)
      if (existe) return lignes.map((l) => (l.cle === k ? { ...l, ...item, cle: k, quantite: borne(l.quantite + quantite) } : l))
      return [...lignes, { ...item, cle: k, quantite: borne(quantite) }]
    }
    case 'quantite':
      return lignes.map((l) => (l.cle === action.cle ? { ...l, quantite: borne(action.quantite) } : l))
    case 'retirer':
      return lignes.filter((l) => l.cle !== action.cle)
    case 'vider':
      return []
    default:
      return lignes
  }
}

function charger() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY))
    return Array.isArray(saved) ? saved.filter((l) => l?.cle && l.quantite > 0) : []
  } catch {
    return []
  }
}

export default function CartProvider({ children }) {
  const [lignes, dispatch] = useReducer(reducer, undefined, charger)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(lignes))
    } catch {
      // storage unavailable: the cart simply lives in memory
    }
  }, [lignes])

  const value = useMemo(
    () => ({
      lignes,
      nombreArticles: lignes.reduce((n, l) => n + l.quantite, 0),
      ajouter: (item, quantite = 1) => dispatch({ type: 'ajouter', item, quantite }),
      changerQuantite: (k, quantite) => dispatch({ type: 'quantite', cle: k, quantite }),
      retirer: (k) => dispatch({ type: 'retirer', cle: k }),
      vider: () => dispatch({ type: 'vider' }),
    }),
    [lignes],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
