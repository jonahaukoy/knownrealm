# Release Checklist — The Known World

_The maester's audit. Companion to LEGAL-NOTES.md._
_Last revised July 2026, after the games / art / pool-quality passes._

**Split into two halves on purpose: what is still owed, and what is already done.** Everything in
Part One is work; everything in Part Two is finished and is kept only so the progress is visible.

**What the site is now:** ~494,000 words of original prose across 1,441 searchable pages, three
interactive maps, 11 family trees, **7 games including a daily**, 71 Kingsguard folios, a 52-moment
chronicle, and 205+ pieces of the owner's own artwork.

---
---

# PART ONE — STILL TO DO

## 1. RELEASE BLOCKERS — legal & platform (before ads go live)

1. ~~**Replace the basemap.**~~ ✅ **DONE** — `assets/ASOIAF_map.jpg` and `.png` are now the
   original **5652 × 3682** Mineral Tidal Survey redraw. All 163 unified coordinate anchors remain aligned;
   provenance, deterministic rebuild instructions, source prompts, and validation results live under
   `assets/_sources/map-redraw/` and `tools/`.
2. **Privacy policy + GDPR consent banner + Terms of Service.** ⚠️ **STARTED — needs your details +
   legal review.** `privacy.html` and `terms.html` now exist (themed, original prose, GDPR-aware), and a
   network-agnostic **consent banner** ships on every page via `realm-nav.js` (records the choice in
   `localStorage["kwConsent"]`, exposes `window.KW_CONSENT` + a `kw-consent` event for future ad/analytics
   loaders to gate on). **Before ads:** fill the `[BRACKETED]` placeholders (operator/legal name, contact
   email, jurisdiction, hosting, and the exact analytics + ad vendors), swap the generic banner for the
   ad network's certified **CMP/TCF** dialog if it requires one, and have it all reviewed by a lawyer.
3. **Fill the contact card** on the home page — it still shows em-dashes and "Fill these in when
   the rookery opens". Norwegian ehandelsloven requires identity and contact details on a
   commercial site. Add a DMCA/takedown address too; credits.html already promises one.
4. ~~**Self-host the fonts + top-bar glitch.**~~ ✅ **DONE** — fonts self-hosted (`css/fonts/*.woff2`
   via `css/fonts.css`, Google `<link>` gone from all 20 pages, preload on the two top-bar faces).
   The *real* cause of the glitch turned out to be `realm-nav.js` **building the top realm bar in JS
   and inserting it after first paint**, so every page jumped down ~50px as the bar appeared. Fixed by
   reserving the bar's height in CSS (`body:not(.home-body){padding-top:50px}`) and releasing it the
   instant the bar fills it (`body.realm-ready`) — net zero shift. See Part Two.
5. **Decide analytics** (Plausible/Umami = lighter consent burden, vs GA4 = full consent). This
   decision shapes the banner in #2.
6. **Clean the deploy bundle.** Exclude from upload:
   - `assets/_sources/` — **~500 MB** of source art masters (the former `new_assets/`, moved under
     `assets/` on request so there is one folder to browse). Referenced by NO page — the live site
     serves the compressed WebP that sit beside it in `assets/scenes`, `assets/sigils`, etc. Shipping
     `_sources` would ~10× the site for nothing. **This one exclusion is the whole difference between a
     50 MB site and a 550 MB one.**
   - `new_assets_BACKUP_20260726/` — lives in the parent `lib/` folder (outside the project), a full
     copy made before the move; delete once the consolidation is confirmed good.
   - `_codex_backup_*`, `.claude/`, and the scratch `*.py` helpers.
   - `assets/ASOIAF_map.png` — **~33 MB** and unreferenced; the pages use the optimized jpg.
   With those excluded the served site is roughly **35 MB**.

## 2. SEO & DISCOVERABILITY — the ad-revenue engine

7. **No meta descriptions, no favicon, no Open Graph/Twitter tags on ANY page.** Each page needs a
   unique `<meta name="description">`, a site-wide `<link rel="icon">`, and `og:title` /
   `og:description` / `og:image`. More valuable than it was: there are far more pages worth
   sharing now (the White Book, the collections, the timeline, five game pages).
