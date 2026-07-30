/* BLUR — engine.
 *
 * A vision in a glass candle, hidden behind a 5x5 grid of dark boxes. It starts
 * nearly closed (two boxes open); "reveal more" opens the picture beneath box by
 * box (no blur — the picture is always crisp where it shows) at the cost of a
 * point. Name it early and it is worth more: five points down to one. Name it
 * WRONGLY and the vision is lost at nothing — which is what makes revealing more
 * and narrowing the field worth their point. Eight visions to a round.
 *
 * The subject pool is BUILT AT RUNTIME from art the site already has, so this
 * game grows on its own every time a portrait, a banner or a scene is added and
 * there is no third list to keep in step:
 *
 *   faces   <- PEOPLE_IMGS      (js/people.js)          assets/people/
 *   banners <- SIGILS           (sigilmatch/sigils-data.js)
 *   places  <- ART_MANIFEST     (js/art-manifest.js)    via the curated map below
 *   beasts  <- ART_MANIFEST     the direwolves
 *
 * Places need the curated map because the manifest's labels are generated from
 * filenames: "Winterfell", "Winterfell Hanging" and "Winterfell With People"
 * are three pictures of one place, and "Blackwater 1/2/3" likewise. Left alone
 * they would appear as three different answers to the same question.
 */
