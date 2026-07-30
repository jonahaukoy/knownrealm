/* HOUSE OF THE DRAGON — the fallen, and the manner of their falling.
   DEATH_TALES (show) / DEATH_TALES_BOOK (Fire & Blood) are spoilers by nature:
   shown only once the chosen episode/chapter is at or past the recorded death.
   MAIN_CHARS is the principal roll for the "main players only" people filter.
   deathSiteFor(name) walks the whereabouts ledger for the pin's place. */

const MAIN_CHARS = new Set([
  "Viserys I Targaryen", "Rhaenyra Targaryen", "Daemon Targaryen", "Alicent Hightower",
  "Otto Hightower", "Aegon II Targaryen", "Helaena Targaryen", "Aemond Targaryen",
  "Daeron Targaryen", "Rhaenys Targaryen", "Corlys Velaryon", "Laena Velaryon",
  "Laenor Velaryon", "Jacaerys Velaryon", "Lucerys Velaryon", "Joffrey Velaryon",
  "Baela Targaryen", "Rhaena Targaryen", "Aegon the Younger", "Criston Cole",
  "Harwin Strong", "Larys Strong", "Lyonel Strong", "Mysaria", "Aemma Arryn",
  "Cregan Stark", "Jeyne Arryn", "Alys Rivers", "Hugh Hammer", "Ulf the White",
  "Addam of Hull", "Alyn of Hull", "Gwayne Hightower", "Jaehaerys Targaryen",
  // principals of the book's telling (hidden in show lore by inLore)
  "Maelor Targaryen", "Ormund Hightower", "Dalton Greyjoy",
]);

/* where a death pin belongs when the whereabouts ledger can't say */
const DEATH_SITE_OVERRIDES = {};

const DEATH_TALES = {
  // ---------------- Season One ----------------
  "Aemma Arryn": "The maesters gave Viserys the choice no husband should hold: the mother or the child. They cut her open on the birthing bed to free a son who lived a day, and she died knowing what was happening and why. The king carried the choosing to his own deathbed.",
  "Craghas Drahar": "The Crabfeeder held the Stepstones three bloody years, staking sailors below the tide line for the crabs. Daemon rowed to his line under a white flag, feigned surrender, and cut his way to the man himself — Craghas came apart under Dark Sister on his own beach, and the war ended with him.",
  "Rhea Royce": "The Lady of Runestone rode out hawking and met her husband on the high road — years after he'd left her, hours before she died. Her horse threw her; the fall broke her; the stone that finished it was in Daemon's hand. The Vale ruled it a riding accident, in the way of rulings no one believes.",
  "Joffrey Lonmouth": "The Knight of Kisses knew Laenor's secret and guessed Ser Criston's, and made the mistake of saying so with a smile. At the betrothal feast Criston Cole beat his face to ruin on the dance floor while the court watched — the first blood of vows Criston had already broken.",
  "Laena Velaryon": "Her second labor in Pentos went the way of Queen Aemma's, and Laena Velaryon refused the knife. She walked out of the birthing chamber to Vhagar, laid her hand on the old queen's snout, and gave the command herself: Dracarys. A dragonrider's death, on her own terms.",
  "Harwin Strong": "Breakbones — the strongest knight in the realm, and the true father of the princess's sons — was dismissed from the gold cloaks and sent home to Harrenhal. His brother's fire found him there the same night, locked in with his father. What Larys wanted buried burned instead.",
  "Lyonel Strong": "The Hand of the King asked leave to resign twice, knowing what the court whispered about his son and the princess. He died in his own castle's flames beside that son — a fire his other son arranged, and billed to the queen as a kindness.",
  "Vaemond Velaryon": "Before the Iron Throne he called the queen's heirs bastards and Rhaenyra a whore — and Daemon took his head off crown-to-jaw with Dark Sister mid-sentence. 'He can keep his tongue,' the prince observed. The Silent Sisters got the rest.",
  "Viserys I Targaryen": "The Old King's peace outlived its keeper by a single night. Viserys dragged his rotting body to the throne one last time to defend his daughter's claim, supped with both halves of his family almost reconciled — and died whispering Aegon's dream to the wrong queen. 'My love.'",
  "Lyman Beesbury": "Master of coin to three kings, he alone at the green council refused the word 'succession' for what it was — treason against the named heir. Ser Criston opened his throat on the table, and the council continued around the body.",
  "Lucerys Velaryon": "Sent to Storm's End a messenger, not a warrior, he found Vhagar in the yard and Aemond wanting an eye. Over Shipbreaker Bay, in the storm, the game stopped being a game: Vhagar took Arrax and the boy in one bite, and the Dance began in earnest.",

  // ---------------- Season Two ----------------
  "Jaehaerys Targaryen": "Blood and Cheese came over the Red Keep's walls for Aemond and found the nursery instead. They made Helaena choose between her sons, took the head of the heir while his mother watched — a son for a son, Daemon's debt paid in the smallest coin.",
  "Arryk Cargyll": "The Hand sent him to Dragonstone wearing his twin brother's face to murder the queen. Erryk found him at her door: twin fought twin by candlelight, an hour of steel between men with one face, until Arryk died on his brother's sword.",
  "Erryk Cargyll": "He carried Viserys's crown to Dragonstone and chose his queen over his king — and then killed the brother who chose otherwise. When it was done he wept, begged forgiveness, and fell on his own sword rather than live with the arithmetic.",
  "Gunthor Darklyn": "Duskendale fell to the Hand's host by march and by treachery, and its lord was offered his life for a bent knee. He kept the oath he'd sworn to Rhaenyra instead. Ser Criston took his head in his own courtyard.",
  "Rhaenys Targaryen": "The Queen Who Never Was answered Rook's Rest's ravens and flew into a trap set for any dragon that came. Clear of the fight, she turned Meleys back into Vhagar's teeth rather than leave the sky to them — and fell with her Red Queen, refusing to the last to run.",
  "Steffon Darklyn": "Lord commander of the queen's guard, he volunteered to claim the riderless Seasmoke with a driftwood wand and a Valyrian pedigree. The dragon wanted blood, not breeding: the fire took him on Dragonstone's slopes, and the claiming was left to bastards.",

  // babes of the tale
  "Baelon Targaryen": "The son Viserys traded his queen for — the heir for a day, dead within hours of his mother.",
  "Visenya Targaryen": "Rhaenyra's daughter, born too soon in the shock of the usurpation and buried on Dragonstone the day of her birth.",
};

