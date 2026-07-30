/* ============================================================================
   map-layers.js — the base-map switcher.

   Turns the little layers button in the map controls (bottom-right) into a
   Google-Maps-style layer picker: press it, a panel pops up, choose which
   base map is drawn under all the pins. Shared by all three maps (root, hotd,
   knight) — it figures out the correct assets/ path from the current basemap
   href, so the same file works from every folder depth.

   Every base map here must be the SAME 5652x3682 pixel canvas as the original,
   or the pins (whose coordinates are image pixels) will no longer line up.

   The choice is remembered in localStorage ("kwBasemap") and applies across
   all three maps, since they share one world chart.
   ========================================================================== */
(function () {
  "use strict";

  var basemap = document.getElementById("basemap");
  var btn = document.getElementById("map-layers-btn");
  var panel = document.getElementById("map-layers-panel");
  if (!basemap || !btn || !panel) return;

  /* work out the "assets/" prefix from whatever the page already points at
     ("assets/..." at the root, "../assets/..." inside hotd/ and knight/) */
  var href = basemap.getAttribute("href") || basemap.getAttribute("xlink:href") || "assets/";
  var i = href.indexOf("assets/");
  var PREFIX = i >= 0 ? href.slice(0, i + "assets/".length) : "assets/";

  /* the available base maps. Add a row here (same pixel size!) to offer more. */
  var MAPS = [
    {
      id: "classic",
      label: "The Known World",
      desc: "My own hand-drawn map of the realm",
      file: "ASOIAF_map_redrawn_v6.jpg",
      thumb: "ASOIAF_map_redrawn_v6_preview.jpg"
    }
  ];
  var STORE = "kwBasemap";

  function saved() {
    try { return localStorage.getItem(STORE); } catch (e) { return null; }
  }
  function remember(id) {
    try { localStorage.setItem(STORE, id); } catch (e) {}
  }
  function mapById(id) {
    for (var k = 0; k < MAPS.length; k++) if (MAPS[k].id === id) return MAPS[k];
    return MAPS[0];
  }

  var currentId = mapById(saved()).id;

  /* draw the chosen base map under the pins */
  function applyMap(id, persist) {
    var m = mapById(id);
    currentId = m.id;
    var url = PREFIX + m.file;
    basemap.setAttribute("href", url);
    basemap.setAttribute("xlink:href", url);   /* belt and braces for older SVG */
    if (persist) remember(m.id);
    markActive();
  }

  function markActive() {
    var opts = panel.querySelectorAll(".mlp-opt");
    for (var k = 0; k < opts.length; k++) {
      opts[k].classList.toggle("on", opts[k].getAttribute("data-map") === currentId);
      opts[k].setAttribute("aria-checked", opts[k].getAttribute("data-map") === currentId ? "true" : "false");
    }
  }

  /* build the panel */
  function buildPanel() {
    var html = '<div class="mlp-title">Base map</div>';
    for (var k = 0; k < MAPS.length; k++) {
      var m = MAPS[k];
      html += '<button type="button" class="mlp-opt" role="menuitemradio" data-map="' + m.id + '">' +
        '<span class="mlp-thumb" style="background-image:url(' + PREFIX + m.thumb + ')"></span>' +
        '<span class="mlp-text"><span class="mlp-label">' + m.label + '</span>' +
        '<span class="mlp-desc">' + m.desc + '</span></span>' +
        '<span class="mlp-check" aria-hidden="true">&#10003;</span>' +
        '</button>';
    }
    panel.innerHTML = html;
    var opts = panel.querySelectorAll(".mlp-opt");
    for (var j = 0; j < opts.length; j++) {
      opts[j].addEventListener("click", function () {
        applyMap(this.getAttribute("data-map"), true);
        close();
      });
    }
    markActive();
  }

  /* open / close the popup */
  function isOpen() { return !panel.classList.contains("hidden"); }
  function open() {
    panel.classList.remove("hidden");
    btn.setAttribute("aria-expanded", "true");
    btn.classList.add("on");
  }
  function close() {
    panel.classList.add("hidden");
    btn.setAttribute("aria-expanded", "false");
    btn.classList.remove("on");
  }
  function toggle() { isOpen() ? close() : open(); }

  btn.addEventListener("click", function (e) { e.stopPropagation(); toggle(); });
  panel.addEventListener("click", function (e) { e.stopPropagation(); });
  document.addEventListener("mousedown", function (e) {
    if (isOpen() && !panel.contains(e.target) && !btn.contains(e.target)) close();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && isOpen()) close();
  });

  buildPanel();
  /* apply the remembered choice on load (no re-save) */
  if (currentId !== MAPS[0].id) applyMap(currentId, false);
})();
