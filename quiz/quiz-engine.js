/* WHO ARE YOU IN THE REALM? — the quiz engine.
   Each quiz data file pushes a quiz object into window.QUIZZES:
     { id, icon, title, sub, resultKicker, shieldResults?, results: { rid: {name, epithet, img?, color?, desc} },
       questions: [ { q, a: [ { t, p: { rid: points, ... } } ] } ] }
   Scoring: every answer awards points (1–10) to one or more results; the
   highest total wins. Ties break toward the order results are declared in.
   The verdict shows the winner, the strongest runner-up, and affinity bars. */

(function () {
  const byId = (id) => document.getElementById(id);
  const els = {
    home: byId("quiz-home"), cards: byId("quiz-cards"),
    run: byId("quiz-run"), runTitle: byId("quiz-run-title"),
    progressLabel: byId("quiz-progress-label"), progressFill: byId("quiz-progress-fill"),
    question: byId("quiz-question"), answers: byId("quiz-answers"),
    back: byId("quiz-back"), quit: byId("quiz-quit"),
    result: byId("quiz-result"),
  };

  const quizzes = window.QUIZZES || [];
  const state = { quiz: null, qIndex: 0, picks: [] }; // picks[i] = chosen answer object

  // ---------------- site switcher (same behavior as the other pages) ----------------
  (function initSwitcher() {
    const sw = byId("site-switcher"), btn = byId("site-switcher-btn"), dd = byId("site-dropdown");
    if (!sw || !btn || !dd) return; /* embedded (e.g. Games & Trivia hub) — no switcher here */
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const open = !sw.classList.contains("open");
      sw.classList.toggle("open", open);
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    dd.querySelectorAll("[data-site]").forEach((b) => {
      b.addEventListener("click", () => {
        const s = b.dataset.site;
        if (s === "home") location.href = "../index.html";
        else if (s === "asoiaf") location.href = "../map.html";
        else if (s === "hotd") location.href = "../hotd/index.html";
        else if (s === "trees") location.href = "../trees/index.html";
        else if (s === "knight") location.href = "../knight/index.html";
        else if (s === "wordle") location.href = "../map.html#wordle=1";
      });
    });
    document.addEventListener("click", (e) => {
      if (!sw.contains(e.target)) { sw.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); }
    });
  })();

  // ---------------- picker ----------------
  function renderHome() {
    els.home.classList.remove("hidden");
    els.run.classList.add("hidden");
    els.result.classList.add("hidden");
    els.cards.innerHTML = quizzes.map((q, i) => `
      <button class="quiz-card" data-quiz="${i}">
        <div class="quiz-card-icon">${q.icon}</div>
        <div class="quiz-card-title">${q.title}</div>
        <div class="quiz-card-sub">${q.sub}</div>
        <div class="quiz-card-meta">${q.questions.length} questions · ${Object.keys(q.results).length} possible answers</div>
      </button>`).join("");
    els.cards.querySelectorAll("[data-quiz]").forEach((b) => {
      b.addEventListener("click", () => startQuiz(quizzes[parseInt(b.dataset.quiz, 10)]));
    });
  }

  // ---------------- running ----------------
  function startQuiz(quiz) {
    state.quiz = quiz; state.qIndex = 0; state.picks = [];
    els.home.classList.add("hidden");
    els.result.classList.add("hidden");
    els.run.classList.remove("hidden");
    els.runTitle.textContent = quiz.title;
    renderQuestion();
  }

  /* answers are shown in a shuffled order so no seat at the table is favored */
  function shuffled(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function renderQuestion() {
    const quiz = state.quiz, i = state.qIndex, total = quiz.questions.length;
    if (i >= total) { renderResult(); return; }
    const q = quiz.questions[i];
    els.progressLabel.textContent = `Question ${i + 1} of ${total}`;
    els.progressFill.style.width = ((i / total) * 100) + "%";
    els.question.textContent = q.q;
    els.answers.innerHTML = "";
    shuffled(q.a).forEach((ans) => {
      const b = document.createElement("button");
      b.className = "quiz-answer";
      b.textContent = ans.t;
      b.addEventListener("click", () => { state.picks[i] = ans; state.qIndex++; renderQuestion(); });
      els.answers.appendChild(b);
    });
    /* a skipped question simply doesn't count — for or against anyone */
    const skip = document.createElement("button");
    skip.className = "quiz-skip";
    skip.textContent = "None of these fit me — skip this question →";
    skip.addEventListener("click", () => { state.picks[i] = null; state.qIndex++; renderQuestion(); });
    els.answers.appendChild(skip);
    els.back.classList.toggle("hidden", i === 0);
    els.run.scrollIntoView({ block: "start" });
  }

  els.back.addEventListener("click", () => {
    if (state.qIndex > 0) { state.qIndex--; state.picks.length = state.qIndex; renderQuestion(); }
  });
  els.quit.addEventListener("click", renderHome);

  // ---------------- the verdict ----------------
  /* Likeness is scored against the best any soul could have done on the questions you
     actually answered: each answered question contributes its single highest point value
     (across all answers and all results) to the denominator. Skipped questions drop out
     of both sides, so skipping never lowers anyone's likeness. And because no result in
     any quiz holds that per-question maximum on every question (verified in the data),
     a 100% match is impossible by construction — the old display divided by the winner's
     own score, which made the top result always read "100%". */
  function tally() {
    const scores = {};
    Object.keys(state.quiz.results).forEach((rid) => (scores[rid] = 0));
    let denom = 0;
    state.quiz.questions.forEach((q, i) => {
      const ans = state.picks[i];
      if (!ans) return; /* skipped — no points, no denominator */
      Object.entries(ans.p).forEach(([rid, pts]) => { if (rid in scores) scores[rid] += pts; });
      denom += Math.max(...q.a.map((a) => Math.max(...Object.values(a.p))));
    });
    /* order: score desc, declaration order breaks ties */
    const order = Object.keys(state.quiz.results);
    const ranked = order.map((rid) => ({ rid, score: scores[rid] }))
      .sort((a, b) => b.score - a.score || order.indexOf(a.rid) - order.indexOf(b.rid));
    return { ranked, denom };
  }

  function faceHTML(quiz, r) {
    if (r.img) {
      return `<div class="quiz-result-face${quiz.shieldResults ? " quiz-result-shield" : ""}"><img src="${r.img}" alt="${r.name}"/></div>`;
    }
    const initials = r.name.replace(/^(Ser|House|Lady|Lord|King|Prince|Princess)\s+/i, "")
      .split(" ").map((w) => w[0]).slice(0, 2).join("");
    return `<div class="quiz-result-face" style="background:${r.color || "#3a2f22"}"><span class="quiz-result-initials">${initials}</span></div>`;
  }

  function renderResult() {
    const quiz = state.quiz;
    const { ranked, denom } = tally();

    els.run.classList.add("hidden");
    els.result.classList.remove("hidden");

    /* every question skipped — nothing to judge by */
    if (!denom) {
      els.result.innerHTML = `
        <div class="quiz-result-kicker">${quiz.resultKicker}</div>
        <div class="quiz-result-name">No One</div>
        <div class="quiz-result-epithet">A girl gave no answers…</div>
        <div class="quiz-result-desc">You skipped every question — even the Faceless Men would be impressed.
          But the realm cannot name a soul it has never met. Answer at least one question and try again.</div>
        <div class="quiz-result-actions">
          <button id="quiz-retake">Take it again</button>
          <button id="quiz-others">The other quizzes</button>
        </div>`;
      byId("quiz-retake").addEventListener("click", () => startQuiz(quiz));
      byId("quiz-others").addEventListener("click", renderHome);
      els.result.scrollIntoView({ block: "start" });
      return;
    }

    const pct = (r) => Math.round((r.score / denom) * 100);
    const win = quiz.results[ranked[0].rid];
    const second = quiz.results[ranked[1].rid];

    els.result.innerHTML = `
      <div class="quiz-result-kicker">${quiz.resultKicker}</div>
      ${faceHTML(quiz, win)}
      <div class="quiz-result-name">${win.name}</div>
      <div class="quiz-result-epithet">${win.epithet}</div>
      <div class="quiz-result-desc">${win.desc}</div>
      ${ranked[1].score > 0 ? `<div class="quiz-result-runner">…though there is a strong strain of <b>${second.name}</b> in you as well.</div>` : ""}
      <div class="quiz-affinity">
        <div class="quiz-affinity-head">Your affinities</div>
        ${ranked.slice(0, 5).map((r) => `
          <div class="quiz-aff-row">
            <span class="quiz-aff-name">${quiz.results[r.rid].name}</span>
            <span class="quiz-aff-bar"><span class="quiz-aff-fill" style="width:${pct(r)}%"></span></span>
            <span class="quiz-aff-pct">${pct(r)}%</span>
          </div>`).join("")}
      </div>
      <div class="quiz-result-actions">
        <button id="quiz-retake">Take it again</button>
        <button id="quiz-others">The other quizzes</button>
      </div>`;
    byId("quiz-retake").addEventListener("click", () => startQuiz(quiz));
    byId("quiz-others").addEventListener("click", renderHome);
    els.result.scrollIntoView({ block: "start" });
  }

  renderHome();
})();
