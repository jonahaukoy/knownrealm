/* ============================================================================
   Higher or Lower — the engine.

   ONE mixed game. Every round the metric changes: reign length, then a body
   count, then a city's populace, then how long ago something happened... The
   big line at the top always names what you're judging, so you never lose the
   thread. Guess whether the hidden thing is higher or lower. Ties are accepted
   either way.

   Two ways to play:
     - THE DAILY TRIAL — a fixed run of 10 rounds, the same for every player
       today (seeded by the date). Clear all ten and the realm hails you; slip
       once and it ends. Win or lose, you get a scene and your streak.
     - UNLIMITED — endless; see how long a streak you can hold.

   Data: window.HL_DECKS (hl-data.js). Result scenes: window.DailyRealm
   (../js/daily-realm.js). Daily streak: window.KWStreak (../js/streak.js).
   ========================================================================== */
(function () {
  "use strict";

  var DECKS = window.HL_DECKS || [];
  var GAME = "hol";
  var DAILY_ROUNDS = 10;

  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  };
  function mulberry32(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      var t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  var state = {
    mode: "daily",     /* "daily" | "unlimited" */
    rand: Math.random, /* seeded for the daily */
    deck: null, known: null, mystery: null, max: 1,
    round: 0,          /* daily: which round (0-based) */
    streak: 0,         /* correct in a row */
    best: 0,
    lastDeckId: null,
    locked: false
  };

  function loadBest() { try { return parseInt(localStorage.getItem("hlBest"), 10) || 0; } catch (e) { return 0; } }
  function saveBest(n) { try { localStorage.setItem("hlBest", String(n)); } catch (e) {} }

  /* ---- show one of the four sections ---- */
  function show(id) {
    ["hl-home", "hl-play", "hl-result", "hl-over"].forEach(function (s) {
      var el = $(s); if (el) el.classList.toggle("hl-hidden", s !== id);
    });
  }

  /* ---- the chain ----------------------------------------------------------
     The thing you just uncovered does not leave the board: it slides into the
     left slot and becomes the next round's known quantity, and a new challenger
     is drawn against it. That is what makes a run feel like one continuous
     thread rather than a series of unrelated questions.

     The measure is held CONSTANT for the length of a chain, because "higher"
     only means something when both sides are counted in the same unit — 15
     kills against 11 name-days is not a question anyone can reason about. When
     the chain ends the game announces the change of measure and starts a new
     one, so the variety of the decks is kept without breaking the thread.
     ---------------------------------------------------------------------- */
  var CHAIN_MAX = 5;   /* rounds on one measure before it changes */

  /* pick a fresh measure and the opening pair on it */
  function startChain() {
    var idx = Math.floor(state.rand() * DECKS.length);
    if (DECKS.length > 1 && DECKS[idx].id === state.lastDeckId) idx = (idx + 1) % DECKS.length;
    var deck = DECKS[idx];
    var items = deck.items;
    var a = Math.floor(state.rand() * items.length);
    var b = Math.floor(state.rand() * items.length);
    if (b === a) b = (b + 1) % items.length;
    state.lastDeckId = deck.id;
    state.deck = deck;
    state.known = items[a];
    state.mystery = items[b];
    state.max = items.reduce(function (m, it) { return Math.max(m, it.v); }, 1);
    state.used = [a, b];
    state.chain = 0;
    state.chained = false;   /* false = this round opens a new measure */
  }

  /* keep the revealed thing, draw a new challenger against it */
  function advanceChain() {
    var deck = state.deck, items = deck.items;
    if (state.chain + 1 >= CHAIN_MAX || state.used.length >= items.length) { startChain(); return; }
    var pool = [];
    for (var i = 0; i < items.length; i++) if (state.used.indexOf(i) < 0) pool.push(i);
    if (!pool.length) { startChain(); return; }
    var pick = pool[Math.floor(state.rand() * pool.length)];
    state.known = state.mystery;        /* the one just uncovered holds the field */
    state.mystery = items[pick];
    state.used.push(pick);
    state.chain++;
    state.chained = true;
  }

  /* ================================================== HOME =============== */
  function renderHome() {
    var done = window.DailyRealm ? DailyRealm.isDone(GAME) : null;
    var body;
    if (done) {
      body =
        '<div class="hl-kicker">A Game of More or Less</div>' +
        '<h1>Higher or Lower</h1>' +
        '<div class="hl-daily-done">' +
          '<span class="daily-badge">Daily</span> ' +
          (done === "win" ? "Today's trial is won. " : "Today's trial bested you. ") +
          "Come back tomorrow for a new one." +
        '</div>' +
        '<button class="hl-start" id="hl-go-unlim">Play unlimited &rarr;</button>';
    } else {
      body =
        '<div class="hl-kicker"><span class="daily-badge">Daily</span> &middot; the same for every player today</div>' +
        '<h1>The Daily Trial</h1>' +
        '<p class="hl-sub">Ten rounds. Each one a different measure of the realm &mdash; a reign, a host, ' +
        'a body count, a city\'s multitudes. Read the line at the top, then say whether the hidden one ' +
        'stands higher or lower. Clear all ten and the realm will hail you. Slip once and it is over.</p>' +
        '<button class="hl-start" id="hl-go-daily">Begin today\'s trial &rarr;</button>' +
        '<button class="hl-ghostbtn" id="hl-go-unlim">or play unlimited instead</button>';
    }
    $("hl-home").innerHTML = body;
    if ($("hl-go-daily")) $("hl-go-daily").addEventListener("click", startDaily);
    if ($("hl-go-unlim")) $("hl-go-unlim").addEventListener("click", startUnlimited);
    show("hl-home");
  }

  /* ================================================== RUNS =============== */
  function startDaily() {
    state.mode = "daily";
    state.rand = mulberry32((DailyRealm ? DailyRealm.dayNumber() : 0) * 2654435761 >>> 0 || 1);
    state.round = 0; state.streak = 0; state.lastDeckId = null; state.locked = false;
    state.roundsPlayed = 0;
    startChain();
    renderRound();
  }
  function startUnlimited() {
    state.mode = "unlimited";
    state.rand = Math.random;
    state.streak = 0; state.best = loadBest(); state.lastDeckId = null; state.locked = false;
    state.roundsPlayed = 0;
    startChain();
    renderRound();
  }

  function barPct(v) { return Math.max(4, Math.round((v / state.max) * 100)); }

  function cardInner(item, revealed) {
    var frame = item.frame === "sigil" ? " hl-c-sigil" : " hl-c-face";
    var val = revealed
      ? '<span class="hl-num">' + item.v.toLocaleString("en-US") + '</span>' +
        '<span class="hl-unit">' + esc(state.deck.unit) + '</span>'
      : '<span class="hl-num hl-num-q">?</span>';
    var bar = '<span class="hl-bar"><span class="hl-bar-fill" style="width:' +
      (revealed ? barPct(item.v) : 0) + '%"></span></span>';
    return '<div class="hl-c-media' + frame + '">' +
        '<img src="' + item.img + '" alt="" loading="lazy" onerror="this.classList.add(\'hl-img-fail\')"/>' +
        '<span class="hl-c-scrim"></span></div>' +
      '<div class="hl-c-body">' +
        '<span class="hl-c-name">' + esc(item.name) + '</span>' +
        '<span class="hl-c-sub">' + esc(item.sub) + '</span>' +
        '<span class="hl-c-metric">' + val + '</span>' + bar +
      '</div>';
  }

  function renderRound(slideIn) {
    var d = state.deck;
    var hud = state.mode === "daily"
      ? '<div class="hl-hud"><button class="hl-quit" id="hl-quit">&larr; Leave</button>' +
        '<div class="hl-rounds">Round <b>' + (state.round + 1) + '</b> of ' + DAILY_ROUNDS + '</div></div>'
      : '<div class="hl-hud"><button class="hl-quit" id="hl-quit">&larr; Leave</button>' +
        '<div class="hl-scoreboard"><span class="hl-score-now">' + state.streak + '</span>' +
        '<span class="hl-score-lbl">streak</span>' +
        '<span class="hl-score-best">Best ' + Math.max(state.best, state.streak) + '</span></div></div>';

    /* when a chain ends, say so plainly — the player must know the unit moved */
    var switchLine = (!state.chained && state.roundsPlayed > 0)
      ? '<div class="hl-newmetric">&#10022; The measure changes &mdash; now we weigh <b>' +
        esc(d.name.toLowerCase()) + '</b></div>'
      : '';

    $("hl-play").innerHTML = hud + switchLine +
      '<div class="hl-metricline"><span class="hl-metricline-emoji">' + d.emoji + '</span>' + esc(d.prompt) + '</div>' +
      '<div class="hl-metrictag">' + esc(d.name) + ' &middot; ' + esc(d.tag) + '</div>' +
      '<div class="hl-arena" id="hl-arena">' +
        '<div class="hl-card hl-card-known' + (state.chained ? ' hl-card-held' : '') + '" id="hl-known">' +
          (state.chained ? '<span class="hl-held-tag">still standing</span>' : '') +
          cardInner(state.known, true) + '</div>' +
        '<div class="hl-mid">' +
          '<div class="hl-vs">vs</div>' +
          '<div class="hl-choices" id="hl-choices">' +
            '<button class="hl-choice hl-choice-up" data-dir="more"><span class="hl-choice-arrow">&#9650;</span>' + esc(d.more) + '</button>' +
            '<button class="hl-choice hl-choice-down" data-dir="less"><span class="hl-choice-arrow">&#9660;</span>' + esc(d.less) + '</button>' +
          '</div>' +
          '<div class="hl-verdict" id="hl-verdict"></div>' +
        '</div>' +
        '<div class="hl-card hl-card-mystery' + (slideIn ? ' hl-slidein' : '') + '" id="hl-mystery">' + cardInner(state.mystery, false) + '</div>' +
      '</div>' +
      '<div class="hl-source">' + d.src + '</div>';

    $("hl-quit").addEventListener("click", renderHome);
    Array.prototype.forEach.call($("hl-choices").querySelectorAll(".hl-choice"), function (b) {
      b.addEventListener("click", function () { guess(b.getAttribute("data-dir")); });
    });
    show("hl-play");
  }

  function guess(dir) {
    if (state.locked) return;
    state.locked = true;
    var a = state.known.v, b = state.mystery.v;
    var correct = (b === a) || (dir === "more" ? b > a : b < a);

    var choices = $("hl-choices");
    choices.classList.add("hl-choices-done");
    choices.querySelector(dir === "more" ? ".hl-choice-up" : ".hl-choice-down").classList.add("hl-chosen");

    revealCard($("hl-mystery"), state.mystery, function () {
      $("hl-mystery").classList.add(correct ? "hl-right" : "hl-wrong");
      var verdict = $("hl-verdict");
      verdict.innerHTML = (b === a)
        ? '<span class="hl-v-tie">A tie &mdash; the throne shows no favor. It counts.</span>'
        : (correct ? '<span class="hl-v-good">Well judged.</span>' : '<span class="hl-v-bad">The realm remembers otherwise.</span>');
      verdict.classList.add("hl-verdict-on");

      if (correct) {
        state.streak++;
        if (state.mode === "unlimited") {
          if (state.streak > state.best) { state.best = state.streak; saveBest(state.best); }
          setTimeout(nextRound, 1150);
        } else {
          state.round++;
          if (state.round >= DAILY_ROUNDS) setTimeout(function () { finishDaily(true); }, 1150);
          else setTimeout(nextRound, 1150);
        }
      } else {
        if (state.mode === "daily") setTimeout(function () { finishDaily(false); }, 1250);
        else setTimeout(gameOver, 1250);
      }
    });
  }

  function nextRound() {
    state.locked = false;
    state.roundsPlayed++;
    advanceChain();
    renderRound(true);
  }

  function revealCard(cardEl, item, done) {
    var metric = cardEl.querySelector(".hl-c-metric");
    metric.innerHTML = '<span class="hl-num">0</span><span class="hl-unit">' + esc(state.deck.unit) + '</span>';
    var numEl = metric.querySelector(".hl-num");
    var barFill = cardEl.querySelector(".hl-bar-fill");
    var target = item.v, targetPct = barPct(item.v), dur = 850, t0 = null, finished = false;
    function finish() { if (finished) return; finished = true; numEl.textContent = target.toLocaleString("en-US"); done && done(); }
    var guard = setTimeout(finish, dur + 400);
    requestAnimationFrame(function () { barFill.style.width = targetPct + "%"; });
    function step(ts) {
      if (finished) return;
      if (t0 === null) t0 = ts;
      var p = Math.min(1, (ts - t0) / dur), eased = 1 - Math.pow(1 - p, 3);
      numEl.textContent = Math.round(target * eased).toLocaleString("en-US");
      if (p < 1) requestAnimationFrame(step); else { clearTimeout(guard); finish(); }
    }
    requestAnimationFrame(step);
  }

  /* ================================================== DAILY RESULT ======= */
  function finishDaily(won) {
    if (window.DailyRealm) DailyRealm.markDone(GAME, won);
    var streak = 0;
    if (won && window.KWStreak) { streak = (KWStreak.mark() || {}).count || 0; }
    else if (window.KWStreak) { streak = (KWStreak.get() || {}).count || 0; }

    var extra = won
      ? '<div class="dr-scoreline">You cleared all ' + DAILY_ROUNDS + ' rounds.</div>'
      : '<div class="dr-scoreline">You held on for ' + state.streak + ' of ' + DAILY_ROUNDS + '.</div>';

    if (window.DailyRealm) {
      DailyRealm.renderResult($("hl-result"), {
        won: won, prefix: "../", streak: won ? streak : 0,
        extraHTML: extra, onUnlimited: startUnlimited
      });
    }
    show("hl-result");
  }

  /* ================================================== UNLIMITED OVER ===== */
  function gameOver() {
    var record = state.streak > 0 && state.streak >= state.best;
    $("hl-over").innerHTML =
      '<div class="hl-over-card">' +
        '<div class="hl-kicker">Unlimited</div>' +
        '<div class="hl-over-num">' + state.streak + '</div>' +
        '<div class="hl-over-lbl">correct in a row</div>' +
        (record ? '<div class="hl-over-record">&#128081; A new best streak!</div>'
                : '<div class="hl-over-best">Your best: ' + state.best + '</div>') +
        '<div class="hl-over-miss">You said <b>' + esc(state.known.name) + '</b> (' + state.deck.fmt(state.known.v) + ') and <b>' +
          esc(state.mystery.name) + '</b> (' + state.deck.fmt(state.mystery.v) + ') &mdash; there it broke.</div>' +
        '<div class="hl-over-actions">' +
          '<button class="hl-again" id="hl-again">Play again &rarr;</button>' +
          '<button class="hl-change" id="hl-home-btn">Back to the daily</button>' +
        '</div>' +
      '</div>';
    $("hl-again").addEventListener("click", startUnlimited);
    $("hl-home-btn").addEventListener("click", renderHome);
    show("hl-over");
  }

  /* ================================================== boot ============== */
  if (!DECKS.length) { $("hl-home").innerHTML = '<p class="hl-sub">The pool failed to load.</p>'; return; }
  renderHome();
})();