8. **Hash routing is throwing away the site's biggest asset.** `wiki.html#char=Jon Snow`,
   `#dragon=drogon`, `whitebook.html#kg=arthur-dayne` — search engines see **one** page each for
   the wiki, the White Book and the timeline, not the ~1,400 articles behind them. With half a
   million words of original prose written, this is the difference between a site that ranks and
   one that does not. Options, best first:
   (a) pre-render each article to a static HTML file at build time;
   (b) History-API paths plus host rewrites;
   (c) accept the loss and rank only on the landing pages.
   **Decide before launch** — changing URLs after indexing is expensive.
9. **robots.txt + sitemap.xml** — neither exists. Trivial, and the sitemap only becomes valuable
   once #8 produces real URLs.
10. ~~**No 404 page.**~~ ✅ **DONE** — `404.html`, themed ("This page is lost beyond the map"), with quick
    links home / wiki / map / games and `noindex`. Point the host's 404 handler at it once hosting is set.
11. ~~Wordle has no page of its own~~ — **done.** Built as `wordle/` (see Part Two). The old in-map
    wordle panels (`map.html#wordle=1` etc., in the three `app.js` copies) are now orphaned — the hub
    and home point at the standalone. They still work by deep link but use the older curated pools;
    remove them, or leave them as a deep-link fallback, before launch.
12. **Pick the public site name once** — the topbar says THE KNOWN WORLD, tab titles vary. Settle it
    before the domain, OG tags and credits are written.

## 3. MOBILE — still the weakest area

13. **Map pages are unusable on phones.** `.sidebar` is a fixed 400 px with no breakpoint; on a
    390 px screen it fills everything. The canvas already supports touch pan/pinch — what is needed
    is a responsive shell: slide-over drawer, stacked topbar, larger touch targets. All three maps.
14. **Test every page at 360–414 px**: trees (wide canvas), wiki articles, the White Book, the
    timeline's picture cards, the gallery's justified rows, and the four game halls — each of the
    latter has a documented `(max-width: 820px), (max-height: 640px)` fallback that turns the
    painting into a backdrop, but they have not been checked on a real phone.

## 4. PERFORMANCE

15. **Map first paint** still loads a 2.4 MB basemap plus many scripts. Add
    `<link rel="preload">` for the basemap and a "raising the banners…" hint on the map stage.
16. **`js/search-index.js` (96 KB) loads eagerly on the home page** to drive the live stats.
    Acceptable, but if home-page speed becomes a concern, precompute the six numbers into a tiny
    JSON instead.
17. **WebP has no fallback.** Every browser released since ~2020 supports it, so this is low risk,
    but if you care about very old clients, add a `<picture>` element or keep PNG twins.

## 5. UX POLISH

18. ~~**Wiki search is still per-world.**~~ ✅ **DONE** — each wiki's own box now shows its saga's pages
    instantly, then an **"Elsewhere in the realm"** section from the global index (lazy-loaded on first
    keystroke), with links prefixed back to root so they work from `hotd/` and `knight/` too. Rhaenyra
    is now findable from the GoT wiki box.
19. **Alt-text audit** on generated images — portraits, wiki infoboxes, sigils. Several meaningful
    images still carry `alt=""`; use the character or house name.
20. ~~**Reserve ad slots in the layouts now.**~~ ✅ **DONE** — inert `.ad-slot` containers are pre-placed
    (home between sections, after wiki content, on the Small Council + Wordle pages near the results).
    They render **nothing** until you add `ads-enabled` to `<body>` and inject each network's tag into
    the `.ad-slot-fill` (reserved sizes already set), so no gap now and no restructuring later.
21. ~~**`assets/whitebook/contents.webp` (189 KB) is unused.**~~ ✅ **DONE** — it is a single portrait
    page that never fit the White Book's two-page-spread background system (which uses the landscape
    `spread-*.webp`), so it was redundant with the worn parchment already behind the contents. Moved to
    `assets/_sources/whitebook-unused/` (preserved, out of the deploy) rather than deleted.
