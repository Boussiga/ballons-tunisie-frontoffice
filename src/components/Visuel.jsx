import { CircleDot } from 'lucide-react'
import { imageSrc } from '../utils/format'

// Product picture, or a placeholder when there is none
export default function Visuel({ url, alt = '', className = '', fit = 'cover' }) {
  const src = imageSrc(url)
  if (src) return <img src={src} alt={alt} loading="lazy" className={`${fit === 'contain' ? 'object-contain' : 'object-cover'} ${className}`} />
  return (
    <div className={`flex items-center justify-center bg-panel text-slate-300 ${className}`}>
      <CircleDot size={40} />
    </div>
  )
}
