import { useContext } from 'react'
import { OffresContext } from './OffresContext'

export function useOffres() {
  const ctx = useContext(OffresContext)
  if (!ctx) throw new Error('useOffres must be used inside <OffresProvider>')
  return ctx
}
