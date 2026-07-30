/* HOUSE FAMILY TREES — a book of lineages. Renders each great house (or all of
   them together, colour-coded) as a nested tree on aged parchment; scroll to
   zoom, drag to pan, click a face for that person's card. Spoiler-gated so late
   reveals (Jon Snow's parents, endgame titles) stay hidden until reached. */
(function () {
  "use strict";
  const byId = (id) => document.getElementById(id);
  const houseById = {};
  TREE_HOUSES.forEach((h) => (houseById[h.id] = h));

  /* each house its own ink colour, for names, accents and the combined view */
  const HOUSE_COLORS = {
    targaryen: "#7a1420", stark: "#455160", lannister: "#9e1b2a", velaryon: "#2f7d8a",
    hightower: "#5f6870", baratheon: "#8a6f1e", tully: "#2e5f9a", arryn: "#3f6f9c",
    martell: "#cf7420", tyrell: "#4c7d2e", greyjoy: "#5a4a7a",
  };
  function colorFor(id) { return HOUSE_COLORS[id] || "#6a4f1c"; }

  /* Every face we know, indexed by name, so a spouse shown inline (Cersei on the
     Baratheon tree, Corlys on the Targaryen tree) borrows the portrait from their
     own node elsewhere — even when written "Firstname Housename". */
  const IMG_BY_NAME = {}, IMG_BY_HOUSE = {};
  function firstToken(n) { return String(n).split(",")[0].trim().split(/\s+/)[0].toLowerCase(); }
  function indexFaces(node, houseId) {
    if (node.img) {
      if (!IMG_BY_NAME[node.n]) IMG_BY_NAME[node.n] = node.img;
      const k = firstToken(node.n) + "|" + houseId;
      if (!IMG_BY_HOUSE[k]) IMG_BY_HOUSE[k] = node.img;
    }
    (node.kids || []).forEach((k) => indexFaces(k, houseId));
  }
  TREE_HOUSES.forEach((h) => h.segments.forEach((seg) => indexFaces(seg.root, h.id)));
  function lookupFace(sp) {
    if (sp.img) return sp.img;
    if (IMG_BY_NAME[sp.n]) return IMG_BY_NAME[sp.n];
    const base = String(sp.n).split(",")[0].trim();
    if (IMG_BY_NAME[base]) return IMG_BY_NAME[base];
    if (sp.house) { const k = firstToken(sp.n) + "|" + sp.house; if (IMG_BY_HOUSE[k]) return IMG_BY_HOUSE[k]; }
    return null;
  }

  const BOOK_SHORT = { 1: "AGOT", 2: "ACOK", 3: "ASOS", 4: "AFFC", 5: "ADWD" };
  const state = { house: null, zoom: 1, fit: 1 };
  /* the order the arrow keys step through — every house (the combined "all" page
     was removed on request) */
  const HOUSE_ORDER = TREE_HOUSES.map((h) => h.id);
  let reg = [], nodeIndex = new Map(), keyedLNs = {};

  /* ---------- spoiler reveal logic ----------
     The trees used to keep their own localStorage["trees-progress"], which knew
     only Game of Thrones and could hold ONE place at a time — show OR book,
     never both. It now reads the site-wide shield (js/shield.js, the same
     record the games, the timeline and the home page use), so telling any one
     page how far you have come counts everywhere. The thresholds in
     trees-data.js are {s, b} against Game of Thrones, and either telling
     unlocks a fact, since either way the reader already knows it. */
  function reach(th) { return KWShield.reachGot(th); }
  function shown(o) { return (!o.reveal || reach(o.reveal)) && (!o.until || !reach(o.until)); }
  function effective(node) {
    const e = { n: node.n, t: node.t, king: node.king, note: node.note, img: node.img, bastard: node.bastard };
    if (node.spoil && reach(node.spoil)) {
      if (node.spoil.t != null) e.t = node.spoil.t;
      if (node.spoil.king != null) e.king = node.spoil.king;
      if (node.spoil.note != null) e.note = node.spoil.note;
      if (node.spoil.n != null) e.n = node.spoil.n;
      if (node.spoil.bastard != null) e.bastard = node.spoil.bastard;
    }
    return e;
  }

  function facePath(img) {
    if (!img) return null;
    if (img.indexOf("hotd/") === 0) return "../hotd/assets/people/" + img.slice(5);
    if (img.indexOf("got/") === 0) return "../assets/people/" + img.slice(4);
    return "../assets/people/" + img;
  }
  function initials(name) {
    return name.replace(/[^A-Za-z ]/g, "").split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  }

  /* ---------- tree node cards ---------- */
  function cardFor(node, idx, houseId) {
    const e = effective(node), col = colorFor(houseId);
    const card = document.createElement("div");
    card.className = "tn" + (e.bastard ? " bastard" : "");
    card.dataset.idx = idx;
    card.style.borderTopColor = col;

    const fp = facePath(e.img);
    if (fp) {
      const im = document.createElement("img");
      im.className = "tn-face"; im.src = fp; im.alt = e.n; im.loading = "lazy"; im.draggable = false;
      im.style.borderColor = col;
      im.onerror = function () { const b = document.createElement("div"); b.className = "tn-face-blank"; b.textContent = initials(e.n); b.style.borderColor = col; card.replaceChild(b, im); };
      card.appendChild(im);
    } else {
      const b = document.createElement("div"); b.className = "tn-face-blank"; b.textContent = initials(e.n); b.style.borderColor = col;
      card.appendChild(b);
    }
    const nm = document.createElement("div");
    nm.className = "tn-name"; nm.style.color = col;
    nm.innerHTML = (e.king ? '<span class="crown">&#9819;</span>' : "") + escapeHTML(e.n);
    card.appendChild(nm);
    if (e.t) { const tt = document.createElement("div"); tt.className = "tn-title"; tt.textContent = e.t; card.appendChild(tt); }

    if (e.note) { const nt = document.createElement("div"); nt.className = "tn-note"; nt.textContent = e.note; card.appendChild(nt); }
    card.addEventListener("click", () => selectNode(idx));
    return card;
  }

  /* the reference trees show married couples SIDE BY SIDE, joined by a bar
     whose colour tells the relation. We auto-detect the relation from the
     spouse's name/note ("his sister", "her uncle", "his cousin"). */
  const REL_COLORS = { sibling: "#b02a2a", "uncle-niece": "#c99a1a", cousin: "#cf7a1a", none: "#6a5236" };
  /* darker, DISTINCT hues for the long dashed cross-links so two links that pass
     near each other (Aemma's and Daemon's) never read as the same line */
  const LINK_COLORS = { none: "#8a2412", "uncle-niece": "#4a2f8a", cousin: "#0f6a5a", sibling: "#7a1030" };
  const REL_WORDS = { sibling: "married siblings", "uncle-niece": "married uncle & niece", cousin: "married cousins", none: "married" };
  function relOf(sp) {
    const s = ((sp.n || "") + " " + (sp.note || "")).toLowerCase();
    if (/\b(sister|brother)\b/.test(s)) return "sibling";
    if (/\b(uncle|niece|nephew|aunt)\b/.test(s)) return "uncle-niece";
    if (/\bcousin\b/.test(s)) return "cousin";
    return "none";
  }
  function spouseCardFor(sp, personNode, personHouseId) {
    const hid = (sp.house && houseById[sp.house]) ? sp.house : personHouseId;
    const spNode = { n: sp.n, t: sp.note || "", bio: sp.bio, img: lookupFace(sp), house: sp.house, _spouseOf: personNode };
    const idx = reg.length;
    reg.push({ node: spNode, el: null, parent: null, houseId: hid });
    nodeIndex.set(spNode, idx);
    const card = cardFor(spNode, idx, hid);
    card.classList.add("tn-spouse");
    reg[idx].el = card;
    return card;
  }
  /* ============================================================
     COMPUTED TREE LAYOUT
     A CSS auto-flow tree centres every parent over its WHOLE subtree, which
     shoves childless siblings out to the far edges and can't say which parent a
     child belongs to. So we compute positions ourselves:
       • contour packing — a childless sibling only has to clear the row it sits
         on, so it tucks right up against a deep sibling (the descendants pass
         BELOW it, using the vertical room);
       • couples ride tight (COUPLE_GAP); siblings sit wider apart (SIB_GAP);
       • children are grouped by their MOTHER (from the "by <Name>" in the data)
         and hang under that marriage's bar, in that spouse's colour.
     ============================================================ */
  const CARD_W = 106, COUPLE_GAP = 14, SIB_GAP = 34, GROUP_GAP = 50, ROW_H = 164;
  const BAR_Y = 26, RAIL_UP = 22, STEM_TOP = 30, SVGNS = "http://www.w3.org/2000/svg";

  function buildLayout(node, houseId, parentNode) {
    /* in the combined tree a node may name its OWN house (Velaryon inside the
       dragon line, etc.) so it takes that house's colour and sigil */
    const hid = node.house || houseId;
    const idx = reg.length;
    reg.push({ node: node, el: null, parent: parentNode, houseId: hid });
    nodeIndex.set(node, idx);
    const personCard = cardFor(node, idx, hid);
    reg[idx].el = personCard;

    /* person centred among their spouses. A spouse marked `ref` is NOT drawn as
       a card — that person lives elsewhere in the tree (keyed by `key`); we still
       group their shared children, and draw a marriage LINE between the two. */
    const sps = (node.sp || []).filter(shown);
    const cardSps = sps.filter((sp) => !sp.ref), refSps = sps.filter((sp) => sp.ref);
    const order = [], mid = Math.floor(cardSps.length / 2);
    if (cardSps.length <= 1) {
      order.push({ card: personCard, person: true });
      cardSps.forEach((sp) => order.push({ card: spouseCardFor(sp, node, hid), sp: sp }));
    } else {
      cardSps.slice(0, mid).forEach((sp) => order.push({ card: spouseCardFor(sp, node, hid), sp: sp }));
      order.push({ card: personCard, person: true });
      cardSps.slice(mid).forEach((sp) => order.push({ card: spouseCardFor(sp, node, hid), sp: sp }));
    }
    const n = order.length, step = CARD_W + COUPLE_GAP;
    const items = order.map((o, i) => ({ card: o.card, relX: (i - (n - 1) / 2) * step, sp: o.sp, person: o.person }));
    const w = n * CARD_W + (n - 1) * COUPLE_GAP;
    const personRel = items.find((it) => it.person).relX;
    const spouseMetas = items.filter((it) => it.sp).map((it) => ({ sp: it.sp, relX: it.relX, barRel: (personRel + it.relX) / 2, rel: relOf(it.sp) }));
    /* linked (off-tree) marriages: co-locate at the person for child-grouping */
    const links = refSps.map((sp) => ({ ref: sp.ref, rel: relOf(sp), fromRel: personRel }));
    refSps.forEach((sp) => spouseMetas.push({ sp: sp, relX: personRel, barRel: personRel, rel: relOf(sp), ref: true }));

    const ln = { node: node, houseId: hid, items: items, w: w, personRel: personRel, spouseMetas: spouseMetas, links: links,
      groups: [], children: [], leftContour: [-w / 2], rightContour: [w / 2], absX: 0, absY: 0 };
    if (node.key) keyedLNs[node.key] = ln;

    const kids = (node.kids || []).filter(shown);
    if (kids.length) {
      /* group children by mother (via the "by <Name>" the data already carries) */
      const byKey = new Map(), groups = [];
      kids.forEach((k) => {
        let sm = null;
        if (spouseMetas.length) {
          const t = ((k.t || "") + " " + (k.note || "")).toLowerCase();
          const m = t.match(/\bby ([a-zà-ÿ']+)/);
          if (m) sm = spouseMetas.find((s) => firstToken(s.sp.n) === m[1]) || null;
          if (!sm && spouseMetas.length === 1) sm = spouseMetas[0];
        }
        const key = sm ? sm.sp.n : "__center";
        let g = byKey.get(key);
        if (!g) { g = { sm: sm, rel: sm ? relOf(sm.sp) : "none", anchorRel: sm ? sm.barRel : personRel, kids: [], childLNs: [] }; byKey.set(key, g); groups.push(g); }
        g.kids.push(k);
      });
      groups.sort((a, b) => a.anchorRel - b.anchorRel);
      groups.forEach((g) => { g.childLNs = g.kids.map((k) => buildLayout(k, hid, node)); });

      /* contour-pack every child left→right (wider gap between mother-groups) */
      let mR = null, mL = null, placed = [], first = true;
      groups.forEach((g) => {
        g.childLNs.forEach((c, ci) => {
          let off = 0;
          if (!first) {
            const gap = ci === 0 ? GROUP_GAP : SIB_GAP, dd = Math.min(mR.length, c.leftContour.length);
            let need = -Infinity;
            for (let d = 0; d < dd; d++) need = Math.max(need, mR[d] - c.leftContour[d]);
            off = (need === -Infinity ? 0 : need) + gap;
          }
          c._off = off;
          if (first) { mL = c.leftContour.slice(); mR = c.rightContour.slice(); }
          else {
            for (let d = 0; d < c.rightContour.length; d++) { const rx = c.rightContour[d] + off; mR[d] = d >= mR.length ? rx : Math.max(mR[d], rx); }
            for (let d = 0; d < c.leftContour.length; d++) { const lx = c.leftContour[d] + off; mL[d] = d >= mL.length ? lx : Math.min(mL[d], lx); }
          }
          placed.push(c); first = false;
        });
      });
      const cc = (placed[0]._off + placed[placed.length - 1]._off) / 2;
      placed.forEach((c) => (c.relX = c._off - cc));
      ln.children = placed; ln.groups = groups;
      /* our contour: row 0 is the couple, rows 1+ come from the children */
      placed.forEach((c) => {
        for (let d = 0; d < c.leftContour.length; d++) {
          const L = c.relX + c.leftContour[d], R = c.relX + c.rightContour[d], lvl = d + 1;
          if (lvl >= ln.leftContour.length) { ln.leftContour[lvl] = L; ln.rightContour[lvl] = R; }
          else { ln.leftContour[lvl] = Math.min(ln.leftContour[lvl], L); ln.rightContour[lvl] = Math.max(ln.rightContour[lvl], R); }
        }
      });
    }
    return ln;
  }

  /* X (and depth) only — the Y of each row is decided AFTER the cards exist and
     we can measure how tall each generation's tallest card really is. */
  function assignX(ln, absX, depth, out) {
    ln.absX = absX; ln.depth = depth; out.push(ln);
    ln.children.forEach((c) => assignX(c, absX + c.relX, depth + 1, out));
  }
  function svgLine(svg, x1, y1, x2, y2, color, wdt) {
    const l = document.createElementNS(SVGNS, "line");
    l.setAttribute("x1", x1); l.setAttribute("y1", y1); l.setAttribute("x2", x2); l.setAttribute("y2", y2);
    l.setAttribute("stroke", color); l.setAttribute("stroke-width", wdt); l.setAttribute("stroke-linecap", "round");
    svg.appendChild(l);
  }
  function svgLinkLine(svg, x1, y1, x2, y2, color) {
    const l = document.createElementNS(SVGNS, "line");
    l.setAttribute("x1", x1); l.setAttribute("y1", y1); l.setAttribute("x2", x2); l.setAttribute("y2", y2);
    l.setAttribute("stroke", color); l.setAttribute("stroke-width", 2.6); l.setAttribute("stroke-linecap", "round");
    l.setAttribute("stroke-dasharray", "7 5"); l.setAttribute("opacity", "0.95");
    svg.appendChild(l);
  }
  function renderTree(root, houseId) {
    const wrap = document.createElement("div"); wrap.className = "ftree-abs"; wrap.style.position = "relative";
    keyedLNs = {};
    const ln = buildLayout(root, houseId, null);
    const all = []; assignX(ln, 0, 0, all);
    let minX = Infinity, maxX = -Infinity;
    all.forEach((u) => { minX = Math.min(minX, u.absX - u.w / 2); maxX = Math.max(maxX, u.absX + u.w / 2); });
    const PAD = 34, offX = PAD - minX;
    const svg = document.createElementNS(SVGNS, "svg");
    svg.style.position = "absolute"; svg.style.left = "0"; svg.style.top = "0"; svg.style.pointerEvents = "none";
    wrap.appendChild(svg);
    /* place the cards now (X only) so they're in the DOM and measurable; the
       marriage bars + descents are drawn once rows are sized in finalizeTree. */
    all.forEach((u) => { const cx = u.absX + offX; u.items.forEach((it) => {
      it.card.style.position = "absolute"; it.card.style.left = (cx + it.relX - CARD_W / 2) + "px"; wrap.appendChild(it.card);
    }); });
    wrap._layout = { all: all, offX: offX, minX: minX, maxX: maxX, svg: svg, pad: PAD, keyed: keyedLNs };
    return wrap;
  }
  /* Second pass, run once the wrap is in the DOM: measure each generation's
     tallest card, stack rows by real height (so a long description can never
     cover the row below), reposition the cards and draw the connectors. */
  const VGAP = 52;
  function finalizeTree(wrap) {
    const L = wrap._layout; if (!L) return;
    const all = L.all, offX = L.offX;
    let maxDepth = 0;
    all.forEach((u) => { maxDepth = Math.max(maxDepth, u.depth); let h = 0; u.items.forEach((it) => { h = Math.max(h, it.card.offsetHeight); }); u.height = h || 90; });
    const rowMax = [];
    all.forEach((u) => { rowMax[u.depth] = Math.max(rowMax[u.depth] || 0, u.height); });
    const rowY = []; let acc = L.pad;
    for (let d = 0; d <= maxDepth; d++) { rowY[d] = acc; acc += (rowMax[d] || 90) + VGAP; }
    let maxBottom = 0, maxX = -Infinity, minX = Infinity;
    all.forEach((u) => {
      u.absY = rowY[u.depth]; const cx = u.absX + offX;
      u.items.forEach((it) => { it.card.style.top = u.absY + "px"; });
      maxBottom = Math.max(maxBottom, u.absY + u.height);
      minX = Math.min(minX, u.absX - u.w / 2); maxX = Math.max(maxX, u.absX + u.w / 2);
    });
    const width = (maxX - minX) + L.pad * 2, height = maxBottom + L.pad;
    wrap.style.width = width + "px"; wrap.style.height = height + "px";
    const svg = L.svg; svg.setAttribute("width", width); svg.setAttribute("height", height);
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    all.forEach((u) => {
      const cx = u.absX + offX;
      u.spouseMetas.forEach((sm) => { if (sm.ref) return; svgLine(svg, cx + u.personRel, u.absY + BAR_Y, cx + sm.relX, u.absY + BAR_Y, REL_COLORS[sm.rel], 3); });
      u.groups.forEach((g) => {
        const color = g.sm ? REL_COLORS[g.rel] : "#6a5236";
        const ax = cx + g.anchorRel, childTop = g.childLNs[0].absY, railY = childTop - RAIL_UP;
        /* drop each line onto the CHILD's own card (absX is the centre of the
           child's whole couple group — personRel shifts to the child itself,
           so the line never lands between the child and their spouse) */
        const kx = g.childLNs.map((c) => c.absX + c.personRel + offX), minK = Math.min.apply(null, kx), maxK = Math.max.apply(null, kx);
        svgLine(svg, ax, u.absY + BAR_Y, ax, railY, color, 1.6);
        svgLine(svg, Math.min(ax, minK), railY, Math.max(ax, maxK), railY, color, 1.6);
        kx.forEach((x) => svgLine(svg, x, railY, x, childTop, color, 1.6));
      });
    });
    /* cross-links: a marriage to someone who lives elsewhere in the tree */
    const keyed = L.keyed || {};
    all.forEach((u) => (u.links || []).forEach((lk) => {
      const tgt = keyed[lk.ref]; if (!tgt) return;
      svgLinkLine(svg, u.absX + offX + lk.fromRel, u.absY + BAR_Y, tgt.absX + offX, tgt.absY + BAR_Y, LINK_COLORS[lk.rel] || "#8a2412");
    }));
  }

  /* The crest, name, words AND blurb are all printed at the top of the SAME
     surface that carries the trees, so when the reader zooms, the writing scales
     WITH the blood beneath it — one sheet of vellum, not a fixed caption floating
     over a diagram that moves without it. */
  function renderIntro(id) {
    const header = byId("tree-header");
    if (id === "all") {
      header.innerHTML =
        '<div class="tree-crest tree-crest-all">&#10022;</div>' +
        '<h1 class="tree-house-name" style="color:#7a4a1a">' + escapeHTML(COMBINED_TREE.title) + "</h1>" +
        '<div class="tree-house-words">One tree, many houses &mdash; each line in its own hue</div>' +
        '<p class="tree-blurb">' + escapeHTML(COMBINED_TREE.note) + "</p>";
      return;
    }
    const h = houseById[id]; if (!h) return;
    const col = colorFor(id);
    header.innerHTML =
      '<div class="tree-crest"><img src="' + h.sigil + '" alt="" draggable="false"/></div>' +
      '<h1 class="tree-house-name" style="color:' + col + '">' + escapeHTML(h.name) + "</h1>" +
      '<div class="tree-house-words">&ldquo;' + escapeHTML(h.words) + "&rdquo;</div>" +
      '<p class="tree-blurb">' + escapeHTML(h.blurb) + "</p>";
  }

  function renderHouseSection(h, bodyEl) {
    const col = colorFor(h.id);
    /* each segment heading ("Out of the Doom", "The Lions of the Dance"…) sits
       over ITS OWN tree, and scales with it as part of the one surface. */
    h.segments.forEach((seg) => {
      const wrap = document.createElement("div"); wrap.className = "tree-segment";
      if (seg.title) { const t = document.createElement("div"); t.className = "tree-segment-title"; t.style.color = col; t.textContent = seg.title; wrap.appendChild(t); }
      if (seg.note) { const nn = document.createElement("div"); nn.className = "tree-segment-note"; nn.textContent = seg.note; wrap.appendChild(nn); }
      wrap.appendChild(renderTree(seg.root, h.id));
      bodyEl.appendChild(wrap);
    });
  }

  /* ---------- show a house (or all) ---------- */
  function showHouse(id) {
    reg = []; nodeIndex = new Map(); hideCard();
    const surface = byId("tree-surface");
    const canvas = byId("trees-canvas"); canvas.innerHTML = "";
    byId("tree-header").innerHTML = "";
    state.house = id;

    const stage = byId("trees-stage");
    stage.dataset.house = id;
    renderIntro(id);

    if (id === "all") {
      canvas.appendChild(renderTree(COMBINED_TREE.root, "targaryen"));
      /* the in-law patriarchs whose kin sit beside the dragons */
      (typeof COMBINED_SIDE !== "undefined" ? COMBINED_SIDE : []).forEach((s) => {
        const seg = document.createElement("div"); seg.className = "tree-segment";
        canvas.appendChild(seg); seg.appendChild(renderTree(s.root, s.house));
      });
    } else {
      const h = houseById[id]; if (!h) return;
      renderHouseSection(h, canvas);
    }
    /* rows can only be sized once the cards are measurable in the DOM, and the
       cards measure true only while the surface is at natural scale (zoom:1) */
    surface.style.zoom = "1";
    canvas.querySelectorAll(".ftree-abs").forEach(finalizeTree);
    fitToView();
    /* mark the current house in the left rail and scroll it into view */
    const active = document.querySelector('#tree-rail-list .tree-pick[data-house="' + id + '"]');
    document.querySelectorAll("#tree-rail-list .tree-pick").forEach((b) => b.classList.toggle("active", b === active));
    if (active) active.scrollIntoView({ block: "nearest" });
    location.replace("#house=" + id);
  }

  function flipHouse(step) {
    const i = HOUSE_ORDER.indexOf(state.house);
    const j = Math.max(0, Math.min(HOUSE_ORDER.length - 1, i + step));
    if (j !== i) showHouse(HOUSE_ORDER[j]);
  }

  function fitToView() {
    const surface = byId("tree-surface"), stage = byId("trees-stage");
    /* measure the surface at its natural size, then scale the WHOLE sheet to
       the width of the parchment. A wide tree simply scrolls rather than
       shrinking into illegibility (floor 0.42). */
    surface.style.zoom = "1";
    const nw = surface.scrollWidth;
    const cw = stage.clientWidth - 8;
    let fit = Math.max(0.42, Math.min(1, cw / nw));
    state.fit = fit; applyZoom(fit);
    /* open at the head of the page — crest, name and words first — then the
       blood below. On a wide tree the reader pans right; the title is never
       scrolled out of sight the way a centred start would hide it. */
    stage.scrollTo({ left: 0, top: 0 });
  }

  /* ---------- character card ---------- */
  function nameLink(name, node) {
    const i = node && nodeIndex.has(node) ? nodeIndex.get(node) : -1;
    return i >= 0 ? '<span class="tc-link" data-goto="' + i + '">' + escapeHTML(name) + "</span>" : escapeHTML(name);
  }
  function selectNode(idx) {
    const entry = reg[idx]; if (!entry) return;
    document.querySelectorAll(".tn.selected").forEach((n) => n.classList.remove("selected"));
    entry.el.classList.add("selected");
    entry.el.scrollIntoView({ block: "center", inline: "center", behavior: "smooth" });
    renderCard(entry);
  }
  /* which saga's map & wiki a person belongs to — by their portrait's folder
     (got/ or hotd/), falling back to the house (Velaryon/Hightower are HotD). */
  function sagaOf(node, houseId) {
    const img = (node && node.img) || "";
    if (img.indexOf("hotd/") === 0) return "hotd";
    if (img.indexOf("got/") === 0) return "got";
    if (houseId === "velaryon" || houseId === "hightower") return "hotd";
    return "got";
  }
  function renderCard(entry) {
    const node = entry.node, e = effective(node), h = houseById[entry.houseId], col = colorFor(entry.houseId);
    const card = byId("tree-card");
    const fp = facePath(e.img);
    const portrait = fp
      ? '<div class="char-portrait"><img src="' + fp + '" alt="" style="border-color:' + col + '" onerror="this.parentNode.innerHTML=\'<div class=&quot;char-portrait-blank&quot;>' + initials(e.n) + '</div>\'"/></div>'
      : '<div class="char-portrait"><div class="char-portrait-blank">' + initials(e.n) + "</div></div>";
    const rows = [];
    if (node._spouseOf) {
      rows.push(kinRow("Wed to", nameLink(node._spouseOf.n, node._spouseOf)));
    } else {
      if (entry.parent) {
        let other = "";
        if (entry.parent.sp) { const os = entry.parent.sp.filter(shown); if (os.length) other = " &amp; " + escapeHTML(os[0].n); }
        rows.push(kinRow("Child of", nameLink(entry.parent.n, entry.parent) + other));
      }
      if (node.sp) {
        const vis = node.sp.filter(shown);
        if (vis.length) rows.push(kinRow("Wed to", vis.map((s) => (s.house && houseById[s.house]) ? '<span class="tc-link" data-house="' + s.house + '">' + escapeHTML(s.n) + "</span>" : escapeHTML(s.n)).join(' <span class="tc-sep">&amp;</span> ')));
      }
      const kids = (node.kids || []).filter(shown);
      if (kids.length) rows.push(kinRow(kids.length > 1 ? "Children" : "Child", kids.map((k) => nameLink(k.n, k)).join('<span class="tc-sep">, </span>')));
      if (entry.parent) {
        const sibs = (entry.parent.kids || []).filter((k) => k !== node && shown(k));
        if (sibs.length) rows.push(kinRow(sibs.length > 1 ? "Siblings" : "Sibling", sibs.map((k) => nameLink(k.n, k)).join('<span class="tc-sep">, </span>')));
      }
    }
    /* a short, non-spoiler telling of who they are, when we have one */
    const desc = node.bio || BIOS[e.n] || null;
    /* jump to this soul on the interactive map, or to their full wiki article */
    const saga = sagaOf(node, entry.houseId);
    const nm = encodeURIComponent(e.n);
    const mapHref = (saga === "hotd" ? "../hotd/index.html" : saga === "knight" ? "../knight/index.html" : "../map.html") + "#char=" + nm;
    const wikiHref = (saga === "hotd" ? "../hotd/wiki.html" : saga === "knight" ? "../knight/wiki.html" : "../wiki.html") + "#char=" + nm;
    card.style.borderTopColor = col;
    card.innerHTML =
      '<button class="char-card-close" id="tree-card-close" title="Close">&times;</button>' + portrait +
      '<div class="char-name" style="color:' + col + '">' + (e.king ? '<span class="tc-crown">&#9819;</span>' : "") + escapeHTML(e.n) + "</div>" +
      (e.t ? '<div class="tree-card-title">' + escapeHTML(e.t) + "</div>" : "") +
      '<div class="tc-house"><img src="' + h.sigil + '" alt=""/><div class="tc-house-text">' + escapeHTML(h.name) + "<i>&ldquo;" + escapeHTML(h.words) + "&rdquo;</i></div></div>" +
      (desc ? '<p class="tc-note">' + escapeHTML(desc) + "</p>" : (e.note && !node._spouseOf ? '<p class="tc-note tc-fate">' + escapeHTML(e.note) + "</p>" : "")) +
      (rows.length ? '<div class="tc-kin">' + rows.join("") + "</div>" : "") +
      '<div class="tc-actions">' +
        '<a class="tc-btn" href="' + mapHref + '">&#128506; Find them on the map</a>' +
        '<a class="tc-btn" href="' + wikiHref + '">&#128214; Read the full chronicle</a>' +
      '</div>';
    card.classList.remove("hidden");
    byId("tree-card-close").addEventListener("click", hideCard);
    card.querySelectorAll("[data-goto]").forEach((el) => el.addEventListener("click", () => selectNode(parseInt(el.dataset.goto, 10))));
    card.querySelectorAll("[data-house]").forEach((el) => el.addEventListener("click", () => showHouse(el.dataset.house)));
  }
  function kinRow(label, html) { return '<div class="tc-kin-row"><b>' + label + "</b><span>" + html + "</span></div>"; }
  function hideCard() { const c = byId("tree-card"); if (c) c.classList.add("hidden"); document.querySelectorAll(".tn.selected").forEach((n) => n.classList.remove("selected")); }

  /* ---------- the house rail down the left ---------- */
  function buildRail() {
    const list = byId("tree-rail-list");
    const mk = (id, name, words, sigil, extra) => {
      const b = document.createElement("button");
      b.className = "tree-pick" + (extra || ""); b.dataset.house = id;
      b.style.setProperty("--hc", colorFor(id));
      b.innerHTML = (sigil ? '<img src="' + sigil + '" alt="" draggable="false"/>' : '<span class="tree-pick-star">&#10022;</span>') +
        '<span class="tree-pick-text"><b>' + escapeHTML(name) + "</b><i>" + escapeHTML(words) + "</i></span>";
      b.addEventListener("click", () => { showHouse(id); closeRail(); });
      return b;
    };
    TREE_HOUSES.forEach((h) => list.appendChild(mk(h.id, h.name.replace("House ", ""), h.words, h.sigil, "")));
    /* on a narrow screen the rail slides in over the sheet from the topbar button */
    byId("tree-rail-toggle").addEventListener("click", () => byId("trees-layout").classList.toggle("rail-open"));
    byId("tree-progress-open").addEventListener("click", openGate);
    byId("tree-zoom-in").addEventListener("click", () => nudgeZoom(1.18));
    byId("tree-zoom-out").addEventListener("click", () => nudgeZoom(1 / 1.18));
    byId("tree-zoom-fit").addEventListener("click", () => { if (state.house) fitToView(); });
  }
  function closeRail() { byId("trees-layout").classList.remove("rail-open"); }
  /* the +/− buttons zoom about the centre of the visible sheet */
  function nudgeZoom(f) {
    const stage = byId("trees-stage");
    const fx = (stage.scrollLeft + stage.clientWidth / 2) / Math.max(1, stage.scrollWidth);
    const fy = (stage.scrollTop + stage.clientHeight / 2) / Math.max(1, stage.scrollHeight);
    applyZoom(state.zoom * f);
    stage.scrollLeft = fx * stage.scrollWidth - stage.clientWidth / 2;
    stage.scrollTop = fy * stage.scrollHeight - stage.clientHeight / 2;
    fadeHint();
  }

  function progressLabel() {
    const s = KWShield.get();
    if (s.gotS >= 8 && s.gotB >= 5) return "Everything &mdash; no spoilers hidden";
    const parts = [];
    if (s.gotS > 0) parts.push("Season " + s.gotS);
    if (s.gotB > 0) parts.push(BOOK_SHORT[s.gotB] || ("Book " + s.gotB));
    if (!parts.length) return "Nothing yet &mdash; everything late is hidden";
    return "Through " + parts.join(" &middot; ");
  }
  function updateProgressBox() {
    const lab = byId("tree-progress-label"); if (!lab) return;
    lab.innerHTML = progressLabel();
  }

  /* ---------- spoiler gate ---------- */
  function buildGate() {
    const g = document.createElement("div");
    g.className = "spoiler-gate hidden"; g.id = "spoiler-gate";
    g.innerHTML =
      '<div class="gate-card">' +
      '<div class="gate-kicker">Before you trace the blood</div>' +
      '<div class="gate-title">How far along are you?</div>' +
      '<p class="gate-note">These trees hide what you have not yet reached &mdash; the truth of Jon Snow&rsquo;s parents, the fates that become titles, and more. Set how far you have come in each telling; pick from both if you have watched <i>and</i> read. This is remembered across the whole site, so the games and the chronicle will hide the same things.</p>' +
      '<div class="gate-cols">' +
        '<div class="gate-col"><div class="gate-col-head">&#128250; The Show</div><div class="gate-chips" id="gate-show"></div></div>' +
        '<div class="gate-col"><div class="gate-col-head">&#128214; The Books</div><div class="gate-chips" id="gate-book"></div></div>' +
      "</div>" +
      '<button class="gate-all" id="gate-all" data-mode="all">I have finished the tale &mdash; show me everything</button>' +
      '<button class="gate-close" id="gate-close" title="Close">&times;</button></div>';
    document.body.appendChild(g);
    /* The two columns are now INDEPENDENT — the shield holds a season and a
       book at once, so a reader who has watched to S5 and read to ACOK can say
       exactly that instead of having to pick one and lose the other. Tapping
       a chip that is already chosen clears that telling back to nothing. */
    const showBox = g.querySelector("#gate-show");
    for (let s = 1; s <= 8; s++) showBox.appendChild(chip("S" + s, "show", s, () => setOne("gotS", s)));
    const bookBox = g.querySelector("#gate-book");
    for (let b = 1; b <= 5; b++) bookBox.appendChild(chip(BOOK_SHORT[b], "book", b, () => setOne("gotB", b)));
    g.querySelector("#gate-all").addEventListener("click", () => {
      KWShield.setAll(); afterShieldChange(); closeGate();
    });
    g.querySelector("#gate-close").addEventListener("click", () => { markAnswered(); closeGate(); });
  }
  function chip(label, mode, n, fn) { const b = document.createElement("button"); b.className = "gate-chip"; b.dataset.mode = mode; b.dataset.n = n; b.textContent = label; b.addEventListener("click", fn); return b; }

  function setOne(key, n) {
    const cur = KWShield.get()[key];
    const patch = {}; patch[key] = cur === n ? 0 : n;   /* tap again to unset */
    KWShield.set(patch);
    afterShieldChange();
  }
  /* a reader who closes the gate without choosing has still answered ("none of
     it"), so the gate does not ambush them again on the next visit */
  function markAnswered() { if (!KWShield.has()) KWShield.set({}); }

  function afterShieldChange() {
    paintGate();
    updateProgressBox();
    if (state.house) showHouse(state.house);
  }
  function paintGate() {
    const g = byId("spoiler-gate"); if (!g) return;
    const s = KWShield.get();
    g.querySelectorAll(".gate-chip.sel, .gate-all.sel").forEach((el) => el.classList.remove("sel"));
    const selShow = g.querySelector('.gate-chip[data-mode="show"][data-n="' + s.gotS + '"]');
    if (selShow) selShow.classList.add("sel");
    const selBook = g.querySelector('.gate-chip[data-mode="book"][data-n="' + s.gotB + '"]');
    if (selBook) selBook.classList.add("sel");
    if (s.gotS >= 8 && s.gotB >= 5) { const a = byId("gate-all"); if (a) a.classList.add("sel"); }
  }
  function openGate() { byId("spoiler-gate").classList.remove("hidden"); paintGate(); }
  function closeGate() { byId("spoiler-gate").classList.add("hidden"); }

  /* another page (or another tab) moved the shield — follow it */
  window.addEventListener("kw-shield", () => { updateProgressBox(); if (state.house) showHouse(state.house); });

  /* ---------- pan & zoom — window-level, NO pointer capture (so clicks work) ---------- */
  /* zoom the WHOLE surface (crest, words, blurb and trees together) so the page
     reads as one printed sheet — the writing never sits still while the tree
     moves under it. `zoom` (not transform) so the scroll area tracks the size. */
  function applyZoom(z) { state.zoom = Math.max(0.16, Math.min(1.8, z)); byId("tree-surface").style.zoom = String(state.zoom); }
  function initPanZoom() {
    const stage = byId("trees-stage");
    let down = false, sx = 0, sy = 0, l0 = 0, t0 = 0, moved = false, suppress = false;
    stage.addEventListener("pointerdown", (e) => {
      if (e.button !== 0 || e.target.closest(".tn-sp-chip")) return;
      down = true; moved = false; sx = e.clientX; sy = e.clientY; l0 = stage.scrollLeft; t0 = stage.scrollTop;
    });
    window.addEventListener("pointermove", (e) => {
      if (!down) return;
      if (!moved && Math.abs(e.clientX - sx) + Math.abs(e.clientY - sy) > 5) { moved = true; stage.classList.add("dragging"); }
      if (moved) { stage.scrollLeft = l0 - (e.clientX - sx); stage.scrollTop = t0 - (e.clientY - sy); e.preventDefault(); }
    }, { passive: false });
    window.addEventListener("pointerup", () => {
      if (!down) return;
      down = false; stage.classList.remove("dragging");
      if (moved) { suppress = true; setTimeout(() => (suppress = false), 30); }
    });
    // swallow the click that ends a drag, so panning never opens a card
    stage.addEventListener("click", (e) => { if (suppress) { e.stopPropagation(); e.preventDefault(); } }, true);
    stage.addEventListener("dragstart", (e) => e.preventDefault());
    stage.addEventListener("wheel", (e) => {
      e.preventDefault();
      const fx = (stage.scrollLeft + e.clientX) / Math.max(1, stage.scrollWidth);
      const fy = (stage.scrollTop + e.clientY) / Math.max(1, stage.scrollHeight);
      applyZoom(state.zoom * (e.deltaY < 0 ? 1.12 : 1 / 1.12));
      stage.scrollLeft = fx * stage.scrollWidth - e.clientX;
      stage.scrollTop = fy * stage.scrollHeight - e.clientY;
      fadeHint();
    }, { passive: false });
    let rt = null;
    window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(() => { if (state.house) fitToView(); }, 150); });
  }
  function fadeHint() { const h = byId("tree-hint"); if (h) h.classList.add("gone"); }

  /* ---------- site switcher ---------- */
  function initSwitcher() {
    const sw = byId("site-switcher"), btn = byId("site-switcher-btn"), dd = byId("site-dropdown");
    btn.addEventListener("click", (e) => { e.stopPropagation(); const open = !sw.classList.contains("open"); sw.classList.toggle("open", open); btn.setAttribute("aria-expanded", open ? "true" : "false"); });
    dd.querySelectorAll("[data-site]").forEach((b) => {
      b.addEventListener("click", (e) => { e.stopPropagation(); const s = b.dataset.site;
        if (s === "home") location.href = "../index.html";
        else if (s === "asoiaf") location.href = "../map.html";
        else if (s === "hotd") location.href = "../hotd/index.html";
        else if (s === "knight") location.href = "../knight/index.html";
        else if (s === "wordle") location.href = "../map.html#wordle=1";
        else if (s === "quiz") location.href = "../quiz/index.html"; });
    });
    document.addEventListener("click", (e) => { if (!sw.contains(e.target)) { sw.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); } });
  }

  function escapeHTML(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  function buildLegend() {
    const g = document.createElement("div");
    g.className = "m-legend";
    g.innerHTML = '<div class="m-legend-title">The Marriage Lines</div>' +
      '<div><span class="ml-swatch" style="background:#6a5236"></span> wed</div>' +
      '<div><span class="ml-swatch" style="background:#b02a2a"></span> wed &mdash; siblings</div>' +
      '<div><span class="ml-swatch" style="background:#cf7a1a"></span> wed &mdash; cousins</div>' +
      '<div><span class="ml-swatch" style="background:#c99a1a"></span> wed &mdash; uncle &amp; niece</div>' +
      '<div><span class="ml-dash"></span> a bastard line</div>';
    /* live inside the parchment, above the foot, rather than floating over the
       whole window where it covered the page-count */
    (byId("tree-parchment") || document.body).appendChild(g);
  }

  function buildWatermark() {
    const stage = byId("trees-stage");
    const wm = document.createElement("div"); wm.id = "tree-watermark"; wm.className = "tree-watermark";
    stage.insertBefore(wm, stage.firstChild);
  }

  /* ---------- init ---------- */
  buildRail(); buildGate(); buildLegend(); initPanZoom();
  /* step house to house with the arrow keys, as one would turn a page */
  window.addEventListener("keydown", (e) => {
    if (byId("spoiler-gate") && !byId("spoiler-gate").classList.contains("hidden")) { if (e.key === "Escape") closeGate(); return; }
    if (byId("trees-layout").classList.contains("rail-open") && e.key === "Escape") { closeRail(); return; }
    if (e.target && /^(INPUT|TEXTAREA)$/.test(e.target.tagName)) return;
    if (e.key === "ArrowLeft") flipHouse(-1);
    else if (e.key === "ArrowRight") flipHouse(1);
  });
  const hp = new URLSearchParams(location.hash.slice(1));
  /* The deep-link forms still work and now write to the shared shield, so a
     link that says "#season=5" sets the reader's place for the whole site.
     With nothing in the link, the gate is shown only to someone who has never
     answered anywhere — a shield set in the games or the timeline counts. */
  let gated = false;
  if (hp.get("spoil") === "all") KWShield.setAll();
  else if (hp.get("season")) KWShield.set({ gotS: parseInt(hp.get("season"), 10) || 0 });
  else if (hp.get("book")) KWShield.set({ gotB: parseInt(hp.get("book"), 10) || 0 });
  else if (!KWShield.has()) gated = true;
  updateProgressBox();
  showHouse(houseById[hp.get("house")] ? hp.get("house") : "targaryen");
  if (hp.get("sel")) selectNode(parseInt(hp.get("sel"), 10));
  if (hp.get("who")) { const want = hp.get("who").toLowerCase(); for (let i = 0; i < reg.length; i++) { if (effective(reg[i].node).n.toLowerCase() === want) { selectNode(i); break; } } }
  if (gated) openGate();
  setTimeout(fadeHint, 6000);
})();