22. ~~**The Small Council opens unshielded for a first-time visitor.**~~ ✅ **DONE** — the shield now
    defaults to **closed** (all zeros) when none is saved, so a spoilery daily gates the newcomer with a
    warning instead of dropping a finale reveal. A shield set here or in another game still wins. (Former
    note kept below for context.) Unlike Trivia it used to default the
    first visit, before the first board.

## 6. CONTENT — what is written and what is not

23. **Who Said It needs faces.** The wall hangs a portrait of every speaker you name, so the game is
    now only as good as the portrait table behind it. **89 distinct speakers, 137 names in total.**
    The full prioritised list, with coverage maths and a cheaper option, is in
    **`WHOSAIDIT-FACES.md`** — the top 25 faces cover 58% of all rounds, so this does not have to
    be done all at once.
24. **The Small Council pool is now 21 deep** (was 10, then 13, now **21** — see Part Two). Still short
    of a repeat-proof pool; keep adding. The most pressing content gap in the games now that a *daily*
    exists and sets an expectation. Sixty would give two
    months. Two design rules govern any new batch, both in the header of
    `smallcouncil/councils-data.js`: **(a)** write for people who watched the show — every tile must
    be something a viewer has seen, so the difficulty lives in the sorting and never in the recall;
    **(b)** never let a word honestly fit two groups, which is what separates a hard puzzle from an
    unfair one.
25. **The quote pool is GoT-only.** Who Said It — and the home page's words of the day — has no HotD
    or Dunk & Egg quotes.
