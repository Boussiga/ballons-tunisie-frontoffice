import { FRAIS_LIVRAISON } from '../config'

export const QTE_MAX = 50 // the API refuses more than 50 of one line

// Same maths as the API (passerCommande): unit price × (1 − %/100), summed, then rounded to 2 decimals.

export const prixRemise = (prix, offre) => (offre ? prix * (1 - offre.pourcentageReduction / 100) : prix)

export const totalLignes = (lignes, offre) =>
  Number(lignes.reduce((total, l) => total + prixRemise(l.prix, offre) * l.quantite, 0).toFixed(2))

// What the client pays: items + one flat delivery fee per order
export const totalAvecLivraison = (totalArticles) => Number((totalArticles + FRAIS_LIVRAISON).toFixed(2))

// Offers are not linked to products in the database, so the best active offer
// (highest percentage) is applied to every line. Change it here if the rule changes.
export function meilleureOffre(offres) {
  if (!offres.length) return null
  return offres.reduce((best, o) => (o.pourcentageReduction > best.pourcentageReduction ? o : best))
}
