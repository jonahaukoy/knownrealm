/* ============================================================================
   THE IRON LADDER — THE ENGINE.

   The rules of the world, and nothing about how it looks. play.js draws what
   this returns; this file decides what happens.

   THE BARGAIN WITH THE PLAYER (the reason this is built the way it is):
   every uncertain thing is  d20 + attribute  against a stated difficulty, and
   the player is shown the die, the modifier and the number they needed —
   before the outcome is narrated. A life sim that hides its maths feels
   arbitrary; one that shows it feels like Dungeons & Dragons, where losing is
   part of the fun because you watched it happen fairly. Nothing here rolls in
   secret. Natural 20 always succeeds and pays extra; natural 1 always fails
   and costs extra, whatever the numbers said.

   A TURN is one season. Four to the year. Each turn the world offers a SCENE
   drawn from the deck, and the player may answer it or ignore it and take a
   deliberate ACTION instead — the two are the same shape, so an action is
   simply a scene the player summoned.

   CONSEQUENCE IS PERMANENT. There is one save. Death ends the life and writes
   the chronicle; the only way back is a new character. That is the whole
   engine's point, and why `dead` is never cleared — a new life is a new record.

   THE DECK KNOWS NOTHING ABOUT THE ENGINE. An event is data: conditions that
   say when it may fire, prose, and options with effects. Everything below is
   in service of making a new event a paste job into data-events.js.
   ========================================================================== */

