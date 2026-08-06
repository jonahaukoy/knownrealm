/* ============================================================================
   THE TIMELINE — twelve thousand years on one bar, with the world beside it.

   The page is a single instrument: a draggable YEAR, and everything else
   follows it. The bar writes the age's own name across its own stretch of the
   ruler (so there is no "choose an age" list any more, and no BC/AC legend
   floating loose — both are printed on the bar itself). The map repaints for
   the year. The panel tells you what happened in it, or — if you have picked a
   territory — who holds that ground, and how many people live on it.

   THE SPOILER SHIELD is the site-wide one (js/shield.js, opened from the Shield
   button in the realm bar on every page). This page no longer keeps a gate of
   its own. It reads the record, hides any moment beyond the reader's reach, and
   holds the MAP at the last year they have come to inside the two spoilable
   windows — the Dance (129–136) and the saga (298–306). Everything older than
   that is history nobody can be spoiled by, and is always shown.
   ========================================================================== */

(function () {
  "use strict";

  var $ = function (id) { return document.getElementById(id); };
  var A = window.TLAxis;
  var ERAS = window.TIMELINE_ERAS || [];
  var ALL = window.TIMELINE || [];
  var eraById = {};
  ERAS.forEach(function (e) { eraById[e.id] = e; });

  var state = { year: 298, land: null, expanded: false };

  function esc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  /* ---------------- the shield ---------------- */

  function shield() {
    return window.KWShield ? window.KWShield.get()
      : { gotS: 0, gotB: 0, hotdS: 0, hotdB: 0, knightS: 0, knightB: 0 };
  }

  /* a moment is safe once EITHER telling has reached it; lore older than the
     tellings is always safe */
  function allowed(ev) {
    if (ev.saga === "lore") return true;
    if (ev.s == null && ev.b == null) return true;
    var s = shield();
    if (ev.s != null && (s[ev.saga + "S"] || 0) >= ev.s) return true;
    if (ev.b != null && (s[ev.saga + "B"] || 0) >= ev.b) return true;
    return false;
  }

  /* the last year of each spoilable window the reader has actually reached */
  var GOT_BY_SEASON = [297, 298, 299, 299, 300, 301, 302, 303, 306];
  var GOT_BY_BOOK   = [297, 298, 299, 300, 300, 300];
  var HOTD_BY_SEASON = [128, 130, 136];
  var HOTD_BY_BOOK   = [128, 136];

  function caps() {
    var s = shield();
    return {
      got: Math.max(GOT_BY_SEASON[s.gotS] || 297, GOT_BY_BOOK[s.gotB] || 297),
      hotd: Math.max(HOTD_BY_SEASON[s.hotdS] || 128, HOTD_BY_BOOK[s.hotdB] || 128),
    };
  }
  /* the year the MAP is allowed to show, given where the reader has come to */
  function mapYear(y) {
    var c = caps();
    if (y >= 298) return Math.min(y, c.got);
    if (y >= 129 && y <= 136) return Math.min(y, c.hotd);
    return y;
  }

  /* ---------------- the bar ---------------- */

  function buildEraBand() {
    var html = ERAS.map(function (er) {
      var a = A.toPct(er.from), b = A.toPct(er.to);
      var w = Math.max(0, b - a);
      /* an age narrower than about a seventh of the bar cannot carry its full
         name; it prints the short one instead */
      var narrow = w < 14 ? " narrow" : "";
      return '<button type="button" class="tl-era' + narrow + '" data-era="' + esc(er.id) + '" ' +
        'style="left:' + a.toFixed(3) + "%;width:" + w.toFixed(3) + '%" title="' + esc(er.note) + '">' +
        '<span class="tl-era-long">' + esc(er.name) + "</span>" +
        '<span class="tl-era-short">' + esc(er.short || er.name) + "</span></button>";
    }).join("");
    $("tl-eraband").innerHTML = html;
    $("tl-eraband").querySelectorAll(".tl-era").forEach(function (b) {
      b.addEventListener("click", function (e) {
        e.stopPropagation();
        var er = eraById[b.dataset.era];
        if (er) goTo(er.from, true);   /* an age opens at its first year */
      });
    });
  }

  function buildRuler() {
    /* BC and AC are printed on the ruler itself — there is no separate legend.
       A narrow bar gets the shorter list of marks; a full one would run its
       labels into each other. */
    var ticks = window.matchMedia("(max-width: 700px)").matches ? A.TICKS_NARROW : A.TICKS;
    $("tl-ruler").innerHTML = ticks.map(function (t) {
      var p = A.toPct(t);
      var edge = p < 3 ? " tl-tick-first" : p > 97 ? " tl-tick-last" : "";
      return '<span class="tl-tick' + edge + '" style="left:' + p.toFixed(3) + '%">' +
        '<i></i><b>' + esc(A.tickLabel(t)) + "</b></span>";
    }).join("");
  }

  /* one mark per moment the reader is allowed to see, coloured by its saga */
  function buildMoments() {
    var seen = {};
    $("tl-moments").innerHTML = ALL.filter(allowed).map(function (ev) {
      var p = A.toPct(ev.y);
      var key = p.toFixed(2);
      var stack = seen[key] = (seen[key] || 0) + 1;
      return '<button type="button" class="tl-moment tl-moment-' + esc(ev.saga) + '" ' +
        'data-year="' + ev.y + '" data-id="' + esc(ev.id) + '" ' +
        'style="left:' + p.toFixed(3) + "%;--stack:" + (stack - 1) + '" ' +
        'title="' + esc(A.label(ev.y) + " — " + ev.title) + '"></button>';
    }).join("");
    $("tl-moments").querySelectorAll(".tl-moment").forEach(function (b) {
      b.addEventListener("click", function (e) {
        e.stopPropagation();
        goTo(parseInt(b.dataset.year, 10), true);
      });
    });
  }

  function paintBar() {
    var p = A.toPct(state.year);
    $("tl-handle").style.left = p.toFixed(3) + "%";
    var flag = $("tl-handle-flag");
    flag.textContent = A.label(state.year);
    /* the flag rides the handle, but at either end of the bar it would hang off
       the edge, so it tucks itself inside instead */
    flag.style.transform = p < 8 ? "translateX(0)" : p > 92 ? "translateX(-100%)" : "translateX(-50%)";
    $("tl-year").textContent = A.label(state.year);
    var er = eraFor(state.year);
    $("tl-eraname").textContent = er ? er.name : "";
    $("tl-track").setAttribute("aria-valuenow", String(state.year));
    $("tl-track").setAttribute("aria-valuetext", A.label(state.year) + (er ? " — " + er.name : ""));
    $("tl-eraband").querySelectorAll(".tl-era").forEach(function (b) {
      b.classList.toggle("active", !!er && b.dataset.era === er.id);
    });
    $("tl-moments").querySelectorAll(".tl-moment").forEach(function (b) {
      b.classList.toggle("now", parseInt(b.dataset.year, 10) === state.year);
    });
  }

  function eraFor(y) {
    for (var i = 0; i < ERAS.length; i++) if (y >= ERAS[i].from && y <= ERAS[i].to) return ERAS[i];
    return y < ERAS[0].from ? ERAS[0] : ERAS[ERAS.length - 1];
  }

  /* ---------------- moving ---------------- */

  function goTo(y, focusMoment) {
    state.year = A.snap(Math.max(A.MIN, Math.min(A.MAX, y)));
    if (focusMoment) state.land = null;
    paintBar();
    window.TLMap.paint(mapYear(state.year));
    if (state.land) window.TLMap.select(state.land); else window.TLMap.select(null);
    renderPanel();
    try {
      history.replaceState(null, "", "#year=" + state.year + (state.land ? "&land=" + state.land : ""));
    } catch (e) { /* file:// refuses; harmless */ }
  }

  /* the moment before / after, in years — so the « » buttons land on something */
  function neighbourMoment(dir) {
    var list = ALL.filter(allowed).map(function (e) { return e.y; })
      .sort(function (a, b) { return a - b; });
    var out = null;
    if (dir > 0) { for (var i = 0; i < list.length; i++) if (list[i] > state.year) { out = list[i]; break; } }
    else { for (var j = list.length - 1; j >= 0; j--) if (list[j] < state.year) { out = list[j]; break; } }
    return out;
  }

  /* ---------------- the panel ---------------- */

  function momentCard(ev) {
    var badges = [];
    if (ev.show) badges.push('<span class="tl-badge tl-badge-show">&#127909; ' + esc(ev.show) + "</span>");
    if (ev.book) badges.push('<span class="tl-badge tl-badge-book">&#128214; ' + esc(ev.book) + "</span>");
    if (!badges.length) badges.push('<span class="tl-badge tl-badge-lore">&#9733; Before the tellings</span>');
    return '<article class="tl-moment-card">' +
      '<div class="tl-mc-when">' + esc(ev.when) + "</div>" +
      "<h3>" + esc(ev.title) + "</h3>" +
      '<div class="tl-badges">' + badges.join("") + "</div>" +
      "<p>" + esc(ev.text) + "</p>" +
      (ev.wiki ? '<a class="tl-mc-link" href="' + esc(ev.wiki) + '">Read further in the chronicle &rarr;</a>' : "") +
      "</article>";
  }

  function shieldNotice() {
    var shown = mapYear(state.year);
    if (shown === state.year) return "";
    return '<div class="tl-sealed">' +
      "<b>&#128737; Your spoiler shield holds the map at " + esc(A.label(shown)) + ".</b>" +
      "<span>The world is drawn as far as you have come. Raise the shield and it will draw the rest.</span>" +
      '<button type="button" class="tl-sealed-btn" data-open-shield>Change how far I have come</button>' +
      "</div>";
  }

  function yearPanel() {
    var er = eraFor(state.year);
    var here = ALL.filter(function (e) { return e.y === state.year && allowed(e); });
    var body = "";

    if (here.length) {
      body += '<div class="tl-panel-h">' + (here.length === 1 ? "This year" : here.length + " moments this year") + "</div>";
      body += here.map(momentCard).join("");
    } else {
      var before = null, after = null;
      ALL.filter(allowed).forEach(function (e) {
        if (e.y <= state.year && (!before || e.y > before.y)) before = e;
        if (e.y > state.year && (!after || e.y < after.y)) after = e;
      });
      /* there is a difference between a year nothing happened in and a year
         the reader's own shield is keeping from them, and the panel should
         never confuse the two */
      var barred = ALL.filter(function (e) { return e.y === state.year && !allowed(e); }).length;
      body += barred
        ? '<div class="tl-quiet">' + barred + " moment" + (barred === 1 ? "" : "s") + " in " +
          esc(A.label(state.year)) + " " + (barred === 1 ? "is" : "are") +
          " behind your spoiler shield. Raise it and they will be set down here.</div>"
        : '<div class="tl-quiet">The chronicle sets down nothing for ' + esc(A.label(state.year)) +
          ". Most years pass without a maester thinking them worth the ink.</div>";
      if (before) body += '<div class="tl-panel-h">The last thing that happened</div>' + momentCard(before);
      if (after) {
        body += '<button type="button" class="tl-jump" data-year="' + after.y + '">' +
          "On to " + esc(A.label(after.y)) + " &mdash; " + esc(after.title) + " &rarr;</button>";
      }
    }

    /* the rest of this age, so the reader can step through it without dragging */
    var rest = ALL.filter(function (e) { return e.era === er.id && allowed(e) && e.y !== state.year; });
    if (rest.length) {
      body += '<div class="tl-panel-h">Elsewhere in this age</div><div class="tl-agelist">' +
        rest.map(function (e) {
          return '<button type="button" class="tl-agerow" data-year="' + e.y + '">' +
            "<span>" + esc(A.label(e.y)) + "</span><b>" + esc(e.title) + "</b></button>";
        }).join("") + "</div>";
    }

    return '<div class="tl-panel-era">' +
        '<div class="tl-kicker">' + esc(er.name) + "</div>" +
        '<h2 class="tl-panel-year">' + esc(A.label(state.year)) + "</h2>" +
        '<p class="tl-panel-note">' + esc(er.note) + "</p>" +
        '<a class="tl-erawiki" href="wiki.html#era=' + esc(er.id) + '">Read the full history of this age &rarr;</a>' +
      "</div>" +
      shieldNotice() +
      '<div class="tl-hintline">Click any land on the map to see who holds it, and how many live there.</div>' +
      body;
  }

  function landPanel(landId) {
    var land = (window.TL_LANDS || []).filter(function (l) { return l.id === landId; })[0];
    if (!land) return yearPanel();
    var y = mapYear(state.year);
    var pid = window.tlHolderAt(land, y);
    var pw = pid ? (window.TL_POWERS || {})[pid] : null;
    var souls = window.tlPopAt(land.pop, y);

    /* when did this banner go up here, and what comes next */
    var since = null, until = null;
    (land.hold || []).forEach(function (h) {
      if (h[0] <= y) { if (h[1] === pid) { if (since == null || h[0] > since) since = h[0]; } }
      else if (until == null) until = h[0];
    });

    var graph = pw && land.pop && land.pop.length > 1
      ? window.KWPopGraph.svg({
          series: land.pop, year: y, color: pw.color, height: 230,
          aria: "Estimated population of " + land.name + " over the ages",
          caption: 'Souls in ' + esc(land.name) + ' <i>&mdash; the chronicle&rsquo;s own reckoning, not a census</i>',
        })
      : "";

    /* the notice comes FIRST here: a card that says the North answers the Iron
       Throne while the reader is standing in 299 makes no sense until they know
       the map is being held at 297 for them */
    return '<button type="button" class="tl-back" id="tl-land-back">&larr; Back to ' + esc(A.label(state.year)) + "</button>" +
      shieldNotice() +
      '<div class="tl-landcard">' +
        '<div class="tl-landname">' + esc(land.name) + "</div>" +
        (land.sub ? '<div class="tl-landsub">' + esc(land.sub) + "</div>" : "") +
        (pw
          ? '<div class="tl-holder"><span class="tl-swatch" style="background:' + esc(pw.color) + '"></span>' +
            "<span><b>" + esc(pw.name) + "</b><i>" + esc(pw.kind) + "</i></span></div>"
          : '<div class="tl-holder tl-holder-none"><span class="tl-swatch tl-swatch-none"></span>' +
            "<span><b>No banner flies here</b><i>in " + esc(A.label(y)) + "</i></span></div>") +
        (pw && since != null
          ? '<div class="tl-since">Held since ' + esc(A.label(since)) +
            (until != null ? ", and until " + esc(A.label(until)) : "") + ".</div>"
          : "") +
        (souls != null
          ? '<div class="tl-souls"><b>' + esc(window.KWPopGraph.full(souls)) + "</b><span>souls, about, in " +
            esc(A.label(y)) + "</span></div>"
          : "") +
        graph +
        (pw ? "<p class=\"tl-landblurb\">" + esc(pw.blurb) + "</p>" : "") +
        /* a power that already has a page in the wiki keeps it — the peoples
           collection only mints pages for the ones that do not (see the tail
           of js/peoples-data.js) */
        (pw
          ? '<a class="tl-readmore" href="' + esc(pw.wiki || ("wiki.html#people=" + pid)) + '">Read more about ' +
            esc(pw.short || pw.name) + " in the wiki &rarr;</a>"
          : "") +
      "</div>";
  }

  function renderPanel() {
    var el = $("tl-panel-inner");
    el.innerHTML = state.land ? landPanel(state.land) : yearPanel();
    el.scrollTop = 0;
    $("tl-panel").scrollTop = 0;

    var back = $("tl-land-back");
    if (back) back.addEventListener("click", function () { state.land = null; window.TLMap.select(null); goTo(state.year); });
    el.querySelectorAll("[data-year]").forEach(function (b) {
      b.addEventListener("click", function () { goTo(parseInt(b.dataset.year, 10), true); });
    });
  }

  /* ---------------- dragging the bar ---------------- */

  function yearFromEvent(e) {
    var r = $("tl-track").getBoundingClientRect();
    return A.fromPct(((e.clientX - r.left) / r.width) * 100);
  }

  function bindTrack() {
    var track = $("tl-track");
    var dragging = false;

    function move(e) { goTo(yearFromEvent(e)); }

    track.addEventListener("pointerdown", function (e) {
      if (e.target.closest(".tl-era") || e.target.closest(".tl-moment")) return;
      dragging = true;
      track.setPointerCapture && track.setPointerCapture(e.pointerId);
      track.classList.add("dragging");
      move(e);
    });
    track.addEventListener("pointermove", function (e) { if (dragging) move(e); });
    function end() { dragging = false; track.classList.remove("dragging"); }
    track.addEventListener("pointerup", end);
    track.addEventListener("pointercancel", end);

    /* the handle is a slider: the arrow keys walk it a year at a time */
    track.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { e.preventDefault(); goTo(A.step(state.year, 1)); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); goTo(A.step(state.year, -1)); }
      else if (e.key === "Home") { e.preventDefault(); goTo(A.MIN); }
      else if (e.key === "End") { e.preventDefault(); goTo(A.MAX); }
    });
  }

  /* ---------------- the map on a small screen ---------------- */

  function bindMapSize() {
    var btn = $("tl-mapsize");
    btn.addEventListener("click", function () {
      state.expanded = !state.expanded;
      document.body.classList.toggle("tl-map-big", state.expanded);
      btn.textContent = state.expanded ? "Minimise the map" : "Expand the map";
      btn.setAttribute("aria-expanded", state.expanded ? "true" : "false");
    });
  }

  /* ---------------- init ---------------- */

  buildEraBand();
  buildRuler();
  buildMoments();
  bindTrack();
  bindMapSize();

  window.TLMap.init({
    svg: $("tl-map"),
    viewport: $("tl-map-vp"),
    terrLayer: $("tl-terr-layer"),
    labelLayer: $("tl-label-layer"),
    tip: $("tl-maptip"),
    legend: $("tl-legend"),
    onPick: function (landId) {
      state.land = landId;
      renderPanel();
      try {
        history.replaceState(null, "", "#year=" + state.year + (landId ? "&land=" + landId : ""));
      } catch (e) {}
      if (window.matchMedia("(max-width: 900px)").matches) {
        $("tl-panel").scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    },
  });

  $("tl-zoom-in").addEventListener("click", function () { window.TLMap.zoomBy(1.4); });
  $("tl-zoom-out").addEventListener("click", function () { window.TLMap.zoomBy(1 / 1.4); });
  $("tl-zoom-fit").addEventListener("click", function () { window.TLMap.reset(); });

  $("tl-back-one").addEventListener("click", function () { goTo(A.step(state.year, -1)); });
  $("tl-fwd-one").addEventListener("click", function () { goTo(A.step(state.year, 1)); });
  $("tl-back-far").addEventListener("click", function () { var y = neighbourMoment(-1); if (y != null) goTo(y, true); });
  $("tl-fwd-far").addEventListener("click", function () { var y = neighbourMoment(1); if (y != null) goTo(y, true); });

  document.addEventListener("keydown", function (e) {
    var t = e.target;
    if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable)) return;
    if (document.querySelector(".gs-overlay.open") || document.querySelector(".kws-overlay.open")) return;
    if (e.key === "ArrowRight") { e.preventDefault(); goTo(A.step(state.year, 1)); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); goTo(A.step(state.year, -1)); }
  });

  /* the bar's ruler depends on how wide it is, so redraw it when that changes */
  var resizeT = null, lastW = window.innerWidth;
  window.addEventListener("resize", function () {
    if (window.innerWidth === lastW) return;
    lastW = window.innerWidth;
    clearTimeout(resizeT);
    resizeT = setTimeout(function () { buildRuler(); paintBar(); }, 160);
  });

  /* the shield moved, here or in another game — follow it */
  window.addEventListener("kw-shield", function () {
    buildMoments();
    goTo(state.year);
  });

  /* a link may name a year and a land */
  var hash = new URLSearchParams(location.hash.slice(1));
  var wantYear = parseInt(hash.get("year"), 10);
  if (!isNaN(wantYear)) state.year = A.snap(wantYear);
  var wantLand = hash.get("land");
  if (wantLand && (window.TL_LANDS || []).some(function (l) { return l.id === wantLand; })) state.land = wantLand;

  goTo(state.year);
  if (state.land) { window.TLMap.select(state.land); renderPanel(); }
})();
