# The Iron Ladder

A single-player life in Westeros and Essos, one season at a time. It runs
entirely in the browser: no account, no server, no network calls. A character
has **one life**; when they die the chronicle is written and you begin again as
somebody else.

The name is a placeholder you can change in three places — `game/index.html`,
`game/play.html` and the hub card in `trivia/index.html`. Other candidates:
*Blood & Banners*, *The Long Game*, *Realmborn*, *The Crownless*.

## The files, and which one to edit

| File | What lives in it |
|---|---|
| `game-data.js` | `IL_DATA` — the six attributes, births, houses, trades, perks, ambitions, name lists |
| `data-world.js` | `IL_WORLD` — 15 realms and 140 places, plus the realm-to-realm links |
| `data-flavour.js` | `IL_FLAVOUR` — whose ground each place is, its lesser houses, its named corners, its people, what they give you to eat. The `{holder} {lord} {folk} {spot} {dish}` tokens all come from here |
| `data-events.js` | `IL_EVENTS` — things that happen **to** you |
| `data-events-2.js` | appends — things that happen **because of** you |
| `data-scenes-town.js` | appends — the street, the market, the town |
| `data-scenes-hall.js` | appends — the castle, the court, the sept |
| `data-scenes-road.js` | appends — the harbour, the camp, the wild, the far countries |
| `data-scenes-echo.js` | appends — **consequences**. Every event gated on a flag an earlier choice set, and every one refers to the deed |
| `data-chains.js` | appends — **confrontations you cannot walk away from.** `demand: true` shuts everything else; `chain: true` + `goto` makes a fight several cards deep. Also the march on the Red Keep |
| `data-actions.js` | `IL_LADDER` (the rank ladder) and `IL_ACTIONS` (what you may do instead of the scene) |
| `data-more.js` | appends — the street and the wilderness |
| `data-actions-2.js` | appends — yourself, the market, the stable, the harbour, the hall, the sept, at sea |
| `data-coords.js` | `IL_XY` — where 101 of the places are, in basemap pixels |
| `engine.js` | `ILEngine` — dice, conditions, effects, coin, kit, travel, the turn, death, the chronicle. **All rules.** |
| `index.html` + `game.js` | character creation, eight steps |
| `play.html` + `play.js` + `play.css` | the screen. **No rules.** |

Script order in the HTML is the dependency graph, as everywhere on this site.
`data-events.js` and `data-actions.js` **assign** their arrays; everything after
them **concats** onto the same array, so a new deck file loaded before its owner
is silently thrown away. Everything is prefixed `.il-` / `.ilp-` so no style can
leak into the wiki or the maps.

## How a turn works

A turn is a **season** under a roof, a **day** out in the wild, and **as long as
the road is** when you travel. `S.day` is the single stored number and season,
year and age are all derived from it — do not add a second clock. The world
offers a **scene** from the deck; the player may answer it, or ignore it and
take a deliberate **action** instead. Both cost the turn — that is the whole
tension of the game. (The lock is on the *decision*, not on how much you play:
there is no daily allowance anywhere in this game and nothing gates on the real
clock.)

**Nothing repeats while anything new is left.** `nextScene()` takes the unseen
events as the whole pool whenever there are any, so an event does not need
`once: true` to stop happening twice.

**Every event must say where it can happen.** The checker fails any non-chain
event whose `when` has none of `wild / places / kinds / amenities / anyAmenity /
placeTags / anyPlaceTag / notPlaceTags / realms / sides`. Without it a scene
fires in the middle of the Dothraki sea — which is how a barrel-preacher with
two hundred listeners turned up on the road to Casterly Rock.

## Going somewhere, and having to finish it

**A town is not one room.** `VENUES` in `engine.js` derives the street, market,
smithy, inn, brothel, stables, harbour, sept, barracks, hall, maester's turret,
back alleys and gate from the place's amenities, so no place needs its own data.
An action with a `venue` belongs to that venue and is offered nowhere else; an
action with none is street-level and offered wherever you stand.

