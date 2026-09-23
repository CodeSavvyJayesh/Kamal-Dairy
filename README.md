# Kamal Dairy - Frontend

React single-page app for **Kamal Dairy**, a dairy e-commerce platform: storefront, cart and
checkout, Razorpay payments, a prepaid wallet, recurring milk subscriptions, order tracking,
GST invoice downloads, verified-buyer reviews, and a full admin console with a sales dashboard.

| | |
|---|---|
| **Stack** | React 19, React Router 6, Vite (rolldown-vite 7.2.5) |
| **Styling** | Hand-written CSS with a token-based design system - no UI framework |
| **Icons** | `react-icons` (Feather set) |
| **Charts** | Hand-built SVG - no chart library |
| **Other** | `swiper` for the hero, `jwt-decode` for role checks |
| **API** | [`kamal-dairy-backend`](../kamal-dairy-backend) - Spring Boot, see its README |
| **Deploy** | Vercel (`vercel.json` in the repo) |

---

## Contents

1. [Getting started](#1-getting-started)
2. [Project structure](#2-project-structure)
3. [Routes](#3-routes)
4. [The design system](#4-the-design-system)
5. [Data layer](#5-data-layer)
6. [Feature walkthrough](#6-feature-walkthrough)
7. [Charts](#7-charts)
8. [Conventions](#8-conventions)
9. [Build and deploy](#9-build-and-deploy)

---

## 1. Getting started

```bash
npm install
npm run dev        # http://localhost:5173
```

Create `.env.local` (git-ignored):

```
VITE_API_URL=http://localhost:8080
```

| Script | Does |
|---|---|
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | production bundle into `dist/` |
| `npm run preview` | serve the built bundle locally |
| `npm run lint` | ESLint 9 flat config, React Hooks v7 + React Refresh rules |

The backend must be running and its `CORS_ALLOWED_ORIGINS` must include the dev origin.

## 2. Project structure

```
src/
├── api/              one module per backend area, all through a shared client
│   ├── client.js     fetch wrapper, JWT header, ApiError
│   ├── auth.js  orders.js  wallet.js  subscriptions.js  reviews.js  analytics.js
├── components/
│   ├── Navbar  Footer  Modal  PageLoader  ProtectedRoute  ScrollToTop
│   ├── HeroSlider  TrendingProducts  WhyChooseUs  TrustedBrands  SubscriptionSection
│   ├── ProductCard  ProductCardSkeleton
│   ├── Stars  ReviewForm  ReviewItem          reviews UI
│   ├── PasswordHints                          live password policy feedback
│   ├── admin/        AdminOrders  AdminSubscriptions  AdminReviews  AdminInsights  StockModal
│   └── charts/       RevenueColumns  BarList  Sparkline  + format / useWidth helpers
├── context/          CartContext  WalletContext  ToastContext
├── pages/            one folder-free page per route, each with its own CSS
├── styles/theme.css  design tokens and the kd-* primitives
└── utils/            format  images  orders  subscription  razorpay  useCountdown
```

Every page is loaded with `React.lazy` behind a `PageLoader`, so the first paint only ships the
shell, the home page and the design system.

## 3. Routes

**Public**

| Path | Page |
|---|---|
| `/` | Home - hero, trending products, subscription pitch, trust strip |
| `/products` | full catalogue |
| `/products/:category` | one category |
| `/product/:id` | product detail + reviews |
| `/subscription` | how subscriptions work |
| `/contact` | contact form |
| `/login` | login and signup |
| `/verify-otp` | OTP entry |
| `/forgot-password` | request a code, then set a new password |
| `*` | NotFound |

**Signed in** (wrapped in `ProtectedRoute`)

| Path | Page |
|---|---|
| `/cart` | cart, stock-aware |
| `/checkout` | delivery address |
| `/payment` | Razorpay or wallet |
| `/orders` | order history with a status tracker and review prompts |
| `/subscriptions` | my subscriptions |
| `/subscriptions/new` | subscription builder |
| `/subscriptions/:id` | one subscription, calendar and controls |
| `/wallet` | balance, ledger, top-up |

**Admin** (`ProtectedRoute` + role check)

| Path | Page |
|---|---|
| `/admin` | dashboard with tabs: Products, Orders, Subscriptions, Reviews, Insights |

## 4. The design system

`src/styles/theme.css` holds the whole visual language:

- **Tokens** - colour (`--green-800`, `--gold-500`, `--cream`, `--ink-900`, `--line`, `--red-600`),
  a modular type scale (`--step--1` … `--step-4`), spacing (`--sp-1` … `--sp-8`), radii, shadows and
  transition durations.
- **Type** - *Fraunces* for display, *Plus Jakarta Sans* for UI text.
- **Primitives** - `kd-btn` (`--primary`, `--ghost`, `--danger`, `--sm`), `kd-card`, `kd-panel`,
  `kd-field` / `kd-label` / `kd-input` / `kd-textarea`, `kd-status` chips, `kd-modal`, `kd-skel`
  skeletons.

Pages compose these primitives and add only what is genuinely page-specific, in a sibling CSS file
with a short BEM-ish prefix (`.pdp__`, `.prev__`, `.areview__`, `.order__`). There is no CSS-in-JS
and no utility framework.

Everything is responsive down to **390 px**, verified in the browser; the admin tab bar scrolls
horizontally rather than wrapping or overflowing on small screens.

## 5. Data layer

**`api/client.js`** is the single fetch wrapper. It attaches the JWT, parses JSON, and throws a typed
`ApiError` carrying `status`, `message`, `data` and `retryAfter`. A 401 only clears the session when
the request was actually authenticated, so a failed login never logs you out of an existing session.
The other `api/*.js` modules are thin, typed-by-convention functions over it.

`download()` in the same file handles endpoints that return bytes - invoice PDFs and the register
CSV. A plain `<a href>` cannot be used for these because they need the bearer token and a link
carries no headers, so the file is fetched like any other request, turned into a blob and saved
through a temporary object URL, with the filename taken from `Content-Disposition`. Errors still
arrive as JSON, so a failure is rethrown as a normal `ApiError` and the user sees a readable message
rather than a corrupt download.

**Contexts**

| Context | Holds |
|---|---|
| `CartContext` | cart lines, totals, add / update / remove, stock awareness |
| `WalletContext` | balance and ledger, refreshed after any transaction |
| `ToastContext` | `toast.success(...)` / `toast.error(...)` notifications |

Auth state is the JWT in `localStorage` plus the decoded role; `ProtectedRoute` redirects to
`/login` and admin routes additionally check the role.

## 6. Feature walkthrough

**Catalogue.** `ProductCard` shows the image, price, star rating and review count, and switches into
a *Low stock* or *Sold out* state driven by the server's stock value - sold-out cards grey the image
and disable the button rather than letting an order fail later.

**Product detail (`/product/:id`).** Gallery, price, live stock line, add-to-cart, a subscribe
cross-sell, and the full review section: a big average with the 1-5 star distribution as clickable
filter bars, a sort control (newest / highest / lowest), paged review items, and - for a verified
buyer - an inline form to write or edit their review. Guests see a prompt to sign in instead.

**Cart and checkout.** The cart blocks quantities above current stock. `/checkout` collects the
delivery address, pre-filled from the customer's last order, and validates it client-side to match
the server rules (10-digit phone starting 6-9, 6-digit pincode). `/payment` offers Razorpay or the
wallet, shows the wallet balance and shortfall, and redirects back to `/checkout` if there is no
address in hand.

**Orders (`/orders`).** Each order shows the delivery address, the items, and a four-step tracker -
Placed → Confirmed → Out for delivery → Delivered - with a note explaining the current step. While
an order is still open, a Cancel button opens a modal that states plainly that the full amount goes
back to the wallet. Once delivered, each line gets a *How was it?* chip that opens the review form in
a modal, and flips to a done state after posting.

Every order also carries a download button: **Proforma** while it is on its way, **Invoice** once it
is delivered, with the invoice number in the tooltip. The PDF is fetched with the bearer token and
saved through a blob, since a plain link cannot carry an auth header - see `download()` in
`api/client.js`. A cancelled order shows no button at all.

**Wallet (`/wallet`).** Balance, a Razorpay top-up flow, the full credit and debit ledger with
sources (top-up, order, subscription, refund), and a forecast of how long the balance funds the
active subscriptions.

**Subscriptions.** A builder that walks through product, quantity, frequency (daily / alternate days
/ weekly / custom weekdays), delivery slot and start date, with a live preview of the next dates and
the cost. The detail page shows an upcoming calendar and the controls: pause, resume, skip a date,
set a vacation window, edit, cancel.

**Auth.** Login, signup, OTP entry with a resend countdown driven by the server's `retryAfter`, and a
two-step forgot-password flow. `PasswordHints` shows the policy live as the user types. Rate-limit
responses are surfaced as a readable countdown rather than a raw error.

**Admin (`/admin`).**

- *Catalogue* - create, edit, delete, plus a stock field, low-stock badges, a `StockModal` for
  setting or adding stock, and the HSN code and GST rate that drive the invoice.
- *Orders* - status filters with counts, advance a status in one click, cancel with a reason, the
  customer's delivery address on every row, the invoice number once one is issued, a per-row invoice
  download, and a **Register** button that exports the invoice register for a date range as CSV.
- *Subscriptions* - today's dispatch sheet, mark delivered, refund a delivery.
- *Reviews* - a moderation desk: All / 1-2 stars / Not replied / Hidden filters with live counts,
  public replies, and hide / show with an admin-only reason. Low ratings are marked with a gold rail
  so they are impossible to miss.
- *Insights* - the sales dashboard, see below.

## 7. Charts

Everything in `components/charts/` is hand-written SVG - no chart dependency, so the bundle stays
small and the charts inherit the design tokens directly.

- **`RevenueColumns`** - stacked columns of cart vs subscription revenue per day, with 2 px surface
  gaps between segments, 4 px rounded data ends, a hairline grid, a hover tooltip, and a toggle to
  read the same data as a table.
- **`BarList`** - ranked rows for best sellers and plan performance.
- **`Sparkline`** - the trend line inside each stat tile.
- Two-slot categorical palette, contrast-checked: `#1f8464` for cart, `#b9792a` for subscriptions.

`AdminInsights` renders the whole dashboard from a single `/api/admin/analytics/sales` call: headline
tiles with period-over-period change, the daily revenue chart, best sellers, plans, new vs returning
buyers, the payment mix and a subscription snapshot, with a range selector for 7 / 30 / 90 / 365 days.

## 8. Conventions

- **Lazy routes.** Every page is `React.lazy` + `Suspense`, with `PageLoader` as the fallback.
- **Skeletons, not spinners.** Lists render `kd-skel` blocks in the shape of the real content.
- **Errors reach the user.** Every `ApiError` becomes a toast or inline message; nothing fails silently.
- **Accessibility.** Real `<button>`s, `role="tab"` / `aria-selected` on filter chips, `aria-label`
  on star ratings, visible focus rings, and modals that trap focus and close on Escape.
- **Lint clean.** ESLint 9 flat config with `react-hooks` v7 (including `set-state-in-effect`) and
  `react-refresh/only-export-components`; contexts keep their hooks in separate files so fast refresh
  keeps working.
- **No inline styles** except for genuinely dynamic values such as a bar width.

## 9. Build and deploy

```bash
npm run build      # → dist/, about 800 KB, code-split per route
```

Deployed on **Vercel**. `vercel.json` is committed, so the framework, build command and output
directory are detected without any dashboard configuration, and it carries two things that matter:

- a **rewrite of every path to `/index.html`**, without which a hard refresh on `/orders` returns
  404 - Vercel checks the filesystem first, so real assets still serve normally;
- **security headers** (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`,
  `Permissions-Policy`) and a one-year immutable cache on the fingerprinted `/assets` bundle.

One environment variable, `VITE_API_URL`, pointing at the Railway backend with no trailing slash.
Vite inlines `VITE_` variables into the bundle at **build** time, so changing it needs a redeploy,
and a secret must never be put in one. The backend's `CORS_ALLOWED_ORIGINS` has to list this origin;
add `https://*.vercel.app` too or every preview deployment is blocked.

Full walkthrough: [DEPLOYMENT.md](../kamal-dairy-backend/DEPLOYMENT.md).
