/* SIGIL MATCH — engine.
   Pool: sigils-data.js fills window.SIGILS = [{ id, name, img, words?, d: 1|3, desc }].
   No saga picker, no spoiler shield — heraldry isn't plot. A round is 10 questions;
   each one is either "which house does this banner belong to" (image shown, names to pick)
   or "which banner belongs to this house" (name shown, images to pick), chosen at random. */

(function () {
  const $ = (id) => document.getElementById(id);
  const POOL = window.SIGILS || [];
  const ROUND_LEN = 10;
  const HALLS = 10;
  const shell = document.getElementById("sm-shell");
  const HALL_DIR = (shell && shell.dataset.art) || "assets/";

  /* ---------------- the wall ----------------
     Ten photographs of one shield-wall, cross-faded as you play: near dark at
     the start, warm and fully lit by the last question. The room brightens one
     step per question, so the round has the feel of an evening drawing on. */
  (function buildHall() {
    const art = document.getElementById("sm-hall");
    if (!art) return;
    let h = "";
    for (let n = 1; n <= HALLS; n++) {
      h += `<div class="sm-hall-layer${n === 1 ? " on" : ""}" data-n="${n}"` +
           ` style="background-image:url('${HALL_DIR}wall${n}.webp')"></div>`;
    }
    art.innerHTML = h;
  })();

  function lightHall() {
    /* the room only cleans up when you EARN it: one image brighter per banner
       hung. A wrong answer hangs nothing and leaves the wall exactly as dark as
       it was — so the light is the same reward the banners are. */
    const n = 1 + Math.min(HALLS - 1, state.hung.length);
    const art = document.getElementById("sm-hall");
    if (art) Array.prototype.forEach.call(art.children, (el) => {
      el.classList.toggle("on", +el.dataset.n === n);
    });
    const total = (state.deck && state.deck.length) || ROUND_LEN;
    if (shell) shell.style.setProperty("--glow", String(total ? (state.hung.length) / total : 0));
  }
  function setPhase(p) { if (shell) shell.setAttribute("data-phase", p); }

  /* ---------------- the ten hooks ----------------
     Two planks of five, measured off the photograph as fractions of the frame.
     A correctly-named banner fills the NEXT hook in order — top plank left to
     right, then the bottom plank — so the wall fills densely and a wrong answer
     simply leaves the row where it was, hanging nothing. */
  const HOOKS = [
    { x: 0.235, y: 0.202 }, { x: 0.370, y: 0.202 }, { x: 0.505, y: 0.202 }, { x: 0.645, y: 0.202 }, { x: 0.783, y: 0.202 },
    { x: 0.235, y: 0.452 }, { x: 0.370, y: 0.452 }, { x: 0.505, y: 0.452 }, { x: 0.645, y: 0.452 }, { x: 0.783, y: 0.452 },
  ];
  const BW = 0.118, BH = 0.205;   /* a banner's width and height, as fractions */
  function renderBanners() {
    const wall = document.getElementById("sm-banners");
    if (!wall) return;
    wall.innerHTML = HOOKS.map((hk, slot) => {
      const b = (state.hung || [])[slot];
      const st = `left:${((hk.x - BW / 2) * 100).toFixed(2)}%;top:${(hk.y * 100).toFixed(2)}%;` +
                 `width:${(BW * 100).toFixed(2)}%;height:${(BH * 100).toFixed(2)}%`;
      return `<div class="sm-banner-slot" style="${st}">` +
        (b ? `<img src="${b.img}" alt="${b.name}" title="${b.name}"/>` : "") + `</div>`;
    }).join("");
  }

  const RANKS = [
    [9, "Herald Supreme", "Every banner in the realm, named on sight. The College of Heralds has nothing left to teach you."],
    [7, "Master of Arms", "A trained eye — you know your greater houses cold, and most of the lesser ones besides."],
    [5, "Household Herald", "A solid showing. The great houses hold no secrets from you; the marcher lords still do."],
    [3, "Squire-at-Banners", "You know the famous shields. The rest is a long ride of study yet."],
    [0, "Summer Child", "Sweet summer child. One golden lion looks much like another to you — for now."],
  ];

  const state = { d: 1, deck: [], i: 0, score: 0, streak: 0, best: 0 , hung: [] };

  function pool(d) {
    if (d === 0) return POOL.slice();
    const exact = POOL.filter((h) => h.d === d);
    return exact.length ? exact : POOL.slice();
  }
  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }

  /* ---------------- setup screen ---------------- */
  document.querySelectorAll("#sm-diffs .sm-diff").forEach((b) => {
    b.addEventListener("click", () => {
      document.querySelectorAll("#sm-diffs .sm-diff").forEach((x) => x.classList.remove("active"));
      b.classList.add("active");
      state.d = parseInt(b.dataset.d, 10);
    });
  });

  function showScreen(id) {
    setPhase(id === "sm-setup" ? "setup" : "playing");
    ["sm-setup", "sm-game", "sm-result"].forEach((s) => $(s).classList.toggle("hidden", s !== id));
    const el = $(id);
    el.classList.remove("sm-anim-in");
    void el.offsetWidth;
    el.classList.add("sm-anim-in");
  }

  $("sm-start").addEventListener("click", start);
  /* leaving strips the hall back to cold and empty for the next round */
  function resetHall() { state.score = 0; state.deck = []; state.i = 0; state.hung = []; renderBanners(); lightHall(); }
  $("sm-quit").addEventListener("click", () => { resetHall(); showScreen("sm-setup"); });

  /* ---------------- the examination ---------------- */
  function buildDeck() {
    const candidates = pool(state.d);
    return shuffle(candidates.slice()).slice(0, Math.min(ROUND_LEN, candidates.length));
  }

  function start() {
    state.deck = buildDeck();
    if (!state.deck.length) return;
    state.i = 0; state.score = 0; state.streak = 0; state.best = 0;
    state.hung = [];                 /* grows only as banners are earned */
    lightHall();
    showScreen("sm-game");
    renderBanners();
    renderQuestion();
  }



  function pickDistractors(correct) {
    const source = pool(state.d).filter((h) => h.id !== correct.id);
    return shuffle(source.slice()).slice(0, 3);
  }

  function renderQuestion() {
    const house = state.deck[state.i];
    const bannerToHouse = Math.random() < 0.5;
    const distractors = pickDistractors(house);
    const options = shuffle([house, ...distractors]);

    $("sm-context").textContent = ""; $("sm-context").classList.add("hidden");
    $("sm-next").classList.add("hidden");
    $("sm-streak").textContent = state.streak >= 2 ? "🔥 " + state.streak + " streak" : "";

    const card = $("sm-card");
    card.classList.remove("sm-anim-in");
    void card.offsetWidth;
    card.classList.add("sm-anim-in");

    const promptBox = $("sm-prompt-box");
    const answersBox = $("sm-answers-box");

    if (bannerToHouse) {
      promptBox.innerHTML = `<div class="sm-banner-box"><img src="${house.img}" alt="" /></div>
        <div class="sm-prompt">Which house does this banner belong to?</div>`;
      answersBox.innerHTML = `<div class="sm-answers-text" id="sm-answers"></div>`;
      const row = $("sm-answers");
      options.forEach((opt) => {
        const b = document.createElement("button");
        b.className = "sm-a-text";
        b.textContent = opt.name;
        b.dataset.right = opt.id === house.id ? "1" : "0";
        b.addEventListener("click", () => pick(b, opt.id === house.id, house));
        row.appendChild(b);
      });
    } else {
      const wordsLine = house.words ? `<span class="sm-prompt-words">"${house.words}"</span>` : "";
      promptBox.innerHTML = `<div class="sm-prompt">Which banner belongs to ${house.name}?${wordsLine}</div>`;
      answersBox.innerHTML = `<div class="sm-answers-img" id="sm-answers"></div>`;
      const row = $("sm-answers");
      options.forEach((opt) => {
        const b = document.createElement("button");
        b.className = "sm-a-img";
        b.innerHTML = `<img src="${opt.img}" alt="" />`;
        b.dataset.right = opt.id === house.id ? "1" : "0";
        b.addEventListener("click", () => pick(b, opt.id === house.id, house));
        row.appendChild(b);
      });
    }
  }

  function pick(btn, right, house) {
    const answerBtns = document.querySelectorAll(".sm-a-text, .sm-a-img");
    answerBtns.forEach((b) => {
      b.disabled = true;
      if (b !== btn && b.dataset.right === "1") b.classList.add("right");
      else if (b !== btn) b.classList.add("dim");
    });
    btn.classList.add(right ? "right" : "wrong");
    if (right) {
      state.score++; state.streak++; state.best = Math.max(state.best, state.streak);
      state.hung.push({ name: house.name, img: house.img });  /* fills the next hook */
    } else {
      state.streak = 0;
    }
    renderBanners();
    lightHall();   /* brightens only if a banner was just hung */
    $("sm-context").innerHTML = `<b>${house.name}</b> — ${house.desc}`;
    $("sm-context").classList.remove("hidden");
    $("sm-next").textContent = state.i + 1 < state.deck.length ? "Next banner →" : "See the verdict →";
    $("sm-next").classList.remove("hidden");
  }

  $("sm-next").addEventListener("click", () => {
    state.i++;
    /* the light is set the moment a banner is hung, not on the turn of the page,
       so a wrong answer never quietly cleans the room here */
    if (state.i >= state.deck.length) return renderResult();
    renderQuestion();
  });

  function renderResult() {
    const rank = RANKS.find((r) => state.score >= r[0]);
    const el = $("sm-result");
    el.innerHTML = `
      <div class="sm-kicker">The Verdict</div>
      <div class="sm-score-ring"><b id="sm-score-num">0</b><span>of ${state.deck.length} correct</span></div>
      <div class="sm-rank sm-reveal-1">${rank[1]}</div>
      <p class="sm-rank-sub sm-reveal-2">${rank[2]}${state.best >= 3 ? ` Your best streak: <b>${state.best}</b> in a row.` : ""}</p>
      <div class="sm-result-actions sm-reveal-3">
        <button id="sm-again">Same again, fresh banners</button>
        <button id="sm-setup-btn">Change difficulty</button>
      </div>`;
    showScreen("sm-result");
    $("sm-again").addEventListener("click", start);
    $("sm-setup-btn").addEventListener("click", () => { resetHall(); showScreen("sm-setup"); });

    const num = $("sm-score-num");
    const total = state.score;
    const dur = 900, t0 = performance.now();
    (function tick(t) {
      const p = Math.min(1, (t - t0) / dur);
      num.textContent = Math.round(total * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  }
})();
