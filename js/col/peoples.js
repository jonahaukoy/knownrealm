/* ============================================================================
   THE PEOPLES OF THE WORLD — a wiki collection built from the chronicle's own
   data, not from a second copy of it.

   js/peoples-data.js holds every banner the timeline map can paint, with the
   prose that belongs to it; js/timeline-territories.js holds the ground and the
   reckoning of souls. This file reads both and hands the collections engine an
   article per people — so adding a people to the map adds it to the wiki, and
   there is exactly one place to correct a fact.

   A people that ALREADY has a page in this wiki (the Night's Watch, the free
   folk, the Dothraki, the great houses) is skipped here and linked to its own
   page instead; see the tail of js/peoples-data.js. Nothing gets two pages.

   Load AFTER js/peoples-data.js, js/timeline-territories.js, js/timeline-axis.js
   and js/popgraph.js, and BEFORE js/wiki-engine.js.
   ========================================================================== */

(function () {
  "use strict";

  var P = window.TL_POWERS || {};
  var A = window.TLAxis;
  if (!A || !window.TL_LANDS) return;

  function esc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  /* The souls under a banner, age by age. A people with its own reckoning uses
     it; everyone else is counted by adding up the lands that answer to them in
     each year the map changes. */
  function series(id) {
    var pw = P[id];
    if (pw.pop && pw.pop.length > 1) return pw.pop;

    var marks = {};
    (window.TL_LANDS || []).forEach(function (l) {
      if (!(l.hold || []).some(function (h) { return h[1] === id; })) return;
      (l.hold || []).forEach(function (h) { marks[h[0]] = 1; marks[A.step(h[0], -1)] = 1; });
      (l.pop || []).forEach(function (p) { marks[p[0]] = 1; });
    });
    var years = Object.keys(marks).map(Number).filter(function (y) { return y !== 0; })
      .sort(function (a, b) { return a - b; });
    var raw = years.map(function (y) {
      var r = window.tlPowerAt(id, y);
      return [y, r.souls == null ? 0 : r.souls];
    });
    /* trim the long flat nothing at either end, keeping one zero for the shape
       of the rise and the fall */
    var first = -1, last = -1;
    raw.forEach(function (p, i) { if (p[1] > 0) { if (first < 0) first = i; last = i; } });
    if (first < 0) return null;
    return raw.slice(Math.max(0, first - 1), Math.min(raw.length, last + 2));
  }

  function peak(s) {
    var best = null;
    (s || []).forEach(function (p) { if (!best || p[1] > best[1]) best = p; });
    return best;
  }

  /* which ground answered to them, and between which years */
  function landRows(id) {
    var rows = [];
    (window.TL_LANDS || []).forEach(function (l) {
      var runs = [], open = null;
      (l.hold || []).forEach(function (h) {
        if (h[1] === id && open == null) open = h[0];
        else if (h[1] !== id && open != null) { runs.push([open, h[0]]); open = null; }
      });
      if (open != null) runs.push([open, null]);
      runs.forEach(function (r) {
        rows.push({ name: l.name, id: l.id, from: r[0], to: r[1] });
      });
    });
    rows.sort(function (a, b) { return a.from - b.from || a.name.localeCompare(b.name); });
    return rows;
  }

  function extraFor(id) {
    var pw = P[id];
    var s = series(id);
    var pk = s ? peak(s) : null;
    var rows = landRows(id);
    var html = "";

    if (s && s.length > 1) {
      html += window.KWPopGraph.svg({
        series: s, year: pk ? pk[0] : null, color: pw.color, height: 250,
        aria: "Estimated souls under the banner of " + pw.name + ", age by age",
        caption: "Souls under this banner <i>&mdash; the chronicle&rsquo;s own reckoning, never a census; " +
          "Westeros keeps none. See the note in the timeline.</i>",
      });
    }

    if (rows.length) {
      html += '<h4 class="wk-h4">The ground they held</h4><div class="wk-people-lands">' +
        rows.map(function (r) {
          var when = A.label(r.from) + (r.to == null ? " onward" : " to " + A.label(r.to));
          return '<a class="wk-people-land" href="timeline.html#year=' +
            (r.to == null ? Math.min(r.from + 1, A.MAX) : Math.floor((r.from + r.to) / 2) || r.from) +
            "&land=" + esc(r.id) + '">' +
            "<b>" + esc(r.name) + "</b><i>" + esc(when) + "</i></a>";
        }).join("") + "</div>";
    }

    html += '<a class="wk-bigbtn" href="timeline.html#year=' + (pk ? pk[0] : 1) +
      '">&#8987; See the world in ' + esc(A.label(pk ? pk[0] : 1)) + " on the timeline &rarr;</a>";
    return html;
  }

  var items = Object.keys(P).filter(function (k) { return P[k].page; }).map(function (k) {
    var pw = P[k];
    var s = series(k);
    var pk = s ? peak(s) : null;
    var meta = [["What they were", pw.kind], ["When", pw.when]];
    if (pk) meta.push(["At their height", window.KWPopGraph.full(pk[1]) + " souls, about, in " + A.label(pk[0])]);
    return {
      id: k,
      name: pw.name,
      sub: pw.when,
      meta: meta,
      blurb: pw.blurb,
      parasTitle: "The fuller tale",
      paras: pw.paras || [],
      extra: extraFor(k),
    };
  });

  /* the order the map's own legend uses — elder peoples, then Westeros, then
     the east — rather than alphabetical, which would open on the Andals */
  (window.COLLECTIONS = window.COLLECTIONS || []).push({
    id: "peoples",
    route: "people",
    label: "The Peoples of the World",
    glyph: "&#127760;",
    sub: function (n) { return n + " peoples, kingdoms and powers"; },
    intro: "Every banner that has ever been painted across a stretch of this map: the peoples who " +
      "held the world before there were kingdoms, the kingdoms the dragons swallowed, and the cities " +
      "of the east that outlived them all. Each carries the reckoning of how many souls lived under " +
      "it, age by age — and the timeline will show you its ground in any year you care to name.",
    extra: '<p class="wk-lead"><a class="wk-bigbtn" href="timeline.html">&#8987; Open the timeline and watch the world change hands &rarr;</a></p>',
    items: items,
  });
})();
