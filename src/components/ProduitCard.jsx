import { Link } from 'react-router-dom'
import { useCart } from '../cart/useCart'
import { useOffres } from '../offres/useOffres'
import { DISPONIBILITE } from '../utils/format'
import { offreProduit } from '../utils/prix'
import BoutonAjouter from './BoutonAjouter'
import Prix from './Prix'
import Visuel from './Visuel'

// variant "grand": home page (photo fills the frame). Default: catalogue (photo contained, stock badge, TTC).
export default function ProduitCard({ produit, grand = false }) {
  const { ajouter } = useCart()
  const offre = offreProduit(produit.id, useOffres().offres)
  const dispo = DISPONIBILITE[produit.disponibilite] ?? DISPONIBILITE.disponible
  const lien = `/produits/${produit.id}`

  return (
    <article className="card flex flex-col p-3 transition hover:shadow-[0_8px_26px_rgba(20,30,40,0.12)] sm:p-4">
      <Link to={lien} className="relative block overflow-hidden rounded-xl bg-panel">
        <Visuel
          url={produit.imageUrl}
          alt={produit.nom}
          fit={grand ? 'cover' : 'contain'}
          className={`w-full ${grand ? 'aspect-[1/0.95]' : 'aspect-[1/1]'}`}
        />
        {!grand && <span className={`label absolute right-2 top-2 rounded-full px-2.5 py-0.5 text-[10px] normal-case tracking-wide ${dispo.pill}`}>{dispo.label}</span>}
        {offre && <span className="label absolute left-2 top-2 rounded-full bg-brand px-2.5 py-0.5 text-[10px] text-white">−{offre.pourcentageReduction} %</span>}
      </Link>

      <div className="flex flex-1 flex-col pt-4">
        {produit.categorie && <p className="label text-[11px] text-brand-dark">{produit.categorie.nom}</p>}
        <Link to={lien} className="mt-1 font-display text-lg font-semibold uppercase leading-snug text-ink hover:text-brand-dark">
          {produit.nom}
        </Link>
        {produit.description && <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-600">{produit.description}</p>}
        {grand && produit.taille && <p className="mt-1 text-xs text-slate-500">Taille : {produit.taille}</p>}

        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <Prix prix={produit.prix} offre={offre} ttc={!grand} className={grand ? 'text-2xl' : 'text-xl'} />
          <BoutonAjouter
            disabled={produit.disponibilite === 'rupture'}
            onAdd={() =>
              ajouter({
                type: 'produit',
                id: produit.id,
                nom: produit.nom,
                prix: produit.prix,
                imageUrl: produit.imageUrl,
                taille: produit.taille,
              })
            }
          />
        </div>
      </div>
    </article>
  )
}
