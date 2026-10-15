import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

// Grey title strip under the header: breadcrumb, page title, optional badge and right-hand content
export default function BandeauPage({ fil, titre, badge, children }) {
  return (
    <div className="bg-panel">
      <div className="mx-auto flex max-w-[1304px] flex-wrap items-end justify-between gap-x-8 gap-y-2 px-4 pb-5 pt-4 sm:px-11">
        <div>
          <p className="label flex items-center gap-1 text-[11px] text-slate-500">
            <Link to="/" className="text-ink hover:text-brand-dark">Accueil</Link>
            <ChevronRight size={12} />
            <span className="text-brand-dark">{fil}</span>
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-3">
            <h1 className="font-display text-4xl font-bold uppercase leading-tight text-ink">{titre}</h1>
            {badge && <span className="label rounded-full bg-brand-soft px-3 py-1 text-[11px] text-brand-dark">{badge}</span>}
          </div>
        </div>
        {children}
      </div>
    </div>
  )
}
