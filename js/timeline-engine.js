/* THE TIMELINE — the whole chronology as one scrubbable line.
   Reads window.TIMELINE / window.TIMELINE_ERAS and shares the spoiler shield
   (localStorage "tvShield") with Trivia and Who Said It, so a reader sets how far
   they have come once and every game and page on the site respects it. */

(function () {
  const $ = (id) => document.getElementById(id);
  const ERAS = window.TIMELINE_ERAS || [];
  const ALL = window.TIMELINE || [];
  const eraById = {};
  ERAS.forEach((e) => (eraById[e.id] = e));

  /* ---------------- the spoiler shield ---------------- */
  const SHIELD_MAX = { gotS: 8, gotB: 5, hotdS: 2, hotdB: 1, knightS: 1, knightB: 3 };
  const SAGAS = [
    { key: "got", label: "Game of Thrones", s: "gotS", b: "gotB", sLabel: "Season", bLabel: "Book" },
    { key: "hotd", label: "House of the Dragon", s: "hotdS", b: "hotdB", sLabel: "Season", bLabel: "Fire & Blood" },
    { key: "knight", label: "A Knight of the Seven Kingdoms", s: "knightS", b: "knightB", sLabel: "Season", bLabel: "Tale" },
  ];
  let shield = { gotS: 0, gotB: 0, hotdS: 0, hotdB: 0, knightS: 0, knightB: 0 };
  let hasShield = false;
  try {
    const raw = localStorage.getItem("tvShield");
    if (raw) {
      hasShield = true;
      const saved = JSON.parse(raw);
      Object.keys(shield).forEach((k) => { if (typeof saved[k] === "number") shield[k] = saved[k]; });
    }
  } catch (e) { /* a fresh shield */ }
  function saveShield() { try { localStorage.setItem("tvShield", JSON.stringify(shield)); } catch (e) {} }

  /* Lore older than any of the tellings is always safe; anything anchored to a
     season or a book waits until the reader has come that far in either telling. */
  function allowed(ev) {
    if (ev.saga === "lore") return true;
    if (ev.s == null && ev.b == null) return true;
    const S = shield[ev.saga + "S"] || 0, B = shield[ev.saga + "B"] || 0;
    if (ev.s != null && S >= ev.s) return true;
    if (ev.b != null && B >= ev.b) return true;
    return false;
  }

  /* ---------------- state ----------------
     selectedEra is the "chapter" the reader is in: the era cards choose it, the
     chronicle list shows only its moments (so the list is always short and needs
     no scrollbar of its own), and stepping across an era boundary follows along. */
  let events = [], idx = 0, selectedEra = null;

  function esc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  /* ---------------- the gate ---------------- */
  /* ---------------- art ---------------- */
  const ERA_ART = window.TIMELINE_ERA_ART || {};
  const ART = window.TIMELINE_ART || {};
  function artFor(e) { return (e && (ART[e.id] || ERA_ART[e.era])) || null; }
  function eraArt(id) { return ERA_ART[id] || null; }

  function renderGate() {
    $("tl-gate-controls").innerHTML = SAGAS.map((sg) => `
      <div class="tl-gate-row">
        <div class="tl-gate-saga">${esc(sg.label)}</div>
        <label>${esc(sg.sLabel)}
          <select data-k="${sg.s}">${range(SHIELD_MAX[sg.s], shield[sg.s], "none")}</select>
        </label>
        <label>${esc(sg.bLabel)}
          <select data-k="${sg.b}">${range(SHIELD_MAX[sg.b], shield[sg.b], "none")}</select>
        </label>
      </div>`).join("");
    $("tl-gate-controls").querySelectorAll("select").forEach((sel) => {
      sel.addEventListener("change", () => {
        shield[sel.dataset.k] = parseInt(sel.value, 10) || 0;
        updateGateCount();
      });
    });
    updateGateCount();
  }
  function range(max, cur, zeroLabel) {
    let out = `<option value="0"${cur === 0 ? " selected" : ""}>${zeroLabel}</option>`;
    for (let i = 1; i <= max; i++) out += `<option value="${i}"${cur === i ? " selected" : ""}>${i}</option>`;
    return out;
  }
  function updateGateCount() {
    const n = ALL.filter(allowed).length;
    $("tl-gate-count").textContent = `${n} of ${ALL.length} moments would be open to you.`;
  }
  function openGate() { $("tl-gate").classList.add("open"); renderGate(); }
  function closeGate() { $("tl-gate").classList.remove("open"); }

  /* ---------------- rendering ---------------- */
  function rebuild(keepId) {
    const wantId = keepId || (events[idx] && events[idx].id);
    events = ALL.filter(allowed);
    const found = events.findIndex((e) => e.id === wantId);
    idx = found >= 0 ? found : 0;
    if (!events.length) {
      $("tl-focus").innerHTML = `<div class="tl-none">Your shield bars every moment. Lower it to begin.</div>`;
      $("tl-stream").innerHTML = "";
      $("tl-eras").innerHTML = "";
      $("tl-hidden").textContent = "";
      return;
    }
    selectedEra = events[idx] ? events[idx].era : (events[0] && events[0].era);
    $("tl-scrub").min = 0;
    $("tl-scrub").max = String(events.length - 1);
    renderEras();
    renderStream();
    goTo(idx, false);
    /* the second picture: the last age the reader has been let into */
    const foot = $("tl-footart");
    if (foot) {
      const lastEra = events[events.length - 1].era;
      const a = eraArt(lastEra);
      const er = eraById[lastEra] || { name: "" };
      foot.innerHTML = a
        ? `<img src="${esc(a)}" alt="" loading="lazy"/>
           <span class="tl-footart-cap">${esc(er.name)} &mdash; as far as your shield allows</span>`
        : "";
    }
    const hidden = ALL.length - events.length;
    $("tl-hidden").innerHTML = hidden
      ? `${hidden} later moment${hidden === 1 ? " is" : "s are"} still barred by your spoiler shield.`
      : `Every moment in the chronicle is open to you.`;
  }

  /* the era cards are the chapter selector: one per age the reader has reached,
     the current one lit. Picking one opens that chapter at its first moment. */
  function renderEras() {
    const live = {}, firstIdx = {};
    events.forEach((e, i) => { live[e.era] = true; if (firstIdx[e.era] == null) firstIdx[e.era] = i; });
    $("tl-eras").innerHTML = ERAS.filter((er) => live[er.id]).map((er) => {
      const art = eraArt(er.id);
      const n = events.filter((e) => e.era === er.id).length;
      return `<button class="tl-era${er.id === selectedEra ? " active" : ""}" data-era="${er.id}" title="${esc(er.note)}">
        <span class="tl-era-art">${art ? `<img src="${esc(art)}" alt="" loading="lazy"/>` : ""}</span>
        <span class="tl-era-name">${esc(er.name)}</span>
        <span class="tl-era-count">${n} moment${n === 1 ? "" : "s"}</span>
      </button>`;
    }).join("");
    $("tl-eras").querySelectorAll(".tl-era").forEach((b) => {
      b.addEventListener("click", () => {
        const i = firstIdx[b.dataset.era];
        if (i != null) goTo(i);
      });
    });
  }

  /* the chronicle shows ONLY the selected era's moments — always a handful, so
     it flows with the page and needs no scrollbar of its own */
  function renderStream() {
    const er = eraById[selectedEra] || { name: selectedEra || "", note: "" };
    let html = `<div class="tl-stream-head"><b>${esc(er.name)}</b><i>${esc(er.note)}</i>` +
      `<a class="tl-era-wiki" href="wiki.html#era=${esc(selectedEra)}">Read the full history of this age &rarr;</a></div>`;
    events.forEach((e, i) => {
      if (e.era !== selectedEra) return;
      const art = artFor(e);
      html += `<button class="tl-item" data-i="${i}" id="tl-item-${i}">
          <span class="tl-item-thumb">${art ? `<img src="${esc(art)}" alt="" loading="lazy"/>` : ""}</span>
          <span class="tl-item-text">
            <span class="tl-item-when">${esc(e.when)}</span>
            <span class="tl-item-title">${esc(e.title)}</span>
          </span>
          <span class="tl-item-go">&rarr;</span>
        </button>`;
    });
    $("tl-stream").innerHTML = html;
    $("tl-stream").querySelectorAll(".tl-item").forEach((b) => {
      b.addEventListener("click", () => { goTo(parseInt(b.dataset.i, 10)); });
    });
  }

  function tellingBadges(e) {
    const out = [];
    if (e.show) out.push(`<span class="tl-badge tl-badge-show">&#127909; ${esc(e.show)}</span>`);
    if (e.book) out.push(`<span class="tl-badge tl-badge-book">&#128214; ${esc(e.book)}</span>`);
    if (!out.length) out.push(`<span class="tl-badge tl-badge-lore">&#9733; Before the tellings</span>`);
    return out.join("");
  }

  /* doScroll is false on the very first render — otherwise bringing the current
     stream row into view drags the whole page down past the header on load. */
  function goTo(i, doScroll) {
    if (!events.length) return;
    idx = Math.max(0, Math.min(i, events.length - 1));
    const e = events[idx];
    const er = eraById[e.era] || { name: e.era };
    /* the bar sweeps the whole chronicle; keep the thumb and its fill in step */
    const scrub = $("tl-scrub");
    if (scrub) {
      scrub.value = String(idx);
      const pct = events.length > 1 ? (idx / (events.length - 1)) * 100 : 0;
      scrub.style.setProperty("--p", pct.toFixed(1) + "%");
    }
    /* stepping across an era boundary turns the page to the new chapter */
    if (e.era !== selectedEra) { selectedEra = e.era; renderEras(); renderStream(); }
    const art = artFor(e);
    $("tl-focus").innerHTML = `
      ${art ? `<div class="tl-focus-art"><img src="${esc(art)}" alt="" /></div>` : ""}
      <div class="tl-focus-body">
        <div class="tl-focus-era">${esc(er.name)}</div>
        <div class="tl-focus-when">${esc(e.when)}</div>
        <h2 class="tl-focus-title">${esc(e.title)}</h2>
        <div class="tl-badges">${tellingBadges(e)}</div>
        <p class="tl-focus-text">${esc(e.text)}</p>
        ${e.wiki ? `<a class="tl-focus-link" href="${esc(e.wiki)}">Read further in the chronicle &rarr;</a>` : ""}
        <div class="tl-focus-pos">${idx + 1} of ${events.length}</div>
      </div>`;
    const hero = $("tl-hero-art");
    if (hero && art) hero.innerHTML = `<img src="${esc(art)}" alt="" />`;
    $("tl-stream").querySelectorAll(".tl-item").forEach((b, n) => b.classList.toggle("cur", n === idx));
    /* bring the READER into view when the reader isn't already on screen — so a
       click far down the list, or a step across a chapter, shows the moment it
       opened rather than leaving it above the fold */
    if (doScroll !== false) {
      const f = $("tl-focus");
      if (f) f.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }

  /* The chronicle used to walk itself on a timer. It no longer does — a reader
     moves at their own pace, with the arrows, the scrubber or the stream. */

  /* ---------------- wiring ---------------- */
  $("tl-scrub").addEventListener("input", (e) => { goTo(parseInt(e.target.value, 10)); });
  $("tl-shield").addEventListener("click", openGate);
  $("tl-gate-close").addEventListener("click", () => { closeGate(); });
  $("tl-gate-save").addEventListener("click", () => {
    saveShield(); hasShield = true; closeGate(); rebuild();
  });
  $("tl-gate-all").addEventListener("click", () => {
    Object.keys(SHIELD_MAX).forEach((k) => (shield[k] = SHIELD_MAX[k]));
    saveShield(); hasShield = true; closeGate(); rebuild();
  });
  document.addEventListener("keydown", (e) => {
    const t = e.target;
    if (t && (t.tagName === "INPUT" || t.tagName === "SELECT" || t.tagName === "TEXTAREA")) return;
    if (document.querySelector(".gs-overlay.open")) return; /* the search owns the keys */
    if (e.key === "ArrowRight") { goTo(idx + 1); }
    else if (e.key === "ArrowLeft") { goTo(idx - 1); }
  });

  /* first visit: ask how far they have come before showing anything spoilable */
  rebuild();
  if (!hasShield) openGate();
})();
