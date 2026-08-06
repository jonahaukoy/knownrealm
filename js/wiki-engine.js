/* THE KNOWN WORLD — wiki engine.
   A hash-routed encyclopedia generated from a world's own data files (data.js,
   characters.js, books.js, seasons.js, groups.js, deaths.js, people.js…).
   Each wiki page defines window.WIKI_CONFIG *before* this script:
     { title, sub, mapHref, peopleDir, sigilDir }
   Routes: #cat=characters|houses|places|episodes|chapters
           #char=<Name> · #house=<id> · #group=<id> · #loc=<id>
           #episode=<s>-<e> · #chapter=<b>-<ch>                    */

(function () {
  const CFG = window.WIKI_CONFIG || { title: "Wiki", sub: "", mapHref: "map.html", peopleDir: "assets/people/", sigilDir: "assets/sigils/" };
  const $ = (id) => document.getElementById(id);
  const out = $("wiki-content");

  const locById = {}; WORLD.locations.forEach((l) => (locById[l.id] = l));
  const houseById = {}; WORLD.houses.forEach((h) => (houseById[h.id] = h));
  const regionById = {}; WORLD.regions.forEach((r) => (regionById[r.id] = r));
  /* extra landed/lesser houses — encyclopedia-only pages (not on the map), each
     with its own banner art. Defined in window.EXTRA_HOUSES before this engine. */
  const EXTRA_HS = (typeof EXTRA_HOUSES !== "undefined" && EXTRA_HOUSES) || [];
  const extraHouseById = {}; EXTRA_HS.forEach((h) => (extraHouseById[h.id] = h));
  const ALL_SEASONS = [{ n: 1, name: "Season One", episodes: EPISODES }].concat(SEASONS_LATER);
  const groupsFlat = [];
  GROUP_SECTIONS.forEach((sec) => sec.groups.forEach((g) => groupsFlat.push({ kind: sec.kind, g })));

  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

  /* ================= the spoiler shield, on the page =================
     One record for the whole site (js/shield.js), the same one the games, the
     family trees and the timeline read. Two rules govern how it is used here:

     1. A reader who has NEVER answered the shield is shown everything. They
        have not asked to be protected, and an encyclopedia that opens by
        hiding itself is no use to anybody. They are offered the shield in the
        bar instead.
     2. Either telling unlocks. Someone who has read A Storm of Swords already
        knows what season three does, so season three is not withheld from
        them — that is KWShield's own standing rule and this only applies it.

     UNLOCK maps each season of this wiki's saga to the book that covers the
     same ground. Past the point the published books reach, the season is marked
     `b: 99` — KWShield's own way of writing "this telling has no opinion, and
     never will". It must NOT be left out: an absent field means "no threshold
     to meet", which reads as SATISFIED and would throw seasons six, seven and
     eight open to everybody. */
  const UNLOCK = CFG.unlock || {
    1: { s: 1, b: 1 }, 2: { s: 2, b: 2 }, 3: { s: 3, b: 3 }, 4: { s: 4, b: 3 },
    5: { s: 5, b: 5 }, 6: { s: 6, b: 99 }, 7: { s: 7, b: 99 }, 8: { s: 8, b: 99 },
  };
  const SHIELD_S = CFG.shieldSeasonKey || "gotS";
  const SHIELD_B = CFG.shieldBookKey || "gotB";
  const SHIELD_SMAX = CFG.shieldSeasonMax || 8;
  const SHIELD_BMAX = CFG.shieldBookMax || 5;

  function shieldAnswered() { return !!(window.KWShield && window.KWShield.has()); }
  function shieldNow() { return window.KWShield ? window.KWShield.get() : null; }
  function reachTh(th) {
    if (!shieldAnswered()) return true;
    return window.KWShield.reach(th, SHIELD_S, SHIELD_B);
  }
  /* has the reader reached season n of this saga, by either road? */
  function seenSeason(n) { return reachTh(UNLOCK[n] || { s: n, b: 99 }); }
  /* Has the reader read book n? Books gate on BOOKS ALONE — deliberately, and
     not through KWShield.reach(), whose "either telling unlocks" would answer
     yes to anyone who had watched anything, since a threshold naming only a
     book leaves the show with no opinion to fail. This section is titled "only
     in the books" and is for people reading them; a viewer who has finished the
     whole show still has not read a word of A Feast for Crows, and telling them
     what is in it is precisely the spoiler they asked us to hold back. */
  function readBook(n) {
    if (!shieldAnswered()) return true;
    return shieldNow()[SHIELD_B] >= n;
  }
  /* have they finished either telling? — the bar for whole-arc essays, which
     cannot be cut into seasons because they were not written that way */
  function finishedEither() { return reachTh({ s: SHIELD_SMAX, b: SHIELD_BMAX }); }

  /* where the reader says they stand, in words, for the notice below */
  function shieldStanding() {
    const st = shieldNow();
    if (!st) return "";
    const bits = [];
    if (st[SHIELD_S] > 0) bits.push("through season " + st[SHIELD_S]);
    if (st[SHIELD_B] > 0) bits.push("through book " + st[SHIELD_B]);
    return bits.length ? bits.join(" and ") : "at the very beginning";
  }
  /* the line that admits something has been held back. It is only ever printed
     when something ACTUALLY was, so its presence is honest and its absence is
     not a promise that nothing was coming. */
  function shieldNote(n, what) {
    if (!n) return "";
    return `<p class="wk-shielded"><span class="wk-shielded-icon">&#128737;</span>
      <span>${n === 1 ? "One part of this is" : n + " parts of this are"} folded away &mdash; your
      spoiler shield stands ${esc(shieldStanding())}, and ${esc(what)} lies past it.
      <button type="button" class="wk-shieldbtn" data-open-shield>Move the shield</button></span></p>`;
  }

  /* the browsable collections — dragons, Valyrian steel, direwolves, the
     Kingsguard, battles, prophecies. A wiki without them still works. */
  const COLS = (typeof COLLECTIONS !== "undefined" && COLLECTIONS) || [];
  const colById = {}, colItem = {};
  COLS.forEach((c) => {
    colById[c.id] = c;
    c.items.forEach((it) => { colItem[c.route + ":" + it.id] = { c, it }; });
  });

  /* Clickable names inside running text: every character, plus anything in the
     collections whose name is distinctive enough to match safely. Words like
     "Lady", "Ice", "Ghost", "Summer" and "Dawn" are ordinary English and would
     turn half the prose into links, so they are never matched automatically —
     and anything that is really a person keeps its own character page. */
  const LINK_BLOCK = new Set(["lady", "ice", "ghost", "summer", "dawn", "truth", "the order itself"]);
  const LINK_MAP = {};
  const CHAR_KEYS = Object.keys(CHARACTERS);
  CHAR_KEYS.forEach((n) => { LINK_MAP[n] = "#char=" + encodeURIComponent(n); });
  COLS.forEach((c) => c.items.forEach((it) => {
    const nm = it.name;
    if (nm in LINK_MAP || LINK_BLOCK.has(nm.toLowerCase()) || nm.length < 5) return;
    if (CHAR_KEYS.some((cn) => nm.indexOf(cn) >= 0)) return; /* a soul: their own page wins */
    LINK_MAP[nm] = "#" + c.route + "=" + it.id;
  }));
  const nameRegex = (() => {
    const toks = Object.keys(LINK_MAP).sort((a, b) => b.length - a.length)
      .map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    return toks.length ? new RegExp("\\b(" + toks.join("|") + ")\\b", "g") : null;
  })();
  function linkify(text) {
    if (!nameRegex) return esc(text);
    return esc(text).replace(nameRegex, (m) =>
      `<a class="wk-link" href="${LINK_MAP[m] || "#char=" + encodeURIComponent(m)}">${m}</a>`);
  }
  function charLink(name) {
    return CHARACTERS[name] ? `<a class="wk-link" href="#char=${encodeURIComponent(name)}">${esc(name)}</a>` : esc(name);
  }
  function faceHTML(name, size) {
    const img = (typeof PEOPLE_IMGS !== "undefined") && PEOPLE_IMGS[name];
    const cls = size === "big" ? "wk-face wk-face-big" : "wk-face";
    if (img) return `<span class="${cls}"><img src="${CFG.peopleDir}${img}" alt="" loading="lazy"/></span>`;
    const init = name.replace(/^(Ser|House|Lady|Lord|King|Prince|Princess)\s+/i, "").split(" ").map((w) => w[0]).slice(0, 2).join("");
    return `<span class="${cls} wk-face-blank">${init}</span>`;
  }
  function sigilHTML(id, size) {
    const cls = size === "big" ? "wk-sigil wk-sigil-big" : "wk-sigil";
    const src = (typeof sigilSrc === "function") ? sigilSrc(id, CFG.sigilDir) : CFG.sigilDir + id + ".svg";
    return `<span class="${cls}"><img src="${src}" alt="" loading="lazy" onerror="this.parentNode.classList.add('wk-face-blank');this.remove()"/></span>`;
  }
  /* like sigilHTML but from an explicit image path (extra houses carry their own art) */
  function sigilImgHTML(src, size) {
    const cls = size === "big" ? "wk-sigil wk-sigil-big" : "wk-sigil";
    return `<span class="${cls}"><img src="${esc(src)}" alt="" loading="lazy" onerror="this.parentNode.classList.add('wk-face-blank');this.remove()"/></span>`;
  }

  const CATS = [
    { id: "characters", label: "Characters", sub: () => Object.keys(CHARACTERS).length + " souls" },
    { id: "houses", label: "Houses & Orders", sub: () => (WORLD.houses.length + groupsFlat.filter((x) => x.kind !== "great").length + EXTRA_HS.length) + " banners" },
    { id: "places", label: "Places", sub: () => WORLD.locations.length + " castles, cities & ruins" },
    { id: "episodes", label: "Episodes", sub: () => ALL_SEASONS.reduce((a, s) => a + s.episodes.length, 0) + " episodes" },
    { id: "chapters", label: "Chapters", sub: () => BOOKS.reduce((a, b) => a + b.chapters, 0) + " chapters, " + BOOKS.length + " books" },
  ];
  /* each collection becomes a category of its own on the wiki's front page */
  COLS.forEach((c) => CATS.push({ id: c.id, label: c.label, sub: () => c.sub(c.items.length) }));
  /* the ages of the world — long-form era histories, if this wiki carries them */
  const ERAS_DATA = (typeof ERA_ARTICLES !== "undefined" && ERA_ARTICLES) || null;
  const ERAS_ORDER = (typeof ERA_ORDER !== "undefined" && ERA_ORDER) || (ERAS_DATA ? Object.keys(ERAS_DATA) : []);
  if (ERAS_DATA) CATS.push({ id: "ages", label: "The Ages of the Realm", sub: () => ERAS_ORDER.length + " ages, twelve thousand years" });

  // ================= search =================
  const INDEX = [];
  Object.keys(CHARACTERS).forEach((n) => INDEX.push({ label: n, kind: "Person", href: "#char=" + encodeURIComponent(n) }));
  WORLD.houses.forEach((h) => INDEX.push({ label: h.name, kind: "House", href: "#house=" + h.id }));
  groupsFlat.filter((x) => x.kind !== "great").forEach((x) => INDEX.push({ label: x.g.name, kind: "Order", href: "#group=" + x.g.id }));
  EXTRA_HS.forEach((h) => INDEX.push({ label: h.name, kind: "House", href: "#house=" + h.id }));
  WORLD.locations.forEach((l) => INDEX.push({ label: l.name, kind: "Place", href: "#loc=" + l.id }));
  ALL_SEASONS.forEach((s) => s.episodes.forEach((e) => INDEX.push({ label: `S${s.n}·E${e.n} — ${e.title}`, kind: "Episode", href: `#episode=${s.n}-${e.n}` })));
  COLS.forEach((c) => c.items.forEach((it) => INDEX.push({ label: it.name, kind: c.label, href: "#" + c.route + "=" + it.id })));

  function initSearch() {
    const input = $("wiki-search"), res = $("wiki-search-results");
    if (!input) return;
    /* this wiki's own saga (so we don't repeat its own pages as "elsewhere"),
       and the path back to the site root for cross-saga links */
    const path = location.pathname;
    const SAGA = path.indexOf("/hotd/") >= 0 ? "H" : path.indexOf("/knight/") >= 0 ? "K" : "";
    const ROOT = SAGA === "" ? "" : "../";
    const SAGA_LABEL = { "": "Game of Thrones", H: "House of the Dragon", K: "Dunk & Egg" };
    let xLoading = false;
    function loadIndex(then) {
      if (window.SEARCH_INDEX) return then();
      if (xLoading) return;
      xLoading = true;
      const s = document.createElement("script");
      s.src = ROOT + "js/search-index.js";
      s.onload = () => { xLoading = false; then(); };
      s.onerror = () => { xLoading = false; };
      document.head.appendChild(s);
    }
    function render(q) {
      const local = INDEX.filter((e) => e.label.toLowerCase().includes(q)).slice(0, 8);
      let html = local.map((h) => `<a class="search-result" href="${h.href}"><span class="search-kind">${h.kind}</span><span class="search-result-label">${esc(h.label)}</span></a>`).join("");
      const idx = window.SEARCH_INDEX;
      if (idx) {
        const cross = [];
        for (let i = 0; i < idx.length && cross.length < 6; i++) {
          const e = idx[i];
          if (e[3] === SAGA) continue;                 /* our own saga is already above */
          if (e[0].toLowerCase().indexOf(q) >= 0) cross.push(e);
        }
        if (cross.length) {
          html += `<div class="search-section">Elsewhere in the realm</div>` +
            cross.map((e) => `<a class="search-result" href="${ROOT}${e[2]}"><span class="search-kind">${esc(SAGA_LABEL[e[3]] || "")}</span><span class="search-result-label">${esc(e[0])}</span></a>`).join("");
        }
      }
      res.innerHTML = html || `<div class="search-empty">Nothing by that name.</div>`;
      res.classList.remove("hidden");
      res.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => res.classList.add("hidden")));
    }
    input.addEventListener("input", () => {
      const q = input.value.trim().toLowerCase();
      if (q.length < 2) { res.classList.add("hidden"); return; }
      render(q);                                       /* local hits instantly */
      if (!window.SEARCH_INDEX) loadIndex(() => { if (input.value.trim().toLowerCase() === q) render(q); });
    });
    document.addEventListener("click", (e) => { if (e.target !== input) res.classList.add("hidden"); });
  }

  // ================= shared bits =================
  function crumbs(items) {
    return `<div class="wk-crumbs"><a href="#">${esc(CFG.title)}</a>` +
      items.map((c) => c.href ? ` &rsaquo; <a href="${c.href}">${esc(c.label)}</a>` : ` &rsaquo; <span>${esc(c.label)}</span>`).join("") + `</div>`;
  }
  function metaRow(k, v) { return v ? `<div class="wk-meta-row"><span>${k}</span><b>${v}</b></div>` : ""; }

  /* WIKI_EXTRA values are either a legacy array of paragraphs, or an object:
       { intro:    [...],   — who they are, in a few sentences: appearance,
                              temper, what they want. Runs under the blurb at
                              the very top and is never gated — it is the one
                              part of a page that has to be safe for everybody.
         paras:    [...],   — the old whole-arc essay. No longer rendered on a
                              character page (Aug 2026); still used by houses,
                              orders and places as their "fuller tale".
         sections: [{h, paras}], — a fuller tale cut into its own headings, for
                              houses, orders and places
         seasons:  {n: [...]},  — hand-written recap of season n; where none is
                              written the season is composed from the
                              chronicle's own episode notes and event lines
         vs:       [...],   — how the books and the screen tell it differently
         fate:     [...] }  — death prose, shown once the reader has reached it
     extraFor() normalizes both shapes so every render path reads one format. */
  function extraFor(key) {
    const raw = (typeof WIKI_EXTRA !== "undefined" && WIKI_EXTRA[key]) || null;
    const empty = { intro: null, paras: null, sections: null, seasons: null, vs: null, fate: null };
    if (!raw) return empty;
    if (Array.isArray(raw)) return Object.assign({}, empty, { paras: raw });
    return Object.assign({}, empty, {
      intro: raw.intro || null, paras: raw.paras || null, sections: raw.sections || null,
      seasons: raw.seasons || null, vs: raw.vs || null, fate: raw.fate || null,
    });
  }
  /* a fuller tale that carries its own headings (houses, orders, places) */
  function sectionBlock(sections) {
    return (sections || []).map((s) =>
      `<h4 class="wk-h4">${esc(s.h)}</h4>` +
      (s.paras || []).map((p) => `<p class="wk-para">${linkify(p)}</p>`).join("")).join("");
  }
  function paraBlock(title, paras) {
    return paras && paras.length
      ? `<h3 class="wk-h3">${title}</h3>` + paras.map((p) => `<p class="wk-para">${linkify(p)}</p>`).join("") : "";
  }

  /* a picture slot: a real image when one is registered for this page's key in
     window.WIKI_IMAGES, otherwise an elegant empty frame awaiting art. */
  /* a page slot may register ONE image (a string) or SEVERAL (an array) — an
     episode drawn from more than one chapter's art, say. picturesFor always hands
     back a list; pictureFor hands back just the first, for single-image thumbnails
     and covers that cannot show more than one. */
  function picturesFor(key) {
    let v = (typeof WIKI_IMAGES !== "undefined" && key && WIKI_IMAGES[key]) || null;
    /* a person with no scene of their own falls back to the portrait table
       (js/wiki-art.js), which is chosen to be safe for a reader on their first
       hour — a banner is shown before the shield is ever consulted */
    if (!v && key && key.indexOf("char:") === 0 && typeof WIKI_PORTRAIT !== "undefined") {
      v = WIKI_PORTRAIT[key.slice(5)] || null;
    }
    if (!v) return [];
    return Array.isArray(v) ? v : [v];
  }

  /* ================= pictures inside the text =================
     A wiki reads better with something to look at beside the prose. Two kinds
     of figure are dropped into the running text, both small enough to sit in a
     column rather than swallow it:

       - a scene tied to a season, declared in WIKI_FIGURES, which is held back
         by exactly the same shield that holds its season back;
       - the art already filed against an EPISODE of that season, which needs no
         new table at all because every one of those was painted for that hour.

     Everything is `loading="lazy"`: a page can carry a dozen of these and must
     not pay for them until they are scrolled to. */
  function figureHTML(src, label, side) {
    return `<figure class="wk-fig wk-fig-${side || "right"}">
      <img src="${esc(src)}" alt="${esc(label || "")}" loading="lazy"/>
      ${label ? `<figcaption>${esc(label)}</figcaption>` : ""}
    </figure>`;
  }
  function seasonFigures(key, sN, episodes, name) {
    const out = [];
    const declared = (typeof WIKI_FIGURES !== "undefined" && WIKI_FIGURES[key]) || [];
    declared.forEach((f) => { if (f.season === sN) out.push(figureHTML(f.src, f.label, out.length % 2 ? "left" : "right")); });
    if (out.length) return out.join("");
    /* nothing declared: borrow the art of an hour this person is actually in */
    for (let i = 0; i < episodes.length; i++) {
      const ep = episodes[i];
      if (name && !(ep.people || []).some((p) => p.name === name)) continue;
      const pics = picturesFor("episode:" + sN + "-" + ep.n);
      if (pics.length) return figureHTML(pics[0], ep.title, "right");
    }
    return "";
  }
  function pictureFor(key) {
    const list = picturesFor(key);
    return list.length ? list[0] : null;
  }
  function imgFrame(cls, label, key) {
    const list = picturesFor(key);
    if (list.length) return list.map((src) =>
      `<div class="wk-imgframe wk-imgframe-filled ${cls}"><img src="${src}" alt="${esc(label)}" loading="lazy"/></div>`).join("");
    return `<div class="wk-imgframe ${cls}" aria-hidden="true">
      <span class="wk-imgframe-crest">&#10022;</span>
      <span class="wk-imgframe-label">${esc(label || "Illumination to come")}</span>
    </div>`;
  }
  const CAT_GLYPH = {
    characters: "&#128100;", houses: "&#128737;", places: "&#127984;",
    episodes: "&#127916;", chapters: "&#128214;", ages: "&#8987;",
  };

  // ================= views =================
  function renderHome() {
    out.innerHTML = `
      <div class="wk-hero">
        ${imgFrame("wk-hero-banner", "A banner will hang here", "home")}
        <div class="wk-flourish">&#10022;</div>
        <h1>${esc(CFG.title)}</h1>
        <p>${esc(CFG.sub)}</p>
      </div>
      <div class="wk-cats">
        ${CATS.map((c) => `<a class="wk-cat" href="#cat=${c.id}">
          <span class="wk-cat-emblem">${(colById[c.id] && colById[c.id].glyph) || CAT_GLYPH[c.id] || "&#10022;"}</span>
          <span class="wk-cat-title">${c.label}</span>
          <span class="wk-cat-sub">${c.sub()}</span>
        </a>`).join("")}
      </div>`;
  }

  /* ---- the collections: an index page and a page per entry ---- */
  function renderColIndex(c) {
    /* an entry's own picture, where one is registered, stands in for the
       category glyph on its card — a row of six direwolves beats a row of six
       identical wolf emblems. Falls back to the glyph wherever art is missing,
       so a half-illustrated collection still looks deliberate. */
    const cards = c.items.map((it) => {
      const thumb = pictureFor(c.route + ":" + it.id);
      return `
      <a class="wk-card wk-col-card${thumb ? " wk-col-card-art" : ""}" href="#${c.route}=${it.id}">
        ${thumb
          ? `<span class="wk-col-thumb"><img src="${thumb}" alt="" loading="lazy"/></span>`
          : `<span class="wk-col-glyph">${c.glyph}</span>`}
        <span class="wk-col-text"><b>${esc(it.name)}</b><i>${esc(it.sub || "")}</i></span>
      </a>`;
    }).join("");
    out.innerHTML = crumbs([{ label: c.label }]) +
      imgFrame("wk-banner", "An illustration will hang here", "col:" + c.id) + `
      <div class="wk-body wk-wide">
        <h1>${esc(c.label)}</h1>
        <p class="wk-lead">${linkify(c.intro)}</p>
        ${c.extra || ""}
        <h3 class="wk-h3">${esc(c.sub(c.items.length))}</h3>
        <div class="wk-col-grid">${cards}</div>
      </div>`;
  }

  function renderColItem(c, it) {
    const meta = (it.meta || []).map(([k, v]) => metaRow(k, linkify(v))).join("");
    const i = c.items.indexOf(it);
    const prev = i > 0 ? c.items[i - 1] : null;
    const next = i < c.items.length - 1 ? c.items[i + 1] : null;
    /* the fold is always present, so its existence never betrays whether there
       is an ending waiting inside it */
    const summary = c.id === "prophecies"
      ? "How it has played out &mdash; open at your peril"
      : "What became of it &mdash; if an ending is written, it is here. Spoilers.";
    const fateSecs = (it.fateSections || []).map(
      (s) => `<h4 class="wk-h4">${esc(s.h)}</h4>` + (s.paras || []).map((p) => `<p>${linkify(p)}</p>`).join("")
    ).join("");
    const fateParas = (it.fate && it.fate.length) ? it.fate.map((p) => `<p>${linkify(p)}</p>`).join("") : "";
    const inner = (fateParas + fateSecs) ||
      `<p>The chronicle records no ending here &mdash; or none the maesters have set down.</p>`;
    out.innerHTML = crumbs([{ label: c.label, href: "#cat=" + c.id }, { label: it.name }]) +
      imgFrame("wk-banner", "An illustration will hang here", c.route + ":" + it.id) + `
      <div class="wk-article">
        <div class="wk-side">
          <div class="wk-col-emblem">${c.glyph}</div>
          ${meta ? `<div class="wk-meta">${meta}</div>` : ""}
          <a class="wk-mapbtn" href="#cat=${c.id}">&larr; All ${esc(c.label)}</a>
        </div>
        <div class="wk-body">
          <h1>${esc(it.name)}</h1>
          ${it.sub ? `<div class="wk-badges"><span class="wk-badge wk-badge-flat">${esc(it.sub)}</span></div>` : ""}
          <p class="wk-lead">${linkify(it.blurb || "")}</p>
          ${paraBlock(it.parasTitle || "The fuller tale", it.paras)}
          ${(it.sections || []).map((s) => paraBlock(esc(s.h), s.paras)).join("")}
          ${it.extra || ""}
          ${it.wb ? `<a class="wk-bigbtn" href="whitebook.html#kg=${encodeURIComponent(it.wb)}">&#128737; Read the folio in the White Book &rarr;</a>` : ""}
          <details class="wk-spoiler"><summary>${summary}</summary><div>${inner}</div></details>
          <div class="wk-pager">
            ${prev ? `<a href="#${c.route}=${prev.id}">&larr; ${esc(prev.name)}</a>` : "<span></span>"}
            ${next ? `<a href="#${c.route}=${next.id}">${esc(next.name)} &rarr;</a>` : "<span></span>"}
          </div>
        </div>
      </div>`;
  }

  function renderCat(cat) {
    if (colById[cat]) return renderColIndex(colById[cat]);
    let body = "";
    if (cat === "characters") {
      /* grouped by house — the great houses first, in the realm's usual order,
         then everyone unsworn (the Watch, the free folk, the smallfolk, the
         Others) together at the end. Alphabetical within each house. */
      const cardFor = (n) => `<a class="wk-card" href="#char=${encodeURIComponent(n)}">${faceHTML(n)}<span>${esc(n)}</span></a>`;
      /* one card per person: honorific/variant names (e.g. "King Robert I
         Baratheon") are extra keys pointing at the SAME object as the canonical
         name ("Robert Baratheon"), added after it — so we keep the first key we
         see for each object and skip the rest. That also keeps the plainest,
         least-spoilery name (Tommen Baratheon, not "King Tommen I Baratheon"). */
      const byHouse = {}, seenObj = [];
      Object.keys(CHARACTERS).forEach((n) => {
        const obj = CHARACTERS[n];
        if (seenObj.indexOf(obj) >= 0) return;
        seenObj.push(obj);
        const h = (obj && obj.house) || "_none";
        (byHouse[h] = byHouse[h] || []).push(n);
      });
      const order = WORLD.houses.map((h) => h.id).filter((id) => byHouse[id]);
      Object.keys(byHouse).forEach((id) => { if (id !== "_none" && order.indexOf(id) < 0) order.push(id); });
      body = order.map((id) => {
        const h = WORLD.houses.filter((x) => x.id === id)[0];
        const label = h ? h.name : ("House " + id.charAt(0).toUpperCase() + id.slice(1));
        const names = byHouse[id].slice().sort();
        return `<section class="wk-catsec"><h3 class="wk-h3">${sigilHTML(id)}<span>${esc(label)} <em>${names.length}</em></span></h3>
          <div class="wk-grid">${names.map(cardFor).join("")}</div></section>`;
      }).join("");
      if (byHouse._none) {
        const names = byHouse._none.slice().sort();
        body += `<section class="wk-catsec"><h3 class="wk-h3"><span>The Unsworn &amp; Beyond <em>${names.length}</em></span></h3>
          <div class="wk-grid">${names.map(cardFor).join("")}</div></section>`;
      }
    } else if (cat === "houses") {
      body = `<h3 class="wk-h3">The Great Houses</h3><div class="wk-grid">` +
        WORLD.houses.map((h) => `<a class="wk-card" href="#house=${h.id}">${sigilHTML(h.id)}<span>${esc(h.name)}</span></a>`).join("") + `</div>`;
      const orders = groupsFlat.filter((x) => x.kind !== "great");
      if (orders.length) {
        body += `<h3 class="wk-h3">Orders & Lesser Houses</h3><div class="wk-grid">` +
          orders.map((x) => `<a class="wk-card" href="#group=${x.g.id}"><span class="wk-face wk-face-blank">${esc((x.g.emblem && x.g.emblem.glyph) || "•")}</span><span>${esc(x.g.name)}</span></a>`).join("") + `</div>`;
      }
      if (EXTRA_HS.length) {
        const byRegion = {};
        EXTRA_HS.forEach((h) => { (byRegion[h.region] = byRegion[h.region] || []).push(h); });
        Object.keys(byRegion).sort().forEach((rid) => {
          const rn = (regionById[rid] || {}).name || rid;
          body += `<h3 class="wk-h3">Landed Houses &mdash; ${esc(rn)}</h3><div class="wk-grid">` +
            byRegion[rid].slice().sort((a, b) => a.name.localeCompare(b.name)).map((h) =>
              `<a class="wk-card" href="#house=${h.id}">${sigilImgHTML(h.sigil)}<span>${esc(h.name)}</span></a>`).join("") + `</div>`;
        });
      }
    } else if (cat === "places") {
      /* grouped by region, in the realm's usual order; within a region the
         greatest seats first (by rank) then alphabetical. A small type tag rides
         each card so cities, castles and ruins still read apart at a glance. */
      const TYPE_LABEL = { castle: "Castle", city: "City", town: "Town", ruin: "Ruin", landmark: "Landmark" };
      const byRegion = {};
      WORLD.locations.forEach((l) => { (byRegion[l.region] = byRegion[l.region] || []).push(l); });
      body = WORLD.regions.map((r) => {
        const locs = (byRegion[r.id] || []).slice().sort((a, b) => (a.rank - b.rank) || a.name.localeCompare(b.name));
        if (!locs.length) return "";
        return `<section class="wk-catsec"><h3 class="wk-h3"><span>${esc(r.name)} <em>${locs.length}</em></span></h3>
          <div class="wk-grid">${locs.map((l) =>
            `<a class="wk-card wk-card-loc" href="#loc=${l.id}"><span class="wk-card-type">${esc(TYPE_LABEL[l.type] || "")}</span>` +
            `<span>${esc(l.name)}</span><span class="wk-card-sub">${esc(l.subtitle || "")}</span></a>`).join("")}</div></section>`;
      }).join("");
    } else if (cat === "episodes") {
      ALL_SEASONS.forEach((s) => {
        body += `<h3 class="wk-h3">${esc(s.name)}</h3><div class="wk-rows">` +
          s.episodes.map((e) => {
            const thumb = pictureFor("episode:" + s.n + "-" + e.n);
            return `<a class="wk-chrow" href="#episode=${s.n}-${e.n}">
              <span class="wk-chrow-thumb">${thumb
                ? `<img src="${thumb}" alt="" loading="lazy"/>`
                : `<span class="wk-chrow-crest">&#127916;</span>`}</span>
              <span class="wk-chrow-num">S${s.n}·E${e.n}</span>
              <span class="wk-chrow-title">${esc(e.title)}</span>
              <span class="wk-chrow-go">&#8250;</span></a>`;
          }).join("") + `</div>`;
      });
    } else if (cat === "chapters") {
      /* one collapsible tome per book: a cover plate you press to unfurl every
         chapter of that book, each with its own illustration. Several books can
         stand open at once — pressing one never closes another. */
      body = `<p class="wk-lead wk-books-lead">Five books, chapter by chapter. Press a
        cover to unfurl its chapters — leave as many open as you like.</p>
        <div class="wk-books">` + BOOKS.map((b) => {
        const cover = pictureFor("book:" + b.n);
        const rows = b.chs.map((ch, i) => {
          const thumb = pictureFor("chapter:" + b.n + "-" + (i + 1));
          return `<a class="wk-chrow" href="#chapter=${b.n}-${i + 1}">
            <span class="wk-chrow-thumb">${thumb
              ? `<img src="${thumb}" alt="" loading="lazy"/>`
              : `<span class="wk-chrow-crest">&#10022;</span>`}</span>
            <span class="wk-chrow-num">${esc(b.short)} ${i + 1}</span>
            <span class="wk-chrow-title">${esc(ch[0])}</span>
            <span class="wk-chrow-go">&#8250;</span></a>`;
        }).join("");
        return `<section class="wk-book" data-book="${b.n}">
          <button class="wk-book-head" type="button" aria-expanded="false">
            <span class="wk-book-cover">${cover
              ? `<img src="${cover}" alt="" loading="lazy"/>`
              : `<span class="wk-book-cover-crest">&#128214;</span>`}</span>
            <span class="wk-book-headtext">
              <span class="wk-book-name">${esc(b.name)}</span>
              <span class="wk-book-meta">${b.chapters} chapters</span>
            </span>
            <span class="wk-book-chev" aria-hidden="true">&#9662;</span>
          </button>
          <div class="wk-book-panel"><div class="wk-book-panel-inner">${rows}</div></div>
        </section>`;
      }).join("") + `</div>`;
    } else if (cat === "ages" && ERAS_DATA) {
      body = `<p class="wk-lead">Twelve thousand years, from the Dawn Age to the breaking of the wheel &mdash;
        the whole history of the Known World told in seven ages. Each is a long read, for each covers a great
        deal of the world.</p><div class="wk-rows">` +
        ERAS_ORDER.map((id) => { const e = ERAS_DATA[id]; return `<a class="wk-row" href="#era=${id}">
          <span class="wk-row-num">${esc(e.when || "")}</span><span>${esc(e.title)}</span></a>`; }).join("") + `</div>`;
    }
    const c = CATS.find((x) => x.id === cat);
    out.innerHTML = crumbs([{ label: c ? c.label : cat }]) + body;
    if (cat === "chapters") {
      out.querySelectorAll(".wk-book-head").forEach((btn) => {
        btn.addEventListener("click", () => {
          const sec = btn.closest(".wk-book");
          const open = sec.classList.toggle("open");
          btn.setAttribute("aria-expanded", open ? "true" : "false");
        });
      });
    }
  }

  /* ================= naming a person in running prose =================
     The chronicle's own sentences call people by whatever the sentence wanted:
     "Eddard Stark" in one line and "Ned" in the next. To find the lines that
     are about somebody we need every name that unambiguously means them.

     The full name always counts. A single given name counts ONLY if no other
     soul in this wiki shares it — "Arya" is safe, "Jon" is not, because Jon
     Arryn and Jon Connington would both answer to it. Anything shorter than
     four letters is left alone; so are the honorific forms in CHARACTER_ALIASES
     that already point here. Matching is on word boundaries, so "Bran" never
     catches "Brandon". */
  const FIRST_COUNT = {};
  Object.keys(CHARACTERS).forEach((n) => {
    const first = n.split(" ")[0];
    FIRST_COUNT[first] = (FIRST_COUNT[first] || 0) + 1;
  });
  const HOOK_CACHE = {};
  function nameHooks(name) {
    if (HOOK_CACHE[name]) return HOOK_CACHE[name];
    const words = [name];
    const first = name.split(" ")[0];
    if (first.length >= 4 && FIRST_COUNT[first] === 1 && first !== name) words.push(first);
    const list = words.map((w) =>
      new RegExp("\\b" + w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b"));
    HOOK_CACHE[name] = list;
    return list;
  }

  /* ================= the road they walk =================
     Two ledgers describe it: WHEREABOUTS (season, episode, place) and
     WHEREABOUTS_BOOK (book, chapter, place). Each is reduced to the ORDER of
     the places it visits, consecutive repeats collapsed, and then the two are
     diffed with a longest-common-subsequence. Every place both tellings agree
     on becomes one full-width row; each stretch where they disagree becomes a
     split row, screen on the left and page on the right. Where only one telling
     has any record at all, its road simply runs whole down the page. */
  function stopsFrom(ledger, name, fmt) {
    if (typeof ledger === "undefined" || !ledger || !ledger[name]) return [];
    const out = [];
    ledger[name].forEach((s) => {
      const id = s[2];
      if (!id || !locById[id]) return;
      if (out.length && out[out.length - 1].id === id) return;   /* still there */
      out.push({ id: id, when: fmt(s[0], s[1]) });
    });
    return out;
  }
  function lcs(a, b) {
    const n = a.length, m = b.length;
    const t = [];
    for (let i = 0; i <= n; i++) t.push(new Array(m + 1).fill(0));
    for (let i = n - 1; i >= 0; i--)
      for (let j = m - 1; j >= 0; j--)
        t[i][j] = a[i].id === b[j].id ? t[i + 1][j + 1] + 1 : Math.max(t[i + 1][j], t[i][j + 1]);
    const pairs = [];
    let i = 0, j = 0;
    while (i < n && j < m) {
      if (a[i].id === b[j].id) { pairs.push([i, j]); i++; j++; }
      else if (t[i + 1][j] >= t[i][j + 1]) i++;
      else j++;
    }
    return pairs;
  }
  function stopHTML(st, note) {
    const l = locById[st.id];
    return `<b><a class="wk-link" href="#loc=${st.id}">${esc(l.name)}</a></b>` +
      (note ? `<i class="wk-note"> — ${esc(note)}</i>` : "");
  }
  function journeyHTML(name) {
    const show = stopsFrom(typeof WHEREABOUTS !== "undefined" ? WHEREABOUTS : null, name,
      (a, b) => `S${a}·E${b}`);
    const book = stopsFrom(typeof WHEREABOUTS_BOOK !== "undefined" ? WHEREABOUTS_BOOK : null, name,
      (a, b) => `${(BOOKS.find((x) => x.n === a) || {}).short || "Bk " + a} ${b}`);
    if (!show.length && !book.length) return "";

    /* hand-written notes, where a traced road exists for this person */
    const notes = {};
    const j = WORLD.journeys && WORLD.journeys.find((x) => x.character === name || x.character.indexOf(name) === 0);
    if (j) j.stops.forEach((st) => { if (st.location && st.note) notes[st.location] = st.note; });

    const rows = [];
    const whole = (st, when) =>
      `<span class="wk-row wk-row-plain wk-jrow"><span class="wk-row-num">${esc(when)}</span>
        <span>${stopHTML(st, notes[st.id])}</span></span>`;
    const side = (list) => list.map((st) =>
      `<span class="wk-jside-stop"><span class="wk-row-num">${esc(st.when)}</span>
        <span>${stopHTML(st, notes[st.id])}</span></span>`).join("");
    const split = (a, b) =>
      `<span class="wk-row wk-row-plain wk-jrow wk-jsplit">
        <span class="wk-jside wk-jside-show"><span class="wk-jside-tag">On the screen</span>${side(a)}</span>
        <span class="wk-jside wk-jside-book"><span class="wk-jside-tag">In the books</span>${side(b)}</span>
      </span>`;

    if (!book.length) show.forEach((st) => rows.push(whole(st, st.when)));
    else if (!show.length) book.forEach((st) => rows.push(whole(st, st.when)));
    else {
      const pairs = lcs(show, book);
      let i = 0, k = 0;
      pairs.forEach(([pi, pk]) => {
        const onlyShow = show.slice(i, pi), onlyBook = book.slice(k, pk);
        if (onlyShow.length || onlyBook.length) rows.push(split(onlyShow, onlyBook));
        rows.push(whole(show[pi], show[pi].when + " · " + book[pk].when));
        i = pi + 1; k = pk + 1;
      });
      const tailShow = show.slice(i), tailBook = book.slice(k);
      if (tailShow.length || tailBook.length) rows.push(split(tailShow, tailBook));
    }
    const both = show.length && book.length;
    return `<h3 class="wk-h3">Their journey</h3>` +
      (both ? `<p class="wk-jnote">Where the two tellings send them to the same place the road runs
        whole; where they part, the screen keeps the left and the books the right.</p>` : "") +
      `<div class="wk-rows wk-journey">${rows.join("")}</div>`;
  }

  /* the ground they cover in one season, as a closing line for a composed
     season recap — the ledger already knows it and it grounds the rest */
  function seasonPlaces(name, sN) {
    if (typeof WHEREABOUTS === "undefined" || !WHEREABOUTS || !WHEREABOUTS[name]) return "";
    const seenP = [];
    WHEREABOUTS[name].forEach((s) => {
      if (s[0] !== sN || !s[2] || !locById[s[2]]) return;
      if (seenP.indexOf(s[2]) < 0) seenP.push(s[2]);
    });
    if (!seenP.length) return "";
    const links = seenP.map((id) => `<a class="wk-link" href="#loc=${id}">${esc(locById[id].name)}</a>`);
    const list = links.length === 1 ? links[0]
      : links.slice(0, -1).join(", ") + " and " + links[links.length - 1];
    return `<b class="wk-para-lead">Where they stand.</b> ${list}.`;
  }

  /* small print under portraits & stills */
  function creditHTML() {
    const href = CFG.creditsHref || "credits.html";
    return `<div class="wk-credit">Promotional still &copy; HBO / Warner Bros. Discovery — shown for identification &amp; commentary. <a href="${href}">All credits</a></div>`;
  }

  function renderChar(name) {
    /* honorific / variant names ("Lord Eddard Stark", "King Tommen I Baratheon")
       redirect to the ONE canonical page, which carries the full article — so a
       formal-name link never lands on a short, duplicate card-only page. */
    if (typeof CHARACTER_ALIASES !== "undefined" && CHARACTER_ALIASES[name] && CHARACTER_ALIASES[name] !== name) {
      const canon = CHARACTER_ALIASES[name];
      try { history.replaceState(null, "", "#char=" + encodeURIComponent(canon)); } catch (e) {}
      return renderChar(canon);
    }
    const c = CHARACTERS[name];
    if (!c) { out.innerHTML = crumbs([{ label: name }]) + `<p class="wk-missing">The maesters have no page for this soul.</p>`; return; }
    const groups = (typeof characterGroupsAt === "function" ? characterGroupsAt(name, null) : []);
    const seen = new Set();
    const badges = groups.filter((g) => !seen.has(g.id) && seen.add(g.id)).map((g) => {
      const gh = houseById[g.id];
      const target = gh ? "#house=" + g.id : "#group=" + g.id;
      const label = gh ? gh.name : (groupsFlat.find((x) => x.g.id === g.id) || { g: { name: g.id } }).g.name;
      return `<a class="wk-badge" href="${target}">${esc(label)}</a>`;
    }).join("");
    const fam = [];
    if (c.father) fam.push(metaRow("Father", charLink(c.father)));
    if (c.mother) fam.push(metaRow("Mother", charLink(c.mother)));
    if (c.spouse) fam.push(metaRow("Spouse", charLink(c.spouse)));
    if (c.bookSpouse) fam.push(metaRow("Spouse (books)", charLink(c.bookSpouse)));
    if (c.siblings && c.siblings.length) fam.push(metaRow("Siblings", c.siblings.map(charLink).join(", ")));
    if (c.children && c.children.length) fam.push(metaRow("Children", c.children.map(charLink).join(", ")));

    const extra = extraFor(name);

    /* ================= WHO THEY ARE, IN A FEW SENTENCES =================
       The blurb answers "who is this" in a line. A hand-written `intro` adds
       what a blurb has no room for — what they look like, how they carry
       themselves, what they are after. Where none is written, the page composes
       a second sentence out of what the data already knows: their house, their
       birthplace, and the banners and orders they are sworn to.

       This part is NEVER gated. It is the one piece of a page that has to be
       safe for a reader on their first episode, so nothing in it may look
       forward — which is also why it is built from standing facts and not from
       anything that happens. */
    let intro = "";
    if (extra.intro && extra.intro.length) {
      intro = extra.intro.map((p) => `<p class="wk-para wk-intro">${linkify(p)}</p>`).join("");
    } else {
      const bits = [];
      const hh = c.house && houseById[c.house];
      if (hh) bits.push(`of <a class="wk-link" href="#house=${hh.id}">${esc(hh.name)}</a>`);
      if (c.born) bits.push(`born at ${esc(c.born)}`);
      const orders = groups.filter((g) => !houseById[g.id])
        .map((g) => (groupsFlat.find((x) => x.g.id === g.id) || { g: {} }).g)
        .filter((g) => g.name);
      if (orders.length) {
        const seenO = [];
        const names = orders.filter((g) => seenO.indexOf(g.name) < 0 && seenO.push(g.name))
          .slice(0, 3).map((g) => `<a class="wk-link" href="#group=${g.id}">${esc(g.name)}</a>`);
        bits.push("sworn to " + names.join(", "));
      }
      if (bits.length) intro = `<p class="wk-para wk-intro">A soul ${bits.join(", ")}.</p>`;
    }

    /* ================= THE FULLER TALE =================
       Rebuilt Aug 2026 at the owner's request. It used to be one whole-arc
       essay that assumed you had finished the show, followed much further down
       by a separate season-by-season list. It is now a recap you can read from
       where you actually are: one segment per season, each hidden on its own if
       the spoiler shield has not reached it, and the person's ending at the
       foot of it. The essay is still here — it is the best writing on the page
       — but it has moved below the seasons and waits until you have finished
       one telling or the other, because it cannot be cut into seasons.

       There is no "their fate" fold any more. The ending is simply part of the
       recap, and the shield decides whether you see it. */
    let hiddenTale = 0;
    const taleBits = [];

    ALL_SEASONS.forEach((s) => {
      /* hand-written prose for this season if anyone has written it; otherwise
         the chronicle's own episode notes, strung together */
      const written = extra.seasons && extra.seasons[s.n];
      let body = "";
      if (written && written.length) {
        body = written.map((p) => `<p class="wk-para">${linkify(p)}</p>`).join("");
      } else {
        /* Composed, and composed to READ — one sentence per hour they are in,
           plus the chronicle's own event lines that name them, plus the places
           they stand that season. Three sources instead of one is the
           difference between a list of fragments and a recap you can follow.
           Anything hand-written above beats all of it. */
        const hooks = nameHooks(name);
        const bits = [];
        s.episodes.forEach((ep) => {
          const p = (ep.people || []).find((x) => x.name === name);
          const evs = (ep.events || []).filter((ev) => hooks.some((h) => h.test(ev)));
          if (!p && !evs.length) return;
          const where = `<a class="wk-link" href="#episode=${s.n}-${ep.n}"><i>${esc(ep.title)}</i></a>`;
          if (p && p.note) bits.push(`In ${where} — ${esc(p.note)}`);
          else if (p) bits.push(`They are there in ${where}.`);
          evs.slice(0, 2).forEach((ev) => bits.push(linkify(ev)));
        });
        if (bits.length) {
          /* broken into paragraphs of four sentences so a long season is a
             couple of readable blocks rather than one wall */
          const paras = [];
          for (let k = 0; k < bits.length; k += 4) paras.push(bits.slice(k, k + 4).join(" "));
          body = paras.map((p) => `<p class="wk-para">${p}</p>`).join("");
          const stops = seasonPlaces(name, s.n);
          if (stops) body += `<p class="wk-para wk-season-where">${stops}</p>`;
        }
      }
      if (!body) return;
      if (!seenSeason(s.n)) { hiddenTale++; return; }
      const figs = seasonFigures("char:" + name, s.n, s.episodes, name);
      taleBits.push(`<section class="wk-season"><h4 class="wk-season-name">${esc(s.name)}</h4>${figs}${body}</section>`);
    });

    /* ---- how it ends for them ----
       Each telling's ending is gated on its own reckoning: the screen's death
       on its season, the books' on its book. Someone who has read all five
       books and watched nothing is told what the books did to them and not
       what the screen did, which is exactly right. */
    {
      const endBits = [];
      let endHidden = 0;
      if (c.death && c.death.s === 0) {
        endBits.push(`<p class="wk-para">${linkify(c.death.how)} — before this story begins.</p>`);
      } else if (c.death && c.death.s > 0) {
        if (seenSeason(c.death.s)) {
          const tale = (typeof DEATH_TALES !== "undefined" && DEATH_TALES[name]) || null;
          endBits.push(`<p class="wk-para"><b class="wk-para-lead">On the screen.</b> ${esc(c.death.how)}
            <a class="wk-link" href="#episode=${c.death.s}-${c.death.e}">(S${c.death.s}&middot;E${c.death.e})</a></p>`);
          if (tale) endBits.push(`<p class="wk-para">${linkify(tale)}</p>`);
        } else endHidden++;
      }
      if (c.bookDeath) {
        if (readBook(c.bookDeath.b)) {
          const bt = (typeof DEATH_TALES_BOOK !== "undefined" && DEATH_TALES_BOOK[name]) || null;
          const bk = (BOOKS.find((b) => b.n === c.bookDeath.b) || {}).short || ("book " + c.bookDeath.b);
          endBits.push(`<p class="wk-para"><b class="wk-para-lead">On the page.</b> ${esc(c.bookDeath.how)}
            <a class="wk-link" href="#chapter=${c.bookDeath.b}-${c.bookDeath.ch}">(${esc(bk)}, ch. ${c.bookDeath.ch})</a></p>`);
          if (bt) endBits.push(`<p class="wk-para">${linkify(bt)}</p>`);
        } else endHidden++;
      }
      if (extra.fate && extra.fate.length) {
        if (finishedEither()) extra.fate.forEach((p) => endBits.push(`<p class="wk-para">${linkify(p)}</p>`));
        else endHidden++;
      }
      hiddenTale += endHidden;
      if (endBits.length) {
        taleBits.push(`<section class="wk-season wk-season-end"><h4 class="wk-season-name">How it ends for them</h4>${endBits.join("")}</section>`);
      } else if (!endHidden && !c.death && !c.bookDeath) {
        taleBits.push(`<section class="wk-season wk-season-end"><h4 class="wk-season-name">How it ends for them</h4>
          <p class="wk-para">The chronicle records no death for this soul &mdash; they are living when the
          tale leaves them, or their ending is a page the maesters have yet to turn.</p></section>`);
      }
    }

    /* The whole-arc essay that used to close this section is gone (Aug 2026).
       The owner's judgement, and it is right: once the seasons above are a real
       recap, an essay retelling the same arc a second time is just the same
       story again. The prose is not deleted — it still sits in js/wiki-x/ and
       js/wiki-extra.js — it simply has no slot on the page any more. If it is
       ever wanted back, it belongs INSIDE the seasons, cut up, not after them. */

    const archive = taleBits.length || hiddenTale
      ? `<h3 class="wk-h3">The fuller tale</h3>` +
        shieldNote(hiddenTale, "what lies beyond it") + taleBits.join("")
      : "";

    /* ================= THEIR CHAPTERS, BOOK BY BOOK =================
       This used to be "Only in the books" — a paragraph of movement titles. It
       is now what a reader of the novels actually wants: every chapter that
       looks through this person's eyes, in order, under its book, carrying the
       one-line retelling that chapter already has and linking to its own page.

       A chapter belongs to somebody if its title is their point of view (the
       stem is mapped in js/chapter-pov.js — "Reek" and "Alayne" are the two
       that hide behind another name), or, for everyone who never held a
       viewpoint, if the chapter's own retelling names them. Each book is gated
       on that book alone. */
    let hiddenBooks = 0;
    const bookBits = [];
    if (c.bookBlurb) {
      if (readBook(1)) bookBits.push(`<p class="wk-para wk-lead-books">${linkify(c.bookBlurb)}</p>`);
      else hiddenBooks++;
    }
    const POV = (typeof CHAPTER_POV !== "undefined" && CHAPTER_POV) || {};
    const hooks = nameHooks(name);
    BOOKS.forEach((b) => {
      const rows = [];
      (b.chs || []).forEach((ch, i) => {
        const title = ch[0] || "";
        const stem = title.replace(/\s+[IVXLC]+$/, "");
        const isPov = POV[stem] === name;
        const named = !isPov && hooks.length && hooks.some((h) => h.test(ch[1] || ""));
        if (!isPov && !named) return;
        /* the painting made for this very chapter, where one exists — a small
           plate on the row, not a banner */
        const art = pictureFor("chapter:" + b.n + "-" + (i + 1));
        rows.push(`<a class="wk-chapline${isPov ? " wk-chapline-pov" : ""}${art ? " wk-chapline-art" : ""}" href="#chapter=${b.n}-${i + 1}">
          ${art ? `<span class="wk-chapline-thumb"><img src="${esc(art)}" alt="" loading="lazy"/></span>` : ""}
          <span class="wk-chapline-name">${esc(title)}</span>
          <span class="wk-chapline-text">${esc(ch[1] || "")}</span></a>`);
      });
      if (!rows.length) return;
      if (!readBook(b.n)) { hiddenBooks++; return; }
      const povCount = rows.filter((r) => r.indexOf("wk-chapline-pov") > 0).length;
      const count = povCount
        ? `${povCount} chapter${povCount === 1 ? "" : "s"} of their own` +
          (rows.length > povCount ? `, and ${rows.length - povCount} more that name them` : "")
        : `${rows.length} chapter${rows.length === 1 ? "" : "s"} that name them`;
      bookBits.push(`<section class="wk-season"><h4 class="wk-season-name">${esc(b.name)}
        <em class="wk-season-count">${count}</em></h4>
        <div class="wk-chaplines">${rows.join("")}</div></section>`);
    });
    if (extra.vs && extra.vs.length) {
      if (finishedEither()) {
        bookBits.push(`<section class="wk-season wk-season-essay"><h4 class="wk-season-name">Where the page and the screen part</h4>` +
          extra.vs.map((p) => `<p class="wk-para">${linkify(p)}</p>`).join("") + `</section>`);
      } else hiddenBooks++;
    }
    const inBooks = bookBits.length || hiddenBooks
      ? `<h3 class="wk-h3">Their chapters, book by book</h3>` +
        shieldNote(hiddenBooks, "the books you have not opened yet") + bookBits.join("")
      : "";

    /* ================= THEIR JOURNEY =================
       Every place the story takes them, in order — and where the two tellings
       send them to different places, the row splits: the screen's road down the
       left, the books' down the right. Rows the two agree on stay whole and run
       the full width, so the page reads as one road that occasionally forks.

       The order comes from the whereabouts ledgers (which cover everybody); the
       notes come from WORLD.journeys (which are hand-written but only exist for
       a few), so a stop that has a note keeps it. */
    const journey = journeyHTML(name);

    /* The "Their fate — open at your peril" fold that used to sit here is gone
       (Aug 2026). An ending is not a curiosity to be unwrapped; it is the last
       part of the recap, and the shield above decides whether the reader sees
       it. What was inside this fold now closes "The fuller tale". */

    /* their folio in the White Book, for anyone who ever wore the white cloak */
    const folio = (typeof WHITEBOOK_FOLIO !== "undefined" && WHITEBOOK_FOLIO[name]) || null;
    const whiteBook = folio
      ? `<a class="wk-bigbtn" href="${CFG.whiteBookHref || "whitebook.html"}#kg=${encodeURIComponent(folio)}">&#128737; Their folio in the White Book &rarr;</a>`
      : "";

    const hasImg = (typeof PEOPLE_IMGS !== "undefined") && PEOPLE_IMGS[name];
    out.innerHTML = crumbs([{ label: "Characters", href: "#cat=characters" }, { label: name }]) +
      imgFrame("wk-banner", "A scene will hang here", "char:" + name) + `
      <div class="wk-article">
        <div class="wk-side">
          ${faceHTML(name, "big")}
          ${hasImg ? creditHTML() : ""}
          <div class="wk-meta">
            ${metaRow("Born", esc(c.born || "Unknown"))}
            ${fam.join("")}
          </div>
          <a class="wk-mapbtn" href="${CFG.mapHref}#char=${encodeURIComponent(name)}">&#128205; Find them on the map</a>
        </div>
        <div class="wk-body">
          <h1>${esc(name)}</h1>
          <div class="wk-badges">${badges || ""}</div>
          <p class="wk-lead">${linkify(c.blurb || "")}</p>
          ${intro}
          ${archive}
          ${inBooks}
          ${journey}
          ${whiteBook}
        </div>
      </div>`;
  }

  function renderExtraHouse(id) {
    const h = extraHouseById[id];
    const region = regionById[h.region];
    const seatLoc = h.seat ? locById[h.seat.toLowerCase().replace(/[''’]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")] : null;
    const ex = extraFor("house:" + h.id);
    out.innerHTML = crumbs([{ label: "Houses & Orders", href: "#cat=houses" }, { label: h.name }]) +
      imgFrame("wk-banner", "A banner will hang here", "house:" + h.id) + `
      <div class="wk-article">
        <div class="wk-side">
          ${sigilImgHTML(h.sigil, "big")}
          <div class="wk-meta">
            ${metaRow("Words", h.words ? `&ldquo;${esc(h.words)}&rdquo;` : "")}
            ${metaRow("Seat", seatLoc ? `<a class="wk-link" href="#loc=${seatLoc.id}">${esc(h.seat)}</a>` : esc(h.seat || ""))}
            ${metaRow("Region", esc(region ? region.name : h.region))}
            ${metaRow("Overlord", h.liege ? esc(h.liege) : "")}
          </div>
        </div>
        <div class="wk-body">
          <h1>${esc(h.name)}</h1>
          <p class="wk-lead">${linkify(h.blurb || "")}</p>
          ${paraBlock("The fuller tale", h.paras || ex.paras)}
          ${sectionBlock(ex.sections)}
          ${paraBlock("The page and the screen", ex.vs)}
        </div>
      </div>`;
  }

  function renderHouse(id) {
    const h = houseById[id];
    if (!h) { if (extraHouseById[id]) { renderExtraHouse(id); return; } renderGroup(id); return; }
    const grp = groupsFlat.find((x) => x.kind === "great" && x.g.id === id);
    const members = grp ? grp.g.members.map((m) => (typeof m === "string" ? m : m.n)) : [];
    const seat = locById[h.seat];
    out.innerHTML = crumbs([{ label: "Houses & Orders", href: "#cat=houses" }, { label: h.name }]) +
      imgFrame("wk-banner", "A banner will hang here", "house:" + h.id) + `
      <div class="wk-article">
        <div class="wk-side">
          ${sigilHTML(h.id, "big")}
          <div class="wk-meta">
            ${metaRow("Words", `&ldquo;${esc(h.words)}&rdquo;`)}
            ${metaRow("Seat", seat ? `<a class="wk-link" href="#loc=${seat.id}">${esc(seat.name)}</a>` : esc(h.seat))}
            ${metaRow("Region", esc((regionById[h.region] || {}).name || h.region))}
            ${metaRow("Sigil", esc(h.sigil || ""))}
          </div>
          <a class="wk-mapbtn" href="${CFG.mapHref}#house=${h.id}">&#128205; See their lands on the map</a>
        </div>
        <div class="wk-body">
          <h1>${esc(h.name)}</h1>
          <p class="wk-lead">${linkify(h.description || "")}</p>
          ${paraBlock("The fuller tale", extraFor("house:" + h.id).paras)}
          ${sectionBlock(extraFor("house:" + h.id).sections)}
          ${paraBlock("The page and the screen", extraFor("house:" + h.id).vs)}
          ${members.length ? `<h3 class="wk-h3">The family & its people</h3><div class="wk-grid">` +
            members.map((n) => CHARACTERS[n]
              ? `<a class="wk-card" href="#char=${encodeURIComponent(n)}">${faceHTML(n)}<span>${esc(n)}</span></a>`
              : `<span class="wk-card wk-card-plain">${faceHTML(n)}<span>${esc(n)}</span></span>`).join("") + `</div>` : ""}
        </div>
      </div>`;
  }

  function renderGroup(id) {
    const x = groupsFlat.find((g) => g.g.id === id);
    if (!x) { out.innerHTML = crumbs([{ label: id }]) + `<p class="wk-missing">No banner by that name.</p>`; return; }
    const g = x.g;
    const members = g.members.map((m) => (typeof m === "string" ? m : m.n));
    out.innerHTML = crumbs([{ label: "Houses & Orders", href: "#cat=houses" }, { label: g.name }]) +
      imgFrame("wk-banner", "A banner will hang here", "group:" + g.id) + `
      <div class="wk-article">
        <div class="wk-side">
          <span class="wk-face wk-face-big wk-face-blank">${esc((g.emblem && g.emblem.glyph) || "•")}</span>
          <div class="wk-meta">
            ${metaRow("Words", g.words ? `&ldquo;${esc(g.words)}&rdquo;` : "")}
            ${metaRow("Seat", g.seat && locById[g.seat] ? `<a class="wk-link" href="#loc=${g.seat}">${esc(locById[g.seat].name)}</a>` : "")}
          </div>
        </div>
        <div class="wk-body">
          <h1>${esc(g.name)}</h1>
          <p class="wk-lead">${linkify(g.blurb || "")}</p>
          ${paraBlock("The fuller tale", extraFor("group:" + g.id).paras)}
          ${sectionBlock(extraFor("group:" + g.id).sections)}
          ${paraBlock("The page and the screen", extraFor("group:" + g.id).vs)}
          ${members.length ? `<h3 class="wk-h3">Its members</h3><div class="wk-grid">` +
            members.map((n) => CHARACTERS[n]
              ? `<a class="wk-card" href="#char=${encodeURIComponent(n)}">${faceHTML(n)}<span>${esc(n)}</span></a>`
              : `<span class="wk-card wk-card-plain">${faceHTML(n)}<span>${esc(n)}</span></span>`).join("") + `</div>` : ""}
        </div>
      </div>`;
  }

  function renderLoc(id) {
    const l = locById[id];
    if (!l) { out.innerHTML = crumbs([{ label: id }]) + `<p class="wk-missing">No such place on the maesters' maps.</p>`; return; }
    const holder = l.house ? houseById[l.house] : null;

    /* souls the chronicle places here at some point — both tellings' ledgers, deduped */
    let souls = "";
    {
      const seenObj = new Set();
      const here = [];
      const visits = (ledger) => {
        if (typeof ledger === "undefined" || !ledger) return;
        Object.keys(ledger).forEach((n) => {
          const c = CHARACTERS[n];
          if (!c || seenObj.has(c)) return;
          if (ledger[n].some((s) => s[2] === id)) { seenObj.add(c); here.push(n); }
        });
      };
      visits(typeof WHEREABOUTS !== "undefined" ? WHEREABOUTS : null);
      visits(typeof WHEREABOUTS_BOOK !== "undefined" ? WHEREABOUTS_BOOK : null);
      if (here.length) souls = `<h3 class="wk-h3">Souls the story brings here</h3><div class="wk-grid">` +
        here.slice(0, 36).map((n) => `<a class="wk-card" href="#char=${encodeURIComponent(n)}">${faceHTML(n)}<span>${esc(n)}</span></a>`).join("") + `</div>`;
    }
    /* born here */
    const bornHere = Object.keys(CHARACTERS).filter((n) => (CHARACTERS[n].born || "") === l.name).slice(0, 12);
    const natives = bornHere.length
      ? `<h3 class="wk-h3">Born here</h3><div class="wk-grid">` +
        bornHere.map((n) => `<a class="wk-card" href="#char=${encodeURIComponent(n)}">${faceHTML(n)}<span>${esc(n)}</span></a>`).join("") + `</div>` : "";
    /* deaths at this place — both tellings, folded; the fold is always there, so its
       presence never betrays whether this ground has taken anyone */
    let fallen = "";
    {
      const seenObj = new Set();
      const dead = [];
      Object.keys(CHARACTERS).forEach((n) => {
        const c = CHARACTERS[n];
        if (seenObj.has(c)) return;
        const showHere = typeof deathSiteFor === "function" && deathSiteFor(n) === id;
        const bookHere = typeof deathSiteForBook === "function" && deathSiteForBook(n) === id;
        if (showHere || bookHere) { seenObj.add(c); dead.push({ n, showHere, bookHere }); }
      });
      const inner = dead.length
        ? `<ul class="wk-list">` + dead.map(({ n, showHere, bookHere }) => {
            const c = CHARACTERS[n];
            const how = showHere && c.death && c.death.how ? c.death.how
              : (bookHere && c.bookDeath && c.bookDeath.how ? c.bookDeath.how + " (the books' telling)" : "");
            return `<li>${charLink(n)}${how ? " — " + esc(how) : ""}</li>`;
          }).join("") + `</ul>`
        : `<p>No death the chronicle records has come to this ground — or none the maesters have set down.</p>`;
      fallen = `<details class="wk-spoiler"><summary>The fallen of this place — if any, they are named here. Spoilers.</summary><div>${inner}</div></details>`;
    }

    /* the archive: hand-written long-form paragraphs, where they exist */
    const lx = extraFor("loc:" + id);
    /* the fuller tale, with its own headings where somebody has cut it into
       them, and then how the two tellings differ if that is written */
    const lArchive = paraBlock("The fuller tale", lx.paras) + sectionBlock(lx.sections) +
                     paraBlock("The page and the screen", lx.vs);

    /* the chronicle here: every event line & chapter that names this place */
    const chron = [];
    ALL_SEASONS.forEach((s) => s.episodes.forEach((ep) => {
      if (chron.length >= 10) return;
      (ep.events || []).forEach((ev) => {
        if (chron.length < 10 && ev.indexOf(l.name) >= 0)
          chron.push(`<li>${linkify(ev)} <a class="wk-link" href="#episode=${s.n}-${ep.n}">(S${s.n}·E${ep.n})</a></li>`);
      });
    }));
    BOOKS.forEach((b) => (b.chs || []).forEach((ch, i) => {
      if (chron.length >= 14) return;
      if ((ch[1] || "").indexOf(l.name) >= 0)
        chron.push(`<li>${linkify(ch[1])} <a class="wk-link" href="#chapter=${b.n}-${i + 1}">(${esc(b.short)} ${i + 1})</a></li>`);
    }));
    const chronicle = chron.length
      ? `<h3 class="wk-h3">The chronicle here</h3><ul class="wk-list">${chron.join("")}</ul>` : "";

    out.innerHTML = crumbs([{ label: "Places", href: "#cat=places" }, { label: l.name }]) +
      imgFrame("wk-banner", "A view of this place will hang here", "loc:" + id) + `
      <div class="wk-article">
        <div class="wk-side">
          ${holder ? sigilHTML(holder.id, "big") : `<span class="wk-face wk-face-big wk-face-blank">${esc(l.name[0])}</span>`}
          <div class="wk-meta">
            ${metaRow("Type", esc(l.type[0].toUpperCase() + l.type.slice(1)))}
            ${metaRow("Region", esc((regionById[l.region] || {}).name || l.region))}
            ${metaRow("Held by", holder ? `<a class="wk-link" href="#house=${holder.id}">${esc(holder.name)}</a>` : (l.minorArms ? esc(l.minorArms.house) : ""))}
          </div>
          <a class="wk-mapbtn" href="${CFG.mapHref}#loc=${l.id}">&#128205; Travel there on the map</a>
        </div>
        <div class="wk-body">
          <h1>${esc(l.name)}</h1>
          <div class="wk-badges"><span class="wk-badge wk-badge-flat">${esc(l.subtitle)}</span></div>
          <p class="wk-lead">${linkify(l.description || "")}</p>
          ${lArchive}
          <!-- "In the first season" used to sit here. Retired Aug 2026: it was one
               paragraph about season one on a page whose whole lower half is the
               chronicle of everything that ever happened here. l.lore is still in
               js/data.js and still used by the interactive map's location card. -->
          ${chronicle}
          ${natives}
          ${souls}
          ${fallen}
        </div>
      </div>`;
  }

  function renderEpisode(sN, eN) {
    const season = ALL_SEASONS.find((s) => s.n === sN);
    const ep = season && season.episodes[eN - 1];
    if (!ep) { out.innerHTML = crumbs([{ label: "Episodes", href: "#cat=episodes" }]) + `<p class="wk-missing">No such episode.</p>`; return; }
    const prev = eN > 1 ? `#episode=${sN}-${eN - 1}` : null;
    const next = eN < season.episodes.length ? `#episode=${sN}-${eN + 1}` : null;
    out.innerHTML = crumbs([{ label: "Episodes", href: "#cat=episodes" }, { label: `S${sN}·E${eN}` }]) +
      imgFrame("wk-banner", "A still from this hour will hang here", "episode:" + sN + "-" + eN) + `
      <div class="wk-body wk-wide">
        <h1>S${sN}·E${eN} — ${esc(ep.title)}</h1>
        <div class="wk-badges"><span class="wk-badge wk-badge-flat">${esc(ep.throne.king)} holds the throne</span>
          <span class="wk-badge wk-badge-flat">Hand: ${esc(ep.throne.hand)}</span></div>
        ${paraBlock("The hour retold", extraFor("episode:" + sN + "-" + eN).paras)}
        <h3 class="wk-h3">What happens</h3>
        <ul class="wk-list">${ep.events.map((e) => `<li>${linkify(e)}</li>`).join("")}</ul>
        ${ep.people && ep.people.length ? `<h3 class="wk-h3">The people of the episode</h3><div class="wk-rows">` +
          ep.people.map((p) => `<span class="wk-row wk-row-plain">${faceHTML(p.name)}<span>${charLink(p.name)}<i class="wk-note"> — ${esc(p.note || "")}</i></span></span>`).join("") + `</div>` : ""}
        ${ep.deaths && ep.deaths.length ? `<details class="wk-spoiler"><summary>The fallen — spoilers</summary><ul class="wk-list">` +
          ep.deaths.map((d) => `<li><b>${esc(d.name)}</b> — ${linkify(d.note || "")}</li>`).join("") + `</ul></details>` : ""}
        <div class="wk-pager">
          ${prev ? `<a href="${prev}">&larr; Previous episode</a>` : "<span></span>"}
          <a href="${CFG.mapHref}#season=${sN}&episode=${eN}">&#128506; See it on the map</a>
          ${next ? `<a href="${next}">Next episode &rarr;</a>` : "<span></span>"}
        </div>
      </div>`;
  }

  function renderChapter(bN, chN) {
    const book = BOOKS.find((b) => b.n === bN);
    const ch = book && book.chs[chN - 1];
    if (!ch) { out.innerHTML = crumbs([{ label: "Chapters", href: "#cat=chapters" }]) + `<p class="wk-missing">No such chapter.</p>`; return; }
    const beat = book.beats ? (book.beats.find((b) => chN >= b.from && chN <= b.to) || null) : null;
    const prev = chN > 1 ? `#chapter=${bN}-${chN - 1}` : null;
    const next = chN < book.chapters ? `#chapter=${bN}-${chN + 1}` : null;
    out.innerHTML = crumbs([{ label: "Chapters", href: "#cat=chapters" }, { label: `${book.short} · ${chN}` }]) +
      imgFrame("wk-banner", "An illustration will hang here", "chapter:" + bN + "-" + chN) + `
      <div class="wk-body wk-wide">
        <h1>${esc(book.name)} — ${esc(ch[0])}</h1>
        <p class="wk-lead">${linkify(ch[1] || "")}</p>
        ${paraBlock("The chapter retold", extraFor("chapter:" + bN + "-" + chN).paras)}
        ${beat ? `<h3 class="wk-h3">This movement: ${esc(beat.title)}</h3>
          <ul class="wk-list">${beat.events.map((e) => `<li>${linkify(e)}</li>`).join("")}</ul>` : ""}
        ${ch[2] && ch[2].length ? `<details class="wk-spoiler"><summary>The fallen — spoilers</summary><ul class="wk-list">` +
          ch[2].map((d) => `<li><b>${esc(d[0])}</b> — ${linkify(d[1] || "")}</li>`).join("") + `</ul></details>` : ""}
        <div class="wk-pager">
          ${prev ? `<a href="${prev}">&larr; Previous chapter</a>` : "<span></span>"}
          <a href="${CFG.mapHref}#book=${bN}&chapter=${chN}">&#128506; See it on the map</a>
          ${next ? `<a href="${next}">Next chapter &rarr;</a>` : "<span></span>"}
        </div>
      </div>`;
  }

  /* ---- the ages of the world: a long-form history per era of the timeline ---- */
  function renderEra(id) {
    const e = ERAS_DATA && ERAS_DATA[id];
    if (!e) { out.innerHTML = crumbs([{ label: "The Ages of the Realm", href: "#cat=ages" }]) + `<p class="wk-missing">No such age is written here.</p>`; return; }
    const i = ERAS_ORDER.indexOf(id);
    const prev = i > 0 ? ERAS_ORDER[i - 1] : null;
    const next = i >= 0 && i < ERAS_ORDER.length - 1 ? ERAS_ORDER[i + 1] : null;
    const secs = (e.sections || []).map((s) =>
      `<h3 class="wk-h3">${esc(s.h)}</h3>` + (s.paras || []).map((p) => `<p class="wk-para">${linkify(p)}</p>`).join("")
    ).join("");
    out.innerHTML = crumbs([{ label: "The Ages of the Realm", href: "#cat=ages" }, { label: e.title }]) +
      imgFrame("wk-banner", "An illustration will hang here", "era:" + id) + `
      <div class="wk-body wk-wide">
        <div class="wk-badges"><span class="wk-badge wk-badge-flat">${esc(e.when || "")}</span></div>
        <h1>${esc(e.title)}</h1>
        <p class="wk-lead">${linkify(e.lead || "")}</p>
        ${secs}
        <div class="wk-pager">
          ${prev ? `<a href="#era=${prev}">&larr; ${esc(ERAS_DATA[prev].title)}</a>` : "<span></span>"}
          <a href="timeline.html">&#8987; Walk it on the timeline</a>
          ${next ? `<a href="#era=${next}">${esc(ERAS_DATA[next].title)} &rarr;</a>` : "<span></span>"}
        </div>
      </div>`;
  }

  // ================= router =================
  /* `hash` is optional and is ONLY passed by the prerender generator, which
     needs to render a thousand routes in a loop without touching the URL a
     thousand times. Chrome throttles rapid location changes and starts silently
     ignoring them after about a hundred, which used to leave every page after
     that point rendering whatever route was last accepted — that is why the
     generated p/ tree had one character's article written into a hundred and
     fifty different place files. Nothing else may pass an argument: the
     hashchange and kw-shield listeners below are wrapped for that reason,
     because both would otherwise hand this an Event object. */
  function route(hash) {
    const raw = hash != null ? String(hash) : window.location.hash;
    const h = new URLSearchParams(raw.replace(/^#/, ""));
    window.scrollTo(0, 0);
    if (h.get("char")) return renderChar(h.get("char"));
    if (h.get("house")) return renderHouse(h.get("house"));
    if (h.get("group")) return renderGroup(h.get("group"));
    if (h.get("loc")) return renderLoc(h.get("loc"));
    if (h.get("episode")) { const [s, e] = h.get("episode").split("-").map(Number); return renderEpisode(s, e); }
    if (h.get("chapter")) { const [b, c] = h.get("chapter").split("-").map(Number); return renderChapter(b, c); }
    for (let n = 0; n < COLS.length; n++) {
      const c = COLS[n], v = h.get(c.route);
      if (v) { const rec = colItem[c.route + ":" + v]; if (rec) return renderColItem(rec.c, rec.it); }
    }
    if (h.get("era")) return renderEra(h.get("era"));
    if (h.get("cat")) return renderCat(h.get("cat"));
    renderHome();
  }
  /* a "random page" button, injected into the topbar so all three wikis get it
     without editing their HTML — jumps to any character, house, place, episode,
     chapter or collection entry in this wiki's index */
  function initRandom() {
    const tr = document.querySelector(".topbar-right");
    if (!tr || !INDEX.length) return;
    const btn = document.createElement("button");
    btn.className = "wk-random-btn"; btn.type = "button";
    btn.title = "Open a random page"; btn.setAttribute("aria-label", "Open a random page");
    btn.innerHTML = "&#127922; <span>Random</span>";
    btn.addEventListener("click", () => {
      const e = INDEX[Math.floor(Math.random() * INDEX.length)];
      if (!e) return;
      if (location.hash === e.href) route(); else location.hash = e.href;
      window.scrollTo(0, 0);
    });
    tr.insertBefore(btn, tr.firstChild);
  }

  /* ---- prerender hook ----
     Exposes the two things a static-site generator needs: the full list of every
     route this wiki can show (derived live from the data, so new content is picked
     up automatically), and a way to render any one route to finished HTML. The
     generator (js/prerender-driver.js, active only under ?prerender=1) drives this
     entirely client-side, so re-running it after adding pages needs no rebuild of
     the enumerator — it just reads whatever the data files now hold. */
  window.KW_PRERENDER = {
    routes: function () {
      const rs = [""];                                  /* the home page */
      INDEX.forEach((e) => rs.push(e.href));            /* chars, houses, orders, places, episodes, collection items */
      if (typeof BOOKS !== "undefined") BOOKS.forEach((b) => {   /* every chapter */
        for (let c = 1; c <= (b.chapters || 0); c++) rs.push("#chapter=" + b.n + "-" + c);
      });
      if (typeof ERAS_ORDER !== "undefined") ERAS_ORDER.forEach((id) => rs.push("#era=" + id));  /* the ages */
      ["characters", "houses", "places", "episodes", "chapters", "ages"].forEach((c) => rs.push("#cat=" + c));
      COLS.forEach((c) => rs.push("#cat=" + c.route));  /* each collection's index */
      return rs;
    },
    render: function (href) {
      /* render straight from the string — see the note on route(). Assigning
         window.location.hash here is what broke the whole generated tree. */
      route(href || "");
      const h1 = out.querySelector("h1");
      const lead = out.querySelector("p");
      return {
        href: href || "",
        html: out.innerHTML,
        title: h1 ? h1.textContent.trim() : "",
        desc: lead ? lead.textContent.trim() : "",
      };
    },
  };

  /* wrapped, not passed directly: an Event handed to route() would be read as
     a hash string */
  window.addEventListener("hashchange", function () { route(); });
  /* The shield can be moved without leaving the page — its dialog rides the
     realm bar everywhere — so redraw when it moves. js/shield.js announces
     every change on this event. The page also redraws once the module itself
     arrives, for the case where some other page loaded the engine before it. */
  window.addEventListener("kw-shield", function () { route(); });
  if (!window.KWShield) {
    const waiting = setInterval(() => {
      if (!window.KWShield) return;
      clearInterval(waiting);
      route();
    }, 120);
    setTimeout(() => clearInterval(waiting), 8000);
  }
  initSearch();
  initRandom();
  route();
})();
