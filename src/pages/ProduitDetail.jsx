import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, BadgeCheck, ChevronRight, Headset, Minus, Plus, Truck } from 'lucide-react'
import { getProduit, getProduits } from '../api/storeApi'
import { useApi } from '../api/useApi'
import { useCart } from '../cart/useCart'
import BoutonAjouter from '../components/BoutonAjouter'
import Etat from '../components/Etat'
import Prix from '../components/Prix'
import Visuel from '../components/Visuel'
import { FRAIS_LIVRAISON } from '../config'
import { useOffres } from '../offres/useOffres'
import { DEVISE, DISPONIBILITE, formatPrix } from '../utils/format'
import { QTE_MAX, offreProduit, prixRemise } from '../utils/prix'

// Same ball in other sizes = other products with the same name
function Tailles({ produit }) {
  const { data } = useApi(`tailles:${produit.nom}`, () => getProduits({ search: produit.nom, limit: 30 }))
  const memes = (data?.data ?? []).filter((p) => p.taille && p.nom.trim().toLowerCase() === produit.nom.trim().toLowerCase())
  const liste = memes.some((p) => p.id === produit.id) ? memes : [...memes, produit].filter((p) => p.taille)
  if (liste.length === 0) return null
  liste.sort((a, b) => String(b.taille).localeCompare(String(a.taille), 'fr', { numeric: true }))

  return (
    <div className="mt-7">
      <h2 className="font-display text-lg font-semibold uppercase">Choisir la taille</h2>
      <div className="mt-2 flex flex-wrap gap-2">
        {liste.map((p) => (
          <Link
            key={p.id}
            to={`/produits/${p.id}`}
            className={`label rounded-lg px-5 py-3 text-base ${p.id === produit.id ? 'bg-brand-dark text-white' : 'bg-white text-ink shadow-sm hover:text-brand-dark'}`}
          >
            Taille {p.taille}
          </Link>
        ))}
      </div>
    </div>
  )
}

export default function ProduitDetail() {
  const { id } = useParams()
  const { data: produit, error, loading } = useApi(`produit:${id}`, () => getProduit(id))

  if (!produit) {
    return (
      <div className="mx-auto max-w-[1304px] px-4 py-12 sm:px-11">
        <Etat loading={loading} error={error} />
        <Link to="/produits" className="mt-4 inline-block text-brand-dark hover:underline">← Retour aux ballons</Link>
      </div>
    )
  }
  return <Fiche key={produit.id} produit={produit} />
}

