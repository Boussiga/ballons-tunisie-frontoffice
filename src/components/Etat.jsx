// Loading / error / empty states for lists
export default function Etat({ loading, error, vide, messageVide = 'Aucun résultat.' }) {
  if (error) return <p className="rounded-xl bg-red-50 px-4 py-6 text-center text-red-700">{error}</p>
  if (loading) return <p className="py-16 text-center text-slate-500">Chargement…</p>
  if (vide) return <p className="py-16 text-center text-slate-500">{messageVide}</p>
  return null
}
