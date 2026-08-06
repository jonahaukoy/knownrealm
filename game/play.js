/* ============================================================================
   THE IRON LADDER — the screen.

   Draws whatever ILEngine hands back and sends decisions the other way. There
   are no rules in this file: if you find yourself deciding what something COSTS
   here, it belongs in engine.js, and if you find yourself writing prose here,
   it belongs in data-events.js.

   The one piece of judgement that does live here is the ORDER of a turn, which
   is a presentation decision:

     press an option → the die is thrown where you can see it
                     → the outcome is narrated
                     → the ledger of what changed
                     → the season's own upkeep, in the same ledger
                     → "next season", which draws a fresh scene

   Both halves of the ledger appear together on purpose. A player who reads
   "you were robbed" and then, on a separate screen, "you went hungry", never
   connects the two. Side by side, the world looks like it has joined-up
   consequences, because it has.
   ========================================================================== */

(function () {
  "use strict";

  var E = window.ILEngine, D = window.IL_DATA;
  var $ = function (id) { return document.getElementById(id); };
  function esc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  var scene = null;          /* the event on the table */
  var answered = false;      /* has it been answered this season */
  var locked = false;        /* the season is spent — no acting, no travelling */
  var lockWhy = "spent";     /* spent | demand | started — see setLocked */
  var prevAttrs = null;      /* to animate the ones that moved */
  var map = null;            /* the map panel, built once */

  /* ====================================================== the crown ====== */
  function paintCrown() {
    var s = E.summary();
    $("ilp-name").textContent = (s.titles.length ? s.titles.join(", ") + " " : "") + s.name;
    var bits = [];
    if (s.house) bits.push(s.house);
    else if (s.birth) bits.push(s.birth);
    /* say plainly when nothing arrives at the end of the season */
    bits.push(s.employed ? s.work : s.work + " &mdash; no wage");
    bits.push(s.age + " years old");
    $("ilp-sub").innerHTML = bits.map(esc).join(" · ").replace(/&amp;mdash;/g, "&mdash;");
    $("ilp-where").innerHTML = (s.wild ? "&#127794; " : "&#128205; ") +
      "<b>" + esc(s.place) + "</b>" + (s.wild ? "" : ", " + esc(s.realm)) +
      (s.wild && s.nearest ? " &mdash; nearest roof: " + esc(s.nearest.name) : "") +
      " &mdash; " + esc(s.season) + " of your " + ordinal(s.year + 1) + " year" +
      (s.wild ? ", <b>day by day</b>" : "") +
      /* WHAT IS ACTUALLY HERE. The engine derives this from the place's tags,
         and the action panel below is gated on exactly the same list — so if
         a well is not named here, no option below will offer you one. */
      '<div class="ilp-hashere">' + (s.amenities.length
        ? "In this place: " + s.amenities.map(function (a) {
            return '<span class="ilp-am">' + esc(AMENITY_WORD[a] || a) + "</span>";
          }).join("")
        : '<span class="ilp-am ilp-am-none">Nothing here but the ground</span>') +
      (s.cast && s.cast.holder ? '<span class="ilp-holder">Held by ' + esc(s.cast.holder) + "</span>" : "") +
      "</div>";

    var L = s.ladder;
    $("ilp-rank").textContent = L.now.name;
    $("ilp-rank-note").textContent = L.now.note;
    var pct = L.next ? Math.min(100, Math.round(((L.score - L.now.at) / (L.next.at - L.now.at)) * 100)) : 100;
    $("ilp-rank-bar").style.width = pct + "%";
    $("ilp-rank-next").textContent = L.next
      ? (L.next.at - L.score) + " more to be " + L.next.name.toLowerCase()
      : "There is nowhere further up.";
  }
  function ordinal(n) {
    var e = ["th", "st", "nd", "rd"], v = n % 100;
    return n + (e[(v - 20) % 10] || e[v] || e[0]);
  }
  /* the amenity ids the engine derives, in the words a person would use */
  var AMENITY_WORD = {
    well: "a well", inn: "an inn", market: "a market", smith: "a smith",
    brothel: "a house with a red lantern", temple: "somewhere to pray",
    stables: "stables", harbour: "a harbour", watch: "men of the watch",
    maester: "a maester", hall: "a lord's hall", crowd: "people",
    stream: "running water", trees: "trees", shore: "a shore", road: "a road",
    highSeat: "a high seat",
  };

  /* ======================================================== the rail ===== */
  function paintRail() {
    var S = E.state();

    var hpPct = Math.max(0, Math.min(100, S.health));
    var hpColour = S.health > 65 ? "#4d8a4d" : (S.health > 30 ? "#c9a15a" : "#b95050");
    $("ilp-vitals").innerHTML =
      row("Health", S.health) +
      '<div class="ilp-hp"><i style="width:' + hpPct + '%;background:' + hpColour + '"></i></div>' +
      /* THE COIN OF THE REALM. One gold dragon is 210 silver stags; the game
         counts in stags and says so, because "24 coin" is a number and
         "24 silver stags" is a place. */
      '<div class="ilp-vital ilp-purse" title="' + esc(E.money(S.coin)) + '"><span>Purse</span><b>' +
        esc(E.coinShort(S.coin)) + "</b></div>" +
      /* WHAT YOU LOOK LIKE, which is not what you have. Coin in a purse is
         invisible; a good cloak is not. The only way to move this number is
         to go to a tailor and spend. */
      '<div class="ilp-vital ilp-look" title="Coin does not show. Clothes, a cloak, steel on your hip and a horse under you do."><span>Taken for</span><b>' +
        esc(E.lookWord()) + "</b></div>" +
      row("Standing", S.standing) +
      row("Renown", S.renown) +
      row("Notoriety", S.notoriety) +
      row("Sworn to you", S.followers);

    /* the body's three demands, and the word for how badly they are being met */
    var dep = E.deprivation();
    $("ilp-needs").innerHTML = E.needs.map(function (n) {
      var v = S[n.id];
      var word = "";
      dep.why.forEach(function (w) { if (w.need === n.id) word = w.word; });
      var col = v > 55 ? "#4d8a4d" : (v > 25 ? "#c9a15a" : "#b95050");
      return '<div class="ilp-need">' +
        '<div class="ilp-need-top"><span>' + esc(n.name) + "</span>" +
          (word ? '<em class="ilp-need-word">' + esc(word) + "</em>" : "") +
          "<b>" + Math.round(v) + "</b></div>" +
        '<div class="ilp-need-bar"><i style="width:' + Math.max(0, Math.min(100, v)) +
          "%;background:" + col + '"></i></div></div>';
    }).join("");

    /* THE STRUCK-THROUGH NUMBERS. What you are, against what you can presently
       deliver — hunger takes it down and a sword on your hip puts it up, and
       BOTH are shown against the number they moved. The roll uses the second
       figure, so it has to be the one on the card. */
    var A = E.effAttrs();
    $("ilp-attrs").innerHTML = D.attrs.map(function (a) {
      var moved = prevAttrs && prevAttrs[a.id] != null && prevAttrs[a.id] !== A.base[a.id];
      var diff = A.eff[a.id] - A.base[a.id];
      var why = [];
      if (A.pen) why.push(A.pen + " lost to hunger, thirst or want of sleep");
      if (A.gear[a.id]) why.push((A.gear[a.id] > 0 ? "+" : "") + A.gear[a.id] + " from what you carry");
      return '<div class="ilp-attr' + (moved ? " bumped" : "") +
        (diff < 0 ? " starved" : (diff > 0 ? " kitted" : "")) +
        '" title="' + esc(a.blurb) + (why.length ? " — " + esc(why.join("; ")) : "") + '">' +
        "<span>" + esc(a.name) + "</span>" +
        (diff
          ? "<b><s>" + A.base[a.id] + "</s> " + A.eff[a.id] + "</b>"
          : "<b>" + A.base[a.id] + "</b>") +
        "</div>";
    }).join("");
    var note = [];
    if (A.pen) note.push("You are <b>" + esc(A.why.map(function (w) { return w.word; }).join(" and ")) +
      "</b>, and every attribute is " + A.pen + " lower until you see to it.");
    if (A.gearWhy.length) note.push("What you carry is worth " +
      A.gearWhy.map(function (g) {
        return "<i>" + esc(g.name) + "</i>";
      }).join(", ") + ".");
    $("ilp-attr-note").innerHTML = note.join(" ");
    prevAttrs = JSON.parse(JSON.stringify(A.base));

    /* ------------------------------------------------- what you carry ----- */
    /* Only the best thing in a slot counts, and the panel says which, because
       a player who owns a sword and a cudgel should not have to guess which of
       them the dice are using. */
    var kit = E.kit();
    $("ilp-kit").innerHTML = kit.length ? kit.map(function (k) {
      var bits = [];
      Object.keys(k.attr || {}).forEach(function (at) {
        if (!k.attr[at]) return;
        var an = E.byId(D.attrs, at);
        bits.push('<span class="ilp-kit-attr ' + (k.attr[at] > 0 ? "up" : "down") + '">' +
          (k.attr[at] > 0 ? "+" : "") + k.attr[at] + " " + esc(an ? an.name : at) + "</span>");
      });
      return '<div class="ilp-kititem' + (k.best ? "" : " spare") + '" title="' + esc(k.blurb) + '">' +
        '<div class="ilp-kit-name">' + esc(k.name) + (k.n > 1 ? " &times;" + k.n : "") +
          (k.best ? "" : ' <em>not in use</em>') + "</div>" +
        (bits.length ? '<div class="ilp-kit-bits">' + bits.join("") + "</div>" : "") +
        "</div>";
    }).join("") : '<span class="ilp-empty">Nothing but what you stand up in.</span>';

    /* ------------------------------------ what the world has decided ------ */
    var chips = [];
    NOTABLE.forEach(function (f) {
      if (S.flags[f.id]) chips.push('<span class="ilp-chip' + (f.bad ? " bad" : "") + '">' + esc(f.name) + "</span>");
    });
    S.holdings.forEach(function (h) { chips.push('<span class="ilp-chip">' + esc(h) + "</span>"); });
    $("ilp-chips").innerHTML = chips.length ? chips.join("") :
      '<span class="ilp-empty">Nothing, yet. Nobody has an opinion about you.</span>';
  }
  function row(label, v) {
    return '<div class="ilp-vital"><span>' + label + "</span><b>" + v + "</b></div>";
  }

  /* Flags worth showing. Everything else the deck sets is machinery the player
     never needs to see — a rail listing forty internal booleans is noise. */
  var NOTABLE = [
    { id: "knight", name: "knighted" }, { id: "lord", name: "a lord" },
    { id: "king", name: "crowned" }, { id: "married", name: "married" },
    { id: "nights-watch", name: "of the Night's Watch" }, { id: "ranger", name: "ranger" },
    { id: "maester", name: "a maester" }, { id: "septon", name: "sworn to the Faith" },
    { id: "faceless", name: "no-one" },
    { id: "outlaw", name: "outlaw", bad: true }, { id: "wanted", name: "wanted", bad: true },
    { id: "hunted", name: "hunted", bad: true }, { id: "imprisoned", name: "imprisoned", bad: true },
    { id: "enslaved", name: "enslaved", bad: true }, { id: "deserter", name: "a deserter", bad: true },
    { id: "indebted", name: "in debt to the Iron Bank", bad: true },
    { id: "sellsword", name: "a sellsword" }, { id: "reaver", name: "a reaver" },
    { id: "freefolk", name: "free folk" }, { id: "at-war", name: "at war" },
    { id: "soldier", name: "under a banner" }, { id: "oathbound", name: "oathbound" },
    { id: "founded-house", name: "head of your own house" },
    { id: "breaker-of-chains", name: "breaker of chains" },
    { id: "merciful", name: "known merciful" }, { id: "killer", name: "known killer", bad: true },
    { id: "informer", name: "an informer", bad: true }, { id: "turncloak", name: "a turncloak", bad: true },
  ];

  /* ======================================================= the scene ===== */
  function drawScene() {
    scene = E.nextScene();
    answered = false;
    /* A DEMANDING SCENE SHUTS EVERYTHING ELSE. There is a man in front of you;
       walking off to the market mid-sentence is not one of the things a person
       can do, and the game should not offer it as though it were. */
    setLocked(!!(scene && scene.demand), "demand");
    $("ilp-outcome").classList.add("hidden");
    $("ilp-opts").classList.remove("hidden");
    $("ilp-below").classList.remove("hidden");
    var wild = E.inWild();

    if (!scene) {
      /* No scene is not a dead end — it means the day is yours. Say so, and
         point at the panel where the doing happens. */
      $("ilp-kicker").textContent = wild ? "A day out here" : "A quiet season";
      $("ilp-dm").textContent = wild
        ? "Nobody is out here but you. What happens today is whatever you decide to do about being hungry, thirsty and a long way from a roof."
        : "Nothing much comes looking for you this season. What you do with it is your own affair.";
      $("ilp-opts").innerHTML = '<div class="ilp-nudge">&#8595; Choose something below &mdash; ' +
        (wild ? "there is food out here if you go and find it." : "act on your own, or take to the road.") + "</div>";
      $("ilp-outcome").classList.add("hidden");
      return;
    }

    $("ilp-kicker").textContent = E.state().flags.imprisoned ? "In the cell"
      : (wild ? "A day out here" : "The season turns");
    $("ilp-dm").textContent = E.fill(scene.dm);
    paintOptions();
    $("ilp-scene").style.animation = "none";
    void $("ilp-scene").offsetWidth;
    $("ilp-scene").style.animation = "";
  }

  function paintOptions() {
    var list = E.optionsFor(scene);
    $("ilp-opts").innerHTML = list.map(function (entry, i) {
      var o = entry.opt, meta = [];
      if (o.check) {
        var p = E.preview(o.check);
        var cls = p.chance >= 70 ? "odds-good" : (p.chance >= 45 ? "odds-fair" : "odds-bad");
        meta.push('<span class="ilp-tag roll">&#9860; ' + esc(p.attrName) + " " + p.attr +
          (p.bonus ? (p.bonus > 0 ? " +" + p.bonus : " " + p.bonus) : "") + " vs " + p.dc + "</span>");
        meta.push('<span class="ilp-tag ' + cls + '">' + p.chance + "% likely</span>");
      } else {
        meta.push('<span class="ilp-tag">certain</span>');
      }
      if (o.cost && o.cost.coin) meta.push('<span class="ilp-tag cost">' + esc(E.coinShort(o.cost.coin)) + "</span>");
      if (o.hint) meta.push('<span class="ilp-tag">' + esc(o.hint) + "</span>");

      return '<button type="button" class="ilp-opt" data-i="' + i + '"' + (entry.locked ? " disabled" : "") + ">" +
        '<span class="ilp-opt-lab">' + esc(E.fill(o.label)) + "</span>" +
        '<span class="ilp-opt-meta">' + meta.join("") + "</span>" +
        (entry.locked ? '<span class="ilp-opt-why">' + esc(entry.why) + "</span>" : "") +
        "</button>";
    }).join("");
  }

  /* ====================================================== the outcome ==== */
  function answer(i) {
    if (answered) return;
    var res = E.choose(scene, i);
    if (!res) return;
    answered = true;
    showOutcome(res, true);
  }

  function showOutcome(res, thenAdvance) {
    $("ilp-opts").classList.add("hidden");
    $("ilp-outcome").classList.remove("hidden");
    $("ilp-notes").innerHTML = "";
    setLocked(true, "spent");  /* the turn is spent — see the note on setLocked */

    if (res.roll) {
      var box = $("ilp-rollbox"), die = $("ilp-die");
      box.classList.remove("hidden");
      die.className = "ilp-die rolling";
      /* flicker, then land. The number the player sees settle is the number. */
      var flick = 0, spin = setInterval(function () {
        die.textContent = 1 + Math.floor(Math.random() * 20);
        if (++flick > 9) {
          clearInterval(spin);
          die.textContent = res.roll.die;
          die.className = "ilp-die" + (res.roll.crit ? " crit" : (res.roll.fumble ? " fumble" : ""));
        }
      }, 45);
      var r = res.roll;
      $("ilp-sum").innerHTML =
        '<span class="ilp-verdict ' + (r.ok ? "ok" : "no") + '">' +
          (r.crit ? "A natural twenty" : r.fumble ? "A natural one" : (r.ok ? "Success" : "Failure")) + "</span><br>" +
        "<b>" + r.die + "</b> on the die, <b>+" + r.attr + "</b> " + esc(r.attrName) +
        (r.bonus ? ", <b>" + (r.bonus > 0 ? "+" : "") + r.bonus + "</b> besides" : "") +
        " &nbsp;=&nbsp; <b>" + r.total + "</b> against <b>" + r.dc + "</b>.";
    } else {
      $("ilp-rollbox").classList.add("hidden");
    }

    $("ilp-text").textContent = res.text;
    $("ilp-ledger").innerHTML = (res.ledger || []).map(led).join("");

    if (res.died) return endGame();

    /* the season's own arithmetic, in the same ledger, on purpose */
    if (thenAdvance) {
      var adv = E.advance();
      if (adv) {
        $("ilp-notes").innerHTML = (adv.notes || []).map(function (n) {
          return '<div class="ilp-note ' + (n.good ? "good" : "bad") + '">' + esc(n.text) + "</div>";
        }).join("");
        if (adv.died) { paintRail(); return endGame(); }
      }
    }

    $("ilp-next").textContent = E.state().pending ? "And then →" : "The season turns →";
    paintCrown(); paintRail(); paintActions(); paintTravel(); paintMap(); paintLog();
    /* The repaint above rebuilds every button in the panels from scratch, which
       silently undid the lock: the panel LOOKED shut and every button in it was
       live again. Re-apply after drawing, never before. */
    setLocked(locked);
  }
  function led(l) {
    return '<span class="ilp-led ' + (l.good ? "good" : "bad") + (l.big ? " big" : "") + '">' + esc(l.text) + "</span>";
  }

  /* ================================================== THE TURN LOCK =====
     Three separate reasons everything below the card can be shut, and the
     player is told which one it is:

       spent   — you have made your decision for this turn. Before this you
                 could answer the scene, read the outcome, and then ALSO go
                 shopping with the same season, which meant no choice ever
                 cost anything because you could have the other one too.
       demand  — a scene with `demand: true` is on the table. Somebody is in
                 front of you and is not going to wait while you walk to the
                 market. Answer him.
       started — you opened an action. You do not get to browse the world with
                 a decision half-made; finish this one.

     Note what is NOT locked: the venue buttons are inside this panel and lock
     with it, but walking between venues at any other time is free and costs
     no turn at all. Standing somewhere is not a decision. */
  var LOCK_WHY = {
    spent: "&#128274; That was your decision for this turn. What is done is done &mdash; " +
      "take the season forward above to do anything else.",
    demand: "&#9888;&#65039; This is happening now. You are not going shopping, you are not " +
      "taking the road, and he is not going to wait while you think about it. <b>Answer him.</b>",
    started: "&#128274; You have started this. Choose one of the ways it goes &mdash; " +
      "there is no putting it back on the shelf.",
  };
  function setLocked(on, why) {
    locked = on;
    if (on && why) lockWhy = why;
    var below = $("ilp-below");
    below.classList.toggle("ilp-locked", on);
    below.setAttribute("aria-hidden", on ? "true" : "false");
    var msg = $("ilp-lockmsg");
    msg.classList.toggle("hidden", !on);
    msg.classList.toggle("urgent", on && lockWhy === "demand");
    msg.innerHTML = LOCK_WHY[lockWhy] || LOCK_WHY.spent;
    below.querySelectorAll("button").forEach(function (b) {
      if (b.classList.contains("ilp-tab")) return;   /* tabs stay readable */
      b.disabled = on;
    });
  }

  /* ====================================================== the actions ==== */
  /* ===================================================== GO SOMEWHERE ====
     A town is not one room. The street is where you arrive; the market, the
     smithy, the inn, the barracks, the back alleys are rooms inside it that
     you walk to. WALKING IS FREE — no turn is spent and nothing is locked,
     because deciding where to stand is not a decision the world should charge
     for. What you do once you are there costs the turn, as everything does. */
  function paintVenues() {
    var vs = E.venues();
    var host = $("ilp-venues"), hereBox = $("ilp-venue-here");
    if (!vs.length) {                       /* out in the country */
      host.innerHTML = "";
      hereBox.innerHTML = "";
      return;
    }
    var now = null;
    vs.forEach(function (v) { if (v.here) now = v; });
    host.innerHTML = '<div class="ilp-venue-lead">Go somewhere</div>' +
      '<div class="ilp-venue-row">' + vs.map(function (v) {
        return '<button type="button" class="ilp-venue' + (v.here ? " on" : "") +
          '" data-venue="' + esc(v.id) + '"><span class="ilp-venue-icon">' + (v.icon || "&#9679;") +
          "</span>" + esc(v.name) + "</button>";
      }).join("") + "</div>";
    hereBox.innerHTML = now
      ? '<b>' + esc(now.name) + "</b> &mdash; " + esc(now.blurb)
      : "";
  }

  function paintActions() {
    E.stage(null);            /* so every blurb below names the same square */
    paintVenues();
    var acts = E.actions();
    if (!acts.length) {
      $("ilp-actions").innerHTML = '<p class="ilp-empty">There is nothing to do here. Try somewhere else in this place, or take the road.</p>';
      return;
    }
    var groups = {}, order = [];
    acts.forEach(function (a) {
      var g = a.group || "Other";
      if (!groups[g]) { groups[g] = []; order.push(g); }
      groups[g].push(a);
    });
    $("ilp-actions").innerHTML = order.map(function (g) {
      return '<div class="ilp-act-group">' + esc(g) + "</div>" +
        '<div class="ilp-acts">' + groups[g].map(function (a) {
          return '<button type="button" class="ilp-act" data-act="' + esc(a.id) + '">' +
            '<span class="ilp-act-top"><span class="ilp-act-icon">' + (a.icon || "&#9679;") + "</span>" +
            '<span class="ilp-act-name">' + esc(firstLabel(a)) + "</span></span>" +
            '<span class="ilp-act-blurb">' + esc(E.fill(a.dm)) + "</span></button>";
        }).join("") + "</div>";
    }).join("");
  }
  function firstLabel(a) {
    return (a.opts && a.opts[0] && a.opts[0].label) || a.id;
  }

  /* Picking an action replaces the scene with it — the engine cannot tell the
     difference, so the player gets the same roll, the same ledger, the same
     season spent. */
  function takeAction(id) {
    if (locked) return;
    var a = null, list = E.actions();
    for (var i = 0; i < list.length; i++) if (list[i].id === id) a = list[i];
    if (!a) return;
    /* Resolve who and what this scene may name BEFORE any of it is drawn, so
       the opening line and the outcome speak about the same man. */
    E.stage(a);
    scene = a;
    answered = false;
    $("ilp-kicker").textContent = "You decide";
    $("ilp-dm").textContent = E.fill(a.dm);
    $("ilp-outcome").classList.add("hidden");
    $("ilp-opts").classList.remove("hidden");
    paintOptions();
    /* ONCE YOU HAVE STARTED IT, FINISH IT. Opening an action is a decision in
       itself; you do not get to leave it half-made on the table and go and
       browse the smithy. Every action carries at least one option that is not
       a commitment, so there is always a way through — it simply costs the
       turn like everything else. */
    setLocked(true, "started");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ========================================================== THE MAP ==== */
  /* The same basemap and the same 5652x3682 pixel space as map.html, so a pin
     here is in exactly the place the pin over there is. The light preview jpg
     is used rather than the ten-megabyte original — this panel is for deciding
     where to walk, not for reading the lettering.

     TWO KINDS OF CLICK, which is the whole point of it:
       on a pin   -> travel to that place
       on nothing -> walk out into the country AT THAT SPOT, wherever it is.
     The second is why the wilderness had to be a real place with real tags
     (see wildAt() in engine.js): you can put your finger on an unnamed stretch
     of the Kingswood, or the Dornish sand, or a bend of the Trident, and go
     there, and the game will have something to say about it. */
  var MAP_W = 5652, MAP_H = 3682;
  var START_VIEW = 2000;
  var view = null;

  /* HOW FAR IN YOU MAY GO — and the lesson that had to be learned twice.
     A ceiling expressed in MAP UNITS is the same mistake as a ceiling
     expressed in `scale`: 380 units across is three screen pixels per map
     pixel on a 1180px panel and less than one on a phone, so the small screen
     that needs the magnification most gets the least of it. The floor is
     therefore derived from what is actually on the glass — at least
     ZOOM_PX screen pixels for every pixel of the chart — and 380 units is
     kept only as a "no less than this" so a wide desktop never regresses. */
  var ZOOM_PX = 2.4, HARD_MIN_VIEW = 110;
  function minView() {
    if (!map) return 380;
    var rect = map.svg.getBoundingClientRect();
    if (!rect.width) return 380;
    return Math.max(HARD_MIN_VIEW, Math.min(380, rect.width / ZOOM_PX));
  }
  /* the viewBox has to match the SHAPE of the box it is drawn in, or the map
     letterboxes and half the panel is empty parchment */
  function viewAspect() {
    if (!map) return MAP_H / MAP_W;
    var rect = map.svg.getBoundingClientRect();
    return rect.width && rect.height ? rect.height / rect.width : MAP_H / MAP_W;
  }

  function buildMap() {
    var host = $("ilp-map");
    if (!host || map) return;
    host.innerHTML =
      '<div class="ilp-map-wrap" id="ilp-map-wrap">' +
        '<svg id="ilp-map-svg" viewBox="0 0 ' + MAP_W + " " + MAP_H + '" preserveAspectRatio="xMidYMid meet">' +
          '<image href="../assets/ASOIAF_map_redrawn_v6_preview.jpg" x="0" y="0" width="' + MAP_W + '" height="' + MAP_H + '" />' +
          '<g id="ilp-map-pins"></g>' +
          '<g id="ilp-map-me"></g>' +
          '<g id="ilp-map-mark"></g>' +
        "</svg>" +
        '<div class="ilp-map-zoom">' +
          '<button type="button" data-z="in" title="Closer">+</button>' +
          '<button type="button" data-z="out" title="Further out">&minus;</button>' +
          '<button type="button" data-z="me" title="Back to where you are">&#9678;</button>' +
          '<button type="button" data-z="all" title="The whole world">&#9744;</button>' +
        "</div>" +
      "</div>" +
      '<div class="ilp-map-read" id="ilp-map-read">Tap a place to go there. Tap open country to walk out into it. ' +
      'Scroll or pinch to zoom, drag to move about.</div>';
    map = { svg: $("ilp-map-svg"), wrap: $("ilp-map-wrap") };
    wireMap();
    centreOnMe(START_VIEW);
  }

  /* ---------------------------------------------------------- the viewBox - */
  function setView(cx, cy, w) {
    w = Math.max(minView(), Math.min(MAP_W, w));
    var h = w * viewAspect();
    /* a very tall panel can want more height than the chart has; let it hang
       over rather than refusing to zoom out */
    var x = Math.max(Math.min(0, MAP_W - w), Math.min(MAP_W - w, cx - w / 2));
    var y = Math.max(Math.min(0, MAP_H - h), Math.min(MAP_H - h, cy - h / 2));
    view = { x: x, y: y, w: w, h: h };
    map.svg.setAttribute("viewBox", x + " " + y + " " + w + " " + h);
    drawPins();
  }
  function centreOnMe(w) {
    var me = E.myXY();
    if (me) setView(me[0], me[1], w || (view ? view.w : START_VIEW));
    else setView(MAP_W / 2, MAP_H / 2, MAP_W);
  }
  function zoomBy(f, atX, atY) {
    if (!view) return centreOnMe();
    var cx = atX == null ? view.x + view.w / 2 : atX;
    var cy = atY == null ? view.y + view.h / 2 : atY;
    var nw = Math.max(minView(), Math.min(MAP_W, view.w * f));
    /* keep the point under the finger under the finger */
    var k = nw / view.w;
    var nx = cx - (cx - view.x) * k, ny = cy - (cy - view.y) * k;
    setView(nx + nw / 2, ny + (nw * viewAspect()) / 2, nw);
  }
  /* screen point -> map units */
  function toMap(clientX, clientY) {
    var pt = map.svg.createSVGPoint();
    pt.x = clientX; pt.y = clientY;
    var m = map.svg.getScreenCTM();
    if (!m) return null;
    var loc = pt.matrixTransform(m.inverse());
    return [loc.x, loc.y];
  }

  function wireMap() {
    var down = null, moved = 0, pointers = {}, pinch = null;

    map.svg.addEventListener("wheel", function (e) {
      e.preventDefault();
      var at = toMap(e.clientX, e.clientY);
      zoomBy(e.deltaY > 0 ? 1.25 : 0.8, at && at[0], at && at[1]);
    }, { passive: false });

    map.svg.addEventListener("pointerdown", function (e) {
      pointers[e.pointerId] = { x: e.clientX, y: e.clientY };
      var ids = Object.keys(pointers);
      if (ids.length === 2) {
        var a = pointers[ids[0]], b = pointers[ids[1]];
        pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), w: view.w };
      } else {
        down = { x: e.clientX, y: e.clientY, vx: view.x, vy: view.y };
        moved = 0;
      }
      map.svg.setPointerCapture(e.pointerId);
    });

    map.svg.addEventListener("pointermove", function (e) {
      if (!pointers[e.pointerId]) return;
      pointers[e.pointerId] = { x: e.clientX, y: e.clientY };
      var ids = Object.keys(pointers);
      if (ids.length === 2 && pinch) {
        var a = pointers[ids[0]], b = pointers[ids[1]];
        var d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d > 4) {
          var nw = pinch.w * (pinch.d / d);
          setView(view.x + view.w / 2, view.y + view.h / 2, nw);
        }
        moved = 99;
        return;
      }
      if (!down) return;
      var rect = map.svg.getBoundingClientRect();
      var perPx = view.w / rect.width;
      var dx = (e.clientX - down.x) * perPx, dy = (e.clientY - down.y) * perPx;
      moved = Math.max(moved, Math.abs(e.clientX - down.x) + Math.abs(e.clientY - down.y));
      setView(down.vx - dx + view.w / 2, down.vy - dy + view.h / 2, view.w);
    });

    /* SELECTION IS A CLICK; PANNING IS A POINTER DRAG.
       The two have to coexist: pointer events do the dragging and pinching,
       but if selection also rode on pointerup then a plain `click` — from a
       keyboard, from assistive tech, from any synthetic press — would never
       reach the map at all. So the click handler does the selecting and simply
       declines to fire when the pointer moved far enough to have been a drag. */
    /* SELECTION AND PANNING HAVE TO COEXIST.
       The pointer events do the dragging and the pinching, and a pointerup
       that did not move is a tap. But if selection rode on pointerup ALONE,
       a plain `click` — from a keyboard, from assistive tech, from anything
       synthetic — would never reach the map. So both are handled, and the
       second one to arrive is dropped by the stamp. */
    function tapped(e) {
      map.tapAt = Date.now();
      onMapTap(e);
    }
    function up(e) {
      delete pointers[e.pointerId];
      if (Object.keys(pointers).length < 2) pinch = null;
      map.lastMoved = down ? moved : 99;
      if (down && moved < 7) tapped(e);
      if (!Object.keys(pointers).length) down = null;
    }
    map.svg.addEventListener("pointerup", up);
    map.svg.addEventListener("click", function (e) {
      if (Date.now() - (map.tapAt || 0) < 600) return;      /* the pointer already did it */
      if (map.lastMoved >= 7) { map.lastMoved = 0; return; } /* that was a drag */
      tapped(e);
    });
    map.svg.addEventListener("pointercancel", function (e) { delete pointers[e.pointerId]; down = null; pinch = null; });

    map.wrap.querySelector(".ilp-map-zoom").addEventListener("click", function (e) {
      var b = e.target.closest("[data-z]");
      if (!b) return;
      if (b.dataset.z === "in") zoomBy(0.6);
      if (b.dataset.z === "out") zoomBy(1.7);
      if (b.dataset.z === "me") centreOnMe(1400);
      if (b.dataset.z === "all") setView(MAP_W / 2, MAP_H / 2, MAP_W);
    });
  }

  /* ------------------------------------------------------------ the pins -- */
  var pinCache = [];
  function drawPins() {
    if (!map || !view) return;
    var S = E.state(), meXY = E.myXY();
    /* dots and lettering are in map units, so they must be scaled against the
       viewBox or they are either invisible zoomed in or the size of a county
       zoomed out */
    var k = view.w / 2000;
    var r = Math.max(5, 16 * k), hit = Math.max(18, 52 * k), fs = Math.max(9, 34 * k);
    /* label everything when close in; only the nearest handful when far out,
       or the world is a wall of overlapping words */
    var labelAll = view.w < 2600;
    var near = pinCache.slice().sort(function (a, b) {
      return (a.leagues == null ? 1e9 : a.leagues) - (b.leagues == null ? 1e9 : b.leagues);
    }).slice(0, 8).map(function (p) { return p.id; });

    $("ilp-map-pins").innerHTML = pinCache.map(function (o) {
      if (o.x < view.x - 200 || o.x > view.x + view.w + 200 ||
          o.y < view.y - 200 || o.y > view.y + view.h + 200) return "";
      var afford = o.reachable && o.cost != null && S.coin >= o.cost;
      var label = labelAll || near.indexOf(o.id) >= 0;
      return '<g class="ilp-pin ilp-pin-' + o.kind + (afford ? "" : " poor") + '" data-place="' + esc(o.id) +
        '" transform="translate(' + o.x + "," + o.y + ')">' +
        '<circle class="ilp-pin-hit" r="' + hit + '"/>' +
        '<circle class="ilp-pin-dot" r="' + r + '"/>' +
        (label ? '<text class="ilp-pin-label" y="' + (-r - 6 * k) + '" style="font-size:' + fs + 'px">' +
          esc(o.name) + "</text>" : "") +
        "<title>" + esc(o.name) + (o.cost != null ? " — " + esc(E.coinShort(o.cost)) : "") +
          (o.leagues != null ? ", about " + o.leagues + " leagues" : "") + "</title></g>";
    }).join("");

    $("ilp-map-me").innerHTML = meXY
      ? '<g class="ilp-me" transform="translate(' + meXY[0] + "," + meXY[1] + ')">' +
        '<circle class="ilp-me-ring" r="' + (r * 2.4) + '"/><circle class="ilp-me-dot" r="' + (r * 1.2) + '"/>' +
        '<text class="ilp-pin-label ilp-me-label" y="' + (-r * 3) + '" style="font-size:' + fs + 'px">You are here</text></g>'
      : "";
  }

  function paintMap() {
    buildMap();
    if (!map) return;
    var S = E.state(), opts = E.travelOptions();

    /* one dot per place that has a coordinate; the rest live in the list
       below, which is why the list is still there */
    pinCache = opts.filter(function (o) { return o.x != null; });
    if (!view) centreOnMe(START_VIEW); else drawPins();

    /* OFF THE EDGE OF THE MAP. This basemap stops just below Slaver's Bay and
       just east of Qarth, so the Summer Isles, Asshai, Yi Ti and Ibben are not
       on it at all — no coordinate could be right. They are still places you
       can sail to, so they get buttons rather than dots. Same for the forty-odd
       smaller holdings the site has never pinned. */
    var off = opts.filter(function (o) { return o.x == null; });
    var wrap = $("ilp-map-off");
    if (!off.length) { wrap.innerHTML = ""; return; }
    off.sort(function (a, b) { return a.realm === b.realm ? 0 : (a.realm < b.realm ? -1 : 1); });
    wrap.innerHTML =
      '<div class="ilp-map-offhead">Not on this map</div>' +
      '<p class="ilp-map-offnote">The basemap stops below Slaver’s Bay and east of Qarth, and a good many ' +
      'smaller holdings were never drawn on it. No pin would be honest, so these are listed instead.</p>' +
      '<div class="ilp-offlist">' + off.map(function (o) {
        return '<button type="button" class="ilp-off" data-place="' + esc(o.id) + '"' +
          (o.reachable ? "" : " disabled") + '>' + esc(o.name) +
          '<span>' + esc(o.realm) + " &middot; " +
          (o.cost == null ? esc(o.why) : esc(E.coinShort(o.cost))) + "</span></button>";
      }).join("") + "</div>";
  }

  /* A TAP ON THE MAP IS ALWAYS A QUESTION, NEVER A JOURNEY.
     Nothing is spent and nothing moves until the dialog is answered. On a pin
     that means "travel to this place"; on bare ground it means "walk out into
     whatever is there", which the engine builds on the spot from the terrain
     under the finger. Every square inch of the chart is therefore somewhere
     you can go, not merely the hundred places that have a dot. */
  function onMapTap(e) {
    if (locked) return;
    var pin = e.target.closest && e.target.closest("[data-place]");
    if (pin) return askTravel({ id: pin.getAttribute("data-place") });

    var at = toMap(e.clientX, e.clientY);
    if (!at) return;
    var x = Math.round(at[0]), y = Math.round(at[1]);
    if (x < 0 || y < 0 || x > MAP_W || y > MAP_H) return;
    markSpot(x, y);
    askTravel({ wild: true, x: x, y: y });
  }
  function markSpot(x, y) {
    var k = view ? view.w / 2000 : 1;
    $("ilp-map-mark").innerHTML =
      '<g class="ilp-mark" transform="translate(' + x + "," + y + ')">' +
      '<circle r="' + (26 * k) + '"/><circle class="ilp-mark-in" r="' + (8 * k) + '"/></g>';
  }

  /* ======================================================== travel ======= */
  function paintTravel() {
    var S = E.state();
    if (S.flags.imprisoned) {
      $("ilp-travel").innerHTML = '<p class="ilp-empty">You are not going anywhere.</p>';
      return;
    }
    var opts = E.travelOptions();
    $("ilp-travel").innerHTML = opts.map(function (o) {
      return '<button type="button" class="ilp-dest" data-dest="' + esc(o.id) + '"' +
        (o.reachable ? "" : " disabled") + ">" +
        '<span class="ilp-dest-name">' + esc(o.name) + "</span> " +
        '<span class="ilp-dest-kind">' + esc(o.kind === "near" ? "in " + o.realm : o.realm) +
          (o.sea ? " &middot; over water" : "") + "</span>" +
        '<span class="ilp-dest-blurb">' + esc(o.blurb) + "</span>" +
        '<span class="ilp-opt-meta">' +
          (o.reachable
            ? '<span class="ilp-tag cost">from ' + esc(E.coinShort(o.cost)) + "</span>" +
              '<span class="ilp-tag">' + (o.estimated ? "a long way" : o.leagues + " leagues") + "</span>" +
              '<span class="ilp-tag">' + o.days + (o.days === 1 ? " day" : " days") + " at best</span>"
            : '<span class="ilp-tag bad">' + esc(o.why) + "</span>") +
        "</span></button>";
    }).join("");
  }

  /* ================================================ ARE YOU SURE? ========
     The dialog the whole travel system exists for. It names the place, prices
     every way of getting there, and says the sentence out loud before a single
     stag leaves your purse. Cancelling costs nothing at all. */
  var ask = null;

  function askTravel(target) {
    if (locked) return;
    var q = E.travelModes(target);
    if (!q) return;
    var S = E.state();
    var best = null;
    q.modes.forEach(function (m) {
      if (m.locked) return;
      if (S.coin < m.cost) return;
      if (!best || m.cost < best.cost) best = m;
    });
    if (!best) q.modes.forEach(function (m) { if (!best && !m.locked) best = m; });
    ask = { target: target, q: q, mode: best ? best.id : null };
    renderAsk();
    $("ilp-ask").classList.remove("hidden");
  }

  function renderAsk() {
    if (!ask) return;
    var q = ask.q, S = E.state();
    var chosen = null;
    q.modes.forEach(function (m) { if (m.id === ask.mode) chosen = m; });

    $("ilp-ask-kicker").textContent = q.wild
      ? "Off the road" : (q.sea ? "Over water" : "A journey");
    $("ilp-ask-title").textContent = "Travelling to " + q.name + "?";
    $("ilp-ask-blurb").textContent = q.blurb +
      (q.estimated ? " Nobody here can tell you exactly how far it is." : "");

    $("ilp-ask-ways").innerHTML = q.modes.map(function (m) {
      if (m.locked) {
        return '<div class="ilp-way shut"><span class="ilp-way-name">' + (m.icon || "") + " " +
          esc(m.name) + "</span><span class=\"ilp-way-why\">" + esc(m.why) + "</span></div>";
      }
      var poor = S.coin < m.cost;
      return '<button type="button" class="ilp-way' + (m.id === ask.mode ? " on" : "") +
        (poor ? " poor" : "") + '" data-way="' + esc(m.id) + '">' +
        '<span class="ilp-way-name">' + (m.icon || "") + " " + esc(m.name) + "</span>" +
        '<span class="ilp-way-note">' + esc(m.note) + "</span>" +
        '<span class="ilp-way-nums">' +
          '<span class="ilp-tag cost">' + (m.cost ? esc(E.coinShort(m.cost)) : "free") + "</span>" +
          '<span class="ilp-tag">' + m.days + (m.days === 1 ? " day" : " days") + "</span>" +
          '<span class="ilp-tag">' + hazard(m.risk) + "</span>" +
        "</span>" + (poor ? '<span class="ilp-way-why">You have not the coin for this.</span>' : "") +
        "</button>";
    }).join("");

    var line, can = false;
    if (!chosen) {
      line = "There is no way to get there from where you are standing.";
    } else if (S.coin < chosen.cost) {
      line = "That would cost you " + E.money(chosen.cost) + ", and you have " + E.money(S.coin) + ".";
    } else {
      can = true;
      line = "Travelling to " + q.name + " " + wayPhrase(chosen) + "? That will cost you " +
        (chosen.cost ? E.money(chosen.cost) : "nothing in coin") + ", and " +
        chosen.days + (chosen.days === 1 ? " day" : " days") + " of your life.";
    }
    $("ilp-ask-line").textContent = line;
    $("ilp-ask-yes").disabled = !can;
  }
  function wayPhrase(m) {
    return { foot: "on foot", ride: "on your own horse", wain: "by wain",
      escort: "with hired men", deck: "as deck passage", cabin: "in a cabin",
      fisher: "in a fishing boat", "own-ship": "in your own ship",
      "own-boat": "in your own boat" }[m.id] || "";
  }
  function hazard(dc) {
    if (dc <= 9) return "safe enough";
    if (dc <= 12) return "some risk";
    if (dc <= 16) return "a hard road";
    return "dangerous";
  }

  function closeAsk() { ask = null; $("ilp-ask").classList.add("hidden"); }

  function confirmTravel() {
    if (!ask || locked) return;
    var res = E.travelTo(ask.target, ask.mode);
    var wild = ask.q.wild;
    closeAsk();
    if (!res) return;
    afterMove(res, wild ? "Out of the gate" : "On the road");
  }

  function afterMove(res, kicker) {
    scene = null; answered = true;
    $("ilp-kicker").textContent = kicker;
    $("ilp-dm").textContent = "You go.";
    $("ilp-opts").innerHTML = "";
    showOutcome(res, true);
    /* the map must follow you, or the next thing the player sees is the
       country they just left */
    if (map) { $("ilp-map-mark").innerHTML = ""; centreOnMe(1400); }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ===================================================== the chronicle === */
  function paintLog() {
    var log = E.state().log.slice().reverse();
    $("ilp-logbody").innerHTML = log.map(function (l) {
      return '<div class="ilp-log-row ' + esc(l.kind) + '">' +
        '<span class="ilp-log-when">' + esc(l.season) + ", aged " + l.age + "</span>" +
        esc(l.text) + "</div>";
    }).join("");
  }

  /* ========================================================= the end ===== */
  function endGame() {
    var c = E.chronicle();
    $("ilp-live").classList.add("hidden");
    $("ilp-dead").classList.remove("hidden");

    /* the Cabinet, exactly as every other game reports in: one call */
    if (window.KWCollection) {
      window.KWCollection.record("ironladder", {
        right: Math.max(0, Math.floor(c.stats.score / 100)),
        streak: c.years,
        hard: c.stats.score >= 1000,
      });
      if (c.stats.score >= 1050) window.KWCollection.award("il-lord");
      if (c.ambitionMet) window.KWCollection.award("il-ambition");
      if (c.age >= 60) window.KWCollection.award("il-old");
      if (c.stats.holdings > 0) window.KWCollection.award("il-holding");
    }

    var stat = function (v, l) {
      return '<div class="ilp-end-stat"><b>' + v + "</b><span>" + l + "</span></div>";
    };

    $("ilp-dead").innerHTML =
      '<div class="ilp-end-kicker">Here ends the tale</div>' +
      '<div class="ilp-end-name">' + esc((c.titles.length ? c.titles.join(", ") + " " : "") + c.name) + "</div>" +
      '<div class="ilp-end-death">' + esc(c.death) + ", at " + c.place + ", aged " + c.age + ".</div>" +
      '<div class="ilp-end-rank">The world reckoned you: ' + esc(c.rank.now.name) + "</div>" +
      (c.verdict.length
        ? '<p class="ilp-end-verdict">In ' + c.years + " years you " + esc(joinList(c.verdict)) + ".</p>"
        : '<p class="ilp-end-verdict">In ' + c.years + " years you did very little that anybody wrote down. Most people do not.</p>") +
      '<div class="ilp-end-amb ' + (c.ambitionMet ? "met" : "missed") + '">' +
        "<b>" + esc(c.ambition) + ".</b> " +
        (c.ambitionMet
          ? "You got it — " + esc(c.ambitionWhy) + "."
          : "You did not get it. You wanted " + esc(c.ambitionWhy) + ", and the world had other business.") +
      "</div>" +
      '<div class="ilp-end-stats">' +
        stat(c.stats.score, "reckoning") + stat(c.stats.renown, "renown") +
        stat(c.stats.coin, "coin") + stat(c.stats.followers, "sworn") +
        stat(c.stats.kills, "killed") + stat(c.stats.spared, "spared") +
        stat(c.stats.secrets, "secrets") +
      "</div>" +
      '<div class="ilp-end-acts">' +
        '<a href="index.html">Begin another life &rarr;</a>' +
        '<button class="ghost" id="ilp-showlog">Read the whole chronicle</button>' +
      "</div>" +
      '<div class="ilp-log hidden" id="ilp-endlog" style="margin-top:22px;text-align:left"></div>';

    $("ilp-showlog").addEventListener("click", function () {
      var box = $("ilp-endlog");
      box.classList.toggle("hidden");
      if (!box.innerHTML) {
        box.innerHTML = c.log.map(function (l) {
          return '<div class="ilp-log-row ' + esc(l.kind) + '" style="color:var(--text-dark)">' +
            '<span class="ilp-log-when">' + esc(l.season) + ", aged " + l.age + "</span>" + esc(l.text) + "</div>";
        }).join("");
      }
      this.textContent = box.classList.contains("hidden") ? "Read the whole chronicle" : "Close the chronicle";
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function joinList(a) {
    if (a.length === 1) return a[0];
    return a.slice(0, -1).join(", ") + " and " + a[a.length - 1];
  }

  /* ========================================================== wiring ===== */
  function init() {
    var S = E.load();

    if (!S) {
      /* a character was made on index.html but no life has been started yet */
      var made = null;
      try { made = JSON.parse(localStorage.getItem("ilCharacter") || "null"); } catch (e) {}
      if (made && made.first && made.region && made.birth) {
        E.begin({
          first: made.first, last: made.last, region: made.region, place: made.place,
          birth: made.birth, house: made.house, work: made.work,
          perks: made.perks, ambition: made.ambition,
        });
        S = E.state();
      }
    }

    if (!S) { $("ilp-none").classList.remove("hidden"); return; }
    if (S.dead) { $("ilp-live").classList.add("hidden"); return endGame(); }

    $("ilp-live").classList.remove("hidden");
    paintCrown(); paintRail(); paintActions(); paintTravel(); paintMap(); paintLog();
    drawScene();
  }

  $("ilp-opts").addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("[data-i]");
    if (b && !b.disabled) answer(parseInt(b.dataset.i, 10));
  });
  $("ilp-next").addEventListener("click", function () {
    if (E.state().dead) return endGame();
    drawScene();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  $("ilp-actions").addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("[data-act]");
    if (b) takeAction(b.dataset.act);
  });
  /* walking between venues costs nothing and locks nothing */
  $("ilp-venues").addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("[data-venue]");
    if (!b || locked) return;
    E.goVenue(b.dataset.venue);
    paintActions();
  });
  $("ilp-travel").addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("[data-dest]");
    if (b && !b.disabled) askTravel({ id: b.dataset.dest });
  });
  /* the off-the-map list under the map panel */
  $("ilp-map-off").addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("[data-place]");
    if (b && !b.disabled) askTravel({ id: b.getAttribute("data-place") });
  });
  /* the are-you-sure dialog */
  $("ilp-ask-ways").addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("[data-way]");
    if (!b || !ask) return;
    ask.mode = b.dataset.way;
    renderAsk();
  });
  $("ilp-ask-yes").addEventListener("click", confirmTravel);
  $("ilp-ask-no").addEventListener("click", closeAsk);
  $("ilp-ask").addEventListener("click", function (e) { if (e.target === this) closeAsk(); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && ask) closeAsk();
  });
  document.querySelectorAll(".ilp-tab").forEach(function (t) {
    t.addEventListener("click", function () {
      document.querySelectorAll(".ilp-tab").forEach(function (x) { x.classList.remove("on"); });
      t.classList.add("on");
      ["act", "map", "trav", "log"].forEach(function (k) {
        $("ilp-tab-" + k).classList.toggle("hidden", k !== t.dataset.tab);
      });
    });
  });
  $("ilp-restart").addEventListener("click", function () {
    if (!window.confirm("Abandon this life? Everything that happened to them is lost, and you start again from nothing.")) return;
    E.wipe();
    try { localStorage.removeItem("ilCharacter"); } catch (e) {}
    window.location.href = "index.html";
  });

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
