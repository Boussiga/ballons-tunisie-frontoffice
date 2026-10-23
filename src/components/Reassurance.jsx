import { Headset, PackageCheck, Truck, Wallet } from 'lucide-react'
import { CONTACT, LIVRAISON_GRATUITE_DES } from '../config'
import { DEVISE } from '../utils/format'

const GARANTIES = [
  { icone: Truck, titre: 'Expédition 24 à 48 h', texte: 'Préparée depuis notre stock' },
  { icone: PackageCheck, titre: `Livraison offerte dès ${LIVRAISON_GRATUITE_DES} ${DEVISE}`, texte: 'Sur toute votre commande' },
  { icone: Wallet, titre: 'Aucun paiement en ligne', texte: 'Confirmation par téléphone' },
  { icone: Headset, titre: 'Conseil direct', texte: CONTACT.telephone },
]

// White strip of short reassurance points (home page, catalogue)
export default function Reassurance() {
  return (
    <section className="border-b border-slate-200 bg-white">
      <ul className="mx-auto grid max-w-[1304px] grid-cols-2 gap-x-4 gap-y-5 px-4 py-6 sm:px-11 lg:grid-cols-4">
        {GARANTIES.map(({ icone: Icone, titre, texte }) => (
          <li key={titre} className="flex items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand-dark">
              <Icone size={19} />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold leading-tight text-ink">{titre}</span>
              <span className="block text-xs text-slate-500">{texte}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
