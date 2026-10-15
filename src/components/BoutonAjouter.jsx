import { useState } from 'react'
import { Check, ShoppingBag } from 'lucide-react'

export default function BoutonAjouter({ onAdd, disabled = false, className = '', children = 'Ajouter' }) {
  const [ajoute, setAjoute] = useState(false)

  function handleClick() {
    onAdd()
    setAjoute(true)
    setTimeout(() => setAjoute(false), 1500)
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={handleClick}
      className={`label flex items-center justify-center gap-2 rounded-md bg-brand-dark px-4 py-2 text-xs text-white shadow-sm transition hover:bg-brand disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {ajoute ? <Check size={14} /> : <ShoppingBag size={14} />}
      {ajoute ? 'Ajouté' : children}
    </button>
  )
}