26. **The standalone Wordle pools can always grow** — `wordle/words.js` now holds **110 four-letter,
    145 five-letter and 111 six-letter** words (was 70/90/70; ~134 added). All are normal words with a
    tie to the world; add freely, keeping that bar and the exact length. (The old per-saga in-map pools
    in the three `app.js` copies are now superseded by the standalone — see #11.)
27. **~400 Westerosi houses remain unwritten** — *incremental, in progress.* Batch 1 (22 Crownlands)
    and now **Batch 2 (37 houses: Dorne, the Iron Islands, more Crownlands, the North)** have shipped
    in `js/houses-extra.js` / `js/houses-extra-2.js` — **59 written**, 36 of the 37 new ones with sigil
    art. Still owed: the Reach, the Stormlands, the Vale, the Westerlands, and the many name-only houses
    with no real canon (thin stubs there would hurt SEO more than help — write the ones with a story).
28. ~~**Timeline moment-pages.**~~ Partly addressed: the seven **eras** now each have a long-form wiki
    page (`js/eras.js`, `wiki.html#era=<id>`, linked from `timeline.html` and browsable under the new
    "Ages of the Realm" category). Per-*moment* pages (~52 of them) are still an open, smaller idea.
29. **No Knight of the Seven Kingdoms council** in the Small Council. The ten are nine GoT and one
    HotD. Once that show has aired enough for a viewer to have seen the material, it deserves one.

## 7. IDEAS — post-release candidates

30. **Where in the Realm?** — a Geoguessr for Westeros: show a scene, click the map, score by
    distance. Nothing else in this fandom does it, and every asset needed already exists. The
    strongest single idea on this list. **A disabled placeholder card is live on the games hub**
    (`#tv-game-whereintherealm`) — now the **only** placeholder left on the hub; build it or remove
    it before launch.
31. **Trivia and the quizzes still have no hall of their own.** Two of the four art briefs in
    `ART-BRIEFS.md` are unbuilt: the maester's cell with the dawn coming up through the window
    (Trivia), and the blank shield in the godswood (Who Are You in the Realm).
33. **Lineage** — the daily "guess the character", each wrong guess revealing another column
    (region, house, allegiance, first appearance) in Wordle's green/yellow grammar.
34. **Alive or Dead?** — a portrait and a moment in the story. Turns the spoiler shield from a gate
    into the game's core mechanic.
35. **Shareable results with OG images** for the quizzes and the dailies (needs #7). The Small
    Council already copies an emoji grid to the clipboard; an OG image would make the link itself
    worth posting.
36. ~~**A daily streak across all the dailies.**~~ ✅ **DONE** — `js/streak.js` (`window.KWStreak`,
    `localStorage["kwStreak"]`) counts consecutive days; the Small Council result and the daily Wordle
    call `KWStreak.mark()`, and the games hub shows a **"🔥 N-day streak"** badge. Any future daily just
    calls `mark()`. A missed day resets the current run; best-ever is kept.
    **Also new this pass (idea #5 from the roadmap):** a **"Random page"** button injected into every wiki
    topbar, and a **"surprise me"** link on the home hero that jumps to any page in the whole realm.
37. **A full page-turn animation for the White Book** — a leaf that curls as it lifts, casting a
    shadow on the page beneath. Pure CSS 3D; the modest version is already in.
38. **"What's new" line on the home page**, fed by a small changelog, so returning readers see the
    realm growing.
39. **PWA manifest** for installability and offline reading — cheap once the bundle is clean.
40. **The butcher's bill** — death statistics across both tellings, drawn from data already held.

---
---

# PART TWO — DONE

Kept so the progress is visible. Nothing here needs action.

## The games

- ✅ **Every game has its own page.** Games used to unfold inline underneath the hub menu, which made
  them read as sections of a page rather than places you had gone. `trivia/index.html` is a pure
  gallery of links; the examination moved to `trivia/play.html`; Sigil Match, Who Said It, the
  quizzes and the Small Council link to their standalone pages, each with a `.game-backlink` home.
  Six games, six indexable URLs where there was one.
- ✅ **The Small Council** — the site's first daily. Sixteen names, four hidden groups, four
  braziers, played on the owner's painted desk (`smallcouncil/assets/table1–5.webp`, 15.6 MB →
  **1.7 MB**), one painting per brazier lost, cross-fading from candlelight to black ice with a dead
  hand closed over the sheet. Winning calls dragonfire and thaws it back. The daily is picked by
  date and the board seeded so every player gets the same tiles.
- ✅ **The Small Council pool rewritten for show-watchers.** The first ten councils were built from
  book-deep names and tested recall rather than thinking. Every tile is now something a viewer has
  seen. **Grown to 13** with three harder puzzles — *The Southern Houses* (sort by house past scattered
  kings/Kingsguard/wards), *Read the Banner* (the structural trap: four houses' sigils/words/seats/faces,
  sorted by TYPE not house), and *Four Courts* (Jaime as Robb's prisoner, Roose as the traitor). Each
  validated 4×4 with no tile fitting two groups.
- ✅ **All game brands link back to Games & Trivia, consistently.** Who Said It and Sigil Match used to
  send the top-left brand to the home page, and the quiz's brand was a dead legacy switcher button. All
  three now link to `../trivia/index.html` like Blur / Wordle / Small Council, so the top-left is always
  the way back to the games hub.
- ✅ **Who Said It is played in the Hall of Faces** (`whosaidit/assets/hall1–5.webp`, 11.7 MB →
  **0.9 MB**), brightening from one candle to a full blaze as you name voices; a perfect round earns
  the fifth painting. The progress dots are gone: **each speaker you name is hung on the wall**, and
  the faces stay up through the verdict.
- ✅ **Wordle is a standalone game** (`wordle/`) — the audit's long-standing "no page of its own" is
  closed. Six guesses (not five); choose the word's length (**4 / 5 / 6 letters**); play the **daily**
  (one word per length, seeded by date, the same for everyone) or switch to **unlimited**. A
  first-visit rules dialog mirrors the NYT one. The daily **saves progress after every guess and resumes** on reload (no wiping it for a fresh run), and a **Give up** button reveals the word. **No names** — the pools are curated normal words
  with a tie to the world (DRAGON yes, COMPUTER no), the obscure places and house names are gone
  (Qohor, Eyrie, Umber, Royce…), and guessing a character's name is turned away with *"there are no
  names in this game"* rather than the generic message. Words in `wordle/words.js`, validated for
  length on load; name detection reads the shared `PEOPLE_IMGS` table.
- ✅ **Who Said It laid out 2×2 / 2×6** — the four answers are a 2×2 grid with the name beside a
  larger portrait, and the wall of named speakers is a 2×6 grid of larger round portraits.
- ✅ **Blur** (`blur/`) — a face, banner, place or beast hidden behind a 5×5 grid of dark boxes over a
  crisp picture (no blur filter). "Reveal more" opens the boxes (two at first sight, then 6/11/17/25)
  for −1 point each; **a wrong guess ends the vision at 0**, which is what makes revealing and the
  once-per-vision 50/50 worth their point. A new vision covers instantly so it never flashes into
  view. Subject pool builds itself at runtime from the site's art. (Briefly renamed "Scrying"; the
  owner hadn't heard the word, so it's Blur again — folder/URL stay `blur/`.)
- ✅ **Sigil Match is played on a shield-wall** (`sigilmatch/assets/wall1–10.webp`, 25.9 MB →
  **2.0 MB**) — ten photographs of one wall of iron hooks, two planks of five, cross-fading from
  near-dark to warm candlelight one step per question. **Every banner named correctly is hung on the
  next hook** — top plank left to right, then the bottom — measured off the photograph so the
  shields sit on the real hooks; a wrong answer hangs nothing and the row waits. The question is
  asked in a panel below the wall, so nothing ever covers the collection you are building. (This
  replaced the earlier "banners unfurl from the rafters" hall; the old `hall1–3.webp` are now unused
  and can be deleted from `sigilmatch/assets/`.
- ✅ **The trivia pools culled for quality**, 599 → **442** questions across the three sagas:
  GoT 300 → **244** (139 easy / 105 hard), HotD 199 → **135**, Knight 99 → **63** (36 / 27).
  The largest single bucket was not dullness but **fact**: questions calling Stannis the youngest
  Baratheon brother, Lyanna Mormont an old lady, Polliver a Brave Companion, the Waif blind, and —
  in the Knight pool — a question about how Ser Eustace dies, when he does not die in the novellas.
  HotD was the worst of the three (27 of its 64 removals were factual): Maelor called Rhaenyra's son
  when he is Aegon II's, Otto Hightower imprisoned when Rhaenyra had him executed, Criston Cole
  killed at Bitterbridge instead of the Butcher's Ball, Sharako Lohar fighting *for* the blacks when
  he commanded the fleet against them.
  Also removed: questions whose stem contained their own answer, ones with two defensible answers,
  straight duplicates, and answer sets so lazy the right one was free ("Robb Snow / Theon Snow /
  Bran Snow"). Verified after the cull: every entry has four options, `img` and `why`; no `d: 2`;
  no duplicate stems; encoding intact; and all twelve saga/difficulty combinations still deal a
  full ten-question round, and all 442 `img` references resolve to a file on disk.
  Three questions were mended rather than cut: one whose picture was the answer's own sigil, one
  whose explanation claimed Aemma Arryn rode a dragon, and one calling Simon Strong a cousin when
  he was Lyonel's uncle.
- ✅ **The Who Said It quote pool culled**, 288 → **257** (155 easy / 102 hard; 132 show / 126 book):
  quotes that named their own speaker, formulaic lines with more than one truthful speaker,
  near-duplicates, and dull ones. The three rules that pass now heads the data file.
- ✅ **The Wordle word lists are curated, not harvested.** They used to be built by sweeping every
  five-letter token out of the site data, which is why fragments turned up as answers — "Acorn Hall"
  gave ACORN, "House of Black and White" gave HOUSE and FACES, "Jaqen H'ghar" gave HGHAR. Now an
  explicit `WORDLE_POOL` per saga.
- ✅ **One spoiler shield across the whole site** (`localStorage["tvShield"]`) — Trivia, Who Said It,
  Sigil Match, the timeline, the home page's daily soul, and the Small Council.

## The content

- ✅ **The collections** — dragons, Valyrian steel, direwolves, the Kingsguard, battles, prophecies.
  ~110,000 words, spoiler-folded, cross-linked from all three maps.
- ✅ **The battles collection nearly doubled**, 16 → **28**, adding the ones a reader would miss:
  the Last Storm, Hellholt (the Conquest's one failure), the Honeywine, the Butcher's Ball, both
  Tumbletons, the Storming of the Dragonpit, Ashford, the siege of Storm's End, the Tower of Joy,
  the Greyjoy Rebellion, the Green Fork and Oxcross — each written to the full depth of the
  originals (~24,000 words), with every death in the spoiler fold and disputed details (Rhaenys at
  Hellholt, the Tower of Joy's choreography) written around rather than invented.
- ✅ **The White Book** — 71 brothers across twelve reigns, 62 fixed-size spreads with a contents
  roll, two leaves open at a time, on the owner's paper (13.7 MB → **1.3 MB**), ageing from worn at
  the front to fresh at the back. The arrows sit at one fixed height on every page including the
  cover.
- ✅ **The timeline** — 52 moments, dual book/show dating, each linking to a page genuinely about it.
- ✅ **The timeline was decluttered.** It had four overlapping ways to move (era cards, a media-player
  scrubber, prev/next arrows, and a flat 52-item list with its own inner scrollbar). The era cards
  are now **chapters**: picking one lights it, opens its first moment in the reader, and filters the
  chronicle below to just that age — so the list is always a handful of items that **flow with the
  page instead of scrolling inside their own box** (the nested scrollbar the owner disliked is
  gone). The scrubber was removed; Before/After arrows step through and cross chapter boundaries by
  turning the page. Each element now has one job: pick a chapter / read / step / jump within.
  The **timeline bar (scrubber) was kept** — it is the identity of a timeline page — restored as a
  full-width gold-filled bar that sweeps all twelve thousand years, with the era selection and the
  filtered list following the thumb; the on-screen Before/After buttons were removed instead
  (the ← → keys still step).
- ✅ **The direwolves are illustrated** — a group portrait opens their page, and each wolf's own
  picture is both its page's banner and its thumbnail on the index (20.1 MB → **1.3 MB**).

## The craft

- ✅ **Sigil art compressed and made the owner's own** — 123 banners cut out, trimmed, converted to
  WebP (**82 MB → 12 MB**) and routed through `sigilSrc()` (`js/sigil-art.js`), which also retires
  third-party CC BY-SA heraldry wherever a replacement has been drawn.
- ✅ **New scene art wired in** — the owner's Book-1 chapter illustrations (9 of them, on the AGoT
  chapter wiki pages 1-1…1-9), new lore art (Azor Ahai, Maggy the Frog, the Three-Eyed Raven, the
  House of the Undying → their prophecy pages; the House of the Undying also banners Qarth), and the
  four scenes briefly thought lost (recovered from the owner's `new_assets/` masters and restored to
  their original homes). All in the gallery, all verified to render.
- ✅ **The top-bar glitch is gone (two causes, both fixed).** The whole top bar jumped and flashed a
  different font for an instant on every navigation. **Cause 1 (the big one):** `realm-nav.js` builds
  the top realm bar in JS and inserts it at `body.firstChild` *after* the page has already painted, so
  every page rendered without the 50px bar, then shoved everything down when it appeared — worst on
  heavy pages (gallery) that paint before the last script runs. Fixed by reserving the bar's height in
  CSS up front (`body:not(.home-body){padding-top:50px}`) and releasing it in the same reflow the bar
  fills it (`realm-nav.js` adds `.realm-ready`) — net zero shift. **Cause 2 (font swap):** the remote
  Google Fonts painted the fallback first, then swapped. All weights (+ Garamond italic), latin +
  latin-ext, now live in `css/fonts/*.woff2` behind `css/fonts.css`; the Google `<link>` is gone from
  all 20 pages and the top bar's Cinzel 400 + 600 and Garamond 400 are `preload`ed, so the bar's text
  is ready before first paint. (Also closes blocker #4 and the EU third-party-request concern.)
- ✅ **One asset folder: `new_assets/` folded into `assets/_sources/`.** Having both `new_assets` (502 MB
  of high-res masters) and `assets` (the 50 MB live WebP) was confusing. The masters now live under
  `assets/_sources/` in clean 1:1 subfolders (chapters-and-episodes, valyrian-swords, sigils-new,
  people-old, …) — one folder to browse, and the live site stays lean because `_sources` is
  deploy-excluded. A full backup was taken first to `lib/new_assets_BACKUP_20260726/` (outside the
  project). Verified every master survived the move (502 files in, 502 out) and hunted duplicates: two
  harmless pre-existing reuses, and one real same-name collision caught by md5 (a Doom-of-Valyria file)
  and repaired from its master.
- ✅ **The owner's newest art wired in.** 12 more Book-1 chapter illustrations (chapters 1-10…1-21,
  Tyrion I through Eddard IV) now hang on their wiki pages; all 13 drawn Valyrian blades fill the
  **Valyrian Steel** collection (index banner + a portrait on each blade's page — Ice, Longclaw,
  Blackfyre, Dark Sister, Heartsbane, Widow's Wail, Oathkeeper, Red Rain, Vigilance, Nightfall,
  Orphan-Maker, the catspaw dagger); and the gallery gained those plus a new **Valyrian Steel** section
  and a few loose scenes (Euron, a lit Castle Black, a wight).
- ✅ **The wiki Chapters page is five collapsible tomes.** Instead of a flat wall of 344 chapter
  rows, each book is a cover plate (book emblem now, art drop-in via `book:1…5` keys in `WIKI_IMAGES`)
  you press to unfurl that book's chapters — each chapter row carrying its own illustration thumbnail
  (`chapter:b-c`). The panels animate open via grid-rows and **several books can stand open at once**;
  one never closes another. Applies to all three wikis (shared `wiki-engine.js`).
- ✅ **The White Book folded into The Collections** on the home page (owner request) — it is now a
  link inside the Collections portal card (with its shield glyph), not a card of its own.
- ✅ **The Knight map's banners all show.** 57 sigil files were nested one folder too deep
  (`knight/assets/sigils/sigils/`) while the data looked for them one level up; moved, and every
  MINOR_ARMS / CANON_MINOR_SHIELDS / house-seat reference now resolves to a file.
- ✅ **The family trees reworked into one printed sheet with a house rail.** The parchment-band
  version felt uncanny: the crest + words sat in a fixed band and the blurb stayed a fixed size
  while only the tree zoomed under it. Now the crest, name, words, blurb AND the blood are all
  printed on ONE surface that zooms as a unit (`#tree-surface`, via `zoom`), so the writing scales
  *with* the tree — it reads as ink on one page. The houses moved back to a persistent **left rail**
  (`.tree-rail`, "The Book of Lineages"), the active house highlighted; the page opens at the top-left
  so the title is always the first thing seen, and a floating **− ▢ +** zoom bar sits over the sheet.
  Arrows/flip-book framing and the picker overlay are gone. Backdrop art is wired to drop in: a
  woven-wall photo on `.trees-body` (commented hook) hangs the parchment on a wall; the sheet itself
  can take a real parchment photo in place of the CSS vellum.
- ✅ **Scene art compressed** — 24 painted scenes capped at 1400 px and converted (**46 MB →
  4.9 MB**), all 93 references repointed.
- ✅ **The gallery is justified** — every row packed to full width at a shared height, so no picture
  ever stands alone and none is cropped or stretched. Verified at 33 rows, zero lonely rows.
- ✅ **Global search** across all three sagas from every page (`/` or Ctrl-K), with saga filters and
  keyboard navigation.
- ✅ **Home portal cards are real links** (stretched-link pattern) — keyboard-focusable,
  ctrl-clickable, visible to crawlers and screen readers.
- ✅ **A day/night theme** persisted in `localStorage["kwTheme"]`, with a `<head>` bootstrap on every
  page so there is no flash of the wrong palette.
- ✅ **Realm bar on mobile** wraps instead of scrolling — the old `overflow-x: auto` silently clipped
  every dropdown. Do not reintroduce `overflow` on that bar.
