/* THE KNOWN WORLD — map view over the ASOIAF map image.
   Coordinate space = image pixels (5652 × 3682). Markers, banners, and route
   overlays counter-scale so they render at constant screen size. */

const VB_WIDTH = 5652;
const VB_HEIGHT = 3682;
const MIN_SCALE = 0.9;

/* THE ZOOM CEILING MUST FOLLOW THE VIEWPORT, NOT BE A CONSTANT.
   `scale` is a multiplier on "the whole map fits in the box", so the same
   number means wildly different magnification on different screens. At the old
   fixed ceiling of 10, a 1400px desktop got about 2.5 screen pixels per map
   pixel and a 390px phone got about 0.7 — three and a half times less, which is
   precisely why the map was unreadable on a phone however hard you pinched.

   So the ceiling is expressed in the thing the reader actually cares about:
   screen pixels per map pixel. MAX_SCALE stays as a floor so no desktop can
   zoom LESS than it used to; HARD_MAX_SCALE stops a very narrow window from
   asking for a magnification the basemap has no detail to fill. */
const MAX_SCALE = 10;          /* the floor of the ceiling — old desktop behaviour */
const MAX_ZOOM_PX = 2.6;       /* screen pixels per map pixel when fully zoomed in */
const HARD_MAX_SCALE = 40;
/* markers are designed in "1000-wide" units; this factor keeps them the same
   apparent size in the much larger image coordinate space */
const MARKER_BASE = VB_WIDTH / 1000;

/* Smooth zoom-dependent marker size: markers (and the banners anchored to
   them) render at 40% size when fully zoomed out, easing up to full size by
   scale 4. This keeps the map readable when zoomed out AND pins every overlay
   close to its true position at all zoom levels. */
function markerK(scale) {
  const t = clamp((scale - 1) / 3, 0, 1);       // 0 at scale<=1, 1 at scale>=4
  const eased = t * t * (3 - 2 * t);            // smoothstep
  const f = 0.4 + 0.6 * eased;
  return (MARKER_BASE * f) / scale;
}


class MapView {
  constructor(svgEl, viewportEl, markerLayerEl, routeLayerEl, bannerLayerEl, peopleLayerEl, deathLayerEl) {
    this.svg = svgEl;
    this.viewport = viewportEl;
    this.markerLayer = markerLayerEl;
    this.routeLayer = routeLayerEl;
    this.bannerLayer = bannerLayerEl;
    this.peopleLayer = peopleLayerEl;
    this.deathLayer = deathLayerEl;

    this.state = { x: 0, y: 0, scale: 1 };
    this.markerEls = new Map();
    this.onMarkerClick = null;
    this.onBannerClick = null;
    this.onBackgroundClick = null;
    this.onPersonClick = null;
    this.onDeathClick = null;
    this.onUserPan = null;
    this._suppressNextClick = false;

    this._routePathEl = null;
    this._routeLen = 0;
    this._stopLens = [];
    this._stopEls = [];
    this._travelerPt = null;

    this._injectDefs();
    this._drag = null;
    this._bindInteraction();
    this._applyTransform();
  }

  _injectDefs() {
    /* Pin markers: teardrop body whose TIP sits exactly on the map's printed
       dot, with a game-icons glyph (castle/gate/village/ruins/obelisk) inside. */
    const PIN_BODY = "M 0 0 C -3 -7 -13 -11 -13 -23 A 13 13 0 1 1 13 -23 C 13 -11 3 -7 0 0 Z";
    const GLYPH_SIZE = 17; // px inside the pin head
    const s = GLYPH_SIZE / 512;
    const off = -GLYPH_SIZE / 2;

    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    let html = "";
    Object.entries(PIN_GLYPHS).forEach(([type, d]) => {
      html += `
      <g id="pin-${type}">
        <path class="pin-body pin-body-${type}" d="${PIN_BODY}"/>
        <g transform="translate(${off},${-23 + off}) scale(${s})">
          <path class="pin-glyph" d="${d}"/>
        </g>
      </g>`;
    });
    // circular clip for character face-chips (local user space of each chip)
    html += `<clipPath id="person-clip"><circle r="11"/></clipPath>`;
    defs.innerHTML = html;
    this.svg.insertBefore(defs, this.svg.firstChild);
  }

