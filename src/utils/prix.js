import { FRAIS_LIVRAISON } from '../config'

export const QTE_MAX = 50 // the API refuses more than 50 of one line

// Same maths as the API (passerCommande): unit price × (1 − %/100), summed, then rounded to 2 decimals.

export const prixRemise = (prix, offre) => (offre ? prix * (1 - offre.pourcentageReduction / 100) : prix)

// Highest percentage wins; the first one is kept on a tie
export function meilleureOffre(offres) {
  if (!offres.length) return null
  return offres.reduce((best, o) => (o.pourcentageReduction > best.pourcentageReduction ? o : best))
}

// Each offer targets specific products (its `produits`), never packs: same rule as the
// API (avecOffreActive), which refuses an order line whose offer does not target the product.
export const offreProduit = (produitId, offres) =>
  meilleureOffre(offres.filter((o) => o.produits?.some((p) => p.id === produitId)))

// Offer applied to a cart line, or null
export const offreLigne = (ligne, offres) => (ligne.type === 'produit' ? offreProduit(ligne.id, offres) : null)

// Pass [] as offres for the total before discounts
export const totalLignes = (lignes, offres) =>
  Number(lignes.reduce((total, l) => total + prixRemise(l.prix, offreLigne(l, offres)) * l.quantite, 0).toFixed(2))

// What the client pays: items + one flat delivery fee per order
export const totalAvecLivraison = (totalArticles) => Number((totalArticles + FRAIS_LIVRAISON).toFixed(2))
