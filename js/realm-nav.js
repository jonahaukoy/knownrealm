/* THE KNOWN REALM — global navigation.
   One include on every page (LAST script tag, so it can safely retire the old
   switcher after each app has initialized):
     <script src="<root>js/realm-nav.js" data-root="../"></script>
   data-root = relative path from the page to the site root ("" at root).

   Renders a slim "realm bar" above the page's own top bar: a Home link plus a
   dropdown per franchise (Map · Wiki · Family Tree · Quiz), and standalone
   links. On the home page (which has #home-nav) it fills that nav instead.
   It also removes the old site-switcher dropdown + SWITCH pill wherever found. */

(function () {
  const script = document.currentScript;
  const root = (script && script.dataset.root) || "";

  /* favicon (the weirwood medallion) — set once here so every page that loads
     the realm bar gets it, without editing each page's <head>. root makes the
     path resolve at any folder depth. */
  (function () {
    const head = document.head || document.getElementsByTagName("head")[0];
    if (head && !head.querySelector('link[rel="icon"]')) {
      head.insertAdjacentHTML("beforeend",
        '<link rel="icon" type="image/png" sizes="32x32" href="' + root + 'assets/favicon-32.png">' +
        '<link rel="icon" type="image/png" sizes="512x512" href="' + root + 'assets/favicon-512.png">' +
        '<link rel="apple-touch-icon" href="' + root + 'assets/favicon-180.png">');
    }
  })();

  const GROUPS = [
    { id: "got", label: "Game of Thrones", items: [
      ["&#128214;", "Wiki", root + "wiki.html"],
      ["&#128506;", "Interactive Map", root + "map.html"],
      ["&#127794;", "Family Trees", root + "trees/index.html"],
      ["&#127922;", "Games &amp; Trivia", root + "trivia/index.html#cat=got"],
      ["&#128737;", "The White Book", root + "whitebook.html"],
    ] },
    { id: "hotd", label: "House of the Dragon", items: [
      ["&#128214;", "Wiki", root + "hotd/wiki.html"],
      ["&#128506;", "Interactive Map", root + "hotd/index.html"],
      ["&#127794;", "Family Tree", root + "trees/index.html"],
      ["&#127922;", "Games &amp; Trivia", root + "trivia/index.html#cat=hotd"],
    ] },
    { id: "knight", label: "A Knight of the Seven Kingdoms", items: [
      ["&#128214;", "Wiki", root + "knight/wiki.html"],
      ["&#128506;", "Interactive Map", root + "knight/index.html"],
      ["&#127922;", "Games &amp; Trivia", root + "trivia/index.html#cat=knight"],
    ] },
  ];
  const SINGLES = [
    ["Family Trees", root + "trees/index.html"],
    ["Games &amp; Trivia", root + "trivia/index.html"],
    ["Timeline", root + "timeline.html"],
    ["Gallery", root + "gallery.html"],
    ["Credits", root + "credits.html"],
  ];

  /* A real magnifying glass, drawn rather than typed. The old &#9906; is U+26B2
     NEUTER — it only resembles a magnifier, stands bolt upright, and is drawn
     differently by every platform's font. An inline SVG is identical everywhere
     and tilts the way a lens actually hangs. */
  const magnifierSVG = (cls) =>
    `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true" focusable="false" ` +
    `fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round">` +
    `<circle cx="10.2" cy="10.2" r="6.3"/><line x1="15.1" y1="15.1" x2="20.6" y2="20.6"/></svg>`;

  /* the right-hand controls that ride the bar on every page */
  const controlsHTML = () =>
    `<span class="realm-spacer"></span>` +
    `<button class="realm-search-btn" type="button" id="gs-open" title="Search the realm (press /)">` +
      `${magnifierSVG("realm-search-icon")}<span class="realm-search-label">Search</span><kbd>/</kbd></button>` +
    `<button class="realm-shield-btn" type="button" id="kw-shield-open" title="Spoiler shield — how far you have come">` +
      `<span class="realm-shield-icon">&#128737;</span><span class="realm-shield-label">Shield</span></button>` +
    `<button class="realm-theme-btn" type="button" id="kw-theme" title="Switch between day and night"></button>`;

  function groupHTML(g) {
    return `<div class="realm-group">
      <button class="realm-group-btn" type="button">${g.label} <span class="realm-caret">&#9662;</span></button>
      <div class="realm-menu">
        ${g.items.map(([icon, label, href]) => `<a href="${href}"><span class="realm-menu-icon">${icon}</span><span>${label}</span></a>`).join("")}
      </div>
    </div>`;
  }

  const homeNav = document.getElementById("home-nav");
  if (homeNav) {
    /* the home page: fill its own nav slot with the franchise dropdowns */
    homeNav.classList.add("realm-inline");
    /* Same collapsible structure the realm bar uses on every other page: the
       links live in a .realm-collapse that is display:contents on desktop and
       folds behind a hamburger on phones. Without this the home page was the
       one page whose nav had nowhere to go on a narrow screen. */
    homeNav.innerHTML =
      `<div class="realm-collapse" id="home-collapse">` +
        GROUPS.map(groupHTML).join("") +
        `<a class="realm-single" href="${root}trees/index.html">Family Trees</a>` +
        `<a class="realm-single" href="${root}trivia/index.html">Games &amp; Trivia</a>` +
        `<a class="realm-single" href="${root}timeline.html">Timeline</a>` +
        `<a class="realm-single" href="${root}gallery.html">Gallery</a>` +
        `<a class="realm-single" href="${root}credits.html">Credits</a>` +
      `</div>` +
      `<button class="realm-burger" type="button" id="home-burger" aria-label="Menu" aria-expanded="false" aria-controls="home-collapse">&#9776;</button>`;
    /* the home bar is already crowded — the controls ride on its right-hand side,
       beside the page's own search field, rather than wrapping the nav into the hero */
    const right = document.querySelector(".home-topbar .topbar-right") || document.querySelector(".topbar-right");
    if (right) right.insertAdjacentHTML("afterbegin", controlsHTML());

    const hBurger = document.getElementById("home-burger");
    if (hBurger) hBurger.addEventListener("click", (e) => {
      e.stopPropagation();
      const open = homeNav.classList.toggle("open");
      hBurger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    homeNav.querySelectorAll(".realm-collapse a").forEach((a) =>
      a.addEventListener("click", () => homeNav.classList.remove("open")));
    document.addEventListener("click", (e) => {
      if (!homeNav.contains(e.target)) {
        homeNav.classList.remove("open");
        if (hBurger) hBurger.setAttribute("aria-expanded", "false");
      }
    });
  } else {
    /* every other page: a slim bar above the page's own top bar */
    const bar = document.createElement("nav");
    bar.className = "realm-bar";
    /* the groups + singles live in a collapsible wrapper: laid out inline on
       desktop (display:contents), folded behind a hamburger on phones */
    bar.innerHTML =
      `<a class="realm-home" href="${root}index.html">&#8962; The Known Realm</a>` +
      `<div class="realm-collapse" id="realm-collapse">` +
        GROUPS.map(groupHTML).join("") +
        SINGLES.map(([label, href]) => `<a class="realm-single" href="${href}">${label}</a>`).join("") +
      `</div>` +
      controlsHTML() +
      `<button class="realm-burger" type="button" id="realm-burger" aria-label="Menu" aria-expanded="false" aria-controls="realm-collapse">&#9776;</button>`;
    document.body.insertBefore(bar, document.body.firstChild);

    /* hamburger: fold/unfold the nav on phones */
    const burger = document.getElementById("realm-burger");
    if (burger) burger.addEventListener("click", (e) => {
      e.stopPropagation();
      const open = bar.classList.toggle("open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    /* tapping a link, or anywhere outside, closes the folded menu */
    bar.querySelectorAll(".realm-collapse a").forEach((a) =>
      a.addEventListener("click", () => bar.classList.remove("open")));
    document.addEventListener("click", (e) => {
      if (!bar.contains(e.target)) { bar.classList.remove("open"); if (burger) burger.setAttribute("aria-expanded", "false"); }
    });

    /* retire the old switcher dropdown + SWITCH pill: the realm bar replaces it */
    document.querySelectorAll(".site-dropdown, .site-caret").forEach((el) => el.remove());
    const brand = document.getElementById("site-switcher-btn");
    if (brand) brand.classList.add("brand-static");
  }

  /* Release the CSS space we reserved for the bar (see style.css) in the SAME
     synchronous tick the bar was inserted, so the browser reflows once from
     "reserved gap" straight to "bar" — the page never jumps. */
  document.body.classList.add("realm-ready");

  /* dropdowns: open on hover (desktop) or tap (touch) */
  document.querySelectorAll(".realm-group").forEach((g) => {
    const btn = g.querySelector(".realm-group-btn");
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const open = g.classList.contains("open");
      document.querySelectorAll(".realm-group.open").forEach((x) => x.classList.remove("open"));
      g.classList.toggle("open", !open);
    });
  });
  document.addEventListener("click", () => {
    document.querySelectorAll(".realm-group.open").forEach((x) => x.classList.remove("open"));
  });

  /* ================= day / night =================
     The realm is dark by default — that is its face. A reader who prefers
     parchment can say so, and we remember it. (A tiny script in each page's
     <head> applies the stored choice before first paint, so there is no flash.) */
  const THEME_KEY = "kwTheme";
  const themeBtn = document.getElementById("kw-theme");
  function paintThemeBtn() {
    if (!themeBtn) return;
    const light = document.documentElement.getAttribute("data-theme") === "light";
    themeBtn.innerHTML = light ? "&#9788;" : "&#9789;";
    themeBtn.setAttribute("aria-label", light ? "Switch to night" : "Switch to day");
  }
  paintThemeBtn();
  if (themeBtn) {
    themeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const light = document.documentElement.getAttribute("data-theme") === "light";
      document.documentElement.setAttribute("data-theme", light ? "dark" : "light");
      try { localStorage.setItem(THEME_KEY, light ? "dark" : "light"); } catch (err) {}
      paintThemeBtn();
    });
  }

  /* ================= the global search =================
     One box for the whole realm: people, places, houses, orders, episodes,
     chapters and pages, across all three sagas. The index (js/search-index.js)
     is fetched only the first time the search is opened, so it costs nothing
     until it is wanted. Open with "/" or Ctrl/Cmd-K. */
  const SAGA_LABEL = { "": "Game of Thrones", H: "House of the Dragon", K: "Knight of the Seven Kingdoms" };
  const SAGA_SHORT = { "": "GoT", H: "HotD", K: "Dunk & Egg" };
  const KIND_WEIGHT = { Page: 0, Person: 0, House: 0, Place: 0, Order: 1, Episode: 2, Chapter: 3 };

  const overlay = document.createElement("div");
  overlay.className = "gs-overlay";
  overlay.innerHTML =
    `<div class="gs-panel" role="dialog" aria-modal="true" aria-label="Search the realm">
       <div class="gs-inputwrap">
         <span class="gs-icon">${magnifierSVG("gs-icon-svg")}</span>
         <input id="gs-input" type="text" autocomplete="off" spellcheck="false"
                placeholder="Seek a soul, a castle, a banner, an episode, a chapter&hellip;" />
         <button class="gs-close" id="gs-close" type="button" aria-label="Close">&times;</button>
       </div>
       <div class="gs-filters" id="gs-filters">
         <button class="gs-chip sel" type="button" data-saga="*">All the realm</button>
         <button class="gs-chip" type="button" data-saga="">Game of Thrones</button>
         <button class="gs-chip" type="button" data-saga="H">House of the Dragon</button>
         <button class="gs-chip" type="button" data-saga="K">Dunk &amp; Egg</button>
       </div>
       <div class="gs-results" id="gs-results"></div>
       <div class="gs-foot"><span class="gs-count" id="gs-count"></span></div>
     </div>`;
  document.body.appendChild(overlay);

  /* ================= the spoiler shield, everywhere =================
     One dialog for all three sagas, reachable from the bar on every page.
     It writes the single shared record (js/shield.js), so a place set here is
     the place the games, the trees, the chronicle and the words of the day all
     read. Each saga carries both tellings and they are independent — a reader
     may have watched all of Game of Thrones and read none of it.

     The module is loaded on demand: most pages have no need of it until the
     button is pressed, and several pages already load it themselves. */
  const SHIELD_SAGAS = [
    { name: "Game of Thrones", s: "gotS", b: "gotB", sMax: 8, bMax: 5,
      books: ["", "A Game of Thrones", "A Clash of Kings", "A Storm of Swords", "A Feast for Crows", "A Dance with Dragons"] },
    { name: "House of the Dragon", s: "hotdS", b: "hotdB", sMax: 2, bMax: 1,
      books: ["", "Fire &amp; Blood"] },
    { name: "A Knight of the Seven Kingdoms", s: "knightS", b: "knightB", sMax: 1, bMax: 3,
      books: ["", "The Hedge Knight", "The Sworn Sword", "The Mystery Knight"] }
  ];

  let shieldEl = null;

  /* Fetched as soon as the bar is built rather than on the first press. It is
     a couple of kilobytes, several pages load it themselves anyway, and doing
     it lazily meant the very first tap on the Shield button did nothing at all
     while the script was still in flight. */
  (function preloadShield() {
    if (window.KWShield || document.querySelector('script[data-kw-shield]')) return;
    const s = document.createElement("script");
    s.src = root + "js/shield.js";
    s.setAttribute("data-kw-shield", "1");
    document.head.appendChild(s);
  })();

  function ensureShieldModule(then) {
    if (window.KWShield) { then(); return; }
    const tag = document.querySelector('script[data-kw-shield]');
    if (tag) { tag.addEventListener("load", then, { once: true }); return; }
    const s = document.createElement("script");
    s.src = root + "js/shield.js";
    s.setAttribute("data-kw-shield", "1");
    s.onload = then;
    s.onerror = () => {};
    document.head.appendChild(s);
  }

  function shieldRowHTML(sg) {
    const st = window.KWShield.get();
    const showChips = [];
    for (let i = 1; i <= sg.sMax; i++) {
      showChips.push(`<button type="button" class="kws-chip${st[sg.s] === i ? " sel" : ""}" data-k="${sg.s}" data-n="${i}">S${i}</button>`);
    }
    const bookChips = [];
    for (let i = 1; i <= sg.bMax; i++) {
      const label = sg.bMax === 1 ? "Read it" : (sg.books[i] || ("Book " + i));
      const short = sg.bMax > 3 ? ["", "AGOT", "ACOK", "ASOS", "AFFC", "ADWD"][i] : label;
      bookChips.push(`<button type="button" class="kws-chip${st[sg.b] === i ? " sel" : ""}" data-k="${sg.b}" data-n="${i}" title="${label}">${short}</button>`);
    }
    return `<div class="kws-saga">
        <div class="kws-saga-name">${sg.name}</div>
        <div class="kws-line"><span class="kws-tag">&#128250; Watched</span><div class="kws-chips">${showChips.join("")}</div></div>
        <div class="kws-line"><span class="kws-tag">&#128214; Read</span><div class="kws-chips">${bookChips.join("")}</div></div>
      </div>`;
  }

  function paintShield() {
    if (!shieldEl) return;
    shieldEl.querySelector("#kws-body").innerHTML = SHIELD_SAGAS.map(shieldRowHTML).join("");
  }

  function buildShield() {
    shieldEl = document.createElement("div");
    shieldEl.className = "kws-overlay";
    shieldEl.innerHTML =
      `<div class="kws-panel" role="dialog" aria-modal="true" aria-label="Spoiler shield">
         <button class="kws-close" id="kws-close" type="button" aria-label="Close">&times;</button>
         <div class="kws-kicker">&#128737; The spoiler shield</div>
         <h2 class="kws-title">How far have you come?</h2>
         <p class="kws-note">Say where you are in each telling and the whole realm will keep its
           counsel — the games, the family trees, the chronicle and the words of the day all hide
           what you have not yet reached. Tap a chosen mark again to unset it. You may change this
           whenever you like.</p>
         <div id="kws-body"></div>
         <div class="kws-actions">
           <button class="kws-all" id="kws-all" type="button">I have finished every tale &mdash; hide nothing</button>
           <button class="kws-none" id="kws-none" type="button">I am at the very beginning</button>
         </div>
       </div>`;
    document.body.appendChild(shieldEl);

    shieldEl.addEventListener("click", (e) => {
      if (e.target === shieldEl) closeShield();
      const chip = e.target.closest && e.target.closest(".kws-chip");
      if (chip) {
        const k = chip.dataset.k, n = parseInt(chip.dataset.n, 10);
        const cur = window.KWShield.get()[k];
        const patch = {}; patch[k] = cur === n ? 0 : n;   /* tap again to unset */
        window.KWShield.set(patch);
        paintShield();
      }
    });
    shieldEl.querySelector("#kws-close").addEventListener("click", closeShield);
    shieldEl.querySelector("#kws-all").addEventListener("click", () => { window.KWShield.setAll(); paintShield(); });
    shieldEl.querySelector("#kws-none").addEventListener("click", () => { window.KWShield.clear(); paintShield(); });
  }

  function openShield() {
    ensureShieldModule(() => {
      if (!shieldEl) buildShield();
      paintShield();
      shieldEl.classList.add("open");
    });
  }
  function closeShield() { if (shieldEl) shieldEl.classList.remove("open"); }

  const shieldBtn = document.getElementById("kw-shield-open");
  if (shieldBtn) shieldBtn.addEventListener("click", (e) => { e.preventDefault(); openShield(); });

  /* Anything on any page can open it — the words of the day link on the home
     page and the "change what you have seen" buttons in the game gates all
     call this rather than growing dialogs of their own. */
  window.KWShieldUI = { open: openShield, close: closeShield };
  document.addEventListener("click", (e) => {
    const t = e.target.closest && e.target.closest("[data-open-shield]");
    if (t) { e.preventDefault(); openShield(); }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && shieldEl && shieldEl.classList.contains("open")) closeShield();
  });

  const gsInput = overlay.querySelector("#gs-input");
  const gsResults = overlay.querySelector("#gs-results");
  const gsCount = overlay.querySelector("#gs-count");
  let gsLoaded = false, gsLoading = false, gsRows = [], gsSel = 0, gsSaga = "*";

  /* the empty state: somewhere to go rather than a sentence telling you to type */
  const SUGGESTIONS = [
    ["&#128214;", "The Wiki", "Every soul, castle and banner", "wiki.html"],
    ["&#128506;", "The Interactive Map", "The realm, episode by episode", "map.html"],
    ["&#8987;", "The Timeline", "Twelve thousand years in one line", "timeline.html"],
    ["&#128737;", "The White Book", "Every knight of the Kingsguard", "whitebook.html"],
    ["&#127922;", "Games &amp; Trivia", "Four games and a spoiler shield", "trivia/index.html"],
    ["&#127794;", "Family Trees", "Eleven houses, root and branch", "trees/index.html"],
  ];
  function suggestHTML() {
    return `<div class="gs-suggest-head">Or begin here</div><div class="gs-suggest">` +
      SUGGESTIONS.map(([g, t, s, h]) => `
        <a class="gs-sug" href="${root + h}">
          <span class="gs-sug-glyph">${g}</span>
          <span class="gs-sug-text"><b>${t}</b><i>${s}</i></span>
        </a>`).join("") + `</div>`;
  }

  overlay.addEventListener("click", (e) => {
    const chip = e.target.closest && e.target.closest(".gs-chip");
    if (!chip) return;
    gsSaga = chip.dataset.saga;
    overlay.querySelectorAll(".gs-chip").forEach((c) => c.classList.toggle("sel", c === chip));
    runSearch();
    gsInput.focus();
  });

  function loadIndex(then) {
    if (gsLoaded) return then();
    if (gsLoading) return;
    gsLoading = true;
    gsResults.innerHTML = `<div class="gs-empty">Summoning the archive&hellip;</div>`;
    const s = document.createElement("script");
    s.src = root + "js/search-index.js";
    s.onload = () => { gsLoaded = true; gsLoading = false; then(); };
    s.onerror = () => { gsLoading = false; gsResults.innerHTML = `<div class="gs-empty">The archive could not be reached.</div>`; };
    document.head.appendChild(s);
  }

  function score(label, q) {
    const i = label.indexOf(q);
    if (i < 0) return -1;
    if (i === 0) return 0;
    const prev = label[i - 1];
    return (prev === " " || prev === "-" || prev === "'" || prev === "(") ? 1 : 4;
  }

  function runSearch() {
    const raw = gsInput.value.trim();
    const q = raw.toLowerCase();
    if (!q) {
      gsRows = [];
      gsResults.innerHTML = suggestHTML();
      gsCount.textContent = "";
      return;
    }
    const idx = window.SEARCH_INDEX || [];
    const hits = [];
    for (let n = 0; n < idx.length; n++) {
      const e = idx[n];
      if (gsSaga !== "*" && e[3] !== gsSaga) continue;
      const s = score(e[0].toLowerCase(), q);
      if (s < 0) continue;
      hits.push({ e, s: s + (KIND_WEIGHT[e[1]] || 0) + Math.min(e[0].length / 60, 1) });
      if (hits.length > 900) break;
    }
    hits.sort((a, b) => a.s - b.s || a.e[0].length - b.e[0].length);
    gsRows = hits.slice(0, 40).map((h) => h.e);
    gsSel = 0;
    if (!gsRows.length) {
      gsResults.innerHTML = `<div class="gs-empty">Nothing in the archive by that name.</div>`;
      gsCount.textContent = "no matches";
      return;
    }
    gsResults.innerHTML = gsRows.map((e, i) => {
      const label = esc(e[0]).replace(new RegExp("(" + q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "i"), "<mark>$1</mark>");
      return `<a class="gs-row${i === 0 ? " sel" : ""}" href="${root + e[2]}" data-i="${i}" title="${esc(SAGA_LABEL[e[3]] || "")}">
        <span class="gs-kind gs-kind-${e[1].toLowerCase().replace(/\s+/g, "-")}">${e[1]}</span>
        <span class="gs-label">${label}</span>
        <span class="gs-saga">${esc(SAGA_SHORT[e[3]] || "")}</span></a>`;
    }).join("");
    gsCount.textContent = hits.length > 40 ? `showing 40 of ${hits.length}` : `${hits.length} match${hits.length === 1 ? "" : "es"}`;
    gsResults.querySelectorAll(".gs-row").forEach((r) => {
      r.addEventListener("mouseenter", () => select(parseInt(r.dataset.i, 10)));
    });
  }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }

  function select(i) {
    const rows = gsResults.querySelectorAll(".gs-row");
    if (!rows.length) return;
    gsSel = Math.max(0, Math.min(i, rows.length - 1));
    rows.forEach((r, n) => r.classList.toggle("sel", n === gsSel));
    const el = rows[gsSel];
    if (el) el.scrollIntoView({ block: "nearest" });
  }

  function openSearch() {
    overlay.classList.add("open");
    document.body.classList.add("gs-locked");
    gsInput.value = "";
    loadIndex(runSearch);
    if (gsLoaded) runSearch();
    setTimeout(() => gsInput.focus(), 30);
  }
  function closeSearch() {
    overlay.classList.remove("open");
    document.body.classList.remove("gs-locked");
  }

  const openBtn = document.getElementById("gs-open");
  if (openBtn) openBtn.addEventListener("click", (e) => { e.stopPropagation(); openSearch(); });
  overlay.querySelector("#gs-close").addEventListener("click", closeSearch);
  overlay.addEventListener("click", (e) => { if (e.target === overlay) closeSearch(); });
  gsInput.addEventListener("input", () => { if (gsLoaded) runSearch(); else loadIndex(runSearch); });
  gsInput.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); select(gsSel + 1); }
    else if (e.key === "ArrowUp") { e.preventDefault(); select(gsSel - 1); }
    else if (e.key === "Enter") {
      const rows = gsResults.querySelectorAll(".gs-row");
      if (rows[gsSel]) { e.preventDefault(); window.location.href = rows[gsSel].getAttribute("href"); }
    } else if (e.key === "Escape") { e.preventDefault(); closeSearch(); }
  });

  /* "/" or Ctrl/Cmd-K from anywhere — unless the reader is already typing */
  document.addEventListener("keydown", (e) => {
    const t = e.target;
    const typing = t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable);
    if (e.key === "Escape" && overlay.classList.contains("open")) { closeSearch(); return; }
    if (typing) return;
    if (e.key === "/" || ((e.ctrlKey || e.metaKey) && (e.key === "k" || e.key === "K"))) {
      e.preventDefault();
      openSearch();
    }
  });

  /* ================= cookie / GDPR consent =================
     The site stores your settings and game progress in your own browser only.
     Ads and analytics (when added) must run behind consent in the EEA/UK. This
     records the choice and exposes it — future ad/analytics loaders should check
     window.KW_CONSENT (and/or listen for the "kw-consent" event) before firing.  */
  const CONSENT_KEY = "kwConsent";
  let consentStored = null;
  try { consentStored = JSON.parse(localStorage.getItem(CONSENT_KEY) || "null"); } catch (err) {}
  let consentBar = null;

  function applyConsent(c) {
    window.KW_CONSENT = c;
    document.documentElement.setAttribute("data-consent", c && c.ads ? "full" : "essential");
    try { document.dispatchEvent(new CustomEvent("kw-consent", { detail: c })); } catch (err) {}
  }
  function closeConsent() {
    if (!consentBar) return;
    consentBar.classList.add("gone");
    const b = consentBar; consentBar = null;
    setTimeout(() => { if (b && b.parentNode) b.parentNode.removeChild(b); }, 320);
  }
  function saveConsent(c) {
    c.v = 1; c.ts = Date.now();
    try { localStorage.setItem(CONSENT_KEY, JSON.stringify(c)); } catch (err) {}
    applyConsent(c); closeConsent();
  }
  function openConsent() {
    if (consentBar) return;
    consentBar = document.createElement("div");
    consentBar.className = "kw-consent";
    consentBar.setAttribute("role", "dialog");
    consentBar.setAttribute("aria-label", "Cookie choices");
    consentBar.innerHTML =
      `<div class="kw-consent-inner">
        <div class="kw-consent-text"><b>A word on cookies.</b> This site keeps your theme, settings and
          game progress in your own browser only &mdash; never sent to us &mdash; and it currently shows
          <b>no ads</b> and runs no analytics. If that ever changes, any advertising or analytics cookies
          will be set <b>only with your consent</b>. You can set your preference now or change it any time.
          <a href="${root}privacy.html">Read the privacy policy</a>.</div>
        <div class="kw-consent-btns">
          <button type="button" class="kw-consent-btn" data-c="essential">Essential only</button>
          <button type="button" class="kw-consent-btn kw-consent-accept" data-c="all">Accept all</button>
        </div>
      </div>`;
    document.body.appendChild(consentBar);
    consentBar.querySelector('[data-c="essential"]').addEventListener("click", () => saveConsent({ ads: false, analytics: false }));
    consentBar.querySelector('[data-c="all"]').addEventListener("click", () => saveConsent({ ads: true, analytics: true }));
  }
  window.KWConsent = {
    open: openConsent,
    get: () => window.KW_CONSENT || consentStored,
    reset: () => { try { localStorage.removeItem(CONSENT_KEY); } catch (err) {} },
  };
  if (consentStored && consentStored.v) applyConsent(consentStored);
  else setTimeout(openConsent, 500);
})();
