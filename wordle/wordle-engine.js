/* WORDLE OF THE REALM — engine.
 *
 * Six guesses. Choose the word's length (four, five or six letters). Play the
 * day's daily — one word per length, the same for everyone, changing at
 * midnight — or switch to unlimited and keep going.
 *
 * There are no names. If you guess a character's name the game says so, rather
 * than the usual "not a word", because the owner wants that made explicit: this
 * is a game of words, not of who's-who.
 *
 * Reads window.WORDLE_WORDS (words.js) and, if present, window.PEOPLE_IMGS
 * (../js/people.js) to know which guesses are names.
 */
(function () {
  const $ = (id) => document.getElementById(id);
  const POOLS = window.WORDLE_WORDS || { 4: [], 5: [], 6: [] };
  const MAX_GUESSES = 6;
  const MARK_RANK = { absent: 1, present: 2, correct: 3 };
  const EPOCH = Date.UTC(2026, 0, 1);

  /* clean the pools: drop anything not exactly its length, warn if we do */
  Object.keys(POOLS).forEach((L) => {
    const n = +L;
    const bad = POOLS[L].filter((w) => w.length !== n);
    if (bad.length) console.warn("WORDLE: wrong-length words for " + L + ":", bad);
    POOLS[L] = Array.from(new Set(POOLS[L].filter((w) => w.length === n)));
  });

  /* ---------------- the names to refuse ----------------
     Every token of every character portrait key, 4-6 letters, uppercased. A
     guess that is one of these — and not itself a word in the pool — is turned
     away with a message about names rather than the generic one. */
  const NAME_TOKENS = new Set();
  if (typeof PEOPLE_IMGS !== "undefined") {
    Object.keys(PEOPLE_IMGS).forEach((full) => {
      String(full).toUpperCase().split(/[^A-Z]+/).forEach((tok) => {
        if (tok.length >= 4 && tok.length <= 6) NAME_TOKENS.add(tok);
      });
    });
  }

  /* ---------------- date helpers ---------------- */
  function dayNumber() { return Math.floor((Date.now() - EPOCH) / 86400000); }
  function todayKey() { return new Date().toISOString().slice(0, 10); }
  function hash(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }

  /* ---------------- state ---------------- */
  const state = {
    len: 5, mode: "daily", answer: "", guesses: [], keyState: {}, over: false, won: false,
  };

  function pool() { return POOLS[state.len] || []; }
  function dailyAnswer(len) {
    const p = POOLS[len] || [];
    if (!p.length) return "";
    return p[hash(len + "|" + dayNumber()) % p.length];
  }
  function randomAnswer(len, avoid) {
    const p = POOLS[len] || [];
    if (!p.length) return "";
    let w = p[Math.floor(Math.random() * p.length)];
    if (w === avoid && p.length > 1) w = p[(p.indexOf(w) + 1) % p.length];
    return w;
  }

  /* ---------------- daily bookkeeping ---------------- */
  function loadDaily() { try { return JSON.parse(localStorage.getItem("wordleDaily") || "{}") || {}; } catch (e) { return {}; } }
  function saveDaily(rec) { try { localStorage.setItem("wordleDaily", JSON.stringify(rec)); } catch (e) {} }
  function dailyId() { return todayKey() + ":" + state.len; }
  function dailyRec() { const d = loadDaily(); return d[dailyId()] || null; }
  /* Persist the daily's progress after EVERY guess, not just at the end, so a
     refresh resumes where you left off — and so there is no way to wipe a
     started daily and get a fresh run at today's word. */
  function saveDailyProgress() {
    if (state.mode !== "daily") return;
    const d = loadDaily();
    d[dailyId()] = {
      done: state.over, won: state.won, answer: state.answer,
      guesses: state.guesses.map((g) => g.word),
    };
    saveDaily(d);
  }

  /* ---------------- evaluation ---------------- */
  function evaluate(guess, answer) {
    const marks = Array(guess.length).fill("absent");
    const left = {};
    for (let i = 0; i < guess.length; i++) {
      if (guess[i] === answer[i]) marks[i] = "correct";
      else left[answer[i]] = (left[answer[i]] || 0) + 1;
    }
    for (let i = 0; i < guess.length; i++) {
      if (marks[i] === "correct") continue;
      if (left[guess[i]] > 0) { marks[i] = "present"; left[guess[i]]--; }
    }
    return marks;
  }

  /* ---------------- rendering ---------------- */
  const typed = { value: "" };

  function renderBoard() {
    const cur = state.over ? "" : typed.value;
    let html = "";
    for (let r = 0; r < MAX_GUESSES; r++) {
      const past = state.guesses[r];
      const active = !past && r === state.guesses.length ? cur : "";
      html += `<div class="wd-row" style="grid-template-columns:repeat(${state.len},1fr)">`;
      for (let c = 0; c < state.len; c++) {
        const ch = past ? past.word[c] : (active[c] || "");
        const mk = past ? past.marks[c] : "";
        html += `<div class="wd-cell${ch ? " filled" : ""}${mk ? " " + mk : ""}">${ch}</div>`;
      }
      html += "</div>";
    }
    $("wd-board").innerHTML = html;
    /* the give-up button is offered only while a game is in play */
    const gu = $("wd-giveup");
    if (gu) gu.classList.toggle("hidden", state.over);
  }

  const KEY_ROWS = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACK"],
  ];
  function renderKeys() {
    $("wd-keys").innerHTML = "";
    KEY_ROWS.forEach((r) => {
      const rd = document.createElement("div"); rd.className = "wd-krow";
      r.forEach((k) => {
        const b = document.createElement("button");
        const wide = k === "ENTER" || k === "BACK";
        b.className = "wd-key" + (wide ? " wd-key-wide" : "") + (state.keyState[k] ? " " + state.keyState[k] : "");
        b.dataset.key = k;
        b.innerHTML = k === "BACK" ? "&#9003;" : (k === "ENTER" ? "Enter" : k);
        b.addEventListener("click", () => onKey(k));
        rd.appendChild(b);
      });
      $("wd-keys").appendChild(rd);
    });
  }

  function setMsg(m, kind) {
    const el = $("wd-msg");
    el.textContent = m || "";
    el.className = "wd-msg" + (kind ? " wd-msg-" + kind : "");
  }

  function renderMeta() {
    $("wd-mode-label").textContent = state.mode === "daily" ? "Today's word" : "Unlimited";
    $("wd-sub").textContent = state.mode === "daily"
      ? "One word a day, the same for everyone. It changes at midnight."
      : "Word after word, for as long as you like.";
    document.querySelectorAll("#wd-lens .wd-len").forEach((b) => b.classList.toggle("active", +b.dataset.len === state.len));
    document.querySelectorAll("#wd-modes .wd-mode").forEach((b) => b.classList.toggle("active", b.dataset.mode === state.mode));
    $("wd-new").classList.toggle("hidden", state.mode !== "unlimited");
  }

  /* ---------------- input ---------------- */
  function onKey(k) {
    if (state.over) return;
    if (k === "ENTER") return submit();
    if (k === "BACK") { typed.value = typed.value.slice(0, -1); renderBoard(); return; }
    if (/^[A-Z]$/.test(k) && typed.value.length < state.len) { typed.value += k; renderBoard(); }
  }

  function submit() {
    if (state.over) return;
    const g = typed.value;
    if (g.length !== state.len) { setMsg(numberWord(state.len) + " letters are needed.", "warn"); shakeRow(); return; }
    if (!pool().includes(g)) {
      if (NAME_TOKENS.has(g)) setMsg("There are no names in this game — only words of the realm.", "warn");
      else setMsg("Not a word of the realm.", "warn");
      shakeRow();
      return;
    }
    const marks = evaluate(g, state.answer);
    state.guesses.push({ word: g, marks });
    g.split("").forEach((ch, i) => {
      const cur = state.keyState[ch];
      if (!cur || MARK_RANK[marks[i]] > MARK_RANK[cur]) state.keyState[ch] = marks[i];
    });
    typed.value = "";

    if (g === state.answer) { state.over = true; state.won = true; finish(); }
    else if (state.guesses.length >= MAX_GUESSES) { state.over = true; state.won = false; finish(); }
    else { setMsg(""); saveDailyProgress(); }
    renderBoard(); renderKeys();
  }

  /* give up — reveal the word and end. In daily mode it is sealed as a loss, so
     there is no second run at today's word. */
  function giveUp() {
    if (state.over) return;
    state.over = true; state.won = false;
    finish();
    renderBoard(); renderKeys();
  }

  function shakeRow() {
    const rows = $("wd-board").children;
    const r = rows[state.guesses.length];
    if (!r) return;
    r.classList.remove("wd-shake"); void r.offsetWidth; r.classList.add("wd-shake");
  }

  function finish() {
    saveDailyProgress();   /* records done:true, since state.over is set */
    if (state.mode === "daily") {
      if (window.KWStreak) KWStreak.mark();              /* today's daily is done */
      if (window.DailyRealm) DailyRealm.markDone("wordle", state.won);
      showDailyScene(state.won);                          /* the picture scene, not a text line */
      return;
    }
    if (state.won) {
      const t = state.guesses.length;
      setMsg(t === 1 ? "In one. The maesters will not believe it." : "The word is yours — in " + t + ".", "win");
    } else {
      setMsg("The word was " + state.answer + ".", "lose");
    }
    $("wd-result").innerHTML = resultHTML();
    $("wd-result").classList.remove("hidden");
    wireResult();
  }

  function resultHTML() {
    const grid = state.guesses.map((row) =>
      row.marks.map((m) => m === "correct" ? "🟩" : m === "present" ? "🟨" : "⬛").join("")).join("\n");
    const head = state.mode === "daily"
      ? "Wordle of the Realm — today's " + state.len + "-letter word"
      : "Wordle of the Realm — " + state.len + " letters";
    const line = state.won ? (state.guesses.length + "/" + MAX_GUESSES) : ("X/" + MAX_GUESSES);
    return `<div class="wd-result-grid">${grid.replace(/\n/g, "<br/>")}</div>
      <div class="wd-result-actions">
        <button class="wd-btn wd-btn-go" id="wd-copy">&#128203; Copy result</button>
        ${state.mode === "daily"
          ? `<button class="wd-btn" id="wd-goun">Play unlimited &rarr;</button>`
          : `<button class="wd-btn" id="wd-again">Another word &rarr;</button>`}
      </div>
      <input type="hidden" id="wd-share" value="${esc(head + "  " + line + "\n" + grid)}"/>`;
  }
  function wireResult() {
    const copy = $("wd-copy");
    if (copy) copy.addEventListener("click", function () {
      const text = $("wd-share").value + "\n" + location.origin + location.pathname;
      const done = () => { this.textContent = "✓ Copied"; };
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, done);
      else { const ta = document.createElement("textarea"); ta.value = text; document.body.appendChild(ta); ta.select(); try { document.execCommand("copy"); } catch (e) {} document.body.removeChild(ta); done(); }
    });
    if ($("wd-goun")) $("wd-goun").addEventListener("click", () => { state.mode = "unlimited"; startGame(); });
    if ($("wd-again")) $("wd-again").addEventListener("click", () => startGame());
  }

  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function numberWord(n) { return ({ 4: "Four", 5: "Five", 6: "Six" })[n] || n; }

  /* ---------------- daily gating + scene ---------------- */
  function dailyDoneToday() {
    if (window.DailyRealm) return !!DailyRealm.isDone("wordle");
    const r = dailyRec(); return !!(r && r.done);
  }
  /* before today's daily is met, the length/mode controls are sealed away and
     only a "play unlimited" gate is offered — the daily is what you meet first */
  function syncGate() {
    const showGate = state.mode === "daily" && !dailyDoneToday();
    $("wd-controls").classList.toggle("hidden", showGate);
    $("wd-unlimited-gate").classList.toggle("hidden", !showGate);
  }
  function goUnlimited() {
    $("wd-daily-result").classList.add("hidden");
    state.mode = "unlimited";
    $("wd-controls").classList.remove("hidden");
    startGame();
  }
  function showDailyScene(won) {
    const gridHtml = state.guesses.map((row) =>
      row.marks.map((m) => m === "correct" ? "🟩" : m === "present" ? "🟨" : "⬛").join("")).join("<br/>");
    const gridText = state.guesses.map((row) =>
      row.marks.map((m) => m === "correct" ? "🟩" : m === "present" ? "🟨" : "⬛").join("")).join("\n");
    const head = "Wordle of the Realm - today's " + state.len + "-letter word";
    const line = won ? (state.guesses.length + "/" + MAX_GUESSES) : ("X/" + MAX_GUESSES);
    const share = esc(head + "  " + line + "\n" + gridText);
    const extra =
      '<div class="wd-scene-grid">' + gridHtml + '</div>' +
      '<div class="dr-actions"><button class="dr-ghost" id="wd-scene-copy" type="button">&#128203; Copy result</button></div>' +
      '<input type="hidden" id="wd-scene-share" value="' + share + '"/>';
    const streak = (won && window.KWStreak) ? (KWStreak.get().count || 0) : 0;
    if (window.DailyRealm) {
      DailyRealm.renderResult($("wd-daily-result"), { won: won, prefix: "../", streak: streak, extraHTML: extra, onUnlimited: goUnlimited });
    }
    $("wd-daily-result").classList.remove("hidden");
    $("wd-board").classList.add("hidden");
    $("wd-keys").classList.add("hidden");
    $("wd-head").classList.add("hidden");
    $("wd-controls").classList.add("hidden");
    $("wd-unlimited-gate").classList.add("hidden");
    setMsg("");
    const gu = $("wd-giveup"); if (gu) gu.classList.add("hidden");
    const copy = $("wd-scene-copy");
    if (copy) copy.addEventListener("click", function () {
      const text = $("wd-scene-share").value + "\n" + location.origin + location.pathname;
      const ok = () => { copy.textContent = "✓ Copied"; };
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(ok, ok);
      else { const ta = document.createElement("textarea"); ta.value = text; document.body.appendChild(ta); ta.select(); try { document.execCommand("copy"); } catch (e) {} document.body.removeChild(ta); ok(); }
    });
  }

  /* ---------------- start / restart ---------------- */
  function startGame() {
    if (state.mode === "daily") state.len = 5;   /* the daily is always the 5-letter word */
    state.keyState = {}; state.guesses = []; state.over = false; state.won = false; typed.value = "";
    $("wd-result").classList.add("hidden");
    $("wd-daily-result").classList.add("hidden");
    $("wd-board").classList.remove("hidden");
    $("wd-keys").classList.remove("hidden");
    $("wd-head").classList.remove("hidden");
    setMsg("");

    if (state.mode === "daily") {
      state.answer = dailyAnswer(state.len);
      const rec = dailyRec();
      if (rec) {
        /* replay the saved guesses so a refresh resumes exactly where you were —
           and a finished daily stays sealed, no fresh run at today's word */
        (rec.guesses || []).forEach((w) => {
          const marks = evaluate(w, state.answer);
          state.guesses.push({ word: w, marks });
          w.split("").forEach((ch, i) => {
            const c = state.keyState[ch];
            if (!c || MARK_RANK[marks[i]] > MARK_RANK[c]) state.keyState[ch] = marks[i];
          });
        });
        if (rec.done) {
          state.over = true; state.won = rec.won;
          renderBoard(); renderKeys(); renderMeta();
          showDailyScene(rec.won);
          return;
        }
        setMsg("Today's word, where you left it.");
      }
    } else {
      state.answer = randomAnswer(state.len, state.answer);
    }
    renderBoard(); renderKeys(); renderMeta(); syncGate();
  }

  /* ---------------- the rules, shown once ---------------- */
  function maybeShowRules() {
    let seen = false;
    try { seen = localStorage.getItem("wordleRulesSeen") === "1"; } catch (e) {}
    if (!seen) openRules();
  }
  function openRules() { $("wd-rules").classList.remove("hidden"); }
  function closeRules() {
    $("wd-rules").classList.add("hidden");
    try { localStorage.setItem("wordleRulesSeen", "1"); } catch (e) {}
  }

  /* ---------------- wiring ---------------- */
  document.querySelectorAll("#wd-lens .wd-len").forEach((b) =>
    b.addEventListener("click", () => { state.len = +b.dataset.len; startGame(); }));
  document.querySelectorAll("#wd-modes .wd-mode").forEach((b) =>
    b.addEventListener("click", () => { state.mode = b.dataset.mode; startGame(); }));
  $("wd-new").addEventListener("click", () => { if (state.mode === "unlimited") startGame(); });
  $("wd-unlimited-gate").addEventListener("click", goUnlimited);
  $("wd-giveup").addEventListener("click", giveUp);
  $("wd-rules-open").addEventListener("click", openRules);
  $("wd-rules-close").addEventListener("click", closeRules);
  $("wd-rules").addEventListener("click", (e) => { if (e.target === $("wd-rules")) closeRules(); });

  document.addEventListener("keydown", (e) => {
    if (!$("wd-rules").classList.contains("hidden")) { if (e.key === "Escape") closeRules(); return; }
    if (e.target && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
    if (e.key === "Enter") { e.preventDefault(); onKey("ENTER"); }
    else if (e.key === "Backspace") { e.preventDefault(); onKey("BACK"); }
    else { const k = e.key.toUpperCase(); if (/^[A-Z]$/.test(k)) onKey(k); }
  });

  startGame();
  maybeShowRules();
})();
