/* ============================================================================
   THE POPULATION GRAPH — how many souls, age by age.

   One line, one story: the souls living in a land (or under a banner) across
   the whole chronicle. Used in two places, from one implementation — the
   reader beside the timeline map, and the wiki page of every people.

   Design decisions, and why:
   · ONE series, so there is no legend — the heading above the plot names it.
     Identity never rests on colour here.
   · The x-axis is the chronicle's own piecewise axis (js/timeline-axis.js), so
     the graph and the bar the reader is dragging agree about where a year is.
     A true linear axis would put the whole saga inside one pixel.
   · Only ONE point is labelled — the year being read. A number on every point
     is noise, and there are a dozen points.
   · Axes and grid are recessive; the ink is the page's text colour, never the
     series colour; the line is 2px and the marker is 9px across.
   · Hovering gives a crosshair and a readout, wired once for the whole page
     rather than per graph.

   Every figure it draws is an ESTIMATE — Westeros keeps no census — and every
   caller is expected to say so. See the note at the head of js/peoples-data.js.
   ========================================================================== */

(function () {
  "use strict";

  /* The plot box is 620 x H user units, NOT 1000 — the graph is drawn into a
     panel about 340px wide, and a 1000-unit box there squeezes the whole chart
     to a third of its type size. 620 keeps the letterforms readable in the
     narrow panel and still legible on the wider wiki page. */
  var PAD = { l: 48, r: 12, t: 12, b: 26 };
  var VW = 620;

  function esc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  /* 4,200,000 -> "4.2M" · 450,000 -> "450k" · 900 -> "900" */
  function compact(n) {
    if (n == null) return "—";
    var a = Math.abs(n);
    if (a >= 1e6) { var m = n / 1e6; return (m >= 10 ? Math.round(m) : Math.round(m * 10) / 10) + "M"; }
    if (a >= 1000) { var k = n / 1000; return (k >= 100 ? Math.round(k) : Math.round(k * 10) / 10) + "k"; }
    return String(Math.round(n));
  }
  function full(n) {
    if (n == null) return "not reckoned";
    return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  /* a round ceiling above the tallest point, so the grid reads in whole numbers */
  function niceMax(v) {
    if (v <= 0) return 1;
    var mag = Math.pow(10, Math.floor(Math.log(v) / Math.LN10));
    var f = v / mag;
    var step = f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10;
    return step * mag;
  }

  /* opts: { series, year?, color?, height?, caption?, id? } */
  function svg(opts) {
    var A = window.TLAxis;
    var series = (opts && opts.series) || [];
    if (!A || series.length < 2) return "";
    var H = (opts && opts.height) || 240;
    var color = (opts && opts.color) || "#c9a15a";
    var year = opts && opts.year != null ? opts.year : null;

    var innerW = VW - PAD.l - PAD.r;
    var innerH = H - PAD.t - PAD.b;
    var top = 0;
    series.forEach(function (p) { if (p[1] > top) top = p[1]; });
    var maxY = niceMax(top);

    var X = function (y) { return PAD.l + (A.toPct(y) / 100) * innerW; };
    var Y = function (v) { return PAD.t + (1 - v / maxY) * innerH; };

    /* --- the grid, in the page's ink at low opacity --- */
    var grid = "", i;
    for (i = 0; i <= 4; i++) {
      var gv = (maxY / 4) * i, gy = Y(gv);
      grid += '<line class="pg-grid" x1="' + PAD.l + '" y1="' + gy.toFixed(1) +
        '" x2="' + (VW - PAD.r) + '" y2="' + gy.toFixed(1) + '"/>' +
        '<text class="pg-ytick" x="' + (PAD.l - 8) + '" y="' + (gy + 4).toFixed(1) +
        '" text-anchor="end">' + (i === 0 ? "0" : compact(gv)) + "</text>";
    }

    /* --- the era ruler along the foot, sharing the timeline's own scale ---
       Four marks only. The piecewise axis crowds deep history into the left
       fifth of the plot, and in a 340px panel anything more collides. --- */
    var xticks = "";
    var XT = [-12000, -1000, 1, 298];
    XT.forEach(function (t, n) {
      var tx = X(t);
      /* the first mark sits on the y-axis, where a centred label would run into
         the "0"; the last sits at the right edge. Both tuck inward. */
      var anchor = n === 0 ? "start" : n === XT.length - 1 ? "end" : "middle";
      xticks += '<line class="pg-xtickline" x1="' + tx.toFixed(1) + '" y1="' + PAD.t +
        '" x2="' + tx.toFixed(1) + '" y2="' + (PAD.t + innerH) + '"/>' +
        '<text class="pg-xtick" x="' + tx.toFixed(1) + '" y="' + (H - 8) +
        '" text-anchor="' + anchor + '">' + esc(A.tickLabel(t)) + "</text>";
    });

    /* --- the line, and the ground beneath it --- */
    var pts = series.map(function (p) { return X(p[0]).toFixed(1) + " " + Y(p[1]).toFixed(1); });
    var lineD = "M " + pts.join(" L ");
    var areaD = lineD + " L " + X(series[series.length - 1][0]).toFixed(1) + " " + Y(0).toFixed(1) +
      " L " + X(series[0][0]).toFixed(1) + " " + Y(0).toFixed(1) + " Z";

    /* --- the one labelled point: the year being read --- */
    var marker = "";
    if (year != null) {
      var v = window.tlPopAt ? window.tlPopAt(series, year) : null;
      if (v != null) {
        var mx = X(year), my = Y(v);
        var anchor = mx > VW * 0.7 ? "end" : "start";
        var dx = anchor === "end" ? -9 : 9;
        marker =
          '<line class="pg-now" x1="' + mx.toFixed(1) + '" y1="' + PAD.t + '" x2="' + mx.toFixed(1) +
          '" y2="' + (PAD.t + innerH) + '"/>' +
          '<circle class="pg-dot" cx="' + mx.toFixed(1) + '" cy="' + my.toFixed(1) + '" r="4.5" fill="' + esc(color) + '"/>' +
          '<text class="pg-nowlabel" x="' + (mx + dx).toFixed(1) + '" y="' + (my - 10).toFixed(1) +
          '" text-anchor="' + anchor + '">' + esc(compact(v)) + "</text>";
      }
    }

    var data = esc(JSON.stringify(series));
    return '<div class="pg-wrap">' +
      (opts && opts.caption ? '<div class="pg-cap">' + opts.caption + "</div>" : "") +
      /* meet, not none: "none" stretches the coordinate system and with it every
         letterform. The whole plot scales with the column instead. */
      '<svg class="pg-plot" viewBox="0 0 ' + VW + " " + H + '" preserveAspectRatio="xMidYMid meet" ' +
        'role="img" aria-label="' + esc((opts && opts.aria) || "Population over the ages") + '" ' +
        'data-series="' + data + '" data-max="' + maxY + '" data-h="' + H + '">' +
        grid + xticks +
        '<path class="pg-area" d="' + areaD + '" fill="' + esc(color) + '"/>' +
        '<path class="pg-line" d="' + lineD + '" stroke="' + esc(color) + '"/>' +
        marker +
        '<g class="pg-hover" style="display:none">' +
          '<line class="pg-hline" y1="' + PAD.t + '" y2="' + (PAD.t + innerH) + '"/>' +
          '<circle class="pg-hdot" r="5"/>' +
        "</g>" +
      "</svg>" +
      '<div class="pg-tip" hidden></div>' +
      "</div>";
  }

  /* -------- the hover layer, wired once for every graph on the page -------- */
  function bind() {
    document.addEventListener("pointermove", function (e) {
      var plot = e.target && e.target.closest && e.target.closest(".pg-plot");
      if (!plot) { hideAll(); return; }
      var A = window.TLAxis; if (!A) return;
      var series, maxY, H;
      try { series = JSON.parse(plot.getAttribute("data-series")); } catch (err) { return; }
      maxY = parseFloat(plot.getAttribute("data-max"));
      H = parseFloat(plot.getAttribute("data-h"));
      var rect = plot.getBoundingClientRect();
      var vx = ((e.clientX - rect.left) / rect.width) * VW;
      var innerW = VW - PAD.l - PAD.r, innerH = H - PAD.t - PAD.b;
      var pct = ((vx - PAD.l) / innerW) * 100;
      var year = A.fromPct(pct);
      var v = window.tlPopAt ? window.tlPopAt(series, year) : null;
      var g = plot.querySelector(".pg-hover");
      var tip = plot.parentNode.querySelector(".pg-tip");
      if (v == null) { if (g) g.style.display = "none"; if (tip) tip.hidden = true; return; }
      var hx = PAD.l + (A.toPct(year) / 100) * innerW;
      var hy = PAD.t + (1 - v / maxY) * innerH;
      g.style.display = "";
      g.querySelector(".pg-hline").setAttribute("x1", hx);
      g.querySelector(".pg-hline").setAttribute("x2", hx);
      g.querySelector(".pg-hdot").setAttribute("cx", hx);
      g.querySelector(".pg-hdot").setAttribute("cy", hy);
      if (tip) {
        tip.hidden = false;
        tip.innerHTML = "<b>" + esc(A.label(year)) + "</b><span>" + esc(full(v)) + " souls</span>";
        var leftPct = (hx / VW) * 100;
        tip.style.left = Math.max(4, Math.min(96, leftPct)) + "%";
      }
    });
    document.addEventListener("pointerleave", hideAll, true);
    function hideAll() {
      document.querySelectorAll(".pg-hover").forEach(function (g) { g.style.display = "none"; });
      document.querySelectorAll(".pg-tip").forEach(function (t) { t.hidden = true; });
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bind);
  else bind();

  window.KWPopGraph = { svg: svg, compact: compact, full: full };
})();
