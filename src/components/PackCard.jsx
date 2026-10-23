import { CircleCheck, Package, Star } from 'lucide-react'
import { useCart } from '../cart/useCart'
import { formatPrix } from '../utils/format'
import BoutonAjouter from './BoutonAjouter'
import Visuel from './Visuel'

export default function PackCard({ pack }) {
  const { ajouter } = useCart()
  const contenu = pack.produits ?? []
  const valeurSeparee = contenu.reduce((t, { produit, quantite }) => t + produit.prix * quantite, 0)
  // Offers never apply to packs: the pack price already includes its own discount
  const prixFinal = pack.prixPack
  const economie = Math.max(0, valeurSeparee - prixFinal)
  const image = contenu.find((c) => c.produit.imageUrl)?.produit.imageUrl
  const nbBallons = contenu.reduce((n, c) => n + c.quantite, 0)
  const remise = valeurSeparee > 0 ? Math.round((1 - prixFinal / valeurSeparee) * 100) : 0

  return (
    <article className="card flex flex-col overflow-hidden p-0">
      <div className="relative m-3 mb-0 overflow-hidden rounded-2xl bg-panel">
        <Visuel url={image} alt={pack.nom} className="aspect-[16/9] w-full" />
        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          <span className="label inline-flex items-center gap-1.5 rounded-full bg-ink px-3 py-1 text-[11px] text-white">
            <Star size={12} /> {nbBallons} article{nbBallons > 1 ? 's' : ''}
          </span>
          {remise > 0 && <span className="label rounded-full bg-brand px-3 py-1 text-[11px] text-white">−{remise} % remise</span>}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="label text-[11px] text-brand-dark">Pack Ballons Tunisie</p>
            <h3 className="mt-1 font-display text-2xl font-semibold uppercase leading-tight text-ink">{pack.nom}</h3>
          </div>
          <div className="shrink-0 text-right">
            {(valeurSeparee > prixFinal + 0.005) && <p className="text-xs text-slate-400 line-through">{formatPrix(valeurSeparee, true)}</p>}
            <p className="font-display text-4xl font-bold leading-none text-brand-dark">{formatPrix(prixFinal, true)}</p>
            {economie > 0.005 && <p className="mt-1 text-[11px] font-medium text-slate-600">Économie : −{formatPrix(economie)}</p>}
          </div>
        </div>

        {pack.description && <p className="mt-3 text-sm text-slate-600">{pack.description}</p>}

        <div className="mt-4 rounded-xl bg-panel p-4">
          <p className="label flex items-center gap-2 text-xs text-ink">
            <Package size={14} className="text-brand-dark" /> Composition détaillée du pack :
          </p>
          <ul className="mt-2 space-y-1.5 text-sm text-slate-700">
            {contenu.map(({ produit, quantite }) => (
              <li key={produit.id} className="flex items-start gap-2">
                <CircleCheck size={15} className="mt-0.5 shrink-0 text-brand-dark" />
                <span>
                  {quantite}x {produit.nom}
                  {produit.taille && <span className="text-slate-500"> (taille {produit.taille})</span>}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-auto pt-5">
        <BoutonAjouter
          className="!w-full !rounded-xl !bg-brand !py-3.5 !text-base [&>svg]:size-4"
          onAdd={() => ajouter({ type: 'pack', id: pack.id, nom: pack.nom, prix: pack.prixPack, imageUrl: image })}
        >
          Commander ce pack
        </BoutonAjouter>
        </div>
      </div>
    </article>
  )
}