window.ILEngine = (function () {
  "use strict";

  var KEY = "ilLife";
  var D = window.IL_DATA, W = window.IL_WORLD;
  var SEASONS = ["spring", "summer", "autumn", "winter"];

  /* ------------------------------------------------------------- helpers -- */
  function byId(list, id) {
    for (var i = 0; i < (list || []).length; i++) if (list[i].id === id) return list[i];
    return null;
  }
  function clamp(n, lo, hi) { return Math.max(lo, Math.min(hi, n)); }
  function d(n) { return 1 + Math.floor(Math.random() * n); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function weightedPick(list, wOf) {
    var total = 0, i;
    for (i = 0; i < list.length; i++) total += Math.max(0.0001, wOf(list[i]));
    var r = Math.random() * total;
    for (i = 0; i < list.length; i++) { r -= Math.max(0.0001, wOf(list[i])); if (r <= 0) return list[i]; }
    return list[list.length - 1] || null;
  }

  function realmOf(id) { return byId(W.realms, id); }
  function placeOf(id) { return byId(W.places, id); }
  function placesIn(realmId) {
    return W.places.filter(function (p) { return p.realm === realmId; });
  }
  function any(list, of) {
    for (var i = 0; i < of.length; i++) if (list.indexOf(of[i]) >= 0) return true;
    return false;
  }

  /* A DETERMINISTIC PICK. The lord of a village has to be the same lord when
     you walk back through the gate a year later, or the world is a slideshow.
     Anything seeded off a place id comes out the same every time. */
  function hash(str) {
    var h = 2166136261, i;
    str = String(str);
    for (i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = (h * 16777619) >>> 0; }
    return h >>> 0;
  }
  function stable(list, seed, salt) {
    if (!list || !list.length) return null;
    return list[hash(seed + "|" + (salt || "")) % list.length];
  }

  /* ================================================= THE COIN OF THE REALM ==
     One gold dragon is two hundred and ten silver stags, and a stag is fifty-
     six copper pennies. The game counts in STAGS, because that is the unit an
     ordinary life is actually priced in — a bed, a bowl, a day's labour. A
     dragon is what you say when the sum has become large enough to interest a
     lord, and pennies are what the prose says when it is beneath one. */
  var STAGS_PER_DRAGON = 210;
  function money(n) {
    n = Math.max(0, Math.round(n || 0));
    if (!n) return "nothing at all";
    var dr = Math.floor(n / STAGS_PER_DRAGON), st = n % STAGS_PER_DRAGON, out = [];
    if (dr) out.push(dr + (dr === 1 ? " gold dragon" : " gold dragons"));
    if (st) out.push(st + (st === 1 ? " silver stag" : " silver stags"));
    return out.join(" and ");
  }
  /* the same sum in the space a button has for it */
  function coinShort(n) {
    n = Math.max(0, Math.round(n || 0));
    var dr = Math.floor(n / STAGS_PER_DRAGON), st = n % STAGS_PER_DRAGON;
    if (dr && st) return dr + "d " + st + "s";
    if (dr) return dr + (dr === 1 ? " dragon" : " dragons");
    return st + (st === 1 ? " stag" : " stags");
  }

  /* ================================================================ STATE == */
  var S = null;

  /* THE CLOCK, AND WHY IT HAS TWO SPEEDS.
     Under a roof, a turn is a SEASON: you have a trade, a larder and somewhere
     to sleep, and the interesting unit of time is "what happened this winter".
     Out in the wild you have none of those, so a turn is a DAY, and the
     interesting question becomes whether you have eaten. Both are stored as
     days since birth-of-the-character, and season/year/age are derived, so
     there is exactly one number to keep straight. */
  var DAYS_PER_SEASON = 90, DAYS_PER_YEAR = 360, START_AGE = 16;

  function blank() {
    return {
      v: 4, name: "", first: "", last: "",
      realm: null, place: null, wild: null, birth: null, house: null, work: null,
      perks: [], ambition: null,
      day: 0, turn: 0,
      attrs: { might: 3, swiftness: 3, wits: 3, charm: 3, grit: 3, cunning: 3 },
      coin: 0, health: 100, standing: 0, renown: 0, notoriety: 0, followers: 0,
      /* the body's three demands. Full is 100; under a roof they are kept full
         by upkeep, and in the wild they are your whole problem. */
      food: 100, water: 100, rest: 100,
      flags: {}, items: {}, titles: [], rel: {},
      jail: 0, dead: false, deathReason: "", deathTurn: 0,
      log: [], seen: {}, pending: null, lastScene: null,
      kills: 0, spared: 0, holdings: [], secrets: 0,
      /* who is standing in front of you in the scene being played, resolved
         once when it is staged so the outcome names the same man as the
         opening line did. See stage(). */
      cast: null, castAt: "",
      /* where in the place you are standing. null is the street; everything
         else is a venue you walked into. Walking is free — see goVenue. */
      venue: null,
      /* a journey does not take a season because a season is the default; it
         takes as long as the road is. advance() reads this and clears it. */
      pendingDays: 0, travelling: false,
    };
  }

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {}
  }
  function load() {
    var raw = null;
    try { raw = localStorage.getItem(KEY); } catch (e) {}
    if (!raw) return null;
    var o; try { o = JSON.parse(raw); } catch (e) { return null; }
    if (!o || typeof o !== "object" || o.v !== 4) return null;
    /* fill any field a newer build added, so an old save is never half-formed */
    var base = blank(), k;
    for (k in base) if (!(k in o)) o[k] = base[k];
    for (k in base.attrs) if (typeof o.attrs[k] !== "number") o.attrs[k] = base.attrs[k];
    return o;
  }

  /* ================================================== BUILDING A CHARACTER = */
  /* `c` is what the creation screen produces. Every value is re-derived here
     rather than trusted, so a tampered save cannot walk in with 40 Might. */
  function begin(c) {
    var s = blank();
    var birth = byId(D.births, c.birth) || D.births[D.births.length - 1];
    var work = byId(D.works, c.work);

    /* THE PLACE IS AUTHORITATIVE. The creation screen calls the field `region`
       and this file calls it `realm`, which silently started every character in
       whichever realm happened to be first in the table while showing them the
       right town — "Flea Bottom, The North". Take either name, and then let the
       place overrule both, because a place knows what realm it is in and a
       hand-passed id does not. */
    var place = placeOf(c.place);
    var realm = realmOf(c.realm || c.region);
    if (place) realm = realmOf(place.realm) || realm;
    if (!realm) realm = W.realms[0];
    if (!place) place = placesIn(realm.id)[0];

    s.first = String(c.first || "").slice(0, 18);
    s.last = String(c.last || "").slice(0, 18);
    s.name = (s.first + " " + s.last).trim();
    s.realm = realm.id;
    s.place = place.id;
    s.birth = birth.id;
    s.house = c.house || null;
    s.work = work ? work.id : null;
    s.ambition = c.ambition || "survive";
    s.perks = (c.perks || []).filter(function (p) { return !!byId(D.perks, p); }).slice(0, D.perkPoints);

    var st = birth.start;
    s.coin = st.coin; s.health = st.health; s.standing = st.standing; s.followers = st.followers;

    var a = s.attrs, k;
    for (k in (birth.attr || {})) a[k] = (a[k] || 0) + birth.attr[k];
    if (work) for (k in (work.attr || {})) a[k] = (a[k] || 0) + work.attr[k];
    s.perks.forEach(function (pid) {
      var p = byId(D.perks, pid);
      for (var kk in (p.attr || {})) a[kk] = (a[kk] || 0) + p.attr[kk];
    });

    /* birth-borne flags the deck reads directly */
    if (birth.id === "slave") s.flags.enslaved = true;
    if (birth.id === "bastard") s.flags.bastard = true;
    if (birth.id === "trueborn" || birth.id === "landed") s.flags.highborn = true;
    if (birth.id === "freefolk") s.flags.freefolk = true;
    if (s.house) s.flags["house:" + s.house] = true;

    S = s;
    logLine("A life begins at " + place.name + ", in " + realm.name + ".");
    save();
    return S;
  }

  /* ============================================================= THE CLOCK = */
  function seasonIdx() { return Math.floor(S.day / DAYS_PER_SEASON) % 4; }
  function seasonName() { return SEASONS[seasonIdx()]; }
  function yearNo() { return Math.floor(S.day / DAYS_PER_YEAR); }
  function ageNow() { return START_AGE + yearNo(); }
  function ordinal(n) {
    var s = ["th", "st", "nd", "rd"], v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  }

  function logLine(text, kind) {
    S.log.push({ t: S.turn, age: ageNow(), season: seasonName(), text: text, kind: kind || "" });
    if (S.log.length > 400) S.log.splice(0, S.log.length - 400);
  }

  /* ============================================== WHERE YOU ARE STANDING = */
  /* A wild spot is a synthetic place with the same shape as a real one — an id,
     a name, a realm and tags — so every condition, every event and every line
     of the screen works on it unchanged. This is the whole trick that lets the
     player click empty ground on the map. */
  function here() { return S.wild || placeOf(S.place); }
  function inWild() { return !!S.wild; }

  /* ====================================================== WHAT A PLACE HAS ==
     "Drink at the well" is a foolish thing to offer a man standing in the
     Dornish sand and an obvious one to offer a man standing in a village
     square. Rather than write that judgement into every action by hand, a
     place declares its tags and this derives what is actually IN it. An action
     asks for an amenity and is simply never listed where there is none.

     Keep this closed, like the tag vocabulary it reads: an action asking for
     an amenity that is not in this table is an action that never appears. */
  var AMENITY = {
    well:    function (t) { return any(t, ["village", "town", "city", "market", "castle", "keep", "court", "warcamp"]); },
    inn:     function (t) { return any(t, ["village", "town", "city", "market", "port"]); },
    market:  function (t) { return any(t, ["market", "city", "port"]); },
    smith:   function (t) { return any(t, ["city", "town", "market", "castle", "warcamp"]); },
    brothel: function (t) { return any(t, ["city", "port"]) || (any(t, ["town"]) && any(t, ["crime", "market", "warcamp"])); },
    temple:  function (t) { return any(t, ["holy", "city", "castle", "court", "town"]); },
    stables: function (t) { return any(t, ["town", "city", "castle", "market", "court", "warcamp"]); },
    harbour: function (t) { return any(t, ["port"]); },
    watch:   function (t) { return any(t, ["city", "town", "castle", "court", "keep", "prison", "wall"]); },
    /* a maester is kept by a house or an order, not by a city — a chain in
       Flea Bottom was the sort of thing that made the panel read as generated */
    maester: function (t) { return any(t, ["castle", "court", "holy"]); },
    hall:    function (t) { return any(t, ["castle", "court", "keep"]); },
    crowd:   function (t) { return any(t, ["city", "town", "market", "port", "village", "warcamp", "court"]); },
    stream:  function (t) { return any(t, ["river", "marsh", "forest", "mountain"]) && !any(t, ["desert"]); },
    trees:   function (t) { return any(t, ["forest", "marsh"]); },
    shore:   function (t) { return any(t, ["sea", "port", "island"]); },
    road:    function (t) { return !any(t, ["island"]); },
    highSeat: function (t) { return any(t, ["court"]); },
  };
  function amenity(id) {
    var p = here(), f = AMENITY[id];
    if (!p || !f) return false;
    return !!f(p.tags || []);
  }

  /* ================================================== GOING SOMEWHERE ======
     A town is not one room. The street is where you arrive; the market, the
     smithy, the inn, the barracks and the rest are places inside it that you
     walk to. WALKING IS FREE — it costs no turn and locks nothing, because
     deciding where to stand is not a decision the world should charge you for.
     What you DO once you are there costs the turn, as everything does.

     A venue exists here only if the place has the amenity behind it, so this
     table needs no per-place data at all: the market is in every place with a
     market and in none of the others. */
  var VENUES = [
    { id: "street",  name: "The street",     icon: "&#127961;", need: null,
      blurb: "Where you are standing. People, noise, and whatever the day brings past you." },
    { id: "market",  name: "The market",     icon: "&#127978;", need: "market",
      blurb: "Stalls, boards and shouting. Everything here has a price and most of the prices are negotiable." },
    { id: "smith",   name: "The smithy",     icon: "&#128296;", need: "smith",
      blurb: "Heat, hammering, and steel on the wall that is worth more than you are." },
    { id: "inn",     name: "The inn",        icon: "&#127866;", need: "inn",
      blurb: "A common room, a fire, beds upstairs, and every traveller who has come through this place today." },
    { id: "brothel", name: "The house with the red lantern", icon: "&#127801;", need: "brothel",
      blurb: "Warm, loud, and the single best place in any city to hear a thing somebody meant to keep." },
    { id: "stables", name: "The stables",    icon: "&#128052;", need: "stables",
      blurb: "Horses, straw, and a dealer who has already decided how much you know about them." },
    { id: "harbour", name: "The harbour",    icon: "&#9875;",   need: "harbour",
      blurb: "Hulls, ropes, shouting, and the smell of the whole world arriving at once." },
    { id: "temple",  name: "The sept",       icon: "&#10024;",  need: "temple",
      blurb: "Whatever they keep here, they keep it quietly, and the door is not locked." },
    { id: "barracks", name: "The barracks",  icon: "&#128737;", need: "watch",
      blurb: "A yard, a rack of spears, and men who are paid to stand about and are bored of it." },
    { id: "hall",    name: "The hall",       icon: "&#127984;", need: "hall",
      blurb: "High table, hearth, and a lord in it who is either hearing people or refusing to." },
    { id: "maester", name: "The maester's turret", icon: "&#9939;", need: "maester",
      blurb: "Books, ravens, jars, and a man with a chain who knows more than anyone else here." },
    { id: "alleys",  name: "The back alleys", icon: "&#128374;", need: "crowd",
      blurb: "Off the main way. Nobody official comes down here and everybody down here knows it.",
      tags: ["poor", "crime"] },
    { id: "gate",    name: "The gate",       icon: "&#128682;", need: "watch",
      blurb: "Where the road comes in and everybody who arrives is looked at once." },
  ];

  function venues() {
    if (inWild()) return [];
    var p = here();
    return VENUES.filter(function (v) {
      if (v.need && !amenity(v.need)) return false;
      if (v.tags && !any(p.tags || [], v.tags)) return false;
      return true;
    });
  }
  function venueNow() {
    var id = S.venue || "street";
    var found = null;
    venues().forEach(function (v) { if (v.id === id) found = v; });
    if (!found) { S.venue = null; found = VENUES[0]; }
    return found;
  }
  /* free, and deliberately so */
  function goVenue(id) {
    var ok = false;
    venues().forEach(function (v) { if (v.id === id) ok = true; });
    S.venue = ok && id !== "street" ? id : null;
    save();
    return venueNow();
  }

  /* ============================================== WHAT YOU LOOK LIKE ======
     Coin in a purse is invisible. A man is read by the street off his cloak,
     his boots and whether there is steel on his hip — which is why the way to
     stop looking like a beggar is to go and BUY something, not to earn.
     0 is rags; 20 is somebody a guard bows to without being told. */
  function look() {
    var n = Math.floor(S.standing / 10);
    var c = bestIn("cloak");
    if (c) n += ITEMS[c].look || 0;
    var a = bestIn("armour");
    if (a) n += ITEMS[a].look || 0;
    if (bestIn("weapon")) n += 1;
    if (bestIn("mount")) n += 2;
    if (item("clothes-fine")) n += 4;
    if (item("clothes-court")) n += 7;
    if (has("knight")) n += 2;
    if (has("lord")) n += 3;
    if (S.health < 45) n -= 2;                 /* nobody rich looks like that */
    if (deprivation().pen >= 4) n -= 2;
    return clamp(n, 0, 20);
  }
  function lookWord() {
    var n = look();
    if (n >= 15) return "a great lord, or something dressed as one";
    if (n >= 11) return "somebody of consequence";
    if (n >= 7) return "respectable";
    if (n >= 4) return "an ordinary working person";
    if (n >= 2) return "poor but not desperate";
    return "somebody the watch moves along";
  }

  /* ================================================= WHO AND WHAT IS HERE ===
     A scene set in "a town" is a scene set nowhere, and the complaint that
     started this whole pass. These give the deck a house that holds the
     ground, a lord who sits in it, a face in the street, a named corner of the
     place and something to put in front of you to eat — all drawn from the
     realm the place belongs to, and STABLE where stability matters. The lord
     of Barrowton is the same lord next year; the man in the market is not. */
  function flavourFor(p) {
    var F = window.IL_FLAVOUR || { realms: {}, places: {} };
    var realm = (F.realms && F.realms[p.realm]) || {};
    var over = (F.places && F.places[p.id]) || {};
    function merged(k) {
      var a = over[k] && over[k].length ? over[k] : null;
      var b = realm[k] || [];
      return a ? a.concat(b) : b;
    }
    return {
      holder: over.holder || realm.holder || null,
      title: over.title || realm.title || null,
      folk: merged("folk"), houses: merged("houses"), spots: merged("spots"),
      dishes: merged("dishes"), drinks: merged("drinks"), trades: merged("trades"),
      note: over.note || null,
    };
  }

  /* Everything a scene may name, decided once and kept for the length of it. */
  function castFor(p) {
    var f = flavourFor(p);
    var surname = f.houses.length ? stable(f.houses, p.id, "house") : null;
    var lordFirst = f.folk.length ? stable(f.folk, p.id, "lord") : "Ossifer";
    var lordSur = f.houses.length ? stable(f.houses, p.id, "lordhouse") : surname;
    return {
      holder: f.holder || (surname ? "House " + surname : "whoever holds this ground"),
      lord: (f.title || "Lord") + " " + lordFirst + (lordSur ? " " + lordSur : ""),
      house: surname ? "House " + surname : "a small house of no great name",
      folk: (f.folk.length ? pick(f.folk) : "a man"),
      folk2: (f.folk.length ? pick(f.folk) : "another"),
      spot: (f.spots.length ? pick(f.spots) : "the square"),
      dish: (f.dishes.length ? pick(f.dishes) : "bread and hard cheese"),
      drink: (f.drinks.length ? pick(f.drinks) : "small beer"),
      trade: (f.trades.length ? pick(f.trades) : "whatever the season allows"),
      note: f.note || "",
    };
  }

  /* ONE CAST PER TURN, PER PLACE.
     Everything drawn this turn — the scene, the outcome, and the blurb on
     every button in the action panel — must name the same market square and
     the same man in it, or the screen reads as though the town rearranges
     itself between the list and the thing you clicked in it. So the cast is
     resolved once and then reused until the turn or the place changes. */
  function stage(ev) {
    var p = here(), key = S.turn + "|" + (p ? p.id : "-");
    if (!S.cast || S.castAt !== key) { S.cast = castFor(p); S.castAt = key; }
    return ev;
  }

  /* ================================================================ TOKENS = */
  function fill(text) {
    if (!text) return "";
    var p = here(), r = realmOf(S.realm);
    var h = S.house ? byId(D.houses[S.realm] || [], S.house) : null;
    var w = byId(D.works, S.work);
    var c = S.cast || castFor(p);
    var near = inWild() ? nearestSettlement() : null;
    return String(text)
      .replace(/\{name\}/g, S.name || S.first)
      .replace(/\{first\}/g, S.first)
      .replace(/\{place\}/g, p ? p.name : "here")
      .replace(/\{realm\}/g, r ? r.name : "the realm")
      .replace(/\{seat\}/g, r ? r.seat : "the seat")
      .replace(/\{house\}/g, h ? h.name : "your house")
      .replace(/\{work\}/g, w ? w.name.toLowerCase() : "your trade")
      .replace(/\{season\}/g, seasonName())
      /* the place, in its own words */
      .replace(/\{holder\}/g, c.holder)
      .replace(/\{lord\}/g, c.lord)
      .replace(/\{localhouse\}/g, c.house)
      .replace(/\{folk\}/g, c.folk)
      .replace(/\{folk2\}/g, c.folk2)
      .replace(/\{spot\}/g, c.spot)
      .replace(/\{dish\}/g, c.dish)
      .replace(/\{drink\}/g, c.drink)
      .replace(/\{trade\}/g, c.trade)
      .replace(/\{nearby\}/g, near ? near.name : (p && p.near) || "the nearest roof");
  }

  /* ============================================================ CONDITIONS = */
  function has(flag) { return !!S.flags[flag]; }
  function item(id) { return (S.items[id] || 0) > 0; }
  function placeTags() { var p = here(); return (p && p.tags) || []; }
  function hasTag(t) { return placeTags().indexOf(t) >= 0; }

  function meets(cond) {
    if (!cond) return true;
    var c = cond, i;

    var HERE = here();
    if (c.realms && c.realms.indexOf(S.realm) < 0) return false;
    if (c.notRealms && c.notRealms.indexOf(S.realm) >= 0) return false;
    if (c.places && (!HERE || c.places.indexOf(HERE.id) < 0)) return false;
    if (c.sides) {
      var r = realmOf(S.realm);
      if (!r || c.sides.indexOf(r.side) < 0) return false;
    }
    if (c.placeTags) { for (i = 0; i < c.placeTags.length; i++) if (!hasTag(c.placeTags[i])) return false; }
    if (c.anyPlaceTag) {
      var okTag = false;
      for (i = 0; i < c.anyPlaceTag.length; i++) if (hasTag(c.anyPlaceTag[i])) okTag = true;
      if (!okTag) return false;
    }
    if (c.notPlaceTags) { for (i = 0; i < c.notPlaceTags.length; i++) if (hasTag(c.notPlaceTags[i])) return false; }
    if (c.kinds && (!HERE || c.kinds.indexOf(HERE.kind) < 0)) return false;

    /* what is actually in this place. See AMENITY above — this is why the well
       stopped being offered in the middle of the desert. */
    if (c.amenities) { for (i = 0; i < c.amenities.length; i++) if (!amenity(c.amenities[i])) return false; }
    if (c.anyAmenity) {
      var okAm = false;
      for (i = 0; i < c.anyAmenity.length; i++) if (amenity(c.anyAmenity[i])) okAm = true;
      if (!okAm) return false;
    }
    if (c.notAmenities) { for (i = 0; i < c.notAmenities.length; i++) if (amenity(c.notAmenities[i])) return false; }

    /* what you have on you. "Strike him with your sword" is not an option a
       man without a sword should be reading. */
    /* WHAT YOU LOOK LIKE, not what you have. A purse is invisible; a cloak is
       not. Scenes about being taken for rich or for poor must ask this. */
    if (c.minLook != null && look() < c.minLook) return false;
    if (c.maxLook != null && look() > c.maxLook) return false;
    if (c.venues && c.venues.indexOf(venueNow().id) < 0) return false;

    if (c.armed === true && !armed()) return false;
    if (c.armed === false && armed()) return false;
    if (c.mounted === true && !mounted()) return false;
    if (c.mounted === false && mounted()) return false;
    if (c.armoured === true && !bestIn("armour")) return false;

    if (c.births && c.births.indexOf(S.birth) < 0) return false;
    if (c.works && c.works.indexOf(S.work) < 0) return false;
    if (c.ambition && c.ambition.indexOf(S.ambition) < 0) return false;

    if (c.perks) { for (i = 0; i < c.perks.length; i++) if (S.perks.indexOf(c.perks[i]) < 0) return false; }
    if (c.anyPerk) {
      var okPerk = false;
      for (i = 0; i < c.anyPerk.length; i++) if (S.perks.indexOf(c.anyPerk[i]) >= 0) okPerk = true;
      if (!okPerk) return false;
    }
    if (c.flags) { for (i = 0; i < c.flags.length; i++) if (!has(c.flags[i])) return false; }
    if (c.notFlags) { for (i = 0; i < c.notFlags.length; i++) if (has(c.notFlags[i])) return false; }
    if (c.anyFlag) {
      var okFlag = false;
      for (i = 0; i < c.anyFlag.length; i++) if (has(c.anyFlag[i])) okFlag = true;
      if (!okFlag) return false;
    }
    if (c.items) { for (i = 0; i < c.items.length; i++) if (!item(c.items[i])) return false; }
    if (c.notItems) { for (i = 0; i < c.notItems.length; i++) if (item(c.notItems[i])) return false; }
    if (c.anyItems) {
      var okIt = false;
      for (i = 0; i < c.anyItems.length; i++) if (item(c.anyItems[i])) okIt = true;
      if (!okIt) return false;
    }

    if (c.minAge != null && ageNow() < c.minAge) return false;
    if (c.maxAge != null && ageNow() > c.maxAge) return false;
    if (c.wild === true && !inWild()) return false;
    if (c.wild === false && inWild()) return false;
    if (c.minFood != null && S.food < c.minFood) return false;
    if (c.maxFood != null && S.food > c.maxFood) return false;
    if (c.maxWater != null && S.water > c.maxWater) return false;
    if (c.maxRest != null && S.rest > c.maxRest) return false;
    if (c.minCoin != null && S.coin < c.minCoin) return false;
    if (c.maxCoin != null && S.coin > c.maxCoin) return false;
    if (c.minStanding != null && S.standing < c.minStanding) return false;
    if (c.maxStanding != null && S.standing > c.maxStanding) return false;
    if (c.minRenown != null && S.renown < c.minRenown) return false;
    if (c.minNotoriety != null && S.notoriety < c.minNotoriety) return false;
    if (c.maxNotoriety != null && S.notoriety > c.maxNotoriety) return false;
    if (c.minFollowers != null && S.followers < c.minFollowers) return false;
    if (c.minHealth != null && S.health < c.minHealth) return false;
    if (c.maxHealth != null && S.health > c.maxHealth) return false;
    if (c.minTurn != null && S.turn < c.minTurn) return false;

    if (c.attr) for (var k in c.attr) if ((S.attrs[k] || 0) < c.attr[k]) return false;
    if (c.maxAttr) for (var k2 in c.maxAttr) if ((S.attrs[k2] || 0) > c.maxAttr[k2]) return false;

    if (c.chance != null && Math.random() > c.chance) return false;
    return true;
  }

  /* =============================================================== EFFECTS = */
  /* Returns a list of short human sentences describing what changed, so the
     screen can show the ledger without the deck having to write it out. */
  function apply(eff) {
    if (!eff) return [];
    var out = [], k;

    function num(field, label, value, invert) {
      if (!value) return;
      /* "everything you have" is written -9999 in the deck, which is convenient
         to write and absurd to read. Report what was actually lost. */
      if (field === "coin" && value < 0) value = -Math.min(S.coin, -value);
      if (!value) return;
      S[field] = S[field] + value;
      if (field === "health") S.health = clamp(S.health, -50, 130);
      if (field === "coin") S.coin = Math.max(0, S.coin);
      if (field === "standing") S.standing = clamp(S.standing, 0, 100);
      if (field === "notoriety") S.notoriety = clamp(S.notoriety, 0, 100);
      if (field === "renown") S.renown = Math.max(0, S.renown);
      if (field === "followers") S.followers = Math.max(0, S.followers);
      var good = invert ? value < 0 : value > 0;
      /* coin is counted in silver stags and reported as the realm reports it */
      if (field === "coin") {
        out.push({ text: (value > 0 ? "+" : "-") + coinShort(Math.abs(value)), good: good });
        return;
      }
      out.push({ text: (value > 0 ? "+" : "") + value + " " + label, good: good });
    }

    num("coin", "coin", eff.coin | 0);
    num("health", "health", eff.health | 0);
    num("standing", "standing", eff.standing | 0);
    num("renown", "renown", eff.renown | 0);
    num("notoriety", "notoriety", eff.notoriety | 0, true);
    num("followers", eff.followers === 1 || eff.followers === -1 ? "sworn man" : "sworn", eff.followers | 0);
    ["food", "water", "rest"].forEach(function (n) {
      if (!eff[n]) return;
      var before = S[n];
      S[n] = clamp(S[n] + eff[n], 0, 100);
      if (S[n] !== before) out.push({ text: (eff[n] > 0 ? "+" : "") + (S[n] - before) + " " + n, good: eff[n] > 0 });
    });

    if (eff.attr) for (k in eff.attr) {
      S.attrs[k] = clamp((S.attrs[k] || 0) + eff.attr[k], 0, 20);
      var an = byId(D.attrs, k);
      out.push({ text: (eff.attr[k] > 0 ? "+" : "") + eff.attr[k] + " " + (an ? an.name : k),
                 good: eff.attr[k] > 0, big: true });
    }

    (eff.flags || []).forEach(function (f) {
      if (f.charAt(0) === "-") delete S.flags[f.slice(1)];
      else S.flags[f] = true;
    });
    (eff.items || []).forEach(function (it) {
      if (it.charAt(0) === "-") {
        var id = it.slice(1);
        /* Losing a thing you never had is not an event. A branch may name
           several things to strip without knowing which of them you carry. */
        if (!S.items[id]) return;
        S.items[id] = Math.max(0, S.items[id] - 1);
        if (!S.items[id]) delete S.items[id];
        out.push({ text: "lost " + itemName(id), good: false });
      } else {
        S.items[it] = (S.items[it] || 0) + 1;
        out.push({ text: "gained " + itemName(it), good: true });
      }
    });

    /* EATING OUT OF YOUR OWN PACK. The numbers live on the item in ITEMS and
       nowhere else, so a bundle of rations is worth the same whether it is
       eaten in a market square or on the third day of a wood. */
    if (eff.consume) {
      var ct = ITEMS[eff.consume];
      if (ct && S.items[eff.consume]) {
        S.items[eff.consume]--;
        if (!S.items[eff.consume]) delete S.items[eff.consume];
        ["food", "water", "rest"].forEach(function (n) {
          if (!ct[n]) return;
          var was = S[n];
          S[n] = clamp(S[n] + ct[n], 0, 100);
          if (S[n] !== was) out.push({ text: "+" + (S[n] - was) + " " + n, good: true });
        });
        if (ct.health) { S.health = clamp(S.health + ct.health, -50, 130); out.push({ text: "+" + ct.health + " health", good: true }); }
        out.push({ text: "used " + ct.name, good: false });
      }
    }

    if (eff.title && S.titles.indexOf(eff.title) < 0) {
      S.titles.push(eff.title);
      out.push({ text: "styled " + eff.title, good: true, big: true });
    }
    if (eff.work !== undefined) { S.work = eff.work; }
    if (eff.holding) { S.holdings.push(eff.holding); out.push({ text: "took " + eff.holding, good: true, big: true }); }
    if (eff.kills) { S.kills += eff.kills; }
    if (eff.spared) { S.spared += eff.spared; }
    if (eff.secrets) { S.secrets += eff.secrets; }

    if (eff.jail) {
      S.jail = Math.max(S.jail, eff.jail);
      S.flags.imprisoned = true;
      out.push({ text: "imprisoned, " + S.jail + " seasons", good: false, big: true });
    }
    if (eff.free) { S.jail = 0; delete S.flags.imprisoned; out.push({ text: "free", good: true, big: true }); }

    if (eff.move) {
      var dest = eff.move, cand;
      /* A move that names a realm with no places in it — usually because
         somebody wrote a SIDE where a realm belongs — used to pick from an
         empty list and throw. Fall back to somewhere real rather than break
         the turn; the checker asserts the realm exists, so this is a net. */
      if (dest === "random") { cand = placesIn(S.realm); dest = (pick(cand) || here() || W.places[0]).id; }
      else if (typeof dest === "object" && dest.realm) {
        cand = placesIn(dest.realm).filter(function (p) { return p.birth !== false; });
        if (!cand.length) cand = placesIn(dest.realm);
        if (cand.length) S.realm = dest.realm; else cand = placesIn(S.realm);
        dest = (pick(cand) || here() || W.places[0]).id;
      }
      var pl = placeOf(dest);
      if (pl) {
        S.place = pl.id; S.realm = pl.realm;
        S.wild = null;                       /* being moved always puts a roof back */
        S.venue = null;                      /* and you arrive in the street */
        out.push({ text: "now at " + pl.name, good: true });
      }
    }
    if (eff.age) { S.day += eff.age * DAYS_PER_YEAR; }

    if (eff.rel) for (k in eff.rel) S.rel[k] = (S.rel[k] || 0) + eff.rel[k];

    if (eff.die) kill(eff.die);
    return out;
  }

  function itemName(id) {
    var t = ITEMS[id];
    return t ? t.name : id.replace(/-/g, " ");
  }

  /* ================================================================ THE KIT ==
     What you own is no longer a list of keys the deck checks. A blade on your
     hip is worth points of Might, and the world offers you different things to
     do with the man in front of you because of it; mail is worth a great deal
     of Grit and costs you Swiftness, which is the honest trade it has always
     been; a horse is the difference between a journey of weeks and a journey
     of months.

       slot   weapon / ranged / shield / armour / mount / cloak. Only the BEST
              thing in a slot counts — two swords do not make you twice armed.
              Anything with no slot is a tool, and tools all count.
       grade  which of two things in the same slot is the better one.
       attr   what carrying it is worth, applied to every roll and shown on
              the rail beside the number it moved.
       worth  what a smith would ask, in silver stags. The market screen and
              anything that sells your gear read this and nothing else.
   */
  var SLOTS = ["weapon", "ranged", "shield", "armour", "mount", "cloak"];
  var ITEMS = {
    /* --- what you hit people with ------------------------------------- */
    "knife":         { name: "a knife", slot: "weapon", grade: 1, worth: 8,
                       attr: { swiftness: 1 }, blurb: "Everyone has one. It is a tool that will do at a pinch." },
    "club":          { name: "a cudgel", slot: "weapon", grade: 1, worth: 4,
                       attr: { might: 1 }, blurb: "A length of wood with the end thickened. Legal everywhere, which is its whole advantage." },
    "axe":           { name: "a woodaxe", slot: "weapon", grade: 2, worth: 22,
                       attr: { might: 2 }, blurb: "Meant for timber, terrible on armour, and nobody looks twice at a man carrying one." },
    "spear":         { name: "a spear", slot: "weapon", grade: 2, worth: 26,
                       attr: { might: 1, grit: 1 }, blurb: "The weapon that has won more battles than every sword in the songs put together." },
    "sword":         { name: "a sword", slot: "weapon", grade: 3, worth: 45,
                       attr: { might: 1, swiftness: 1 }, blurb: "Plain, heavy, honest. Also a statement: only certain men carry one openly." },
    "good-sword":    { name: "a castle-forged sword", slot: "weapon", grade: 4, worth: 180,
                       attr: { might: 2, swiftness: 1 }, blurb: "Balanced, and it makes a sound when you draw it that changes how people speak to you." },
    "valyrian-steel": { name: "a Valyrian steel blade", slot: "weapon", grade: 6, worth: 8000,
                       attr: { might: 3, swiftness: 2 }, blurb: "Rippled dark steel that has never needed sharpening and never will. There are fewer than three hundred in the world." },
    "bow":           { name: "a bow", slot: "ranged", grade: 2, worth: 30,
                       attr: { swiftness: 1 }, blurb: "Yew and a dozen shafts. The weapon of men who would rather the fight happened over there." },
    "sling":         { name: "a sling", slot: "ranged", grade: 1, worth: 2,
                       attr: {}, blurb: "A strip of leather and whatever the road provides. Shepherds' work, and shepherds are better at it than knights expect." },

    /* --- what keeps you alive ----------------------------------------- */
    "shield":        { name: "a shield", slot: "shield", grade: 1, worth: 20,
                       attr: { grit: 1 }, blurb: "Oak and a rim of iron. Unglamorous, and it is why men come home." },
    "painted-shield": { name: "a shield with your own arms on it", slot: "shield", grade: 2, worth: 60,
                       attr: { grit: 1, charm: 1 }, blurb: "The same oak, painted. Half of knighthood is being recognisable at a distance." },
    "leathers":      { name: "boiled leather", slot: "armour", grade: 1, worth: 35, look: 1,
                       attr: { grit: 1 }, blurb: "Hardened hide. It will turn a knife and disappoint you against anything else." },
    "armour":        { name: "mail and a helm", slot: "armour", grade: 3, worth: 130, look: 3,
                       attr: { grit: 2, might: 1, swiftness: -1 }, blurb: "Heavy, hot, and the single best purchase anyone in this world can make." },
    "plate":         { name: "a suit of plate", slot: "armour", grade: 5, worth: 900, look: 6,
                       attr: { grit: 3, might: 1, swiftness: -2 }, blurb: "A lord's harness. Nearly nothing an ordinary man carries can get through it, and you cannot get up on your own." },
    "cloak-warm":    { name: "a fur cloak", slot: "cloak", grade: 2, worth: 40, look: 1,
                       attr: { grit: 1 }, blurb: "North of the Neck this is not a luxury, it is the difference between morning and no morning." },
    "cloak":         { name: "a lord's cloak", slot: "cloak", grade: 3, worth: 120, look: 4,
                       attr: { charm: 2 }, blurb: "Good cloth, well cut. People decide what you are before you have said a word, and this is what they decide it from." },

    /* --- what you are wearing under it ---------------------------------
       THE WHOLE POINT OF THESE: coin does not change how you are read. A man
       with three hundred stags in a purse and a torn tunic is a beggar with a
       secret. These are the only way to stop being one. */
    "clothes-fine":  { name: "good clothes, well cut", worth: 90, attr: { charm: 1 },
                       blurb: "Wool that fits and boots that match. Doors that were shut are merely closed." },
    "clothes-court": { name: "clothes fit for a hall", worth: 400, attr: { charm: 2 },
                       blurb: "Slashed sleeves, a worked belt, and a colour that has to be bought rather than made. People stand up." },

    /* --- what you eat out of your own pack -----------------------------
       Stackable, and consumed one at a time by "eat from your pack". These
       are the reason to go to a market before you go into the country. */
    "rations":       { name: "hard bread and salt meat", worth: 8, food: 50,
                       blurb: "It keeps for a season and it tastes like it. A day out of a hole, per bundle." },
    "dried-fruit":   { name: "dried figs and hard cheese", worth: 12, food: 35, health: 3,
                       blurb: "Light, sweet, and gone far too quickly. Worth the extra for what it does to a bad week." },
    "wineskin":      { name: "a skin of sour wine", worth: 9, water: 55, rest: 8,
                       blurb: "Safer than most water and considerably better company." },
    "water-full":    { name: "a full waterskin", worth: 2, water: 60,
                       blurb: "Filled at a well or a stream and carried. Two days of not dying." },
    "physick":       { name: "a maester's physick", worth: 45, health: 26,
                       blurb: "A stoppered jar and instructions you will not follow properly." },

    /* --- what carries you --------------------------------------------- */
    "mule":          { name: "a mule", slot: "mount", grade: 1, worth: 60,
                       attr: { grit: 1 }, blurb: "Slow, foul-tempered, and it will still be walking when a horse has lain down and died." },
    "horse":         { name: "a horse", slot: "mount", grade: 2, worth: 150,
                       attr: { swiftness: 2 }, blurb: "A rounsey. Not a warhorse and not a nag — a horse, which is more than most men in this world will ever own." },
    "courser":       { name: "a courser", slot: "mount", grade: 3, worth: 400,
                       attr: { swiftness: 3 }, blurb: "Bred for the road and fast on it. A man on one of these outruns most trouble." },
    "destrier":      { name: "a destrier", slot: "mount", grade: 4, worth: 1400,
                       attr: { swiftness: 2, might: 2 }, blurb: "A warhorse, trained to go towards the noise. Worth more than the men who ride beside it." },

    /* --- tools. These do not compete; carry them all ------------------- */
    "waterskin":     { name: "a waterskin", worth: 6, attr: {}, blurb: "Two days of not dying, if you fill it when you can rather than when you must." },
    "rope":          { name: "a coil of rope", worth: 9, attr: {}, blurb: "Nobody has ever regretted the rope." },
    "lantern":       { name: "a shuttered lantern", worth: 14, attr: {}, blurb: "Light you can hide, which is a different tool from light you cannot." },
    "tent":          { name: "an oiled tent", worth: 28, attr: { grit: 1 }, blurb: "The difference between sleeping outdoors and sleeping in the rain." },
    "whetstone":     { name: "a whetstone", worth: 3, attr: {}, blurb: "An edge is a thing you keep, not a thing you have." },
    "bandages":      { name: "linen and a needle", worth: 11, attr: {}, blurb: "You will either learn to use these or you will not need them for long." },
    "boat":          { name: "a fishing boat", worth: 220, attr: {}, blurb: "Small, slow and yours. Half the coast of the world is reachable no other way." },
    "ship":          { name: "a ship", worth: 4000, attr: { charm: 1 }, blurb: "A hull, a mast and men who answer to you. In Essos this is a title." },
    "letters":       { name: "a sealed letter", worth: 0, attr: {}, blurb: "Somebody's business, in somebody's hand, closed with somebody's wax." },
    "poison":        { name: "a vial of something unpleasant", worth: 200, attr: {}, blurb: "Bought in Lys and carried where nobody pats you down." },
    "dragon-egg":    { name: "a dragon's egg", worth: 12000, attr: { charm: 2 }, blurb: "Cold and heavy and beautiful, and stone, and everyone who has ever owned one has been sure it was not." },
    "seal":          { name: "a stolen seal", worth: 300, attr: { cunning: 1 }, blurb: "With this and a steady hand, a letter becomes an order." },
    "chain":         { name: "a maester's chain", worth: 0, attr: { wits: 2 }, blurb: "One link for every thing you sat and learned until you had it. It opens more doors than a sword." },
    "relic":         { name: "a holy relic", worth: 250, attr: { charm: 1 }, blurb: "A finger-bone in a box of silver-gilt. Whether it is anybody's finger is not the point of it." },
    "map":           { name: "a chart of strange coasts", worth: 90, attr: { wits: 1 }, blurb: "Inked on hide, wrong in three places, and worth a great deal to the right captain." },
    "coin-faceless": { name: "an iron coin", worth: 0, attr: {}, blurb: "A worthless piece of iron. Show it to the right man in Braavos and it is not." },
    "dog":           { name: "a dog that follows you", worth: 25, attr: { wits: 1 }, blurb: "It eats what you eat and wakes before you do, which is worth the half of a meal it costs." },
    "banner":        { name: "a banner of your own", worth: 0, attr: { charm: 1 }, blurb: "Cloth on a pole. Men follow it who would not follow you, which is the strangest thing about the world." },
  };

  /* only the best thing in a slot counts */
  function bestIn(slot) {
    var best = null;
    Object.keys(S.items).forEach(function (id) {
      var t = ITEMS[id];
      if (!t || t.slot !== slot || !S.items[id]) return;
      if (!best || (t.grade || 0) > (ITEMS[best].grade || 0)) best = id;
    });
    return best;
  }
  function gear() {
    var attr = {}, why = [], seen = {};
    function take(id) {
      var t = ITEMS[id];
      if (!t || seen[id]) return;
      seen[id] = 1;
      var moved = false, k;
      for (k in (t.attr || {})) {
        if (!t.attr[k]) continue;
        attr[k] = (attr[k] || 0) + t.attr[k];
        moved = true;
      }
      if (moved) why.push({ item: id, name: t.name, attr: t.attr });
    }
    SLOTS.forEach(function (s) { var id = bestIn(s); if (id) take(id); });
    Object.keys(S.items).forEach(function (id) {
      var t = ITEMS[id];
      if (t && S.items[id] && SLOTS.indexOf(t.slot) < 0) take(id);
    });
    return { attr: attr, why: why };
  }
  function armed() { return !!bestIn("weapon"); }
  function mounted() { return !!bestIn("mount"); }

  /* what you are carrying, in the order the rail should print it */
  function kit() {
    var out = [];
    SLOTS.forEach(function (s) {
      var id = bestIn(s);
      Object.keys(S.items).forEach(function (i) {
        var t = ITEMS[i];
        if (!t || t.slot !== s || !S.items[i]) return;
        out.push({ id: i, name: t.name, slot: s, best: i === id, attr: t.attr || {},
                   worth: t.worth || 0, blurb: t.blurb || "", n: S.items[i] });
      });
    });
    Object.keys(S.items).forEach(function (i) {
      var t = ITEMS[i];
      if (!S.items[i]) return;
      if (t && SLOTS.indexOf(t.slot) >= 0) return;
      out.push({ id: i, name: t ? t.name : i.replace(/-/g, " "), slot: "tool", best: true,
                 attr: (t && t.attr) || {}, worth: (t && t.worth) || 0,
                 blurb: (t && t.blurb) || "", n: S.items[i] });
    });
    return out;
  }

  /* ========================================== HUNGER, THIRST, EXHAUSTION = */
  /* A starving man is not merely inconvenienced — he is worse at everything.
     These penalties come off EVERY attribute, they are applied to every roll,
     and the rail shows them in red beside the number they were taken from, so
     the player can always see what they would be if they had eaten. */
  var NEEDS = [
    { id: "food",  name: "Food",  low: "hungry",   bad: "starving",
      steps: [[40, 1, "hungry"], [20, 2, "famished"], [8, 4, "starving"]] },
    { id: "water", name: "Water", low: "thirsty",  bad: "parched",
      steps: [[40, 1, "thirsty"], [20, 3, "parched"], [8, 5, "dying of thirst"]] },
    { id: "rest",  name: "Rest",  low: "tired",    bad: "sleepless",
      steps: [[35, 1, "tired"], [15, 2, "exhausted"], [5, 3, "sleepless"]] },
  ];

  function deprivation() {
    var pen = 0, why = [];
    NEEDS.forEach(function (n) {
      var v = S[n.id], worst = null;
      n.steps.forEach(function (st) { if (v < st[0]) worst = st; });
      if (worst) { pen += worst[1]; why.push({ need: n.id, word: worst[2], cost: worst[1] }); }
    });
    return { pen: pen, why: why };
  }

  /* base = what the character is; eff = what the body can presently deliver
     with what it is presently carrying. THE ROLL USES eff, which is why the
     rail has to show eff — an option that advertises odds off the base number
     is lying to the player about the dice it is going to throw. */
  function effAttrs() {
    var dp = deprivation(), g = gear();
    var out = { base: {}, eff: {}, gear: g.attr, gearWhy: g.why, pen: dp.pen, why: dp.why };
    Object.keys(S.attrs).forEach(function (k) {
      out.base[k] = S.attrs[k];
      out.eff[k] = Math.max(0, S.attrs[k] + (g.attr[k] || 0) - dp.pen);
    });
    return out;
  }
  function attrNow(id) {
    return Math.max(0, (S.attrs[id] || 0) + (gear().attr[id] || 0) - deprivation().pen);
  }

  /* ================================================================= ROLLS = */
  function bonusFor(check) {
    var b = 0;
    (check.perkBonus || []).forEach(function (pb) {
      if (S.perks.indexOf(pb.perk) >= 0) b += pb.n;
    });
    (check.flagBonus || []).forEach(function (fb) {
      if (has(fb.flag)) b += fb.n;
    });
    (check.itemBonus || []).forEach(function (ib) {
      if (item(ib.item)) b += ib.n;
    });
    if (check.followerBonus) b += Math.min(check.followerBonus.max || 5, Math.floor(S.followers / (check.followerBonus.per || 5)));
    if (S.health < 50) b -= 2;                /* hurt men roll worse */
    if (S.health < 25) b -= 2;
    return b;
  }

  /* What the screen shows on the option BEFORE it is pressed. Showing the odds
     is not a convenience — it is the whole bargain. A player who knew it was a
     one-in-four and took it anyway owns the outcome; one who did not, doesn't. */
  function preview(check) {
    var attr = attrNow(check.attr);
    var bonus = bonusFor(check);
    var need = check.dc - attr - bonus;          /* the die must beat this */
    var ways = clamp(21 - need, 1, 19);          /* nat 20 always, nat 1 never */
    return {
      attrId: check.attr, attr: attr, base: S.attrs[check.attr] || 0,
      starved: deprivation().pen, kit: gear().attr[check.attr] || 0, bonus: bonus, dc: check.dc,
      attrName: (byId(D.attrs, check.attr) || { name: check.attr }).name,
      chance: Math.round((ways / 20) * 100),
    };
  }

  function roll(check) {
    var die = d(20);
    var attr = attrNow(check.attr);
    var bonus = bonusFor(check);
    var total = die + attr + bonus;
    var ok = total >= check.dc;
    if (die === 20) ok = true;
    if (die === 1) ok = false;
    return {
      die: die, attr: attr, attrId: check.attr, bonus: bonus, total: total, dc: check.dc,
      ok: ok, crit: die === 20, fumble: die === 1,
      attrName: (byId(D.attrs, check.attr) || { name: check.attr }).name,
    };
  }

  /* ============================================================ THE DECKS = */
  function deck() { return (window.IL_EVENTS || []).concat(window.IL_CHAINS || []); }

  function eventById(id) {
    var all = deck();
    for (var i = 0; i < all.length; i++) if (all[i].id === id) return all[i];
    return null;
  }

  /* Which options of an event this character may actually take. An option the
     player cannot take is still SHOWN, greyed, with the reason — a locked door
     you can see is content; one you cannot is nothing. */
  function optionsFor(ev) {
    return (ev.opts || []).map(function (o) {
      var why = "";
      if (o.req && !meets(o.req)) why = o.reqWhy || "Not open to you.";
      if (!why && o.cost && o.cost.coin && S.coin < o.cost.coin) why = "You have not the coin.";
      if (!why && o.cost && o.cost.followers && S.followers < o.cost.followers) why = "You have not the men.";
      return { opt: o, locked: !!why, why: why };
    });
  }

  function nextScene() {
    if (S.pending) {
      var forced = eventById(S.pending);
      S.pending = null;
      if (forced) return stage(forced);
    }
    /* Out here the world mostly leaves you alone, which is exactly the point:
       in a town things happen TO you, and in the wild the only thing that
       happens is what you decide to do about being hungry. */
    if (inWild() && Math.random() < 0.5) return null;
    var pool = deck().filter(function (e) {
      if (e.chain) return false;                       /* only reachable by goto */
      if (e.once && S.seen[e.id]) return false;
      if (e.max && (S.seen[e.id] || 0) >= e.max) return false;
      if (!meets(e.when)) return false;
      if (e.id === S.lastScene) return false;          /* never twice running */
      if (!optionsFor(e).some(function (o) { return !o.locked; })) return false;
      return true;
    });
    /* NOTHING HAPPENS TWICE WHILE ANYTHING NEW IS LEFT.
       A world that repeats itself is not a world, and "that already happened
       to me" is the one complaint no amount of good writing survives. So the
       fresh events are taken as the whole pool whenever there are any; the
       seen ones are only ever a fallback for a character who has outlived the
       deck, and even then a filler is preferred to a rerun. */
    var fresh = pool.filter(function (e) { return !S.seen[e.id]; });
    if (fresh.length) pool = fresh;
    else {
      var fill = deck().filter(function (e) { return e.filler && meets(e.when); });
      if (fill.length) pool = fill;
    }
    if (!pool.length) {
      pool = deck().filter(function (e) { return e.filler && meets(e.when); });
    }
    if (!pool.length) return null;
    return stage(weightedPick(pool, function (e) {
      var w = e.w == null ? 3 : e.w;
      /* the deck leans toward what the character said they wanted */
      if (e.ambition && e.ambition === S.ambition) w *= 2.2;
      /* something already seen is less likely than something new */
      if (S.seen[e.id]) w *= 0.2;
      return w;
    }));
  }

  /* ========================================================== RESOLVING === */
  /* Returns everything the screen needs to narrate one decision:
       { text, ledger:[...], roll:{...}|null, died:bool, goto:id|null } */
  function choose(ev, optIndex) {
    var entry = optionsFor(ev)[optIndex];
    if (!entry || entry.locked) return null;
    var o = entry.opt;

    S.seen[ev.id] = (S.seen[ev.id] || 0) + 1;
    S.lastScene = ev.id;

    var ledger = [], r = null, branch;

    if (o.cost) {
      if (o.cost.coin) { S.coin -= o.cost.coin; ledger.push({ text: "-" + o.cost.coin + " coin", good: false }); }
      if (o.cost.health) { S.health -= o.cost.health; ledger.push({ text: "-" + o.cost.health + " health", good: false }); }
    }

    if (o.check) {
      r = roll(o.check);
      branch = r.ok ? o.pass : o.fail;
      if (r.crit && o.crit) branch = o.crit;
      if (r.fumble && o.fumble) branch = o.fumble;
    } else {
      branch = o.res;
    }
    branch = branch || { text: "Nothing comes of it." };

    ledger = ledger.concat(apply(branch.eff));
    var text = fill(branch.text);

    /* a critical is worth something over and above the written outcome, or the
       natural 20 is just a word on the screen */
    if (r && r.crit && !o.crit) {
      var extra = apply({ renown: 1, attr: pickAttrBump(o.check.attr) });
      ledger = ledger.concat(extra);
    }
    if (r && r.fumble && !o.fumble) {
      ledger = ledger.concat(apply({ health: -4 }));
    }

    logLine(fill(o.label) + " — " + text, r ? (r.ok ? "ok" : "bad") : "");

    var died = S.dead;
    if (!died) died = checkDeath();

    var out = { text: text, ledger: ledger, roll: r, died: died, goto: branch.goto || null };
    if (branch.goto) S.pending = branch.goto;
    save();
    return out;
  }
  function pickAttrBump(id) { var o = {}; o[id] = 1; return o; }

  /* =============================================================== A TURN = */
  /* Called after an outcome is read. Advances the season and applies the
     standing costs of simply being alive. */
  function advance() {
    if (S.dead) return null;
    var notes = [];
    var wasAge = ageNow();

    S.turn++;
    /* A JOURNEY TAKES AS LONG AS THE ROAD IS. Everything else takes a season
       under a roof or a day in the open; travelTo() writes the real number of
       days here and this is where it is spent. */
    var step = S.pendingDays || (inWild() ? 1 : DAYS_PER_SEASON);
    var wasTravelling = S.travelling;
    S.pendingDays = 0; S.travelling = false;
    S.day += step;
    if (ageNow() !== wasAge) notes.push({ text: "You are " + ageNow() + " now.", good: true });

    /* ---- a season spent on the road is not a season spent anywhere -------
       No wage, because you were not at your trade. No larder, because you had
       none. What you could do was buy food along the way, and that is dearer
       than buying it at home, which is the whole reason travelling is a thing
       people avoid. */
    if (wasTravelling) {
      var road = Math.max(2, Math.round((3 + Math.floor(S.standing / 12)) * step / 45));
      if (S.coin >= road) {
        S.coin -= road;
        S.food = clamp(S.food + 30, 0, 100);
        S.water = clamp(S.water + 45, 0, 100);
        S.rest = clamp(S.rest + 25, 0, 100);
        notes.push({ text: "-" + road + " on food and beds along the way", good: false });
      } else {
        S.coin = 0;
        S.health -= 6;
        notes.push({ text: "You travelled on what you could beg and find, and it shows.", good: false });
      }
      if (S.health < 100 && S.food > 40) S.health = Math.min(100, S.health + 2);
      var dpT = deprivation();
      if (dpT.pen) {
        notes.push({ text: "You arrive " + dpT.why.map(function (w) { return w.word; }).join(" and ") +
          " — everything you attempt is " + dpT.pen + " worse until you see to it.", good: false });
      }
      return finishTurn(notes);
    }

    /* ---- out in the wild: a day at a time, and the body keeps its accounts --- */
    if (inWild() && S.jail <= 0) {
      var hardy = S.perks.indexOf("hardy") >= 0 || S.perks.indexOf("iron-stomach") >= 0 ? 0.7 : 1;
      var cold = hasTag("cold") ? 1.25 : 1;
      var hot = hasTag("hot") || hasTag("desert") ? 1.35 : 1;
      S.food = clamp(S.food - Math.round(10 * hardy * cold), 0, 100);
      S.water = clamp(S.water - Math.round(15 * hardy * hot), 0, 100);
      S.rest = clamp(S.rest - Math.round(12 * hardy), 0, 100);

      if (S.food <= 0) { S.health -= 7; notes.push({ text: "You have not eaten. It is starting to take you apart.", good: false }); }
      if (S.water <= 0) { S.health -= 12; notes.push({ text: "No water. This is the one that kills quickly.", good: false }); }
      if (S.rest <= 0) { S.health -= 4; notes.push({ text: "You cannot keep your eyes open.", good: false }); }
      if (hasTag("cold") && S.rest < 30) { S.health -= 4; notes.push({ text: "You are too tired to keep warm.", good: false }); }

      var dep = deprivation();
      if (dep.pen) {
        notes.push({ text: "You are " + dep.why.map(function (w) { return w.word; }).join(" and ") +
          " — everything you attempt is " + dep.pen + " worse.", good: false });
      }
      return finishTurn(notes);
    }

    /* prison: nothing else happens in a cell */
    if (S.jail > 0) {
      S.jail--;
      if (S.jail <= 0) {
        delete S.flags.imprisoned;
        notes.push({ text: "Your term is served. The door opens.", good: true });
      }
      S.health -= 3;
      S.food = clamp(S.food - 25, 0, 100);
      S.rest = clamp(S.rest - 20, 0, 100);
      if (S.health < 40) notes.push({ text: "The cells are doing you harm.", good: false });
      return finishTurn(notes);
    }

    /* ---- wages -----------------------------------------------------------
       NO TRADE, NO WAGE. A wage is something a job pays you, and a character
       who has never taken one has no business being handed coin every season
       for existing. `work` may be null, or the "idle" trade, or you may have
       been dismissed — in all three cases the season pays nothing and the
       only coin in this game is coin you went and got. */
    var w = byId(D.works, S.work);
    var employed = !!(w && w.wage > 0 && !has("enslaved") && !has("unemployed"));
    if (employed) {
      var pay = Math.round(w.wage * (0.7 + Math.random() * 0.7));
      if (has("outlaw")) pay = Math.round(pay * 0.5);
      S.coin += pay;
      notes.push({ text: "+" + coinShort(pay) + " from your trade", good: true });
    } else if (!has("enslaved")) {
      notes.push({ text: "No trade, so no wage. Whatever you have, you went and got.", good: false });
    }

    /* ---- the body, in a town ---------------------------------------------
       A SEASON IS THREE MONTHS AND YOU EAT EVERY DAY OF IT. Under a roof the
       bars fall as they do anywhere; what a roof buys is that you can do
       something about it. Paying your upkeep is board and lodging — it very
       nearly keeps pace and does not quite, which is the point: over a few
       seasons you will get hungry and have to go and eat on purpose.
       Not paying it is the old sharp decline. */
    var upkeep = 3 + Math.floor(S.standing / 12) + Math.floor(S.followers / 3);
    S.food = clamp(S.food - 45, 0, 100);
    S.water = clamp(S.water - 50, 0, 100);
    S.rest = clamp(S.rest - 35, 0, 100);
    if (S.coin >= upkeep) {
      S.coin -= upkeep;
      S.food = clamp(S.food + 32, 0, 100);
      S.water = clamp(S.water + 42, 0, 100);
      S.rest = clamp(S.rest + 48, 0, 100);
      notes.push({ text: "-" + coinShort(upkeep) + " on board and lodging", good: false });
    } else {
      var short = upkeep - S.coin;
      S.coin = 0;
      S.health -= Math.min(14, 3 + short);
      notes.push({ text: "You cannot pay for a bed or a meal. You go hungry.", good: false });
      if (S.followers > 0 && Math.random() < 0.5) {
        S.followers--;
        notes.push({ text: "A sworn man leaves for someone who can feed him.", good: false });
      }
    }
    var dpTown = deprivation();
    if (dpTown.pen) {
      notes.push({ text: "You are " + dpTown.why.map(function (x) { return x.word; }).join(" and ") +
        " — everything you attempt is " + dpTown.pen + " worse until you see to it.", good: false });
    }

    /* the body mends, slowly, if it is fed */
    if (S.health < 100 && S.coin > 0) S.health = Math.min(100, S.health + (S.perks.indexOf("healer-hands") >= 0 ? 7 : 4));

    /* fame cools, and so does infamy */
    if (S.notoriety > 0 && Math.random() < 0.5) S.notoriety--;

    /* age */
    if (ageNow() > 55) S.health -= 2;
    if (ageNow() > 70) S.health -= 4;

    return finishTurn(notes);
  }

  function finishTurn(notes) {
    if (checkDeath()) return { notes: notes, died: true };
    save();
    return { notes: notes, died: false };
  }

  function checkDeath() {
    if (S.dead) return true;
    if (S.health <= 0) {
      var why = "died of wounds and want";
      if (S.jail > 0) why = "died in a cell";
      else if (S.water <= 0) why = "died of thirst, " + (inWild() ? "alone in the wild" : "in sight of a town");
      else if (S.food <= 0) why = "starved to death";
      else if (inWild()) why = "died in the open, far from anywhere";
      kill(why);
      return true;
    }
    if (ageNow() >= 70 && Math.random() < (ageNow() - 68) * 0.04) { kill("died old, in a bed"); return true; }
    return false;
  }

  function kill(reason) {
    if (S.dead) return;
    S.dead = true;
    S.deathReason = reason;
    S.deathTurn = S.turn;
    logLine("— " + reason + " —", "death");
    save();
  }

  /* ========================================================= THE WILD ==== */
  /* Clicking bare ground on the map has to produce somewhere you can actually
     stand. Rather than invent a database of every wood and road in the world,
     a wild spot is BUILT from the click: the nearest pinned place gives the
     realm, a small table of named country gives the name where the map has one,
     and the terrain gives the tags the event deck reads. */
  var WILDS = [
    /* name,                        x1,  y1,   x2,  y2,   tags */
    ["the Haunted Forest",         1150,   0, 1900, 300, ["forest", "wild", "cold"]],
    ["the Frostfangs",              950,   0, 1150, 320, ["mountain", "wild", "cold"]],
    ["the Wolfswood",               950, 560, 1200, 820, ["forest", "wild", "cold"]],
    ["the Neck",                   1100, 1060, 1350, 1240, ["marsh", "wild"]],
    ["the Mountains of the Moon",  1700, 1400, 1960, 1700, ["mountain", "wild", "crime"]],
    ["the riverlands road",        1150, 1550, 1600, 1800, ["river", "wild"]],
    ["the Kingswood",              1350, 1980, 1700, 2200, ["forest", "wild", "crime"]],
    ["the Rainwood",               1450, 2250, 1750, 2500, ["forest", "wild"]],
    ["the roseroad",                950, 2050, 1400, 2300, ["wild"]],
    ["the Reach, out among the fields", 700, 2100, 1150, 2450, ["wild"]],
    ["the Dornish sand",            800, 2650, 1500, 3000, ["desert", "wild", "hot"]],
    ["the Red Mountains",          1250, 2450, 1650, 2700, ["mountain", "wild", "hot"]],
    ["the Disputed Lands",         2350, 2050, 2700, 2350, ["wild", "warcamp", "hot"]],
    ["the Dothraki sea",           2900, 1700, 3900, 2250, ["wild"]],
    ["the Red Waste",              4400, 2550, 5200, 3100, ["desert", "wild", "hot"]],
    ["the Shivering Sea shore",    2600, 1000, 3600, 1450, ["wild", "cold"]],
  ];

  /* OPEN WATER. Only the three unmistakable stretches, because a bounding box
     over a coastline is a lie and a bounding box over the middle of the Narrow
     Sea is not. A finger put down in here does not produce somewhere to walk;
     it produces somewhere you may only go in something that floats. Everything
     ambiguous — bays, sounds, the ragged bits — stays land, on the principle
     that wrongly letting a man walk half a league of shallows is a smaller
     error than wrongly telling him a stretch of Dorne is the sea. */
  var WATERS = [
    ["the Sunset Sea",   0, 200,  620, 3050],
    ["the narrow sea", 1860, 1450, 2140, 2860],
    ["the Summer Sea",  700, 3080, 1980, 3682],
  ];
  function waterAt(x, y) {
    for (var i = 0; i < WATERS.length; i++) {
      var w = WATERS[i];
      if (x >= w[1] && x <= w[3] && y >= w[2] && y <= w[4]) return w[0];
    }
    return null;
  }

  function wildAt(x, y) {
    var sea = waterAt(x, y);
    if (sea) {
      return {
        id: "sea-" + Math.round(x) + "-" + Math.round(y),
        realm: S.realm, kind: "wild", wild: true, water: true, x: x, y: y,
        name: sea.charAt(0).toUpperCase() + sea.slice(1),
        tags: ["sea", "wild"],
        blurb: "Open water. There is nothing out there to stand on and nothing to eat but what you take with you.",
      };
    }
    var named = null;
    for (var i = 0; i < WILDS.length; i++) {
      var w = WILDS[i];
      if (x >= w[1] && x <= w[3] && y >= w[2] && y <= w[4]) { named = w; break; }
    }
    /* the realm comes from the nearest place that has a pin — never invented */
    var XY = window.IL_XY || {}, best = null, bestD = Infinity;
    Object.keys(XY).forEach(function (pid) {
      var p = placeOf(pid);
      if (!p) return;
      var dx = XY[pid][0] - x, dy = XY[pid][1] - y, dd = dx * dx + dy * dy;
      if (dd < bestD) { bestD = dd; best = p; }
    });
    var realm = best ? best.realm : S.realm;
    var r = realmOf(realm);
    var tags = named ? named[5].slice() : ["wild"];
    if (!named) {
      /* no named country here — describe it from the neighbourhood instead */
      if (best && best.tags.indexOf("cold") >= 0) tags.push("cold");
      if (best && best.tags.indexOf("hot") >= 0) tags.push("hot");
      if (best && best.tags.indexOf("desert") >= 0) tags.push("desert");
      if (best && best.tags.indexOf("forest") >= 0) tags.push("forest");
      if (best && best.tags.indexOf("mountain") >= 0) tags.push("mountain");
    }
    return {
      id: "wild-" + Math.round(x) + "-" + Math.round(y),
      realm: realm, kind: "wild", wild: true, x: x, y: y,
      name: named ? named[0].charAt(0).toUpperCase() + named[0].slice(1)
                  : "The wilds of " + (r ? r.name : "nowhere"),
      near: best ? best.name : null,
      tags: tags,
      blurb: named
        ? "Open country. No walls, no watch, no market — whatever you eat here you will have to find."
        : "Empty ground" + (best ? ", perhaps a few days from " + best.name : "") +
          ". Nobody comes looking for anybody out here.",
    };
  }

  /* going out into the country, and coming back in out of it */
  function goWild(x, y) {
    var w = wildAt(x, y);
    S.wild = w;
    S.realm = w.realm;
    S.venue = null;
    logLine("Walked out into " + w.name.toLowerCase() + ".");
    save();
    return w;
  }
  function nearestSettlement() {
    var XY = window.IL_XY || {}, w = S.wild;
    if (!w) return null;
    var best = null, bestD = Infinity;
    Object.keys(XY).forEach(function (pid) {
      var p = placeOf(pid);
      if (!p || p.kind === "wild") return;
      var dx = XY[pid][0] - w.x, dy = XY[pid][1] - w.y, dd = dx * dx + dy * dy;
      if (dd < bestD) { bestD = dd; best = p; }
    });
    return best;
  }

  /* ============================================================== TRAVEL ====
     Everything is priced off distance on the real map, in the same pixel space
     the rest of the site uses, so "a long way" costs what it looks like it
     ought to. A place with no coordinate (see data-coords.js) is still
     reachable — it just falls back to a flat regional price.

     HOW YOU GO IS A DECISION, not a fee. Walking costs nothing in coin and a
     great deal in food, water, sleep and time; your own horse is the reason to
     own a horse; a hired wain is the cheap way for a man with a purse and no
     hurry; a litter with guards is the safe way for a man with a great deal of
     purse. Water can only be crossed in something that floats, which is what
     makes a port a place worth being in and an island a place worth being
     careful about.

     A DESTINATION HAS A PRICE OF ITS OWN. Berth fees, gate tolls and what an
     ostler thinks he can charge — a court is dear, a village is not, and the
     wilds are free because nobody there is selling anything. */

  function xyOf(id) { return (window.IL_XY || {})[id] || null; }
  function myXY() {
    if (S.wild) return [S.wild.x, S.wild.y];
    return xyOf(S.place);
  }
  function distTo(x, y) {
    var me = myXY();
    if (!me) return null;
    return Math.sqrt((me[0] - x) * (me[0] - x) + (me[1] - y) * (me[1] - y));
  }
  /* 2.75 map pixels to the league, as everywhere else on this site */
  function leaguesTo(xy) {
    if (!xy) return null;
    var d = distTo(xy[0], xy[1]);
    return d == null ? null : Math.max(1, Math.round(d / 2.75));
  }
  /* kept because data and probes still call it */
  function priceFor(dist, bySea) {
    if (dist == null) return { cost: 18, risk: 11, leagues: null };
    var leagues = Math.round(dist / 2.75);
    var cost = Math.max(2, Math.round(leagues / (bySea ? 6 : 3)));
    var risk = clamp(6 + Math.round(leagues / 90), 6, 18);
    return { cost: cost, risk: risk, leagues: leagues };
  }

  /* what this particular gate thinks it can charge */
  function tollFor(p) {
    if (!p) return 0.6;
    var t = p.tags || [], m = 1;
    if (any(t, ["court"])) m += 0.45;
    if (any(t, ["rich"])) m += 0.25;
    if (any(t, ["city"])) m += 0.2;
    if (any(t, ["market"])) m += 0.1;
    if (any(t, ["poor"])) m -= 0.25;
    if (any(t, ["village"])) m -= 0.2;
    if (any(t, ["wild", "ruin"])) m -= 0.35;
    return Math.max(0.45, Math.round(m * 100) / 100);
  }

  /* IS THERE WATER BETWEEN HERE AND THERE?
     Two rules and no third. An island is an island whichever side of it you
     are standing on; and two places on different landmasses need a hull.
     Everything else is walkable, however far — a man CAN walk from King's
     Landing to Winterfell, and an earlier version of this said he could not
     because the two realms are not neighbours in the adjacency table. That
     table prices a journey. It does not decide whether one is possible. */
  function needsSea(dest) {
    var HERE = here();
    if (!dest || !HERE || dest.id === HERE.id) return false;
    if (any(dest.tags || [], ["island"]) || any(HERE.tags || [], ["island"])) return true;
    if (dest.realm === S.realm) return false;
    var a = realmOf(S.realm), b = realmOf(dest.realm);
    return !a || !b || a.side !== b.side;
  }

  /* You may hail a boat from any shore. You may only board a SHIP where ships
     tie up, which is what a port is for and why one is worth walking to. */
  function canEmbark(p) { return p && any(p.tags || [], ["port", "sea", "island", "river"]); }

  function nearestPort() {
    var me = myXY(), best = null, bestD = Infinity;
    W.places.forEach(function (p) {
      if (!any(p.tags || [], ["port"])) return;
      var xy = xyOf(p.id);
      if (!xy || !me) { if (!best) best = p; return; }
      var dx = xy[0] - me[0], dy = xy[1] - me[1], dd = dx * dx + dy * dy;
      if (dd < bestD) { bestD = dd; best = p; }
    });
    return best;
  }

  /* ------------------------------------------------------------- THE WAYS -- */
  /* Every mode is the same shape so the screen can render them as one list:
       cost   silver stags, all in
       days   how long the road is, which advance() then actually spends
       risk   the DC of the one roll the journey makes
       body   what the journey takes out of you before you arrive           */
  function travelModes(target) {
    var toWild = !!(target && target.wild);
    var dest = toWild ? null : placeOf(target.id || target);
    if (!toWild && !dest) return null;
    var xy = toWild ? [target.x, target.y] : xyOf(dest.id);
    var lg = leaguesTo(xy);
    if (lg == null) lg = 160;                     /* unpinned: a fair guess, stated as one */
    var known = !!xy;
    var sea = toWild ? false : needsSea(dest);
    var toll = toWild ? 0.55 : tollFor(dest);
    var HERE = here();
    var atPort = HERE && any(HERE.tags || [], ["port"]);
    var destLandable = toWild || any(dest.tags || [], ["port", "sea", "island", "river"]);
    var destPort = !toWild && any(dest.tags || [], ["port"]);
    var out = [];
    var spot = toWild ? wildAt(target.x, target.y) : null;

    function pace(perDay) { return Math.max(1, Math.round(lg / perDay)); }

    /* A FINGER PUT DOWN ON OPEN WATER. You may go there, but only in something
       that floats — and if you have nothing that floats, the dialog says so
       and names the nearest harbour rather than pretending the sea is a field. */
    if (spot && spot.water) {
      if (item("ship") || item("boat")) {
        out.push({ id: item("ship") ? "own-ship" : "own-boat",
          name: item("ship") ? "Put out in your own ship" : "Row out in your own boat",
          icon: "&#9973;",
          note: "Out past the last of the land, with nothing on any horizon that belongs to anybody.",
          cost: 0, days: Math.max(2, Math.round(lg / 12)),
          risk: clamp(13 + Math.round(lg / 60), 13, 20), attr: "grit",
          body: { food: -25, water: -30, rest: -20 },
          perkBonus: [{ perk: "sea-legs", n: 5 }] });
      } else if (atPort) {
        out.push({ id: "fisher", name: "Pay a boat to take you out", icon: "&#128031;",
          note: "Nobody puts out for pleasure. He will want to know why, and he will not believe the answer.",
          cost: Math.max(10, Math.round(lg / 2 * 1.2)), days: Math.max(2, Math.round(lg / 10)),
          risk: clamp(14 + Math.round(lg / 60), 14, 20), attr: "charm",
          body: { food: -22, water: -26, rest: -22 },
          perkBonus: [{ perk: "sea-legs", n: 4 }, { perk: "silver", n: 3 }] });
      } else {
        var hp = nearestPort();
        out.push({ id: "foot", name: "Walk out onto it", icon: "&#128694;", locked: true,
          why: "That is open water. You cannot walk onto it, and you have nothing that floats." +
            (hp ? " The nearest harbour is " + hp.name + "." : "") });
      }
      return { dest: null, wild: true, water: true, x: xy[0], y: xy[1],
        name: spot.name, realm: "", blurb: spot.blurb,
        leagues: lg, estimated: !known, sea: true, toll: toll, modes: out };
    }

    if (!sea) {
      out.push({
        id: "foot", name: "Walk", icon: "&#128694;",
        note: "Costs nothing but the walking, and the walking is the cost.",
        cost: 0, days: pace(6), risk: clamp(11 + Math.round(lg / 60), 11, 21), attr: "grit",
        body: { food: -clamp(10 + Math.round(lg / 5), 10, 75), water: -clamp(12 + Math.round(lg / 4), 12, 80), rest: -clamp(12 + Math.round(lg / 5), 12, 70) },
        perkBonus: [{ perk: "hardy", n: 3 }, { perk: "quick", n: 2 }],
      });
      if (mounted()) {
        var m = ITEMS[bestIn("mount")];
        out.push({
          id: "ride", name: "Ride your own " + bestIn("mount").replace(/-/g, " "), icon: "&#128052;",
          note: "The reason to own " + m.name.replace(/^an? /, "a ") + ". Half the days and a fraction of the misery.",
          cost: Math.max(1, Math.round(lg / 14 * toll)), days: pace(15),
          risk: clamp(9 + Math.round(lg / 80), 9, 17), attr: "swiftness",
          body: { food: -clamp(6 + Math.round(lg / 10), 6, 40), water: -clamp(8 + Math.round(lg / 8), 8, 45), rest: -clamp(6 + Math.round(lg / 12), 6, 35) },
          perkBonus: [{ perk: "rider", n: 4 }, { perk: "hardy", n: 2 }],
        });
      } else {
        out.push({ id: "ride", name: "Ride", icon: "&#128052;", locked: true,
          why: "You have no horse. A mule is sixty stags and a horse a hundred and fifty, at any market of size." });
      }
      out.push({
        id: "wain", name: "Buy a place on a wain", icon: "&#128739;",
        note: "Carters take passengers for the company as much as the coin. Slow, dull, and you arrive with your feet.",
        cost: Math.max(2, Math.round(lg / 3.2 * toll)), days: pace(8),
        risk: clamp(10 + Math.round(lg / 90), 10, 16), attr: "charm",
        body: { food: -clamp(6 + Math.round(lg / 9), 6, 35), water: -clamp(6 + Math.round(lg / 9), 6, 35), rest: -clamp(5 + Math.round(lg / 12), 5, 25) },
        perkBonus: [{ perk: "silver", n: 3 }, { perk: "connected", n: 2 }],
      });
      if (lg > 30) out.push({
        id: "escort", name: "Hire men and go properly", icon: "&#128737;",
        note: "Guards, a change of horses, and inns rather than ditches. Nobody robs a party of six.",
        cost: Math.max(20, Math.round(lg / 1.5 * toll)), days: pace(12),
        risk: 7, attr: "charm",
        body: { food: -6, water: -8, rest: -6 },
        perkBonus: [{ perk: "connected", n: 3 }],
      });
    } else {
      /* ---- water. You need a hull, and hulls live at harbours. --------- */
      if (item("ship")) {
        out.push({ id: "own-ship", name: "Sail your own ship", icon: "&#9973;",
          note: "Your hull, your crew, your course. The only free crossing there is.",
          cost: 0, days: pace(30), risk: 9, attr: "grit",
          body: { food: -18, water: -20, rest: -12 },
          perkBonus: [{ perk: "sea-legs", n: 4 }] });
      }
      if (item("boat") && lg <= 260) {
        out.push({ id: "own-boat", name: "Take your own boat across", icon: "&#128675;",
          note: "Small, slow, yours, and no captain to ask you anything.",
          cost: 0, days: pace(14), risk: clamp(12 + Math.round(lg / 40), 12, 19), attr: "grit",
          body: { food: -14, water: -18, rest: -14 },
          perkBonus: [{ perk: "sea-legs", n: 4 }] });
      }
      /* a shore without a harbour can still find you a fishing boat, which is
         how Bear Island, Pyke and the Isle of Faces are reachable at all */
      if (!atPort && canEmbark(HERE) && destLandable) {
        out.push({ id: "fisher", name: "Pay a fisherman to carry you", icon: "&#128031;",
          note: "There is no harbour here, but there are boats drawn up on the shingle and men who own them.",
          cost: Math.max(5, Math.round(lg / 2.6 * toll)), days: pace(12),
          risk: clamp(13 + Math.round(lg / 70), 13, 20), attr: "grit",
          body: { food: -18, water: -20, rest: -20 },
          perkBonus: [{ perk: "sea-legs", n: 4 }, { perk: "hardy", n: 2 }] });
      }
      if (atPort && destLandable) {
        out.push({
          id: "deck", name: "Deck passage", icon: "&#9875;",
          note: "You sleep on the boards under a tarpaulin with the cargo and the other passengers. It is cheap for good reasons.",
          cost: Math.max(8, Math.round(lg / 4.2 * toll)), days: pace(26),
          risk: clamp(12 + Math.round(lg / 120), 12, 18), attr: "grit",
          body: { food: -20, water: -22, rest: -25 },
          perkBonus: [{ perk: "sea-legs", n: 4 }, { perk: "hardy", n: 2 }],
        });
        out.push({
          id: "cabin", name: "A cabin, and meals at the captain's table", icon: "&#128719;",
          note: "Dry, fed, and the captain talks. Men have learned more in a fortnight at sea than in a year of asking.",
          cost: Math.max(30, Math.round(lg / 1.8 * toll)), days: pace(28),
          risk: 9, attr: "charm",
          body: { food: -6, water: -8, rest: -6 },
          perkBonus: [{ perk: "sea-legs", n: 3 }, { perk: "silver", n: 3 }],
        });
        if (!destPort) {
          out.push({ id: "fisher", name: "Pay a fisherman to put you ashore", icon: "&#128031;",
            note: "There is no harbour at " + dest.name + ", so it is a beach, a boat and wet legs.",
            cost: Math.max(6, Math.round(lg / 3 * toll)), days: pace(18),
            risk: clamp(13 + Math.round(lg / 90), 13, 19), attr: "grit",
            body: { food: -16, water: -18, rest: -18 },
            perkBonus: [{ perk: "sea-legs", n: 3 }] });
        }
      } else if (!atPort && !canEmbark(HERE)) {
        var np = nearestPort();
        out.push({ id: "deck", name: "Take ship", icon: "&#9875;", locked: true,
          why: "There is water between here and there, and where you are standing there is no shore, " +
            "no harbour and nothing that floats." + (np ? " The nearest harbour is " + np.name + "." : "") });
      } else if (!destLandable) {
        /* an inland place across the water. Say which harbour to aim for and
           let the player make the journey in two legs, which is how it would
           actually be done. */
        var land = null, bestD = Infinity, dxy = xyOf(dest.id);
        W.places.forEach(function (p) {
          if (p.realm !== dest.realm || !any(p.tags || [], ["port"])) return;
          var pxy = xyOf(p.id);
          if (!pxy || !dxy) { if (!land) land = p; return; }
          var dd = (pxy[0] - dxy[0]) * (pxy[0] - dxy[0]) + (pxy[1] - dxy[1]) * (pxy[1] - dxy[1]);
          if (dd < bestD) { bestD = dd; land = p; }
        });
        out.push({ id: "deck", name: "Take ship", icon: "&#9875;", locked: true,
          why: dest.name + " is inland and no ship goes there." +
            (land ? " Sail to " + land.name + " and walk the rest." : "") });
      }
    }

    return {
      dest: dest, wild: toWild, x: xy ? xy[0] : null, y: xy ? xy[1] : null,
      name: toWild ? wildAt(target.x, target.y).name : dest.name,
      realm: toWild ? "" : (realmOf(dest.realm) || {}).name || "",
      blurb: toWild ? wildAt(target.x, target.y).blurb : dest.blurb,
      leagues: lg, estimated: !known, sea: sea, toll: toll, modes: out,
    };
  }

  /* every place, with the cheapest way of getting to it, for the list */
  function travelOptions() {
    var HERE = here(), out = [];
    W.places.forEach(function (p) {
      if (HERE && p.id === HERE.id) return;
      var q = travelModes({ id: p.id });
      if (!q) return;
      var open = q.modes.filter(function (m) { return !m.locked; });
      var cheap = null;
      open.forEach(function (m) { if (!cheap || m.cost < cheap.cost) cheap = m; });
      var xy = xyOf(p.id);
      out.push({
        id: p.id, name: p.name, realm: (realmOf(p.realm) || {}).name || "",
        blurb: p.blurb, x: xy ? xy[0] : null, y: xy ? xy[1] : null,
        cost: cheap ? cheap.cost : null, days: cheap ? cheap.days : null,
        leagues: q.leagues, estimated: q.estimated, sea: q.sea,
        reachable: !!open.length,
        why: open.length ? "" : (q.modes[0] && q.modes[0].why) || "No way there from here.",
        kind: q.sea ? "sea" : (p.realm === S.realm ? "near" : "far"),
      });
    });
    out.sort(function (a, b) {
      if (a.kind !== b.kind) return a.kind === "near" ? -1 : (b.kind === "near" ? 1 : 0);
      return (a.leagues == null ? 1e9 : a.leagues) - (b.leagues == null ? 1e9 : b.leagues);
    });
    return out;
  }

  /* ------------------------------------------------------------- THE GOING - */
  /* The one entry point: a place id or bare ground, plus which way you chose.
     Returns null and changes nothing if the way is shut or the purse is short,
     so a caller may always ask and then decide. */
  function travelTo(target, modeId) {
    var q = travelModes(target);
    if (!q) return null;
    var mode = null;
    q.modes.forEach(function (m) { if (m.id === modeId && !m.locked) mode = m; });
    if (!mode) q.modes.forEach(function (m) { if (!mode && !m.locked) mode = m; });
    if (!mode) return null;
    if (S.coin < mode.cost) return null;

    S.coin -= mode.cost;
    S.pendingDays = clamp(mode.days, 1, 200);
    S.travelling = true;

    var r = roll({
      attr: mode.attr || "grit", dc: mode.risk,
      perkBonus: (mode.perkBonus || []).concat([{ perk: "wary", n: 1 }]),
      itemBonus: [{ item: "map", n: 2 }, { item: "tent", n: 1 }, { item: "waterskin", n: 1 }],
    });

    var ledger = mode.cost ? [{ text: "-" + mode.cost + " stags, the fare", good: false }] : [];
    ledger = ledger.concat(apply(mode.body || {}));
    var text;

    if (q.wild) {
      var w = goWild(q.x, q.y);
      text = "You leave the road behind and walk out into " + w.name.toLowerCase() + ". " + w.blurb;
    } else {
      S.wild = null;
      ledger = ledger.concat(apply({ move: q.dest.id }));
      text = wayIn(mode) + " " + (q.estimated ? "A long road" : "Some " + q.leagues + " leagues") +
        ", " + mode.days + (mode.days === 1 ? " day" : " days") + ", and then " + q.dest.name + ".";
    }

    if (!r.ok) {
      var bad = pick(q.sea ? SEA_TROUBLE : ROAD_TROUBLE);
      text += " " + bad.text;
      ledger = ledger.concat(apply(typeof bad.eff === "function" ? bad.eff() : bad.eff));
    } else if (r.crit) {
      text += q.sea
        ? " A following wind the whole way, and the captain will not take your money for the last of it."
        : " The road is kind. You fall in with good company and arrive better than you left.";
      ledger = ledger.concat(apply({ health: 5, coin: 8, rest: 15 }));
    }
    logLine(text, r.ok ? "" : "bad");
    save();
    return { text: text, ledger: ledger, roll: r, died: checkDeath(), days: mode.days };
  }
  function wayIn(mode) {
    return { foot: "You walk.", ride: "You ride.", wain: "You find a carter going that way.",
      escort: "You go the way men with money go.", deck: "You take deck passage.",
      cabin: "You take a cabin.", fisher: "You find a fisherman who will do it for coin.",
      "own-ship": "You sail.", "own-boat": "You take your own boat out." }[mode.id] || "You go.";
  }
  var ROAD_TROUBLE = [
    { text: "The road goes badly — rain the whole way, a turned ankle, and two nights in a ditch.", eff: { health: -8, rest: -20 } },
    { text: "Men on the road relieve you of most of what you were carrying.", eff: function () { return { coin: -Math.ceil(S.coin * 0.4), health: -4 }; } },
    { text: "You take a fever on the way and arrive shaking.", eff: { health: -12, food: -15 } },
    { text: "You are stopped at a bridge, questioned, and roughly handled before they let you pass.", eff: { health: -5, standing: -2 } },
    { text: "You lose the way for two days and drink from something you should not have.", eff: { health: -9, water: -25 } },
    { text: "A wheel goes, or a shoe, or a strap, and the delay costs you more than the repair.", eff: { coin: -18, rest: -15 } },
  ];
  var SEA_TROUBLE = [
    { text: "Three days of weather. You are sick for all of it and useful for none of it.", eff: { health: -10, rest: -25, food: -20 } },
    { text: "The captain puts in somewhere he had not mentioned and charges you for the delay.", eff: function () { return { coin: -Math.ceil(S.coin * 0.25), rest: -12 }; } },
    { text: "The water aboard goes bad on the second week, and there is a great deal of second week.", eff: { health: -12, water: -40 } },
    { text: "A sail on the horizon that follows for a day and a night. It comes to nothing, and nobody sleeps.", eff: { rest: -30, health: -4 } },
    { text: "You are set to work to pay for the last of the passage, which was not the arrangement.", eff: { rest: -25, health: -6 } },
  ];
  /* kept for the list in the Travel tab, which passes a bare id */
  function travel(destId, modeId) { return travelTo({ id: destId }, modeId); }

  /* ============================================================== READOUT = */
  function ladderRank() {
    var L = window.IL_LADDER || [];
    var cur = L[0] || { name: "Nobody", at: 0 }, next = null;
    for (var i = 0; i < L.length; i++) {
      if (score() >= L[i].at) cur = L[i]; else { next = L[i]; break; }
    }
    return { now: cur, next: next, score: score() };
  }
  /* One number for "how far up the ladder", so the game has a spine. Weighted
     the way the world weighs people: a title outranks a purse. */
  function score() {
    return Math.round(
      S.renown * 3 +
      S.standing * 2 +
      S.followers * 4 +
      S.holdings.length * 120 +
      S.titles.length * 60 +
      Math.floor(S.coin / 12) -
      S.notoriety
    );
  }

  function summary() {
    var r = realmOf(S.realm), p = here();
    var b = byId(D.births, S.birth), w = byId(D.works, S.work);
    var h = S.house ? byId(D.houses[S.realm] || [], S.house) : null;
    return {
      name: S.name || S.first,
      titles: S.titles.slice(),
      birth: b ? b.name : "", house: h ? h.name : "",
      work: (w && w.wage > 0) ? w.name : "no trade",
      realm: r ? r.name : "", place: p ? p.name : "",
      placeBlurb: p ? p.blurb : "",
      wild: inWild(), nearest: inWild() ? nearestSettlement() : null,
      age: ageNow(), season: seasonName(), year: yearNo(),
      day: S.day, dayOfSeason: S.day % DAYS_PER_SEASON,
      needs: { food: S.food, water: S.water, rest: S.rest },
      attrs: effAttrs(),
      ladder: ladderRank(),
      coin: S.coin, purse: money(S.coin),
      kit: kit(),
      look: look(), lookWord: lookWord(),
      venue: venueNow(),
      employed: !!(w && w.wage > 0 && !has("enslaved") && !has("unemployed")),
      tags: (p && p.tags) || [],
      /* what the place has in it, so the screen can say so in one line */
      amenities: Object.keys(AMENITY).filter(function (a) { return amenity(a); }),
      cast: S.cast || castFor(p),
    };
  }

  /* ============================================================ THE END === */
  function chronicle() {
    var s = summary();
    var yrs = S.year;
    var verdict = [];
    if (S.holdings.length) verdict.push("held " + S.holdings.join(", "));
    if (S.titles.length) verdict.push("styled " + S.titles.join(", "));
    if (S.followers >= 50) verdict.push("commanded " + S.followers + " sworn swords");
    else if (S.followers > 0) verdict.push(S.followers + " men still called you theirs");
    if (S.kills) verdict.push("killed " + S.kills + (S.kills === 1 ? " person" : " people"));
    if (S.spared) verdict.push("spared " + S.spared);
    if (S.coin >= 1000) verdict.push("died rich");
    if (S.secrets) verdict.push("learned " + S.secrets + " things nobody meant you to know");

    /* did they get what they came for? */
    var amb = byId(D.ambitions, S.ambition), got = false, gotWhy = "";
    if (S.ambition === "power") { got = S.holdings.length > 0 || S.followers >= 40; gotWhy = "a seat and men to fill it"; }
    if (S.ambition === "gold") { got = S.coin >= 1200; gotWhy = "coin enough to answer to nobody"; }
    if (S.ambition === "glory") { got = S.renown >= 60; gotWhy = "a name the singers had learned"; }
    if (S.ambition === "vengeance") { got = S.kills >= 3 && has("avenged"); gotWhy = "the debt collected"; }
    if (S.ambition === "survive") { got = ageNow() >= 55; gotWhy = "years, and a bed at the end of them"; }
    if (S.ambition === "knowledge") { got = S.secrets >= 3; gotWhy = "the things you went looking for"; }

    return {
      name: s.name, titles: S.titles, age: ageNow(), years: yrs,
      death: S.deathReason || "died",
      place: s.place, realm: s.realm,
      rank: ladderRank(),
      verdict: verdict,
      ambition: amb ? amb.name : "", ambitionMet: got, ambitionWhy: gotWhy,
      log: S.log.slice(),
      stats: {
        coin: S.coin, renown: S.renown, standing: S.standing, notoriety: S.notoriety,
        followers: S.followers, kills: S.kills, spared: S.spared,
        holdings: S.holdings.length, secrets: S.secrets, score: score(),
      },
    };
  }

  /* ============================================================== PUBLIC == */
  return {
    /* lifecycle */
    load: function () { S = load(); return S; },
    begin: begin,
    state: function () { return S; },
    alive: function () { return !!S && !S.dead; },
    exists: function () { return !!S; },
    wipe: function () { S = null; try { localStorage.removeItem(KEY); } catch (e) {} },
    save: save,

    /* the loop */
    nextScene: nextScene,
    optionsFor: optionsFor,
    preview: preview,
    choose: choose,
    advance: advance,
    eventById: eventById,

    /* deliberate action. An action whose every option is locked is not an
       action — it is a dead end with a title, so it is never offered. This bit
       the buy-arms panel: once you owned a sword, mail and a bow, and had
       between 45 and 180 coin, all four of its options were barred and the
       screen showed a scene you could not answer. */
    actions: function () {
      var where = venueNow().id;
      return (window.IL_ACTIONS || []).filter(function (a) {
        /* An action with a `venue` belongs to that venue and is offered
           nowhere else — that is what makes walking into the smithy mean
           something. An action with none is street-level and offered wherever
           you are standing, which is where the small human things live. */
        if (a.venue) {
          var vs = typeof a.venue === "string" ? [a.venue] : a.venue;
          if (vs.indexOf(where) < 0) return false;
        }
        if (!meets(a.when)) return false;
        return optionsFor(a).some(function (o) { return !o.locked; });
      });
    },
    venues: function () {
      var now = venueNow().id;
      return venues().map(function (v) {
        return { id: v.id, name: v.name, icon: v.icon, blurb: v.blurb, here: v.id === now };
      });
    },
    venueNow: venueNow,
    goVenue: goVenue,
    look: look, lookWord: lookWord,
    travelOptions: travelOptions,
    travelModes: travelModes,
    travel: travel,
    travelTo: travelTo,
    wildAt: wildAt,
    nearestPort: nearestPort,
    inWild: inWild,
    here: here,
    xyOf: xyOf,
    myXY: myXY,
    nearestSettlement: nearestSettlement,
    priceFor: priceFor,
    distTo: distTo,
    effAttrs: effAttrs,
    deprivation: deprivation,
    needs: NEEDS,

    /* readout */
    summary: summary,
    chronicle: chronicle,
    fill: fill,
    stage: stage,
    meets: meets,
    money: money, coinShort: coinShort,
    amenity: amenity, flavourFor: flavourFor, castFor: castFor,
    kit: kit, gear: gear, armed: armed, mounted: mounted, bestIn: bestIn,
    has: has, item: item, itemName: itemName, itemTable: ITEMS,
    score: score,
    seasonName: seasonName,
    world: W, data: D,
    placeOf: placeOf, realmOf: realmOf, placesIn: placesIn, byId: byId,
  };
})();