**Walking between venues is free** — no turn, no lock. Deciding where to stand
is not a decision the world should charge for. What you do once you are there
costs the turn, as everything does.

**Three reasons the panel below the card can be shut**, and the player is told
which: `spent` (you made your decision this turn), `demand` (a scene with
`demand: true` is on the table — somebody is in front of you and is not going
to wait), `started` (you opened an action; finish it). The second and third are
new and are the answer to "if a man charges at me I cannot suddenly start
travelling to a new town".

## Food, wages, and what you look like

- **The bars fall in a town too**, not only in the wild. Paying upkeep is board
  and lodging: it very nearly keeps pace and deliberately does not quite, so
  over a few seasons you get hungry and have to go and eat on purpose. Buy
  `rations` / `wineskin` / `dried-fruit` from the provisioner and carry them;
  `eff: { consume: "rations" }` spends one and takes its numbers off the item
  table, so a bundle is worth the same in a market square and on the fourth day
  of a wood.
- **No trade, no wage.** `advance()` pays only a character with a real trade
  (`wage > 0`, not `unemployed`, not enslaved). `act-seek-work` is the door to
  passive income and every option in it actually SETS `work`. "No trade at all"
  is a choice at creation and it pays nothing.
- **Coin is invisible; a cloak is not.** `look()` reads standing, cloak, armour,
  clothes, a weapon and a mount — and nothing at all from the purse. Scenes about
  being taken for rich or poor use `minLook` / `maxLook`, never `minCoin`. The
  only way to stop being taken for a beggar is to go to a tailor and spend.

Every uncertain thing is `d20 + attribute` against a stated difficulty, and the
player is shown the die, the modifier, the DC **and the percentage** before they
choose. Natural 20 always succeeds and pays extra; natural 1 always fails and
costs extra. Nothing is rolled in secret. A life sim that hides its arithmetic
feels arbitrary; one that shows it feels like a game you lost fairly.

## Adding content

An event is data. No code changes anywhere.

```js
{ id: "unique-id", w: 3, once: true,
  when: { realms: ["north"], minAge: 16, notFlags: ["imprisoned"] },
  dm: "Two to four sentences. Second person. Never say how to feel about it.",
  opts: [
    { label: "The certain one",
      res: { text: "…", eff: { coin: 20, flags: ["a-flag"] } } },
    { label: "The uncertain one",
      check: { attr: "might", dc: 14, perkBonus: [{ perk: "strong", n: 3 }] },
      pass: { text: "…", eff: { renown: 4 } },
      fail: { text: "…", eff: { health: -18 }, goto: "arrest" } },
  ] }
```

House rules, also in the header of `data-events.js`:

1. Every option must be able to go badly, or it is not a decision.
2. At least one option must be open to a penniless, friendless character.
3. Cruelty must pay something **and** cost something.
4. The narration never tells the player how to feel about what they did.
5. `goto` goes on the **branch**, never inside `eff`. Getting this wrong once
   made the entire arrest → trial → cell → Wall chain silently unreachable.

Difficulty: DC 10 is a coin-toss for a competent person, 14 is hard, 18 needs a
specialist, 22 needs a specialist and luck.

### Make it belong somewhere

Two conditions matter more than all the others and are the difference between a
scene set in a place and a scene set in "a town".

- **`amenities`** — what the place actually HAS: `well inn market smith brothel
  temple stables harbour watch maester hall crowd stream trees shore road
  highSeat`. Derived from the place's tags by `AMENITY` in `engine.js`, so one
  condition is correct for all 140 places at once, including the ones invented
  from a click on empty ground. A well in the Dornish sand and a brothel in a
  hamlet of nine houses are what this exists to prevent.
- **`armed` / `mounted` / `armoured`** — what the player is carrying. A man with
  a sword is offered *a different option*, not the same one with better odds.

