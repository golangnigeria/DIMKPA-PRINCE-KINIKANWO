# Architecture

How the pieces fit. Read this before changing anything structural, because several of
the decisions here look arbitrary until you know what they are avoiding.

## Project structure

Organised by *kind*, so anything you want to change has one obvious home.

```
app/
  layout.tsx              Root layout, fonts, full SEO metadata, JSON-LD
  sitemap.ts robots.ts    Generated from your own content
  manifest.ts icon.tsx    PWA manifest and generated favicons
  admin/                  Protected inbox: page, actions, login
  api/contact/route.ts    Validate → forward to Go backend

backend/                  Standalone Go server
  config/                 Config loader (port, db URL, secrets)
  database/               PostgreSQL / SQLite connection & migrations
  handlers/               Contact submissions, auth, admin API
  middleware/             JWT auth verification & CORS
  services/               Email notifications (SMTP)
  main.go                 HTTP router & server entrypoint

components/
  sections/               Thin page sections, composition only
  globe/ projects/ contact/ services/ about/ navbar/ admin/
  seo/                    JSON-LD structured data
  ui/                     Cross-section primitives
  portfolio/              Shared pieces: astronaut, particles, timeline, …

constants/                All copy, data and tuning, no strings in components
types/                    Every shared interface, one file per domain
hooks/                    Reusable behaviour (scroll, pointer, in-view, forms)
helpers/                  Pure functions (math, formatting, geometry, scroll)
animations/               Motion variants and springs
lib/                      api/ · admin/ · globe/ (GLSL sources)

proxy.ts                  Next 16 middleware, gates /admin
public/
  models/ assets/ og.jpg
```

## The render path

```
app/page.tsx  →  <HomePage />  (client)
                   ├─ <PageLoader />        full-screen cover during warm-up
                   ├─ <ThemedGlobe />       WebGL, fixed, z-0
                   └─ <div class="relative z-10">
                        Navbar · Hero · About · Services · Projects
                        Experiences · Testimonial · Contact · Footer
```

`Hero` and `ThemedGlobe` are pulled in with `dynamic(..., { ssr: false })`.
Both mount a `<Canvas>`, and WebGL has no server equivalent, so importing them
statically would break the build's server pass and ship their Three.js chunk in
the initial bundle either way.

**The `z-10` wrapper is load-bearing.** The globe renders at `z-0` behind
everything. Sections are `relative` with no `z-index` of their own, so without
that wrapper they interleave with the globe in paint order and it punches
through the middle of the page. Lifting the content into its own stacking
context is what pins the globe behind it.

## Performance budget

Nothing that costs a device real work is allowed to mount on a device that
cannot afford it.

`hooks/use-deferred-3d.ts` is the single gate. Nothing it exports returns `true`
until the `load` event has fired and the browser has gone idle, and then only on
a viewport of 853px or wider, on a device reporting at least 4 cores and 4 GB of
memory, with `prefers-reduced-motion` unset. It exposes two gates:

- `useDeferredLayers()` covers the decorative parallax images in
  `components/portfolio/parallax-background.tsx`.
- `useDeferred3D(stage)` additionally requires a hardware WebGL renderer and orders scenes.

## Contact form → inbox

```
<Contact />
   └─ POST /api/contact          app/api/contact/route.ts   (runtime: nodejs)
        ├─ validate name / email / message, regex-check the address
        └─ forward to Go backend (POST :8080/api/contact)
             ├─ persist to database (SQLite in dev, PostgreSQL in prod)
             └─ optional SMTP email notification
```

## Auth

Admin access is secured with bcrypt password verification in the Go backend, which issues
signed JWT session tokens stored in HTTP-only cookies (`admin_session`).

1. **`proxy.ts`:** bounces unauthenticated requests to `/admin/login`.
2. **`getAdminState()`:** verifies admin token with backend on server renders.
3. **Go backend middleware:** enforces valid JWT token for all `/api/admin/*` routes.
