import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { getErrorDetails, getErrorMessage } from '../api/errors'
import { passerCommande } from '../api/storeApi'
import { useCart } from '../cart/useCart'
import { useOffres } from '../offres/useOffres'
import BandeauPage from '../components/BandeauPage'
import Visuel from '../components/Visuel'
import { formatPrix } from '../utils/format'
import { memoriserCommande } from '../utils/commandesLocales'
import { QTE_MAX, prixRemise, totalLignes } from '../utils/prix'

const fieldClass = 'field mt-1'

export default function Panier() {
  const { lignes, changerQuantite, retirer, vider } = useCart()
  const { offre, recharger } = useOffres()
  const navigate = useNavigate()

  const [nom, setNom] = useState('')
  const [telephone, setTelephone] = useState('')
  const [adresse, setAdresse] = useState('')
  const [erreur, setErreur] = useState('')
  const [details, setDetails] = useState([])
  const [envoi, setEnvoi] = useState(false)

  const sousTotal = totalLignes(lignes, null)
  const total = totalLignes(lignes, offre)

  async function handleSubmit(e) {
    e.preventDefault()
    setErreur('')
    setDetails([])

    const tel = telephone.replace(/[\s.\-()]/g, '') // "55 123 456" -> "55123456"
    if (!/^[0-9+]{8,15}$/.test(tel)) {
      setErreur('Le numéro de téléphone est invalide (8 à 15 chiffres).')
      return
    }

    setEnvoi(true)
    try {
      const commande = await passerCommande({
        nomClient: nom.trim(),
        telephoneClient: tel,
        adresseLivraison: adresse.trim(),
        lignes: lignes.map((l) => ({
          [l.type === 'pack' ? 'packId' : 'produitId']: l.id,
          quantite: l.quantite,
          ...(offre && { offreId: offre.id }),
        })),
      })
      memoriserCommande(commande)
      navigate(`/suivi/${commande.id}`, { state: { nouvelle: true } })
      vider()
    } catch (err) {
      const liste = getErrorDetails(err)
      setErreur(getErrorMessage(err))
      setDetails(liste)
      if (liste.some((d) => /offre/i.test(d))) {
        setErreur('Une offre a pris fin : les prix ont été mis à jour. Vérifiez votre panier puis validez à nouveau.')
        setDetails([])
      }
      recharger() // offers may have changed
      setEnvoi(false)
    }
  }

  if (lignes.length === 0) {
    return (
      <div className="py-24 text-center">
        <h1 className="font-display text-4xl font-bold uppercase text-ink">Votre panier est vide</h1>
        <Link to="/produits" className="btn mt-6">Voir les ballons</Link>
      </div>
    )
  }

  return (
    <>
      <BandeauPage fil="Panier" titre="Mon panier" />
      <div className="mx-auto max-w-[1304px] px-4 py-8 sm:px-11">
      <div className="grid gap-8 lg:grid-cols-5">
        <ul className="space-y-4 lg:col-span-3">
          {lignes.map((l) => (
            <li key={l.cle} className="card flex gap-4 p-4">
              <Visuel url={l.imageUrl} alt={l.nom} fit="contain" className="h-20 w-20 shrink-0 rounded-xl" />
              <div className="flex flex-1 flex-col">
                <div className="flex justify-between gap-2">
                  <div>
                    <p className="font-display text-lg font-semibold uppercase leading-tight text-ink">{l.nom}</p>
                    <p className="text-xs text-slate-500">{l.type === 'pack' ? 'Pack' : l.taille ? `Taille ${l.taille}` : 'Ballon'}</p>
                  </div>
                  <button onClick={() => retirer(l.cle)} aria-label={`Retirer ${l.nom}`} className="text-slate-400 hover:text-brand-dark">
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="mt-auto flex items-end justify-between pt-3">
                  <div className="flex items-center rounded-lg bg-panel">
                    <button
                      onClick={() => changerQuantite(l.cle, l.quantite - 1)}
                      disabled={l.quantite <= 1}
                      aria-label="Diminuer la quantité"
                      className="px-2 py-1 disabled:opacity-30"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center text-sm">{l.quantite}</span>
                    <button
                      onClick={() => changerQuantite(l.cle, l.quantite + 1)}
                      disabled={l.quantite >= QTE_MAX}
                      aria-label="Augmenter la quantité"
                      className="px-2 py-1 disabled:opacity-30"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <p className="text-right">
                    {offre && <span className="mr-2 text-xs text-slate-400 line-through">{formatPrix(l.prix * l.quantite)}</span>}
                    <span className="font-display text-xl font-bold text-ink">{formatPrix(prixRemise(l.prix, offre) * l.quantite)}</span>
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <form onSubmit={handleSubmit} className="card space-y-4 p-6 lg:col-span-2 lg:self-start">
          <div className="space-y-1 border-b border-slate-100 pb-4 text-sm text-slate-600">
            {offre && (
              <>
                <p className="flex justify-between">
                  <span>Sous-total</span>
                  <span>{formatPrix(sousTotal)}</span>
                </p>
                <p className="flex justify-between text-green-700">
                  <span>
                    {offre.titre} (−{offre.pourcentageReduction} %)
                  </span>
                  <span>−{formatPrix(sousTotal - total)}</span>
                </p>
              </>
            )}
            <p className="flex items-baseline justify-between pt-1 text-base text-ink">
              <span>Total</span>
              <span className="font-display text-4xl font-bold text-brand-dark">{formatPrix(total)}</span>
            </p>
          </div>

          <h2 className="font-display text-xl font-semibold uppercase text-ink">Vos coordonnées</h2>

          <label className="block text-sm text-slate-600">
            Nom complet
            <input required minLength={2} maxLength={100} value={nom} onChange={(e) => setNom(e.target.value)} autoComplete="name" className={fieldClass} />
          </label>
          <label className="block text-sm text-slate-600">
            Téléphone
            <input required type="tel" value={telephone} onChange={(e) => setTelephone(e.target.value)} autoComplete="tel" placeholder="Ex : 55 123 456" className={fieldClass} />
          </label>
          <label className="block text-sm text-slate-600">
            Adresse de livraison
            <textarea required minLength={5} maxLength={300} rows={3} value={adresse} onChange={(e) => setAdresse(e.target.value)} autoComplete="street-address" className={fieldClass} />
          </label>

          {erreur && (
            <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              <p>{erreur}</p>
              {details.length > 1 && (
                <ul className="mt-1 list-disc pl-5">
                  {details.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <button type="submit" disabled={envoi} className="btn w-full !rounded-xl !py-3.5 !text-base">
            {envoi ? 'Envoi en cours…' : 'Passer la commande'}
          </button>
          <p className="text-center text-xs text-slate-500">Aucun paiement en ligne : nous vous contactons pour confirmer la commande.</p>
        </form>
      </div>
      </div>
    </>
  )
}
