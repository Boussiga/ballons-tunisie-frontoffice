import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowRight, ClipboardList, MousePointerClick, Phone, PhoneCall, Search, SearchX, ShoppingBag, Truck, X } from 'lucide-react'
import { getFacets, getProduits } from '../api/storeApi'
import { useApi } from '../api/useApi'
import BandeauPage from '../components/BandeauPage'
import BanniereOffre from '../components/BanniereOffre'
import CarteSquelette from '../components/CarteSquelette'
import Pagination from '../components/Pagination'
import ProduitCard from '../components/ProduitCard'
import QuestionBloc from '../components/QuestionBloc'
import Reassurance from '../components/Reassurance'
import { CONTACT, LIVRAISON_GRATUITE_DES } from '../config'
import { DEVISE } from '../utils/format'

const PAR_PAGE = 12

const TRIS = {
  populaires: { label: 'Populaires', fn: null },
  prix_asc: { label: 'Prix croissant', fn: (a, b) => a.prix - b.prix },
  prix_desc: { label: 'Prix décroissant', fn: (a, b) => b.prix - a.prix },
  nom: { label: 'Nom (A-Z)', fn: (a, b) => a.nom.localeCompare(b.nom, 'fr') },
}

// Short reminder of the order steps (full version on the home page)
const ETAPES = [
  { icone: MousePointerClick, texte: 'Choisissez vos ballons' },
  { icone: ShoppingBag, texte: 'Ajoutez-les au panier' },
  { icone: ClipboardList, texte: 'Laissez vos coordonnées' },
  { icone: PhoneCall, texte: 'Nous confirmons et expédions' },
]

const selectClasse = 'label w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs text-ink outline-none transition focus:border-brand-dark sm:w-auto'

