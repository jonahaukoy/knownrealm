/* WHO SAID IT? — engine.
   Quote pools (quotes-*.js) fill window.QUOTES = { got: [...], hotd: [...], knight: [...] };
   the setup screen's saga chips choose which one is examined (state.saga, saved as "wsSaga").
   A quote: { d: 1|2|3, fmt: "show"|"book", q, speaker, wrong: [3 names], s?, b?, hint, context }
   The speaker's and every distractor's portrait is resolved from the shared PEOPLE_IMGS table
   (js/people.js) by name — the SAME lookup the map and character cards use, so swapping a
   character's photo there updates it everywhere at once, including here.
   A round is 12 quotes drawn at random matching the chosen format + difficulty. Hint and 50/50
   are each usable once per round, not once per question.

   The round is played on a wall in the Hall of Faces (assets/hall1-5.webp): five paintings of one
   chamber, dark but for a single candle at hall1 and blazing at hall5. Which painting shows is
   driven by how many voices you have named, --glow warms the wall continuously in between, and
   every speaker you name correctly is hung on the wall as a portrait — which is why there is no
   longer a row of progress dots. The faces ARE the progress. */

(function () {
  const $ = (id) => document.getElementById(id);
  const Q = window.QUOTES || {};
  const ROUND_LEN = 12;
  const PORTRAIT_BASE = "../assets/people/";
  const HALLS = 5;
  const shell = $("ws-shell");
  const HALL_DIR = (shell && shell.dataset.art) || "assets/";

  const RANKS = [
    [10, "Maester of Voices", "Every word, every face — you could testify before the Iron Throne itself."],
    [9, "Master of Whisperers", "One line slipped past you. The little birds still sing your praises."],
    [7, "Hand of the King", "You know the realm's tongues better than most who ruled it."],
    [5, "Sworn Sword", "A solid ear — you know the loud voices, if not yet the quiet ones."],
    [3, "Squire", "You've caught the famous lines. The rest will come with more listening."],
    [0, "Summer Child", "Sweet summer child. Every voice in the realm still sounds the same to you — for now."],
  ];

  const state = { saga: "got", fmt: "show", d: 1, deck: [], i: 0, score: 0, streak: 0, best: 0,
                  hintUsed: false, fiftyUsed: false, fiftyHidden: null, hung: [] };
  try { const s = localStorage.getItem("wsSaga"); if (s && Q[s]) state.saga = s; } catch (e) {}

  /* ---------------- the hall ----------------
     Five paintings stacked and cross-faded. A perfect round earns the fifth, the
     full blaze, which is why it is checked separately rather than falling out of
     the quartile maths. */
  (function buildHall() {
    const art = $("ws-hall");
    if (!art) return;
    let h = "";
    for (let n = 1; n <= HALLS; n++) {
      h += `<div class="ws-hall-layer${n === 1 ? " on" : ""}" data-n="${n}"` +
           ` style="background-image:url('${HALL_DIR}hall${n}.webp')"></div>`;
    }
    art.innerHTML = h;
  })();

  function hallFor(score, total) {
    if (!total) return 1;
    if (score >= total) return HALLS;
    return 1 + Math.min(HALLS - 2, Math.floor((score / total) * (HALLS - 1)));
  }
  function lightHall() {
    const total = state.deck.length || ROUND_LEN;
    const n = hallFor(state.score, total);
    const art = $("ws-hall");
    if (art) Array.prototype.forEach.call(art.children, (el) => {
      el.classList.toggle("on", +el.dataset.n === n);
    });
    if (shell) shell.style.setProperty("--glow", String(total ? state.score / total : 0));
  }
  function setPhase(p) { if (shell) shell.setAttribute("data-phase", p); }

  /* ---------------- the spoiler shield ----------------
     One shield serves the whole site: the dialog realm-nav.js hangs off the
     Shield button in the realm bar, writing the single record in js/shield.js.
     This game used to draw a second set of season/book chips of its own; it no
     longer does. It reads the record and re-reads on "kw-shield". */
  const SHIELD_LINES = {
    got: [["gotS", "Game of Thrones", "season"], ["gotB", "A Song of Ice and Fire", "book"]],
    hotd: [["hotdS", "House of the Dragon", "season"], ["hotdB", "Fire &amp; Blood", "book"]],
    knight: [["knightS", "A Knight of the Seven Kingdoms", "season"], ["knightB", "The Dunk &amp; Egg tales", "tale"]],
  };
  const BOOK_NAME = ["", "A Game of Thrones", "A Clash of Kings", "A Storm of Swords", "A Feast for Crows", "A Dance with Dragons"];
  const TALE_NAME = ["", "The Hedge Knight", "The Sworn Sword", "The Mystery Knight"];
  const SHIELD_MAX = window.KWShield ? window.KWShield.MAX
    : { gotS: 8, gotB: 5, hotdS: 2, hotdB: 1, knightS: 1, knightB: 3 };

  let shield = { gotS: 0, gotB: 0, hotdS: 0, hotdB: 0, knightS: 0, knightB: 0 };
  function readShield() {
    if (window.KWShield) { shield = window.KWShield.get(); return; }
    try {
      const saved = JSON.parse(localStorage.getItem("tvShield") || "{}");
      Object.keys(shield).forEach((k) => { if (typeof saved[k] === "number") shield[k] = saved[k]; });
    } catch (e) { /* a fresh shield */ }
  }
  readShield();
  window.addEventListener("kw-shield", () => {
    readShield();
    if (!$("ws-gate").classList.contains("hidden")) renderGate();
  });

  function allowed(q) {
    if (q.s == null && q.b == null) return true;
    if (q.s != null && (shield[state.saga + "S"] || 0) >= q.s) return true;
    if (q.b != null && (shield[state.saga + "B"] || 0) >= q.b) return true;
    return false;
  }

  function portraitFor(name) {
    const t = (window.WS_PORTRAITS && WS_PORTRAITS[state.saga]) || null;
    if (!t) return null;
    const file = t.map[name];
    return file ? t.base + file : null;
  }

  function pool(fmt) {
    return (Q[state.saga] || []).filter((q) => q.fmt === fmt);
  }
  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }

  /* ---------------- setup screen ---------------- */
  /* the count is of what this reader can actually be asked — see the note in
     trivia-engine.js; the same trap, the same answer */
  function updateCounts() {
    let held = 0;
    ["show", "book"].forEach((f) => {
      const el = $("ws-count-" + f);
      if (!el) return;
      const all = pool(f), open = all.filter(allowed);
      const chip = el.closest(".ws-fmt");
      /* A saga can have nothing at all in one format — Dunk & Egg has no show
         lines, because inventing screen dialogue would defeat the whole game.
         Say so on the chip and take it out of play, rather than letting the
         player choose it and hit an empty gate screen with no explanation. */
      if (chip) chip.classList.toggle("ws-fmt-empty", all.length === 0);
      if (all.length === 0) {
        el.textContent = "nothing here yet";
        return;
      }
      held += all.length - open.length;
      el.textContent = open.length + " lines you can be asked" +
        (all.length > open.length ? " · " + (all.length - open.length) + " held back" : "");
    });
    /* never leave an empty format selected */
    if (pool(state.fmt).length === 0) {
      const other = state.fmt === "show" ? "book" : "show";
      if (pool(other).length) {
        state.fmt = other;
        document.querySelectorAll("#ws-fmts .ws-fmt").forEach((x) =>
          x.classList.toggle("active", x.dataset.fmt === state.fmt));
      }
    }
    const slot = $("ws-held");
    if (slot) {
      slot.innerHTML = (held && window.KWShield && window.KWShield.heldNotice)
        ? window.KWShield.heldNotice(held, "line", "lines") : "";
    }
  }
  function syncSagaChips() {
    document.querySelectorAll("#ws-sagas .ws-saga").forEach((x) =>
      x.classList.toggle("active", x.dataset.saga === state.saga));
  }
  document.querySelectorAll("#ws-sagas .ws-saga").forEach((b) => {
    b.addEventListener("click", () => {
      state.saga = b.dataset.saga;
      try { localStorage.setItem("wsSaga", state.saga); } catch (e) {}
      syncSagaChips();
      updateCounts();
    });
  });
  syncSagaChips();
  updateCounts();
  document.querySelectorAll("#ws-fmts .ws-fmt").forEach((b) => {
    b.addEventListener("click", () => {
      if (b.classList.contains("ws-fmt-empty")) return;   /* nothing to play */
      document.querySelectorAll("#ws-fmts .ws-fmt").forEach((x) => x.classList.remove("active"));
      b.classList.add("active");
      state.fmt = b.dataset.fmt;
    });
  });
  document.querySelectorAll("#ws-diffs .ws-diff").forEach((b) => {
    b.addEventListener("click", () => {
      document.querySelectorAll("#ws-diffs .ws-diff").forEach((x) => x.classList.remove("active"));
      b.classList.add("active");
      state.d = parseInt(b.dataset.d, 10);
    });
  });

  function showScreen(id) {
    ["ws-setup", "ws-gate", "ws-game", "ws-result"].forEach((s) => $(s).classList.toggle("hidden", s !== id));
    /* setup and the gate live on the plain page; the game and the verdict live
       on the wall, and the hall only appears once you are past choosing */
    setPhase(id === "ws-setup" || id === "ws-gate" ? "setup" : "playing");
    /* the head belongs to the round, not to either screen; the faces stay up
       through the verdict, which is the whole point of collecting them */
    $("ws-head").classList.toggle("hidden", id !== "ws-game");
    $("ws-faces").classList.toggle("hidden", id === "ws-setup" || id === "ws-gate");
    const el = $(id);
    el.classList.remove("ws-anim-in");
    void el.offsetWidth;
    el.classList.add("ws-anim-in");
  }

  /* ---------------- spoiler gate screen ----------------
     Reports where the site-wide shield stands and offers the one button that
     opens it; it does not set anything itself. */
  function shieldWord(key, n) {
    if (!n) return "nothing yet";
    if (key === "gotB") return "through " + BOOK_NAME[n];
    if (key === "knightB") return "through " + TALE_NAME[n];
    if (key === "hotdB") return "read";
    return "through season " + n;
  }
  function renderGate() {
    const lines = SHIELD_LINES[state.saga] || SHIELD_LINES.got;
    $("ws-gate-controls").innerHTML =
      `<div class="ws-gate-state">${lines.map(([k, label]) =>
        `<div class="ws-gate-line${shield[k] ? " on" : ""}"><span>${label}</span><b>${shieldWord(k, shield[k] || 0)}</b></div>`).join("")}
      </div>
      <button type="button" class="ws-gate-open" data-open-shield>&#128737; Change how far I have come</button>`;
    updateGateCount();
  }

  function updateGateCount() {
    const safe = pool(state.fmt).filter(allowed);
    const exact = state.d === 0 ? safe : safe.filter((q) => q.d === state.d);
    const runLen = Math.min(ROUND_LEN, (exact.length >= ROUND_LEN ? exact : safe).length);
    let msg = `Under this shield, <b>${safe.length}</b> lines may pass.`;
    if (safe.length === 0) msg = `<span class="ws-gate-warn">No lines can pass this shield — raise a season or a book.</span>`;
    else if (runLen < ROUND_LEN) msg += ` <span class="ws-gate-warn">The examination will be ${runLen} lines long.</span>`;
    $("ws-gate-count").innerHTML = msg;
    $("ws-gate-go").disabled = safe.length === 0;
  }

  $("ws-start").addEventListener("click", () => { renderGate(); showScreen("ws-gate"); });
  $("ws-gate-back").addEventListener("click", () => showScreen("ws-setup"));
  $("ws-gate-nospoil").addEventListener("click", () => {
    if (window.KWShield) window.KWShield.setAll();          /* fires kw-shield → re-renders */
    else {
      Object.keys(SHIELD_MAX).forEach((k) => { shield[k] = SHIELD_MAX[k]; });
      try { localStorage.setItem("tvShield", JSON.stringify(shield)); } catch (e) {}
      renderGate();
    }
  });
  $("ws-gate-go").addEventListener("click", start);
  $("ws-quit").addEventListener("click", () => { resetHall(); showScreen("ws-setup"); });
  function resetHall() { state.score = 0; state.deck = []; state.hung = []; lightHall(); }

  /* ---------------- the examination ---------------- */
  function buildDeck() {
    let candidates = pool(state.fmt).filter(allowed);
    const exact = candidates.filter((q) => q.d === state.d);
    candidates = exact.length >= ROUND_LEN ? exact : exact.concat(candidates.filter((q) => q.d !== state.d));
    return shuffle(candidates).slice(0, ROUND_LEN);
  }

  function start() {
    state.deck = buildDeck();
    if (!state.deck.length) { showScreen("ws-gate"); return; }
    state.i = 0; state.score = 0; state.streak = 0; state.best = 0;
    state.hintUsed = false; state.fiftyUsed = false;
    state.hung = state.deck.map(() => null);   /* one empty niche per question */
    lightHall();
    showScreen("ws-game");
    renderFaces();
    renderQuestion();
  }

  /* The wall of faces: one niche per question. Name the speaker and their
     portrait is hung there; miss and the niche stays empty. */
  function renderFaces() {
    $("ws-faces").innerHTML = state.hung.map((h, i) => {
      if (h) {
        return `<span class="ws-face ws-face-got" title="${esc(h.name)}">` +
          (h.portrait ? `<img src="${h.portrait}" alt="${esc(h.name)}"/>` : "") + `</span>`;
      }
      const cls = i === state.i ? "ws-face ws-face-now" : (i < state.i ? "ws-face ws-face-missed" : "ws-face");
      return `<span class="${cls}"></span>`;
    }).join("");
  }
  function esc(t) { return String(t == null ? "" : t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }

  function renderQuestion() {
    const q = state.deck[state.i];
    $("ws-quote").textContent = q.q;
    $("ws-hint").textContent = ""; $("ws-hint").classList.add("hidden");
    $("ws-context").textContent = ""; $("ws-context").classList.add("hidden");
    $("ws-next").classList.add("hidden");
    $("ws-streak").textContent = state.streak >= 2 ? "🔥 " + state.streak + " streak" : "";
    state.fiftyHidden = null;

    const card = $("ws-card");
    card.classList.remove("ws-anim-in");
    void card.offsetWidth;
    card.classList.add("ws-anim-in");

    const answers = [q.speaker, ...q.wrong].map((name, i) => ({ name, right: i === 0, portrait: portraitFor(name) }));
    shuffle(answers);
    $("ws-answers").innerHTML = "";
    answers.forEach((ans) => {
      const b = document.createElement("button");
      b.className = "ws-a";
      b.innerHTML = (ans.portrait ? `<img class="ws-a-portrait" src="${ans.portrait}" alt="" />` : `<span class="ws-a-portrait"></span>`) +
        `<span class="ws-a-name">${ans.name}</span>`;
      b.addEventListener("click", () => pick(b, ans.right, q));
      b.dataset.right = ans.right ? "1" : "0";
      $("ws-answers").appendChild(b);
    });

    $("ws-hint-btn").disabled = state.hintUsed;
    $("ws-hint-btn").textContent = "";
    $("ws-hint-btn").innerHTML = (state.hintUsed ? "💡 Hint used" : "💡 Hint") + ` <span class="ws-tool-tag">1 per round</span>`;
    $("ws-fifty-btn").disabled = state.fiftyUsed;
    $("ws-fifty-btn").innerHTML = (state.fiftyUsed ? "⚖️ 50/50 used" : "⚖️ 50/50") + ` <span class="ws-tool-tag">1 per round</span>`;
  }

  $("ws-hint-btn").addEventListener("click", () => {
    if (state.hintUsed) return;
    const q = state.deck[state.i];
    state.hintUsed = true;
    $("ws-hint").textContent = q.hint;
    $("ws-hint").classList.remove("hidden");
    $("ws-hint-btn").disabled = true;
    $("ws-hint-btn").innerHTML = `💡 Hint used <span class="ws-tool-tag">1 per round</span>`;
  });

  $("ws-fifty-btn").addEventListener("click", () => {
    if (state.fiftyUsed) return;
    state.fiftyUsed = true;
    const wrongBtns = Array.from(document.querySelectorAll(".ws-a")).filter((b) => b.dataset.right === "0");
    shuffle(wrongBtns).slice(0, 2).forEach((b) => b.classList.add("faded-out"));
    $("ws-fifty-btn").disabled = true;
    $("ws-fifty-btn").innerHTML = `⚖️ 50/50 used <span class="ws-tool-tag">1 per round</span>`;
  });

  function pick(btn, right, q) {
    document.querySelectorAll(".ws-a").forEach((b) => {
      b.disabled = true;
      if (b !== btn && b.dataset.right === "1") b.classList.add("right");
      else if (b !== btn) b.classList.add("dim");
    });
    btn.classList.add(right ? "right" : "wrong");
    if (right) {
      state.score++; state.streak++; state.best = Math.max(state.best, state.streak);
      state.hung[state.i] = { name: q.speaker, portrait: portraitFor(q.speaker) };
    } else state.streak = 0;
    renderFaces();
    lightHall();
    $("ws-context").textContent = q.context;
    $("ws-context").classList.remove("hidden");
    $("ws-next").textContent = state.i + 1 < state.deck.length ? "Next line →" : "See the verdict →";
    $("ws-next").classList.remove("hidden");
    $("ws-hint-btn").disabled = true;
    $("ws-fifty-btn").disabled = true;
  }

  $("ws-next").addEventListener("click", () => {
    state.i++;
    if (state.i >= state.deck.length) return renderResult();
    renderFaces();
    renderQuestion();
  });

  function renderResult() {
    /* the Cabinet — see the note in trivia-engine.js. `clean` means the round
       was taken without spending either of the two once-a-round aids. */
    if (window.KWCollection) {
      KWCollection.record("whosaidit", {
        right: state.score, of: state.deck.length,
        hard: state.d === 3, fmt: state.fmt, saga: state.saga,
        clean: !state.hintUsed && !state.fiftyUsed,
      });
    }
    const rank = RANKS.find((r) => state.score >= r[0]);
    const el = $("ws-result");
    el.innerHTML = `
      <div class="ws-kicker">The Verdict</div>
      <div class="ws-score-ring"><b id="ws-score-num">0</b><span>of ${state.deck.length} correct</span></div>
      <div class="ws-rank ws-reveal-1">${rank[1]}</div>
      <p class="ws-rank-sub ws-reveal-2">${rank[2]}${state.best >= 3 ? ` Your best streak: <b>${state.best}</b> in a row.` : ""}</p>
      <div class="ws-result-actions ws-reveal-3">
        <button id="ws-again">Same again, fresh lines</button>
        <button id="ws-setup-btn">Change format or difficulty</button>
      </div>`;
    showScreen("ws-result");
    $("ws-again").addEventListener("click", start);
    $("ws-setup-btn").addEventListener("click", () => { resetHall(); showScreen("ws-setup"); });

    const num = $("ws-score-num");
    const total = state.score;
    const dur = 900, t0 = performance.now();
    (function tick(t) {
      const p = Math.min(1, (t - t0) / dur);
      num.textContent = Math.round(total * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  }
})();
