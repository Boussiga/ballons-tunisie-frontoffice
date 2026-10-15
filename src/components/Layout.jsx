import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { House, Menu, Search, X, Phone, Mail } from 'lucide-react'
import { useCart } from '../cart/useCart'
import { CONTACT } from '../config'

const LIENS = [
  { to: '/', label: 'Accueil', end: true, icone: true },
  { to: '/produits', label: 'Nos ballons' },
  { to: '/suivi', label: 'Suivre ma commande' },
  { to: '/#pourquoi', label: 'Pourquoi nous choisir', hash: true },
]

function Navigation({ onNavigate, className = '' }) {
  const { pathname, hash } = useLocation()
  return (
    <nav className={className}>
      {LIENS.map((l) => {
        const actif = l.hash ? pathname === '/' && hash === '#pourquoi' : l.end ? pathname === '/' && !hash : pathname.startsWith(l.to) || (l.to === '/produits' && /^\/(offres|packs)/.test(pathname))
        return (
          <NavLink
            key={l.to}
            to={l.to}
            onClick={onNavigate}
            className={`label flex items-center gap-1.5 border-b-2 py-1.5 text-[13px] ${actif ? 'border-brand-dark text-brand-dark' : 'border-transparent text-ink hover:text-brand-dark'}`}
          >
            {l.icone && <House size={14} />}
            {l.label}
          </NavLink>
        )
      })}
    </nav>
  )
}

function Header() {
  const { nombreArticles } = useCart()
  const navigate = useNavigate()
  const [menuOuvert, setMenuOuvert] = useState(false)

  function recherche(e) {
    e.preventDefault()
    const q = new FormData(e.currentTarget).get('q').trim()
    navigate(q ? `/produits?q=${encodeURIComponent(q)}` : '/produits')
    e.currentTarget.reset()
    setMenuOuvert(false)
  }

  const champ = (
    <form onSubmit={recherche} className="relative">
      <input
        name="q"
        placeholder="Rechercher un ballon…"
        aria-label="Rechercher un ballon"
        className="w-full rounded-full border border-slate-200 bg-white py-2 pl-4 pr-9 text-xs outline-none focus:border-brand-dark lg:w-52"
      />
      <button type="submit" aria-label="Rechercher" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-dark">
        <Search size={14} />
      </button>
    </form>
  )

  return (
    <header className="sticky top-0 z-30 bg-white shadow-[0_1px_8px_rgba(20,30,40,0.06)]">
      <div className="mx-auto flex max-w-[1304px] items-center gap-6 px-4 py-2.5 sm:px-6">
        <Link to="/" aria-label="Ballons Tunisie — accueil" className="shrink-0">
          <img src="/logo.png" alt="Ballons Tunisie" className="h-14 w-auto" />
        </Link>

        <Navigation className="ml-2 hidden items-center gap-7 lg:flex" />

        <div className="ml-auto hidden items-center gap-4 lg:flex">
          {champ}
          <a href={`tel:${CONTACT.telephone.replace(/\s/g, '')}`} className="rounded-full border border-slate-200 px-5 py-2 text-xs font-semibold tracking-wider text-ink hover:border-brand-dark">
            {CONTACT.telephone}
          </a>
        </div>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <Link
            to="/panier"
            aria-label={`Panier (${nombreArticles} article${nombreArticles > 1 ? 's' : ''})`}
            className="label flex items-center gap-2 rounded-full bg-brand-dark px-5 py-2 text-xs text-white shadow-[0_6px_14px_-6px_rgba(181,0,11,0.7)] hover:bg-brand"
          >
            Panier
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-[11px] font-bold text-brand-dark">{nombreArticles}</span>
          </Link>
          <button className="p-2 text-ink lg:hidden" aria-label={menuOuvert ? 'Fermer le menu' : 'Ouvrir le menu'} onClick={() => setMenuOuvert((o) => !o)}>
            {menuOuvert ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {menuOuvert && (
        <div className="space-y-4 border-t border-slate-100 px-4 py-4 lg:hidden">
          {champ}
          <Navigation onNavigate={() => setMenuOuvert(false)} className="flex flex-col items-start gap-3" />
        </div>
      )}
    </header>
  )
}

const IcoInstagram = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
  </svg>
)
const IcoFacebook = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
)

const lienFooter = 'block text-sm text-slate-200 hover:text-white'
const rond = 'flex size-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20'

function Footer() {
  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto max-w-[1304px] px-4 sm:px-11">
        <div className="grid gap-10 py-10 md:grid-cols-3">
          <div>
            <img src="/logo-white.png" alt="Ballons Tunisie" className="h-24 w-auto" />
            <div className="mt-5 flex gap-2.5">
              <a href={CONTACT.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className={rond}><IcoInstagram width={16} height={16} /></a>
              <a href={CONTACT.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className={rond}><IcoFacebook width={16} height={16} /></a>
            </div>
          </div>

          <div>
            <p className="label text-xs text-salmon">Navigation</p>
            <div className="mt-4 space-y-2.5">
              <Link to="/produits" className={lienFooter}>Nos ballons</Link>
              <Link to="/offres" className={lienFooter}>Offres & packs</Link>
              <Link to="/suivi" className={lienFooter}>Suivre ma commande</Link>
            </div>
          </div>

          <div>
            <p className="label text-xs text-salmon">Contact</p>
            <div className="mt-4 space-y-2.5">
              <a href={`tel:${CONTACT.telephone.replace(/\s/g, '')}`} className={`${lienFooter} flex items-center gap-2`}><Phone size={14} />{CONTACT.telephone}</a>
              <a href={`mailto:${CONTACT.email}`} className={`${lienFooter} flex items-center gap-2`}><Mail size={14} />{CONTACT.email}</a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/15 py-5 text-xs text-slate-300">
          © {new Date().getFullYear()} Ballons Tunisie. Tous droits réservés.
        </div>
      </div>
    </footer>
  )
}

export default function Layout() {
  const { pathname, hash } = useLocation()

  // new page: back to the top, or to the anchor (#pourquoi)
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) {
        el.scrollIntoView()
        return
      }
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])

  return (
    <div className="flex min-h-screen flex-col bg-page">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
