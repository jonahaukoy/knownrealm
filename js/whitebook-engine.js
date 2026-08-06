/* ============================================================================
   THE WHITE BOOK — engine.

   The Book of the Brothers as a real book: a cover, a contents spread listing
   every Sworn Brother, then the folios themselves — two pages open at a time,
   the way a book is read.

   THE PAGE IS A FIXED SIZE. That is the whole point of this rewrite: a knight's
   entry no longer stretches its page, so the turning arrows never move. Text is
   measured and flowed into pages of a set height, and a brother whose deeds run
   long simply takes a second leaf, as he would in the real book. A page that
   ends half-written is left half-written — that is what a hand-kept register
   looks like.

   Data comes from js/whitebook/*.js, each of which does:
     (window.WHITE_BOOK = window.WHITE_BOOK || []).push({ … });
   and the load order in whitebook.html IS the order of the book.

   Entry shape:
     { id, name, house, epithet, era, arms, armsGlyph, blazon,
       served: ["Aegon I", …], lordCommander: true|false, raised, note,
       entry: ["paragraph", …], fate: ["paragraph", …], wiki: "wiki.html#char=…" }

   `fate` renders only inside the always-present fold at the foot of a brother's
   last page, so the fold's existence never betrays whether an ending waits.
   ========================================================================== */
