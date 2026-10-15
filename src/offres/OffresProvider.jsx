import { useEffect, useMemo, useState } from 'react'
import { OffresContext } from './OffresContext'
import { getOffresActives } from '../api/storeApi'
import { meilleureOffre } from '../utils/prix'

// Loads the active offers once and shares them with the whole site.
export default function OffresProvider({ children }) {
  const [reload, setReload] = useState(0)
  const [state, setState] = useState({ key: -1, offres: [] })

  useEffect(() => {
    let ignore = false
    getOffresActives()
      .then((offres) => {
        if (!ignore) setState({ key: reload, offres })
      })
      .catch(() => {
        if (!ignore) setState({ key: reload, offres: [] }) // no offers is a valid state; the site still works
      })
    return () => {
      ignore = true
    }
  }, [reload])

  const value = useMemo(
    () => ({
      offres: state.offres,
      offre: meilleureOffre(state.offres), // the offer applied to prices
      chargee: state.key === reload,
      recharger: () => setReload((n) => n + 1),
    }),
    [state, reload],
  )

  return <OffresContext.Provider value={value}>{children}</OffresContext.Provider>
}
