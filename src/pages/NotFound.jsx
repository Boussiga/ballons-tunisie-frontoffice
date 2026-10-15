import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="py-24 text-center">
      <p className="font-display text-7xl font-bold text-brand">404</p>
      <p className="mt-2 text-slate-600">Cette page n’existe pas.</p>
      <Link to="/" className="btn mt-6">Retour à l’accueil</Link>
    </div>
  )
}
