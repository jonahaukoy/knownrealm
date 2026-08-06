/* ============================================================================
   THE AXIS OF THE CHRONICLE — twelve thousand years on one bar.

   A straight scale is useless here. Twelve thousand years of legend and eight
   years of war cannot share a linear axis without crushing one of them: at true
   scale the whole War of the Five Kings is a hair's width and the Dawn Age is
   the entire bar. So the axis is PIECEWISE — every stretch of history is given
   the share of the bar its detail deserves, and is linear inside that share.
   Read across it and the ticks come closer together as the chronicle sharpens,
   which is what a reader actually wants and what every printed historical atlas
   has always done.

   Years are the maesters': negative is Before the Conquest, positive is After.
   THERE IS NO YEAR 0 — 1 BC is followed by 1 AC — so stepping and rounding both
   have to hop over it, which is what step() and snap() are for.
   ========================================================================== */

(function () {
  "use strict";

  /* [from, to, share of the bar]. Shares total 100. */
  var SEGS = [
    [-12000, -8000, 7],    /* the Dawn Age: the children, and men arriving      */
    [-8000, -6000, 6],     /* the Long Night, the Wall, the Age of Heroes       */
    [-6000, -1000, 9],     /* the Andals, and the kingdoms settling             */
    [-1000, -300, 7],      /* Valyria at its height; the Rhoynar drowned        */
    [-300, -1, 7],         /* the Doom, the Century of Blood, Aegon's landing   */
    [1, 60, 6],            /* the Conquest and the sons who follow it           */
    [60, 129, 6],          /* Jaehaerys, Alysanne, and the long peace           */
    [129, 136, 8],         /* the Dance — seven years that end the dragons      */
    [136, 200, 5],
    [200, 260, 5],         /* Dunk and Egg, the Blackfyres, Summerhall          */
    [260, 290, 8],         /* the fall of the dragons                           */
    [290, 298, 5],
    [298, 306, 21],        /* the saga itself, given a fifth of the whole bar   */
  ];

  var MIN = SEGS[0][0];
  var MAX = SEGS[SEGS.length - 1][1];

  /* cumulative left edge of each segment, in percent */
  var LEFT = [];
  (function () {
    var acc = 0;
    for (var i = 0; i < SEGS.length; i++) { LEFT.push(acc); acc += SEGS[i][2]; }
  })();

  /* year -> 0..100 along the bar */
  function toPct(year) {
    if (year <= MIN) return 0;
    if (year >= MAX) return 100;
    for (var i = 0; i < SEGS.length; i++) {
      var a = SEGS[i][0], b = SEGS[i][1], w = SEGS[i][2];
      if (year <= b) {
        /* the gap between 1 BC and 1 AC is a joint, not a span */
        if (year < a) return LEFT[i];
        return LEFT[i] + ((year - a) / (b - a)) * w;
      }
    }
    return 100;
  }

  /* 0..100 -> year (never 0) */
  function fromPct(pct) {
    var p = pct < 0 ? 0 : pct > 100 ? 100 : pct;
    for (var i = 0; i < SEGS.length; i++) {
      var w = SEGS[i][2];
      if (p <= LEFT[i] + w || i === SEGS.length - 1) {
        var a = SEGS[i][0], b = SEGS[i][1];
        var t = w ? (p - LEFT[i]) / w : 0;
        return snap(Math.round(a + t * (b - a)));
      }
    }
    return MAX;
  }

  /* there is no year 0; land on 1 AC rather than nowhere */
  function snap(y) { return y === 0 ? 1 : y; }

  /* one year on, one year back — hopping the joint */
  function step(year, d) {
    var y = year + d;
    if (y === 0) y = d > 0 ? 1 : -1;
    return y < MIN ? MIN : y > MAX ? MAX : y;
  }

  function group(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ","); }

  /* "8,000 BC" · "1 AC" · "298 AC" */
  function label(year) {
    return year < 0 ? group(-year) + " BC" : group(year) + " AC";
  }
  /* the short form the ruler prints, where room is tight */
  function tickLabel(year) {
    if (year <= -1000) return (-year / 1000) + "k BC";
    return year < 0 ? (-year) + " BC" : year + " AC";
  }

  /* The printed ruler. Every entry was checked against the piecewise scale
     above: the tightest pair here is five percent of the bar apart, which is
     about fifty pixels on a laptop — enough for "136 AC" and its neighbour not
     to collide. Adding a tick means re-checking that. The years NOT printed
     (the Doom, the Trident) are still marked, by their moment dots. */
  var TICKS = [-12000, -8000, -6000, -1000, -300, 1, 60, 129, 136, 200, 260, 290, 298, 302, 306];

  /* A phone's bar is a third the width, so it gets a third the marks. Same rule
     as above: the tightest pair here is nine percent apart. */
  var TICKS_NARROW = [-12000, -6000, -1000, 1, 129, 260, 298, 306];

  window.TLAxis = {
    SEGS: SEGS, MIN: MIN, MAX: MAX, TICKS: TICKS, TICKS_NARROW: TICKS_NARROW,
    toPct: toPct, fromPct: fromPct, step: step, snap: snap,
    label: label, tickLabel: tickLabel,
  };
})();