  /* face-chips showing where the tale's people stand at the chosen episode/chapter.
     entries: [{x, y, name, img, color}] — several people at one place fan out side by side. */
  renderPeople(entries) {
    this.peopleLayer.innerHTML = "";
    if (!entries || !entries.length) return;
    const k = markerK(this.state.scale);

    const byPlace = new Map();
    entries.forEach((e) => {
      const key = `${e.x},${e.y}`;
      if (!byPlace.has(key)) byPlace.set(key, []);
      byPlace.get(key).push(e);
    });

    const PER_ROW = 6; // crowded places wrap into rows stacked upward
    byPlace.forEach((list) => {
      /* the focused (viewed/located) soul renders last, largest, and on top */
      list.sort((a, b) => (a.focus ? 1 : 0) - (b.focus ? 1 : 0));
      list.forEach((e, i) => {
        const row = Math.floor(i / PER_ROW);
        const inThisRow = Math.min(list.length - row * PER_ROW, PER_ROW);
        const off = ((i % PER_ROW) - (inThisRow - 1) / 2) * 25;
        const lift = -64 - row * 26;
        const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        g.setAttribute("class", "person-chip" + (e.focus ? " person-chip-focus" : ""));
        g.setAttribute("transform", `translate(${e.x},${e.y})`);
        const face = e.img
          ? `<image href="assets/people/${e.img}" x="-11" y="-11" width="22" height="22" clip-path="url(#person-clip)" preserveAspectRatio="xMidYMid slice"/>`
          : `<circle r="11" fill="${e.color || "#6b6b6b"}"/><text class="person-chip-initials" text-anchor="middle" dy="3.5">${e.name.split(" ").map(w => w[0]).slice(0, 2).join("")}</text>`;
        g.innerHTML = `<g class="marker-scale" transform="scale(${k})"><g transform="translate(${off},${lift})${e.focus ? " scale(1.45)" : ""}">
          <circle class="person-chip-ring" r="12.5"/>
          ${face}
          <title>${e.name}${e.note ? " — " + e.note : ""}</title>
        </g></g>`;
        g.addEventListener("click", (ev) => {
          ev.stopPropagation();
          if (this.onPersonClick) this.onPersonClick(e.name);
        });
        this.peopleLayer.appendChild(g);
      });
    });
  }

  setPeopleVisible(visible) {
    this.peopleLayer.classList.toggle("hidden-layer", !visible);
  }

  /* skull markers where the fallen met their end — shown only once the chosen
     episode/chapter is past each death. entries: [{x, y, name, when}];
     several deaths at one place fan out in rows BELOW the spot (faces fan above). */
  renderDeaths(entries) {
    this.deathLayer.innerHTML = "";
    if (!entries || !entries.length) return;
    const k = markerK(this.state.scale);
    const byPlace = new Map();
    entries.forEach((e) => {
      const key = `${e.x},${e.y}`;
      if (!byPlace.has(key)) byPlace.set(key, []);
      byPlace.get(key).push(e);
    });
    const PER_ROW = 6;
    byPlace.forEach((list) => {
      /* the focused (viewed/located) soul's skull renders last, largest, on top */
      list.sort((a, b) => (a.focus ? 1 : 0) - (b.focus ? 1 : 0));
      list.forEach((e, i) => {
        const row = Math.floor(i / PER_ROW);
        const inThisRow = Math.min(list.length - row * PER_ROW, PER_ROW);
        const off = ((i % PER_ROW) - (inThisRow - 1) / 2) * 22;
        const drop = 30 + row * 23;
        const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        g.setAttribute("class", "death-pin" + (e.focus ? " death-pin-focus" : ""));
        g.setAttribute("transform", `translate(${e.x},${e.y})`);
        g.innerHTML = `<g class="marker-scale" transform="scale(${k})"><g transform="translate(${off},${drop})${e.focus ? " scale(1.45)" : ""}">
          <circle class="death-pin-disc" r="10"/>
          <text class="death-pin-skull" text-anchor="middle" dy="4">&#9760;</text>
          <title>${e.name} — fell here (${e.when})</title>
        </g></g>`;
        g.addEventListener("click", (ev) => {
          ev.stopPropagation();
          if (this.onDeathClick) this.onDeathClick(e.name);
        });
        this.deathLayer.appendChild(g);
      });
    });
  }

