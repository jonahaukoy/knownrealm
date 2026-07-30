# Prerender — the static crawlable mirror

The wikis are single-page apps: `wiki.html#char=Eddard-Stark`, `#chapter=1-46`, etc.
Search engines only see ONE URL per wiki that way — the ~1,400 articles behind the
`#` are invisible. This folder turns every one of them into a real, crawlable static
HTML file so they can be indexed, without giving up the interactive SPA.

It is a **re-runnable generator, not a one-time export.** The list of pages is derived
live from the data files every run, so you never maintain it by hand.

## How to run it

From the repo root, in PowerShell:

```powershell
& ".\prerender\build.ps1"
```

That regenerates everything under `p/` and rewrites `sitemap-prerender.xml`.
Needs only Microsoft Edge (headless) — no Node, no build tools.

When you go live, pass your real domain (it also gets baked into `<link rel=canonical>`):

```powershell
& ".\prerender\build.ps1" -Origin "https://yourdomain.com"
```

## The workflow when you add pages later

**Add content → re-run → redeploy.** That's it.

New *instances* of existing kinds — another character, episode, chapter, house,
location, collection item — are picked up **automatically**: the generator reads
whatever `js/*.js` now holds. You never touch anything in this folder for those.

You only edit the pipeline for two rarer things:

- **A brand-new *kind* of route** (say you invent a `#faction=` route): teach the
  enumerator about it once, in `KW_PRERENDER.routes()` at the bottom of
  `js/wiki-engine.js`.
- **A whole new wiki/site**: add its `KW_PRERENDER_CFG` + the driver `<script>` to
  that site's `wiki.html` (copy how `wiki.html`, `hotd/wiki.html`, `knight/wiki.html`
  do it), then add one row to `$Sites` in `build.ps1`.

## How it fits together

- **`js/wiki-engine.js` → `window.KW_PRERENDER`** — the shared hook. `routes()` lists
  every page from the live data; `render(href)` renders one to finished HTML. Adding
  this cost the engine nothing at runtime and is what makes the whole thing data-driven.
- **`js/prerender-driver.js`** — inert in production. Only when a wiki is opened with
  `?prerender=1` does it render every route, wrap each in a complete static document
  (unique `<title>`, `<meta description>`, `<link rel=canonical>`, `<base href>` so
  assets resolve, in-article links repointed at the live SPA), and emit them as NDJSON.
- **`prerender/build.ps1`** — thin I/O: opens each wiki headless with `?prerender=1`,
  reads the manifest, writes the files under `p/<site>/`, and builds the sitemap.

## Deploying

1. Run the generator (with `-Origin` set to your domain).
2. Deploy the whole repo **including the `p/` folder and `sitemap-prerender.xml`.**
3. `robots.txt` already lists both sitemaps — just swap the placeholder domain there
   and in `sitemap.xml` for your real one (same domain you passed to `-Origin`).

Each static page canonicalises to itself and links back into the SPA, so a reader who
arrives from Google gets the content immediately and can click straight into the
interactive wiki. There's no duplicate-content problem: the `#…` SPA URLs aren't
separately indexable, and every static page names itself as canonical.

## Future-proofing (things you said are coming)

- **Ads (later):** the prerendered pages don't carry ad slots yet. When you're ready,
  add the ad markup (and the consent-gated ad script) to the document template inside
  `js/prerender-driver.js`, then re-run — every static page gets it. The SPA already
  has its reserved `ad-slot` markup; keep the two in sync.
- **Login / save progress (later):** that's client-side (a script + `localStorage` or a
  backend call). Add the auth/save `<script>` to the driver template (or as a site-wide
  include the template already pulls in) and re-run; the static pages will hydrate with
  it just like the SPA. Nothing about prerendering blocks it.

## Notes

- `p/` is generated output. It's safe to delete and regenerate; the script cleans each
  site's folder before writing so pages you removed from the data don't linger.
- The generator is idempotent — running it twice produces the same files.