function Fiche({ produit }) {
  const { ajouter } = useCart()
  const offre = offreProduit(produit.id, useOffres().offres)
  const [quantite, setQuantite] = useState(1)
  const dispo = DISPONIBILITE[produit.disponibilite] ?? DISPONIBILITE.disponible
  const indisponible = produit.disponibilite === 'rupture'
  const prixFinal = prixRemise(produit.prix, offre)
  const bornee = (n) => Math.min(QTE_MAX, Math.max(1, n))

  return (
    <>
      <div className="bg-panel">
        <div className="mx-auto flex max-w-[1304px] flex-wrap items-center gap-x-5 gap-y-2 px-4 py-3 sm:px-11">
          <Link to="/produits" className="label flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs text-ink shadow-sm hover:text-brand-dark">
            <ArrowLeft size={14} /> Retour aux ballons
          </Link>
          <p className="flex flex-wrap items-center gap-1 text-sm text-slate-600">
            <Link to="/" className="hover:text-brand-dark">Accueil</Link>
            <ChevronRight size={12} className="text-slate-400" />
            <Link to="/produits" className="hover:text-brand-dark">Nos ballons</Link>
            {produit.categorie && (
              <>
                <ChevronRight size={12} className="text-slate-400" />
                <Link to={`/produits?categorie=${produit.categorie.id}`} className="hover:text-brand-dark">{produit.categorie.nom}</Link>
              </>
            )}
            <ChevronRight size={12} className="text-slate-400" />
            <span className="font-medium text-ink">{produit.nom}</span>
          </p>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1304px] gap-10 px-4 py-10 sm:px-11 lg:grid-cols-[1.35fr_1fr]">
        <div className="relative overflow-hidden rounded-2xl bg-panel shadow-[0_2px_14px_rgba(20,30,40,0.06)]">
          <Visuel url={produit.imageUrl} alt={produit.nom} fit="contain" className="aspect-square w-full lg:aspect-[1/0.95]" />
          {offre && <span className="label absolute left-4 top-4 rounded-full bg-brand px-3 py-1 text-xs text-white">−{offre.pourcentageReduction} % {offre.titre}</span>}
        </div>

        <div>
          <div className="flex flex-wrap gap-2">
            {produit.categorie && <span className="label rounded-full bg-brand-soft px-3 py-1 text-[11px] text-brand-dark">{produit.categorie.nom}</span>}
            {produit.taille && <span className="label rounded-full bg-panel px-3 py-1 text-[11px] text-ink">Taille {produit.taille}</span>}
          </div>
          <h1 className="mt-3 font-display text-4xl font-bold uppercase leading-tight lg:text-5xl">{produit.nom}</h1>

          <div className="card mt-5 flex items-center justify-between gap-4 px-5 py-4">
            <div className="flex items-baseline gap-2">
              <Prix prix={produit.prix} offre={offre} className="text-4xl" />
              <span className="text-sm text-slate-500">TTC</span>
            </div>
            <span className="label rounded bg-brand-soft/60 px-2.5 py-1 text-[11px] text-brand-dark">
              + {FRAIS_LIVRAISON} {DEVISE} de livraison
            </span>
          </div>

          {produit.description && (
            <div className="card mt-4 px-5 py-4">
              <h2 className="font-display text-lg font-semibold uppercase">Description</h2>
              <p className="mt-1 whitespace-pre-line leading-relaxed text-slate-600">{produit.description}</p>
            </div>
          )}

          <Tailles produit={produit} />

          <p className="card mt-4 flex items-center justify-between gap-2 px-4 py-2.5 text-sm">
            <span className="flex items-center gap-2 font-medium">
              <span className={`size-2.5 rounded-full ${dispo.dot}`} /> {dispo.detail}
            </span>
            <span className="text-xs text-slate-500">{indisponible ? 'Indisponible' : 'Stock disponible'}</span>
          </p>

          <div className="mt-4 flex items-stretch gap-3">
            <div className="flex items-center gap-1.5 rounded-xl bg-panel p-1.5">
              <button type="button" onClick={() => setQuantite((q) => bornee(q - 1))} disabled={quantite <= 1} aria-label="Diminuer la quantité" className="flex size-10 items-center justify-center rounded-lg bg-white shadow-sm disabled:opacity-40">
                <Minus size={16} />
              </button>
              <span className="w-8 text-center font-semibold" aria-live="polite">{quantite}</span>
              <button type="button" onClick={() => setQuantite((q) => bornee(q + 1))} disabled={quantite >= QTE_MAX} aria-label="Augmenter la quantité" className="flex size-10 items-center justify-center rounded-lg bg-white shadow-sm disabled:opacity-40">
                <Plus size={16} />
              </button>
            </div>
            <BoutonAjouter
              disabled={indisponible}
              className="!flex-1 !rounded-xl !text-base [&>svg]:size-4"
              onAdd={() =>
                ajouter(
                  { type: 'produit', id: produit.id, nom: produit.nom, prix: produit.prix, imageUrl: produit.imageUrl, taille: produit.taille },
                  quantite,
                )
              }
            >
              Ajouter au panier — {formatPrix(prixFinal * quantite)}
            </BoutonAjouter>
          </div>

          <div className="card mt-4 grid grid-cols-3 gap-3 px-4 py-4 text-center">
            {[
              { i: Truck, t: 'Livraison rapide', s: 'Sous 24/48h chez vous' },
              { i: BadgeCheck, t: 'Satisfait ou remboursé', s: '30 jours pour changer d\'avis' },
              { i: Headset, t: 'Service réactif', s: 'Assistance dédiée clubs & joueurs' },
            ].map(({ i: Icone, t, s }) => (
              <div key={t}>
                <Icone size={18} className="mx-auto text-brand-dark" />
                <p className="label mt-1.5 text-[11px] leading-tight">{t}</p>
                <p className="mt-0.5 text-[11px] leading-tight text-slate-500">{s}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="h-10" />
    </>
  )
}
