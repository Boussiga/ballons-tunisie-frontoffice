# ballons-tunisie-frontoffice

Public storefront (front-office) for the ballons-tunisie-frontoffice : catalogue, packs, offers,
guest checkout and order tracking. No customer account is needed.

## Run

```bash
npm install
npm run dev        # http://localhost:5174 — /api and /uploads are proxied to http://localhost:3000
```

Start the API (`ballons-tunisie-api`) first. In production, build with
`VITE_API_URL=https://your-api npm run build` (see `.env.example`) and add the store's
URL to the API's `FRONTEND_URL` (CORS).

## Docker

The image is built in 2 stages: Node builds the site, then only the built files are
copied into an nginx image. nginx (`nginx.conf`) serves the pages and forwards `/api`
and `/uploads` to the API, like the Vite dev proxy.

The whole stack (database + API + store) is started from the API repository:
`docker compose up --build` (see its README). The store is then on http://localhost:8080.

## Pages

| Route | What it does |
|---|---|
| `/` | Home: active offers, newest products, packs |
| `/produits` | Catalogue: search, category, size, pagination (filters live in the URL) |
| `/produits/:id` | Product page |
| `/packs` | Packs with their contents |
| `/offres` | Active offers |
| `/panier` | Cart + guest checkout (name, phone, address) |
| `/suivi`, `/suivi/:id` | Track an order by its number |

## Rules worth knowing

- **Offers:** they are not linked to products in the database, so the best active offer
  (highest %) is applied to every line and sent as `offreId`. See `src/utils/prix.js`.
- **Cart:** kept in `localStorage`; max 50 per line (API limit).
- **Categories / sizes filters:** built from the available products (the API has no public
  categories route).
- **Currency:** one constant, `DEVISE` in `src/utils/format.js`.

## Design

The look follows `Pendo-3-7.pdf` (storefront pages only): Oswald + Inter fonts (bundled via
`@fontsource`), colours and shared classes (`btn`, `pill`, `card`, `label`) in `src/index.css`.
Static design images are in `public/design/`. Phone, e-mail and the free-delivery threshold are in
`src/config.js` (placeholders to replace). Currency is `DT` (`src/utils/format.js`).
`/offres` is the single "Offres & Packs" page; `/packs` redirects to it.