const DEATH_TALES_BOOK = {
  "Aemma Arryn": "Fire & Blood records the queen's death in childbed in 105 AC, delivered of the son Viserys had prayed for. Baelon lived a day; Aemma did not see it end. The court mourned; the succession question, quietly, began.",
  "Craghas Drahar": "The Myrish prince-admiral fed the narrow sea's sailors to the crabs until Daemon and the Sea Snake made war on him without the crown's leave. Gyldayn records his end in 106 AC: Dark Sister, single combat, and a body left for his own crabs.",
  "Rhea Royce": "The Lady of Runestone fell from her horse while hawking and cracked her skull upon a stone, lingering nine days. Her husband, the histories note, paid his only visit to Runestone in years just before — and claimed her lands just after. The Vale refused him both.",
  "Joffrey Lonmouth": "In the book's telling the Knight of Kisses died in the tourney celebrating Rhaenyra and Laenor's wedding: Ser Criston Cole's morningstar caved in his helm and what was under it. Laenor wore his favor; Criston wore the queen's new regard.",
  "Laena Velaryon": "Dead of childbed at Driftmark in 120 AC, delivered of a malformed son who lived an hour. The histories say she rose from her bed when the end was close and walked to Vhagar, meaning to die a dragonrider — and fell on the way. The year of the Red Spring had begun.",
  "Laenor Velaryon": "The book gives Laenor no mummer's escape: he was cut down at a fair in Spicetown by his friend and favorite Ser Qarl Correy, who fled and was never found. A quarrel between lovers, said some. A bought blade, said everyone watching Daemon marry his widow.",
  "Harwin Strong": "Breakbones burned at Harrenhal with his father in 120 AC — the same cursed year that took Laena and Laenor. Whether the fire was Larys claiming his inheritance, the curse of Harren's seat, or a king cleaning up his daughter's reputation, Gyldayn leaves carefully unresolved.",
  "Lyonel Strong": "The Hand of the King burned in his bed at Harrenhal beside his heir. Every account agrees on the fire; none agree on the hand that lit it. His clubfooted younger son inherited the castle, the title, and the benefit of the doubt.",
  "Vaemond Velaryon": "He pressed his claim to Driftmark by calling Rhaenyra's sons bastards once too often and too publicly. Daemon beheaded him; the queen fed his tongue to her dragon, say the harsher accounts. His sons pressed the claim no further.",
  "Viserys I Targaryen": "King Viserys, first of his name, died in his sleep in 129 AC and was a day dead before the realm was told — the green council needed the head start. With him died the longest peace the Seven Kingdoms had known, and the maesters date the Dance from his last breath.",
  "Lyman Beesbury": "The master of coin refused the green council's treason to its face. Mushroom says Ser Criston opened his throat; Orwyle says a chill in a black cell; Eustace says a fall. The accounts agree only that the honest man died first.",
  "Lucerys Velaryon": "Vhagar fell upon Arrax in the storm over Shipbreaker Bay, and boy and dragon both were broken on the rocks below. Whether Aemond meant murder or lost mastery of his mount, the histories argue; the war that followed did not care.",
  "Jaehaerys Targaryen": "Blood and Cheese, a butcher and a ratcatcher, took the Red Keep's secret ways with Mysaria's map and Daemon's gold. They made Queen Helaena choose; she named Maelor, and they took Jaehaerys instead. 'A son for a son' — the Dance's cruelest page.",
  "Arryk Cargyll": "Ser Criston sent him to Dragonstone in a black cloak to kill or steal the queen. His twin met him at the gates. They fought, says Gyldayn, for the better part of an hour, weeping as they fought — and died in each other's arms, each begging the other's pardon.",
  "Erryk Cargyll": "Twin met twin at Dragonstone's gates, white cloak against white cloak. The histories cannot even agree which brother struck the killing blows — only that both died of the meeting, and that the singers made it beautiful because no one could bear it plain.",
  "Gunthor Darklyn": "When Duskendale fell to Cole's host, Lord Darklyn was offered the black and chose the block. His head went up over his own gates as a lesson in the price of kept oaths.",
  "Rhaenys Targaryen": "At Rook's Rest the Queen Who Never Was met two dragons laid in ambush. Meleys the Red Queen locked jaws with Sunfyre and near killed the king before Vhagar broke them both. Rhaenys died as she had lived — owed a crown, paying its price anyway.",
  "Steffon Darklyn": "He tried the riderless Seasmoke with a whip and a warrant and the blood of old Valyria, and burned for it on Dragonstone's slopes — proof, Gyldayn notes, that the dragons did their own choosing in the Sowing.",
  "Otto Hightower": "The architect of the green crown did not long survive the city he built it in: when Rhaenyra took King's Landing, Otto Hightower was among the first to the block. He met it, all accounts agree, with his ledgers balanced and his face composed.",
  "Criston Cole": "The Kingmaker marched from Harrenhal into the riverlords' trap at the Butcher's Ball. Scorned, surrounded, and done running, he put on his white cloak, walked out alone, and took three arrows rather than kneel. The histories spend more ink on his sins than his end.",
  "Jacaerys Velaryon": "In the Battle of the Gullet the queen's heir flew Vermax too low among the Triarchy's ninety ships. Dragon and prince went into the sea; the Myrish crossbows found him swimming. With him drowned the best of the blacks' next generation.",
  "Ormund Hightower": "The Lord of Oldtown led the greens' great host up the roseroad for a year of slow victories — until First Tumbleton, where the dragonseeds he'd bought turned their fire on his own camp. He died under Vermithor's shadow with his banners burning.",
  "Helaena Targaryen": "Broken since Blood and Cheese, the gentlest of the dragons' brood threw herself from Maegor's Holdfast onto the spikes of the dry moat. The city that loved her called it the queen's murder, and the riots that followed helped bring Rhaenyra's rule down.",
  "Joffrey Velaryon": "When the mob stormed the Dragonpit, Rhaenyra's youngest tried to fly his mother's Syrax to save the dragons chained inside. Syrax threw him; the boy fell to the streets, and the Shepherd's faithful finished what the fall began.",
  "Maelor Targaryen": "Smuggled toward Oldtown for safety, Aegon's youngest was recognized at Bitterbridge, and the crowd's greed for the queen's reward became a riot that tore the child apart. Both crowns blamed the other; Bitterbridge burned for it either way.",
  "Aemond Targaryen": "Above the Gods Eye, Daemon leapt from Caraxes onto Vhagar's back and drove Dark Sister through his nephew's sapphire eye as the dragons fell locked together. Aemond's bones were found years later, chained to Vhagar's saddle, the sword still in his skull.",
  "Daemon Targaryen": "The Rogue Prince's last flight ended the Battle Above the Gods Eye: he leapt from his own dragon to kill Vhagar's rider, and went into the lake with both. His body was never found — which the singers, and one witch of Harrenhal, have made much of since.",
  "Mysaria": "The White Worm rose to mistress of whisperers and fell with the city: given to the mob's justice in the riots — whipped through the streets, dead before the gates. Gyldayn notes that half her secrets died with her, and the other half went looking for new owners.",
  "Rhaenyra Targaryen": "Fleeing her fallen city, the queen was sold by Dragonstone's own garrison to the brother she'd danced against. Aegon fed her to Sunfyre in the castle yard while her son watched — and made a martyr with a half-year's reign and three hundred years of argument.",
  "Daeron Targaryen": "Daeron the Daring died at Second Tumbleton, the histories' kindest guess being smoke and fire in the burning camp — the best of Alicent's sons, and Tessarion the Blue Queen dying slow beside him.",
  "Hugh Hammer": "The blacksmith's bastard rode Vermithor, turned his cloak at Tumbleton, and began dreaming of a crown — smiths had worn them before, he noted. Hard Hugh died with a knife in him at Second Tumbleton, his crown still at the forge.",
  "Ulf the White": "The other Betrayer drank to his new lordship of Highgarden once too often and was poisoned in his sleep — treason's wages paid by treasonous friends. Silverwing, gentlest of dragons, went wild rather than take another rider.",
  "Addam of Hull": "Named a traitor for his blood when the Betrayers turned, Addam Velaryon — legitimized by the queen — spent his death proving them wrong: he fell at Second Tumbleton riding Seasmoke against the greens' whole host. 'Loyal,' reads the stone the Sea Snake raised him.",
  "Aegon II Targaryen": "He outlived his sister half a year, king of a realm of ashes, and refused every counsel of mercy toward her son. His own lords poured the strongwine: Aegon the Elder died poisoned in his litter with the Wolf of the North two days from the gates.",
  "Borros Baratheon": "The Lord of Storm's End finally picked his battle and lost it: the Battle of the Kingsroad broke his stormlanders against the rivermen and the Winter Wolves, and Borros died as he'd lived — furious, forward, and badly advised.",
  "Jason Lannister": "The Lord of Casterly Rock took his gallantry to war and died of it early, cut down at the crossing of the Red Fork by a grizzled squire named Pate — knighted for it as Pate of Longleaf, the Lionslayer.",
  "Larys Strong": "The Clubfoot outlived every master he served and every fire he set, until the Hour of the Wolf. Cregan Stark offered the Wall; Larys chose the block with a shrug, and House Strong's strange line ended where its castle's curse said it would.",
  "Alicent Hightower": "The dowager queen outlived her father, her sons, her war and her enemy, kept to her chambers in a court of ghosts. Fire & Blood gives her a winter fever and last words for no one the maesters could name — the green queen, dying in grey.",
};

