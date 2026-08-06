/* ============================================================================
   THE CHRONICLE'S MAP — the known world repainted for any year.

   A small, self-contained pan-and-zoom over the same 5652 x 3682 basemap the
   interactive maps use, with one job the big map does not do: colour the whole
   world by who holds it in a given YEAR, from the children of the forest to the
   council that elects a Broken King.

   It is deliberately NOT js/map.js. That class carries pins, banners, routes,
   face-chips, death markers and a story model; none of it is wanted here, and
   inheriting it would have meant loading the entire saga's data on a page about
   twelve thousand years.

   Identity is never carried by colour alone: every territory large enough to
   take one is written across with the name of the power that holds it, every
   territory answers a hover with a readout, and the legend beneath names every
   banner on the map. That is the relief the colour checks require, and it is
   also simply how a historical atlas is read.

     TLMap.init({ svg, viewport, terrLayer, labelLayer, tip, onPick })
     TLMap.paint(year)          repaint every territory for that year
     TLMap.select(landId|null)  ring the chosen one
     TLMap.zoomBy(f) / .reset()
   ========================================================================== */

(function () {
  "use strict";

  var VB_W = 5652, VB_H = 3682;
  var MIN_SCALE = 1, MAX_SCALE = 9;

  var els = null, onPick = null;
  var view = { x: 0, y: 0, scale: 1 };
  var pathById = {}, labelById = {};
  var curYear = null, selectedId = null;

  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function esc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function power(id) { return (window.TL_POWERS || {})[id] || null; }

  /* area-weighted centroid, so a label sits in the body of a country rather
     than being dragged off by a long tail of coastline points */
  function centroid(pts) {
    var a = 0, cx = 0, cy = 0, i, j, f;
    for (i = 0, j = pts.length - 1; i < pts.length; j = i++) {
      f = pts[j][0] * pts[i][1] - pts[i][0] * pts[j][1];
      a += f; cx += (pts[j][0] + pts[i][0]) * f; cy += (pts[j][1] + pts[i][1]) * f;
    }
    if (Math.abs(a) < 1e-6) {                       /* degenerate: fall back to the mean */
      var sx = 0, sy = 0;
      pts.forEach(function (p) { sx += p[0]; sy += p[1]; });
      return [sx / pts.length, sy / pts.length];
    }
    a *= 0.5;
    return [cx / (6 * a), cy / (6 * a)];
  }

  /* rough extent, used to decide whether a land can carry a written name */
  function span(pts) {
    var x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
    pts.forEach(function (p) {
      if (p[0] < x0) x0 = p[0]; if (p[0] > x1) x1 = p[0];
      if (p[1] < y0) y0 = p[1]; if (p[1] > y1) y1 = p[1];
    });
    return Math.min(x1 - x0, y1 - y0);
  }

  function area(pts) {
    var a = 0, i, j;
    for (i = 0, j = pts.length - 1; i < pts.length; j = i++) {
      a += pts[j][0] * pts[i][1] - pts[i][0] * pts[j][1];
    }
    return Math.abs(a / 2);
  }
  var areaById = {};

  /* ================= lands that are not their own country =================
     Two relationships have to be worked out once, at build time, or the map
     draws lines through the middle of a single realm.

     BENEATH. Some lands are drawn INSIDE others — the children's five woods sit
     on top of whole kingdoms, and the Isle of Faces sits in the riverlands. In
     a year when the wood and the kingdom under it answer to the same power,
     drawing the wood paints a second half-opaque layer over the first and rings
     it in the territory outline, so the reader sees a hard-edged patch in the
     middle of one country and reasonably asks what it means. It means nothing.
     Such a land is hidden outright for that year.

     BESIDE. Some lands TILE with their neighbours, sharing an edge point for
     point — the Gift, the New Gift and the North run down the Wall's country
     that way. In a year before the Watch was ever given that ground, all three
     answer to the same power, and the only thing that distinguishes them is the
     outline between them. So when a land's holder matches a land it touches,
     its outline is dropped and the two read as the one country they are.

     Both are computed from the polygons themselves. Nothing has to be declared. */
  function inside(pts, x, y) {
    var c = false, i, j;
    for (i = 0, j = pts.length - 1; i < pts.length; j = i++) {
      var xi = pts[i][0], yi = pts[i][1], xj = pts[j][0], yj = pts[j][1];
      if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) c = !c;
    }
    return c;
  }
  var beneathById = {};      /* land id -> id of the land drawn under it, if any */
  var besideById = {};       /* land id -> [ids of lands it shares an edge with] */

  function findRelations(lands) {
    lands.forEach(function (l, i) {
      var c = centroid(l.pts);
      /* the LAST earlier land containing this one's middle is what shows through */
      for (var k = i - 1; k >= 0; k--) {
        if (inside(lands[k].pts, c[0], c[1])) { beneathById[l.id] = lands[k].id; break; }
      }
      /* neighbours: two or more vertices in common is a shared edge, not a
         coincidence — the tiled bands are written to match exactly */
      var mine = {};
      l.pts.forEach(function (p) { mine[p[0] + "," + p[1]] = 1; });
      besideById[l.id] = [];
      lands.forEach(function (o) {
        if (o.id === l.id) return;
        var shared = 0;
        for (var n = 0; n < o.pts.length; n++) {
          if (mine[o.pts[n][0] + "," + o.pts[n][1]]) shared++;
          if (shared >= 2) break;
        }
        if (shared >= 2) besideById[l.id].push(o.id);
      });
    });
  }

  /* ---------------- building ---------------- */

  function build() {
    var lands = window.TL_LANDS || [];
    var masked = "", loose = "", labels = "";

    lands.forEach(function (l) {
      var d = "M " + l.pts.map(function (p) { return p[0] + " " + p[1]; }).join(" L ") + " Z";
      var p = '<path class="tl-terr" data-land="' + esc(l.id) + '" d="' + d + '"/>';
      if (l.nomask) loose += p; else masked += p;

      areaById[l.id] = area(l.pts);
      var c = centroid(l.pts);
      labels += '<text class="tl-terrlabel" data-land="' + esc(l.id) + '" x="' + c[0].toFixed(0) +
        '" y="' + c[1].toFixed(0) + '" text-anchor="middle" data-span="' + span(l.pts).toFixed(0) + '"></text>';
    });

    els.terr.innerHTML =
      '<defs><mask id="tlLandMask" maskUnits="userSpaceOnUse" x="0" y="0" width="' + VB_W + '" height="' + VB_H + '">' +
        '<image href="assets/landmask.png" x="0" y="0" width="' + VB_W + '" height="' + VB_H + '" preserveAspectRatio="none"/>' +
      "</mask></defs>" +
      '<g mask="url(#tlLandMask)">' + masked + "</g>" + loose;
    els.labels.innerHTML = labels;

    els.terr.querySelectorAll("[data-land]").forEach(function (el) {
      pathById[el.getAttribute("data-land")] = el;
    });
    els.labels.querySelectorAll("[data-land]").forEach(function (el) {
      labelById[el.getAttribute("data-land")] = el;
    });
    findRelations(lands);
  }

  /* ---------------- painting ---------------- */

  /* At most this many lands per power carry a written name. Without it, a year
     when one banner flies over half a continent prints "The Iron Throne" eight
     times over eight adjacent gold regions, which is noise rather than a label. */
  var LABELS_PER_POWER = 2;
  var MIN_SPAN_FOR_LABEL = 260;      /* map units — smaller than this and the
                                        writing would be wider than the country */

  function paint(year) {
    curYear = year;
    var lands = window.TL_LANDS || [];
    var flying = {};                                 /* powers on the map this year */
    var byPower = {};

    /* who holds what, before anything is drawn — the two relationships below
       both need to compare one land's holder against another's */
    var holderOf = {};
    lands.forEach(function (l) { holderOf[l.id] = window.tlHolderAt(l, year); });

    lands.forEach(function (l) {
      var el = pathById[l.id], lab = labelById[l.id];
      if (!el) return;
      var pid = holderOf[l.id];
      var pw = pid ? power(pid) : null;
      if (lab) lab.style.display = "none";
      if (!pw) { el.style.display = "none"; return; }

      /* drawn inside another land that answers to the same power: it is not a
         separate country this year, so it is not drawn as one */
      var under = beneathById[l.id];
      if (under && holderOf[under] === pid) { el.style.display = "none"; return; }

      flying[pid] = true;
      el.style.display = "";
      /* touching a land of the same colour: drop the outline so the two read as
         the one country. This is what keeps a line off the Gift in the eight
         thousand years before anybody gave it to the Watch. */
      var merged = besideById[l.id] &&
        besideById[l.id].some(function (o) { return holderOf[o] === pid; });
      el.classList.toggle("tl-terr-merged", !!merged);
      el.setAttribute("fill", pw.color);
      el.setAttribute("data-power", pid);
      /* the hover readout lives on the element, so it survives a repaint */
      el.setAttribute("data-name", l.name);
      el.setAttribute("data-holder", pw.name);
      (byPower[pid] = byPower[pid] || []).push(l);
    });

    /* write each banner's name across the biggest ground it holds */
    Object.keys(byPower).forEach(function (pid) {
      var pw = power(pid);
      byPower[pid]
        .filter(function (l) { return parseFloat(labelById[l.id].getAttribute("data-span")) >= MIN_SPAN_FOR_LABEL; })
        .sort(function (a, b) { return areaById[b.id] - areaById[a.id]; })
        .slice(0, LABELS_PER_POWER)
        .forEach(function (l) {
          var lab = labelById[l.id];
          lab.style.display = "";
          lab.textContent = pw.short || pw.name;
        });
    });

    if (selectedId && pathById[selectedId] && pathById[selectedId].style.display === "none") {
      select(null);
      if (onPick) onPick(null);
    }
    renderLegend(flying);
    applyTransform();
  }

  function renderLegend(flying) {
    if (!els.legend) return;
    var order = Object.keys(window.TL_POWERS || {}).filter(function (k) { return flying[k]; });
    if (!order.length) { els.legend.innerHTML = ""; return; }
    els.legend.innerHTML =
      '<div class="tl-legend-head">Who holds the world</div>' +
      '<div class="tl-legend-rows">' + order.map(function (k) {
        var p = window.TL_POWERS[k];
        return '<button type="button" class="tl-legend-row" data-power="' + esc(k) + '">' +
          '<span class="tl-swatch" style="background:' + esc(p.color) + '"></span>' +
          "<span>" + esc(p.short || p.name) + "</span></button>";
      }).join("") + "</div>";
  }

  function select(landId) {
    selectedId = landId || null;
    Object.keys(pathById).forEach(function (id) {
      pathById[id].classList.toggle("sel", id === selectedId);
    });
  }

  /* highlight every land a power holds — used when the legend is hovered */
  function flagPower(pid) {
    Object.keys(pathById).forEach(function (id) {
      var el = pathById[id];
      el.classList.toggle("dim", !!pid && el.getAttribute("data-power") !== pid);
    });
  }

  /* ---------------- view ---------------- */

  function applyTransform() {
    els.vp.setAttribute("transform", "translate(" + view.x + "," + view.y + ") scale(" + view.scale + ")");
    /* labels counter-scale so they stay the same size on screen at every zoom */
    var k = 1 / view.scale;
    els.labels.querySelectorAll(".tl-terrlabel").forEach(function (t) {
      t.setAttribute("transform", "translate(" + t.getAttribute("x") + "," + t.getAttribute("y") +
        ") scale(" + k.toFixed(3) + ") translate(" + (-t.getAttribute("x")) + "," + (-t.getAttribute("y")) + ")");
    });
  }

  function clampPan() {
    var s = view.scale;
    var gx = VB_W * 0.06, gy = VB_H * 0.06;
    var loX = VB_W - gx - VB_W * s, hiX = gx;
    view.x = loX > hiX ? (VB_W * (1 - s)) / 2 : clamp(view.x, loX, hiX);
    var loY = VB_H - gy - VB_H * s, hiY = gy;
    view.y = loY > hiY ? (VB_H * (1 - s)) / 2 : clamp(view.y, loY, hiY);
  }

  function screenToVB(cx, cy) {
    var r = els.svg.getBoundingClientRect();
    var fit = Math.min(r.width / VB_W, r.height / VB_H);
    var offX = (r.width - VB_W * fit) / 2, offY = (r.height - VB_H * fit) / 2;
    return { x: (cx - r.left - offX) / fit, y: (cy - r.top - offY) / fit };
  }

  function zoomAt(cx, cy, factor) {
    var p = screenToVB(cx, cy);
    var ns = clamp(view.scale * factor, MIN_SCALE, MAX_SCALE);
    var kx = (p.x - view.x) / view.scale, ky = (p.y - view.y) / view.scale;
    view.x = p.x - kx * ns; view.y = p.y - ky * ns; view.scale = ns;
    clampPan(); applyTransform();
  }
  function zoomBy(f) {
    var r = els.svg.getBoundingClientRect();
    zoomAt(r.left + r.width / 2, r.top + r.height / 2, f);
  }
  function reset() { view = { x: 0, y: 0, scale: 1 }; applyTransform(); }

  /* ---------------- interaction ---------------- */

  function bind() {
    var svg = els.svg;
    var drag = null, moved = false;

    svg.addEventListener("wheel", function (e) {
      e.preventDefault();
      zoomAt(e.clientX, e.clientY, e.deltaY < 0 ? 1.16 : 1 / 1.16);
    }, { passive: false });

    svg.addEventListener("pointerdown", function (e) {
      if (e.button !== 0 && e.pointerType === "mouse") return;
      drag = { sx: e.clientX, sy: e.clientY, ox: view.x, oy: view.y };
      moved = false;
      svg.classList.add("dragging");
    });
    window.addEventListener("pointermove", function (e) {
      if (!drag) return;
      var r = svg.getBoundingClientRect();
      var fit = Math.min(r.width / VB_W, r.height / VB_H);
      var dx = (e.clientX - drag.sx) / fit, dy = (e.clientY - drag.sy) / fit;
      if (Math.abs(dx) + Math.abs(dy) > 4) moved = true;
      view.x = drag.ox + dx; view.y = drag.oy + dy;
      clampPan(); applyTransform();
    });
    window.addEventListener("pointerup", function () {
      drag = null; svg.classList.remove("dragging");
      setTimeout(function () { moved = false; }, 0);
    });

    /* two fingers: pinch and drag together */
    var touch = null;
    svg.addEventListener("touchstart", function (e) {
      if (e.touches.length === 2) {
        var a = e.touches[0], b = e.touches[1];
        touch = { d: Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY),
                  mx: (a.clientX + b.clientX) / 2, my: (a.clientY + b.clientY) / 2 };
        drag = null;
      }
    }, { passive: true });
    svg.addEventListener("touchmove", function (e) {
      if (e.touches.length !== 2 || !touch) return;
      e.preventDefault();
      var a = e.touches[0], b = e.touches[1];
      var d = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
      var mx = (a.clientX + b.clientX) / 2, my = (a.clientY + b.clientY) / 2;
      var r = svg.getBoundingClientRect();
      var fit = Math.min(r.width / VB_W, r.height / VB_H);
      view.x += (mx - touch.mx) / fit; view.y += (my - touch.my) / fit;
      if (touch.d > 0) zoomAt(mx, my, d / touch.d);
      else { clampPan(); applyTransform(); }
      touch = { d: d, mx: mx, my: my };
      moved = true;
    }, { passive: false });
    svg.addEventListener("touchend", function (e) { if (e.touches.length < 2) touch = null; }, { passive: true });

    /* the readout: what is under the pointer */
    svg.addEventListener("pointermove", function (e) {
      if (drag) { hideTip(); return; }
      var t = e.target && e.target.closest && e.target.closest(".tl-terr");
      if (!t || t.style.display === "none") { hideTip(); return; }
      showTip(t, e.clientX, e.clientY);
    });
    svg.addEventListener("pointerleave", hideTip);

    svg.addEventListener("click", function (e) {
      if (moved) return;
      var t = e.target && e.target.closest && e.target.closest(".tl-terr");
      if (!t) { select(null); if (onPick) onPick(null); return; }
      var id = t.getAttribute("data-land");
      select(id);
      if (onPick) onPick(id);
    });

    if (els.legend) {
      els.legend.addEventListener("pointerover", function (e) {
        var r = e.target.closest && e.target.closest(".tl-legend-row");
        flagPower(r ? r.getAttribute("data-power") : null);
      });
      els.legend.addEventListener("pointerleave", function () { flagPower(null); });
    }
  }

  function showTip(t, cx, cy) {
    if (!els.tip) return;
    var holder = t.getAttribute("data-holder") || "";
    var name = t.getAttribute("data-name") || "";
    var pid = t.getAttribute("data-power");
    var pw = power(pid);
    var land = (window.TL_LANDS || []).filter(function (l) { return l.id === t.getAttribute("data-land"); })[0];
    var souls = land && curYear != null ? window.tlPopAt(land.pop, curYear) : null;
    els.tip.innerHTML =
      '<span class="tl-tip-swatch" style="background:' + esc(pw ? pw.color : "#888") + '"></span>' +
      "<b>" + esc(name) + "</b>" +
      "<i>" + esc(holder) + "</i>" +
      (souls != null ? '<span class="tl-tip-pop">about ' + esc(window.KWPopGraph.full(souls)) + " souls</span>" : "");
    els.tip.hidden = false;
    var box = els.svg.parentNode.getBoundingClientRect();
    var x = cx - box.left + 16, y = cy - box.top + 16;
    if (x > box.width - 230) x = cx - box.left - 230;
    if (y > box.height - 90) y = cy - box.top - 90;
    els.tip.style.left = Math.max(6, x) + "px";
    els.tip.style.top = Math.max(6, y) + "px";
  }
  function hideTip() { if (els.tip) els.tip.hidden = true; }

  window.TLMap = {
    init: function (o) {
      els = { svg: o.svg, vp: o.viewport, terr: o.terrLayer, labels: o.labelLayer, tip: o.tip, legend: o.legend };
      onPick = o.onPick || null;
      build(); bind(); applyTransform();
    },
    paint: paint,
    select: select,
    zoomBy: zoomBy,
    reset: reset,
  };
})();
