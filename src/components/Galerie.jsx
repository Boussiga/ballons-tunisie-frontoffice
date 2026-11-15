import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Visuel from './Visuel'

// Product gallery: big picture + thumbnails (up to 5 images, main image first).
// `children` is drawn over the big picture (offer badge...).
export default function Galerie({ images = [], url, alt = '', children }) {
  const liste = images.length ? images : url ? [{ id: 'principale', url }] : []
  const [index, setIndex] = useState(0)
  const courante = liste[index] ?? liste[0]
  const plusieurs = liste.length > 1
  const aller = (pas) => setIndex((i) => (i + pas + liste.length) % liste.length)

  return (
    <div>
      <div
        className="group relative overflow-hidden rounded-2xl bg-panel shadow-[0_2px_14px_rgba(20,30,40,0.06)]"
        onKeyDown={(e) => {
          if (!plusieurs) return
          if (e.key === 'ArrowLeft') aller(-1)
          if (e.key === 'ArrowRight') aller(1)
        }}
      >
        <Visuel url={courante?.url} alt={alt} fit="contain" className="aspect-square w-full lg:aspect-[1/0.95]" />
        {children}
        {plusieurs && (
          <>
            <button
              type="button"
              onClick={() => aller(-1)}
              aria-label="Image précédente"
              className="absolute left-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink shadow-sm transition hover:text-brand-dark sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={() => aller(1)}
              aria-label="Image suivante"
              className="absolute right-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink shadow-sm transition hover:text-brand-dark sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
            >
              <ChevronRight size={20} />
            </button>
            <span className="label absolute bottom-3 right-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] text-ink shadow-sm">
              {index + 1} / {liste.length}
            </span>
          </>
        )}
      </div>

      {plusieurs && (
        <div className="mt-3 grid grid-cols-5 gap-2 sm:gap-3">
          {liste.map((image, i) => (
            <button
              key={image.id ?? i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Voir l'image ${i + 1}`}
              aria-current={i === index}
              className={`overflow-hidden rounded-xl bg-panel ring-2 transition ${i === index ? 'ring-brand' : 'ring-transparent opacity-75 hover:opacity-100'}`}
            >
              <Visuel url={image.url} alt="" className="aspect-square w-full" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
