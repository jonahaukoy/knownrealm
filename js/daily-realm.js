/* ============================================================================
   daily-realm.js — the shared "daily" apparatus for the games of the realm.

   Two jobs:
   1) Track whether today's DAILY has been done (per game), so a game can make
      the daily the thing you meet first and gate everything else behind a
      "Play unlimited" press.
   2) Render the full-screen CONGRATULATIONS / TOO-BAD result after a daily —
      a picture, a title, a line of text, and a "Play unlimited" button. Not a
      pop-up: a whole scene. The picture rotates by the day, from a small pool,
      so the reward feels like an occasion.

   Shared by smallcouncil/, wordle/, higherlower/ — each one folder deep, so
   asset paths resolve with "../". The images are the site's own gallery art.

   window.DailyRealm = {
     dayNumber(), todayStamp(),
     isDone(game) -> "win" | "lose" | null,
     markDone(game, won),
     renderResult(el, { won, onUnlimited, streak, prefix })
   }
   ========================================================================== */
(function () {
  "use strict";

  var EPOCH = Date.UTC(2026, 0, 1);
  function dayNumber() { return Math.floor((Date.now() - EPOCH) / 86400000); }
  function todayStamp() { var d = new Date(); return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate(); }

  function key(game) { return "drDaily:" + game; }
  function isDone(game) {
    try {
      var r = JSON.parse(localStorage.getItem(key(game)) || "null");
      if (r && r.stamp === todayStamp()) return r.won ? "win" : "lose";
    } catch (e) {}
    return null;
  }
  function markDone(game, won) {
    try { localStorage.setItem(key(game), JSON.stringify({ stamp: todayStamp(), won: !!won })); } catch (e) {}
  }

  /* ---- the picture pools (original captions; the art is the site's own) ---- */
  var WINS = [
    { img: "azor-ahai.webp", kicker: "The prince that was promised",
      title: "Azor Ahai Returned",
      text: "The red comet was for you. You are the warrior of light reborn, the blade drawn against the long night — and the dark drew back today." },
    { img: "ned-in-the-godswood.webp", kicker: "Your watch is kept",
      title: "You May Rest Now",
      text: "The work is done and done well, Lord Stark. The heart tree has heard your prayer. Sit a while by the black pool; you have earned the quiet." },
    { img: "tyrion-pissing-off-the-wall.webp", kicker: "From the top of the world",
      title: "On Top of the Wall",
      text: "You stood at the edge of the world, seven hundred feet up, and left your mark upon it. Few men can say as much. Fewer would admit it." },
    { img: "bran-flies-and-wakes.webp", kicker: "You opened the third eye",
      title: "You Are the Three-Eyed Raven",
      text: "You fell, and instead of dying you flew. Past the Wall, past the world, into all that ever was — and you came back knowing. The sight is yours." },
    { img: "king-in-the-north.webp", kicker: "They raise their swords",
      title: "The King in the North",
      text: "Blade after blade lifts in the torchlight, and every voice in the hall is shouting your name. The North remembers this day, and so will you." }
  ];
  var LOSSES = [
    { img: "blackwater2.webp", kicker: "The bay turned to green fire",
      title: "The Fire Took the Field",
      text: "Wildfire bloomed across the black water and swallowed the fleet whole — and your hopes with it. The tide goes out. Sail again tomorrow." },
    { img: "hound-rides-down-mycah.webp", kicker: "There was no outrunning it",
      title: "Ridden Down",
      text: "The Hound caught you on the kingsroad, and there was no mercy in the meeting — only hooves and a long fall. Rise, and take the road again." },
    { img: "tyrion-arrested-crossroads.webp", kicker: "Seized in a crowded room",
      title: "Taken at the Crossroads",
      text: "One word in a common inn and a dozen swords answered it. They are binding your hands for the sky cells. Your road ends here — for today." },
    { img: "ser-hughs-tilt.webp", kicker: "A splinter found the gorget",
      title: "Unhorsed",
      text: "The lance shattered, a shard went where no armour guarded, and the tourney was over before the dust settled. Mount up and ride again tomorrow." },
    { img: "tyrion-sky-cell.webp", kicker: "A long time to think",
      title: "Left to Contemplate",
      text: "The sky cell has no fourth wall, only the long blue drop and all the time in the world to consider where it went wrong. There is always tomorrow." }
  ];

  function pick(pool) { return pool[((dayNumber() % pool.length) + pool.length) % pool.length]; }
  function esc(s) { return String(s).replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }

  /* render the full result scene into `el` */
  function renderResult(el, opts) {
    opts = opts || {};
    var won = !!opts.won;
    var prefix = opts.prefix || "../";
    var s = won ? pick(WINS) : pick(LOSSES);
    var streakLine = "";
    if (won && typeof opts.streak === "number" && opts.streak > 0) {
      streakLine = '<div class="dr-streak">&#128293; ' + opts.streak +
        '-day streak &mdash; keep it alive tomorrow.</div>';
    }
    el.className = "dr-screen " + (won ? "dr-win" : "dr-lose");
    el.innerHTML =
      '<figure class="dr-figure">' +
        '<img src="' + prefix + 'assets/scenes/' + s.img + '" alt="" />' +
        '<figcaption class="dr-credit">Art &copy; Jon-Anders Hauk&oslash;y &middot; ' +
          '<a href="' + prefix + 'credits.html">credits</a></figcaption>' +
      '</figure>' +
      '<div class="dr-body">' +
        '<div class="dr-kicker">' + esc(s.kicker) + '</div>' +
        '<h2 class="dr-title">' + esc(s.title) + '</h2>' +
        '<p class="dr-text">' + esc(s.text) + '</p>' +
        streakLine +
        (opts.extraHTML || "") +
        '<button class="dr-unlimited" type="button">Play unlimited &rarr;</button>' +
      '</div>';
    var btn = el.querySelector(".dr-unlimited");
    if (btn && opts.onUnlimited) btn.addEventListener("click", opts.onUnlimited);
    return el;
  }

  window.DailyRealm = {
    dayNumber: dayNumber, todayStamp: todayStamp,
    isDone: isDone, markDone: markDone, renderResult: renderResult
  };
})();
