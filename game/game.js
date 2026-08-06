/* ============================================================================
   THE IRON LADDER — character creation.

   An eight-step wizard over IL_DATA and IL_WORLD. It holds the whole character
   in one object, saves on every change so a closed tab loses nothing, and
   renders each step from the data rather than from markup — so adding a realm,
   a house, a trade or a perk is a row in a data file and nothing else.

   THE ONE RULE THIS FILE OBEYS: it never decides anything the engine decides.
   The attribute preview on the last page is computed here, from the same
   arithmetic engine.js uses, and if the two ever disagree the engine is right —
   which is why begin() re-derives everything from scratch rather than trusting
   what this screen wrote down. A creation screen is a menu, never a rule.
   ========================================================================== */

(function () {
  "use strict";

  var D = window.IL_DATA, W = window.IL_WORLD;
  var KEY = "ilCharacter";
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  };

  var STEPS = [
    { n: 1, label: "Name" }, { n: 2, label: "Kingdom" }, { n: 3, label: "Birthplace" },
    { n: 4, label: "Birth" }, { n: 5, label: "Trade" }, { n: 6, label: "Nature" },
    { n: 7, label: "Ambition" }, { n: 8, label: "Your character" },
  ];

  var C = { first: "", last: "", region: null, place: null, birth: null, house: null,
            work: null, perks: [], ambition: null };
  var step = 1;

  /* ------------------------------------------------------------- storage -- */
  function save() { try { localStorage.setItem(KEY, JSON.stringify(C)); } catch (e) {} }
  function load() {
    var raw = null;
    try { raw = localStorage.getItem(KEY); } catch (e) {}
    if (!raw) return;
    var o; try { o = JSON.parse(raw); } catch (e) { return; }
    if (!o || typeof o !== "object") return;
    /* take only what the tables still recognise: a renamed id must never
       survive into the sheet as an un-nameable blank */
    C.first = typeof o.first === "string" ? o.first.slice(0, 18) : "";
    C.last = typeof o.last === "string" ? o.last.slice(0, 18) : "";
    C.region = byId(W.realms, o.region) ? o.region : null;
    C.place = placeOk(o.place) ? o.place : null;
    C.birth = birthAllowed(byId(D.births, o.birth)) ? o.birth : null;
    C.house = houseOk(o.house) ? o.house : null;
    C.work = workAllowed(byId(D.works, o.work)) ? o.work : null;
    C.ambition = byId(D.ambitions, o.ambition) ? o.ambition : null;
    C.perks = Array.isArray(o.perks)
      ? o.perks.filter(function (p) { return !!byId(D.perks, p); }).slice(0, D.perkPoints) : [];
  }

  function byId(list, id) {
    for (var i = 0; i < (list || []).length; i++) if (list[i].id === id) return list[i];
    return null;
  }
  function realm() { return byId(W.realms, C.region); }
  function place() { return byId(W.places, C.place); }
  function birth() { return byId(D.births, C.birth); }
  function work() { return byId(D.works, C.work); }
  function housesHere() { return D.houses[C.region] || []; }

  function birthplaces() {
    return W.places.filter(function (p) { return p.realm === C.region && p.birth !== false; });
  }
  function placeOk(id) {
    var p = byId(W.places, id);
    return !!p && p.realm === C.region && p.birth !== false;
  }
  function houseOk(id) {
    return C.birth === "trueborn" && !!byId(housesHere(), id);
  }
  function tagsHere() { var p = place(); return (p && p.tags) || []; }

  /* `only` on a birth or a trade is checked against the same three things the
     engine checks: the side of the world, the realm, and the tags of the place. */
  function passesOnly(o) {
    if (!o || !o.only) return true;
    var r = realm();
    if (o.only.sides && (!r || o.only.sides.indexOf(r.side) < 0)) return false;
    if (o.only.realms && o.only.realms.indexOf(C.region) < 0) return false;
    if (o.only.placeTags) {
      for (var i = 0; i < o.only.placeTags.length; i++)
        if (tagsHere().indexOf(o.only.placeTags[i]) < 0) return false;
    }
    return true;
  }
  function birthAllowed(b) { return !!b && passesOnly(b); }
  function workAllowed(w) {
    if (!w) return false;
    if (!passesOnly(w)) return false;
    if (w.need) return !!C.birth && w.need.indexOf(C.birth) >= 0;
    return true;
  }

  /* ---------------------------------------------------------- the name --- */
  function surnameFor() {
    var b = C.birth, r = C.region, rr = realm();
    if (!b || !r) return { value: C.last, locked: false, label: "Family name", hint: "" };
    if (b === "trueborn") {
      var hs = byId(housesHere(), C.house) || housesHere()[0];
      return { value: hs ? hs.name.replace(/^House\s+/, "") : C.last, locked: true,
        label: "Your house",
        hint: hs ? "Trueborn of " + hs.name + " — “" + hs.words + "”" : "" };
    }
    if (b === "bastard") {
      var bn = D.bastardNames[r];
      if (!bn) return { value: C.last, locked: false, label: "Family name",
        hint: "East of the narrow sea a bastard has whatever name they can hold on to." };
      return { value: bn, locked: true, label: "A bastard's name",
        hint: "Every bastard of " + (rr ? rr.name : "this realm") + " is given the same name. " +
              "Everyone who hears it knows exactly what you are." };
    }
    if (b === "nobody") return { value: "", locked: true, label: "No family name",
      hint: "A nobody has one name. You may earn a second." };
    if (b === "slave") return { value: "", locked: true, label: "No family name",
      hint: "You were given a name by the household that owned you. It is not on this form." };
    return { value: C.last, locked: false, label: "Family name",
      hint: b === "landed" ? "A small house nobody outside your valley has heard of."
          : b === "merchant" ? "A trading name, and the older it sounds the better it sells."
          : "A trade name, a village name, or your father's." };
  }
  function fullName() {
    var sn = surnameFor();
    return (C.first + " " + ((sn.locked ? sn.value : C.last) || "")).trim();
  }

  /* ------------------------------------------------- attribute preview --- */
  /* The same sum the engine does. It is duplicated deliberately rather than
     imported, because this screen must work even before a life exists. */
  function previewAttrs() {
    var a = { might: 3, swiftness: 3, wits: 3, charm: 3, grit: 3, cunning: 3 }, k;
    var b = birth(), w = work();
    if (b) for (k in (b.attr || {})) a[k] += b.attr[k];
    if (w) for (k in (w.attr || {})) a[k] += w.attr[k];
    C.perks.forEach(function (pid) {
      var p = byId(D.perks, pid);
      if (p) for (var kk in (p.attr || {})) a[kk] += p.attr[kk];
    });
    return a;
  }

  /* ------------------------------------------------------------ render --- */
  function card(sel, id, inner, disabled) {
    return '<button type="button" class="il-card' + (sel ? " sel" : "") + '" data-pick="' + esc(id) + '"' +
      ' role="radio" aria-checked="' + (sel ? "true" : "false") + '"' +
      (disabled ? ' aria-disabled="true" disabled' : "") + ">" + inner + "</button>";
  }
  function tags(list) {
    return '<span class="il-tags">' + (list || []).map(function (t) {
      return '<span class="il-tag">' + esc(t) + "</span>"; }).join("") + "</span>";
  }

  function renderRegions() {
    ["westeros", "essos"].forEach(function (side) {
      var el = $("il-regions-" + side);
      if (!el) return;
      el.innerHTML = W.realms.filter(function (r) { return r.side === side; }).map(function (r) {
        return card(C.region === r.id, r.id,
          '<span class="il-card-top"><span class="il-card-name">' + esc(r.name) + "</span>" +
          '<span class="il-card-seat">' + esc(r.seat) + "</span></span>" +
          '<span class="il-card-blurb">' + esc(r.blurb) + "</span>" + tags(r.traits));
      }).join("");
    });
  }

  function renderPlaces() {
    var list = birthplaces();
    var r = realm();
    $("il-placelead").textContent = r
      ? "In " + r.name + ". The place decides which of the world's scenes can find you at all — a harbour brings ships and smugglers, a court brings lords, a hill village brings neither."
      : "Choose a kingdom first.";
    $("il-places").innerHTML = list.map(function (p) {
      return card(C.place === p.id, p.id,
        '<span class="il-card-top"><span class="il-card-name">' + esc(p.name) + "</span>" +
        '<span class="il-card-seat">' + esc(p.kind) + "</span></span>" +
        '<span class="il-card-blurb">' + esc(p.blurb) + "</span>" + tags(p.tags.slice(0, 4)));
    }).join("");
  }

  function renderBirths() {
    var r = realm();
    $("il-births").innerHTML = D.births.map(function (b) {
      var ok = birthAllowed(b), extra = "";
      if (!ok) extra = '<span class="il-card-note">Not possible where you were born.</span>';
      else if (b.id === "bastard" && r && D.bastardNames[r.id]) {
        extra = '<span class="il-card-note">In ' + esc(r.name) + ", they will call you " +
          esc(D.bastardNames[r.id]) + ".</span>";
      }
      var st = b.start;
      return card(C.birth === b.id, b.id,
        '<span class="il-card-top"><span class="il-card-name">' + esc(b.name) + "</span></span>" +
        '<span class="il-card-blurb">' + esc(b.blurb) + "</span>" + extra +
        '<span class="il-stats">' + stat(st.coin, "Coin") + stat(st.standing, "Standing") +
          stat(st.followers, "Sworn") + stat(st.health, "Health") + "</span>" +
        '<span class="il-card-note">' + esc(b.note) + "</span>", !ok);
    }).join("");

    var wrap = $("il-housewrap");
    var show = C.birth === "trueborn" && housesHere().length > 0;
    wrap.classList.toggle("hidden", !show);
    if (show) {
      $("il-houses").innerHTML = housesHere().map(function (h) {
        var seat = byId(W.places, h.seat);
        return card(C.house === h.id, h.id,
          '<span class="il-card-top"><span class="il-card-name">' + esc(h.name) + "</span>" +
          '<span class="il-card-seat">' + esc(h.rank === "great" ? "great house" : h.rank) + "</span></span>" +
          '<span class="il-card-blurb">&ldquo;' + esc(h.words) + "&rdquo;</span>" +
          (seat ? '<span class="il-card-note">Seat: ' + esc(seat.name) + ".</span>" : ""));
      }).join("");
    }
  }
  function stat(v, label) { return '<span class="il-stat"><b>' + v + "</b><span>" + label + "</span></span>"; }

  function renderWorks() {
    $("il-works").innerHTML = D.works.map(function (w) {
      var ok = workAllowed(w);
      var why = ok ? "" : '<span class="il-card-note">' +
        (w.need ? "Only for a highborn birth." : "Not available where you were born.") + "</span>";
      var bumps = Object.keys(w.attr || {}).map(function (k) {
        return (byId(D.attrs, k) || {}).name + " +" + w.attr[k]; });
      return card(C.work === w.id, w.id,
        '<span class="il-card-top"><span class="il-card-emoji">' + w.emoji + "</span>" +
        '<span class="il-card-name">' + esc(w.name) + "</span></span>" +
        '<span class="il-card-blurb">' + esc(w.blurb) + "</span>" + why +
        tags(w.gives.concat(bumps)), !ok);
    }).join("");
  }

  function renderPerks() {
    var full = C.perks.length >= D.perkPoints;
    $("il-perks").innerHTML = D.perks.map(function (p) {
      var on = C.perks.indexOf(p.id) >= 0;
      var bump = Object.keys(p.attr || {}).map(function (k) {
        return (byId(D.attrs, k) || {}).name + " +" + p.attr[k]; });
      return card(on, p.id,
        '<span class="il-card-top"><span class="il-card-emoji">' + p.emoji + "</span>" +
        '<span class="il-card-name">' + esc(p.name) + "</span></span>" +
        '<span class="il-card-blurb">' + esc(p.blurb) + "</span>" + tags(bump), !on && full);
    }).join("");
    var left = D.perkPoints - C.perks.length;
    $("il-perkleft").textContent = left > 0
      ? (left === D.perkPoints ? "" : left + " to go.")
      : "Chosen. Press one again to take it back.";
  }

  function renderAmbitions() {
    $("il-ambitions").innerHTML = D.ambitions.map(function (a) {
      return card(C.ambition === a.id, a.id,
        '<span class="il-card-top"><span class="il-card-emoji">' + a.emoji + "</span>" +
        '<span class="il-card-name">' + esc(a.name) + "</span></span>" +
        '<span class="il-card-blurb">' + esc(a.blurb) + "</span>");
    }).join("");
  }

  function renderName() {
    var sn = surnameFor(), input = $("il-last");
    $("il-lastlabel").textContent = sn.label;
    if (sn.locked) {
      input.value = sn.value; input.readOnly = true;
      input.style.opacity = sn.value ? "1" : "0.4";
      input.placeholder = sn.value ? "" : "—";
    } else {
      input.readOnly = false; input.style.opacity = "1";
      input.value = C.last; input.placeholder = "Rivers";
    }
    $("il-namehint").textContent = sn.hint;
    if ($("il-first").value !== C.first) $("il-first").value = C.first;
  }

  function renderSheet() {
    var r = realm(), p = place(), b = birth(), w = work();
    if (!r || !p || !b || !w) { $("il-sheet").innerHTML = ""; return; }
    var a = previewAttrs();
    var perks = C.perks.map(function (id) { return byId(D.perks, id); }).filter(Boolean);
    var amb = byId(D.ambitions, C.ambition);
    var h = byId(housesHere(), C.house);
    var st = b.start;

    $("il-sheet").innerHTML =
      '<div class="il-sheet-hero">' +
        '<div class="il-sheet-name">' + esc(fullName()) + "</div>" +
        '<div class="il-sheet-line">' + esc(b.name) + (h ? " of " + esc(h.name) : "") +
          " &middot; " + esc(w.name) + " &middot; born at " + esc(p.name) + ", " + esc(r.name) + "</div>" +
      "</div>" +
      '<div class="il-panel"><h3>What you are</h3><div class="il-attrgrid">' +
        D.attrs.map(function (at) {
          return '<div class="il-attrcell"><b>' + a[at.id] + "</b><span>" + esc(at.name) + "</span>" +
            '<i>' + esc(at.blurb) + "</i></div>";
        }).join("") +
      "</div><p class=\"il-card-note\">Every uncertain thing in the world is a twenty-sided die plus one of these, " +
        "against a number you will always be shown before you choose. Six is ordinary; ten is the best in a village.</p></div>" +
      panel("Where you begin", "<p><b>" + esc(p.name) + "</b>. " + esc(p.blurb) + "</p>" +
        "<p>" + esc(r.blurb) + "</p>") +
      panel("What you begin with",
        '<p><span class="il-stats">' + stat(st.coin, "Coin") + stat(st.standing, "Standing") +
        stat(st.followers, "Sworn") + stat(st.health, "Health") + "</span></p><p>" + esc(b.note) + "</p>") +
      panel("Your trade", "<p>" + esc(w.blurb) + "</p>") +
      panel("What you are like", perks.map(function (pk) {
        return "<p>" + pk.emoji + " <b>" + esc(pk.name) + ".</b> " + esc(pk.blurb) + "</p>"; }).join("")) +
      (amb ? panel("What you are after", "<p>" + amb.emoji + " <b>" + esc(amb.name) + ".</b> " + esc(amb.blurb) + "</p>") : "");
  }
  function panel(h, body) { return '<div class="il-panel"><h3>' + esc(h) + "</h3>" + body + "</div>"; }

  /* --------------------------------------------------------- machinery --- */
  function ready(n) {
    if (n === 1) return C.first.trim().length >= 2;
    if (n === 2) return !!C.region;
    if (n === 3) return !!C.place;
    if (n === 4) return !!C.birth && (C.birth !== "trueborn" || !!C.house || housesHere().length === 0);
    if (n === 5) return !!C.work;
    if (n === 6) return C.perks.length === D.perkPoints;
    if (n === 7) return !!C.ambition;
    return true;
  }
  function reachable(n) {
    for (var i = 1; i < n; i++) if (!ready(i)) return false;
    return true;
  }

  function renderSteps() {
    $("il-steps").innerHTML = STEPS.map(function (s) {
      var cls = s.n === step ? "now" : (ready(s.n) && s.n < step ? "done" : "");
      return '<li class="' + cls + '" data-goto="' + s.n + '"' +
        (reachable(s.n) ? "" : ' aria-disabled="true"') + '>' +
        '<span class="il-stepno">' + s.n + "</span>" + esc(s.label) + "</li>";
    }).join("");
  }

  function summary() {
    if (!C.first.trim()) return "Begin by choosing a name.";
    var bits = [fullName() || C.first];
    if (C.place) bits.push("of " + place().name);
    if (C.birth) bits.push(birth().name.toLowerCase());
    if (C.work) bits.push(work().name.toLowerCase());
    if (C.perks.length) bits.push(C.perks.map(function (p) { return byId(D.perks, p).name.toLowerCase(); }).join(", "));
    return bits.join(" · ");
  }

  function render() {
    document.querySelectorAll(".il-step").forEach(function (el) {
      el.classList.toggle("now", parseInt(el.dataset.step, 10) === step);
    });
    if (step === 1) renderName();
    if (step === 2) renderRegions();
    if (step === 3) renderPlaces();
    if (step === 4) renderBirths();
    if (step === 5) renderWorks();
    if (step === 6) renderPerks();
    if (step === 7) renderAmbitions();
    if (step === 8) renderSheet();
    renderSteps();
    $("il-bar-sum").textContent = summary();
    $("il-back").disabled = step === 1;
    $("il-next").classList.toggle("hidden", step === STEPS.length);
    $("il-done").classList.toggle("hidden", step !== STEPS.length);
    $("il-next").disabled = !ready(step);
    save();
  }

  function goto(n) {
    n = Math.max(1, Math.min(STEPS.length, n));
    if (!reachable(n)) return;
    step = n; render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ------------------------------------------------------------ rolling -- */
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function weighted(list) {
    var total = 0, i;
    for (i = 0; i < list.length; i++) total += (list[i].w || 1);
    var r = Math.random() * total;
    for (i = 0; i < list.length; i++) { r -= (list[i].w || 1); if (r <= 0) return list[i]; }
    return list[list.length - 1];
  }
  function nameSet() {
    var r = realm();
    if (C.region === "beyond-the-wall") return D.names.freefolk;
    return r && r.side === "essos" ? D.names.essos : D.names.westeros;
  }

  function rollAll() {
    C.region = pick(W.realms).id;
    C.place = pick(birthplaces()).id;
    var openBirths = D.births.filter(birthAllowed);
    C.birth = weighted(openBirths).id;
    C.house = C.birth === "trueborn" && housesHere().length ? pick(housesHere()).id : null;
    var openWorks = D.works.filter(workAllowed);
    C.work = pick(openWorks).id;
    C.perks = [];
    var pool = D.perks.slice();
    while (C.perks.length < D.perkPoints && pool.length) {
      C.perks.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0].id);
    }
    C.ambition = pick(D.ambitions).id;
    var ns = nameSet();
    C.first = pick(ns.first);
    if (!surnameFor().locked) C.last = pick(ns.last);
  }

  /* ------------------------------------------------------------- wiring -- */
  function pickHandler(el, onPick) {
    if (!el) return;
    el.addEventListener("click", function (e) {
      var btn = e.target.closest && e.target.closest("[data-pick]");
      if (!btn || btn.disabled) return;
      onPick(btn.getAttribute("data-pick"));
      render();
    });
  }

  /* A life already running gets a door rather than a wizard — remaking a
     character behind a living one would silently orphan it. */
  function paintResume() {
    var live = null;
    try { live = JSON.parse(localStorage.getItem("ilLife") || "null"); } catch (e) {}
    if (!live || !live.name) return false;
    var box = $("il-resume");
    box.classList.remove("hidden");
    box.innerHTML = live.dead
      ? "<b>" + esc(live.name) + " is dead.</b> Their chronicle is written. " +
        'Make somebody new below, or <a href="play.html">read how it ended</a>.'
      : "<b>" + esc(live.name) + " is still living</b> &mdash; " + live.age + " years old, " +
        (live.log ? live.log.length : 0) + " things have happened to them. " +
        '<a href="play.html">Go back to them &rarr;</a><br>' +
        '<span class="il-resume-warn">Making a new character below will abandon that life.</span>';
    return !live.dead;
  }

  function init() {
    load();
    paintResume();

    $("il-first").addEventListener("input", function () {
      C.first = this.value.replace(/[^A-Za-z' -]/g, "").slice(0, 18);
      if (this.value !== C.first) this.value = C.first;
      $("il-bar-sum").textContent = summary();
      $("il-next").disabled = !ready(step);
      renderSteps(); save();
    });
    $("il-last").addEventListener("input", function () {
      if (this.readOnly) return;
      C.last = this.value.replace(/[^A-Za-z' -]/g, "").slice(0, 18);
      if (this.value !== C.last) this.value = C.last;
      $("il-bar-sum").textContent = summary(); save();
    });
    $("il-roll-name").addEventListener("click", function () {
      var ns = nameSet();
      C.first = pick(ns.first);
      if (!surnameFor().locked) C.last = pick(ns.last);
      render();
    });

    pickHandler($("il-regions-westeros"), setRegion);
    pickHandler($("il-regions-essos"), setRegion);
    function setRegion(id) {
      if (C.region === id) return;
      C.region = id;
      C.place = null; C.house = null;
      if (!birthAllowed(birth())) C.birth = null;
      if (!workAllowed(work())) C.work = null;
      renderRegions(); renderName();
    }

    pickHandler($("il-places"), function (id) {
      C.place = id;
      if (!birthAllowed(birth())) C.birth = null;
      if (!workAllowed(work())) C.work = null;
    });
    pickHandler($("il-births"), function (id) {
      C.birth = id;
      if (id !== "trueborn") C.house = null;
      else if (!C.house && housesHere().length) C.house = housesHere()[0].id;
      if (!workAllowed(work())) C.work = null;
      renderName();
    });
    pickHandler($("il-houses"), function (id) { C.house = id; renderName(); });
    pickHandler($("il-works"), function (id) { C.work = id; });
    pickHandler($("il-perks"), function (id) {
      var i = C.perks.indexOf(id);
      if (i >= 0) C.perks.splice(i, 1);
      else if (C.perks.length < D.perkPoints) C.perks.push(id);
    });
    pickHandler($("il-ambitions"), function (id) { C.ambition = id; });

    $("il-steps").addEventListener("click", function (e) {
      var li = e.target.closest && e.target.closest("[data-goto]");
      if (li && li.getAttribute("aria-disabled") !== "true") goto(parseInt(li.dataset.goto, 10));
    });
    $("il-next").addEventListener("click", function () { if (ready(step)) goto(step + 1); });
    $("il-back").addEventListener("click", function () { goto(step - 1); });
    $("il-surprise").addEventListener("click", function () { rollAll(); goto(STEPS.length); });
    $("il-wipe").addEventListener("click", function () {
      C = { first: "", last: "", region: null, place: null, birth: null, house: null,
            work: null, perks: [], ambition: null };
      try { localStorage.removeItem(KEY); } catch (e) {}
      goto(1);
    });

    $("il-done").addEventListener("click", function () {
      var live = null;
      try { live = JSON.parse(localStorage.getItem("ilLife") || "null"); } catch (e) {}
      if (live && live.name && !live.dead &&
          !window.confirm(live.name + " is still alive. Beginning a new life abandons them for good. Go on?")) return;
      save();
      try { localStorage.removeItem("ilLife"); } catch (e) {}
      if (window.ILEngine) {
        window.ILEngine.wipe();
        window.ILEngine.begin(character());
      }
      window.location.href = "play.html";
    });

    /* the name fields must be filled BEFORE the opening step is chosen —
       render() only paints the step it is showing, so a returning player
       dropped on the sheet would find the name boxes empty on stepping back */
    renderName();
    var start = 1;
    for (var n = 1; n <= STEPS.length; n++) if (reachable(n)) start = n;
    step = start;
    render();
  }

  function character() {
    var sn = surnameFor();
    return {
      v: 2, name: fullName(), first: C.first, last: sn.locked ? sn.value : C.last,
      region: C.region, place: C.place, birth: C.birth, house: C.house,
      work: C.work, perks: C.perks.slice(), ambition: C.ambition,
    };
  }

  window.IL = { character: character, reset: function () { try { localStorage.removeItem(KEY); } catch (e) {} } };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
