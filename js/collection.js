/* ============================================================================
   THE CABINET — renown, rank and relics, shared by every game on the site.

   One record in localStorage["kwCabinet"], the same shape everywhere:

     { renown, right, games: { <id>: {plays, best} }, relics: { <id>: <when> } }

   A game only ever has to make ONE call, at the end of a run:

     KWCollection.record("trivia", { right: 8, of: 10, hard: true, saga: "got" });

   …and the module works out the renown, the relics and the rank from that. The
   rules live here rather than in six engines, so "a perfect round is worth
   more" is one line in one file and cannot drift between games.

   Nothing here is ever spent and nothing can be lost: renown only rises, and a
   relic once earned is kept. That is deliberate — a shelf you can be knocked
   off is a shelf people stop visiting.

   It listens for "kw-streak" (js/streak.js) so the daily games award their own
   relics without knowing this module exists, and for "kw-shield" so raising the
   spoiler shield is itself worth something.
   ========================================================================== */
(function () {
  "use strict";

  var KEY = "kwCabinet";
  var RANKS = window.KW_RANKS || [{ at: 0, name: "Smallfolk", note: "" }];
  var RELICS = window.KW_RELICS || [];

  /* every game that can be played, so "the whole shelf" knows what it means */
  var GAMES = ["trivia", "whosaidit", "higherlower", "wordle", "smallcouncil", "sigilmatch", "ironladder"];

  function blank() {
    return { renown: 0, right: 0, games: {}, relics: {} };
  }
  function read() {
    var s;
    try { s = JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) { s = null; }
    if (!s || typeof s !== "object") return blank();
    var out = blank();
    out.renown = typeof s.renown === "number" && s.renown > 0 ? s.renown : 0;
    out.right = typeof s.right === "number" && s.right > 0 ? s.right : 0;
    if (s.games && typeof s.games === "object") {
      Object.keys(s.games).forEach(function (g) {
        var r = s.games[g] || {};
        out.games[g] = { plays: r.plays | 0, best: r.best | 0 };
      });
    }
    /* only relics this build still knows about — a renamed id must not linger
       as an un-nameable gap on the shelf */
    if (s.relics && typeof s.relics === "object") {
      RELICS.forEach(function (r) { if (s.relics[r.id]) out.relics[r.id] = s.relics[r.id]; });
    }
    return out;
  }
  function write(s) {
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {}
  }
  function announce(detail) {
    try { document.dispatchEvent(new CustomEvent("kw-cabinet", { detail: detail })); } catch (e) {}
  }

  function rankFor(renown) {
    var cur = RANKS[0], next = null;
    for (var i = 0; i < RANKS.length; i++) {
      if (renown >= RANKS[i].at) cur = RANKS[i];
      else { next = RANKS[i]; break; }
    }
    var span = next ? next.at - cur.at : 0;
    return {
      name: cur.name, note: cur.note, at: cur.at,
      next: next ? next.name : null, nextAt: next ? next.at : null,
      /* 0..1 through the current rank; 1 at the top, where there is no next */
      progress: next ? Math.min(1, (renown - cur.at) / (span || 1)) : 1,
    };
  }

  /* ---- awarding ---- */
  var fresh = [];          /* relics won in this session, for the game to show */
  function award(id) {
    if (!RELICS.some(function (r) { return r.id === id; })) return false;
    var s = read();
    if (s.relics[id]) return false;
    s.relics[id] = Date.now();
    write(s);
    fresh.push(id);
    announce({ won: id, state: snapshot() });
    return true;
  }

  function addRenown(n) {
    if (!(n > 0)) return;
    var s = read();
    var before = rankFor(s.renown).name;
    s.renown += Math.round(n);
    write(s);
    var after = rankFor(s.renown).name;
    announce({ renown: Math.round(n), rankUp: before !== after ? after : null, state: snapshot() });
  }

  /* ================= the one call a game makes =================
     `right` of `of` correct; `hard` if it was the hard tier; `saga` for the
     three-tales relic; `streak` for the endless games; `clean` when the player
     used no aids. Everything is optional — a game that only knows it finished
     can call record("wordle", {}) and still be counted. */
  function record(game, r) {
    r = r || {};
    var s = read();
    var g = s.games[game] || { plays: 0, best: 0 };
    g.plays += 1;
    var score = r.right != null ? r.right : (r.streak || 0);
    if (score > g.best) g.best = score;
    s.games[game] = g;
    if (r.right) s.right += r.right;
    write(s);

    /* ---- renown. Playing is worth a little; playing well is worth more, and
       the hard tier is worth double, which is the only reason to pick it. ---- */
    var gain = 5;                                  /* for turning up */
    if (r.right) gain += r.right * 3;
    if (r.streak) gain += Math.min(r.streak, 40) * 2;
    var perfect = r.of != null && r.right != null && r.right === r.of && r.of > 0;
    if (perfect) gain += 25;
    if (r.hard) gain *= 2;
    addRenown(gain);

    /* ---- relics ---- */
    var FIRST = {
      trivia: "first-blood", whosaidit: "first-voice", higherlower: "first-scales",
      wordle: "first-word", smallcouncil: "first-council", sigilmatch: "first-arms",
      ironladder: "first-life",
    };
    if (FIRST[game]) award(FIRST[game]);

    if (game === "trivia" && perfect) {
      award("clean-ten");
      if (r.hard) award("hard-ten");
    }
    if (game === "whosaidit" && perfect) {
      award("clean-voices");
      if (r.hard) award("hard-voices");
      if (r.clean) award("unaided");
      if (r.fmt === "book") award("book-reader");
    }
    if (game === "higherlower" && (r.streak || 0) >= 15) award("long-scales");

    /* three tales: a round played in each saga, whichever game it was */
    if (r.saga) {
      var seen = {};
      try { seen = JSON.parse(localStorage.getItem(KEY + ":sagas") || "{}") || {}; } catch (e) {}
      seen[r.saga] = 1;
      try { localStorage.setItem(KEY + ":sagas", JSON.stringify(seen)); } catch (e) {}
      if (seen.got && seen.hotd && seen.knight) award("all-sagas");
    }

    var now = read();
    if (now.right >= 100) award("hundred");
    if (now.right >= 500) award("five-hundred");
    if (GAMES.every(function (x) { return now.games[x] && now.games[x].plays > 0; })) award("every-game");

    return snapshot();
  }

  function snapshot() {
    var s = read();
    return {
      renown: s.renown,
      right: s.right,
      rank: rankFor(s.renown),
      games: s.games,
      relics: s.relics,
      have: Object.keys(s.relics).length,
      total: RELICS.length,
    };
  }

  /* ---- the daily games already announce themselves; listen rather than ask ---- */
  document.addEventListener("kw-streak", function (e) {
    var d = (e && e.detail) || {};
    var n = d.count || 0;
    if (n >= 3) award("streak-3");
    if (n >= 7) award("streak-7");
    if (n >= 30) award("streak-30");
  });
  window.addEventListener("kw-shield", function () {
    if (window.KWShield && window.KWShield.has()) award("shield-set");
  });

  window.KWCollection = {
    record: record,
    award: award,
    get: snapshot,
    rankFor: rankFor,
    relics: function () { return RELICS.slice(); },
    /* relics won since this page loaded, so a result screen can show them */
    fresh: function () { var f = fresh.slice(); fresh = []; return f; },
    reset: function () {
      try { localStorage.removeItem(KEY); localStorage.removeItem(KEY + ":sagas"); } catch (e) {}
      announce({ state: snapshot() });
    },
  };
})();
