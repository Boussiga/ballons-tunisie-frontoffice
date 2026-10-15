import { BrowserRouter, Route, Routes } from 'react-router-dom'
import CartProvider from './cart/CartProvider'
import OffresProvider from './offres/OffresProvider'
import Layout from './components/Layout'
import Accueil from './pages/Accueil'
import Produits from './pages/Produits'
import ProduitDetail from './pages/ProduitDetail'
import Packs from './pages/Packs'
import Offres from './pages/Offres'
import Panier from './pages/Panier'
import Suivi from './pages/Suivi'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <BrowserRouter>
      <OffresProvider>
        <CartProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Accueil />} />
              <Route path="/produits" element={<Produits />} />
              <Route path="/produits/:id" element={<ProduitDetail />} />
              <Route path="/packs" element={<Packs />} />
              <Route path="/offres" element={<Offres />} />
              <Route path="/panier" element={<Panier />} />
              <Route path="/suivi" element={<Suivi />} />
              <Route path="/suivi/:id" element={<Suivi />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </CartProvider>
      </OffresProvider>
    </BrowserRouter>
  )
}
