import { Link } from 'react-router-dom'
import {
  ArrowRight,
  CircleCheck,
  ClipboardList,
  Headset,
  Mail,
  MousePointerClick,
  Percent,
  Phone,
  PhoneCall,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Tag,
  Truck,
} from 'lucide-react'
import { getFacets, getProduits } from '../api/storeApi'
import { useApi } from '../api/useApi'
import { CONTACT, FRAIS_LIVRAISON } from '../config'
import { useOffres } from '../offres/useOffres'
import { DEVISE, formatDate } from '../utils/format'
import BanniereOffre from '../components/BanniereOffre'
import CarteSquelette from '../components/CarteSquelette'
import ProduitCard from '../components/ProduitCard'
import Reassurance from '../components/Reassurance'

const TEL = `tel:${CONTACT.telephone.replace(/\s/g, '')}`

const ETAPES = [
  { icone: MousePointerClick, titre: 'Choisissez vos ballons', texte: 'Parcourez le catalogue, filtrez par discipline et par taille, consultez chaque fiche produit.' },
  { icone: ShoppingBag, titre: 'Ajoutez au panier', texte: 'Ajustez les quantités. Les remises en cours sont appliquées automatiquement.' },
  { icone: ClipboardList, titre: 'Laissez vos coordonnées', texte: 'Nom, téléphone et adresse de livraison : c’est tout, aucune carte bancaire demandée.' },
  { icone: PhoneCall, titre: 'Nous confirmons et expédions', texte: 'Nous vous appelons pour valider la commande, puis elle part sous 24 à 48 h. Suivez-la en ligne.' },
]

const ATOUTS = [
  { icone: ShieldCheck, titre: 'Qualité durable', texte: "Matériaux choisis avec soin pour garantir résistance à l'usure, bonne tenue de pression et toucher agréable." },
  { icone: Truck, titre: 'Envoi rapide', texte: 'Vos commandes sont préparées et expédiées directement depuis notre stock sous 24 à 48 heures.' },
  { icone: Headset, titre: 'Conseil & service direct', texte: 'Une question sur la taille ou le modèle ? Nous vous répondons directement par téléphone ou email.' },
]

const FAQ = [
  {
    q: 'Comment se passe le paiement ?',
    r: "Il n'y a aucun paiement en ligne. Après votre commande, nous vous appelons pour confirmer les articles, l'adresse et les modalités de règlement.",
  },
  {
    q: 'Quels sont les délais et frais de livraison ?',
    r: `Les commandes sont préparées et expédiées depuis notre stock sous 24 à 48 heures. Les frais de livraison sont de ${FRAIS_LIVRAISON} ${DEVISE} par commande, quel que soit le montant.`,
  },
  {
    q: 'Quelle taille de ballon choisir ?',
    r: "La taille est indiquée sur chaque fiche produit et vous pouvez filtrer le catalogue par taille. En cas de doute (âge des joueurs, catégorie de compétition…), appelez-nous : nous vous conseillons gratuitement.",
  },
  {
    q: 'Je commande pour un club ou une école, est-ce possible ?',
    r: 'Oui. Nos packs regroupent plusieurs ballons à prix réduit, et nous accompagnons les clubs et écoles pour les commandes en quantité. Contactez-nous pour un besoin spécifique.',
  },
  {
    q: 'Comment suivre ma commande ?',
    r: 'Un numéro de commande vous est donné à la validation. Saisissez-le sur la page « Suivre ma commande » pour connaître son état à tout moment.',
  },
]

function EnTete({ surtitre, titre, texte, clair = false }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className={`label text-xs ${clair ? 'text-salmon' : 'text-brand-dark'}`}>{surtitre}</p>
      <h2 className={`mt-1 font-display text-3xl font-bold uppercase sm:text-4xl ${clair ? 'text-white' : 'text-ink'}`}>{titre}</h2>
      {texte && <p className={`mt-3 text-sm leading-relaxed sm:text-base ${clair ? 'text-slate-200' : 'text-slate-600'}`}>{texte}</p>}
    </div>
  )
}

