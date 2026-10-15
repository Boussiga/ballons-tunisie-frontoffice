import client from './client'

const PRODUITS = '/api/store/produits'
const PACKS = '/api/store/packs'

// Only in-stock products are returned.
export async function getProduits({ page = 1, limit = 12, search = '', categorieId = '', taille = '' } = {}) {
  const params = { page, limit }
  if (search) params.search = search
  if (categorieId) params.categorieId = categorieId
  if (taille) params.taille = taille
  const { data } = await client.get(`${PRODUITS}/getAllProduitsPublic`, { params })
  return data // { data: [...], pagination }
}

export async function getProduit(id) {
  const { data } = await client.get(`${PRODUITS}/getProduitPublic/${id}`)
  return data
}

// The API has no public "categories" route, so the filters are built from the
// available products (one request, kept for the whole visit).
let facetsPromise = null
export function getFacets() {
  if (!facetsPromise) {
    facetsPromise = getProduits({ limit: 100 })
      .then(({ data }) => {
        const categories = new Map()
        const tailles = new Set()
        data.forEach((p) => {
          if (p.categorie) categories.set(p.categorie.id, p.categorie.nom)
          if (p.taille) tailles.add(p.taille)
        })
        return {
          categories: [...categories].map(([id, nom]) => ({ id, nom })).sort((a, b) => a.nom.localeCompare(b.nom)),
          tailles: [...tailles].sort((a, b) => String(a).localeCompare(String(b), 'fr', { numeric: true })),
        }
      })
      .catch((err) => {
        facetsPromise = null // retry next time
        throw err
      })
  }
  return facetsPromise
}

export async function getPacks({ page = 1, limit = 12, search = '' } = {}) {
  const params = { page, limit }
  if (search) params.search = search
  const { data } = await client.get(`${PACKS}/getAllPacksPublic`, { params })
  return data
}

export async function getOffresActives() {
  const { data } = await client.get('/api/store/offres/getOffresActives')
  return data.data // [{ id, titre, pourcentageReduction, dateDebut, dateFin, joursRestants }]
}

// lignes: [{ produitId | packId, quantite, offreId? }]
export async function passerCommande({ nomClient, telephoneClient, adresseLivraison, lignes }) {
  const { data } = await client.post('/api/store/commandes/passerCommande', {
    nomClient,
    telephoneClient,
    adresseLivraison,
    lignes,
  })
  return data.commande
}

export async function suiviCommande(id) {
  const { data } = await client.get(`/api/store/commandes/suiviCommande/${id}`)
  return data
}
