/* TRIVIA OF THE REALM — engine.
   Question banks (questions-*.js) fill window.TRIVIA = { got: [...], hotd: [...], knight: [...] }.
   A question: { d: 1|2|3, q, a: [correct, wrong, wrong, wrong], img?, ic?: "hbo"|"cc"|"orig", why?, s?, b? }
   Spoiler tags: s = safe once you've SEEN that season of the saga's show,
                 b = safe once you've READ that book of the saga
                 (GoT: ASOIAF 1–5 · HotD: Fire & Blood = 1 · Knight: tales 1–3).
   A question passes the shield if EITHER tag is met; untagged questions are ambient lore, always safe.
   Ten questions are drawn at random per run (matching the chosen difficulty, or mixed),
   so no two examinations are the same. */

(function () {
  const $ = (id) => document.getElementById(id);
  const T = window.TRIVIA || {};
  const QUIZ_LEN = 10;
  const SCREENS = ["tv-setup", "tv-gate", "tv-game", "tv-result"];

  const CREDITS = {
    hbo: "Promotional still © HBO / Warner Bros. Discovery — identification & commentary.",
    cc: "Heraldry by fan-wiki artists — CC BY-SA 3.0.",
    orig: "Original artwork made for this site.",
  };

  const RANKS = [
    [10, "Archmaester of the Citadel", "A perfect chain. The Conclave will hear of this."],
    [9, "Maester of the Realm", "One link short of perfection — the Citadel forges your ring regardless."],
    [7, "Hand of the King", "You know the realm better than most who ruled it."],
    [5, "Knight of the Realm", "A solid showing — your chain has a few links yet to forge."],
    [3, "Squire", "You've watched from the castle walls; time to ride closer."],
    [0, "Summer Child", "Sweet summer child. The realm has much to teach you — start with the wiki."],
  ];

  /* ------------- spoiler shield ------------- */
  const GATE_DEFS = {
    got: [
      { key: "gotS", label: "Seen Game of Thrones up to…", opts: ["Nothing", "Season 1", "Season 2", "Season 3", "Season 4", "Season 5", "Season 6", "Season 7", "Season 8 — everything"] },
      { key: "gotB", label: "Read A Song of Ice and Fire up to…", opts: ["Nothing", "A Game of Thrones", "A Clash of Kings", "A Storm of Swords", "A Feast for Crows", "A Dance with Dragons — everything"] },
    ],
    hotd: [
      { key: "hotdS", label: "Seen House of the Dragon up to…", opts: ["Nothing", "Season 1", "Season 2 — everything"] },
      { key: "hotdB", label: "Read Fire & Blood?", opts: ["No", "Yes"] },
    ],
    knight: [
      { key: "knightS", label: "Seen A Knight of the Seven Kingdoms?", opts: ["No", "Yes — Season 1"] },
      { key: "knightB", label: "Read the Dunk & Egg tales up to…", opts: ["None", "The Hedge Knight", "The Sworn Sword", "The Mystery Knight — all three"] },
    ],
  };
  GATE_DEFS.all = GATE_DEFS.got.concat(GATE_DEFS.hotd, GATE_DEFS.knight);
  const SHIELD_MAX = { gotS: 8, gotB: 5, hotdS: 2, hotdB: 1, knightS: 1, knightB: 3 };

  let shield = { gotS: 0, gotB: 0, hotdS: 0, hotdB: 0, knightS: 0, knightB: 0 };
  try {
    const saved = JSON.parse(localStorage.getItem("tvShield") || "{}");
    Object.keys(shield).forEach((k) => { if (typeof saved[k] === "number") shield[k] = saved[k]; });
  } catch (e) { /* fresh shield */ }
  function saveShield() { try { localStorage.setItem("tvShield", JSON.stringify(shield)); } catch (e) {} }

  // every question knows its saga, so the right shield keys apply even in "All the Realm"
  ["got", "hotd", "knight"].forEach((c) => (T[c] || []).forEach((q) => { q._cat = c; }));

  function allowed(q) {
    if (q.s == null && q.b == null) return true;
    if (q.s != null && (shield[q._cat + "S"] || 0) >= q.s) return true;
    if (q.b != null && (shield[q._cat + "B"] || 0) >= q.b) return true;
    return false;
  }

  const state = { cat: "got", d: 1, deck: [], i: 0, score: 0, streak: 0, best: 0 };

  /* The saga you pick here decides which Wordle the "and a Wordle of this saga"
     link at the end of a run points at. Every game now lives on its own page, so
     there is no in-page game switching left to do. */
  const WORDLE_HREF = { got: "../map.html#wordle=1", hotd: "../hotd/index.html#wordle=1", knight: "../knight/index.html#wordle=1", all: "../map.html#wordle=1" };
  function syncWordleLink() { const a = $("tv-game-wordle"); if (a) a.href = WORDLE_HREF[state.cat] || WORDLE_HREF.got; }

  function pool(cat) {
    if (cat === "all") return [].concat(T.got || [], T.hotd || [], T.knight || []);
    return (T[cat] || []).slice();
  }
  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }
  function buildDeck() {
    let candidates = pool(state.cat).filter(allowed);
    if (state.d !== 0) {
      const exact = candidates.filter((q) => q.d === state.d);
      /* if the pool is thin, pad with neighboring difficulty rather than repeat */
      candidates = exact.length >= QUIZ_LEN ? exact
        : exact.concat(candidates.filter((q) => q.d !== state.d));
    }
    return shuffle(candidates).slice(0, QUIZ_LEN);
  }

  function showScreen(id) {
    SCREENS.forEach((s) => $(s).classList.toggle("hidden", s !== id));
    const el = $(id);
    el.classList.remove("tv-anim-in");
    void el.offsetWidth; /* restart the entrance animation */
    el.classList.add("tv-anim-in");
    window.scrollTo({ top: el.offsetTop - 90, behavior: "smooth" });
  }

  /* ---------------- setup screen ---------------- */
  ["got", "hotd", "knight", "all"].forEach((c) => {
    const el = $("tv-count-" + c);
    if (el) el.textContent = pool(c).length + " questions in the pool";
  });
  document.querySelectorAll("#tv-cats .tv-cat").forEach((b) => {
    b.addEventListener("click", () => {
      document.querySelectorAll("#tv-cats .tv-cat").forEach((x) => x.classList.remove("active"));
      b.classList.add("active");
      state.cat = b.dataset.cat;
      syncWordleLink();
    });
  });
  document.querySelectorAll("#tv-diffs .tv-diff").forEach((b) => {
    b.addEventListener("click", () => {
      document.querySelectorAll("#tv-diffs .tv-diff").forEach((x) => x.classList.remove("active"));
      b.classList.add("active");
      state.d = parseInt(b.dataset.d, 10);
    });
  });

  // deep link: #cat=hotd preselects a saga
  const hash = new URLSearchParams(window.location.hash.slice(1));
  if (hash.get("cat") && ["got", "hotd", "knight", "all"].includes(hash.get("cat"))) {
    state.cat = hash.get("cat");
    document.querySelectorAll("#tv-cats .tv-cat").forEach((x) =>
      x.classList.toggle("active", x.dataset.cat === state.cat));
  }
  syncWordleLink();

  /* ---------------- spoiler gate screen ---------------- */
  function renderGate() {
    const defs = GATE_DEFS[state.cat] || GATE_DEFS.all;
    $("tv-gate-controls").innerHTML = defs.map((g) => `
      <div class="tv-gate-group" data-key="${g.key}">
        <div class="tv-gate-label">${g.label}</div>
        <div class="tv-gate-opts">${g.opts.map((o, i) =>
          `<button class="tv-gate-opt${shield[g.key] === i ? " active" : ""}" data-v="${i}">${o}</button>`).join("")}
        </div>
      </div>`).join("");
    document.querySelectorAll("#tv-gate-controls .tv-gate-opt").forEach((b) => {
      b.addEventListener("click", () => {
        const key = b.closest(".tv-gate-group").dataset.key;
        shield[key] = parseInt(b.dataset.v, 10);
        saveShield();
        b.closest(".tv-gate-opts").querySelectorAll(".tv-gate-opt").forEach((x) => x.classList.toggle("active", x === b));
        updateGateCount();
      });
    });
    updateGateCount();
  }

  function updateGateCount() {
    const safe = pool(state.cat).filter(allowed);
    const n = state.d === 0 ? safe.length : safe.filter((q) => q.d === state.d).length || safe.length;
    const runLen = Math.min(QUIZ_LEN, safe.length);
    let msg = `Under this shield, <b>${safe.length}</b> questions may pass.`;
    if (safe.length === 0) msg = `<span class="tv-gate-warn">No questions can pass this shield — raise a season or a book.</span>`;
    else if (runLen < QUIZ_LEN) msg += ` <span class="tv-gate-warn">The examination will be ${runLen} questions long.</span>`;
    $("tv-gate-count").innerHTML = msg;
    $("tv-gate-go").disabled = safe.length === 0;
  }

  $("tv-start").addEventListener("click", () => { renderGate(); showScreen("tv-gate"); });
  $("tv-gate-back").addEventListener("click", () => showScreen("tv-setup"));
  $("tv-gate-nospoil").addEventListener("click", () => {
    Object.keys(SHIELD_MAX).forEach((k) => { shield[k] = SHIELD_MAX[k]; });
    saveShield();
    renderGate();
  });
  $("tv-gate-go").addEventListener("click", start);
  $("tv-quit").addEventListener("click", () => showScreen("tv-setup"));

  /* ---------------- the examination ---------------- */
  function start() {
    state.deck = buildDeck();
    if (!state.deck.length) { showScreen("tv-gate"); return; }
    state.i = 0; state.score = 0; state.streak = 0; state.best = 0;
    showScreen("tv-game");
    renderDots();
    renderQuestion();
  }

  function renderDots() {
    $("tv-dots").innerHTML = state.deck.map((_, i) =>
      `<span class="tv-dot${i === state.i ? " now" : ""}" id="tv-dot-${i}"></span>`).join("");
  }

  function renderQuestion() {
    const q = state.deck[state.i];
    $("tv-q").textContent = q.q;
    $("tv-explain").textContent = ""; // clear the last question's explanation before the next one can set its own
    $("tv-explain").classList.add("hidden");
    $("tv-next").classList.add("hidden");
    $("tv-streak").textContent = state.streak >= 2 ? "🔥 " + state.streak + " streak" : "";

    const card = $("tv-card");
    card.classList.remove("tv-anim-in");
    void card.offsetWidth;
    card.classList.add("tv-anim-in");

    const imgBox = $("tv-qimg");
    if (q.img) {
      imgBox.querySelector("img").src = q.img;
      $("tv-qimg-credit").textContent = CREDITS[q.ic || "hbo"];
      imgBox.classList.remove("hidden");
    } else imgBox.classList.add("hidden");

    const answers = q.a.map((text, i) => ({ text, right: i === 0 }));
    shuffle(answers);
    $("tv-answers").innerHTML = "";
    answers.forEach((ans) => {
      const b = document.createElement("button");
      b.className = "tv-a";
      b.textContent = ans.text;
      b.addEventListener("click", () => pick(b, ans.right, q));
      $("tv-answers").appendChild(b);
    });
  }

  function pick(btn, right, q) {
    document.querySelectorAll(".tv-a").forEach((b) => {
      b.disabled = true;
      if (b !== btn) b.classList.add(b.textContent === q.a[0] ? "right" : "dim");
    });
    btn.classList.add(right ? "right" : "wrong");
    const dot = $("tv-dot-" + state.i);
    if (dot) { dot.classList.remove("now"); dot.classList.add(right ? "ok" : "bad"); }
    if (right) { state.score++; state.streak++; state.best = Math.max(state.best, state.streak); }
    else state.streak = 0;
    if (q.why) { $("tv-explain").textContent = q.why; $("tv-explain").classList.remove("hidden"); }
    $("tv-next").textContent = state.i + 1 < state.deck.length ? "Next question →" : "See the verdict →";
    $("tv-next").classList.remove("hidden");
  }

  $("tv-next").addEventListener("click", () => {
    state.i++;
    if (state.i >= state.deck.length) return renderResult();
    renderDots();
    renderQuestion();
  });

  function renderResult() {
    const rank = RANKS.find((r) => state.score >= r[0]);
    const el = $("tv-result");
    el.innerHTML = `
      <div class="tv-kicker">The Maester's Verdict</div>
      <div class="tv-score-ring"><b id="tv-score-num">0</b><span>of ${state.deck.length} correct</span></div>
      <div class="tv-rank tv-reveal-1">${rank[1]}</div>
      <p class="tv-rank-sub tv-reveal-2">${rank[2]}${state.best >= 3 ? ` Your best streak: <b>${state.best}</b> in a row.` : ""}</p>
      <div class="tv-result-actions tv-reveal-3">
        <button id="tv-again">Same again, fresh questions</button>
        <button id="tv-setup-btn">Change saga or difficulty</button>
      </div>`;
    showScreen("tv-result");
    $("tv-again").addEventListener("click", start);
    $("tv-setup-btn").addEventListener("click", () => showScreen("tv-setup"));

    /* count the score up as the ring lands */
    const num = $("tv-score-num");
    const total = state.score;
    const dur = 900, t0 = performance.now();
    (function tick(t) {
      const p = Math.min(1, (t - t0) / dur);
      num.textContent = Math.round(total * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  }
})();