export default function Accueil() {
  const { offre } = useOffres()
  const produits = useApi('accueil:produits', () => getProduits({ limit: 6 }))
  const facets = useApi('facets', getFacets).data
  const liste = produits.data?.data ?? []
  const categories = facets?.categories ?? []

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-ink text-white">
        <div aria-hidden className="absolute inset-0 bg-[repeating-linear-gradient(115deg,transparent_0_220px,rgba(255,255,255,0.04)_220px_440px)]" />
        <div className="relative mx-auto grid max-w-[1304px] items-center gap-10 px-4 py-12 sm:px-11 lg:grid-cols-[1.15fr_1fr] lg:py-20">
          <div>
            <span className="label inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[11px] text-salmon">
              <Tag size={12} /> Boutique & atelier indépendant en Tunisie
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold uppercase leading-[1.1] sm:text-5xl lg:text-[60px]">
              Des ballons de qualité pour vos <span className="text-brand">matchs et entraînements</span>
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-slate-200 sm:text-lg">
              Sélectionnés et réglés avec soin dans notre atelier. Commandez en 2 minutes, sans paiement en ligne : nous vous appelons pour confirmer, puis nous expédions sous 24 à 48 h.
            </p>

            <ul className="mt-6 grid max-w-lg gap-2.5 text-sm text-slate-100 sm:grid-cols-2">
              {['Livraison ' + FRAIS_LIVRAISON + ' ' + DEVISE + ' par commande', 'Expédition sous 24 à 48 h', 'Particuliers, écoles & clubs', 'Conseil personnalisé gratuit'].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <CircleCheck size={16} className="shrink-0 text-brand" /> {t}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/produits" className="btn !px-7 !py-3.5 !text-base">
                Commander mes ballons <ArrowRight size={16} />
              </Link>
              <Link to="/offres" className="label inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3.5 text-sm text-white transition hover:bg-white/10">
                Voir les packs & offres
              </Link>
            </div>
            <a href={TEL} className="mt-5 inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white">
              <Phone size={14} className="text-salmon" /> Une question avant de commander ? <span className="font-semibold text-white underline-offset-4 hover:underline">{CONTACT.telephone}</span>
            </a>
          </div>

          <div className="relative">
            <img
              src="/design/hero.jpg"
              alt="Ballons de basketball, football américain et handball"
              className="aspect-[1/0.93] w-full rounded-2xl object-cover shadow-[0_24px_50px_-18px_rgba(0,0,0,0.7)]"
            />
            {offre && (
              <Link
                to="/offres"
                className="absolute -bottom-5 left-4 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-ink shadow-[0_16px_34px_-12px_rgba(0,0,0,0.6)] transition hover:-translate-y-0.5 sm:left-6"
              >
                <span className="flex size-11 items-center justify-center rounded-xl bg-brand text-white"><Percent size={20} /></span>
                <span>
                  <span className="block font-display text-2xl font-bold leading-none text-brand-dark">−{offre.pourcentageReduction} %</span>
                  <span className="label block text-[10px] text-slate-500">{offre.titre} · jusqu’au {formatDate(offre.dateFin)}</span>
                </span>
              </Link>
            )}
          </div>
        </div>
      </section>

      <Reassurance />

      <BanniereOffre className="pt-10" />

      {/* SELECTION */}
      <section className="mx-auto max-w-[1304px] px-4 py-16 sm:px-11">
        <EnTete surtitre="Notre sélection" titre="Nos ballons essentiels" texte="Des modèles fiables et durables pour chaque discipline, en stock et prêts à être expédiés." />

        {categories.length > 0 && (
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            <Link to="/produits" className="pill bg-white shadow-sm">Tous les ballons</Link>
            {categories.map((c) => (
              <Link key={c.id} to={`/produits?categorie=${c.id}`} className="pill bg-white shadow-sm">
                {c.nom}
              </Link>
            ))}
            <Link to="/offres" className="pill bg-white shadow-sm">Packs</Link>
          </div>
        )}

        <div className="mt-10">
          {produits.error && <p className="rounded-xl bg-red-50 px-4 py-6 text-center text-red-700">{produits.error}</p>}
          {!produits.loading && !produits.error && liste.length === 0 && (
            <p className="py-16 text-center text-slate-500">Aucun ballon disponible pour le moment.</p>
          )}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {produits.loading ? [0, 1, 2].map((i) => <CarteSquelette key={i} grand />) : liste.map((p) => <ProduitCard key={p.id} produit={p} grand />)}
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link to="/produits" className="btn !px-7 !py-3">
            Voir tout le catalogue <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* HOW TO ORDER */}
      <section id="commander" className="scroll-mt-16 bg-ink text-white">
        <div className="mx-auto max-w-[1304px] px-4 py-16 sm:px-11">
          <EnTete clair surtitre="Simple et sans risque" titre="Comment commander ?" texte="Quatre étapes, aucune carte bancaire. Nous restons joignables à chaque étape." />
          <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {ETAPES.map(({ icone: Icone, titre, texte }, i) => (
              <li key={titre} className="relative rounded-2xl bg-white/[0.06] p-6 ring-1 ring-white/10">
                <span className="absolute right-5 top-4 font-display text-5xl font-bold leading-none text-white/10">{i + 1}</span>
                <span className="flex size-12 items-center justify-center rounded-xl bg-brand text-white shadow-[0_8px_18px_-8px_rgba(227,6,19,0.8)]">
                  <Icone size={22} />
                </span>
                <h3 className="mt-5 font-display text-lg font-semibold uppercase">{titre}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">{texte}</p>
              </li>
            ))}
          </ol>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link to="/produits" className="btn !px-7 !py-3">
              Je commence ma commande <ArrowRight size={15} />
            </Link>
            <Link to="/suivi" className="label inline-flex items-center rounded-full bg-white/15 px-6 py-3 text-sm text-white hover:bg-white/25">
              Suivre une commande
            </Link>
          </div>
        </div>
      </section>

      {/* WHY US + FAQ + CONTACT */}
      <section id="pourquoi" className="scroll-mt-16 bg-panel">
        <div className="mx-auto max-w-[1304px] px-4 pb-20 pt-16 sm:px-11">
          <EnTete surtitre="Notre philosophie" titre="Pourquoi nous choisir ?" texte="Un commerce à taille humaine passionné par le jeu et le matériel bien pensé." />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {ATOUTS.map(({ icone: Icone, titre, texte }) => (
              <div key={titre} className="rounded-2xl bg-white px-6 py-8 text-center shadow-[0_2px_14px_rgba(20,30,40,0.05)]">
                <span className="mx-auto flex size-14 items-center justify-center rounded-xl bg-brand text-white shadow-[0_8px_18px_-8px_rgba(227,6,19,0.8)]">
                  <Icone size={26} />
                </span>
                <h3 className="mt-5 font-display text-lg font-semibold uppercase">{titre}</h3>
                <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-slate-600">{texte}</p>
              </div>
            ))}
          </div>

          <div id="faq" className="mx-auto mt-20 max-w-3xl scroll-mt-20">
            <EnTete surtitre="Vos questions" titre="Questions fréquentes" />
            <div className="mt-8 space-y-3">
              {FAQ.map(({ q, r }) => (
                <details key={q} className="group card overflow-hidden">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-semibold text-ink hover:text-brand-dark [&::-webkit-details-marker]:hidden">
                    {q}
                    <Plus size={18} className="shrink-0 text-brand-dark transition group-open:rotate-45" />
                  </summary>
                  <p className="px-5 pb-5 text-sm leading-relaxed text-slate-600">{r}</p>
                </details>
              ))}
            </div>
          </div>

          <div className="mx-auto mt-16 max-w-3xl rounded-2xl bg-ink px-6 py-10 text-center text-white">
            <p className="label text-[11px] text-salmon">Besoin d'un conseil ou d'une commande de club ?</p>
            <h2 className="mt-2 font-display text-3xl font-semibold uppercase">Contactez directement notre atelier</h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-slate-200">
              Nous accompagnons les particuliers, écoles et clubs locaux avec le sourire et des conseils adaptés.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <a href={TEL} className="btn !text-xs">
                <Phone size={14} /> Appeler le {CONTACT.telephone}
              </a>
              <a href={`mailto:${CONTACT.email}`} className="label inline-flex items-center gap-2 rounded-full bg-white/15 px-5 py-2.5 text-xs text-white hover:bg-white/25">
                <Mail size={14} /> Écrivez-nous par e-mail
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile: keep the order and call actions always within reach */}
      <div className="h-16 lg:hidden" />
      <div className="fixed inset-x-0 bottom-0 z-20 flex gap-2 border-t border-slate-200 bg-white/95 p-3 backdrop-blur lg:hidden">
        <a href={TEL} aria-label={`Appeler le ${CONTACT.telephone}`} className="flex size-11 shrink-0 items-center justify-center rounded-full border border-slate-200 text-brand-dark">
          <Phone size={18} />
        </a>
        <Link to="/produits" className="btn flex-1 !py-3">
          Commander mes ballons <ArrowRight size={15} />
        </Link>
      </div>
    </>
  )
}
