/* ============================================================================
   THE SPOILER SHIELD — one record of how far the reader has come, shared by
   every page on the site.

   There used to be TWO. The games, the timeline and the home page's words of
   the day all kept localStorage["tvShield"], a six-field record covering both
   tellings of all three sagas. The family trees kept their own, entirely
   separate localStorage["trees-progress"], which understood Game of Thrones
   only and could hold just ONE place at a time — you were either "through
   season 5" or "through book 2", never both. Saying in one place that you had
   read two books therefore meant nothing anywhere else.

   This module owns the single record. The shape is unchanged from tvShield so
   that trivia-engine.js, whosaidit-engine.js, smallcouncil-engine.js,
   timeline-engine.js and home.js keep working untouched and interoperate with
   the trees immediately:

       { gotS, gotB, hotdS, hotdB, knightS, knightB }

   Each is "the last season/book I have finished", 0 meaning "none of it".

   THE READING RULE — either telling unlocks. A fact tagged as reached in
   season 6 and book 4 is shown to anyone who has seen season 6 OR read book 4,
   because either way they already know it. A threshold that names only one
   telling is not gated on the other: that medium simply has no opinion, which
   is how the trees' data has always been written.
   ========================================================================== */
(function () {
  var KEY = "tvShield";
  var OLD_TREES_KEY = "trees-progress";

  var MAX = { gotS: 8, gotB: 5, hotdS: 2, hotdB: 1, knightS: 1, knightB: 3 };
  var ZERO = { gotS: 0, gotB: 0, hotdS: 0, hotdB: 0, knightS: 0, knightB: 0 };

  function clean(o) {
    var out = {}, k;
    for (k in MAX) {
      var v = o && typeof o[k] === "number" ? o[k] : parseInt(o && o[k], 10);
      out[k] = isNaN(v) ? 0 : Math.max(0, Math.min(MAX[k], v));
    }
    return out;
  }

  function rawRead() {
    try {
      var s = localStorage.getItem(KEY);
      return s ? JSON.parse(s) : null;
    } catch (e) { return null; }
  }

  /* One-time rescue of anything the reader had already told the family trees,
     so upgrading does not silently throw their answer away. The old record was
     {mode:"show"|"book"|"all", n}. It only ever described Game of Thrones. */
  function migrate() {
    var old;
    try { old = localStorage.getItem(OLD_TREES_KEY); } catch (e) { return null; }
    if (!old) return null;
    var p;
    try { p = JSON.parse(old); } catch (e) { p = null; }
    if (!p) return null;
    var s = clean(ZERO);
    if (p.mode === "all") { s = clean(MAX); }
    else if (p.mode === "show") { s.gotS = p.n || 0; }
    else if (p.mode === "book") { s.gotB = p.n || 0; }
    return s;
  }

  var cache = null;

  function get() {
    if (cache) return cache;
    var stored = rawRead();
    if (stored) { cache = clean(stored); return cache; }
    var moved = migrate();
    if (moved) { cache = moved; write(cache); return cache; }
    cache = clean(ZERO);
    return cache;
  }

  function write(s) {
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {}
  }

  /* has the reader ever answered? distinguishes "said nothing yet" from
     "deliberately said none of it", which decides whether a gate is shown */
  function has() {
    if (rawRead()) return true;
    try { return !!localStorage.getItem(OLD_TREES_KEY); } catch (e) { return false; }
  }

  function set(patch) {
    var s = clean(Object.assign({}, get(), patch || {}));
    cache = s;
    write(s);
    announce();
    return s;
  }

  function setAll() { return set(MAX); }
  function clear() { return set(ZERO); }

  function announce() {
    try {
      window.dispatchEvent(new CustomEvent("kw-shield", { detail: get() }));
    } catch (e) {}
  }

  /* Does the reader already know a thing gated at `th`?
     `th` is {s: season, b: book} for the given saga — either may be absent.
     A threshold of 99 is the data's way of saying "not in this telling yet". */
  function reach(th, sKey, bKey) {
    if (!th) return true;
    var s = get();
    var okS = th.s == null ? true : s[sKey] >= th.s;
    var okB = th.b == null ? true : s[bKey] >= th.b;
    return okS || okB;
  }

  /* ================= saying what is held back =================
     A shield that hides silently is worse than no shield: the reader cannot
     tell the difference between "there is nothing here" and "you have not
     reached it yet", and quietly assumes the site is thin. So every surface
     that hides something says so, in one line, with the one button that opens
     the shield. `data-open-shield` is picked up by js/realm-nav.js on every
     page, so this needs no wiring wherever it is dropped.

     It returns "" for a count of zero — an honest notice appears ONLY when
     something really was held back, which also means its absence is never a
     promise that nothing was coming. */
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function heldNotice(n, one, many) {
    n = n | 0;
    if (n <= 0) return "";
    var what = n === 1 ? esc(one || "one of these") : n + " " + esc(many || one || "of these");
    return '<div class="kw-held" role="status">' +
      '<span class="kw-held-icon" aria-hidden="true">&#128737;</span>' +
      '<span class="kw-held-text">' + what +
      (n === 1 ? " is" : " are") + ' held back by your spoiler shield, because ' +
      (n === 1 ? "it comes" : "they come") + ' after where you said you had got to. ' +
      '<button type="button" class="kw-held-btn" data-open-shield>Move the shield</button>' +
      "</span></div>";
  }

  window.KWShield = {
    MAX: MAX,
    get: get,
    set: set,
    setAll: setAll,
    clear: clear,
    has: has,
    reach: reach,
    heldNotice: heldNotice,
    reachGot: function (th) { return reach(th, "gotS", "gotB"); },
    reachHotd: function (th) { return reach(th, "hotdS", "hotdB"); },
    reachKnight: function (th) { return reach(th, "knightS", "knightB"); }
  };
})();