(function () {
  const $ = (id) => document.getElementById(id);
  const shell = $("bl-shell");
  if (!shell) return;

  const ROUND_LEN = 8;
  const STEPS = 5;                     /* 5 points at first sight, down to 1 */
  const esc = (s) => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

  /* ---------------- the curated place map ----------------
     file stem -> the answer a player should be asked for. Several stems may
     share an answer; the deck never offers two subjects with the same answer in
     one round, and never two options with the same text. */
  const PLACES = {
    "winterfell": "Winterfell",
    "winterfell-hanging": "Winterfell",
    "castle-black": "Castle Black",
    "castle-black-dark": "Castle Black",
    "battle-for-the-wall": "The Wall",
    "hardhome": "Hardhome",
    "harrenhall-burning": "Harrenhal",
    "the-doom-of-valyria": "Valyria",
    "the-doom-of-valyria2": "Valyria",
    "aegon-burning-armies": "The Field of Fire",
    "winterfell-with-people": "Winterfell",
    "house-of-the-undying": "Qarth",
    "iron-throne-large": "The Iron Throne",
    "iron-throne-small": "The Iron Throne",
    "the-iron-throne1": "The Iron Throne",
    "red-keep": "King's Landing",
    "pyke": "Pyke",
    "red-wedding": "The Twins",
    "blackwater1": "The Blackwater",
    "blackwater2": "The Blackwater",
    "blackwater3": "The Blackwater",
    "blackwater4": "The Blackwater",
    "battle-of-the-trident": "The Trident",
    "stannis-against-the-wildlings": "Beyond the Wall",
    "surrounded-beyond-the-wall": "Beyond the Wall",
  };
  const BEASTS = {
    "ghost": "Ghost", "grey-wind": "Grey Wind", "lady": "Lady",
    "nymeria": "Nymeria", "summer": "Summer", "shaggydog": "Shaggydog",
  };

  const stem = (src) => (src.split("/").pop() || "").replace(/\.[a-z0-9]+$/i, "");

  /* ---------------- build the pool ---------------- */
  function buildPool() {
    const out = { faces: [], banners: [], places: [], beasts: [] };

    if (typeof PEOPLE_IMGS !== "undefined") {
      Object.keys(PEOPLE_IMGS).forEach((name) => {
        const f = PEOPLE_IMGS[name];
        if (f) out.faces.push({ kind: "faces", answer: name, src: "../assets/people/" + f });
      });
    }
    if (typeof SIGILS !== "undefined") {
      SIGILS.forEach((h) => {
        /* SIGILS paths are written relative to sigilmatch/, which is also one
           folder deep, so they resolve unchanged from here */
        out.banners.push({ kind: "banners", answer: h.name, src: h.img, note: h.words || "" });
      });
    }
    if (typeof ART_MANIFEST !== "undefined" && ART_MANIFEST.scenes) {
      ART_MANIFEST.scenes.forEach((a) => {
        const k = stem(a.src);
        if (PLACES[k]) out.places.push({ kind: "places", answer: PLACES[k], src: "../" + a.src });
        else if (BEASTS[k]) out.beasts.push({ kind: "beasts", answer: BEASTS[k], src: "../" + a.src });
      });
    }
    return out;
  }

  const POOL = buildPool();
  const CATS = ["faces", "banners", "places", "beasts"];
  const catPool = (c) => c === "all" ? CATS.reduce((a, k) => a.concat(POOL[k]), []) : (POOL[c] || []);

  /* how many distinct answers a category can ask for — the honest count */
  function distinct(c) {
    const seen = {};
    catPool(c).forEach((s) => { seen[s.answer] = 1; });
    return Object.keys(seen).length;
  }
  ["all"].concat(CATS).forEach((c) => {
    const el = $("bl-n-" + c);
    if (el) el.textContent = distinct(c) + " to name";
  });

  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }

  const state = { cat: "all", deck: [], i: 0, step: 0, score: 0, options: [], answered: false, killed: [], tileOrder: [], narrowed: false };

  function setSharp() {
    shell.style.setProperty("--sharp", String(state.step / (STEPS - 1)));
  }

  /* ---------------- the tiles ----------------
     A 5x5 grid of dark boxes covers the picture. Each subject gets its own
     shuffled reveal order; the number shown climbs with the step, so a fifth of
     the boxes are open at first sight and all of them once it is answered. */
  const TX = 5, TY = 5, TILE_N = TX * TY;
  (function buildTiles() {
    const t = document.getElementById("bl-tiles");
    if (!t) return;
    let h = "";
    for (let i = 0; i < TILE_N; i++) h += '<span class="bl-tile" data-t="' + i + '"></span>';
    t.innerHTML = h;
  })();
  /* how many of the 25 boxes are open at each step — deliberately mean at the
     start (two), with the biggest jumps on the first and second reveal */
  const REVEAL = [2, 6, 11, 17, 25];
  function revealCount() {
    if (state.answered) return TILE_N;
    return REVEAL[Math.min(state.step, REVEAL.length - 1)];
  }
  function revealTiles() {
    const t = document.getElementById("bl-tiles");
    if (!t) return;
    const show = {};
    const n = revealCount();
    for (let k = 0; k < n && k < state.tileOrder.length; k++) show[state.tileOrder[k]] = 1;
    Array.prototype.forEach.call(t.children, (el) => el.classList.toggle("shown", !!show[+el.dataset.t]));
  }
  /* cover the whole picture with NO transition, so a new vision never flashes
     into view before the boxes close over it */
  function coverInstant() {
    const t = document.getElementById("bl-tiles");
    if (!t) return;
    t.classList.add("bl-notrans");
    Array.prototype.forEach.call(t.children, (el) => el.classList.remove("shown"));
    void t.offsetWidth;
    t.classList.remove("bl-notrans");
  }
  function setPhase(p) { shell.setAttribute("data-phase", p); }

  /* ---------------- setup ---------------- */
  document.querySelectorAll("#bl-cats .bl-cat").forEach((b) => {
    b.addEventListener("click", () => {
      document.querySelectorAll("#bl-cats .bl-cat").forEach((x) => x.classList.remove("active"));
      b.classList.add("active");
      state.cat = b.dataset.cat;
    });
  });

  function showScreen(id) {
    ["bl-setup", "bl-game", "bl-result"].forEach((s) => $(s).classList.toggle("hidden", s !== id));
    setPhase(id === "bl-setup" ? "setup" : "playing");
  }

  /* one subject per distinct answer, so a round never asks the same thing twice */
  function buildDeck() {
    const byAnswer = {};
    shuffle(catPool(state.cat).slice()).forEach((s) => { if (!byAnswer[s.answer]) byAnswer[s.answer] = s; });
    return shuffle(Object.keys(byAnswer).map((k) => byAnswer[k])).slice(0, ROUND_LEN);
  }

  function start() {
    state.deck = buildDeck();
    if (!state.deck.length) return;
    state.i = 0; state.score = 0;
    showScreen("bl-game");
    renderSubject();
  }
  $("bl-start").addEventListener("click", start);
  $("bl-quit").addEventListener("click", () => { state.step = 0; setSharp(); showScreen("bl-setup"); });

  /* ---------------- a subject ---------------- */
  function renderSubject() {
    const s = state.deck[state.i];
    state.step = 0; state.answered = false; state.killed = []; state.narrowed = false;
    state.tileOrder = shuffle(Array.from({ length: TILE_N }, (_, i) => i));
    setSharp();

    $("bl-img").src = s.src;
    $("bl-img").alt = "";
    coverInstant();   /* boxes close over the new picture before it can show */
    revealTiles();    /* then open this step's fragments */
    $("bl-progress").textContent = "Vision " + (state.i + 1) + " of " + state.deck.length;
    $("bl-score").textContent = state.score + " pts";
    $("bl-verdict").classList.add("hidden");
    $("bl-next").classList.add("hidden");
    $("bl-sharpen").disabled = false;
    $("bl-narrow").disabled = false;

    /* distractors come from the same category, so a banner is never offered
       against a face — the guess has to be about the picture, not the shape */
    const sibs = catPool(s.kind).filter((x) => x.answer !== s.answer);
    const seen = {}, wrong = [];
    shuffle(sibs.slice()).forEach((x) => {
      if (wrong.length < 3 && !seen[x.answer]) { seen[x.answer] = 1; wrong.push(x.answer); }
    });
    state.options = shuffle([s.answer].concat(wrong));
    renderSteps();
    renderOptions();
  }

  function renderSteps() {
    let h = "";
    for (let i = 0; i < STEPS; i++) h += '<span class="bl-step' + (i <= state.step ? " lit" : "") + '"></span>';
    $("bl-steps").innerHTML = h;
  }

  function renderOptions() {
    $("bl-answers").innerHTML = state.options.map((o, i) =>
      '<button class="bl-a" data-i="' + i + '">' + esc(o) + "</button>").join("");
    document.querySelectorAll("#bl-answers .bl-a").forEach((b) => {
      const label = state.options[+b.dataset.i];
      if (state.killed.indexOf(label) >= 0) { b.classList.add("gone"); b.disabled = true; }
      b.addEventListener("click", () => guess(b, label));
    });
  }

  const points = () => Math.max(1, STEPS - state.step);

  function sharpen() {
    if (state.answered) return false;
    if (state.step >= STEPS - 1) return false;
    state.step++;
    setSharp();
    revealTiles();   /* another fragment or two resolves */
    renderSteps();
    return true;
  }

  $("bl-sharpen").addEventListener("click", () => {
    if (!sharpen()) $("bl-sharpen").disabled = true;
  });

  /* Narrow the field: strike TWO wrong options at once, leaving the answer and
     one other — a true 50/50 — for a single point, once per vision. */
  $("bl-narrow").addEventListener("click", () => {
    if (state.answered || state.narrowed) return;
    const s = state.deck[state.i];
    const wrong = state.options.filter((o) => o !== s.answer && state.killed.indexOf(o) < 0);
    if (wrong.length < 2) return;
    shuffle(wrong).slice(0, 2).forEach((o) => state.killed.push(o));
    state.narrowed = true;
    sharpen();
    renderOptions();
    $("bl-narrow").disabled = true;
  });

  function guess(btn, label) {
    if (state.answered) return;
    const s = state.deck[state.i];
    if (label === s.answer) {
      state.answered = true;
      const won = points();
      state.score += won;
      btn.classList.add("right");
      finish(true, won);
    } else {
      /* naming wrongly ends the vision at nothing — which is what makes revealing
         more, and narrowing the field, worth their point: a blind guess is fatal */
      btn.classList.add("wrong");
      state.answered = true;
      finish(false, 0);
    }
    $("bl-score").textContent = state.score + " pts";
  }

  function finish(right, won) {
    const s = state.deck[state.i];
    state.answered = true;
    state.step = STEPS - 1;               /* show it plainly once it is over */
    setSharp();
    revealTiles();                        /* every box opens — the whole picture */
    renderSteps();
    document.querySelectorAll("#bl-answers .bl-a").forEach((b) => {
      b.disabled = true;
      if (state.options[+b.dataset.i] === s.answer) b.classList.add("right");
    });
    $("bl-sharpen").disabled = true;
    $("bl-narrow").disabled = true;
    $("bl-verdict").innerHTML = right
      ? "<b>" + esc(s.answer) + "</b> &mdash; named at " + won + " point" + (won === 1 ? "" : "s") + "." +
        (s.note ? "<i>&ldquo;" + esc(s.note) + "&rdquo;</i>" : "")
      : "Named wrongly &mdash; the vision is lost. It was <b>" + esc(s.answer) + "</b>." +
        (s.note ? "<i>&ldquo;" + esc(s.note) + "&rdquo;</i>" : "");
    $("bl-verdict").classList.remove("hidden");
    $("bl-next").textContent = state.i + 1 < state.deck.length ? "The next vision →" : "See what you saw →";
    $("bl-next").classList.remove("hidden");
  }

  $("bl-next").addEventListener("click", () => {
    state.i++;
    if (state.i >= state.deck.length) return renderResult();
    renderSubject();
  });

  /* ---------------- the verdict ---------------- */
  const RANKS = [
    [0.90, "Greenseer", "You saw them before the smoke had cleared. The Citadel would deny you exist."],
    [0.72, "Archmaester of the Glass", "Few can read a candle this well. Fewer admit to trying."],
    [0.54, "Maester of the Realm", "A steady hand and a good eye — most of it named before it sharpened."],
    [0.34, "Acolyte", "You needed the flame steadied more often than not, but you got there."],
    [0.00, "Novice", "Mostly you waited for the picture to arrive. That is what novices do."],
  ];

  function renderResult() {
    const max = state.deck.length * STEPS;
    const pct = max ? state.score / max : 0;
    const rank = RANKS.find((r) => pct >= r[0]);
    $("bl-result").innerHTML =
      '<div class="bl-kicker">What you saw</div>' +
      '<div class="bl-ring"><b>' + state.score + "</b><span>of " + max + "</span></div>" +
      '<div class="bl-rank">' + rank[1] + "</div>" +
      '<p class="bl-rank-sub">' + rank[2] + "</p>" +
      '<div class="bl-result-actions">' +
        '<button id="bl-again">Light another candle</button>' +
        '<button id="bl-back">Look for something else</button>' +
      "</div>";
    state.step = 0; setSharp();
    showScreen("bl-result");
    $("bl-again").addEventListener("click", start);
    $("bl-back").addEventListener("click", () => showScreen("bl-setup"));
  }

  setSharp();
})();
