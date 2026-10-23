import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useOffres } from '../offres/useOffres'

// Red banner for the active offer; renders nothing when there is none
export default function BanniereOffre({ className = '' }) {
  const { offre } = useOffres()
  if (!offre) return null

  return (
    <section className={`mx-auto max-w-[1304px] px-4 sm:px-11 ${className}`}>
      <Link to="/offres" className="group flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-brand px-6 py-5 text-white shadow-[0_12px_28px_-14px_rgba(227,6,19,0.9)] transition hover:bg-brand-dark">
        <div className="flex items-center gap-4">
          <span className="font-display text-4xl font-bold leading-none">−{offre.pourcentageReduction} %</span>
          <div>
            <p className="font-semibold">{offre.titre}</p>
            <p className="text-sm text-white/85">
              Remise appliquée automatiquement sur les ballons concernés ·{offre.joursRestants <= 1 ? 'dernier jour !' : `encore ${offre.joursRestants} jours`}
            </p>
          </div>
        </div>
        <span className="label inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs text-brand-dark">
          J’en profite <ArrowRight size={14} className="transition group-hover:translate-x-0.5" />
        </span>
      </Link>
    </section>
  )
}
