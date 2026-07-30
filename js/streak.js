/* DAILY STREAK — a single streak shared across all the daily games (the Small
   Council, the daily Wordle, and any future daily). Kept in the browser only,
   in localStorage["kwStreak"], alongside the spoiler shield.

   A game calls window.KWStreak.mark() when its DAILY is completed for the day;
   the module counts consecutive calendar days. window.KWStreak.get() returns the
   current run (0 if a day was missed), the best-ever run, and whether today is
   already counted. A "kw-streak" event fires on every change so the hub can react. */
(function () {
  "use strict";
  var KEY = "kwStreak";
  function dstr(d) { return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate(); }
  function today() { return dstr(new Date()); }
  function yesterday() { var d = new Date(); d.setDate(d.getDate() - 1); return dstr(d); }
  function read() {
    try { return JSON.parse(localStorage.getItem(KEY) || "null") || { count: 0, best: 0, last: null }; }
    catch (e) { return { count: 0, best: 0, last: null }; }
  }
  function write(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} }

  function mark() {
    var s = read(), t = today();
    if (s.last === t) return get();               /* already counted today */
    s.count = (s.last === yesterday()) ? (s.count || 0) + 1 : 1;
    s.last = t;
    s.best = Math.max(s.best || 0, s.count);
    write(s);
    var g = get();
    try { document.dispatchEvent(new CustomEvent("kw-streak", { detail: g })); } catch (e) {}
    return g;
  }
  function get() {
    var s = read(), t = today();
    /* a run only "counts" as current if the last play was today or yesterday;
       otherwise the chain is broken and the current streak reads 0 */
    var current = (s.last === t || s.last === yesterday()) ? (s.count || 0) : 0;
    return { count: current, best: s.best || 0, playedToday: s.last === t };
  }
  window.KWStreak = { mark: mark, get: get };
})();
