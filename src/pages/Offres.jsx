import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Award, Percent, ShieldCheck, Tag, Truck, FileText } from 'lucide-react'
import { getPacks } from '../api/storeApi'
import { useApi } from '../api/useApi'
import { useOffres } from '../offres/useOffres'
import BandeauPage from '../components/BandeauPage'
import Etat from '../components/Etat'
import PackCard from '../components/PackCard'
import Pagination from '../components/Pagination'
import QuestionBloc from '../components/QuestionBloc'
import { formatDate } from '../utils/format'

const ARGUMENTS = [
  { i: Truck, t: 'Livraison express 48h' },
  { i: FileText, t: 'Devis & mandat administratif' },
  { i: ShieldCheck, t: 'Matière grip pro antiglisse' },
  { i: Award, t: 'Garantie forme 18 mois' },
]

// Packs & offers share one page: offers apply to every price on the site.
export default function Offres() {
  const { offres, offre, chargee } = useOffres()
  const [params, setParams] = useSearchParams()
  const page = Number(params.get('page')) || 1
  const [filtre, setFiltre] = useState('')
  const { data, error, loading } = useApi(`packs:${page}`, () => getPacks({ page, limit: 12 }))
  const packs = useMemo(() => data?.data ?? [], [data])

  // pack categories come from the categories of the products they contain (when the API sends them)
  const categories = useMemo(
    () => [...new Set(packs.flatMap((p) => (p.produits ?? []).map((c) => c.produit.categorie?.nom).filter(Boolean)))].sort(),
    [packs],
  )
  const affiches = filtre ? packs.filter((p) => (p.produits ?? []).some((c) => c.produit.categorie?.nom === filtre)) : packs

  return (
    <>
      <BandeauPage fil="Offres & packs" titre="Offres & packs" badge={data ? `${data.pagination?.total ?? packs.length} pack${packs.length > 1 ? 's' : ''}` : null} />

      <div className="mx-auto max-w-[1304px] px-4 pt-8 sm:px-11">
        <div className="card flex flex-wrap gap-2 p-3.5">
          <Link to="/produits" className="pill">Tous les ballons</Link>
          <Link to="/offres" className="pill pill-active">Offres & Packs</Link>
        </div>
      </div>

      <section className="relative mt-8 overflow-hidden bg-ink text-white">
        <div aria-hidden className="absolute inset-0 bg-[repeating-linear-gradient(115deg,transparent_0_220px,rgba(255,255,255,0.05)_220px_440px)]" />
        <div className="relative mx-auto grid max-w-[1304px] gap-10 px-4 pb-10 pt-12 sm:px-11 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <span className="label inline-flex items-center gap-2 rounded-full bg-brand/25 px-3 py-1 text-[11px] text-salmon">
              <Tag size={12} /> Tarification direct fabricant • Clubs & écoles
            </span>
            <h1 className="mt-5 font-display text-5xl font-bold uppercase leading-[1.05] lg:text-6xl">
              Offres & packs <span className="text-brand">Ballons Tunisie</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-200">
              {offre
                ? `Faites des économies sur vos ballons d'entraînement et packs clubs. Jusqu'à ${offre.pourcentageReduction}% de remise immédiate appliquée automatiquement au panier.`
                : "Faites des économies sur vos ballons d'entraînement et packs clubs : ballons certifiés match et dotations complètes avec accessoires."}
            </p>
          </div>
          {offre && (
            <div className="self-center rounded-2xl bg-white/10 p-5">
              <div className="flex items-center gap-4">
                <span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-brand-dark"><Percent size={26} /></span>
                <div>
                  <p className="font-display text-5xl font-bold leading-none text-salmon">−{offre.pourcentageReduction}% MAX</p>
                  <p className="label mt-1 text-[11px] text-slate-200">Économie immédiate appliquée au panier</p>
                </div>
              </div>
            </div>
          )}
          <ul className="relative flex flex-wrap gap-x-10 gap-y-3 lg:col-span-2">
            {ARGUMENTS.map(({ i: Icone, t }) => (
              <li key={t} className="label flex items-center gap-2 text-xs text-white">
                <Icone size={14} className="text-brand" /> {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {chargee && offres.length > 0 && (
        <section className="mx-auto max-w-[1304px] px-4 pt-10 sm:px-11">
          <p className="label text-xs text-brand-dark">Offres en cours</p>
          <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {offres.map((o) => (
              <article key={o.id} className={`card flex items-center gap-4 p-4 ${offre?.id === o.id ? 'ring-2 ring-brand' : ''}`}>
                <span className="font-display text-4xl font-bold text-brand-dark">−{o.pourcentageReduction}%</span>
                <div>
                  <h2 className="font-medium text-ink">{o.titre}</h2>
                  <p className="text-xs text-slate-500">Jusqu’au {formatDate(o.dateFin)} · {o.joursRestants <= 1 ? 'dernier jour !' : `encore ${o.joursRestants} jours`}</p>
                  {offre?.id === o.id && <p className="label mt-1 text-[10px] text-brand-dark">Appliquée sur tout le site</p>}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-[1304px] px-4 py-12 sm:px-11">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="label text-xs text-brand-dark">Sélection tactique</p>
            <h2 className="font-display text-3xl font-bold uppercase">Packs homologués</h2>
          </div>
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setFiltre('')} className={`pill ${filtre === '' ? 'pill-active' : ''}`}>Tous les packs</button>
              {categories.map((c) => (
                <button key={c} onClick={() => setFiltre(c)} className={`pill ${filtre === c ? 'pill-active' : ''}`}>Packs {c}</button>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6">
          <Etat loading={loading && !data} error={error} vide={!loading && !error && affiches.length === 0} messageVide="Aucun pack disponible pour le moment." />
          <div className={`grid gap-6 lg:grid-cols-2 ${loading && data ? 'opacity-50' : ''}`}>
            {affiches.map((p) => <PackCard key={p.id} pack={p} />)}
          </div>
          <Pagination pagination={data?.pagination} onPage={(p) => { setParams(p > 1 ? { page: String(p) } : {}); window.scrollTo(0, 0) }} />
        </div>
      </section>

      <QuestionBloc />
      <div className="h-16" />
    </>
  )
}