(function () {
  "use strict";

  const BOOK = (typeof WHITE_BOOK !== "undefined" && WHITE_BOOK) || [];
  const stage = document.getElementById("wb-book");
  const btnPrev = document.getElementById("wb-prev");
  const btnNext = document.getElementById("wb-next");
  const footline = document.getElementById("wb-footline");
  if (!stage) return;

  const byId = {};
  BOOK.forEach((k, i) => { byId[k.id] = i; });

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  /* ---------------------------------------------------------------- state */
  let pages = [];        // the paginated stream of leaves
  let spread = 0;        // which pair of pages is open; -1 is the closed cover
  let query = "";
  let turning = false;

  /* =========================================================== THE COVER == */
  function coverHTML() {
    return `
      <div class="wb-cover">
        <img class="wb-cover-img" src="assets/whitebook/cover.webp" alt="The Book of the Brothers" />
        <div class="wb-cover-plate">
          <h1 class="wb-cover-title">The Book of the Brothers</h1>
          <p class="wb-cover-sub">Wherein are set down the names and the deeds of every knight
            sworn to the Kingsguard, from Aegon&rsquo;s Conquest to this day.</p>
          <button class="wb-cover-open" id="wb-open">Open the book &rarr;</button>
        </div>
      </div>`;
  }

  /* ==================================================== BUILDING THE PAGES =
     Each brother's entry is cut into blocks that must not be split across a
     page break — the heading with his arms, each paragraph, the register of
     his service, the fold, the links. The measurer then fills one leaf at a
     time until the next block would overflow, and starts a fresh leaf. */

  function armsHTML(k) {
    const inner = k.arms
      ? `<img src="${esc(k.arms)}" alt="" loading="lazy" />`
      : `<span class="wb-arms-glyph">${k.armsGlyph || "&#9876;"}</span>`;
    return `
      <div class="wb-arms">
        <div class="wb-arms-shield">${inner}</div>
        ${k.blazon ? `<div class="wb-arms-blazon">${esc(k.blazon)}</div>` : ""}
      </div>`;
  }

  function headBlock(k) {
    return `
      <div class="wb-head">
        ${armsHTML(k)}
        <h2 class="wb-knight-name">${esc(k.name)}</h2>
        ${k.house ? `<div class="wb-knight-of">of ${esc(k.house)}</div>` : ""}
        ${k.epithet ? `<div class="wb-knight-epithet">${esc(k.epithet)}</div>` : ""}
        <div class="wb-rule"></div>
      </div>`;
  }

  function contBlock(k) {
    return `<div class="wb-cont">${esc(k.name)}, continued</div><div class="wb-rule"></div>`;
  }

  function servedBlock(k) {
    if (!(k.served || []).length) return "";
    return `<div class="wb-served">
        <span><b>Served</b>${esc(k.served.join(" · "))}</span>
        ${k.lordCommander ? `<span><b>Lord Commander</b>of the Kingsguard</span>` : ""}
        ${k.raised ? `<span><b>Raised</b>${esc(k.raised)}</span>` : ""}
      </div>`;
  }

  function foldBlock(k) {
    const inner = (k.fate && k.fate.length)
      ? k.fate.map((p) => `<p>${p}</p>`).join("")
      : `<p>Here the Book leaves room, as it does for every brother whose last
           line is not yet written.</p>`;
    /* a button rather than <details>: the fold opens in a popover OVER the book
       (see openFold), so a fold sitting at the foot of a page is never clipped by
       the fixed-height leaf it lives on. */
    return `<div class="wb-fold">
        <button type="button" class="wb-fold-btn">The last lines, written after &mdash; spoilers</button>
        <div class="wb-fold-src" hidden>${inner}</div>
      </div>`;
  }

  function linksBlock(k) {
    return `<div class="wb-links">
        <a class="wb-link" href="#contents">&larr; The roll of brothers</a>
        ${k.wiki ? `<a class="wb-link" href="${esc(k.wiki)}">Read the full account &rarr;</a>` : ""}
      </div>`;
  }

  function knightBlocks(k) {
    const out = [headBlock(k)];
    (k.entry || []).forEach((p) => out.push(`<p class="wb-p">${p}</p>`));
    const served = servedBlock(k);
    if (served) out.push(served);
    out.push(foldBlock(k));
    out.push(linksBlock(k));
    return out;
  }

  /* ---- the contents: every brother, grouped by reign, with leader dots ---- */
  function contentsBlocks() {
    const q = query.trim().toLowerCase();
    const hits = BOOK.map((k, i) => ({ k, i })).filter(({ k }) => {
      if (!q) return true;
      return [k.name, k.epithet, k.era, k.house, k.note, (k.served || []).join(" ")]
        .join(" ").toLowerCase().indexOf(q) >= 0;
    });

    const out = [`<h2 class="wb-contents-title">Contents</h2>
      <div class="wb-contents-rule"></div>
      <p class="wb-contents-note">Every knight whose name the Book has kept, in the order the White
        Sword Tower set them down. Seven serve at a time; the ink outlasts them all.</p>
      <input class="wb-search" id="wb-search" type="search" autocomplete="off"
             placeholder="Search a name, a king, an age&hellip;" value="${esc(query)}" />`];

    let era = null;
    hits.forEach(({ k, i }) => {
      if (k.era !== era) { era = k.era; out.push(`<div class="wb-era">${esc(era)}</div>`); }
      const note = k.lordCommander ? "Lord Commander" : (k.note || (k.served || [])[0] || "");
      out.push(`<a class="wb-toc" href="#kg=${encodeURIComponent(k.id)}">
          <span class="wb-toc-name">${esc(k.name)}</span>
          <span class="wb-toc-dots"></span>
          <span class="wb-toc-note">${esc(note)}</span>
        </a>`);
    });
    if (!hits.length) out.push(`<div class="wb-empty">No brother of that name is written here.</div>`);
    return out;
  }

  /* ================= how many leaves stand on one turn =================
     A two-page spread needs the width for two columns of type. A phone has
     room for one, so below 700px the book turns a single leaf at a time — the
     way anybody reads a real book in one hand.

     PER is read once and then used EVERYWHERE the code used to say 2. It is
     re-read whenever the width crosses the boundary, and the book is recut,
     because a page that fitted beside another does not fit alone. */
  const NARROW = window.matchMedia ? window.matchMedia("(max-width: 700px)") : null;
  function leavesPerTurn() { return NARROW && NARROW.matches ? 1 : 2; }
  let PER = leavesPerTurn();
  function turns() { return Math.ceil(pages.length / PER); }

  /* ---- the measurer: fills fixed-height leaves, block by block ---- */
  function paginate() {
    const keep = stage.innerHTML;
    const keepCls = stage.className;
    stage.className = "wb-book wb-open";
    stage.innerHTML = `<div class="wb-spread"><div class="wb-leaf wb-measure"></div></div>`;
    const probe = stage.querySelector(".wb-measure");
    /* narrow screens let the leaves stack and grow, so there is no fixed height
       to measure — fall back to a sensible leaf so the flow still breaks */
    const capacity = probe.clientHeight > 220 ? probe.clientHeight : 780;

    const built = [];
    function flow(blocks, meta) {
      let cur = [], first = true;
      probe.innerHTML = "";
      for (let n = 0; n < blocks.length; n++) {
        probe.insertAdjacentHTML("beforeend", blocks[n]);
        if (probe.scrollHeight > capacity && cur.length) {
          built.push(Object.assign({ html: cur.join(""), first: first }, meta));
          first = false;
          cur = [];
          probe.innerHTML = "";
          /* the continued leaf reopens with the brother's name */
          if (meta.k) { probe.insertAdjacentHTML("beforeend", contBlock(meta.k)); cur.push(contBlock(meta.k)); }
          probe.insertAdjacentHTML("beforeend", blocks[n]);
        }
        cur.push(blocks[n]);
      }
      built.push(Object.assign({ html: cur.join(""), first: first }, meta));
      probe.innerHTML = "";
    }

    flow(contentsBlocks(), { kind: "contents" });
    /* the contents end on an even count so a brother opens a fresh spread —
       but only when there IS a spread. Turning one leaf at a time, a blank
       filler page is just a blank page the reader has to turn past. */
    if (PER > 1 && built.length % PER) built.push({ kind: "contents", html: "", blank: true });

    BOOK.forEach((k, i) => flow(knightBlocks(k), { kind: "knight", k: k, index: i }));
    if (PER > 1 && built.length % PER) built.push({ kind: "end", html: "", blank: true });

    stage.innerHTML = keep;
    stage.className = keepCls;
    pages = built;
    pages.forEach((p, n) => { p.n = n; });
  }

  function spreadOfKnight(id) {
    const n = pages.findIndex((p) => p.kind === "knight" && p.k && p.k.id === id && p.first);
    return n < 0 ? 0 : Math.floor(n / PER);
  }

  /* ================================================== RENDERING A SPREAD == */
  /* the paper ages backwards: the oldest leaves are the most used */
  function paperFor(i, total) {
    const t = total <= 1 ? 0 : i / (total - 1);
    return t < 0.34 ? "worn" : t < 0.67 ? "used" : "fresh";
  }

  function leafHTML(page, side) {
    if (!page) return `<div class="wb-leaf wb-leaf-${side} wb-leaf-blank"></div>`;
    const cls = page.kind === "contents" ? " wb-leaf-contents" : "";
    return `<div class="wb-leaf wb-leaf-${side}${cls}">
        <div class="wb-leaf-inner">${page.html || ""}</div>
        ${page.blank ? "" : `<span class="wb-folio">${page.n + 1}</span>`}
      </div>`;
  }

  function render(quiet) {
    if (spread < 0) {
      stage.className = "wb-book";
      stage.innerHTML = coverHTML();
      const open = document.getElementById("wb-open");
      if (open) open.addEventListener("click", () => go(0));
    } else {
      const total = turns();
      const left = pages[spread * PER], right = PER > 1 ? pages[spread * PER + 1] : null;
      stage.className = "wb-book wb-open wb-paper-" + paperFor(spread, total) +
        (PER === 1 ? " wb-single" : "");
      stage.innerHTML = `
        <div class="wb-spread">
          ${leafHTML(left, "l")}
          ${PER > 1 ? leafHTML(right, "r") : ""}
          ${PER > 1 ? '<div class="wb-gutter"></div>' : ""}
        </div>`;
      wireSearch();
    }

    btnPrev.disabled = spread <= -1;
    btnNext.disabled = spread >= turns() - 1;

    if (!quiet) {
      stage.classList.remove("wb-arriving");
      void stage.offsetWidth;
      stage.classList.add("wb-arriving");
    }
    paintFoot();
    if (!quiet) window.scrollTo({ top: 0, behavior: spread < 0 ? "auto" : "smooth" });
  }

  function paintFoot() {
    if (!footline) return;
    if (spread < 0) {
      footline.innerHTML = `The book is closed. Open it with the arrows, or press <kbd>&rarr;</kbd>.`;
      return;
    }
    const total = turns();
    const left = pages[spread * PER];
    const who = left && left.kind === "knight" && left.k ? esc(left.k.name)
      : left && left.kind === "contents" ? "the roll of brothers" : "";
    footline.innerHTML = `${PER === 1 ? "Page" : "Spread"} <b>${spread + 1}</b> of ${total}` +
      (who ? ` &mdash; ${who}` : "") +
      ` &middot; turn with <kbd>&larr;</kbd> <kbd>&rarr;</kbd>, or return to ` +
      `<a href="#contents" style="color:var(--gold-dim)">the contents</a>.`;
  }

  /* the search box is part of the contents page, so it is measured with it */
  function wireSearch() {
    const s = document.getElementById("wb-search");
    if (!s) return;
    s.addEventListener("input", () => {
      const at = s.selectionStart;
      query = s.value;
      paginate();
      spread = 0;
      render(true);
      const again = document.getElementById("wb-search");
      if (again) { again.focus(); try { again.setSelectionRange(at, at); } catch (e) {} }
    });
  }

  /* ==================================================== TURNING THE LEAF == */
  let suppress = false;
  function setHash() {
    let h = "#cover";
    if (spread >= 0) {
      const left = pages[spread * PER], right = PER > 1 ? pages[spread * PER + 1] : null;
      const k = (left && left.k) || (right && right.k);
      h = k ? "#kg=" + encodeURIComponent(k.id) : "#contents";
    }
    if (location.hash !== h) { suppress = true; location.hash = h; }
  }

  function go(next) {
    const last = turns() - 1;
    next = Math.max(-1, Math.min(last, next));
    if (next === spread || turning) return;
    const forward = next > spread;
    turning = true;
    stage.classList.add(forward ? "wb-turning-next" : "wb-turning-prev");
    setTimeout(() => {
      spread = next;
      turning = false;
      stage.classList.remove("wb-turning-next", "wb-turning-prev");
      render();
      setHash();
    }, 200);
  }

  function fromHash() {
    const h = (location.hash || "").replace(/^#/, "");
    if (!h || h === "cover") return -1;
    if (h === "contents" || h === "roster") return 0;
    const m = /^kg=(.+)$/.exec(h);
    if (m) {
      const id = decodeURIComponent(m[1]);
      return id in byId ? spreadOfKnight(id) : 0;
    }
    return -1;
  }

  window.addEventListener("hashchange", () => {
    if (suppress) { suppress = false; return; }
    const want = fromHash();
    if (want !== spread) { spread = want; render(); }
  });

  /* ---- the spoiler "last lines" popover (opens over the book, never clipped) ---- */
  let foldModal = null;
  function closeFold() { if (foldModal) { foldModal.remove(); foldModal = null; } }
  function openFold(html) {
    closeFold();
    foldModal = document.createElement("div");
    foldModal.className = "wb-fold-modal";
    foldModal.innerHTML =
      `<div class="wb-fold-panel" role="dialog" aria-label="The last lines — spoilers">
         <button type="button" class="wb-fold-close" aria-label="Close">&times;</button>
         <div class="wb-fold-kicker">&#10013; The last lines, written after &mdash; spoilers</div>
         <div class="wb-fold-body">${html}</div>
       </div>`;
    document.body.appendChild(foldModal);
    requestAnimationFrame(() => foldModal.classList.add("open"));
  }
  document.addEventListener("click", (e) => {
    const btn = e.target.closest && e.target.closest(".wb-fold-btn");
    if (btn) { const src = btn.parentNode.querySelector(".wb-fold-src"); openFold(src ? src.innerHTML : ""); return; }
    if (foldModal && e.target.closest && (e.target.closest(".wb-fold-close") || e.target === foldModal)) closeFold();
  });

  document.addEventListener("keydown", (e) => {
    const t = e.target;
    if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
    if (e.key === "Escape" && foldModal) { closeFold(); return; }
    if (foldModal) return;   /* don't turn pages behind an open popover */
    if (e.key === "ArrowRight") { e.preventDefault(); go(spread + 1); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); go(spread - 1); }
    else if (e.key === "Home") { e.preventDefault(); go(0); }
  });

  btnPrev.addEventListener("click", () => go(spread - 1));
  btnNext.addEventListener("click", () => go(spread + 1));

  /* Recut the whole book and stay on the reader's page. */
  function recut() {
    const here = spread;
    const keep = spread >= 0 && pages[spread * PER] && pages[spread * PER].k
      ? pages[spread * PER].k.id : null;
    PER = leavesPerTurn();          /* the width may have crossed the boundary */
    paginate();
    spread = keep ? spreadOfKnight(keep)
      : Math.max(-1, Math.min(here, turns() - 1));
    render(true);
  }

  /* the leaf size is responsive, so the flow has to be recut when it changes */
  let resizeTimer = null, lastWidth = 0;
  window.addEventListener("resize", () => {
    /* a 40px twitch is a phone's address bar, not a new layout — but crossing
       the one-leaf boundary IS, however small the step that crossed it */
    if (Math.abs(window.innerWidth - lastWidth) < 40 && leavesPerTurn() === PER) return;
    lastWidth = window.innerWidth;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(recut, 180);
  });
  /* turning a phone sideways changes how many leaves fit; recut for that too */
  if (NARROW) {
    const onBoundary = () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(recut, 60); };
    if (NARROW.addEventListener) NARROW.addEventListener("change", onBoundary);
    else if (NARROW.addListener) NARROW.addListener(onBoundary);
  }

  lastWidth = window.innerWidth;
  stage.classList.add("wb-open");   /* the measurer needs the open geometry */
  paginate();
  spread = fromHash();
  render(true);

  /* The first cut is made in whatever face the browser has to hand. Cinzel and
     EB Garamond arrive over the network a moment later and are wider, which
     pushed several lines off the contents page — so the book is cut again once
     the real fonts are in. Without this the error is invisible on a page of
     prose and glaring on a page of thirty tight rows. */
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => { recut(); });
  } else {
    window.addEventListener("load", () => setTimeout(recut, 60));
  }
})();
