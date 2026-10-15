import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Truck } from 'lucide-react'
import { getFacets, getProduits } from '../api/storeApi'
import { useApi } from '../api/useApi'
import BandeauPage from '../components/BandeauPage'
import Etat from '../components/Etat'
import Pagination from '../components/Pagination'
import ProduitCard from '../components/ProduitCard'
import QuestionBloc from '../components/QuestionBloc'
import { LIVRAISON_GRATUITE_DES } from '../config'
import { DEVISE } from '../utils/format'

const PAR_PAGE = 12

const TRIS = {
  populaires: { label: 'Populaires', fn: null },
  prix_asc: { label: 'Prix croissant', fn: (a, b) => a.prix - b.prix },
  prix_desc: { label: 'Prix décroissant', fn: (a, b) => b.prix - a.prix },
  nom: { label: 'Nom (A-Z)', fn: (a, b) => a.nom.localeCompare(b.nom, 'fr') },
}

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

  return (
    <>
      <BandeauPage fil="Nos ballons" titre="Nos ballons de sport" badge={data ? `${tous.length} modèle${tous.length > 1 ? 's' : ''} en stock` : null}>
        <p className="flex items-center gap-2 text-sm text-slate-600">
          <Truck size={16} className="text-brand-dark" /> Expédition soignée sous 24h • Livraison gratuite dès {LIVRAISON_GRATUITE_DES} {DEVISE}
        </p>
      </BandeauPage>

      <div className="mx-auto max-w-[1304px] px-4 pb-4 pt-8 sm:px-11">
        <div className="card flex flex-wrap items-center justify-between gap-4 p-3.5">
          <div className="flex flex-wrap gap-2">
            {[{ id: '', nom: 'Tous les ballons' }, ...(facets?.categories ?? [])].map((c) => (
              <button key={c.id} onClick={() => update({ categorie: String(c.id) })} className={`pill ${String(c.id) === categorie ? 'pill-active' : ''}`}>
                {c.nom}
              </button>
            ))}
            <Link to="/offres" className="pill">Offres & Packs</Link>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {facets?.tailles.length > 0 && (
              <select value={taille} onChange={(e) => update({ taille: e.target.value })} aria-label="Taille" className="label rounded-lg bg-panel px-3 py-2 text-xs outline-none">
                <option value="">Toutes tailles</option>
                {facets.tailles.map((t) => (
                  <option key={t} value={t}>Taille {t}</option>
                ))}
              </select>
            )}
            <label className="label flex items-center gap-2 text-xs text-slate-500">
              Trier par :
              <select value={tri} onChange={(e) => update({ tri: e.target.value === 'populaires' ? '' : e.target.value })} className="rounded-lg bg-panel px-3 py-2 text-xs text-ink outline-none">
                {Object.entries(TRIS).map(([k, t]) => (
                  <option key={k} value={k}>{t.label}</option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {(search || taille) && (
          <p className="mt-4 text-sm text-slate-600">
            {search && <>Résultats pour « <strong>{search}</strong> » </>}
            <button onClick={() => setParams({})} className="ml-2 text-brand-dark underline">Réinitialiser</button>
          </p>
        )}

        <div className="mt-6">
          <Etat loading={loading && !data} error={error} vide={!loading && !error && produits.length === 0} messageVide="Aucun ballon ne correspond à votre recherche." />
          <div className={`grid gap-5 sm:grid-cols-2 lg:grid-cols-4 ${loading && data ? 'opacity-50' : ''}`}>
            {produits.map((p) => <ProduitCard key={p.id} produit={p} />)}
          </div>
          <Pagination pagination={pagination} onPage={(p) => { update({ page: p > 1 ? String(p) : '' }); window.scrollTo(0, 0) }} />
        </div>
      </div>

      <QuestionBloc />
      <div className="h-16" />
    </>
  )
}
