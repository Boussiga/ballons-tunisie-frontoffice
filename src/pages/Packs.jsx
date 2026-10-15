import { Navigate } from 'react-router-dom'

// Packs now live on the "Offres & Packs" page
export default function Packs() {
  return <Navigate to="/offres" replace />
}
