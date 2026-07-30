/* THE KNOWN WORLD — application logic
   Top bar: hover dropdowns per mode. Left panel: info & details.
   Map: clickable markers, toggleable house banners, journey playback. */

(function () {
  const byId = (id) => document.getElementById(id);

  const els = {
    siteSwitcher: byId("site-switcher"),
    siteButton: byId("site-switcher-btn"),
    siteTitle: byId("site-title"),
    siteDropdown: byId("site-dropdown"),
    sidebar: byId("sidebar"),
    svg: byId("map-svg"),
    viewport: byId("map-viewport"),
    markerLayer: byId("marker-layer"),
    routeLayer: byId("route-layer"),
    bannerLayer: byId("banner-layer"),
    mapStage: byId("map-stage"),
    modeNav: byId("mode-nav"),
    searchInput: byId("search-input"),
    searchResults: byId("search-results"),
    seasonBadge: byId("season-badge"),
    zoomIn: byId("zoom-in"),
    zoomOut: byId("zoom-out"),
    zoomReset: byId("zoom-reset"),
    player: byId("journey-player"),
    playBtn: byId("play-btn"),
    playerCharacter: byId("player-character"),
    playerJourneySummary: byId("player-journey-summary"),
    scrubber: byId("scrubber"),
    scrubberTicks: byId("scrubber-ticks"),
    playerStopLabel: byId("player-stop-label"),
    wordleScreen: byId("wordle-screen"),
    wordleBoard: byId("wordle-board"),
    wordleForm: byId("wordle-form"),
    wordleInput: byId("wordle-input"),
    wordleMessage: byId("wordle-message"),
    wordleCategories: byId("wordle-categories"),
    wordleCategoryLabel: byId("wordle-category-label"),
    wordleNew: byId("wordle-new"),
    wordleListToggle: byId("wordle-list-toggle"),
    wordleList: byId("wordle-list"),
    wordleListClose: byId("wordle-list-close"),
    wordleListBody: byId("wordle-list-body"),
    wordlePoolCount: byId("wordle-pool-count"),
    wordleGuessesLeft: byId("wordle-guesses-left"),
    wordleLastAnswer: byId("wordle-last-answer"),
    wordleKeyboard: byId("wordle-keyboard"),
  };

  const locById = Object.fromEntries(WORLD.locations.map((l) => [l.id, l]));
  const houseById = Object.fromEntries(WORLD.houses.map((h) => [h.id, h]));
  const regionById = Object.fromEntries(WORLD.regions.map((r) => [r.id, r]));

  const mapView = new MapView(els.svg, els.viewport, els.markerLayer, els.routeLayer, els.bannerLayer, byId("people-layer"), byId("death-layer"));

  const state = {
    site: "map",
    mode: "map",
    filters: { castle: false, city: false, ruin: false, banners: true, territories: false, people: false, peopleScope: "main", deaths: false },
    scrubAll: false, // the player bar spans ALL seasons / ALL books in one line
    selectedJourneyId: null,
    selectedHouseId: null,
    selectedRegionId: null,
    selectedLocationId: null,
    playing: false,
    playToken: 0,
    cameraFollow: true,
    season: null,         // 1..8 when an episode is selected
    episode: null,        // episode number within that season
    epJourneyId: null,    // journey traced from the episode people list (Season 1 only)
    book: null,           // 1..5 when a book chapter is selected
    chapter: null,        // chapter number within that book
    lore: localStorage.getItem("hotd-lore") || "show", // which telling: "show" | "book"
    focusCharacter: null, // the soul being viewed/located: always drawn on the map
  };

  /* all eight seasons: S1 lives in data.js, S2–S8 in seasons.js */
  const ALL_SEASONS = [{ n: 1, name: "Season One", episodes: EPISODES }, ...SEASONS_LATER];
  const seasonByN = Object.fromEntries(ALL_SEASONS.map((s) => [s.n, s]));
  const bookByN = Object.fromEntries(BOOKS.map((b) => [b.n, b]));

  /* portrait circle: photo when we have one, initials otherwise */
  function avatarHTML(name, color) {
    const img = typeof PEOPLE_IMGS !== "undefined" ? PEOPLE_IMGS[name] : null;
    if (img) return `<span class="avatar avatar-photo"><img src="assets/people/${img}" alt="${name}"/></span>`;
    const initial = name.split(" ").map((w) => w[0]).slice(0, 2).join("");
    return `<span class="avatar" style="background:${color || "#6b6b6b"}">${initial}</span>`;
  }

  /* ---- groups (great houses / orders / noble houses) ---- */

  // normalize a group entry to a common shape (great houses borrow from WORLD.houses)
  function groupInfo(kind, group) {
    if (kind === "great") {
      const h = houseById[group.id];
      return { id: group.id, kind, name: h.name, words: h.words, seat: h.seat,
        region: h.region, blurb: h.description, emblem: { img: `${group.id}.svg` }, group };
    }
    return { id: group.id, kind, name: group.name, words: group.words || "", seat: group.seat || null,
      region: group.region || null, blurb: group.blurb || "", emblem: group.emblem, group };
  }
  const groupInfoById = {};
  GROUP_SECTIONS.forEach((sec) => sec.groups.forEach((g) => { groupInfoById[g.id] = groupInfo(sec.kind, g); }));
  // map a house name (e.g. "House Bolton") to its group id, for banner clicks
  const groupIdByName = {};
  GROUP_SECTIONS.forEach((sec) => sec.groups.forEach((g) => { groupIdByName[groupInfoById[g.id].name] = g.id; }));

  function emblemHTML(emblem, extraClass) {
    if (emblem && emblem.img) return `<span class="dd-sigil ${extraClass || ""}"><img src="assets/sigils/${emblem.img}" alt=""/></span>`;
    const e = emblem || { glyph: "?", color: "#6b6b6b" };
    return `<span class="dd-sigil group-emblem ${extraClass || ""}" style="background:${e.color}">${e.glyph}</span>`;
  }

  // ordered member rows for a group at the current story point, in the current telling
  function groupMemberRowsHTML(group) {
    const names = groupMembersAt(group, storyPoint()).filter(inLore);
    return names.map((m) =>
      `<button class="dd-member" data-char-open="${m}">${avatarHTML(m)}<span>${m}</span></button>`).join("");
  }

  // ================= character card (right-side popup) =================

  function storyPoint() {
    if (state.season && state.episode) return { type: "show", s: state.season, e: state.episode };
    if (state.book && state.chapter) return { type: "book", b: state.book, ch: state.chapter };
    return null; // no point selected: the whole tale is fair game
  }

  /* does this character exist in the chosen telling? */
  function inLore(name) {
    const c = CHARACTERS[name];
    return !c || !c.only || c.only === state.lore;
  }

  function isDeadAt(c, pt) {
    if (!pt) {
      // whole-story view follows the chosen telling
      if (state.lore === "book") return (c.death && c.death.s === 0) || !!c.bookDeath;
      return !!c.death;
    }
    if (pt.type === "show") {
      if (!c.death) return false;
      if (c.death.s === 0) return true; // died before the story
      return c.death.s < pt.s || (c.death.s === pt.s && c.death.e <= pt.e);
    }
    // book view: only book-recorded deaths count (plus pre-story ones —
    // but a real bookDeath chapter always outranks an s:0 placeholder)
    if (c.death && c.death.s === 0 && !c.bookDeath) return true;
    if (!c.bookDeath) return false;
    return c.bookDeath.b < pt.b || (c.bookDeath.b === pt.b && c.bookDeath.ch <= pt.ch);
  }

  function charLink(name) {
    if (!CHARACTERS[name]) return name;
    return `<button class="char-link" data-char="${name}">${name}</button>`;
  }

  const locByName = {};
  WORLD.locations.forEach((l) => { if (!(l.name in locByName)) locByName[l.name] = l.id; });

  /* Turn names in running text into clickable links — people, places, houses and
     regions all at once. A single token map, filled in priority order (a name that
     is more than one thing resolves to the first kind added), then one longest-first
     regex over its keys so "Storm's End" beats "End" and "House Stark" beats a bare
     surname. Houses/regions jump to their map view; people/places open their card. */
  const WIKI_BASE = "../wiki.html";
  const LINK_MAP = {};
  Object.keys(CHARACTERS).forEach((n) => { if (!(n in LINK_MAP)) LINK_MAP[n] = { kind: "char", id: n }; });
  WORLD.locations.forEach((l) => { if (!(l.name in LINK_MAP)) LINK_MAP[l.name] = { kind: "loc", id: l.id }; });
  WORLD.houses.forEach((h) => { if (!(h.name in LINK_MAP)) LINK_MAP[h.name] = { kind: "house", id: h.id }; });
  Object.keys(groupIdByName).forEach((nm) => { if (!(nm in LINK_MAP)) LINK_MAP[nm] = { kind: "house", id: groupIdByName[nm] }; });
  WORLD.regions.forEach((r) => { if (!(r.name in LINK_MAP)) LINK_MAP[r.name] = { kind: "region", id: r.id }; });
  /* the chronicle's collections — dragons, Valyrian steel, direwolves, the
     Kingsguard, battles, prophecies. These have no card on the map, so they link
     straight out to their page in the wiki. Ordinary words are never matched. */
  const COL_BLOCK = new Set(["lady", "ice", "ghost", "summer", "dawn", "truth", "the order itself"]);
  if (typeof COLLECTIONS !== "undefined") {
    COLLECTIONS.forEach((c) => c.items.forEach((it) => {
      const nm = it.name;
      if (nm in LINK_MAP || COL_BLOCK.has(nm.toLowerCase()) || nm.length < 5) return;
      if (Object.keys(CHARACTERS).some((cn) => nm.indexOf(cn) >= 0)) return;
      LINK_MAP[nm] = { kind: "wiki", id: WIKI_BASE + "#" + c.route + "=" + it.id };
    }));
  }
  const linkRegex = (() => {
    const toks = Object.keys(LINK_MAP).sort((a, b) => b.length - a.length)
      .map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    return toks.length ? new RegExp("\\b(" + toks.join("|") + ")\\b", "g") : null;
  })();
  function linkifyNames(text) {
    if (!linkRegex) return String(text);
    return String(text).replace(linkRegex, (m) => {
      const t = LINK_MAP[m];
      if (!t) return m;
      if (t.kind === "char") return `<button class="char-link" data-char="${t.id}">${m}</button>`;
      if (t.kind === "loc") return `<button class="loc-link" data-loc="${t.id}">${m}</button>`;
      if (t.kind === "house") return `<button class="house-link" data-house="${t.id}">${m}</button>`;
      if (t.kind === "wiki") return `<a class="wiki-link" href="${t.id}">${m}</a>`;
      return `<button class="region-link" data-region="${t.id}">${m}</button>`;
    });
  }
  function bindCharLinks(root) {
    root.querySelectorAll(".char-link").forEach((b) => {
      b.addEventListener("click", (e) => { e.stopPropagation(); openCharacterCard(b.dataset.char); });
    });
    root.querySelectorAll(".loc-link").forEach((b) => {
      b.addEventListener("click", (e) => { e.stopPropagation(); openLocationById(b.dataset.loc); });
    });
    root.querySelectorAll(".house-link").forEach((b) => {
      b.addEventListener("click", (e) => { e.stopPropagation(); setMode("houses"); selectGroup(b.dataset.house); });
    });
    root.querySelectorAll(".region-link").forEach((b) => {
      b.addEventListener("click", (e) => { e.stopPropagation(); setMode("regions"); selectRegion(b.dataset.region); });
    });
  }

  function openCharacterCard(name) {
    const c = CHARACTERS[name];
    const card = byId("char-card");
    if (!c) { card.classList.add("hidden"); return; }

    const pt = storyPoint();
    // with no episode/chapter chosen, the card speaks in the chosen telling
    const mode = pt ? pt.type : (state.lore === "book" ? "book" : "show");
    const ptLabel = pt
      ? (pt.type === "show" ? `S${pt.s} · E${pt.e}` : `${bookByN[pt.b].short} · Ch. ${pt.ch}`)
      : (mode === "book" ? "the books' whole tale" : "the show's whole tale");
    const dead = isDeadAt(c, pt);
    let status;
    if (dead) {
      const how = (mode === "book" && c.bookDeath) ? c.bookDeath.how : (c.death ? c.death.how : "");
      const when = c.death && c.death.s === 0 ? "before the story" :
        (mode === "book" && c.bookDeath) ? `${bookByN[c.bookDeath.b].short}, ch. ${c.bookDeath.ch}` :
        c.death ? `S${c.death.s} · E${c.death.e}` : "";
      // once the death has come to pass, the card may speak of it freely —
      // each telling gets its own version of how the end came
      const tale = (typeof DEATH_TALES !== "undefined")
        ? (mode === "show" ? DEATH_TALES[name] : DEATH_TALES_BOOK[name])
        : null;
      status = `<span class="char-dead">&#10013; Dead</span> <span class="char-status-when">(${when})</span><div class="char-death-how">${how}</div>` +
        (tale ? `<div class="char-death-tale">${linkifyNames(tale)}</div>` : "");
    } else {
      status = `<span class="char-alive">Alive</span> <span class="char-status-when">as of ${ptLabel}</span>`;
    }

    const img = typeof PEOPLE_IMGS !== "undefined" ? PEOPLE_IMGS[name] : null;

    // every group the character belongs to at this point in the story
    const groups = (typeof characterGroupsAt === "function") ? characterGroupsAt(name, pt) : [];
    const seen = new Set();
    const badges = groups.filter((g) => { if (seen.has(g.id)) return false; seen.add(g.id); return true; })
      .map((g) => { const info = groupInfoById[g.id];
        return `<button class="char-house-badge" data-group="${g.id}" title="${info.name}${g.note ? " — " + g.note : ""}">${emblemHTML(info.emblem, "char-house-emblem")}<span>${info.name}</span></button>`; });
    const housesHTML = badges.length
      ? `<div class="char-houses">${badges.join("")}</div>`
      : `<div class="char-house char-house-none">Sworn to no house</div>`;

    // lore-dependent fields: bookBlurb / bookSpouse override in the books' telling
    const blurbText = (mode === "book" && c.bookBlurb) ? c.bookBlurb : c.blurb;
    const spouse = (mode === "book" && c.bookSpouse) ? c.bookSpouse : c.spouse;

    const fam = [];
    if (c.father) fam.push(`<div class="char-fam-row"><span>Father</span>${charLink(c.father)}</div>`);
    if (c.mother) fam.push(`<div class="char-fam-row"><span>Mother</span>${charLink(c.mother)}</div>`);
    if (c.siblings && c.siblings.length)
      fam.push(`<div class="char-fam-row"><span>Siblings</span><span class="char-fam-list">${c.siblings.map(charLink).join(", ")}</span></div>`);
    if (spouse) fam.push(`<div class="char-fam-row"><span>Spouse</span>${charLink(spouse)}</div>`);
    if (c.children && c.children.length)
      fam.push(`<div class="char-fam-row"><span>Children</span><span class="char-fam-list">${c.children.map(charLink).join(", ")}</span></div>`);

    const roadLedger = (state.lore === "book")
      ? (typeof WHEREABOUTS_BOOK !== "undefined" ? WHEREABOUTS_BOOK : {})
      : (typeof WHEREABOUTS !== "undefined" ? WHEREABOUTS : {});
    const roadBtn = roadLedger[name]
      ? `<button class="char-road-btn" id="char-road-btn">&#129517; Trace their road</button>`
      : "";

    /* locate: zoom to wherever they stand — or fell — at the current story point */
    const fe = focusEntryFor(name);
    const locateBtn = fe
      ? `<button class="char-road-btn char-locate-btn" id="char-locate-btn">&#128205; ${fe.kind === "death" ? "Where they fell" : "Find them on the map"}</button>`
      : `<div class="char-locate-none">Not on the map at this point of the tale</div>`;

    card.innerHTML = `
      <button class="char-card-close" id="char-card-close">&times;</button>
      <div class="char-portrait">${img ? `<img src="assets/people/${img}" alt="${name}"/>` : `<div class="char-portrait-blank">${name.split(" ").map(w => w[0]).slice(0, 2).join("")}</div>`}</div>
      ${img ? `<div class="char-img-credit">Still &copy; HBO &middot; <a href="../credits.html">credits</a></div>` : ""}
      <div class="char-name">${name}</div>
      ${housesHTML}
      <div class="char-status">${status}</div>
      ${locateBtn}
      ${roadBtn}
      <a class="char-road-btn char-wiki-btn" href="wiki.html#char=${encodeURIComponent(name)}">&#128214; Read the full chronicle</a>
      <div class="sidebar-divider"></div>
      <div class="char-field"><span>Born</span>${c.born ? linkifyNames(c.born) : "Unknown"}</div>
      ${fam.length ? `<div class="loc-lore-head">Blood &amp; Marriage</div>${fam.join("")}` : ""}
      <div class="loc-lore-head">The Person</div>
      <p class="char-blurb">${linkifyNames(blurbText)}</p>
    `;
    card.classList.remove("hidden");

    /* the soul being viewed is always shown on the map, toggle or no toggle */
    state.focusCharacter = name;
    refreshPeopleLayer();

    byId("char-card-close").addEventListener("click", () => {
      card.classList.add("hidden");
      state.focusCharacter = null;
      refreshPeopleLayer();
    });
    const locateEl = byId("char-locate-btn");
    if (locateEl) locateEl.addEventListener("click", () => locateCharacter(name));
    const roadEl = byId("char-road-btn");
    if (roadEl) roadEl.addEventListener("click", () => showCharacterRoad(name));
    bindCharLinks(card);
    card.querySelectorAll(".char-house-badge").forEach((btn) => {
      btn.addEventListener("click", () => { setMode("houses"); selectGroup(btn.dataset.group); });
    });
  }

  const TYPE_LABEL = { castle: "Castle", city: "City", town: "Town", ruin: "Ruin", landmark: "Landmark" };
  const TYPE_GROUP = { castle: "castle", city: "city", town: "city", ruin: "ruin", landmark: "ruin" };

  function visibleLocations() {
    return WORLD.locations.filter((l) => state.filters[TYPE_GROUP[l.type]]);
  }

  /* which great house flies its shield over a seat, story point by story point.
     `start` is who holds it as the tale opens; entries are [s,e,house] (show)
     or [b,ch,house] (books); null = no banner (the seat stands empty). */
  const SEAT_CONTROL = {
    // Daemon takes Harrenhal for the blacks; the Strongs' seat becomes a black camp
    "harrenhal": { start: "strong", show: [[2,3,"targaryen"]], book: [[1,3,"targaryen"]] },
  };

  function seatHouseAt(locId, fallback) {
    const sc = SEAT_CONTROL[locId];
    const pt = storyPoint();
    if (!sc) return fallback;
    if (!pt) return fallback !== undefined ? fallback : null;
    let house = sc.start;
    const tl = pt.type === "book" ? sc.book : sc.show;
    const a = pt.type === "book" ? pt.b : pt.s;
    const b = pt.type === "book" ? pt.ch : pt.e;
    for (let i = 0; i < tl.length; i++) {
      const seg = tl[i];
      if (seg[0] < a || (seg[0] === a && seg[1] <= b)) house = seg[2];
      else break;
    }
    return house;
  }

  function bannerSeats() {
    const seats = [];
    // great houses: large internet-sourced shields — click opens the house panel
    Object.entries(HOUSE_SEATS).forEach(([locId, houseId]) => {
      const loc = locById[locId];
      const holder = seatHouseAt(locId, houseId);
      if (!holder) return; // the seat stands empty at this point of the story
      seats.push({ x: loc.x, y: loc.y, kind: "great", img: `${holder}.svg`, groupId: holder });
    });
    // controlled seats that aren't a great house's home (the capital) fly the
    // current holder's shield once the story is underway
    if (storyPoint()) {
      Object.keys(SEAT_CONTROL).forEach((locId) => {
        if (HOUSE_SEATS[locId] || SEAT_CONTROL[locId].minor) return;
        const loc = locById[locId];
        const holder = seatHouseAt(locId, null);
        if (!loc || !holder) return;
        seats.push({ x: loc.x, y: loc.y, kind: "great", img: `${holder}.svg`, groupId: holder });
      });
    }
    // lesser Westerosi houses: small shields (drawn arms, or Commons art where it exists).
    // click opens the noble-house panel if one exists, else the seat's location card.
    // A wiped-out house's shield comes down (SEAT_CONTROL entries resolving to null).
    WORLD.locations.forEach((loc) => {
      if (!loc.minorArms || HOUSE_SEATS[loc.id]) return;
      if (SEAT_CONTROL[loc.id] && storyPoint() && seatHouseAt(loc.id, "keep") === null) return;
      const gid = groupIdByName[loc.minorArms.house] || null;
      const target = gid ? { groupId: gid } : { locId: loc.id };
      if (loc.minorArms.img) seats.push({ x: loc.x, y: loc.y, kind: "img", img: loc.minorArms.img, ...target });
      else seats.push({ x: loc.x, y: loc.y, kind: "arms", arms: loc.minorArms, ...target });
    });
    return seats;
  }

  // ================= people on the map (per episode/chapter) =================

  /* the people list of whatever episode or chapter is currently chosen */
  function currentStoryPeople() {
    if (state.season && state.episode) {
      const season = seasonByN[state.season];
      return season && season.episodes[state.episode - 1] ? season.episodes[state.episode - 1].people : null;
    }
    if (state.book && state.chapter) {
      const book = bookByN[state.book];
      return book ? beatForChapter(book, state.chapter).people : null;
    }
    return null;
  }

  /* face-chip entries: every soul whose place the chronicle knows at this point.
     Both tellings use their own whereabouts ledger (episode- or chapter-gated);
     notes from the episode's/beat's own people list become tooltips. */
  function peopleEntries() {
    const isBook = !!(state.book && state.chapter);
    if (!isBook && !(state.season && state.episode)) return [];
    const listed = currentStoryPeople() || [];
    const noteBy = {};
    listed.forEach((p) => { if (p.note) noteBy[p.name] = p.note; });
    const ledger = isBook ? WHEREABOUTS_BOOK : WHEREABOUTS;
    const out = [];
    Object.keys(ledger).forEach((name) => {
      if (!inLore(name)) return;
      if (state.filters.peopleScope === "main" && !MAIN_CHARS.has(name)) return;
      const loc = isBook
        ? whereaboutsAtBook(name, state.book, state.chapter)
        : whereaboutsAt(name, state.season, state.episode);
      if (!loc) return;
      const c = WB_SPOTS[loc] ? { x: WB_SPOTS[loc][0], y: WB_SPOTS[loc][1] } : locById[loc];
      if (!c) return;
      out.push({ x: c.x, y: c.y, name, img: (typeof PEOPLE_IMGS !== "undefined" && PEOPLE_IMGS[name]) || null, note: noteBy[name] || "" });
    });
    return out;
  }

  /* skull entries: everyone already fallen at the chosen story point, at the place they fell */
  function deathEntries() {
    const pt = storyPoint();
    if (!pt) return [];
    const out = [];
    Object.keys(CHARACTERS).forEach((name) => {
      if (!inLore(name)) return;
      const c = CHARACTERS[name];
      if (!isDeadAt(c, pt)) return;
      let site, when;
      if (pt.type === "show") {
        if (!c.death || c.death.s === 0) return;
        site = deathSiteFor(name);
        when = `S${c.death.s} · E${c.death.e}`;
      } else {
        if (!c.bookDeath) return; // pre-story or show-only deaths leave no book pin
        site = deathSiteForBook(name);
        when = `${bookByN[c.bookDeath.b].short} · Ch. ${c.bookDeath.ch}`;
      }
      if (!site) return;
      const coords = WB_SPOTS[site] ? { x: WB_SPOTS[site][0], y: WB_SPOTS[site][1] } : locById[site];
      if (!coords) return;
      out.push({ x: coords.x, y: coords.y, name, when });
    });
    return out;
  }

  /* where the focused character stands at the chosen story point: a face-chip
     entry while they live, a skull entry once the point is past their death —
     or null if the chronicle doesn't place them on the map at this moment */
  function focusEntryFor(name) {
    const pt = storyPoint();
    if (!pt || !name || !inLore(name)) return null;
    const c = CHARACTERS[name];
    if (c && isDeadAt(c, pt)) {
      let site = null, when = "";
      if (pt.type === "show") {
        if (!c.death || c.death.s === 0) return null;
        site = deathSiteFor(name); when = `S${c.death.s} · E${c.death.e}`;
      } else {
        if (!c.bookDeath) return null;
        site = deathSiteForBook(name); when = `${bookByN[c.bookDeath.b].short} · Ch. ${c.bookDeath.ch}`;
      }
      if (!site) return null;
      const coords = WB_SPOTS[site] ? { x: WB_SPOTS[site][0], y: WB_SPOTS[site][1] } : locById[site];
      if (!coords) return null;
      return { kind: "death", entry: { x: coords.x, y: coords.y, name, when, focus: true } };
    }
    const loc = pt.type === "book"
      ? whereaboutsAtBook(name, pt.b, pt.ch)
      : whereaboutsAt(name, pt.s, pt.e);
    if (!loc) return null;
    const coords = WB_SPOTS[loc] ? { x: WB_SPOTS[loc][0], y: WB_SPOTS[loc][1] } : locById[loc];
    if (!coords) return null;
    return { kind: "person", entry: { x: coords.x, y: coords.y, name,
      img: (typeof PEOPLE_IMGS !== "undefined" && PEOPLE_IMGS[name]) || null, note: "", focus: true } };
  }

  /* fly the camera to wherever the character stands (or fell) right now */
  function locateCharacter(name) {
    state.focusCharacter = name;
    const f = focusEntryFor(name);
    refreshPeopleLayer();
    if (f) mapView.focusOn(f.entry.x, f.entry.y, Math.max(mapView.state.scale, 4.2));
  }

  function refreshPeopleLayer() {
    let people = state.filters.people ? peopleEntries() : [];
    let deaths = state.filters.deaths ? deathEntries() : [];
    /* the character being viewed is ALWAYS on the map, toggles or no — a face
       while they live, their skull once the story point passes their death;
       with the layer on, the focus entry replaces theirs and renders highlighted */
    const f = state.focusCharacter ? focusEntryFor(state.focusCharacter) : null;
    if (f && f.kind === "person") { people = people.filter((e) => e.name !== state.focusCharacter); people.push(f.entry); }
    if (f && f.kind === "death") { deaths = deaths.filter((e) => e.name !== state.focusCharacter); deaths.push(f.entry); }
    mapView.renderPeople(people);
    // the fallen follow the same story point, so they refresh together
    mapView.renderDeaths(deaths);
    // so do the realm's holdings: territories and seat banners change hands
    if (typeof applyTerritoryOwners === "function") applyTerritoryOwners(storyPoint(), state.lore);
    mapView.renderBanners(bannerSeats());
  }

  // ================= site switcher and Wordle =================

  function setSite(site) {
    if (site !== "map" && site !== "wordle") return;
    state.site = site;
    const isWordle = site === "wordle";
    document.body.classList.toggle("site-wordle", isWordle);
    els.wordleScreen.classList.toggle("hidden", !isWordle);
    els.siteTitle.textContent = isWordle ? "WORDLE OF THE REALM" : "HOUSE OF THE DRAGON MAP";
    document.title = isWordle
      ? "Wordle of the Realm - House of the Dragon"
      : "House of the Dragon Map - The Dance of the Dragons";
    els.siteDropdown.querySelectorAll("[data-site]").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.site === site);
    });
    els.siteButton.setAttribute("aria-expanded", "false");
    els.siteSwitcher.classList.remove("open");

    if (isWordle) {
      stopPlayback();
      hideSearchResults();
      closeDropdowns();
      hideStoryTip();
      byId("lore-modal").classList.add("hidden");
      byId("char-card").classList.add("hidden");
      els.wordleInput.focus();
    }
  }

  /* the brand square is the map's "home": clicking it returns to the clean opening
     view, exactly as pressing "The Map" does — the chosen telling is kept, but any
     selected region, place, house, journey or open card is cleared and the view reset. */
  function resetToOpening() {
    if (state.site === "wordle") setSite("map");
    state.selectedRegionId = null;
    state.selectedLocationId = null;
    if (mapView.setSelectedMarker) mapView.setSelectedMarker(null);
    const cc = byId("char-card"); if (cc) cc.classList.add("hidden");
    state.focusCharacter = null;
    setMode("map");
    renderWelcome();
    mapView.reset();
    refreshPeopleLayer();
  }

  function initSiteSwitcher() {
    /* realm-nav retires the old switcher dropdown; the brand becomes a reset button */
    els.siteButton.style.pointerEvents = "auto";
    els.siteButton.style.cursor = "pointer";
    els.siteButton.title = "Back to the map";
    els.siteButton.addEventListener("click", (e) => {
      e.stopPropagation();
      resetToOpening();
    });
    els.siteDropdown.querySelectorAll("[data-site]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (btn.dataset.site === "map" || btn.dataset.site === "wordle") setSite(btn.dataset.site);
        else if (btn.dataset.site === "home") window.location.href = "../index.html";
        else if (btn.dataset.site === "asoiaf") window.location.href = "../map.html";
        else if (btn.dataset.site === "knight") window.location.href = "../knight/index.html";
        else if (btn.dataset.site === "trees") window.location.href = "../trees/index.html";
        else if (btn.dataset.site === "quiz") window.location.href = "../quiz/index.html";
      });
    });
    document.addEventListener("click", (e) => {
      if (!els.siteSwitcher.contains(e.target)) {
        els.siteSwitcher.classList.remove("open");
        els.siteButton.setAttribute("aria-expanded", "false");
      }
    });
  }

  const WORDLE_LEN = 5;
  const WORDLE_ROWS = 5;
  const WORDLE_LABELS = {
    all: "All Words",
    names: "Names",
    places: "Places",
    houses: "Houses",
    lore: "Lore",
  };
  const WORDLE_KEY_ORDER = "QWERTYUIOPASDFGHJKLZXCVBNM".split("");
  const WORDLE_MARK_RANK = { absent: 1, present: 2, correct: 3 };

  /* ------------------------------------------------------------ Wordle words
     CURATED, not harvested. This list used to be built by sweeping every
     five-letter token out of CHARACTERS, WORLD.locations and WORLD.houses,
     which is where the strange answers came from: it was pulling fragments of
     names rather than names. "Acorn Hall" gave ACORN, "House of Black and
     White" gave HOUSE and FACES, "Jaqen H'ghar" gave HGHAR.

     The rule now: a word belongs here only if someone who watched the show
     could reasonably be expected to know it. Add freely, but keep that bar —
     and every entry must be exactly five letters, written out in full. Never
     truncate a longer name to fit; that produces non-words. */
  const WORDLE_POOL = {
    names: ["AEGON", "AEMMA", "ARRAX", "BAELA", "JASON", "LAENA", "LARYS", "SYRAX"],
    places: ["DORNE", "ESSOS", "NORTH", "REACH", "TWINS"],
    houses: ["ARRYN", "ROYCE", "STARK", "TULLY", "WYLDE"],
    lore: ["ARROW", "BLADE", "BLOOD", "CHAIN", "CLOAK", "CROWN", "CROWS", "FAITH", "FEAST", "FLAME", "FROST", "GIANT", "GREEN", "GUARD", "HONOR", "HORSE", "KINGS", "KNIFE", "LIGHT", "OATHS", "QUEEN", "RAVEN", "REALM", "RIVER", "SIEGE", "SPEAR", "STEEL", "STONE", "STORM", "SWORD", "THORN", "TOWER", "TRIAL", "WATCH", "WHITE", "WIGHT", "WINDS", "WOODS"],
  };

  function buildWordleWords() {
    const names = WORDLE_POOL.names.slice();
    const places = WORDLE_POOL.places.slice();
    const houses = WORDLE_POOL.houses.slice();
    const lore = WORDLE_POOL.lore.slice();
    const all = Array.from(new Set([].concat(names, places, houses, lore))).sort();
    return { all, names, places, houses, lore };
  }

  const WORDLE_WORDS = buildWordleWords();
  const wordle = {
    category: "all",
    answer: "",
    guesses: [],
    keyState: {},
    over: false,
    lastAnswer: "",
  };

  function pickWordleAnswer(category) {
    const pool = WORDLE_WORDS[category] && WORDLE_WORDS[category].length ? WORDLE_WORDS[category] : WORDLE_WORDS.all;
    if (pool.length <= 1) return pool[0] || "STARK";
    let next = pool[Math.floor(Math.random() * pool.length)];
    if (next === wordle.lastAnswer) next = pool[(pool.indexOf(next) + 1) % pool.length];
    return next;
  }

  function evaluateWordleGuess(guess, answer) {
    const marks = Array(WORDLE_LEN).fill("absent");
    const remaining = {};
    for (let i = 0; i < WORDLE_LEN; i++) {
      if (guess[i] === answer[i]) marks[i] = "correct";
      else remaining[answer[i]] = (remaining[answer[i]] || 0) + 1;
    }
    for (let i = 0; i < WORDLE_LEN; i++) {
      if (marks[i] === "correct") continue;
      const letter = guess[i];
      if (remaining[letter] > 0) {
        marks[i] = "present";
        remaining[letter]--;
      }
    }
    return marks;
  }

  function updateWordleKeys(guess, marks) {
    guess.split("").forEach((letter, i) => {
      const mark = marks[i];
      const current = wordle.keyState[letter];
      if (!current || WORDLE_MARK_RANK[mark] > WORDLE_MARK_RANK[current]) wordle.keyState[letter] = mark;
    });
  }

  function renderWordleBoard() {
    const current = wordle.over ? "" : els.wordleInput.value.toUpperCase();
    let html = "";
    for (let row = 0; row < WORDLE_ROWS; row++) {
      const past = wordle.guesses[row];
      const active = !past && row === wordle.guesses.length ? current : "";
      html += `<div class="wordle-row">`;
      for (let col = 0; col < WORDLE_LEN; col++) {
        const letter = past ? past.word[col] : (active[col] || "");
        const mark = past ? past.marks[col] : "";
        const filled = letter ? " filled" : "";
        html += `<div class="wordle-cell${filled}${mark ? " " + mark : ""}">${letter}</div>`;
      }
      html += `</div>`;
    }
    els.wordleBoard.innerHTML = html;
  }

  function renderWordleKeyboard() {
    els.wordleKeyboard.innerHTML = WORDLE_KEY_ORDER.map((letter) =>
      `<span class="wordle-key-letter ${wordle.keyState[letter] || ""}">${letter}</span>`).join("");
  }

  function renderWordleStats() {
    const pool = WORDLE_WORDS[wordle.category] || WORDLE_WORDS.all;
    els.wordleCategoryLabel.textContent = WORDLE_LABELS[wordle.category] || WORDLE_LABELS.all;
    els.wordlePoolCount.textContent = String(pool.length);
    els.wordleGuessesLeft.textContent = String(Math.max(0, WORDLE_ROWS - wordle.guesses.length));
    els.wordleLastAnswer.textContent = wordle.lastAnswer || "-";
    els.wordleCategories.querySelectorAll("[data-wordle-category]").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.wordleCategory === wordle.category);
    });
  }

  function renderWordleList() {
    const order = ["names", "places", "houses", "lore"];
    els.wordleListBody.innerHTML = order.map((key) => {
      const words = WORDLE_WORDS[key] || [];
      return `<div class="wordle-list-group">
        <div class="wordle-list-heading"><span>${WORDLE_LABELS[key]}</span><span>${words.length}</span></div>
        <div class="wordle-word-grid">${words.map((word) => `<span class="wordle-word">${word}</span>`).join("")}</div>
      </div>`;
    }).join("");
  }

  function setWordleMessage(message) {
    els.wordleMessage.textContent = message;
  }

  function renderWordle() {
    renderWordleBoard();
    renderWordleKeyboard();
    renderWordleStats();
    els.wordleInput.disabled = wordle.over;
    els.wordleForm.querySelector("button").disabled = wordle.over;
  }

  function startWordleGame(category = wordle.category) {
    wordle.category = category;
    wordle.answer = pickWordleAnswer(category);
    wordle.guesses = [];
    wordle.keyState = {};
    wordle.over = false;
    els.wordleInput.value = "";
    setWordleMessage("The ravens wait.");
    renderWordle();
    renderWordleList();
    if (state.site === "wordle") els.wordleInput.focus();
  }

  function submitWordleGuess() {
    if (wordle.over) return;
    const guess = els.wordleInput.value.toUpperCase().replace(/[^A-Z]/g, "").slice(0, WORDLE_LEN);
    if (guess.length !== WORDLE_LEN) {
      setWordleMessage("Five letters are required.");
      return;
    }
    const pool = WORDLE_WORDS[wordle.category] || WORDLE_WORDS.all;
    if (!pool.includes(guess)) {
      setWordleMessage("That word is not in this hoard.");
      return;
    }
    const marks = evaluateWordleGuess(guess, wordle.answer);
    wordle.guesses.push({ word: guess, marks });
    updateWordleKeys(guess, marks);
    els.wordleInput.value = "";

    if (guess === wordle.answer) {
      wordle.over = true;
      wordle.lastAnswer = wordle.answer;
      setWordleMessage("The word is yours.");
    } else if (wordle.guesses.length >= WORDLE_ROWS) {
      wordle.over = true;
      wordle.lastAnswer = wordle.answer;
      setWordleMessage(`The word was ${wordle.answer}.`);
    } else {
      setWordleMessage("Again.");
    }
    renderWordle();
  }

  function initWordle() {
    startWordleGame("all");
    els.wordleInput.addEventListener("input", () => {
      els.wordleInput.value = els.wordleInput.value.toUpperCase().replace(/[^A-Z]/g, "").slice(0, WORDLE_LEN);
      renderWordleBoard();
    });
    els.wordleForm.addEventListener("submit", (e) => {
      e.preventDefault();
      submitWordleGuess();
    });
    els.wordleNew.addEventListener("click", () => startWordleGame(wordle.category));
    els.wordleCategories.querySelectorAll("[data-wordle-category]").forEach((btn) => {
      btn.addEventListener("click", () => startWordleGame(btn.dataset.wordleCategory));
    });
    els.wordleListToggle.addEventListener("click", () => {
      const open = els.wordleList.classList.toggle("hidden") === false;
      els.wordleListToggle.textContent = open ? "Hide Word Hoard" : "Show Word Hoard";
    });
    els.wordleListClose.addEventListener("click", () => {
      els.wordleList.classList.add("hidden");
      els.wordleListToggle.textContent = "Show Word Hoard";
    });
  }

  // ================= dropdown menus =================

  function buildMenus() {
    byId("menu-map").innerHTML = `
      <div class="dropdown-title">The Legend</div>
      <label class="legend-row"><input type="checkbox" id="f-castle" ${state.filters.castle ? "checked" : ""}/>
        <svg class="legend-icon" viewBox="-16 -39 32 42"><use href="#pin-castle"/></svg> Castles &amp; Seats</label>
      <label class="legend-row"><input type="checkbox" id="f-city" ${state.filters.city ? "checked" : ""}/>
        <svg class="legend-icon" viewBox="-16 -39 32 42"><use href="#pin-city"/></svg> Cities &amp; Towns</label>
      <label class="legend-row"><input type="checkbox" id="f-ruin" ${state.filters.ruin ? "checked" : ""}/>
        <svg class="legend-icon" viewBox="-16 -39 32 42"><use href="#pin-ruin"/></svg> Ruins &amp; Landmarks</label>
      <div class="dropdown-divider"></div>
      <label class="legend-row"><input type="checkbox" id="f-people" ${state.filters.people ? "checked" : ""}/>
        <span class="legend-face-icon"><img src="assets/people/daemon-targaryen.jpg" alt=""/></span> People of the Story <span class="legend-hint">(when an episode or chapter is chosen)</span></label>
      <div class="legend-sub">
        <label class="legend-sub-choice"><input type="radio" name="people-scope" value="main" ${state.filters.peopleScope === "main" ? "checked" : ""}/> The main players only</label>
        <label class="legend-sub-choice"><input type="radio" name="people-scope" value="all" ${state.filters.peopleScope === "all" ? "checked" : ""}/> Every known soul</label>
      </div>
      <label class="legend-row"><input type="checkbox" id="f-deaths" ${state.filters.deaths ? "checked" : ""}/>
        <span class="legend-skull-icon">&#9760;</span> The Fallen <span class="legend-hint">(skulls where the dead met their end)</span></label>
      <label class="legend-row"><input type="checkbox" id="f-banners" ${state.filters.banners ? "checked" : ""}/>
        <span class="legend-banner-icon"><img src="${sigilSrc("stark")}" alt=""/></span> House Banners</label>
      <label class="legend-row"><input type="checkbox" id="f-territories" ${state.filters.territories ? "checked" : ""}/>
        <svg class="legend-territory" viewBox="0 0 34 22">
          <path d="M2 2 L20 1 L22 8 L14 12 L3 11 Z" fill="#8494a8" opacity="0.85"/>
          <path d="M14 12 L22 8 L30 10 L28 16 L16 17 Z" fill="#a8242e" opacity="0.85"/>
          <path d="M3 11 L14 12 L16 17 L12 21 L2 20 Z" fill="#4a8a3a" opacity="0.85"/>
          <path d="M16 17 L28 16 L32 21 L12 21 Z" fill="#c9702e" opacity="0.85"/>
        </svg> Territories of the Great Houses</label>
      <div class="dropdown-divider"></div>
      <div class="dropdown-note">Zoom in to reveal smaller holdfasts. Click any pin to read of it. Banners fly over every seat whose house is known.</div>
    `;
    byId("f-castle").addEventListener("change", (e) => { state.filters.castle = e.target.checked; refreshMarkers(); });
    byId("f-city").addEventListener("change", (e) => { state.filters.city = e.target.checked; refreshMarkers(); });
    byId("f-ruin").addEventListener("change", (e) => { state.filters.ruin = e.target.checked; refreshMarkers(); });
    byId("f-people").addEventListener("change", (e) => { state.filters.people = e.target.checked; refreshPeopleLayer(); });
    byId("menu-map").querySelectorAll('input[name="people-scope"]').forEach((r) => {
      r.addEventListener("change", () => { state.filters.peopleScope = r.value; refreshPeopleLayer(); });
    });
    byId("f-deaths").addEventListener("change", (e) => { state.filters.deaths = e.target.checked; refreshPeopleLayer(); });
    byId("f-banners").addEventListener("change", (e) => { state.filters.banners = e.target.checked; mapView.setBannersVisible(e.target.checked); });
    byId("f-territories").addEventListener("change", (e) => {
      state.filters.territories = e.target.checked;
      byId("territory-layer").classList.toggle("hidden-layer", !e.target.checked);
    });

    buildHousesMenu();

    byId("menu-regions").innerHTML =
      `<div class="dropdown-title">Regions of the Realm</div>` +
      WORLD.regions.map((r) => {
        const count = WORLD.locations.filter((l) => l.region === r.id).length;
        return `<button class="dd-item" data-region="${r.id}">
          <span class="region-bullet">&#9670;</span>
          <span class="dd-item-text"><span class="dd-item-title">${r.name}</span></span>
          <span class="region-count">${count}</span>
        </button>`;
      }).join("");
    byId("menu-regions").querySelectorAll("[data-region]").forEach((btn) => {
      btn.addEventListener("click", () => { setMode("regions"); selectRegion(btn.dataset.region); closeDropdowns(); });
    });
  }

  // the Houses dropdown is rebuilt whenever the story point changes, so gated
  // rosters (e.g. Tommen under Baratheon, Jon in the Watch) stay accurate.
  const PROMOTED_NOBLE = /bolton|clegane|mormont|tarly|karstark|seaworth|baelish|reed|tarth/i;
  function buildHousesMenu() {
    const nobleSeats = WORLD.locations
      .filter((l) => l.minorArms && !PROMOTED_NOBLE.test(l.minorArms.house))
      .sort((a, b) => a.minorArms.house.localeCompare(b.minorArms.house));

    let html = "";
    GROUP_SECTIONS.forEach((sec, si) => {
      if (si > 0) html += `<div class="dropdown-divider"></div>`;
      html += `<div class="dropdown-title">${sec.label}</div>`;
      sec.groups.forEach((group) => {
        const info = groupInfoById[group.id];
        const rows = groupMemberRowsHTML(group);
        const seatName = info.seat && locById[info.seat] ? locById[info.seat].name : "";
        const sub = seatName
          ? `${seatName}${info.words ? ` &middot; &ldquo;${info.words}&rdquo;` : ""}`
          : (info.words ? `&ldquo;${info.words}&rdquo;` : (sec.kind === "order" ? "an order of the world" : ""));
        html += `
          <button class="dd-item" data-group="${group.id}">
            ${emblemHTML(info.emblem)}
            <span class="dd-item-text"><span class="dd-item-title">${info.name}</span>
            <span class="dd-item-sub">${sub}</span></span>
            ${rows ? `<span class="dd-member-toggle" data-group-members="${group.id}" title="Its people">&#9662;</span>` : ""}
          </button>
          ${rows ? `<div class="dd-members hidden" id="members-${group.id}">${rows}</div>` : ""}`;
      });
    });

    html += `<div class="dropdown-divider"></div>
      <div class="dropdown-title">Other Seats of the Realm</div>`;
    html += nobleSeats.map((l) => {
      const shield = l.minorArms.img
        ? `<img src="assets/sigils/${l.minorArms.img}" alt=""/>`
        : minorShieldSVG(l.minorArms);
      return `<button class="dd-item dd-item-noble" data-noble="${l.id}">
        <span class="dd-sigil dd-sigil-noble">${shield}</span>
        <span class="dd-item-text"><span class="dd-item-title">${l.minorArms.house}</span>
        <span class="dd-item-sub">${l.name}</span></span>
      </button>`;
    }).join("");

    byId("menu-houses").innerHTML = html;

    byId("menu-houses").querySelectorAll("[data-group]").forEach((btn) => {
      btn.addEventListener("click", () => { setMode("houses"); selectGroup(btn.dataset.group); closeDropdowns(); });
    });
    byId("menu-houses").querySelectorAll("[data-group-members]").forEach((tog) => {
      tog.addEventListener("click", (e) => {
        e.stopPropagation();
        byId(`members-${tog.dataset.groupMembers}`).classList.toggle("hidden");
      });
    });
    byId("menu-houses").querySelectorAll("[data-char-open]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        openCharacterCard(btn.dataset.charOpen);
        closeDropdowns();
      });
    });
    byId("menu-houses").querySelectorAll("[data-noble]").forEach((btn) => {
      btn.addEventListener("click", () => {
        setMode("map");
        const loc = locById[btn.dataset.noble];
        state.filters.banners = true;
        const t = byId("f-banners"); if (t) t.checked = true;
        refreshMarkers();
        state.selectedLocationId = loc.id;
        mapView.setSelectedMarker(loc.id);
        mapView.focusOn(loc.x, loc.y, 4.2);
        renderLocationCard(loc);
        closeDropdowns();
      });
    });
  }

  function closeDropdowns() {
    els.modeNav.querySelectorAll(".mode-item").forEach((mi) => mi.classList.remove("open"));
  }

  // hover intent: open on enter, close on leave (CSS handles visuals via .open)
  els.modeNav.querySelectorAll(".mode-item").forEach((mi) => {
    mi.addEventListener("mouseenter", () => { closeDropdowns(); mi.classList.add("open"); });
    mi.addEventListener("mouseleave", () => mi.classList.remove("open"));
  });

  // ================= modes =================

  function setMode(mode) {
    state.mode = mode;
    els.modeNav.querySelectorAll(".mode-btn").forEach((b) => b.classList.toggle("active", b.dataset.mode === mode));

    if (mode !== "journeys") {
      stopPlayback();
      const hadJourney = !!(state.selectedJourneyId || state.activeJourney);
      state.selectedJourneyId = null;
      state.activeJourney = null;
      // an active episode/chapter keeps its player & traced route alive across modes
      if (state.episode || state.book) {
        if (hadJourney) {
          // hand the player back from the journey to the chosen episode/chapter
          mapView.clearRoute();
          if (state.episode) showEpisodePlayer(state.season, state.episode);
          else showChapterPlayer(state.book, state.chapter);
        }
      } else {
        els.player.classList.add("hidden");
        mapView.clearRoute();
        state.epJourneyId = null;
      }
    } else {
      // entering Journeys KEEPS the chosen episode/chapter —
      // roads are drawn only up to that point in the story
    }
    refreshMarkers();
  }

  els.modeNav.querySelectorAll(".mode-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const mi = btn.closest(".mode-item");
      if (btn.dataset.mode === "regions" && state.selectedRegionId) {
        state.selectedRegionId = null;
        if (state.season && state.episode) renderEpisodePanel(state.season, state.episode);
        else if (state.book && state.chapter) renderChapterPanel(state.book, state.chapter);
        else renderWelcome();
      }
      setMode(btn.dataset.mode);
      if (btn.dataset.mode === "map") { renderWelcome(); mapView.reset(); }
      closeDropdowns();
      mi.classList.add("open"); // a click always shows (and keeps) the dropdown
    });
  });

  // clicking anywhere outside the top nav closes any open dropdown
  document.addEventListener("click", (e) => {
    if (!els.modeNav.contains(e.target)) closeDropdowns();
  });

  function refreshMarkers() {
    const locs = visibleLocations();
    let dimmed = new Set();
    let highlighted = new Set();

    let renderLocs = locs;
    const activeJourneyId = state.mode === "journeys" ? state.selectedJourneyId : state.epJourneyId;
    if (activeJourneyId) {
      // generated roads live in state.activeJourney, not in WORLD.journeys
      const j = (state.activeJourney && state.activeJourney.id === activeJourneyId)
        ? state.activeJourney
        : WORLD.journeys.find((x) => x.id === activeJourneyId);
      if (j) {
        const routeLocIds = new Set(j.stops.filter((s) => s.location).map((s) => s.location));
        // stop markers replace the regular markers at route locations
        renderLocs = locs.filter((l) => !routeLocIds.has(l.id));
        dimmed = new Set(renderLocs.map((l) => l.id));
      }
    } else if (state.mode === "houses" && state.selectedHouseId) {
      const info = groupInfoById[state.selectedHouseId];
      if (info && info.seat) {
        highlighted = new Set([info.seat]);
        dimmed = new Set(locs.filter((l) => l.id !== info.seat && l.region !== info.region).map((l) => l.id));
      }
    } else if (state.mode === "regions" && state.selectedRegionId) {
      const ids = new Set(locs.filter((l) => l.region === state.selectedRegionId).map((l) => l.id));
      dimmed = new Set(locs.filter((l) => !ids.has(l.id)).map((l) => l.id));
    }

    mapView.renderMarkers(renderLocs, { dimmedIds: dimmed, highlightedIds: highlighted, onClick: onMarkerClick });
    if (state.selectedLocationId) mapView.setSelectedMarker(state.selectedLocationId);
    mapView.renderBanners(bannerSeats());
    mapView.setBannersVisible(state.filters.banners);
  }

  // ================= info panel (left) =================

  function renderWelcome() {
    els.sidebar.innerHTML = `
      <div class="sidebar-title">A Chronicle of the Dance</div>
      <p class="sidebar-note">This is the known world under the Old King's peace — a realm whole, its dragons many, and a question of succession beginning to smolder. From here the map follows the Dance of the Dragons, telling by telling.</p>
      <div class="sidebar-divider"></div>
      <div class="stat-row"><span>Places charted</span><b>${WORLD.locations.length}</b></div>
      <div class="stat-row"><span>Great Houses</span><b>${WORLD.houses.length}</b></div>
      <div class="stat-row"><span>Souls of the story</span><b>${new Set(Object.values(CHARACTERS)).size}</b></div>
      <div class="stat-row"><span>Regions of the realm</span><b>${WORLD.regions.length}</b></div>
      <div class="sidebar-divider"></div>
      <p class="sidebar-note">Drag to pan and scroll to zoom. Click any marker to read its chronicle here. Hover the ribbons above — <i>The Map, People &amp; Houses, Regions</i> — to choose what the map shows. Pick a season &amp; episode, or a chapter of <i>Fire &amp; Blood</i>, from <i>The Story</i> (top right) and the whole map follows.</p>
      <div class="sidebar-divider"></div>
      <p class="sidebar-note sidebar-fineprint">The ledger keeps to the story point you choose: people, fates, banners and borders reflect the tale up to that moment, and nothing beyond.</p>
    `;
  }

  function onMarkerClick(loc) {
    state.selectedLocationId = loc.id;
    mapView.setSelectedMarker(loc.id);
    renderLocationCard(loc);
  }

  /* open a place's card by id — used by place-name links in running text */
  function openLocationById(id) {
    const loc = locById[id];
    if (loc) onMarkerClick(loc);
  }

  function minorShieldSVG(arms) {
    const [a, b] = arms.colors;
    let overlay = "";
    if (arms.div === "fess") overlay = `<path d="M -7 8 H 7 V 10 C 7 16 0 19 0 19 C 0 19 -7 16 -7 10 Z" fill="${b}"/>`;
    else if (arms.div === "pale") overlay = `<path d="M 0 0 H 7 V 10 C 7 16 0 19 0 19 V 0 Z" fill="${b}"/>`;
    else if (arms.div === "quarter") overlay = `<path d="M 0 0 H 7 V 9 H 0 Z" fill="${b}"/><path d="M -7 9 H 0 V 19 C 0 19 -7 16 -7 10 Z" fill="${b}"/>`;
    else overlay = `<circle cx="0" cy="7" r="3" fill="${b}"/>`;
    return `<svg class="chip-shield" viewBox="-8 -1 16 21">
      <path d="M -7 0 H 7 V 10 C 7 16 0 19 0 19 C 0 19 -7 16 -7 10 Z" fill="${a}"/>${overlay}
      <path d="M -7 0 H 7 V 10 C 7 16 0 19 0 19 C 0 19 -7 16 -7 10 Z" fill="none" stroke="#2b2015" stroke-width="0.8"/>
    </svg>`;
  }

  function renderLocationCard(loc) {
    const region = regionById[loc.region];
    const house = loc.house ? houseById[loc.house] : null;
    let minorChip = "";
    if (!house && loc.minorArms) {
      const shield = loc.minorArms.img
        ? `<img src="assets/sigils/${loc.minorArms.img}" alt=""/>`
        : minorShieldSVG(loc.minorArms);
      minorChip = `<div class="loc-house-chip">${shield}<span>${loc.minorArms.house}</span></div>`;
    }
    els.sidebar.innerHTML = `
      <div class="loc-kicker">${TYPE_LABEL[loc.type]} &middot; ${region ? region.name : ""}</div>
      <div class="loc-title">${loc.name}</div>
      <div class="loc-subtitle">${loc.subtitle}</div>
      ${house ? `<div class="loc-house-chip"><img src="assets/sigils/${house.id}.svg" alt=""/><span>${house.name} &middot; &ldquo;${house.words}&rdquo;</span></div>` : ""}
      ${minorChip}
      <div class="sidebar-divider"></div>
      <p class="loc-desc">${linkifyNames(loc.description)}</p>
      <div class="sidebar-divider"></div>
      <button class="side-btn" id="btn-focus-loc">Travel There</button>
      <a class="side-btn side-btn-ghost loc-wiki-btn" href="wiki.html#loc=${loc.id}">&#128214; Read about this place</a>
      <button class="side-btn side-btn-ghost" id="btn-back-welcome">${state.episode ? "Back to the Episode" : "Back to the Ledger"}</button>
    `;
    byId("btn-focus-loc").addEventListener("click", () => mapView.focusOn(loc.x, loc.y, 4.2));
    byId("btn-back-welcome").addEventListener("click", () => {
      state.selectedLocationId = null;
      mapView.setSelectedMarker(null);
      if (state.episode) renderEpisodePanel(state.season, state.episode);
      else renderWelcome();
    });
    bindCharLinks(els.sidebar);
  }

  // ================= journeys =================

  function stopCoords(stop) {
    if (stop.at) return { x: stop.at[0], y: stop.at[1], name: stop.name };
    const loc = locById[stop.location];
    return { x: loc.x, y: loc.y, name: stop.name || loc.name };
  }

  function currentJourney() {
    return state.activeJourney || WORLD.journeys.find((j) => j.id === state.selectedJourneyId);
  }

  /* one label per stop, whichever telling the stop belongs to */
  function stopTag(s) {
    return s.tag || `Episode ${s.episode}${s.epTitle ? " · " + s.epTitle : ""}`;
  }

  function selectJourney(journeyId) {
    const journey = WORLD.journeys.find((j) => j.id === journeyId);
    if (!journey) return;
    state.selectedJourneyId = journeyId;
    // an episode chosen? the curated Season-One roads only run as far as the story has
    const pt = storyPoint();
    let stops = journey.stops;
    if (pt && pt.type === "show" && pt.s === 1) stops = journey.stops.filter((s) => s.episode <= pt.e);
    showJourney(stops === journey.stops ? journey : { ...journey, stops });
  }

  function showJourney(journey) {
    stopPlayback();
    state.activeJourney = journey;

    if (!journey.stops.length) {
      mapView.clearRoute();
      els.player.classList.add("hidden");
      els.sidebar.innerHTML = `
        <div class="loc-kicker">Chronicle of Travel</div>
        <div class="loc-title journey-title">${avatarHTML(journey.character, journey.color)}${journey.character}</div>
        <div class="sidebar-divider"></div>
        <p class="loc-lore">Their road has not yet begun at this point of the story. Step further along the tale, and it will appear.</p>`;
      return;
    }

    const pts = journey.stops.map(stopCoords);
    refreshMarkers();
    mapView.renderRoute(pts, journey.color, (i) => {
      stopPlayback();
      els.scrubber.value = String(i);
      mapView.setTraveler(i);
      renderJourneyCard(journey, i);
    });
    if (pts.length > 1) mapView.fitBounds(pts);
    else mapView.focusOn(pts[0].x, pts[0].y, 3);
    mapView.setTraveler(0);

    els.player.classList.remove("hidden");
    els.playerCharacter.classList.remove("player-switchable");
    els.playerCharacter.innerHTML = `${avatarHTML(journey.character, journey.color)} ${journey.character}`;
    els.playerJourneySummary.textContent = journey.summary;
    els.scrubber.min = "0";
    els.scrubber.max = String(journey.stops.length - 1);
    els.scrubber.step = "0.01";
    els.scrubber.value = "0";

    els.scrubberTicks.innerHTML = journey.stops.map((s, i) => {
      const pct = journey.stops.length > 1 ? (i / (journey.stops.length - 1)) * 100 : 0;
      return `<span class="tick" style="left:${pct}%" title="${stopTag(s)}"></span>`;
    }).join("");

    renderJourneyCard(journey, 0);
  }

  // ============ every soul's road, traced from the whereabouts ledgers ============

  const ROAD_COLORS = ["#8f2d3c", "#5b7d9c", "#6b8a5a", "#a08549", "#7a6a9c", "#b0563a", "#4a7a8c", "#8a5a7a"];
  function roadColor(name) {
    let h = 0;
    for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
    return ROAD_COLORS[h % ROAD_COLORS.length];
  }

  /* build a journey object from a character's whereabouts timeline — in the chosen
     telling, and only as far as the chosen episode/chapter (if one is chosen) */
  function characterRoad(name) {
    const isBook = state.lore === "book";
    const tl = isBook ? (typeof WHEREABOUTS_BOOK !== "undefined" && WHEREABOUTS_BOOK[name])
                      : (typeof WHEREABOUTS !== "undefined" && WHEREABOUTS[name]);
    if (!tl) return null;
    const pt = storyPoint();
    // gate by the chosen point only when it belongs to the same telling
    const limit = pt && ((pt.type === "book") === isBook)
      ? (pt.type === "book" ? [pt.b, pt.ch] : [pt.s, pt.e])
      : null;
    const stops = [];
    let prevLoc = null;
    for (let i = 0; i < tl.length; i++) {
      const [a, b, loc] = tl[i];
      if (limit && (a > limit[0] || (a === limit[0] && b > limit[1]))) break;
      if (!loc) { prevLoc = null; continue; }
      if (loc === prevLoc) continue;
      prevLoc = loc;
      let x, y, placeName;
      if (WB_SPOTS[loc]) { x = WB_SPOTS[loc][0]; y = WB_SPOTS[loc][1]; placeName = WB_SPOT_NAMES[loc] || loc; }
      else if (locById[loc]) { x = locById[loc].x; y = locById[loc].y; placeName = locById[loc].name; }
      else continue;
      let tag;
      if (isBook) tag = `${bookByN[a].short} · Ch. ${b}`;
      else {
        const epi = seasonByN[a] && seasonByN[a].episodes[b - 1];
        tag = `S${a} · E${b}${epi ? " — " + epi.title : ""}`;
      }
      stops.push({ at: [x, y], name: placeName, tag, note: `From ${tag}, the tale finds ${name} at ${placeName.toLowerCase().startsWith("the ") ? placeName.charAt(0).toLowerCase() + placeName.slice(1) : placeName}.` });
    }
    return {
      id: `road:${name}`,
      character: name,
      color: roadColor(name),
      summary: stops.length
        ? `their road through the ${isBook ? "books" : "show"} · ${stops.length} ${stops.length === 1 ? "stop" : "stops"}${limit ? " so far" : ""}`
        : `their road through the ${isBook ? "books" : "show"}`,
      generated: true,
      stops,
    };
  }

  function showCharacterRoad(name) {
    const road = characterRoad(name);
    if (!road) return;
    setMode("journeys");
    state.selectedJourneyId = road.id;
    byId("char-card").classList.add("hidden"); // clear the view onto the road
    showJourney(road);
  }

  function renderJourneyCard(journey, fraction) {
    const idx = Math.min(Math.round(fraction), journey.stops.length - 1);
    const stop = journey.stops[idx];
    const pt = stopCoords(stop);
    els.sidebar.innerHTML = `
      <div class="loc-kicker">Chronicle of Travel</div>
      <div class="loc-title journey-title">${avatarHTML(journey.character, journey.color)}${journey.character}</div>
      <div class="loc-subtitle">${journey.summary}</div>
      <div class="sidebar-divider"></div>
      <div class="stop-list">
        ${journey.stops.map((s, i) => {
          const p = stopCoords(s);
          return `<button class="stop-row ${i === idx ? "active" : ""}" data-stop="${i}">
            <span class="stop-num" style="${i <= idx ? `background:${journey.color};color:#f0e6d2` : ""}">${i + 1}</span>
            <span class="stop-row-text">
              <span class="stop-row-title">${p.name}</span>
              <span class="stop-row-ep">${stopTag(s)}</span>
            </span>
          </button>`;
        }).join("")}
      </div>
      <div class="sidebar-divider"></div>
      <div class="loc-lore-head">Stop ${idx + 1} — ${pt.name}</div>
      <p class="loc-lore">${stop.note}</p>
    `;
    els.sidebar.querySelectorAll("[data-stop]").forEach((btn) => {
      btn.addEventListener("click", () => {
        stopPlayback();
        const i = parseInt(btn.dataset.stop, 10);
        els.scrubber.value = String(i);
        mapView.setTraveler(i);
        renderJourneyCard(journey, i);
        const p = stopCoords(journey.stops[i]);
        mapView.focusOn(p.x, p.y, Math.max(mapView.state.scale, 2.2));
      });
    });
    updateStopLabel(journey, idx);
  }

  function updateStopLabel(journey, fraction) {
    const idx = Math.min(Math.round(fraction), journey.stops.length - 1);
    const stop = journey.stops[idx];
    const pt = stopCoords(stop);
    els.playerStopLabel.innerHTML = `STOP ${idx + 1} OF ${journey.stops.length} &mdash; <b>${pt.name}</b><br/><span class="stop-note">${stopTag(stop)}</span>`;
  }

  els.scrubber.addEventListener("input", () => {
    if (state.book && state.mode !== "journeys") {
      stopPlayback();
      const v = parseInt(els.scrubber.value, 10);
      if (state.scrubAll) { const t = fromGlobalCh(v); selectChapter(t.b, t.ch); }
      else selectChapter(state.book, v);
      return;
    }
    if (state.episode && state.mode !== "journeys") {
      stopPlayback();
      const v = parseInt(els.scrubber.value, 10);
      if (state.scrubAll) { const t = fromGlobalEp(v); selectEpisode(t.s, t.e); }
      else selectEpisode(state.season, v);
      return;
    }
    const journey = currentJourney();
    if (!journey) return;
    stopPlayback();
    const fraction = parseFloat(els.scrubber.value);
    mapView.setTraveler(fraction);
    updateStopLabel(journey, fraction);
  });

  els.scrubber.addEventListener("change", () => {
    if ((state.episode || state.book) && state.mode !== "journeys") return;
    const journey = currentJourney();
    if (journey) renderJourneyCard(journey, parseFloat(els.scrubber.value));
  });

  els.playBtn.addEventListener("click", () => {
    if (state.playing) { stopPlayback(); return; }
    if (state.book && state.mode !== "journeys") startChapterPlayback();
    else if (state.episode && state.mode !== "journeys") startEpisodePlayback();
    else startPlayback();
  });

  function startChapterPlayback() {
    if (!state.book || !state.chapter) return;
    const book = bookByN[state.book];
    state.playing = true;
    const token = ++state.playToken;
    els.playBtn.textContent = "❚❚";
    let current = state.chapter;
    if (current >= book.chapters) current = 0;

    function tick() {
      if (token !== state.playToken || !state.playing) return;
      // jump beat to beat rather than crawling chapter by chapter
      const b = bookByN[state.book];
      const beat = beatForChapter(b, Math.max(current, 1));
      const next = current < 1 ? 1 : (beat.to + 1);
      if (next > b.chapters) {
        if (state.scrubAll && bookByN[state.book + 1]) {
          // roll on into the next novel
          selectChapter(state.book + 1, 1);
          current = 1;
          setTimeout(tick, 3600);
          return;
        }
        stopPlayback(); return;
      }
      current = next;
      selectChapter(state.book, current);
      setTimeout(tick, 3600);
    }
    setTimeout(tick, 400);
  }

  mapView.onUserPan = () => { state.cameraFollow = false; };

  // clicking a banner opens that house / order / noble-house panel
  mapView.onBannerClick = (seat) => {
    if (seat.groupId) {
      setMode("houses");
      selectGroup(seat.groupId);
    } else if (seat.locId) {
      const loc = locById[seat.locId];
      setMode("map");
      state.selectedLocationId = loc.id;
      mapView.setSelectedMarker(loc.id);
      mapView.focusOn(loc.x, loc.y, 4.2);
      renderLocationCard(loc);
    }
  };

  // clicking a face-chip opens that person's card
  mapView.onPersonClick = (name) => openCharacterCard(name);
  mapView.onDeathClick = (name) => openCharacterCard(name); // the card shows the death, since it already came to pass

  // clicking empty map deselects the current location (and closes the char card)
  mapView.onBackgroundClick = () => {
    const card = byId("char-card");
    if (card && !card.classList.contains("hidden")) card.classList.add("hidden");
    if (state.selectedLocationId) {
      state.selectedLocationId = null;
      mapView.setSelectedMarker(null);
      refreshMarkers();
      if (state.season && state.episode) renderEpisodePanel(state.season, state.episode);
      else if (state.book && state.chapter) renderChapterPanel(state.book, state.chapter);
      else renderWelcome();
    }
  };

  function startPlayback() {
    const journey = currentJourney();
    if (!journey) return;
    const max = journey.stops.length - 1;
    let current = parseFloat(els.scrubber.value);
    if (current >= max - 0.001) current = 0;
    state.playing = true;
    state.cameraFollow = true;
    const token = ++state.playToken;
    els.playBtn.textContent = "❚❚";

    const msPerLeg = 2600;
    const pauseMs = 2400;
    let last = performance.now();
    let pausedUntil = 0;
    let lastShownStop = Math.round(current);
    renderJourneyCard(journey, current);

    function frame(t) {
      if (token !== state.playToken || !state.playing) return;
      const dt = t - last;
      last = t;

      if (t >= pausedUntil) {
        const prev = current;
        current += dt / msPerLeg;
        // pause when crossing a stop
        const crossed = Math.floor(current) > Math.floor(prev) && current < max;
        if (crossed) {
          current = Math.floor(current);
          pausedUntil = t + pauseMs;
        }
        if (current >= max) current = max;

        els.scrubber.value = String(current);
        mapView.setTraveler(current);
        updateStopLabel(journey, current);

        const nearest = Math.round(current);
        if (nearest !== lastShownStop && Math.abs(current - nearest) < 0.05) {
          lastShownStop = nearest;
          renderJourneyCard(journey, nearest);
        }
      }

      if (state.cameraFollow) {
        const pt = mapView.getTravelerPoint();
        if (pt) mapView.nudgeToward(pt.x, pt.y, 0.06, Math.max(mapView.state.scale, 2.4));
      }

      if (current >= max) {
        renderJourneyCard(journey, max);
        stopPlayback();
        return;
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function stopPlayback() {
    state.playing = false;
    state.playToken++;
    els.playBtn.textContent = "▶";
  }

  // ================= houses =================

  // selectGroup handles great houses, orders, and noble houses alike.
  function selectGroup(groupId) {
    const entry = GROUP_BY_ID[groupId];
    if (!entry) return;
    const info = groupInfoById[groupId];
    state.selectedHouseId = groupId;
    state.filters.banners = true;
    const bannersToggle = byId("f-banners");
    if (bannersToggle) bannersToggle.checked = true;
    refreshMarkers();

    const seat = info.seat ? locById[info.seat] : null;
    if (seat) mapView.focusOn(seat.x, seat.y, 2.8);

    const members = groupMembersAt(info.group, storyPoint()).filter(inLore);
    const kicker = info.kind === "great" ? `Great House &middot; ${info.region ? regionById[info.region].name : ""}`
      : info.kind === "order" ? "An Order of the Known World"
      : `Noble House${info.region ? ` &middot; ${regionById[info.region] ? regionById[info.region].name : ""}` : ""}`;
    const rosterHead = info.kind === "great" ? "The Family &amp; Its People"
      : info.kind === "order" ? "Its Members" : "The Family &amp; Its People";

    const shieldHTML = info.emblem && info.emblem.img
      ? `<img src="assets/sigils/${info.emblem.img}" alt="${info.name}"/>`
      : emblemHTML(info.emblem, "house-shield-emblem");

    els.sidebar.innerHTML = `
      <div class="loc-kicker">${kicker}</div>
      <div class="house-shield">${shieldHTML}</div>
      <div class="loc-title house-title">${info.name}</div>
      ${info.words ? `<div class="house-words">&ldquo;${info.words}&rdquo;</div>` : ""}
      ${seat ? `<div class="loc-subtitle">Seat: ${seat.name}</div>` : ""}
      <div class="sidebar-divider"></div>
      <p class="loc-desc">${linkifyNames(info.blurb || "")}</p>
      ${members.length ? `
        <div class="sidebar-divider"></div>
        <div class="loc-lore-head">${rosterHead}</div>
        <div class="people-list">${members.map((m) =>
          `<button class="person-row" data-char-open="${m}">${avatarHTML(m)}<span class="person-text"><span class="person-name">${m}</span></span></button>`).join("")}</div>` : ""}
      <div class="sidebar-divider"></div>
      ${seat ? `<button class="side-btn" id="btn-house-seat">Travel to ${seat.name}</button>` : ""}
      <button class="side-btn side-btn-ghost" id="btn-back-welcome">Back to the Ledger</button>
    `;
    els.sidebar.querySelectorAll("[data-char-open]").forEach((btn) => {
      btn.addEventListener("click", () => openCharacterCard(btn.dataset.charOpen));
    });
    bindCharLinks(els.sidebar);
    if (seat) byId("btn-house-seat").addEventListener("click", () => mapView.focusOn(seat.x, seat.y, 4.2));
    byId("btn-back-welcome").addEventListener("click", () => {
      state.selectedHouseId = null;
      refreshMarkers();
      renderWelcome();
    });
  }
  const selectHouse = selectGroup; // back-compat alias

  // ================= regions =================

  function selectRegion(regionId) {
    state.selectedRegionId = regionId;
    refreshMarkers();
    const r = regionById[regionId];
    const locs = WORLD.locations.filter((l) => l.region === regionId);
    if (locs.length) mapView.fitBounds(locs);

    els.sidebar.innerHTML = `
      <div class="loc-kicker">Region of the Realm</div>
      <div class="loc-title">${r.name}</div>
      <div class="sidebar-divider"></div>
      <p class="loc-desc">${r.description}</p>
      <div class="loc-lore-head">This Season</div>
      <p class="loc-lore">${r.season}</p>
      <div class="sidebar-divider"></div>
      <div class="sidebar-title">Places of ${r.name}</div>
      <div class="loc-list">
        ${locs.sort((a, b) => a.rank - b.rank || a.name.localeCompare(b.name)).map((l) =>
          `<button class="loc-list-item" data-loc="${l.id}">${l.name}<span>${TYPE_LABEL[l.type]}</span></button>`).join("")}
      </div>
      <div class="sidebar-divider"></div>
      <button class="side-btn side-btn-ghost" id="btn-back-welcome">Back to the Ledger</button>
    `;
    els.sidebar.querySelectorAll("[data-loc]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const loc = locById[btn.dataset.loc];
        state.selectedLocationId = loc.id;
        mapView.setSelectedMarker(loc.id);
        mapView.focusOn(loc.x, loc.y, 4.2);
        renderLocationCard(loc);
      });
    });
    byId("btn-back-welcome").addEventListener("click", () => {
      state.selectedRegionId = null;
      refreshMarkers();
      renderWelcome();
      mapView.reset();
    });
  }

  // ================= search =================

  // the search index covers every person, place, house/order, region,
  // episode and book — so you can jump to any of them from the search box.
  const searchIndex = (() => {
    const idx = [];
    const seen = new Set(); // dedupe character aliases by object identity
    Object.keys(CHARACTERS).forEach((name) => {
      const c = CHARACTERS[name];
      if (seen.has(c)) return;
      seen.add(c);
      idx.push({ kind: "Character", label: name, sub: c.born || "", id: name });
    });
    GROUP_SECTIONS.forEach((sec) => sec.groups.forEach((g) => {
      const info = groupInfoById[g.id];
      idx.push({ kind: sec.kind === "order" ? "Order" : "House", label: info.name, sub: info.words || "", id: g.id });
    }));
    WORLD.locations.forEach((l) => idx.push({ kind: "Place", label: l.name, sub: l.subtitle || "", id: l.id }));
    WORLD.regions.forEach((r) => idx.push({ kind: "Region", label: r.name, sub: "", id: r.id }));
    ALL_SEASONS.forEach((s) => s.episodes.forEach((e) =>
      idx.push({ kind: "Episode", label: `S${s.n}·E${e.n} — ${e.title}`, sub: s.name, id: `${s.n}-${e.n}` })));
    BOOKS.forEach((b) => idx.push({ kind: "Book", label: b.name, sub: `${b.chapters} chapters`, id: String(b.n) }));
    return idx;
  })();

  els.searchInput.addEventListener("input", () => {
    const q = els.searchInput.value.trim().toLowerCase();
    if (!q) return hideSearchResults();
    const matches = searchIndex
      .filter((it) => it.kind !== "Character" || inLore(it.id))
      .map((it) => {
        const label = it.label.toLowerCase(), sub = (it.sub || "").toLowerCase();
        let score = -1;
        if (label.startsWith(q)) score = 0;
        else if (label.includes(q)) score = 1;
        else if (sub.includes(q)) score = 2;
        return { it, score };
      })
      .filter((x) => x.score >= 0)
      .sort((a, b) => a.score - b.score)
      .slice(0, 12)
      .map((x) => x.it);
    if (!matches.length) {
      els.searchResults.innerHTML = `<div class="search-empty">No souls, places, or chronicles found.</div>`;
      els.searchResults.classList.remove("hidden");
      return;
    }
    els.searchResults.innerHTML = matches.map((m) =>
      `<button class="search-result" data-kind="${m.kind}" data-id="${m.id}">
        ${m.kind === "Character" ? avatarHTML(m.label) : `<span class="search-kind">${m.kind}</span>`}
        <span class="search-result-label">${m.label}</span>
      </button>`).join("");
    els.searchResults.classList.remove("hidden");
    els.searchResults.querySelectorAll(".search-result").forEach((btn) => {
      btn.addEventListener("click", () => handleSearchSelect(btn.dataset.kind, btn.dataset.id));
    });
  });

  function handleSearchSelect(kind, id) {
    hideSearchResults();
    els.searchInput.value = "";
    if (kind === "Place") {
      setMode("map");
      const loc = locById[id];
      state.selectedLocationId = id;
      refreshMarkers();
      mapView.setSelectedMarker(id);
      mapView.focusOn(loc.x, loc.y, 4.2);
      renderLocationCard(loc);
    } else if (kind === "House" || kind === "Order") {
      setMode("houses");
      selectGroup(id);
    } else if (kind === "Region") {
      setMode("regions");
      selectRegion(id);
    } else if (kind === "Character") {
      openCharacterCard(id);
    } else if (kind === "Episode") {
      const parts = id.split("-");
      selectEpisode(parseInt(parts[0], 10), parseInt(parts[1], 10));
    } else if (kind === "Book") {
      selectChapter(parseInt(id, 10), 1);
    }
  }

  function hideSearchResults() {
    els.searchResults.classList.add("hidden");
  }

  document.addEventListener("mousedown", (e) => {
    if (!els.searchResults.contains(e.target) && e.target !== els.searchInput) hideSearchResults();
  });
  document.addEventListener("click", (e) => {
    if (!els.searchResults.contains(e.target) && e.target !== els.searchInput) hideSearchResults();
  });
  // leaving the search box hides suggestions (delayed so a result click still registers)
  els.searchInput.addEventListener("blur", () => setTimeout(hideSearchResults, 150));
  // returning to the search box brings the suggestions back for whatever is typed
  els.searchInput.addEventListener("focus", () => {
    if (els.searchInput.value.trim()) els.searchInput.dispatchEvent(new Event("input"));
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { hideSearchResults(); closeDropdowns(); els.searchInput.blur(); }
  });

  // ================= seasons & episodes =================

  const seasonItem = byId("season-item");
  const seasonDropdown = byId("season-dropdown");

  /* the story menu's two shelves ARE the two tellings: switching shelf switches
     the whole site's lore (people, fates, rosters), same as the opening door */
  let storyShelf = "show";
  function syncShelfToLore() { storyShelf = state.lore === "book" ? "books" : "show"; }

  function buildSeasonDropdown(expanded) {
    syncShelfToLore();
    let s = `<div class="story-tabs">
      <button class="story-tab ${storyShelf === "show" ? "active" : ""}" data-shelf="show">&#128250; The Show</button>
      <button class="story-tab ${storyShelf === "books" ? "active" : ""}" data-shelf="books">&#128214; The Book</button>
    </div>
    <div class="dropdown-note story-tabs-note">Choosing a shelf sets the whole telling &mdash; people and fates follow.</div>`;

    if (storyShelf === "show") {
      s += `<div class="dropdown-title">The Chronicle, Season by Season</div>`;
      ALL_SEASONS.forEach((season) => {
        const isOpen = season.n === expanded;
        s += `<button class="season-row ${isOpen ? "expanded" : ""}" data-season="${season.n}">
          <span class="season-dot"></span> ${season.name} <span class="season-row-caret">${isOpen ? "&#9662;" : "&#9656;"}</span>
        </button>`;
        if (isOpen) {
          s += `<div class="episode-list">` + season.episodes.map((e) =>
            `<button class="ep-row ${state.season === season.n && state.episode === e.n ? "active" : ""}" data-season-n="${season.n}" data-ep="${e.n}">
              <span class="ep-num">E${e.n}</span><span class="ep-title">${e.title}</span>
            </button>`).join("") + `</div>`;
        }
      });
    } else {
      s += `<div class="dropdown-title">Fire &amp; Blood &mdash; the Dance, Chapter by Chapter</div>`;
      BOOKS.forEach((book) => {
        const isOpen = book.n === expanded;
        s += `<button class="season-row ${isOpen ? "expanded" : ""}" data-book="${book.n}">
          <span class="season-dot season-dot-book"></span> ${book.name} <span class="season-row-caret">${isOpen ? "&#9662;" : "&#9656;"}</span>
        </button>`;
        if (isOpen) {
          s += `<div class="chapter-grid chapter-grid-pov">`;
          for (let c = 1; c <= book.chapters; c++) {
            const active = state.book === book.n && state.chapter === c;
            const label = book.chs && book.chs[c - 1] ? book.chs[c - 1][0] : String(c);
            const pov = label.indexOf("·") >= 0 ? label.split("·")[0].trim() : label;
            s += `<button class="ch-cell ch-cell-pov ${active ? "active" : ""}" data-book-n="${book.n}" data-ch="${c}"><span class="ch-num">${c}</span><span class="ch-pov">${pov}</span></button>`;
          }
          s += `</div><div class="dropdown-note">${book.chapters} chapters, each named for the eyes it looks through &middot; pick one</div>`;
        }
      });
    }
    seasonDropdown.innerHTML = s;

    seasonDropdown.querySelectorAll(".story-tab").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        setLore(btn.dataset.shelf === "books" ? "book" : "show"); // shelf = telling
        exitEpisode({ silent: true });
        selectDefaultStoryPoint(); // the new telling opens at its own first page
        buildSeasonDropdown(1);
      });
    });
    seasonDropdown.querySelectorAll("[data-season]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const n = parseInt(btn.dataset.season, 10);
        buildSeasonDropdown(n === expanded ? null : n);
      });
    });
    seasonDropdown.querySelectorAll("[data-book]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const n = parseInt(btn.dataset.book, 10);
        buildSeasonDropdown(n === expanded ? null : n);
      });
    });
    seasonDropdown.querySelectorAll("[data-ep]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        selectEpisode(parseInt(btn.dataset.seasonN, 10), parseInt(btn.dataset.ep, 10));
        seasonItem.classList.remove("open");
      });
    });
    seasonDropdown.querySelectorAll("[data-ch]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        selectChapter(parseInt(btn.dataset.bookN, 10), parseInt(btn.dataset.ch, 10));
        seasonItem.classList.remove("open");
      });
    });
  }

  els.seasonBadge.addEventListener("click", (e) => {
    e.stopPropagation();
    const open = seasonItem.classList.toggle("open");
    if (open) buildSeasonDropdown(storyShelf === "show" ? (state.season || 1) : (state.book || 1));
  });
  document.addEventListener("click", (e) => {
    if (!seasonItem.contains(e.target)) seasonItem.classList.remove("open");
  });

  /* where a journey stands at the end of episode `ep` (fractional stop index) */
  function fractionForEpisode(journey, ep) {
    const st = journey.stops;
    if (ep < st[0].episode) return 0;
    let idx = 0;
    for (let i = 0; i < st.length; i++) if (st[i].episode <= ep) idx = i;
    if (idx >= st.length - 1) return st.length - 1;
    const span = st[idx + 1].episode - st[idx].episode;
    const t = span > 0 ? (ep - st[idx].episode) / span : 0;
    return idx + Math.min(t, 0.999);
  }

  function selectEpisode(seasonN, n) {
    const season = seasonByN[seasonN];
    if (!season || !season.episodes[n - 1]) return;
    state.book = null; state.chapter = null;
    setMode("map");
    if (state.season !== seasonN) state.epJourneyId = null; // journey traces are per-season (S1)
    state.season = seasonN;
    state.episode = n;
    byId("season-badge-label").textContent = `S${seasonN} · E${n}`;
    buildHousesMenu(); // gated rosters follow the story point
    renderEpisodePanel(seasonN, n);
    showEpisodePlayer(seasonN, n);
    refreshPeopleLayer(); // faces stand where the episode has them
    if (state.epJourneyId) traceEpisodeJourney(state.epJourneyId, { animateCamera: false });
  }

  function exitEpisode({ silent } = {}) {
    state.season = null;
    state.episode = null;
    state.epJourneyId = null;
    state.book = null;
    state.chapter = null;
    state.scrubAll = false;
    byId("season-badge-label").textContent = "The Story";
    stopPlayback();
    els.player.classList.add("hidden");
    mapView.clearRoute();
    buildHousesMenu();
    refreshPeopleLayer(); // no episode chosen — no faces on the map
    if (!silent) { refreshMarkers(); renderWelcome(); }
  }

  // ================= the books =================

  function beatForChapter(book, ch) {
    return book.beats.find((b) => ch >= b.from && ch <= b.to) || book.beats[book.beats.length - 1];
  }

  function selectChapter(bookN, ch) {
    const book = bookByN[bookN];
    if (!book || ch < 1 || ch > book.chapters) return;
    state.season = null; state.episode = null; state.epJourneyId = null;
    setMode("map");
    state.book = bookN;
    state.chapter = ch;
    byId("season-badge-label").textContent = `${book.short} · Ch. ${ch}`;
    buildHousesMenu(); // gated rosters follow the story point
    renderChapterPanel(bookN, ch);
    showChapterPlayer(bookN, ch);
    refreshPeopleLayer(); // faces stand where the chapters have them
  }

  /* the tale always stands somewhere: with no episode/chapter chosen (or a
     point left over from the other telling), default to S1·E1 in the show's
     telling and Book 1 · Ch. 1 in the books' */
  function selectDefaultStoryPoint() {
    if (state.lore === "book") {
      if (!(state.book && state.chapter)) selectChapter(1, 1);
    } else if (!(state.season && state.episode)) {
      selectEpisode(1, 1);
    }
  }

  function renderChapterPanel(bookN, ch) {
    const book = bookByN[bookN];
    const beat = beatForChapter(book, ch);
    const throneHouse = houseById[beat.throne.house];
    const chEntry = (book.chs && book.chs[ch - 1]) || [String(ch), ""];
    const povLabel = chEntry[0];
    const povName = povCharacter(povLabel);
    const chText = chEntry[1];

    const peopleHtml = beat.people.map((p, i) => {
      const j = p.j ? WORLD.journeys.find((x) => x.id === p.j) : null;
      const color = j ? j.color : "#6b6b6b";
      return `<button class="person-row" data-person="${i}">
        ${avatarHTML(p.name, color)}
        <span class="person-text"><span class="person-name">${p.name}</span>
        <span class="person-note">${p.note}</span></span>
      </button>`;
    }).join("");

    const powerHtml = Object.entries(beat.power)
      .sort((a, b) => b[1] - a[1])
      .map(([hid, score]) => {
        const h = houseById[hid];
        return `<div class="power-row">
          <img class="power-sigil" src="${sigilSrc(hid)}" alt=""/>
          <span class="power-name">${h.name.replace("House ", "")}</span>
          <span class="power-bar"><span class="power-fill" style="width:${score * 10}%"></span></span>
          <span class="power-score">${score}</span>
        </div>`;
      }).join("");

    const dead = [];
    if (book.chs) {
      for (let i = 0; i < ch && i < book.chs.length; i++) {
        const dd = book.chs[i][2];
        if (dd) dd.forEach((d) => dead.push({ name: d[0], note: d[1], at: `Chapter ${i + 1} · ${book.chs[i][0]}` }));
      }
    }
    const deathsHtml = dead.length
      ? dead.map((d) => `<div class="death-row"><span class="death-ep" title="${d.at}">&#10013;</span><span class="death-text"><b>${linkifyNames(d.name)}</b> — ${linkifyNames(d.note)}</span></div>`).join("")
      : `<p class="sidebar-note">No one of note has died. Keep reading.</p>`;

    els.sidebar.innerHTML = `
      <div class="loc-kicker">${book.name} &middot; Chapter ${ch} of ${book.chapters}</div>
      <div class="loc-title journey-title">${avatarHTML(povName, "#5a4a7a")}${povLabel}</div>
      <div class="loc-subtitle">through the eyes of ${charLink(povName)} &middot; ${beat.title}</div>

      <div class="loc-lore-head">This Chapter</div>
      <p class="loc-lore ch-summary">${linkifyNames(chText)}</p>

      <div class="throne-box">
        <div class="throne-crown">&#9818;</div>
        <div class="throne-text">
          <div class="throne-king">${beat.throne.king}</div>
          <div class="throne-house">${throneHouse ? throneHouse.name : ""} &middot; ${throneHouse ? "&ldquo;" + throneHouse.words + "&rdquo;" : ""}</div>
          <div class="throne-hand"><b>Hand of the King:</b> ${beat.throne.hand}</div>
        </div>
      </div>

      <div class="loc-lore-head">The Wider Tale &mdash; ${beat.title} (chapters ${beat.from}&ndash;${beat.to})</div>
      <ul class="event-list">${beat.events.map((e) => `<li>${linkifyNames(e)}</li>`).join("")}</ul>

      <div class="sidebar-divider"></div>
      <div class="loc-lore-head">People of These Chapters</div>
      <div class="people-list">${peopleHtml}</div>

      <div class="sidebar-divider"></div>
      <div class="loc-lore-head">The Balance of Power</div>
      <div class="power-list">${powerHtml}</div>

      <div class="sidebar-divider"></div>
      <div class="loc-lore-head">The Dead of This Book, So Far</div>
      <div class="death-list">${deathsHtml}</div>

      <div class="sidebar-divider"></div>
      <button class="side-btn side-btn-ghost" id="btn-exit-episode">Close the Book</button>
    `;

    els.sidebar.querySelectorAll("[data-person]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const p = beat.people[parseInt(btn.dataset.person, 10)];
        if (p.loc && locById[p.loc]) {
          const loc = locById[p.loc];
          state.selectedLocationId = loc.id;
          mapView.setSelectedMarker(loc.id);
          mapView.focusOn(loc.x, loc.y, 3.2);
        }
        if (typeof openCharacterCard === "function") openCharacterCard(p.name);
      });
    });
    bindCharLinks(els.sidebar);
    byId("btn-exit-episode").addEventListener("click", () => exitEpisode());
    els.sidebar.scrollTop = 0;
  }

  // ---- the whole tale on one line: global episode/chapter indexing ----

  const TOTAL_EPS = ALL_SEASONS.reduce((a, s) => a + s.episodes.length, 0);
  const TOTAL_CHS = BOOKS.reduce((a, b) => a + b.chapters, 0);
  function globalEp(s, e) { let g = e; for (let i = 1; i < s; i++) g += seasonByN[i].episodes.length; return g; }
  function fromGlobalEp(g) { let s = 1; while (seasonByN[s] && g > seasonByN[s].episodes.length) { g -= seasonByN[s].episodes.length; s++; } return { s, e: g }; }
  function globalCh(b, ch) { let g = ch; for (let i = 1; i < b; i++) g += bookByN[i].chapters; return g; }
  function fromGlobalCh(g) { let b = 1; while (bookByN[b] && g > bookByN[b].chapters) { g -= bookByN[b].chapters; b++; } return { b, ch: g }; }

  /* the little chooser above the player: switch season/book, or take the whole line */
  const playerSwitch = byId("player-switch");
  function hidePlayerSwitch() { playerSwitch.classList.add("hidden"); }
  function openPlayerSwitch() {
    const isBook = !!state.book;
    let html = `<div class="ps-title">${isBook ? "Choose a book" : "Choose a season"}</div>`;
    html += `<button class="ps-item ${state.scrubAll ? "active" : ""}" data-ps="all">
      ${isBook ? `&#128218; All Books &mdash; one line, ${TOTAL_CHS} chapters` : `&#127902; All Seasons &mdash; one line, ${TOTAL_EPS} episodes`}</button>`;
    if (isBook) BOOKS.forEach((b) => {
      html += `<button class="ps-item ${!state.scrubAll && state.book === b.n ? "active" : ""}" data-ps="b:${b.n}">${b.short} &mdash; ${b.name}</button>`;
    });
    else ALL_SEASONS.forEach((s) => {
      html += `<button class="ps-item ${!state.scrubAll && state.season === s.n ? "active" : ""}" data-ps="s:${s.n}">S${s.n} &mdash; ${s.name}</button>`;
    });
    playerSwitch.innerHTML = html;
    playerSwitch.classList.remove("hidden");
    playerSwitch.querySelectorAll(".ps-item").forEach((btn) => {
      btn.addEventListener("click", () => {
        const v = btn.dataset.ps;
        if (v === "all") {
          state.scrubAll = true;
          if (state.book) showChapterPlayer(state.book, state.chapter);
          else showEpisodePlayer(state.season, state.episode);
        } else {
          const [kind, n] = v.split(":");
          state.scrubAll = false;
          if (kind === "b") selectChapter(parseInt(n, 10), 1);
          else selectEpisode(parseInt(n, 10), 1);
        }
        hidePlayerSwitch();
      });
    });
  }
  els.playerCharacter.addEventListener("click", () => {
    if (state.mode === "journeys" || (!state.episode && !state.book)) return;
    if (playerSwitch.classList.contains("hidden")) openPlayerSwitch();
    else hidePlayerSwitch();
  });
  document.addEventListener("mousedown", (e) => {
    if (playerSwitch.classList.contains("hidden")) return;
    if (!playerSwitch.contains(e.target) && !els.playerCharacter.contains(e.target)) hidePlayerSwitch();
  });

  function showChapterPlayer(bookN, ch) {
    const book = bookByN[bookN];
    const beat = beatForChapter(book, ch);
    els.player.classList.remove("hidden");
    els.playerCharacter.classList.add("player-switchable");
    const caret = `<span class="ps-caret">&#9662;</span>`;
    if (state.scrubAll) {
      els.playerCharacter.innerHTML = `<span class="avatar" style="background:#5a4a7a">ALL</span> All Books ${caret}`;
      els.playerJourneySummary.textContent = "the five novels on one line";
      els.scrubber.min = "1";
      els.scrubber.max = String(TOTAL_CHS);
      els.scrubber.step = "1";
      els.scrubber.value = String(globalCh(bookN, ch));
      els.scrubberTicks.innerHTML = BOOKS.map((b) => {
        const start = globalCh(b.n, 1);
        const pct = ((start - 1) / (TOTAL_CHS - 1)) * 100;
        return `<span class="tick ${start <= globalCh(bookN, ch) ? "tick-past" : ""}" style="left:${pct}%" title="${b.short} — ${b.name}"></span>`;
      }).join("");
    } else {
      els.playerCharacter.innerHTML = `<span class="avatar" style="background:#5a4a7a">${book.short.slice(0, 2)}</span> ${book.name} ${caret}`;
      els.playerJourneySummary.textContent = "the tale, chapter by chapter";
      els.scrubber.min = "1";
      els.scrubber.max = String(book.chapters);
      els.scrubber.step = "1";
      els.scrubber.value = String(ch);
      els.scrubberTicks.innerHTML = book.beats.map((b) => {
        const pct = ((b.from - 1) / (book.chapters - 1)) * 100;
        return `<span class="tick ${b.from <= ch ? "tick-past" : ""}" style="left:${pct}%" title="Ch. ${b.from}: ${b.title}"></span>`;
      }).join("");
    }
    const povLabel = (book.chs && book.chs[ch - 1]) ? book.chs[ch - 1][0] : "";
    els.playerStopLabel.innerHTML = `${book.short} &middot; CHAPTER ${ch} OF ${book.chapters} &mdash; <b>${povLabel}</b><br/><span class="stop-note">${beat.title} &middot; ${beat.throne.king} holds the throne</span>`;
    if (!state.playing) els.playBtn.textContent = "▶";
  }

  // ---- episode panel (left) ----

  function renderEpisodePanel(seasonN, n) {
    const season = seasonByN[seasonN];
    const ep = season.episodes[n - 1];
    const throneHouse = houseById[ep.throne.house];

    const peopleHtml = ep.people.map((p, i) => {
      const j = p.j ? WORLD.journeys.find((x) => x.id === p.j) : null;
      const color = j ? j.color : "#6b6b6b";
      return `<button class="person-row" data-person="${i}">
        ${avatarHTML(p.name, color)}
        <span class="person-text"><span class="person-name">${p.name}</span>
        <span class="person-note">${p.note}</span></span>
        ${j ? '<span class="person-trace" title="Their road can be traced">&#10142;</span>' : ""}
      </button>`;
    }).join("");

    const powerHtml = Object.entries(ep.power)
      .sort((a, b) => b[1] - a[1])
      .map(([hid, score]) => {
        const h = houseById[hid];
        return `<div class="power-row">
          <img class="power-sigil" src="${sigilSrc(hid)}" alt=""/>
          <span class="power-name">${h.name.replace("House ", "")}</span>
          <span class="power-bar"><span class="power-fill" style="width:${score * 10}%"></span></span>
          <span class="power-score">${score}</span>
        </div>`;
      }).join("");

    const dead = [];
    for (let i = 0; i < n; i++) {
      season.episodes[i].deaths.forEach((d) => dead.push({ ...d, ep: season.episodes[i].n }));
    }
    const deathsHtml = dead.length
      ? dead.map((d) => `<div class="death-row"><span class="death-ep">E${d.ep}</span><span class="death-text"><b>${linkifyNames(d.name)}</b> — ${linkifyNames(d.note)}</span></div>`).join("")
      : `<p class="sidebar-note">No one of note has died. It will not last.</p>`;

    els.sidebar.innerHTML = `
      <div class="loc-kicker">${season.name} &middot; Episode ${ep.n}</div>
      <div class="loc-title">${ep.title}</div>

      <div class="throne-box">
        <div class="throne-crown">&#9818;</div>
        <div class="throne-text">
          <div class="throne-king">${ep.throne.king}</div>
          <div class="throne-house">${throneHouse ? throneHouse.name : ""} &middot; ${throneHouse ? "&ldquo;" + throneHouse.words + "&rdquo;" : ""}</div>
          <div class="throne-hand"><b>Hand of the King:</b> ${ep.throne.hand}</div>
        </div>
      </div>

      <div class="loc-lore-head">What Comes to Pass</div>
      <ul class="event-list">${ep.events.map((e) => `<li>${linkifyNames(e)}</li>`).join("")}</ul>

      <div class="sidebar-divider"></div>
      <div class="loc-lore-head">People of the Episode</div>
      <div class="people-list">${peopleHtml}</div>

      <div class="sidebar-divider"></div>
      <div class="loc-lore-head">The Balance of Power</div>
      <div class="power-list">${powerHtml}</div>

      <div class="sidebar-divider"></div>
      <div class="loc-lore-head">The Dead</div>
      <div class="death-list">${deathsHtml}</div>

      <div class="sidebar-divider"></div>
      <button class="side-btn side-btn-ghost" id="btn-exit-episode">Close the Episode</button>
    `;

    els.sidebar.querySelectorAll("[data-person]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const p = ep.people[parseInt(btn.dataset.person, 10)];
        openCharacterCard(p.name);
        if (p.j && seasonN === 1) {
          state.epJourneyId = p.j;
          traceEpisodeJourney(p.j, { animateCamera: true });
        } else if (p.loc && locById[p.loc]) {
          const loc = locById[p.loc];
          state.selectedLocationId = loc.id;
          mapView.setSelectedMarker(loc.id);
          mapView.focusOn(loc.x, loc.y, 3.2);
        }
      });
    });
    bindCharLinks(els.sidebar);
    byId("btn-exit-episode").addEventListener("click", () => exitEpisode());
    els.sidebar.scrollTop = 0;
  }

  function renderPersonDetail(seasonN, ep, idx) {
    const season = seasonByN[seasonN];
    const p = ep.people[idx];
    const j = p.j ? WORLD.journeys.find((x) => x.id === p.j) : null;
    const color = j ? j.color : "#6b6b6b";

    els.sidebar.innerHTML = `
      <div class="loc-kicker">${season.name} &middot; Episode ${ep.n} &middot; ${ep.title}</div>
      <div class="loc-title journey-title">${avatarHTML(p.name, color)}${p.name}</div>
      <div class="sidebar-divider"></div>
      <div class="loc-lore-head">This Episode</div>
      <p class="loc-lore">${p.note}</p>
      ${j ? `<div class="sidebar-divider"></div>
        <div class="loc-lore-head">Their Road So Far</div>
        <div class="stop-list">${j.stops.filter((s) => s.episode <= ep.n).map((s, i) => {
          const pt = stopCoords(s);
          return `<div class="stop-row"><span class="stop-num" style="background:${color};color:#f0e6d2">${i + 1}</span>
            <span class="stop-row-text"><span class="stop-row-title">${pt.name}</span>
            <span class="stop-row-ep">Episode ${s.episode} &middot; ${s.epTitle}</span></span></div>`;
        }).join("") || '<p class="sidebar-note">Their road has not yet begun.</p>'}</div>` : ""}
      <div class="sidebar-divider"></div>
      <button class="side-btn side-btn-ghost" id="btn-back-episode">Back to Episode ${ep.n}</button>
    `;

    if (j) {
      state.epJourneyId = j.id;
      traceEpisodeJourney(j.id, { animateCamera: true });
    } else if (p.loc && locById[p.loc]) {
      const loc = locById[p.loc];
      mapView.focusOn(loc.x, loc.y, 3.2);
      state.selectedLocationId = loc.id;
      mapView.setSelectedMarker(loc.id);
    }

    byId("btn-back-episode").addEventListener("click", () => {
      state.epJourneyId = null;
      mapView.clearRoute();
      refreshMarkers();
      renderEpisodePanel(seasonN, ep.n);
    });
  }

  function traceEpisodeJourney(journeyId, { animateCamera }) {
    const journey = WORLD.journeys.find((x) => x.id === journeyId);
    if (!journey || !state.episode || state.season !== 1) return;
    refreshMarkers();
    const pts = journey.stops.map(stopCoords);
    mapView.renderRoute(pts, journey.color, () => {});
    const f = fractionForEpisode(journey, state.episode);
    mapView.setTraveler(f);
    if (animateCamera) {
      const shown = pts.slice(0, Math.max(2, Math.ceil(f) + 1));
      mapView.fitBounds(shown);
    }
  }

  // ---- episode player (the journey bar, repurposed) ----

  function showEpisodePlayer(seasonN, n) {
    const season = seasonByN[seasonN];
    const ep = season.episodes[n - 1];
    const total = season.episodes.length;
    els.player.classList.remove("hidden");
    els.playerCharacter.classList.add("player-switchable");
    const caret = `<span class="ps-caret">&#9662;</span>`;
    if (state.scrubAll) {
      els.playerCharacter.innerHTML = `<span class="avatar" style="background:#8f2d3c">ALL</span> All Seasons ${caret}`;
      els.playerJourneySummary.textContent = "the whole tale on one line";
      els.scrubber.min = "1";
      els.scrubber.max = String(TOTAL_EPS);
      els.scrubber.step = "1";
      els.scrubber.value = String(globalEp(seasonN, n));
      els.scrubberTicks.innerHTML = ALL_SEASONS.map((s) => {
        const start = globalEp(s.n, 1);
        const pct = ((start - 1) / (TOTAL_EPS - 1)) * 100;
        return `<span class="tick ${start <= globalEp(seasonN, n) ? "tick-past" : ""}" style="left:${pct}%" title="S${s.n} — ${s.name}"></span>`;
      }).join("");
    } else {
      els.playerCharacter.innerHTML = `<span class="avatar" style="background:#8f2d3c">S${seasonN}</span> ${season.name} ${caret}`;
      els.playerJourneySummary.textContent = "the chronicle, episode by episode";
      els.scrubber.min = "1";
      els.scrubber.max = String(total);
      els.scrubber.step = "1";
      els.scrubber.value = String(n);
      els.scrubberTicks.innerHTML = season.episodes.map((e, i) => {
        const pct = (i / (total - 1)) * 100;
        return `<span class="tick ${e.n <= n ? "tick-past" : ""}" style="left:${pct}%" title="E${e.n} · ${e.title}"></span>`;
      }).join("");
    }
    els.playerStopLabel.innerHTML = `S${seasonN} &middot; EPISODE ${ep.n} OF ${total} &mdash; <b>${ep.title}</b><br/><span class="stop-note">${ep.throne.king} holds the throne</span>`;
    if (!state.playing) els.playBtn.textContent = "▶";
  }

  function startEpisodePlayback() {
    if (!state.episode || !state.season) return;
    const total = state.scrubAll ? TOTAL_EPS : seasonByN[state.season].episodes.length;
    state.playing = true;
    const token = ++state.playToken;
    els.playBtn.textContent = "❚❚";
    let current = state.scrubAll ? globalEp(state.season, state.episode) : state.episode;
    if (current >= total) current = 0;

    function tick() {
      if (token !== state.playToken || !state.playing) return;
      current += 1;
      if (current > total) { stopPlayback(); return; }
      if (state.scrubAll) { const t = fromGlobalEp(current); selectEpisode(t.s, t.e); }
      else selectEpisode(state.season, current);
      if (current >= total) { stopPlayback(); return; }
      setTimeout(tick, 3200);
    }
    setTimeout(tick, 400);
  }

  // zoom controls
  els.zoomIn.addEventListener("click", () => mapView.zoomBy(1.35));
  els.zoomOut.addEventListener("click", () => mapView.zoomBy(1 / 1.35));
  /* the old star (reset) button is now the base-map layers button (js/map-layers.js) */
  if (els.zoomReset) els.zoomReset.addEventListener("click", () => mapView.reset());

  // ================= the telling (show vs books) =================

  function setLore(lore) {
    state.lore = lore;
    localStorage.setItem("hotd-lore", lore);
    state.focusCharacter = null;     // the viewed character belongs to the old telling
    syncShelfToLore();               // the story menu's shelf IS the telling
    buildHousesMenu();               // rosters follow the telling
    refreshPeopleLayer();            // so do the faces on the map
    byId("lore-modal").classList.add("hidden");
    const card = byId("char-card");
    if (card) card.classList.add("hidden"); // any open card may be stale
  }

  // ================= "The Story" pointer (little guide by the badge) =================

  const storyTip = byId("story-tip");
  function showStoryTip() { storyTip.classList.remove("hidden"); }
  function hideStoryTip() { storyTip.classList.add("hidden"); }
  byId("story-tip-close").addEventListener("click", hideStoryTip);
  // a click anywhere outside the little pop-up dismisses it
  document.addEventListener("mousedown", (e) => {
    if (!storyTip.classList.contains("hidden") && !storyTip.contains(e.target)) hideStoryTip();
  });

  (function initLoreModal() {
    const modal = byId("lore-modal");
    modal.querySelectorAll(".lore-option").forEach((btn) => {
      btn.addEventListener("click", () => { setLore(btn.dataset.lore); selectDefaultStoryPoint(); showStoryTip(); });
    });
    // a deep link (testing / bookmarks) skips the door; ?lore= picks a telling
    const h = new URLSearchParams(window.location.hash.slice(1));
    const tipOk = h.get("tip") !== "0";
    if (h.get("lore")) { setLore(h.get("lore")); if (tipOk) showStoryTip(); return; }
    if (Array.from(h.keys()).length > 0) { modal.classList.add("hidden"); if (tipOk) showStoryTip(); return; }
  })();

  // ================= init =================

  initSiteSwitcher();
  initWordle();
  setSite("map");
  buildMenus();
  renderWelcome();
  refreshMarkers();
  mapView.reset(0);

  // deep-link support (also used for automated visual testing):
  // #road=Jon%20Snow · #house=stark · #region=dorne · #loc=winterfell · #banners=1
  const hash = new URLSearchParams(window.location.hash.slice(1));
  if (hash.get("banners")) {
    state.filters.banners = true;
    mapView.setBannersVisible(true);
  }
  if (hash.get("territories")) {
    state.filters.territories = true;
    byId("territory-layer").classList.remove("hidden-layer");
  }
  if (hash.get("deaths")) state.filters.deaths = true;      // skull pins on
  if (hash.get("scope")) state.filters.peopleScope = hash.get("scope"); // main | all
  if (hash.get("all")) state.scrubAll = true;               // whole-tale drag line
  if (hash.get("zoom")) {
    const z = parseFloat(hash.get("zoom"));
    const cx = parseFloat(hash.get("cx") || "2826");
    const cy = parseFloat(hash.get("cy") || "1841");
    mapView.focusOn(cx, cy, z, 0);
  }
  if (hash.get("chapter")) { selectChapter(parseInt(hash.get("book") || "1", 10), parseInt(hash.get("chapter"), 10)); }
  else if (hash.get("episode")) { selectEpisode(parseInt(hash.get("season") || "1", 10), parseInt(hash.get("episode"), 10)); }
  else if (hash.get("house")) { setMode("houses"); selectHouse(hash.get("house")); }
  else if (hash.get("region")) { setMode("regions"); selectRegion(hash.get("region")); }
  else if (hash.get("loc")) {
    const loc = locById[hash.get("loc")];
    if (loc) {
      state.selectedLocationId = loc.id;
      mapView.setSelectedMarker(loc.id);
      mapView.focusOn(loc.x, loc.y, 4.2, 0);
      renderLocationCard(loc);
    }
  }
  // with nothing chosen, the story opens at its first page (S1·E1 / Book 1 Ch. 1)
  if (!storyPoint() && !hash.get("house") && !hash.get("region") && !hash.get("loc")) {
    selectDefaultStoryPoint();
  }
  // character roads are combinable with an episode/chapter (roads gate to it)
  if (hash.get("char")) { openCharacterCard(hash.get("char")); }
  if (hash.get("road")) { showCharacterRoad(hash.get("road")); }
  if (hash.get("site") === "wordle" || hash.get("wordle")) setSite("wordle");
})();