export default function Produits() {
  // filters live in the URL: shareable links, and the back button works
  const [params, setParams] = useSearchParams()
  const page = Number(params.get('page')) || 1
  const search = params.get('q') || ''
  const categorie = params.get('categorie') || ''
  const taille = params.get('taille') || ''
  const tri = TRIS[params.get('tri')] ? params.get('tri') : 'populaires'

  // The whole (filtered) catalogue is loaded once, then sorted and paged here:
  // the API has no sort option, and sorting a single page would be misleading.
  const key = JSON.stringify({ search, categorie, taille })
  const { data, error, loading } = useApi(key, () => getProduits({ limit: 100, search, categorieId: categorie, taille }))
  const facets = useApi('facets', getFacets).data

  const tous = useMemo(() => {
    const liste = data?.data ?? []
    const fn = TRIS[tri].fn
    return fn ? [...liste].sort(fn) : liste
  }, [data, tri])

  const totalPages = Math.max(1, Math.ceil(tous.length / PAR_PAGE))
  const pageCourante = Math.min(page, totalPages)
  const produits = tous.slice((pageCourante - 1) * PAR_PAGE, pageCourante * PAR_PAGE)
  const pagination = { page: pageCourante, totalPages, hasPrevPage: pageCourante > 1, hasNextPage: pageCourante < totalPages }

  function update(changes) {
    const next = new URLSearchParams(params)
    Object.entries({ page: '', ...changes }).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)))
    setParams(next)
  }

  function recherche(e) {
    e.preventDefault()
    update({ q: new FormData(e.currentTarget).get('q').trim() })
  }

  // removable chips for every active filter
  const nomCategorie = facets?.categories.find((c) => String(c.id) === categorie)?.nom
  const filtresActifs = [
    search && { cle: 'q', label: `« ${search} »` },
    categorie && { cle: 'categorie', label: nomCategorie ?? 'Catégorie' },
    taille && { cle: 'taille', label: `Taille ${taille}` },
  ].filter(Boolean)
  const premierChargement = loading && !data
  const vide = !loading && !error && produits.length === 0

  return (
    <>
      <BandeauPage fil="Nos ballons" titre="Nos ballons de sport" badge={data ? `${tous.length} modèle${tous.length > 1 ? 's' : ''} en stock` : null}>
        <p className="flex items-center gap-2 text-sm text-slate-600">
          <Truck size={16} className="text-brand-dark" /> Expédition soignée sous 24 à 48 h • Livraison gratuite dès {LIVRAISON_GRATUITE_DES} {DEVISE}
        </p>
      </BandeauPage>

      <Reassurance />
      <BanniereOffre className="pt-8" />

      <div className="mx-auto max-w-[1304px] px-4 pb-4 pt-8 sm:px-11">
        {/* FILTERS */}
        <div className="card p-4 sm:p-5">
          <p className="label text-[11px] text-slate-500">Discipline</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {[{ id: '', nom: 'Tous les ballons' }, ...(facets?.categories ?? [])].map((c) => (
              <button key={c.id} onClick={() => update({ categorie: String(c.id) })} className={`pill ${String(c.id) === categorie ? 'pill-active' : ''}`}>
                {c.nom}
              </button>
            ))}
            <Link to="/offres" className="pill bg-brand-soft text-brand-dark hover:bg-brand-soft/70">Offres & Packs</Link>
          </div>

          <div className="mt-4 grid gap-3 border-t border-slate-100 pt-4 sm:flex sm:flex-wrap sm:items-center">
            <form onSubmit={recherche} className="relative sm:flex-1 sm:min-w-56">
              <input
                key={search}
                name="q"
                defaultValue={search}
                placeholder="Rechercher un ballon, une marque…"
                aria-label="Rechercher un ballon"
                className="field !rounded-full !py-2.5 pl-4 pr-10"
              />
              <button type="submit" aria-label="Rechercher" className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-dark">
                <Search size={16} />
              </button>
            </form>

            {facets?.tailles.length > 0 && (
              <select value={taille} onChange={(e) => update({ taille: e.target.value })} aria-label="Taille" className={selectClasse}>
                <option value="">Toutes tailles</option>
                {facets.tailles.map((t) => (
                  <option key={t} value={t}>Taille {t}</option>
                ))}
              </select>
            )}
            <select
              value={tri}
              onChange={(e) => update({ tri: e.target.value === 'populaires' ? '' : e.target.value })}
              aria-label="Trier par"
              className={selectClasse}
            >
              {Object.entries(TRIS).map(([k, t]) => (
                <option key={k} value={k}>Trier : {t.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* RESULT BAR */}
        <div className="mt-5 flex flex-wrap items-center gap-2 text-sm text-slate-600">
          {data && (
            <span>
              <strong className="text-ink">{tous.length}</strong> ballon{tous.length > 1 ? 's' : ''} disponible{tous.length > 1 ? 's' : ''}
            </span>
          )}
          {filtresActifs.map((f) => (
            <button
              key={f.cle}
              onClick={() => update({ [f.cle]: '' })}
              className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-medium text-ink shadow-sm ring-1 ring-slate-200 hover:text-brand-dark"
              aria-label={`Retirer le filtre ${f.label}`}
            >
              {f.label} <X size={12} />
            </button>
          ))}
          {filtresActifs.length > 0 && (
            <button onClick={() => setParams({})} className="text-xs font-medium text-brand-dark underline underline-offset-2">
              Tout réinitialiser
            </button>
          )}
        </div>

        {/* LIST */}
        <div className="mt-5">
          {error && <p className="rounded-xl bg-red-50 px-4 py-6 text-center text-red-700">{error}</p>}

          {vide && (
            <div className="card px-6 py-14 text-center">
              <SearchX size={36} className="mx-auto text-slate-300" />
              <h2 className="mt-4 font-display text-2xl font-semibold uppercase text-ink">Aucun ballon ne correspond</h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
                Essayez une autre discipline ou une autre taille. Vous cherchez un modèle précis ? Appelez-nous, nous pouvons peut-être vous le procurer.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button onClick={() => setParams({})} className="btn">Voir tous les ballons</button>
                <a href={`tel:${CONTACT.telephone.replace(/\s/g, '')}`} className="label inline-flex items-center gap-2 rounded-full border border-slate-200 px-5 py-2.5 text-sm text-ink hover:border-brand-dark">
                  <Phone size={14} /> {CONTACT.telephone}
                </a>
              </div>
            </div>
          )}

          <div className={`grid gap-5 sm:grid-cols-2 lg:grid-cols-4 ${loading && data ? 'opacity-50' : ''}`}>
            {premierChargement
              ? Array.from({ length: 8 }, (_, i) => <CarteSquelette key={i} />)
              : produits.map((p) => <ProduitCard key={p.id} produit={p} />)}
          </div>
          <Pagination pagination={pagination} onPage={(p) => { update({ page: p > 1 ? String(p) : '' }); window.scrollTo(0, 0) }} />
        </div>

        {/* ORDER STEPS REMINDER */}
        <div className="mt-14 rounded-2xl bg-ink px-6 py-7 text-white">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="label text-[11px] text-salmon">Simple et sans risque</p>
              <h2 className="font-display text-2xl font-semibold uppercase">Commander en 4 étapes</h2>
            </div>
            <Link to="/panier" className="btn">
              Voir mon panier <ArrowRight size={15} />
            </Link>
          </div>
          <ol className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {ETAPES.map(({ icone: Icone, texte }, i) => (
              <li key={texte} className="flex items-center gap-3 rounded-xl bg-white/[0.06] px-4 py-3 ring-1 ring-white/10">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand text-white">
                  <Icone size={17} />
                </span>
                <span className="text-sm">
                  <span className="font-display font-bold text-salmon">{i + 1}.</span> {texte}
                </span>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-xs text-slate-300">Aucune carte bancaire demandée : nous vous appelons pour valider la commande avant l’expédition.</p>
        </div>
      </div>

      <QuestionBloc />
      <div className="h-16" />
    </>
  )
}
