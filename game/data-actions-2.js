/* ============================================================================
   THE IRON LADDER — THE REST OF WHAT A PERSON CAN DO.

   The complaint this file answers: "Act on your own" offered a well to a man
   in the desert and a brothel to a man in a hamlet of nine houses, and it
   offered nothing at all for the ordinary human things — sitting down on a
   step, shouting at the sky, drawing the sword you paid for just to look at it.

   THREE RULES, and they are worth keeping when you add to this file.

   1. ASK THE PLACE WHAT IS IN IT. Every action here is gated on `amenities`
      (see AMENITY in engine.js) rather than on a list of place ids. A stable
      exists in a town, a castle and a war camp; a harbour exists at a port; a
      stream exists in a wood and not in the sand. Write the condition once and
      every one of the hundred and forty places answers it correctly, including
      the ones invented from a click on bare ground.

   2. ASK THE MAN WHAT HE IS CARRYING. `armed`, `mounted` and `armoured` are
      conditions now. A man with a sword is offered different things from a man
      with his hands, and neither is offered the other's option greyed out with
      an excuse — he is offered his own.

   3. THE SMALL THINGS ARE NOT FILLER. Sitting down, washing, weeping, counting
      what you have left: these cost a turn like everything else, and several
      of them are the cheapest way to mend what the world has done to you. A
      life sim in which the only verbs are steal, fight and travel is a heist
      game with mud on it.
   ========================================================================== */

