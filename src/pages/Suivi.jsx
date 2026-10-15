import { useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { Check, Copy } from 'lucide-react'
import { suiviCommande } from '../api/storeApi'
import { useApi } from '../api/useApi'
import Etat from '../components/Etat'
import Visuel from '../components/Visuel'
import { formatDateHeure, formatPrix } from '../utils/format'
import { UUID_RE, lireCommandes } from '../utils/commandesLocales'
import { prixRemise } from '../utils/prix'

const ETAPES = [
  { statut: 'en_attente', label: 'Reçue' },
  { statut: 'confirmee', label: 'Confirmée' },
  { statut: 'livree', label: 'Livrée' },
]

const MESSAGES = {
  en_attente: 'Votre commande a bien été reçue. Nous vous contacterons très bientôt pour la confirmer.',
  confirmee: 'Votre commande est confirmée et en cours de préparation.',
  livree: 'Votre commande a été livrée. Merci pour votre confiance !',
  annulee: 'Cette commande a été annulée.',
}

function Recherche() {
  const navigate = useNavigate()
  const [numero, setNumero] = useState('')
  const [erreur, setErreur] = useState('')
  const [recentes] = useState(lireCommandes)

  function handleSubmit(e) {
    e.preventDefault()
    const id = numero.trim()
    if (!UUID_RE.test(id)) {
      setErreur('Numéro invalide. Copiez-le tel quel depuis la page de confirmation.')
      return
    }
    navigate(`/suivi/${id}`)
  }

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="font-display text-4xl font-bold uppercase text-ink">Suivre ma commande</h1>
      <form onSubmit={handleSubmit} className="mt-6 space-y-3 card p-6">
        <label className="block text-sm text-slate-600">
          Numéro de commande
          <input
            required
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
            placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
            className="field mt-1 font-mono"
          />
        </label>
        {erreur && <p className="text-sm text-red-600">{erreur}</p>}
        <button type="submit" className="btn">
          Rechercher
        </button>
      </form>

      {recentes.length > 0 && (
        <div className="mt-8">
          <h2 className="font-display text-xl font-semibold uppercase text-ink">Vos commandes SUR CET APPAREIL</h2>
          <ul className="mt-3 divide-y divide-slate-100 card">
            {recentes.map((c) => (
              <li key={c.id}>
                <Link to={`/suivi/${c.id}`} className="flex items-center justify-between px-4 py-3 text-sm hover:bg-slate-50">
                  <span>
                    <span className="block font-mono text-xs text-slate-500">{c.id.slice(0, 8).toUpperCase()}</span>
                    <span className="text-slate-600">{formatDateHeure(c.dateCommande)}</span>
                  </span>
                  <span className="font-display text-xl font-bold text-brand-dark">{formatPrix(c.total)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function Resultat({ id }) {
  const { state } = useLocation()
  const [copie, setCopie] = useState(false)
  const { data: c, error, loading } = useApi(`suivi:${id}`, () => suiviCommande(id))

  async function copier() {
    try {
      await navigator.clipboard.writeText(id)
      setCopie(true)
      setTimeout(() => setCopie(false), 1500)
    } catch {
      // clipboard unavailable: the number is selectable on screen
    }
  }

  if (!c) {
    return (
      <div className="mx-auto max-w-xl text-center">
        <Etat loading={loading} error={error} />
        <Link to="/suivi" className="mt-4 inline-block text-brand-dark hover:underline">
          ← Rechercher une autre commande
        </Link>
      </div>
    )
  }

  const annulee = c.statut === 'annulee'
  const etape = ETAPES.findIndex((e) => e.statut === c.statut)

  return (
    <div className="mx-auto max-w-2xl">
      {state?.nouvelle && (
        <div className="mb-6 rounded-lg bg-green-50 px-5 py-4 text-green-800">
          <p className="font-display text-xl">MERCI {c.nomClient.toUpperCase()} !</p>
          <p className="text-sm">Votre commande est enregistrée. Gardez le numéro ci-dessous pour la suivre.</p>
        </div>
      )}

      <h1 className="font-display text-4xl font-bold uppercase text-ink">Ma commande</h1>
      <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
        <span className="break-all font-mono">{c.id}</span>
        <button onClick={copier} aria-label="Copier le numéro" className="text-slate-400 hover:text-brand-dark">
          {copie ? <Check size={16} /> : <Copy size={16} />}
        </button>
      </div>
      <p className="text-sm text-slate-500">Passée le {formatDateHeure(c.dateCommande)}</p>

      <div className="mt-6 card p-6">
        {annulee ? (
          <p className="rounded bg-red-50 px-4 py-3 font-medium text-red-700">Commande annulée</p>
        ) : (
          <ol className="flex items-center">
            {ETAPES.map((e, i) => (
              <li key={e.statut} className={`flex items-center ${i < ETAPES.length - 1 ? 'flex-1' : ''}`}>
                <span className="flex flex-col items-center">
                  <span className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${i <= etape ? 'bg-brand-dark text-white' : 'bg-slate-200 text-slate-500'}`}>
                    {i < etape || c.statut === 'livree' ? <Check size={16} /> : i + 1}
                  </span>
                  <span className={`mt-1 text-xs ${i <= etape ? 'font-medium text-ink' : 'text-slate-400'}`}>{e.label}</span>
                </span>
                {i < ETAPES.length - 1 && <span className={`mx-2 mb-5 h-0.5 flex-1 ${i < etape ? 'bg-brand-dark' : 'bg-slate-200'}`} />}
              </li>
            ))}
          </ol>
        )}
        <p className="mt-4 text-sm text-slate-600">{MESSAGES[c.statut]}</p>
      </div>

      <ul className="mt-6 divide-y divide-slate-100 card">
        {c.lignes.map((l, i) => (
          <li key={i} className="flex gap-4 p-4">
            <Visuel url={l.produit?.imageUrl} alt="" fit="contain" className="h-16 w-16 shrink-0 rounded-xl" />
            <div className="flex-1">
              <p className="font-medium text-ink">{l.produit?.nom ?? (l.pack ? `Pack : ${l.pack.nom}` : 'Article')}</p>
              <p className="text-sm text-slate-500">
                Quantité : {l.quantite}
                {l.offre && <span className="ml-2 text-green-700">{l.offre.titre} (−{l.offre.pourcentageReduction} %)</span>}
              </p>
            </div>
            <p className="font-display text-lg text-ink">{formatPrix(prixRemise(l.prixInitiale, l.offre) * l.quantite)}</p>
          </li>
        ))}
        <li className="flex items-baseline justify-between p-4">
          <span className="text-slate-600">Total</span>
          <span className="font-display text-4xl font-bold text-brand-dark">{formatPrix(c.total)}</span>
        </li>
      </ul>

      <Link to="/produits" className="mt-6 inline-block text-brand-dark hover:underline">
        ← Continuer mes achats
      </Link>
    </div>
  )
}

function SuiviContenu() {
  const { id } = useParams()
  if (!id) return <Recherche />
  if (!UUID_RE.test(id)) {
    return (
      <div className="py-10 text-center">
        <p className="text-slate-600">Ce numéro de commande n’est pas valide.</p>
        <Link to="/suivi" className="mt-3 inline-block text-brand-dark hover:underline">
          ← Rechercher une commande
        </Link>
      </div>
    )
  }
  return <Resultat key={id} id={id} />
}

export default function Suivi() {
  return (
    <div className="mx-auto max-w-[1304px] px-4 py-10 sm:px-11">
      <SuiviContenu />
    </div>
  )
}
