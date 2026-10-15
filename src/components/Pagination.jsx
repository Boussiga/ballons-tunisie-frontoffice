export default function Pagination({ pagination, onPage }) {
  if (!pagination || pagination.totalPages <= 1) return null

  return (
    <nav className="mt-10 flex items-center justify-center gap-4 text-sm text-slate-600" aria-label="Pagination">
      <button disabled={!pagination.hasPrevPage} onClick={() => onPage(pagination.page - 1)} className="pill bg-white disabled:opacity-40">
        Précédent
      </button>
      <span>
        Page {pagination.page} / {pagination.totalPages}
      </span>
      <button disabled={!pagination.hasNextPage} onClick={() => onPage(pagination.page + 1)} className="pill bg-white disabled:opacity-40">
        Suivant
      </button>
    </nav>
  )
}
