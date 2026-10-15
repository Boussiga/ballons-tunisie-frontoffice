// The API sends details as [{ champ, message }] (validation) or as plain strings (stock, offers).
export function getErrorDetails(err) {
  const list = err.response?.data?.erreurs
  if (!Array.isArray(list)) return []
  return list.map((e) => (typeof e === 'string' ? e : e.message)).filter(Boolean)
}

export function getErrorMessage(err, fallback = 'Une erreur est survenue. Veuillez réessayer.') {
  if (err.response?.status === 429) return 'Trop de requêtes. Patientez quelques instants avant de réessayer.'
  if (!err.response) return 'Impossible de joindre le serveur. Vérifiez votre connexion.'
  return getErrorDetails(err)[0] || err.response.data?.message || fallback
}
