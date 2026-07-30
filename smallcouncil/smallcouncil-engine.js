/* THE SMALL COUNCIL — engine.
 *
 * Sixteen names, four hidden groups of four, four braziers. Every wrong seating
 * puts out a brazier, the room gets colder, and the thing in the dark behind the
 * board comes a step nearer. Put out the last one and it has you. Seat all four
 * groups and dragonfire takes the winter back.
 *
 * The daily council is chosen by the date, and the tiles are shuffled from a
 * seed made of the puzzle's id and the day, so every player anywhere gets the
 * same board — no server needed.
 *
 * Reads window.COUNCILS (councils-data.js). Shares the spoiler shield with
 * Trivia and Who Said It via localStorage["tvShield"].
 */
(function () {
  const shell = document.getElementById("sc-shell");
  if (!shell || !window.COUNCILS || !window.COUNCILS.length) return;

  const $ = (id) => document.getElementById(id);
  const P = window.COUNCILS;
  const LIVES = 4;
  const EPOCH = Date.UTC(2026, 0, 1);
  const SCREENS = ["sc-setup", "sc-gate", "sc-game", "sc-result"];
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const RAVEN = { t1: "🟨", t2: "🟩", t3: "🟦", t4: "🟪" };
  const TABLE_DIR = shell.dataset.art || "assets/";

  /* ---------------- the shield, shared with the other games ----------------
     Default to a CLOSED shield for a first-time visitor (no saved tvShield), so a
     spoilery daily gates them with a warning rather than dropping a finale reveal
     on someone who never told us how far along they are — matching Trivia. A
     shield set here, in Trivia, or in Who Said It (same localStorage key) wins. */
  let shield = { gotS: 0, gotB: 0, hotdS: 0, hotdB: 0, knightS: 0, knightB: 0 };
  function readShield() {
    try {
      const raw = localStorage.getItem("tvShield");
      if (raw) shield = Object.assign(shield, JSON.parse(raw));
    } catch (e) {}
  }
  readShield();
  /* the gate now offers a button that opens the site-wide shield dialog, so
     the answer can change while this page is open — re-read it and let the
     reader straight back in if their new mark clears the council they wanted */
  window.addEventListener("kw-shield", () => {
    readShield();
    const gate = $("sc-gate");
    if (gate && !gate.classList.contains("hidden") && pending && allowed(pending)) {
      begin(pending, pendingDaily);
    }
  });
  function allowed(p) {
    if (p.s == null && p.b == null) return true;
    if (p.s != null && (shield[p.saga + "S"] || 0) >= p.s) return true;
    if (p.b != null && (shield[p.saga + "B"] || 0) >= p.b) return true;
    return false;
  }

  /* ---------------- what has been played before ---------------- */
  let progress = {};
  try { progress = JSON.parse(localStorage.getItem("scProgress") || "{}") || {}; } catch (e) { progress = {}; }
  function saveProgress() { try { localStorage.setItem("scProgress", JSON.stringify(progress)); } catch (e) {} }

  /* ---------------- which saga's councils ----------------
     The chamber can hold all the realm's councils at once, or be narrowed to a
     single saga. The daily seat is then chosen from within whatever pool is
     active, so "today's council" always belongs to the saga you asked for. */
  const SAGAS = ["all", "got", "hotd", "knight"];
  let saga = "all";
  try { const s = localStorage.getItem("scSaga"); if (s && SAGAS.indexOf(s) >= 0) saga = s; } catch (e) {}
  function pool() { return saga === "all" ? P : P.filter((p) => p.saga === saga); }

  /* The DAILY is always "all the realm" — today's seat, the same for everyone.
     Everything else (the archive, and filtering by saga) is "practice", sealed
     away behind the unlock until you have sat today's council. */
  let practice = false;
  function dailyCouncil() { const i = dayIdx(P); return i >= 0 ? P[i] : null; }
  function dailyDone() { return !!(window.DailyRealm && DailyRealm.isDone("smallcouncil")); }

  /* ---------------- the daily ---------------- */
  const dayNumber = Math.floor((Date.now() - EPOCH) / 86400000);
  function dayIdx(list) { return list.length ? (((dayNumber % list.length) + list.length) % list.length) : -1; }

  /* A tiny seeded generator, so the shuffle is the same board for everyone on
     the same day rather than a fresh scramble on every reload. */
  function seedFrom(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function seededShuffle(arr, seed) {
    const rnd = mulberry32(seed), a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }

  /* ---------------- the table ----------------
     Five paintings of the same desk: warm and candlelit at table1, and by table5
     frozen black with the dead hand closed over the parchment. They are stacked
     and cross-faded rather than swapped, so a lost brazier is a slow chill
     rather than a cut. The board itself is written on the parchment. */
  const TABLES = 5;
  const table = document.getElementById("sc-table");
  if (table) {
    let h = "";
    for (let i = 1; i <= TABLES; i++) {
      h += `<div class="sc-table-layer${i === 1 ? " on" : ""}" data-n="${i}"` +
           ` style="background-image:url('${TABLE_DIR}table${i}.webp')"></div>`;
    }
    table.innerHTML = h;
  }
  function setTable(n) {
    /* data-t drives the ink colour: sepia on warm parchment, cold ink once the
       sheet frosts over, pale on the black ice of the last painting. */
    shell.setAttribute("data-t", String(n));
    if (!table) return;
    Array.prototype.forEach.call(table.children, (el) => {
      el.classList.toggle("on", +el.dataset.n === n);
    });
  }

  const cold = document.createElement("div");
  cold.innerHTML = `<div class="sc-frost"></div><div class="sc-fire"></div>`;
  while (cold.firstChild) shell.insertBefore(cold.firstChild, shell.firstChild);

  function setChill(v) { shell.style.setProperty("--chill", String(Math.max(0, Math.min(1, v)))); }
  function setPhase(p) { shell.setAttribute("data-phase", p); }
  setChill(0); setPhase("setup"); setTable(1);

  /* ---------------- state ---------------- */
  const state = { p: null, tiles: [], sel: [], solved: [], mistakes: 0, history: [], over: false, timers: [] };
  function clearTimers() { state.timers.forEach(clearTimeout); state.timers = []; }
  function later(fn, ms) { state.timers.push(setTimeout(fn, ms)); }

  function showScreen(id) {
    SCREENS.forEach((s) => { const el = $(s); if (el) el.classList.toggle("hidden", s !== id); });
    const el = $(id);
    if (!el) return;
    el.classList.remove("sc-anim-in");
    void el.offsetWidth;
    el.classList.add("sc-anim-in");
  }

  /* ---------------- setup screen ---------------- */
  const DATE_FMT = { weekday: "long", day: "numeric", month: "long", year: "numeric" };
  function markOf(id) {
    const r = progress[id];
    if (!r) return "";
    return r.won
      ? `<span class="sc-arch-mark won" title="Seated, with ${r.mistakes} brazier${r.mistakes === 1 ? "" : "s"} lost">&#9873;</span>`
      : `<span class="sc-arch-mark lost" title="The cold took this one">&#10052;</span>`;
  }
  /* the saga chips */
  const sagaBar = $("sc-sagas");
  if (sagaBar) {
    Array.prototype.forEach.call(sagaBar.querySelectorAll(".sc-saga"), (b) => {
      b.addEventListener("click", () => {
        saga = b.dataset.saga;
        try { localStorage.setItem("scSaga", saga); } catch (e) {}
        renderSetup();
      });
    });
  }

  function renderSetup() {
    const daily = dailyCouncil();
    const startBtn = $("sc-start");

    /* today's council — always all the realm */
    if (!daily) {
      $("sc-today").className = "sc-today sc-empty";
      $("sc-today").innerHTML = "No councils have been seated yet &mdash; they are being written.";
      if (startBtn) startBtn.style.display = "none";
    } else {
      if (startBtn) startBtn.style.display = "";
      $("sc-today").className = "sc-today";
      const done = progress[daily.id];
      $("sc-today").innerHTML =
        `<div class="sc-today-tag">Today's council &mdash; all the realm</div>
         <div class="sc-today-name">${esc(daily.name)}</div>
         <div class="sc-today-date">${new Date().toLocaleDateString(undefined, DATE_FMT)}</div>
         ${done ? `<div class="sc-today-done">${done.won
            ? "You seated this council &mdash; " + done.mistakes + " brazier" + (done.mistakes === 1 ? "" : "s") + " lost."
            : "The cold took you at this table. Sit again if you dare."}</div>` : ""}`;
      startBtn.textContent = done ? "Take your seat again →" : "Take your seat →";
    }

    /* the rest of the councils stay sealed until the daily is met */
    const showPractice = practice || dailyDone();
    $("sc-practice").classList.toggle("hidden", !showPractice);
    $("sc-unlock").classList.toggle("hidden", showPractice);
    if (showPractice) renderPractice(daily);

    showScreen("sc-setup");
  }

  function renderPractice(daily) {
    if (sagaBar) {
      Array.prototype.forEach.call(sagaBar.querySelectorAll(".sc-saga"), (b) =>
        b.classList.toggle("on", b.dataset.saga === saga));
    }
    const active = pool().filter((p) => !daily || p.id !== daily.id);
    $("sc-archive").innerHTML = active.length
      ? active.map((p) => `<button class="sc-arch" data-id="${esc(p.id)}"><b>${esc(p.name)}</b>${markOf(p.id)}</button>`).join("")
      : `<p class="sc-archive-note">No other councils in this saga yet.</p>`;
    Array.prototype.forEach.call($("sc-archive").querySelectorAll(".sc-arch"), (b) => {
      b.addEventListener("click", () => { const p = P.filter((x) => x.id === b.dataset.id)[0]; if (p) open(p, false); });
    });
  }

  /* ---------------- the spoiler gate ---------------- */
  let pending = null, pendingDaily = false;
  function open(p, isDaily) {
    if (allowed(p)) return begin(p, isDaily);
    pending = p; pendingDaily = !!isDaily;
    $("sc-gate-body").innerHTML =
      `<p class="sc-sub">This council&rsquo;s business runs ahead of the shield you set in the other games.
        Its groups would name people and places you have not met yet.</p>`;
    showScreen("sc-gate");
  }
  $("sc-gate-go").addEventListener("click", () => { if (pending) begin(pending, pendingDaily); });
  $("sc-gate-back").addEventListener("click", () => renderSetup());

  /* ---------------- a round ---------------- */
  function begin(p, isDaily) {
    clearTimers();
    state.isDaily = !!isDaily;
    state.p = p; state.sel = []; state.solved = []; state.mistakes = 0; state.history = []; state.over = false;
    const words = [];
    p.groups.forEach((g) => g.w.forEach((w) => words.push({ w: w, c: g.c })));
    state.tiles = seededShuffle(words, seedFrom(p.id + "|" + dayNumber));
    setChill(0); setPhase("playing"); setTable(1);
    $("sc-title").textContent = p.name;
    $("sc-msg").textContent = "";
    $("sc-msg").className = "sc-msg";
    renderLives(); renderBoard();
    showScreen("sc-game");
  }

  function renderLives() {
    let h = `<span class="sc-lives-label">Braziers</span>`;
    /* they go out from the right, so the fire you have left reads left to right */
    for (let i = 0; i < LIVES; i++) h += `<span class="sc-life${i >= LIVES - state.mistakes ? " out" : ""}"></span>`;
    $("sc-lives").innerHTML = h;
  }

  function groupByColor(c) { return state.p.groups.filter((g) => g.c === c)[0]; }

  function renderBoard() {
    $("sc-solved").innerHTML = state.solved.map((s) => {
      const g = groupByColor(s.c);
      return `<div class="sc-band sc-band-${g.c}${s.missed ? " sc-band-missed" : ""}">
        <b>${esc(g.t)}</b><span>${g.w.map(esc).join(" &middot; ")}</span><i>${esc(g.note)}</i></div>`;
    }).join("");

    const solvedColors = state.solved.map((s) => s.c);
    $("sc-grid").innerHTML = state.tiles
      .filter((t) => solvedColors.indexOf(t.c) < 0)
      .map((t) => `<button class="sc-tile${state.sel.indexOf(t.w) >= 0 ? " sel" : ""}" data-w="${esc(t.w)}">${esc(t.w)}</button>`)
      .join("");
    Array.prototype.forEach.call($("sc-grid").querySelectorAll(".sc-tile"), (b) => {
      b.addEventListener("click", () => toggle(b.dataset.w));
    });
    syncTools();
  }

  function syncTools() {
    $("sc-submit").disabled = state.over || state.sel.length !== 4;
    $("sc-clear").disabled = state.over || state.sel.length === 0;
    $("sc-shuffle").disabled = state.over;
  }

  function toggle(w) {
    if (state.over) return;
    const i = state.sel.indexOf(w);
    if (i >= 0) state.sel.splice(i, 1);
    else if (state.sel.length < 4) state.sel.push(w);
    Array.prototype.forEach.call($("sc-grid").querySelectorAll(".sc-tile"), (b) => {
      b.classList.toggle("sel", state.sel.indexOf(b.dataset.w) >= 0);
    });
    syncTools();
  }

  function selTiles() {
    return Array.prototype.filter.call($("sc-grid").querySelectorAll(".sc-tile"),
      (b) => state.sel.indexOf(b.dataset.w) >= 0);
  }
  function colorOf(w) { const t = state.tiles.filter((x) => x.w === w)[0]; return t ? t.c : "t1"; }

  const CHILL_LINES = [
    "The fire gutters. Cold creeps in under the door.",
    "Frost climbs the walls of the chamber. Something in the dark takes a step.",
    "One brazier left. Your breath hangs white above the table.",
  ];

  function submit() {
    if (state.over || state.sel.length !== 4) return;
    const picked = state.sel.slice();
    state.history.push(picked.map(colorOf));

    const solvedColors = state.solved.map((s) => s.c);
    let hit = null, best = 0;
    state.p.groups.forEach((g) => {
      if (solvedColors.indexOf(g.c) >= 0) return;
      const n = g.w.filter((w) => picked.indexOf(w) >= 0).length;
      if (n > best) best = n;
      if (n === 4) hit = g;
    });

    if (hit) {
      state.solved.push({ c: hit.c });
      state.sel = [];
      $("sc-msg").className = "sc-msg";
      $("sc-msg").textContent = state.solved.length === 4 ? "" : "Seated. The table takes shape.";
      renderBoard();
      if (state.solved.length === 4) win();
      return;
    }

    /* wrong — a brazier goes out and the room takes a breath of winter */
    const tiles = selTiles();
    tiles.forEach((b) => { b.classList.add("shake", "froze"); });
    later(() => tiles.forEach((b) => b.classList.remove("shake", "froze")), 1250);

    state.mistakes++;
    setChill(state.mistakes / LIVES);
    setTable(Math.min(state.mistakes + 1, TABLES));
    renderLives();
    $("sc-msg").className = "sc-msg cold";
    $("sc-msg").textContent = state.mistakes >= LIVES ? ""
      : (best === 3 ? "One name out of place. " : "") + CHILL_LINES[state.mistakes - 1];
    state.sel = [];
    syncTools();
    Array.prototype.forEach.call($("sc-grid").querySelectorAll(".sc-tile"), (b) => b.classList.remove("sel"));

    if (state.mistakes >= LIVES) lose();
  }

  function revealRest() {
    const solvedColors = state.solved.map((s) => s.c);
    state.p.groups.forEach((g) => { if (solvedColors.indexOf(g.c) < 0) state.solved.push({ c: g.c, missed: true }); });
    state.sel = [];
    renderBoard();
  }

  function record(won) {
    progress[state.p.id] = { won: won, mistakes: state.mistakes, day: dayNumber };
    saveProgress();
  }

  function win() {
    state.over = true; record(true);
    setChill(0); setPhase("won"); setTable(1);
    later(() => result(true), 1500);
  }
  function lose() {
    state.over = true; record(false);
    setChill(1); setPhase("lost"); setTable(TABLES);
    later(revealRest, 900);
    later(() => result(false), 2400);
  }

  function ravenGrid() {
    return state.history.map((row) => row.map((c) => RAVEN[c] || "").join("")).join("\n");
  }

  function goPractice() {
    practice = true;
    setChill(0); setPhase("setup"); setTable(1);
    renderSetup();
  }
  function wireRavenCopy(p, grid) {
    const c = $("sc-copy");
    if (!c) return;
    c.addEventListener("click", function () {
      const text = "The Small Council — " + p.name + "\n" + grid + "\n" + location.origin + location.pathname;
      const done = () => { c.textContent = "✓ Copied"; };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, done);
      else { const ta = document.createElement("textarea"); ta.value = text; document.body.appendChild(ta); ta.select(); try { document.execCommand("copy"); } catch (e) {} document.body.removeChild(ta); done(); }
    });
  }

  function result(won) {
    const p = state.p;
    const grid = ravenGrid();

    /* the DAILY earns a scene (and the streak); practice councils get the plain
       result so you can rattle through them */
    if (state.isDaily) {
      if (window.KWStreak) KWStreak.mark();
      if (window.DailyRealm) DailyRealm.markDone("smallcouncil", won);
      const streak = won && window.KWStreak ? (KWStreak.get().count || 0) : 0;
      let extra = "";
      if (!won) extra += `<div class="sc-answers">${p.groups.map((g) =>
        `<div class="sc-answer sc-band-${g.c}"><b>${esc(g.t)}</b><span>${g.w.map(esc).join(" &middot; ")}</span></div>`).join("")}</div>`;
      extra += `<div class="sc-raven">${grid.replace(/\n/g, "<br/>")}</div>`;
      extra += `<div class="dr-actions"><button class="dr-ghost" id="sc-copy" type="button">&#128330; Copy the raven</button></div>`;
      $("sc-result").innerHTML = '<div id="sc-scene"></div>';
      if (window.DailyRealm) {
        DailyRealm.renderResult($("sc-scene"), { won: won, prefix: "../", streak: streak, extraHTML: extra, onUnlimited: goPractice });
      }
      wireRavenCopy(p, grid);
      showScreen("sc-result");
      return;
    }

    $("sc-result").innerHTML =
      `<div class="sc-kicker">${esc(p.name)}</div>
       <div class="sc-verdict ${won ? "won" : "lost"}">${won ? "The winter breaks" : "The Night King has you"}</div>
       <p class="sc-verdict-sub">${won
         ? "Dragonfire runs the length of the chamber and the frost goes to water on the flagstones. The hand at your shoulder burns away without a sound. " +
           (state.mistakes === 0 ? "Not one brazier lost &mdash; the council was seated cleanly." : "You lost " + state.mistakes + " brazier" + (state.mistakes === 1 ? "" : "s") + " getting here.")
         : "The last brazier gutters out. The cold comes all the way in, and the hand you have been trying not to look at closes on the sheet. This is how the table should have been seated:"}</p>
       ${won ? "" : `<div class="sc-answers">${p.groups.map((g) =>
         `<div class="sc-answer sc-band-${g.c}"><b>${esc(g.t)}</b><span>${g.w.map(esc).join(" &middot; ")}</span></div>`).join("")}</div>`}
       <div class="sc-raven">${grid.replace(/\n/g, "<br/>")}</div>
       <div class="sc-result-actions">
         <button class="sc-tool sc-tool-go" id="sc-copy">&#128330; Copy the raven</button>
         <button class="sc-tool" id="sc-again">Another council &rarr;</button>
       </div>`;
    showScreen("sc-result");
    $("sc-copy").addEventListener("click", function () {
      const text = "The Small Council — " + p.name + "\n" + grid + "\n" + location.origin + location.pathname;
      const done = () => { this.textContent = "✓ Copied"; };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, done);
      else {
        const ta = document.createElement("textarea");
        ta.value = text; document.body.appendChild(ta); ta.select();
        try { document.execCommand("copy"); } catch (e) {}
        document.body.removeChild(ta); done();
      }
    });
    $("sc-again").addEventListener("click", () => { setChill(0); setPhase("setup"); setTable(1); renderSetup(); });
  }

  /* ---------------- wiring ---------------- */
  $("sc-start").addEventListener("click", () => { const d = dailyCouncil(); if (d) open(d, true); });
  $("sc-unlock").addEventListener("click", () => { practice = true; renderSetup(); });
  $("sc-submit").addEventListener("click", submit);
  $("sc-clear").addEventListener("click", () => {
    state.sel = [];
    Array.prototype.forEach.call($("sc-grid").querySelectorAll(".sc-tile"), (b) => b.classList.remove("sel"));
    syncTools();
  });
  $("sc-shuffle").addEventListener("click", () => {
    state.tiles = seededShuffle(state.tiles, (Math.random() * 4294967296) >>> 0);
    renderBoard();
  });
  $("sc-quit").addEventListener("click", () => {
    clearTimers(); state.over = true; setChill(0); setPhase("setup"); setTable(1); renderSetup();
  });

  renderSetup();
})();