Then name things: `{holder}` the house that holds this ground, `{lord}` the man
who sits in it, `{folk}` `{folk2}` people who live here, `{spot}` a named corner
of it, `{dish}` `{drink}` what is put in front of you, `{nearby}` the nearest
roof when you are out of doors. All of them come from `data-flavour.js` and all
of them are resolved **once per turn per place** (`stage()`), so the outcome may
safely name whoever the opening line named.

## Coin, kit and travel

- **Coin is counted in silver stags.** 210 stags to the gold dragon. `E.money()`
  spells it out, `E.coinShort()` fits it on a button. Never print a bare number.
- **Kit is not a set of keys.** Every item in `ITEMS` has a `slot`, a `grade`, an
  `attr` map and a `worth`; only the best thing in a slot counts, and its effect
  goes through `effAttrs()` into every roll and onto the rail beside the number
  it moved. A price written in an action must match that item's `worth`.
- **Travel is a decision, not a fee.** `travelModes()` prices walking, riding,
  a wain, hired men, deck passage, a cabin and a fishing boat separately, in
  coin, in days and in what the journey takes out of your body. `travelTo()`
  changes nothing until it is called, so the screen may always ask first — and
  it does: every journey goes through a confirm dialog that says the price in
  words. Water needs a hull; an island is an island from either side; a shore
  can hail a boat but only a **port** can board a ship.

## Verifying — do this after any data edit

Three probes, deleted after use; rebuild them from this description.

- `_gamecheck.html` — validates every id, tag, flag, place, item, amenity,
  token and `goto` against the tables; asserts every place has a way out and
  every place is reachable from somewhere; checks that no scene repeats while
  fresh ones remain; then simulates 200 complete lives with a competent-play
  policy, looking for crashes and for scenes offering no takeable option.
- `_playcheck.html` — drives the real `play.html` in an iframe: reads the
  amenity line, the purse, the kit panel and the struck-through attributes,
  zooms the map, presses a pin, checks the dialog **asks** before it spends,
  cancels, travels, and confirms the turn lock survives the repaint.
- `_phonecheck.html` — the same page in an iframe of **exactly 390px** (a
  headless `--window-size` does not give you the layout viewport you asked
  for), asserting nothing scrolls sideways, the dialog fits, the buttons are
  thumb-sized, and the map reaches at least 2.4 screen pixels per map pixel.

Between them they have caught: 17 misplaced `goto`s (the whole justice system
was dead code), a `region`/`realm` mismatch that started every character in the
wrong kingdom, 111 flags set and never read (which is what `data-scenes-echo.js`
exists to fix), a rule that made it impossible to **walk** from King's Landing to
Winterfell, ten island seats with no way off them, a `move: {realm: "essos"}`
that named a side rather than a realm and threw, and a map you could walk out
onto the middle of the narrow sea from.

## The Cabinet

One call on death, like every other game on the site:
`KWCollection.record("ironladder", { … })`, plus four relics awarded from
`play.js`. The rules live in `js/collection.js`; nothing about renown belongs
in this folder.

## If this ever becomes multiplayer

It is built to survive the transition, but none of it is ready for one.

- **Tick-based, not real-time.** Actions cost from a daily allowance; the world
  resolves a few times a day. The season model already matches this.
- **The server must re-derive everything.** `IL_DATA` in a browser is a menu,
  never a rule. `ILEngine.begin()` already recomputes every attribute from
  scratch instead of trusting the character object handed to it, for exactly
  this reason — that function is the shape the server needs.
- **Accounts come first**, and they are a bigger job than they look: password
  hashing, reset-by-email, sessions, rate limiting, and a privacy policy that
  covers holding an email address. See `LEGAL-NOTES.md`.
- **Budget for moderation before chat.** Player-to-player chat in a world with
  war in it is a moderation problem from the first week, not the first year.
- **Keep the reset button.** It is the single-player promise; if the shared
  realm arrives, it should be a separate mode rather than a replacement.