  screenToViewbox(clientX, clientY) {
    const pt = this.svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const ctm = this.svg.getScreenCTM();
    if (!ctm) return { x: 0, y: 0 };
    return pt.matrixTransform(ctm.inverse());
  }

  projectPoint(x, y) {
    const pt = this.svg.createSVGPoint();
    pt.x = x * this.state.scale + this.state.x;
    pt.y = y * this.state.scale + this.state.y;
    const ctm = this.svg.getScreenCTM();
    if (!ctm) return { x: 0, y: 0 };
    return pt.matrixTransform(ctm);
  }

  _bindInteraction() {
    const svg = this.svg;

    svg.addEventListener("mousedown", (e) => {
      if (e.button !== 0) return;
      this._drag = { startX: e.clientX, startY: e.clientY, origX: this.state.x, origY: this.state.y, moved: false };
      svg.classList.add("grabbing");
    });

    window.addEventListener("mousemove", (e) => {
      if (!this._drag) return;
      const rect = svg.getBoundingClientRect();
      const unitsPerPx = this._unitsPerPx(rect);
      const dx = (e.clientX - this._drag.startX) * unitsPerPx;
      const dy = (e.clientY - this._drag.startY) * unitsPerPx;
      if (Math.abs(dx) + Math.abs(dy) > 4) {
        this._drag.moved = true;
        if (this.onUserPan) this.onUserPan();
      }
      this.state.x = this._drag.origX + dx;
      this.state.y = this._drag.origY + dy;
      this._clampPan();
      this._applyTransform();
    });

    window.addEventListener("mouseup", () => {
      if (this._drag && this._drag.moved) this._suppressNextClick = true;
      this._drag = null;
      svg.classList.remove("grabbing");
    });

    // a click on empty map (markers & banners stop propagation) deselects
    svg.addEventListener("click", () => {
      if (this._suppressNextClick) { this._suppressNextClick = false; return; }
      if (this.onBackgroundClick) this.onBackgroundClick();
    });

    svg.addEventListener(
      "wheel",
      (e) => {
        e.preventDefault();
        const factor = e.deltaY < 0 ? 1.18 : 1 / 1.18;
        this.zoomAt(e.clientX, e.clientY, factor);
      },
      { passive: false }
    );

    let touchState = null;
    svg.addEventListener("touchstart", (e) => {
      if (e.touches.length === 1) {
        touchState = { mode: "pan", startX: e.touches[0].clientX, startY: e.touches[0].clientY, origX: this.state.x, origY: this.state.y };
      } else if (e.touches.length === 2) {
        const [a, b] = e.touches;
        touchState = {
          mode: "pinch",
          lastDist: Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY),
          lastMidX: (a.clientX + b.clientX) / 2,
          lastMidY: (a.clientY + b.clientY) / 2
        };
      }
    });
    svg.addEventListener(
      "touchmove",
      (e) => {
        if (!touchState) return;
        e.preventDefault();
        if (touchState.mode === "pan" && e.touches.length === 1) {
          const rect = svg.getBoundingClientRect();
          const unitsPerPx = this._unitsPerPx(rect);
          this.state.x = touchState.origX + (e.touches[0].clientX - touchState.startX) * unitsPerPx;
          this.state.y = touchState.origY + (e.touches[0].clientY - touchState.startY) * unitsPerPx;
          if (this.onUserPan) this.onUserPan();
          this._clampPan();
          this._applyTransform();
        } else if (touchState.mode === "pinch" && e.touches.length === 2) {
          /* Pinch must grow the map around the point BETWEEN the fingers.
             This used to assign this.state.scale directly and leave x/y alone,
             which meant the content only ever scaled about its own origin — so
             on a phone every pinch dragged the map toward the top-left corner
             and every spread pushed it away. zoomAt() already does the correct
             arithmetic for the mouse wheel (it keeps the point under the cursor
             pinned), so the fingers' midpoint is simply fed to the same method,
             frame by frame. The midpoint's own movement is applied as a pan, so
             two fingers can drag and zoom in one gesture the way they do in
             every native map. */
          const [a, b] = e.touches;
          const dist = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
          const midX = (a.clientX + b.clientX) / 2;
          const midY = (a.clientY + b.clientY) / 2;
          if (touchState.lastDist > 0) {
            /* Order matters: the map point the fingers hold is still sitting
               under the PREVIOUS midpoint, so translate it to the new midpoint
               first, and only then scale about that point. Zooming first would
               pivot about a spot the fingers have already left, and the error
               accumulates over a long gesture. */
            const rect = svg.getBoundingClientRect();
            const unitsPerPx = this._unitsPerPx(rect);
            this.state.x += (midX - touchState.lastMidX) * unitsPerPx;
            this.state.y += (midY - touchState.lastMidY) * unitsPerPx;
            const factor = dist / touchState.lastDist;
            if (isFinite(factor) && factor > 0) this.zoomAt(midX, midY, factor);
            if (this.onUserPan) this.onUserPan();
            this._clampPan();
            this._applyTransform();
          }
          touchState.lastDist = dist;
          touchState.lastMidX = midX;
          touchState.lastMidY = midY;
          this._suppressNextClick = true;
        }
      },
      { passive: false }
    );
    svg.addEventListener("touchend", (e) => {
      /* Lifting one finger of a pinch used to kill the gesture outright, so the
         map froze until both fingers were lifted and put down again. Hand the
         remaining finger back to panning instead. */
      if (e.touches.length === 1) {
        touchState = {
          mode: "pan",
          startX: e.touches[0].clientX, startY: e.touches[0].clientY,
          origX: this.state.x, origY: this.state.y
        };
      } else if (e.touches.length === 0) {
        touchState = null;
      }
    });
  }

  _unitsPerPx(rect) {
    const scaleFit = Math.min(rect.width / VB_WIDTH, rect.height / VB_HEIGHT);
    return 1 / scaleFit;
  }

  /* how far in this particular screen is allowed to go — see the note by
     MAX_ZOOM_PX. Recomputed on every gesture so a rotated phone or a resized
     window gets the right ceiling without anything having to listen for it. */
  _maxScale() {
    const rect = this.svg.getBoundingClientRect();
    if (!rect.width || !rect.height) return MAX_SCALE;
    const scaleFit = Math.min(rect.width / VB_WIDTH, rect.height / VB_HEIGHT);
    if (!scaleFit) return MAX_SCALE;
    return clamp(Math.max(MAX_SCALE, MAX_ZOOM_PX / scaleFit), MAX_SCALE, HARD_MAX_SCALE);
  }

  zoomAt(clientX, clientY, factor) {
    const p = this.screenToViewbox(clientX, clientY);
    const newScale = clamp(this.state.scale * factor, MIN_SCALE, this._maxScale());
    const contentX = (p.x - this.state.x) / this.state.scale;
    const contentY = (p.y - this.state.y) / this.state.scale;
    this.state.x = p.x - contentX * newScale;
    this.state.y = p.y - contentY * newScale;
    this.state.scale = newScale;
    this._clampPan();
    this._applyTransform();
  }

  zoomBy(factor) {
    const rect = this.svg.getBoundingClientRect();
    this.zoomAt(rect.left + rect.width / 2, rect.top + rect.height / 2, factor);
  }

  reset(durationMs = 600) {
    this._animateTo({ x: 0, y: 0, scale: 1 }, durationMs);
  }

  focusOn(x, y, targetScale = 3.5, durationMs = 700) {
    const s = clamp(targetScale, MIN_SCALE, this._maxScale());
    this._animateTo({ scale: s, x: VB_WIDTH / 2 - x * s, y: VB_HEIGHT / 2 - y * s }, durationMs);
  }

  nudgeToward(x, y, alpha, targetScale) {
    const s = targetScale ? this.state.scale + (targetScale - this.state.scale) * alpha : this.state.scale;
    this.state.scale = s;
    this.state.x += (VB_WIDTH / 2 - x * s - this.state.x) * alpha;
    this.state.y += (VB_HEIGHT / 2 - y * s - this.state.y) * alpha;
    this._applyTransform();
  }

  fitBounds(points, paddingRatio = 0.25, durationMs = 700) {
    if (!points.length) return;
    const xs = points.map((p) => p.x);
    const ys = points.map((p) => p.y);
    const minX = Math.min(...xs), maxX = Math.max(...xs);
    const minY = Math.min(...ys), maxY = Math.max(...ys);
    const w = Math.max(maxX - minX, 300);
    const h = Math.max(maxY - minY, 300);
    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;
    const scale = clamp(
      Math.min(VB_WIDTH / (w * (1 + paddingRatio * 2)), VB_HEIGHT / (h * (1 + paddingRatio * 2))),
      MIN_SCALE, this._maxScale()
    );
    this._animateTo({ scale, x: VB_WIDTH / 2 - cx * scale, y: VB_HEIGHT / 2 - cy * scale }, durationMs);
  }

  _animateTo(end, durationMs) {
    this._animToken = (this._animToken || 0) + 1;
    const token = this._animToken;
    if (durationMs <= 0) {
      this.state = { x: end.x, y: end.y, scale: end.scale };
      this._applyTransform();
      return;
    }
    const start = { ...this.state };
    const t0 = performance.now();
    const step = (t) => {
      if (token !== this._animToken) return;
      const p = clamp((t - t0) / durationMs, 0, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      this.state.x = start.x + (end.x - start.x) * eased;
      this.state.y = start.y + (end.y - start.y) * eased;
      this.state.scale = start.scale + (end.scale - start.scale) * eased;
      this._applyTransform();
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  // keep the map covering the view: never let more than ~10% of the frame be
  // empty on any side, so you can't drag the map off into the void.
  _clampPan() {
    const s = this.state.scale;
    const Gx = VB_WIDTH * 0.10, Gy = VB_HEIGHT * 0.10;
    const loX = VB_WIDTH - Gx - VB_WIDTH * s, hiX = Gx;
    this.state.x = loX > hiX ? (VB_WIDTH * (1 - s)) / 2 : clamp(this.state.x, loX, hiX);
    const loY = VB_HEIGHT - Gy - VB_HEIGHT * s, hiY = Gy;
    this.state.y = loY > hiY ? (VB_HEIGHT * (1 - s)) / 2 : clamp(this.state.y, loY, hiY);
  }

  _applyTransform() {
    const { x, y, scale } = this.state;
    this.viewport.setAttribute("transform", `translate(${x},${y}) scale(${scale})`);

    this.svg.classList.toggle("zoom-mid", scale > 1.7);
    this.svg.classList.toggle("zoom-close", scale > 3.1);

    const k = markerK(scale);
    this.viewport.querySelectorAll(".marker-scale").forEach((el) => {
      el.setAttribute("transform", `scale(${k})`);
    });
  }

  clearMarkers() {
    this.markerLayer.innerHTML = "";
    this.markerEls.clear();
  }

  renderMarkers(locations, { dimmedIds = new Set(), highlightedIds = new Set(), onClick } = {}) {
    this.clearMarkers();
    this.onMarkerClick = onClick;
    const k = markerK(this.state.scale);

    locations.forEach((loc) => {
      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.setAttribute("class", `marker rank-${loc.rank || 2}`);
      g.setAttribute("transform", `translate(${loc.x},${loc.y})`);
      g.dataset.id = loc.id;
      if (dimmedIds.has(loc.id)) g.classList.add("dimmed");
      if (highlightedIds.has(loc.id)) g.classList.add("highlighted");

      const sg = document.createElementNS("http://www.w3.org/2000/svg", "g");
      sg.setAttribute("class", "marker-scale");
      sg.setAttribute("transform", `scale(${k})`);

      const ring = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      ring.setAttribute("class", "hover-ring");
      ring.setAttribute("cy", "-23");
      ring.setAttribute("r", "15");
      sg.appendChild(ring);

      const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
      use.setAttribute("href", `#pin-${loc.type}`);
      use.setAttribute("class", `marker-pin pin-${loc.type}`);
      sg.appendChild(use);

      const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
      label.setAttribute("class", "marker-label");
      label.setAttribute("y", "13");
      label.setAttribute("text-anchor", "middle");
      label.textContent = loc.name;
      sg.appendChild(label);

      g.appendChild(sg);
      g.addEventListener("click", (e) => {
        e.stopPropagation();
        if (this.onMarkerClick) this.onMarkerClick(loc, g);
      });

      this.markerLayer.appendChild(g);
      this.markerEls.set(loc.id, g);
    });
  }

  setSelectedMarker(id) {
    this.markerEls.forEach((el, key) => el.classList.toggle("selected", key === id));
  }

  /* seats: [{x, y, kind:"great"|"img"|"arms", img?, arms?}]
     Great-house shields render large; lesser houses small, floating above the pin. */
  renderBanners(seats) {
    this.bannerLayer.innerHTML = "";
    const k = markerK(this.state.scale);

    const SHIELD = "M -7 0 H 7 V 10 C 7 16 0 19 0 19 C 0 19 -7 16 -7 10 Z";
    const HALF_B = "M -7 8 H 7 V 10 C 7 16 0 19 0 19 C 0 19 -7 16 -7 10 Z";       // lower half (per fess)
    const HALF_R = "M 0 0 H 7 V 10 C 7 16 0 19 0 19 L 0 19 V 0 Z";                 // right half (per pale)
    const QTR_TR = "M 0 0 H 7 V 9 H 0 Z";                                          // quarters
    const QTR_BL = "M -7 9 H 0 V 19 C 0 19 -7 16 -7 10 Z";

    seats.forEach((s) => {
      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.setAttribute("class", `banner banner-${s.kind}`);
      g.setAttribute("transform", `translate(${s.x},${s.y})`);

      // the shield hangs BESIDE the pin's head (pin head: circle r13 at y-23),
      // so it stays glued to its own marker at every zoom — never floating
      // above toward another location, never covering the pin (or vice versa)
      let inner = "";
      if (s.kind === "great") {
        inner = `<image href="assets/sigils/${s.img}" x="15" y="-38" width="26" height="30"/>`;
      } else if (s.kind === "img") {
        inner = `<image href="assets/sigils/${s.img}" x="15" y="-33" width="16" height="19"/>`;
      } else {
        const [a, b] = s.arms.colors;
        let overlay = "";
        if (s.arms.div === "fess") overlay = `<path d="${HALF_B}" fill="${b}"/>`;
        else if (s.arms.div === "pale") overlay = `<path d="${HALF_R}" fill="${b}"/>`;
        else if (s.arms.div === "quarter") overlay = `<path d="${QTR_TR}" fill="${b}"/><path d="${QTR_BL}" fill="${b}"/>`;
        else overlay = `<circle cx="0" cy="7" r="3" fill="${b}"/>`;
        inner = `<g transform="translate(22,-33)">
          <path d="${SHIELD}" fill="${a}"/>
          ${overlay}
          <path d="${SHIELD}" fill="none" class="shield-outline"/>
        </g>`;
      }

      g.innerHTML = `<g class="marker-scale" transform="scale(${k})">${inner}</g>`;
      if (s.groupId || s.locId) {
        g.classList.add("banner-clickable");
        g.addEventListener("click", (e) => {
          e.stopPropagation();
          if (this.onBannerClick) this.onBannerClick(s);
        });
      }
      this.bannerLayer.appendChild(g);
    });
  }

  setBannersVisible(visible) {
    this.bannerLayer.classList.toggle("hidden-layer", !visible);
  }

  clearRoute() {
    this.routeLayer.innerHTML = "";
    this._routePathEl = null;
    this._stopEls = [];
    this._stopLens = [];
    this._travelerPt = null;
  }

  renderRoute(stopPoints, color = "#c25353", onStopClick) {
    this.clearRoute();
    if (stopPoints.length < 2) return;

    const pathD = catmullRomPath(stopPoints);

    // solid path revealed progressively as the traveler advances — no preview
    // of the road ahead, so the colored line always trails the circle
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("class", "route-path");
    path.setAttribute("d", pathD);
    path.setAttribute("stroke", color);
    this.routeLayer.appendChild(path);
    this._routePathEl = path;
    this._routeLen = path.getTotalLength();
    path.style.strokeDasharray = `${this._routeLen}`;
    path.style.strokeDashoffset = `${this._routeLen}`;

    /* the spline has exactly one segment per stop pair, so each stop's distance
       along the road is the length of the path truncated after its segment.
       (Nearest-point sampling could snap a revisited place to a LATER pass of
       the road, revealing roads not yet walked ahead of the traveler.) */
    const segs = pathD.split(/(?=[CL])/);
    const probe = document.createElementNS("http://www.w3.org/2000/svg", "path");
    probe.setAttribute("fill", "none");
    probe.style.visibility = "hidden";
    this.routeLayer.appendChild(probe);
    this._stopLens = stopPoints.map((p, i) => {
      if (i === 0) return 0;
      probe.setAttribute("d", segs.slice(0, i + 1).join(""));
      return probe.getTotalLength();
    });
    probe.remove();
    this._stopLens[this._stopLens.length - 1] = this._routeLen;

    const k = markerK(this.state.scale);
    stopPoints.forEach((p, i) => {
      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.setAttribute("class", "stop-marker upcoming");
      g.setAttribute("transform", `translate(${p.x},${p.y})`);

      const sg = document.createElementNS("http://www.w3.org/2000/svg", "g");
      sg.setAttribute("class", "marker-scale");
      sg.setAttribute("transform", `scale(${k})`);

      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("class", "stop-circle");
      circle.setAttribute("r", "12");
      circle.style.stroke = color;
      sg.appendChild(circle);

      const num = document.createElementNS("http://www.w3.org/2000/svg", "text");
      num.setAttribute("class", "stop-number");
      num.setAttribute("text-anchor", "middle");
      num.setAttribute("dy", "4.5");
      num.textContent = String(i + 1);
      sg.appendChild(num);

      const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
      label.setAttribute("class", "marker-label stop-label");
      label.setAttribute("y", "26");
      label.setAttribute("text-anchor", "middle");
      label.textContent = p.name;
      sg.appendChild(label);

      g.appendChild(sg);
      g.addEventListener("click", (e) => {
        e.stopPropagation();
        if (onStopClick) onStopClick(i, g);
      });
      this.routeLayer.appendChild(g);
      this._stopEls.push(g);
    });

    const traveler = document.createElementNS("http://www.w3.org/2000/svg", "g");
    traveler.setAttribute("class", "traveler");
    traveler.innerHTML = `<g class="marker-scale"><circle class="traveler-halo" r="11" style="fill:${color}"/><circle class="traveler-dot" r="6" style="fill:${color}"/></g>`;
    this.routeLayer.appendChild(traveler);
    this._travelerEl = traveler;
  }

  setTraveler(fraction) {
    if (!this._routePathEl || this._stopLens.length < 2) return;
    const n = this._stopLens.length;
    const f = clamp(fraction, 0, n - 1);
    const i = Math.min(Math.floor(f), n - 2);
    const t = f - i;
    const L = this._stopLens[i] + (this._stopLens[i + 1] - this._stopLens[i]) * t;

    const pt = this._routePathEl.getPointAtLength(L);
    this._travelerPt = { x: pt.x, y: pt.y };
    this._travelerEl.setAttribute("transform", `translate(${pt.x},${pt.y})`);
    this._travelerEl.querySelector(".marker-scale").setAttribute("transform", `scale(${markerK(this.state.scale)})`);

    this._routePathEl.style.strokeDashoffset = `${this._routeLen - L}`;
    this._stopEls.forEach((el, kdx) => {
      const visited = this._stopLens[kdx] <= L + 1;
      el.classList.toggle("visited", visited);
      el.classList.toggle("upcoming", !visited);
    });
  }

  getTravelerPoint() {
    return this._travelerPt;
  }
}

function catmullRomPath(points) {
  if (points.length === 2) {
    return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`;
  }
  const p = points;
  let d = `M ${p[0].x} ${p[0].y} `;
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] || p[i];
    const p1 = p[i];
    const p2 = p[i + 1];
    const p3 = p[i + 2] || p2;
    d += `C ${p1.x + (p2.x - p0.x) / 6} ${p1.y + (p2.y - p0.y) / 6}, ${p2.x - (p3.x - p1.x) / 6} ${p2.y - (p3.y - p1.y) / 6}, ${p2.x} ${p2.y} `;
  }
  return d;
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}
