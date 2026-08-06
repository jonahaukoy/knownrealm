/* ============================================================================
   THE CHRONICLE — a wiki page for every moment on the timeline.

   The timeline's "read further in the chronicle" button used to point at
   whatever existing page was nearest the subject: a category index, a location,
   another saga's wiki root, and in one case an id that did not exist. Now every
   moment has a page of its own, and the button always goes to it.

   Built from two files, so there is one copy of everything:
     js/timeline-data.js   the moment itself (when, title, lead, era, saga)
     js/moments/*.js       the long-form article (MOMENT_ARTICLES, keyed by id)

   A moment with no article yet still gets a page — its timeline lead becomes
   the whole of it — so the button is never broken while writing catches up.

   Load AFTER js/timeline-data.js, js/timeline-axis.js and the js/moments/*.js
   files, and BEFORE js/wiki-engine.js.
   ========================================================================== */

(function () {
  "use strict";

  var TL = window.TIMELINE || [];
  var ART = window.MOMENT_ARTICLES || {};
  var ERAS = window.TIMELINE_ERAS || [];
  var A = window.TLAxis;
  if (!TL.length) return;

  var eraById = {};
  ERAS.forEach(function (e) { eraById[e.id] = e; });

  function esc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  var SAGA_NAME = {
    lore: "Before the tellings",
    got: "Game of Thrones",
    hotd: "House of the Dragon",
    knight: "A Knight of the Seven Kingdoms",
  };

  var items = TL.map(function (ev) {
    var a = ART[ev.id] || {};
    var er = eraById[ev.era];

    var meta = [["When", ev.when]];
    if (er) meta.push(["The age", er.name]);
    var telling = [];
    if (ev.show) telling.push("Watched: " + ev.show);
    if (ev.book) telling.push("Read: " + ev.book);
    if (telling.length) meta.push(["Where to find it", telling.join(" · ")]);
    else meta.push(["Where to find it", SAGA_NAME[ev.saga] || "The histories"]);

    /* the onward links, and the way back to the map of that year */
    var extra = "";
    if (a.links && a.links.length) {
      extra += '<h4 class="wk-h4">Elsewhere in the wiki</h4><div class="wk-moment-links">' +
        a.links.map(function (l) {
          return '<a class="wk-people-land" href="' + esc(l[1]) + '"><b>' + esc(l[0]) + "</b></a>";
        }).join("") + "</div>";
    }
    if (A) {
      extra += '<a class="wk-bigbtn" href="timeline.html#year=' + ev.y + '">' +
        "⌛ See the world as it stood in " + esc(A.label(ev.y)) + " →</a>";
    }

    return {
      id: ev.id,
      name: ev.title,
      sub: ev.when,
      meta: meta,
      blurb: ev.text,
      parasTitle: "The fuller tale",
      paras: a.paras || [],
      sections: a.sections || [],
      extra: extra,
      fate: a.fate || null,
      _y: ev.y,
    };
  });

  (window.COLLECTIONS = window.COLLECTIONS || []).push({
    id: "chronicle",
    route: "moment",
    label: "The Chronicle",
    glyph: "&#8987;",
    sub: function (n) { return n + " moments, twelve thousand years"; },
    intro: "Every moment the timeline marks, set down at length: what happened, what the sources " +
      "disagree about, and what it changed. The order is the order of the years, from the children " +
      "of the forest to the melting of a chair — and each one will show you the world as it " +
      "stood in that very year.",
    extra: '<p class="wk-lead"><a class="wk-bigbtn" href="timeline.html">&#8987; Walk the years on the timeline &rarr;</a></p>',
    items: items,
  });
})();
