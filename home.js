/* THE KNOWN WORLD — home page: the realm's tallies and the daily features.

   Loaded after the map's own data files (WORLD, EPISODES, SEASONS_LATER, BOOKS,
   CHARACTERS, PEOPLE_IMGS) and after js/search-index.js, which is what lets the
   counts below cover all three sagas instead of only Game of Thrones.

   The search box that used to live here is gone: the global palette in
   js/realm-nav.js ("/" or the Search button) reaches everything it did and more. */

(function () {
  const byId = (id) => document.getElementById(id);

  /* The portal cards used to be navigated by this script. They are real links
     now (see .home-portal-link in home.css), so there is nothing to wire up —
     which is also why they are keyboard-focusable and ctrl-clickable at last. */

  /* the hero's "search the whole realm" opens the same palette as "/" */
  const openBtn = byId("home-open-search");
  if (openBtn) {
    openBtn.addEventListener("click", () => {
      const gs = document.getElementById("gs-open");
      if (gs) gs.click();
    });
  }

  /* "surprise me" — jump to any page in the whole realm at random */
  const surpriseBtn = byId("home-surprise");
  if (surpriseBtn) {
    surpriseBtn.addEventListener("click", () => {
      const idx = window.SEARCH_INDEX;
      if (idx && idx.length) {
        window.location.href = idx[Math.floor(Math.random() * idx.length)][2];
      } else {
        window.location.href = "wiki.html";
      }
    });
  }

  // ================= the realm at a glance =================
  /* Counted live from js/search-index.js, which holds every page of all three
     sagas, so these can never drift away from what the site actually contains.
     Labels are deduplicated: Winterfell is one place, not three, even though it
     has a page in each saga's wiki. */

  const IDX = window.SEARCH_INDEX || [];
  const uniq = (kind) => {
    const seen = new Set();
    IDX.forEach((e) => { if (e[1] === kind) seen.add(e[0]); });
    return seen.size;
  };

  const fmt = (n) => n.toLocaleString("en-GB");

  /* The one figure that cannot be counted from the index: the prose itself.
     Recount it with the word-count script when a batch of writing lands —
     it measures words inside the quoted strings of the wiki, collection,
     White Book, timeline, house, trivia, quote and quiz data files. */
  const WORDS_WRITTEN = 494000;

  /* Likewise the artwork: everything in assets/scenes, assets/sigils/new and
     assets/sigils/minor. Recount when the owner adds a batch. */
  const ART_PIECES = 205;

  const episodesAndChapters = uniq("Episode") + uniq("Chapter");

  const setStat = (id, value) => { const el = byId(id); if (el) el.textContent = value; };
  setStat("stat-words", IDX.length ? fmt(WORDS_WRITTEN) : "—");
  setStat("stat-pages", fmt(IDX.length));
  setStat("stat-characters", fmt(uniq("Person")));
  setStat("stat-locations", fmt(uniq("Place")));
  setStat("stat-episodes", fmt(episodesAndChapters));
  setStat("stat-art", fmt(ART_PIECES));

  // ================= soul of the day, and the words they said =================
  /* Two things the owner asked for: the soul of the day must be the person who
     speaks the words of the day, and the pool must run far deeper than a
     shortlist of leads. So the QUOTE is drawn first and the SPEAKER becomes the
     soul — which means the pool is every mouth the chronicle has recorded, some
     ninety-five of them, not thirty.

     The pool is loaded from whosaidit/quotes-got.js, the same file the Who Said
     It game uses, so a line only ever appears in one place on this site.

     Spoilers: the home page has no shield of its own, so with no shield set it
     shows only what is safe in the opening stretch of the story. Set a shield
     anywhere on the site — Trivia, the timeline, Who Said It — and this widens
     to match how far you have actually come. */

  const SHIELD_KEY = "tvShield";
  const shield = (() => {
    try { return JSON.parse(localStorage.getItem(SHIELD_KEY)) || null; } catch (e) { return null; }
  })();
  const seenSeason = shield && typeof shield.gotS === "number" ? shield.gotS : 1;
  const readBook = shield && typeof shield.gotB === "number" ? shield.gotB : 1;

  const ALL_QUOTES = (window.QUOTES && window.QUOTES.got) || [];
  const SAFE = ALL_QUOTES.filter((q) => {
    if (!q.speaker) return false;
    if (typeof q.s === "number" && q.s > seenSeason) return false;
    if (typeof q.b === "number" && q.b > readBook) return false;
    return true;
  });

  /* a stable daily pick: the same soul for everyone, all day, turning at midnight */
  const now = new Date();
  const dayNumber = Math.floor(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 86400000);

  const pick = SAFE.length ? SAFE[dayNumber % SAFE.length] : null;
  const soul = pick ? pick.speaker : null;
  const c = (soul && CHARACTERS[soul]) || {};

  const faceFile = (typeof PEOPLE_IMGS !== "undefined" && soul && PEOPLE_IMGS[soul]) || null;
  const img = faceFile ? "assets/people/" + faceFile : null;
  const initials = soul
    ? soul.replace(/^(Ser|Lord|Lady|King|Queen|Prince|Princess|Maester)\s+/i, "")
        .split(" ").map((w) => w[0]).slice(0, 2).join("")
    : "";

  const esc = (t) => String(t == null ? "" : t)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const body = byId("feature-char-body");
  if (body && soul) {
    const seat = c.born ? `of ${esc(c.born)}` : "";
    body.innerHTML = `
      <div class="home-feature-char">
        <div class="home-feature-face">${img ? `<img src="${img}" alt="${esc(soul)}"/>` : initials}</div>
        <div>
          <div class="home-feature-name">${esc(soul)}</div>
          ${seat ? `<div class="home-feature-seat">${seat}</div>` : ""}
          <div class="home-feature-blurb">${esc(c.blurb || "A soul of the tale.")}</div>
          <div class="home-feature-links">
            <a class="home-feature-link" href="wiki.html#char=${encodeURIComponent(soul)}">Their chronicle &rarr;</a>
            <a class="home-feature-link" href="map.html#char=${encodeURIComponent(soul)}">Find them on the map &rarr;</a>
          </div>
        </div>
      </div>`;
  }

  const quoteEl = byId("feature-quote");
  const byEl = byId("feature-quote-by");
  if (quoteEl && byEl && pick) {
    quoteEl.textContent = pick.q;
    byEl.innerHTML = `&mdash; <a href="wiki.html#char=${encodeURIComponent(soul)}">${esc(soul)}</a>` +
      (pick.context ? `<span class="home-quote-context">${esc(pick.context)}</span>` : "");
  }

  /* an honest nudge: with no shield set, the daily pair stays in the shallows */
  const note = byId("feature-quote-note");
  if (note && !shield) {
    /* opens the site-wide shield dialog rather than sending the reader off to
       the games page to find a gate — realm-nav.js listens for the attribute */
    note.innerHTML = `Only the earliest words are shown. ` +
      `<a href="#" data-open-shield>Tell the maesters how far you have come</a> and this deepens.`;
  }
})();
