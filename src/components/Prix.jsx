import { useOffres } from '../offres/useOffres'
import { formatPrix } from '../utils/format'
import { prixRemise } from '../utils/prix'

// Shows the price, with the active offer applied and the original price struck through.
export default function Prix({ prix, className = 'text-2xl', ttc = false, decimales = false }) {
  const { offre } = useOffres()
  const base = `font-display font-bold leading-none whitespace-nowrap ${className}`

  return (
    <span className="inline-flex flex-col">
      {offre ? (
        <span className="inline-flex flex-wrap items-baseline gap-x-2">
          <span className={`${base} text-brand-dark`}>{formatPrix(prixRemise(prix, offre), decimales)}</span>
          <span className="text-xs text-slate-400 line-through">{formatPrix(prix, decimales)}</span>
        </span>
      ) : (
        <span className={`${base} text-ink`}>{formatPrix(prix, decimales)}</span>
      )}
      {ttc && <span className="mt-1 text-[10px] font-medium uppercase tracking-wider text-slate-400">TTC</span>}
    </span>
  )
}