/* the last known place on the ledger at the point of death → the pin's site */
function deathSiteFor(name) {
  const c = CHARACTERS[name];
  if (!c || !c.death || c.death.s === 0) return null;
  if (DEATH_SITE_OVERRIDES[name]) return DEATH_SITE_OVERRIDES[name];
  const tl = (typeof WHEREABOUTS !== "undefined") ? WHEREABOUTS[name] : null;
  if (!tl) return null;
  let site = null;
  for (let i = 0; i < tl.length; i++) {
    const seg = tl[i];
    if (seg[0] < c.death.s || (seg[0] === c.death.s && seg[1] <= c.death.e)) {
      if (seg[2]) site = seg[2];
    } else break;
  }
  return site;
}

/* the same, in the book's telling: last known place at the bookDeath chapter */
function deathSiteForBook(name) {
  const c = CHARACTERS[name];
  if (!c || !c.bookDeath) return null;
  if (DEATH_SITE_OVERRIDES[name]) return DEATH_SITE_OVERRIDES[name];
  const tl = (typeof WHEREABOUTS_BOOK !== "undefined") ? WHEREABOUTS_BOOK[name] : null;
  if (!tl) return null;
  let site = null;
  for (let i = 0; i < tl.length; i++) {
    const seg = tl[i];
    if (seg[0] < c.bookDeath.b || (seg[0] === c.bookDeath.b && seg[1] <= c.bookDeath.ch)) {
      if (seg[2]) site = seg[2];
    } else break;
  }
  return site;
}
