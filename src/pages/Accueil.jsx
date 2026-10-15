import { Link } from 'react-router-dom'
import { ArrowRight, Headset, Mail, ShieldCheck, Tag, Truck } from 'lucide-react'
import { getProduits } from '../api/storeApi'
import { useApi } from '../api/useApi'
import { CONTACT } from '../config'
import Etat from '../components/Etat'
import ProduitCard from '../components/ProduitCard'

const ATOUTS = [
  { icone: ShieldCheck, titre: 'Qualité durable', texte: "Matériaux choisis avec soin pour garantir résistance à l'usure, bonne tenue de pression et toucher agréable." },
  { icone: Truck, titre: 'Envoi rapide', texte: 'Vos commandes sont préparées et expédiées directement depuis notre stock sous 24 à 48 heures.' },
  { icone: Headset, titre: 'Conseil & service direct', texte: 'Une question sur la taille ou le modèle ? Nous vous répondons directement par téléphone ou email.' },
]

function EnTete({ surtitre, titre, texte }) {
  return (
    <div className="text-center">
      <p className="label text-xs text-brand-dark">{surtitre}</p>
      <h2 className="mt-1 font-display text-4xl font-bold uppercase text-ink">{titre}</h2>
      <p className="mt-2 text-sm text-slate-600">{texte}</p>
    </div>
  )
}

export default function Accueil() {
  const produits = useApi('accueil:produits', () => getProduits({ limit: 3 }))
  const liste = produits.data?.data ?? []

  return (
    <>
      <section className="bg-ink text-white">
        <div className="mx-auto grid max-w-[1304px] items-center gap-10 px-4 py-14 sm:px-11 lg:grid-cols-[1.15fr_1fr] lg:py-24">
          <div>
            <span className="label inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[11px] text-salmon">
              <Tag size={12} /> Boutique & atelier indépendant
            </span>
            <h1 className="mt-6 font-display text-5xl font-bold uppercase leading-[1.1] lg:text-[64px]">
              Des ballons de qualité pour vos <span className="text-brand">matchs et entraînements</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-slate-200">
              Sélectionnés et réglés avec soin dans notre atelier. Retrouvez des ballons résistants et agréables au toucher pour tous vos moments de jeu.
            </p>
            <Link to="/produits" className="btn mt-8">
              Voir nos ballons <ArrowRight size={15} />
            </Link>
          </div>
          <img src="/design/hero.jpg" alt="Ballons de basketball, football américain et handball" className="aspect-[1/0.93] w-full rounded-2xl object-cover shadow-[0_24px_50px_-18px_rgba(0,0,0,0.7)]" />
        </div>
      </section>

      <section className="mx-auto max-w-[1304px] px-4 py-16 sm:px-11">
        <EnTete surtitre="Notre sélection" titre="Nos ballons essentiels" texte="Des modèles fiables et durables pour chaque discipline, prêts pour le terrain." />
        <div className="mt-10">
          <Etat loading={produits.loading} error={produits.error} vide={!produits.loading && !produits.error && liste.length === 0} messageVide="Aucun ballon disponible pour le moment." />
          <div className="grid gap-6 md:grid-cols-3">
            {liste.map((p) => (
              <ProduitCard key={p.id} produit={p} grand />
            ))}
          </div>
        </div>
      </section>

      <section id="pourquoi" className="scroll-mt-16 bg-panel">
        <div className="mx-auto max-w-[1304px] px-4 pb-20 pt-16 sm:px-11">
          <EnTete surtitre="Notre philosophie" titre="Pourquoi nous choisir ?" texte="Un commerce à taille humaine passionné par le jeu et le matériel bien pensé." />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {ATOUTS.map(({ icone: Icone, titre, texte }) => (
              <div key={titre} className="rounded-2xl bg-white/60 px-6 py-8 text-center">
                <span className="mx-auto flex size-14 items-center justify-center rounded-xl bg-brand text-white shadow-[0_8px_18px_-8px_rgba(227,6,19,0.8)]">
                  <Icone size={26} />
                </span>
                <h3 className="mt-5 font-display text-lg font-semibold uppercase">{titre}</h3>
                <p className="mx-auto mt-2 max-w-xs text-xs leading-relaxed text-slate-600">{texte}</p>
              </div>
            ))}
          </div>

          <div className="mx-auto mt-16 max-w-3xl rounded-2xl bg-ink px-6 py-10 text-center text-white">
            <p className="label text-[11px] text-salmon">Besoin d'un conseil ou d'une commande de club ?</p>
            <h2 className="mt-2 font-display text-3xl font-semibold uppercase">Contactez directement notre atelier</h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-slate-200">
              Nous accompagnons les particuliers, écoles et clubs locaux avec le sourire et des conseils adaptés.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <a href={`mailto:${CONTACT.email}`} className="btn !text-xs">
                <Mail size={14} /> Écrivez-nous par e-mail
              </a>
              <a href={`tel:${CONTACT.telephone.replace(/\s/g, '')}`} className="label rounded-full bg-white/15 px-5 py-2.5 text-xs text-white hover:bg-white/25">
                {CONTACT.telephone}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