window.IL_ACTIONS = (window.IL_ACTIONS || []).concat([

  /* ==========================================================================
     YOURSELF — available very nearly everywhere, because a person always has
     these. Cheap, small, and the reason the panel never reads as a menu.
     ========================================================================== */

  { id: "act-sit", icon: "&#129496;", group: "Yourself",
    when: { notFlags: ["imprisoned"] },
    dm: "You could simply stop. Sit down somewhere out of the way at {spot}, and be a person who is not doing anything for a while.",
    opts: [
      { label: "Sit down and do nothing at all",
        res: { text: "You sit. People go past. Nothing is decided and nothing is lost, and by the end of it your legs have stopped aching and you have thought of two things you had not thought of.",
          eff: { rest: 25, health: 3, attr: { wits: 1 } } } },
      { label: "Sit and watch who comes and goes",
        check: { attr: "wits", dc: 10, perkBonus: [{ perk: "quiet", n: 3 }, { perk: "wary", n: 2 }] },
        pass: { text: "By dusk you know which door is used at night, who is afraid of whom, and that {folk} owes money to somebody unpleasant.", eff: { secrets: 1, rest: 12, flags: ["knows-a-mark"] } },
        fail: { text: "You watch a whole day of nothing and get stiff doing it.", eff: { rest: 8 } } },
    ] },

  { id: "act-lie-down", icon: "&#128564;", group: "Yourself",
    when: { notFlags: ["imprisoned"] },
    dm: "You have been upright for longer than a body is meant to be. There is ground here, and ground is a bed if you are tired enough.",
    opts: [
      { label: "Lie down on the ground where you are",
        res: { text: "Not comfortable, not safe, and you are asleep inside a minute.", eff: { rest: 50, health: -2 } } },
      { label: "Lie down properly, out of sight", req: { anyPerk: ["quiet", "wary", "sly"] },
        check: { attr: "cunning", dc: 10 },
        pass: { text: "Somewhere with one way in that you can see from where you are lying. You sleep like a paid man.", eff: { rest: 85, health: 3 } },
        fail: { text: "There is nowhere here that is both dry and unwatched, and you settle for dry.", eff: { rest: 45 } } },
    ] },

  { id: "act-scream", icon: "&#128561;", group: "Yourself",
    when: { notFlags: ["imprisoned"] },
    dm: "There is a great deal in you that has nowhere to go.",
    opts: [
      { label: "Scream, as loudly as you can, at nothing", req: { notAmenities: ["crowd"] },
        reqWhy: "There are far too many people here for that.",
        res: { text: "It comes out of you and goes over the empty country and does not come back, and afterwards you feel foolish and a great deal lighter.",
          eff: { rest: 10, health: 4, attr: { grit: 1 } } } },
      { label: "Scream in the middle of the street", req: { amenities: ["crowd"] },
        check: { attr: "grit", dc: 12 },
        pass: { text: "Half of {spot} turns to look. You hold their eyes until they turn back, and something in you settles that has not settled in months.", eff: { attr: { grit: 1 }, health: 5, notoriety: 2 } },
        fail: { text: "Two men take you by the arms and walk you to the edge of the square, and one of them is kind about it, which is worse.", eff: { standing: -3, health: -2 } } },
      { label: "Weep instead",
        res: { text: "It takes a while and you do not do it well, being out of practice. Afterwards you are hollowed out and steady, which is not the same as happy and is a great deal more useful.",
          eff: { health: 6, rest: 10, attr: { grit: 1 } } } },
      { label: "Swallow it", res: { text: "You put it back down where it lives. It will keep.", eff: { attr: { cunning: 1 } } } },
    ] },

  { id: "act-wash", icon: "&#129532;", group: "Yourself",
    when: { anyAmenity: ["well", "stream", "harbour", "shore"], notFlags: ["imprisoned"] },
    dm: "You have not been properly clean in some time, and in this world that is a thing people notice about a person before they notice anything else.",
    opts: [
      { label: "Wash, properly and cold",
        res: { text: "It is unpleasant and quick, and afterwards people speak to you in a different tone of voice without knowing they have changed it.",
          eff: { health: 5, standing: 2, water: 15, rest: -5 } } },
      { label: "Pay for a bath and hot water", cost: { coin: 6 }, req: { minCoin: 6, amenities: ["inn"] },
        reqWhy: "Nowhere here heats water for strangers.",
        res: { text: "A tub, a fire and an hour. The single cheapest way in this world to stop being treated like something the road brought in.",
          eff: { health: 8, standing: 4, rest: 20, water: 25 } } },
    ] },

  { id: "act-count-coin", icon: "&#128176;", group: "Yourself",
    when: { minCoin: 1, notFlags: ["imprisoned"] },
    dm: "You find somewhere with a wall at your back and go through what you have, slowly, the way people do when the number matters.",
    opts: [
      { label: "Count it, and think about what it is for",
        res: { text: "It is what it is. Knowing exactly what it is turns out to be worth something on its own.", eff: { attr: { wits: 1 } } } },
      { label: "Sew half of it into your clothing", req: { minCoin: 40 },
        check: { attr: "cunning", dc: 10, perkBonus: [{ perk: "sly", n: 3 }] },
        pass: { text: "A purse can be taken. A seam has to be found first, and nobody searching a man in a hurry finds a seam.", eff: { flags: ["coin-hidden"], attr: { cunning: 1 } } },
        fail: { text: "You do it badly and lose two coins through the lining before you notice.", eff: { coin: -12 } } },
    ] },

  { id: "act-draw-blade", icon: "&#128481;", group: "Yourself",
    when: { armed: true, notFlags: ["imprisoned"] },
    dm: "You draw it, out of the way, and look at it. Men who own one do this far more often than they admit.",
    opts: [
      { label: "Go through the forms until your arms complain",
        check: { attr: "grit", dc: 10, perkBonus: [{ perk: "duellist", n: 3 }] },
        pass: { text: "An hour of it, alone, badly at first and then not badly. Nobody watches and it makes no difference to anything except the next time.", eff: { attr: { might: 1 }, rest: -10 } },
        fail: { text: "You pull something in your shoulder inside the first ten minutes, which is what happens to men who only train when they feel like it.", eff: { health: -8 } } },
      { label: "Sharpen and oil it", req: { anyItems: ["whetstone", "knife"] },
        reqWhy: "You have no stone to do it with.",
        res: { text: "An edge is a thing you keep, not a thing you have. It takes an hour and you think about nothing else the whole time, which is the other reason men do it.",
          eff: { attr: { might: 1 }, rest: 8 } } },
      { label: "Buy a whetstone next time you see one", cost: { coin: 3 }, req: { minCoin: 3, amenities: ["market"], notItems: ["whetstone"] },
        res: { text: "Three stags for a piece of stone, which is robbery, and you will use it every week for the rest of your life.", eff: { items: ["whetstone"] } } },
      { label: "Put it away again", res: { text: "You put it away. That was the whole of it.", eff: {} } },
    ] },

  { id: "act-ride-out", icon: "&#128052;", group: "Yourself",
    when: { mounted: true, notFlags: ["imprisoned"] },
    dm: "The horse needs the exercise and so, if you are honest, do you.",
    opts: [
      { label: "Ride out for the sake of riding",
        check: { attr: "swiftness", dc: 10, perkBonus: [{ perk: "rider", n: 4 }, { perk: "beast-friend", n: 3 }] },
        pass: { text: "An afternoon at a gallop with nowhere to be. You come back with the horse blown and yourself better than you have been in a season.", eff: { health: 7, rest: 15, attr: { swiftness: 1 } } },
        fail: { text: "It puts a foot in something and comes up lame, and a lame horse is a whole season of somebody else's problems becoming yours.", eff: { health: -4, coin: -25 } } },
      { label: "Look the animal over properly and see to its feet",
        check: { attr: "wits", dc: 10, perkBonus: [{ perk: "beast-friend", n: 4 }, { perk: "rider", n: 2 }] },
        pass: { text: "A stone out of one hoof, a strap replaced, and a horse that will do a hundred leagues more before it argues with you.", eff: { attr: { wits: 1 }, flags: ["horse-sound"] } },
        fail: { text: "It stands on your foot and you spend the rest of the day limping about being laughed at.", eff: { health: -5 } } },
      { label: "Sell it", req: { amenities: ["stables"] }, reqWhy: "Nobody here is buying horses.",
        check: { attr: "charm", dc: 12, perkBonus: [{ perk: "silver", n: 3 }] },
        pass: { text: "You get very nearly what it is worth, which never happens, and you will regret this by the second day of walking.", eff: { coin: 130, items: ["-horse", "-mule"] } },
        fail: { text: "The dealer finds three faults, two of them invented, and names a figure. You take it.", eff: { coin: 70, items: ["-horse", "-mule"] } } },
    ] },

  { id: "act-look-at-sky", icon: "&#127756;", group: "Yourself",
    when: {},
    dm: "It is the same sky over the Wall and over Sunspear, which is either comforting or not, depending entirely on how the year has gone.",
    opts: [
      { label: "Look at it for a while, and think about how you got here",
        res: { text: "You go back over it. Some of it was done to you and rather more of it was not, and both halves are worth knowing.",
          eff: { attr: { wits: 1 }, health: 3, rest: 8 } } },
      { label: "Decide something", req: { minTurn: 4 },
        check: { attr: "grit", dc: 11 },
        pass: { text: "You settle on a thing and do not tell anybody, which is how the ones that hold are usually settled.", eff: { attr: { grit: 1 }, renown: 1, flags: ["resolved"] } },
        fail: { text: "You go round it three times and end where you began.", eff: { rest: 5 } } },
    ] },

  /* ==========================================================================
     THE MARKET AND THE STABLE — what you can buy that is not a weapon.
     Prices are the `worth` field of the item table in engine.js. Keep them in
     step: the two must never disagree, because the player can see both.
     ========================================================================== */

  { id: "act-market", venue: "market", icon: "&#127978;", group: "The market",
    when: { wild: false, amenities: ["market"], minCoin: 3, notFlags: ["imprisoned"] },
    dm: "The stalls at {spot} sell {trade} and a great deal else. None of it is a sword and every one of them is the thing you will wish you had bought.",
    opts: [
      { label: "A waterskin — 6 stags", cost: { coin: 6 }, req: { minCoin: 6, notItems: ["waterskin"] },
        res: { text: "Two days of not dying, provided you fill it when you can rather than when you must.", eff: { items: ["waterskin"], water: 20 } } },
      { label: "A coil of rope — 9 stags", cost: { coin: 9 }, req: { minCoin: 9, notItems: ["rope"] },
        res: { text: "Nobody has ever regretted the rope.", eff: { items: ["rope"] } } },
      { label: "Linen and a needle — 11 stags", cost: { coin: 11 }, req: { minCoin: 11, notItems: ["bandages"] },
        res: { text: "You will either learn to use these or you will not need them for very long.", eff: { items: ["bandages"] } } },
      { label: "A shuttered lantern — 14 stags", cost: { coin: 14 }, req: { minCoin: 14, notItems: ["lantern"] },
        res: { text: "Light you can hide, which is a wholly different tool from light you cannot.", eff: { items: ["lantern"] } } },
      { label: "An oiled tent — 28 stags", cost: { coin: 28 }, req: { minCoin: 28, notItems: ["tent"] },
        res: { text: "The whole difference between sleeping outdoors and sleeping in the rain.", eff: { items: ["tent"] } } },
      { label: "A fur cloak — 40 stags", cost: { coin: 40 }, req: { minCoin: 40, notItems: ["cloak-warm", "cloak"] },
        res: { text: "North of the Neck this is not a luxury. It is the difference between a morning and no morning.", eff: { items: ["cloak-warm"] } } },
      { label: "A good cloak, well cut — 120 stags", cost: { coin: 120 }, req: { minCoin: 120, notItems: ["cloak"], anyPlaceTag: ["city", "rich", "market", "court"] },
        res: { text: "People decide what you are before you have said a word, and this is what they decide it from. It is the cheapest lie in the world.", eff: { items: ["cloak"], standing: 5 } } },
      { label: "A dog — 25 stags", cost: { coin: 25 }, req: { minCoin: 25, notItems: ["dog"] },
        res: { text: "It eats what you eat and wakes before you do, which is worth the half of a meal it costs.", eff: { items: ["dog"] } } },
      { label: "Just look, and price everything", res: { text: "You go the length of the row twice and learn what things cost here, which is a thing worth knowing before you need one of them.", eff: { attr: { wits: 1 } } } },
    ] },

  /* THE PROVISIONER. Buying food to CARRY is the whole answer to a bar that
     falls every season: you can eat here and now for three stags, or you can
     buy the week and take it with you, and only the second one is any use on
     the fourth day of a wood. Prices are the item table's `worth`. */
  { id: "act-provisioner", venue: "market", icon: "&#129382;", group: "The market",
    when: { wild: false, amenities: ["market"], minCoin: 5, notFlags: ["imprisoned"] },
    dm: "A provisioner at {spot} with barrels and hooks and a slate: bread that keeps, meat that keeps, and wine that keeps rather better than either.",
    opts: [
      { label: "Three bundles of hard bread and salt meat — 24 stags", cost: { coin: 24 }, req: { minCoin: 24 },
        res: { text: "It keeps for a season and it tastes like it. Three days out of a hole, carried on your own back.", eff: { items: ["rations", "rations", "rations"] } } },
      { label: "One bundle — 8 stags", cost: { coin: 8 }, req: { minCoin: 8 },
        res: { text: "Enough for a day when the day goes wrong.", eff: { items: ["rations"] } } },
      { label: "Dried figs and hard cheese — 12 stags", cost: { coin: 12 }, req: { minCoin: 12 },
        res: { text: "Light, sweet, and gone far too quickly. Worth the extra for what it does to a bad week.", eff: { items: ["dried-fruit"] } } },
      { label: "Two skins of sour wine — 18 stags", cost: { coin: 18 }, req: { minCoin: 18 },
        res: { text: "Safer than most water and considerably better company.", eff: { items: ["wineskin", "wineskin"] } } },
      { label: "Fill your waterskin — 2 stags", cost: { coin: 2 }, req: { minCoin: 2, items: ["waterskin"] },
        reqWhy: "You have no waterskin to fill.",
        res: { text: "Filled from the good well rather than the near one, which is what the two stags are for.", eff: { items: ["water-full"], water: 25 } } },
      { label: "Lay in for a long road — 60 stags", cost: { coin: 60 }, req: { minCoin: 60 },
        res: { text: "Five bundles, two skins and a bag of salt. You will not be hungry for a fortnight and you will be sick of every mouthful of it.", eff: { items: ["rations", "rations", "rations", "rations", "rations", "wineskin", "wineskin"] } } },
      { label: "Look at what a week actually costs", res: { text: "Bread has gone up again. Everyone in the queue has an opinion about whose fault that is and two of them are worth hearing.", eff: { secrets: 1, attr: { wits: 1 } } } },
    ] },

  /* THE TAILOR. Coin is invisible; a cloak is not. `look()` in engine.js reads
     what you are wearing and nothing at all from your purse, which is why the
     only way to stop being taken for a beggar is to come here and spend. */
  { id: "act-tailor", venue: "market", icon: "&#129509;", group: "The market",
    when: { wild: false, amenities: ["market"], minCoin: 20, notFlags: ["imprisoned"] },
    dm: "A cloth-seller at {spot} with a bolt of good wool across his knee. He has looked at what you are wearing and has priced you before you opened your mouth.",
    opts: [
      { label: "Good clothes, well cut — 90 stags", cost: { coin: 90 }, req: { minCoin: 90, notItems: ["clothes-fine", "clothes-court"] },
        res: { text: "Wool that fits and boots that match. Nothing about you has changed and everything about how you are answered has.", eff: { items: ["clothes-fine"], standing: 3 } } },
      { label: "Clothes fit for a hall — 1 dragon and 190 stags", cost: { coin: 400 }, req: { minCoin: 400, notItems: ["clothes-court"], anyPlaceTag: ["city", "rich", "court"] },
        reqWhy: "No tailor in a place this size keeps that sort of cloth.",
        res: { text: "Slashed sleeves, a worked belt, and a colour that has to be bought rather than made. People stand up when you come in and half of them do not know why.", eff: { items: ["clothes-court", "-clothes-fine"], standing: 8, renown: 1 } } },
      { label: "Have what you own mended and cleaned", cost: { coin: 8 }, req: { minCoin: 8 },
        res: { text: "It is the same coat. It no longer looks like the road slept in it, which is most of the difference.", eff: { standing: 2, health: 2 } } },
      { label: "Buy nothing and be looked at",
        res: { text: "He watches you the whole way to the end of the row, which tells you exactly what you look like from outside.", eff: { attr: { wits: 1 } } } },
    ] },

  /* EATING OUT OF YOUR OWN PACK — the reason to have bought any of it. Works
     everywhere, including at sea and on the fourth day of a wood. */
  { id: "act-provisions", icon: "&#127838;", group: "Yourself",
    when: { anyItems: ["rations", "dried-fruit", "wineskin", "water-full", "physick"] },
    dm: "You have something in your pack. Now is either the moment for it or it is not, and that judgement is most of what keeping yourself alive consists of.",
    opts: [
      { label: "Eat a bundle of bread and salt meat", req: { items: ["rations"] },
        res: { text: "You sit down with it and take rather longer over it than it deserves.", eff: { consume: "rations" } } },
      { label: "Eat the figs and the cheese", req: { items: ["dried-fruit"] },
        res: { text: "Gone in four minutes and worth every one of them.", eff: { consume: "dried-fruit" } } },
      { label: "Drink off a wineskin", req: { items: ["wineskin"] },
        res: { text: "Sour, warm, and it does the job of three better things.", eff: { consume: "wineskin" } } },
      { label: "Drink the waterskin dry", req: { items: ["water-full"] },
        res: { text: "You empty it and immediately begin working out where the next one comes from.", eff: { consume: "water-full" } } },
      { label: "Take the physick", req: { items: ["physick"], maxHealth: 90 },
        reqWhy: "There is nothing wrong with you worth opening it for.",
        res: { text: "It is foul and it works, which the maester said would be the case and which you did not believe.", eff: { consume: "physick" } } },
      { label: "Leave it. You may need it worse than this later",
        res: { text: "You put it back. That decision is the difference between people who come out of the country and people who do not.", eff: { attr: { grit: 1 } } } },
    ] },

  { id: "act-stables", venue: "stables", icon: "&#128052;", group: "The market",
    when: { wild: false, amenities: ["stables"], minCoin: 55, mounted: false, notFlags: ["imprisoned"] },
    dm: "A yard of horses at {spot} and a dealer who has already decided how much you know about them.",
    opts: [
      { label: "A mule — 60 stags", cost: { coin: 60 }, req: { minCoin: 60 },
        res: { text: "Slow, foul-tempered, and it will still be walking when a horse has lain down and died.", eff: { items: ["mule"] } } },
      { label: "A horse — 150 stags", cost: { coin: 150 }, req: { minCoin: 150 },
        res: { text: "A rounsey. Not a warhorse and not a nag — a horse, which is more than most men in this world will ever own.", eff: { items: ["horse"], standing: 3 } } },
      { label: "A courser — 2 dragons", cost: { coin: 400 }, req: { minCoin: 400, anyPlaceTag: ["city", "rich", "court", "market"] },
        res: { text: "Bred for the road and fast on it. A man on one of these outruns most of the trouble in this world.", eff: { items: ["courser"], standing: 5, renown: 1 } } },
      { label: "A destrier — 6 dragons and 140 stags", cost: { coin: 1400 }, req: { minCoin: 1400, anyPlaceTag: ["court", "rich", "city"] },
        reqWhy: "Warhorses are sold where warhorses are wanted.",
        res: { text: "Trained to go towards the noise rather than away from it. It is worth more than most of the men who will ride beside you.", eff: { items: ["destrier"], standing: 10, renown: 3 } } },
      { label: "Steal one out of the yard tonight",
        check: { attr: "cunning", dc: 15, perkBonus: [{ perk: "quiet", n: 4 }, { perk: "beast-friend", n: 4 }, { perk: "sly", n: 3 }] },
        pass: { text: "The trick is not the lock. The trick is that a horse makes a noise when it is unhappy, and this one is not unhappy with you.", eff: { items: ["horse"], notoriety: 10, flags: ["horse-thief", "wanted"] } },
        fail: { text: "Horse-stealing is hanging in every kingdom of the seven, and the boy who sleeps in the loft knows it.", eff: { health: -10 }, goto: "arrest" } },
      { label: "Ask what the dealer knows", res: { text: "Who has been buying, who has been selling in a hurry, and which road is bad this month. Stable yards hear everything and repeat most of it.", eff: { secrets: 1, attr: { wits: 1 } } } },
    ] },

  /* ==========================================================================
     THE HARBOUR
     ========================================================================== */

  { id: "act-harbour", venue: "harbour", icon: "&#9875;", group: "The harbour",
    when: { wild: false, amenities: ["harbour"], notFlags: ["imprisoned"] },
    dm: "The wharves at {spot}: hulls, ropes, shouting, and the smell of the whole world arriving at once.",
    opts: [
      { label: "Work the docks for the day", cost: {},
        check: { attr: "might", dc: 10, perkBonus: [{ perk: "strong", n: 3 }, { perk: "sea-legs", n: 2 }] },
        pass: { text: "Hauling, stacking, and being shouted at in four languages. It pays at dusk and pays in coin.", eff: { coin: 18, health: -4, rest: -15, attr: { might: 1 } } },
        fail: { text: "You drop a crate belonging to somebody who counts things, and the day's pay goes with it.", eff: { health: -8, coin: -6 } } },
      { label: "Ask the ships where they have come from",
        check: { attr: "charm", dc: 11, perkBonus: [{ perk: "sea-legs", n: 3 }, { perk: "connected", n: 2 }] },
        pass: { text: "Captains talk. War in one place, plague in another, a price collapsed in a third — and every one of those is a thing you now know before the men in the market do.", eff: { secrets: 1, attr: { wits: 1 }, flags: ["knows-the-ships"] } },
        fail: { text: "Nobody has time for you. A mate finally tells you to move, in the tone men use on dockside idlers.", eff: { standing: -2 } } },
      { label: "Buy a fishing boat — 1 dragon and 10 stags", cost: { coin: 220 }, req: { minCoin: 220, notItems: ["boat", "ship"] },
        res: { text: "Small, slow, leaks a little, and yours. Half the coast of the world is reachable no other way.", eff: { items: ["boat"], standing: 2 } } },
      { label: "Take ship as crew and see where it goes", req: { works: ["sailor", "fisher", "smuggler"] },
        reqWhy: "You would be no use to them and they can tell.",
        check: { attr: "grit", dc: 12, perkBonus: [{ perk: "sea-legs", n: 4 }] },
        pass: { text: "A berth, a wage and a horizon. You will be somewhere else entirely by the turn of the season and nobody here will remember your name.", eff: { coin: 40, flags: ["ship-berth"], move: "random", rest: -20 } },
        fail: { text: "The mate looks at your hands and says something to the man beside him, and they both laugh.", eff: { standing: -3 } } },
    ] },

  /* ==========================================================================
     THE HALL — anywhere with a lord in it, which is not most places.
     ========================================================================== */

  { id: "act-hall", venue: "hall", icon: "&#127984;", group: "The hall",
    when: { wild: false, amenities: ["hall"], notFlags: ["imprisoned", "enslaved"] },
    dm: "{holder} holds this place, and {lord} sits in the hall of it. The doors are open at certain hours to certain people, and the question is only which you are.",
    opts: [
      { label: "Present yourself in the hall", req: { minStanding: 12 },
        reqWhy: "You would not get past the door, and the man on it would enjoy telling you so.",
        check: { attr: "charm", dc: 13, perkBonus: [{ perk: "silver", n: 3 }, { perk: "comely", n: 2 }], flagBonus: [{ flag: "highborn", n: 4 }, { flag: "knight", n: 3 }] },
        pass: { text: "{lord} gives you rather more of the afternoon than he had meant to, and by the end of it he has used your name twice without being prompted.", eff: { standing: 7, renown: 2, rel: { lord: 2 }, flags: ["known-at-court"] } },
        fail: { text: "You are heard, briefly, in front of people who are better at this than you are.", eff: { standing: -4 } } },
      { label: "Take service with {holder}", req: { maxStanding: 60, notFlags: ["sworn", "soldier"] },
        check: { attr: "might", dc: 12, perkBonus: [{ perk: "strong", n: 3 }, { perk: "honest", n: 3 }], itemBonus: [{ item: "sword", n: 3 }, { item: "armour", n: 3 }] },
        pass: { text: "A spear, a cloak with somebody else's arms on it, and a wage that arrives. It is not glory and it is a roof.", eff: { work: "guard", flags: ["sworn", "soldier"], coin: 30, standing: 5, followers: 0 } },
        fail: { text: "The serjeant looks you over and says they are full, which is what he says to everybody he does not want.", eff: { standing: -2 } } },
      { label: "Wait about the yard and see what a great house looks like from inside",
        check: { attr: "wits", dc: 10, perkBonus: [{ perk: "quiet", n: 3 }] },
        pass: { text: "Who eats at the high table, who is not spoken to, which door the maester uses. A castle is a machine and this is what it looks like with the housing off.", eff: { secrets: 1, attr: { wits: 1 }, flags: ["cased-a-castle"] } },
        fail: { text: "You are moved along twice and the second time it is by somebody who takes your description.", eff: { notoriety: 3 } } },
      { label: "Ask to speak for somebody who cannot", req: { anyPerk: ["honest", "silver"] },
        check: { attr: "charm", dc: 14, perkBonus: [{ perk: "honest", n: 4 }] },
        pass: { text: "A widow's boundary, a miller's water, a debt somebody has doubled twice. {lord} finds for them, and the whole district hears who asked.", eff: { standing: 6, renown: 3, followers: 1, flags: ["spoke-for-the-small"] } },
        fail: { text: "You are told, not unkindly, that it is not your business, in front of the person whose business it was.", eff: { standing: -3 } } },
    ] },

  { id: "act-maester", venue: "maester", icon: "&#9939;", group: "The hall",
    when: { wild: false, amenities: ["maester"], notFlags: ["imprisoned"] },
    dm: "There is a man with a chain about his neck here, and a room with books in it, and both are more useful than they look.",
    opts: [
      { label: "Have him look at what is wrong with you", cost: { coin: 8 }, req: { minCoin: 8, maxHealth: 85 },
        reqWhy: "There is nothing wrong with you that he would charge for.",
        res: { text: "He is unhurried and slightly rude and knows exactly what he is doing, which is the whole of what you want in such a man.", eff: { health: 26 } } },
      { label: "Ask him about something you do not understand",
        check: { attr: "wits", dc: 11, perkBonus: [{ perk: "bookish", n: 4 }, { perk: "lettered", n: 3 }, { perk: "clever", n: 2 }] },
        pass: { text: "He answers for an hour and a half, at length, with digressions, and three of the things he says will still be useful to you in ten years.", eff: { attr: { wits: 1 }, secrets: 1 } },
        fail: { text: "He answers a question you did not ask and then remembers a raven he must send.", eff: {} } },
      { label: "Have a letter written and sent", cost: { coin: 12 }, req: { minCoin: 12 },
        res: { text: "A raven goes out over the walls with your name on it. Somewhere a long way away, somebody is about to know where you are.", eff: { flags: ["sent-a-raven"], standing: 1 } } },
      { label: "Read in his library", req: { anyPerk: ["lettered", "bookish", "clever"] },
        reqWhy: "You cannot read well enough for it to be worth the hours.",
        check: { attr: "wits", dc: 12, perkBonus: [{ perk: "bookish", n: 4 }] },
        pass: { text: "Ledgers, letters, a history nobody has opened since it was bound. You come out knowing a thing about {holder} that {holder} would prefer bound and shut.", eff: { secrets: 2, attr: { wits: 1 }, flags: ["dangerous-knowledge"] } },
        fail: { text: "Four hours, a headache, and the discovery that most of what is written down is dull.", eff: { rest: -12 } } },
    ] },

  /* ==========================================================================
     THE TEMPLE
     ========================================================================== */

  { id: "act-temple-work", venue: "temple", icon: "&#10024;", group: "The sept",
    when: { wild: false, amenities: ["temple"], notFlags: ["imprisoned"] },
    dm: "The septons, or the priests, or whoever keeps the fire here, always want hands and never have coin to pay for them.",
    opts: [
      { label: "Work for the temple for a season",
        res: { text: "Sweeping, carrying, sitting with people who are dying. You are fed, you are housed, and nobody asks where you came from.", eff: { food: 90, rest: 60, health: 8, standing: 3, flags: ["temple-friend"] } } },
      { label: "Ask for sanctuary", req: { anyFlag: ["wanted", "hunted", "outlaw"] },
        reqWhy: "Nobody is looking for you.",
        check: { attr: "charm", dc: 12, perkBonus: [{ perk: "honest", n: 3 }], flagBonus: [{ flag: "faithful", n: 4 }] },
        pass: { text: "The door shuts behind you and the men outside stand in the road for two days and then go. It is not a pardon. It is a great deal better than the alternative.", eff: { flags: ["-hunted", "sanctuary"], health: 10, rest: 50 } },
        fail: { text: "The septon has heard the word sanctuary used by a great many men in your position and has stopped believing it.", eff: { standing: -3 } } },
      { label: "Steal from the offering", req: { notFlags: ["faithful"] },
        check: { attr: "cunning", dc: 13, perkBonus: [{ perk: "sly", n: 3 }, { perk: "quiet", n: 3 }] },
        pass: { text: "Silver, mostly, and a little gold, given by people with less than you have. You do not look at it for a week.", eff: { coin: 90, notoriety: 6, flags: ["robbed-a-temple"] } },
        fail: { text: "The Faith has been robbed by better men than you for eight thousand years and has learned one or two things about where to stand.", eff: { health: -12, notoriety: 8 }, goto: "arrest" } },
    ] },

  /* ==========================================================================
     OUT HERE — the wild half, which had four things to do and now has more.
     ========================================================================== */

  { id: "act-wild-stream", icon: "&#127754;", group: "Out here",
    when: { wild: true, amenities: ["stream"] },
    dm: "There is running water in this country if you know how to find it, and the trick is that water runs downhill and so should you.",
    opts: [
      { label: "Follow the fall of the land to water",
        check: { attr: "wits", dc: 9, perkBonus: [{ perk: "clever", n: 2 }, { perk: "beast-friend", n: 3 }] },
        pass: { text: "An hour downhill and there it is, cold and moving and clean. You drink until your teeth ache and fill everything you have.", eff: { water: 100, rest: -5 } },
        fail: { text: "You go downhill for half a day and find a bog.", eff: { water: 30, rest: -14 } } },
      { label: "Wash, and be a person again",
        res: { text: "Cold enough to hurt. You come out of it clean and shaking and better than you were.", eff: { health: 5, water: 30, rest: -8, standing: 1 } } },
      { label: "Fish", req: { anyItems: ["rope", "knife"] }, reqWhy: "You have nothing to fish with.",
        check: { attr: "grit", dc: 12, perkBonus: [{ perk: "quiet", n: 3 }, { perk: "hardy", n: 2 }] },
        pass: { text: "Three of them, small, and cooked on a flat stone. It is the best thing you have eaten in a month and it is three small fish.", eff: { food: 65, water: 25 } },
        fail: { text: "A whole afternoon of standing in cold water being outwitted by fish.", eff: { food: 12, rest: -12, health: -3 } } },
    ] },

  { id: "act-wild-track", icon: "&#128062;", group: "Out here",
    when: { wild: true, notPlaceTags: ["sea"] },
    dm: "There are marks on the ground here that were not made by you.",
    opts: [
      { label: "Read the ground and find out who else is out here",
        check: { attr: "wits", dc: 12, perkBonus: [{ perk: "wary", n: 3 }, { perk: "clever", n: 2 }] },
        pass: { text: "Four men and a horse, going the other way, two days old, and one of them was carrying something heavy. Knowing it is not the same as being safe, and it is a good deal better than not knowing it.", eff: { secrets: 1, attr: { wits: 1 }, flags: ["read-the-ground"] } },
        fail: { text: "Marks in mud. You look at them for an hour and learn that there is mud.", eff: { rest: -8 } } },
      { label: "Follow whoever made them", req: { flags: ["read-the-ground"] },
        check: { attr: "cunning", dc: 13, perkBonus: [{ perk: "quiet", n: 4 }] },
        pass: { text: "A camp, badly made, and nobody in it because they are all off looking for firewood. There is a pack, and the pack has food in it, and you are two ridges away before dark.", eff: { food: 70, coin: 22, notoriety: 3 } },
        fail: { text: "They were not all off looking for firewood.", eff: { health: -20, coin: -15 } } },
      { label: "Go the other way", res: { text: "You add a day to your route and do not regret it once.", eff: { rest: -10, food: -6, attr: { cunning: 1 } } } },
    ] },

  { id: "act-wild-firewood", icon: "&#128293;", group: "Out here",
    when: { wild: true, amenities: ["trees"] },
    dm: "There is wood here, which is not the same as there being firewood here, and the difference is a wet night.",
    opts: [
      { label: "Gather dead wood properly, standing rather than fallen",
        check: { attr: "wits", dc: 10, perkBonus: [{ perk: "hardy", n: 3 }] },
        pass: { text: "Standing deadwood, which is dry inside however long it has been raining. A fire that catches first time and burns until morning.", eff: { rest: 55, health: 6, food: -6 } },
        fail: { text: "Everything you gather is wet through and the fire is a smoking argument you lose.", eff: { rest: 20, health: -6 } } },
      { label: "Cut a proper stack and leave the surplus", req: { anyItems: ["axe", "sword", "knife"] },
        res: { text: "Far more than you need, stacked and covered, for whoever comes through here next. Nobody will ever know you did it, and there is a particular satisfaction in that.", eff: { rest: 40, health: 4, attr: { grit: 1 }, standing: 1 } } },
    ] },

  { id: "act-wild-mark-trail", icon: "&#129517;", group: "Out here",
    when: { wild: true, notPlaceTags: ["sea"] },
    dm: "You could go at this properly instead of wandering: mark your way, keep the sun where you can find it, and know how to get back to where you were.",
    opts: [
      { label: "Work out where you are and where the nearest roof is",
        check: { attr: "wits", dc: 11, perkBonus: [{ perk: "clever", n: 3 }], itemBonus: [{ item: "map", n: 4 }] },
        pass: { text: "It is {nearby}, and it is that way, and it is closer than you feared. That is worth a great deal more than a meal.", eff: { attr: { wits: 1 }, flags: ["knows-the-way"], rest: -6 } },
        fail: { text: "You are somewhere. That is as far as you get.", eff: { rest: -12 } } },
      { label: "Climb something and look", req: { anyPlaceTag: ["mountain", "forest"] },
        check: { attr: "swiftness", dc: 12, perkBonus: [{ perk: "quick", n: 3 }], itemBonus: [{ item: "rope", n: 3 }] },
        pass: { text: "Smoke, four or five leagues off, in a line that means chimneys rather than a burning. You have somewhere to walk to.", eff: { flags: ["knows-the-way"], attr: { swiftness: 1 } } },
        fail: { text: "You come down faster than you went up and land badly.", eff: { health: -14, rest: -10 } } },
    ] },

  /* ==========================================================================
     AT SEA. A finger put down on open water puts you on open water — see
     WATERS in engine.js. Nothing that belongs to the land works out here, so
     the land actions all carry notPlaceTags: ["sea"] and these take over.
     ========================================================================== */

  { id: "act-at-sea", icon: "&#9973;", group: "At sea",
    when: { wild: true, placeTags: ["sea"] },
    dm: "Water in every direction and no shape on any horizon. Whatever you have with you is the whole of what there is.",
    opts: [
      { label: "Make for land",
        check: { attr: "wits", dc: 12, perkBonus: [{ perk: "sea-legs", n: 4 }, { perk: "clever", n: 2 }], itemBonus: [{ item: "map", n: 3 }] },
        pass: { text: "A smudge on the horizon in the afternoon that is still there at dusk, which is how you know it is land and not weather.", eff: { rest: -20, food: -15, water: -20, flags: ["knows-the-way"] } },
        fail: { text: "You steer by something you were sure of this morning and are not sure of now.", eff: { rest: -30, food: -20, water: -30 } } },
      { label: "Fish over the side",
        check: { attr: "grit", dc: 12, perkBonus: [{ perk: "sea-legs", n: 3 }, { perk: "hardy", n: 2 }] },
        pass: { text: "Two, and one of them large. Raw, and better than you expected, and you eat the whole of it including parts you would not have considered on land.", eff: { food: 60, rest: -6 } },
        fail: { text: "Hours of it and nothing, and a line lost.", eff: { food: 10, rest: -12 } } },
      { label: "Catch rain",
        check: { attr: "wits", dc: 11 },
        pass: { text: "A sail spread and a squall that lasts twenty minutes, and every drop of it goes into something with a stopper.", eff: { water: 75 } },
        fail: { text: "No weather at all, and salt water everywhere, which is the particular cruelty of the sea.", eff: { water: 5, rest: -10 } } },
      { label: "Sleep in what shade there is",
        res: { text: "You lie in the bottom of the boat with your arm over your eyes and listen to it move under you.", eff: { rest: 45, water: -10 } } },
    ] },

  /* ==========================================================================
     THE CELL — because a season in a cell should not be one button.
     ========================================================================== */

  { id: "act-cell-more", icon: "&#128274;", group: "The cell",
    when: { flags: ["imprisoned"] },
    dm: "Stone, straw, a slot in the door, and a very great deal of time.",
    opts: [
      { label: "Get word out somehow", req: { anyFlag: ["knows-thieves", "known-at-court", "gang"] },
        reqWhy: "There is nobody outside who would come.",
        check: { attr: "cunning", dc: 13, perkBonus: [{ perk: "sly", n: 3 }, { perk: "connected", n: 4 }] },
        pass: { text: "A turnkey with a wife and a debt. It takes three weeks and it works, and there are men outside these walls who now know exactly where you are.", eff: { flags: ["word-is-out"], secrets: 1 } },
        fail: { text: "The turnkey takes what you offered and does nothing at all with it, which you should have expected.", eff: { coin: -20 } } },
      { label: "Make yourself useful to the gaolers",
        check: { attr: "charm", dc: 12, perkBonus: [{ perk: "silver", n: 3 }, { perk: "quiet", n: 2 }] },
        pass: { text: "You carry slops and you do not spit and you learn all four of their names. By the second month the food improves and the door is sometimes left unlocked while they eat.", eff: { health: 10, food: 40, flags: ["trusted-prisoner"] } },
        fail: { text: "They decide you are working at something, which you are, and it goes worse afterwards.", eff: { health: -12 } } },
      { label: "Go out through the wall", req: { flags: ["loose-stone"] },
        check: { attr: "might", dc: 15, perkBonus: [{ perk: "strong", n: 4 }, { perk: "hardy", n: 3 }], flagBonus: [{ flag: "trusted-prisoner", n: 3 }] },
        pass: { text: "Four nights of work and then a hole, and a drop, and a run in the dark with no boots on. Nobody in this kingdom will forget your face for some years.", eff: { free: true, flags: ["escaped", "wanted", "hunted", "-loose-stone"], health: -16, notoriety: 14, renown: 4 } },
        fail: { text: "The stone goes, and the noise it makes going brings three men with lamps.", eff: { health: -20, jail: 2, flags: ["-loose-stone"] } } },
    ] },

]);
