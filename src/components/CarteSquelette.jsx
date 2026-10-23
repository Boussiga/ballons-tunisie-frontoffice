// Placeholder product card while a list loads, so the page does not jump.
// `grand` matches the home page variant of ProduitCard.
export default function CarteSquelette({ grand = false }) {
  return (
    <div className="card animate-pulse p-3 sm:p-4" aria-hidden>
      <div className={`rounded-xl bg-panel ${grand ? 'aspect-[1/0.95]' : 'aspect-[1/1]'}`} />
      <div className="mt-4 h-3 w-1/4 rounded bg-panel" />
      <div className="mt-2 h-5 w-3/4 rounded bg-panel" />
      <div className="mt-2 h-3 w-full rounded bg-panel" />
      <div className="mt-6 flex items-end justify-between">
        <div className="h-7 w-20 rounded bg-panel" />
        <div className="h-8 w-24 rounded-md bg-panel" />
      </div>
    </div>
  )
}
