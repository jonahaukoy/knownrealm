/* EXTRA HOUSES — encyclopedia-only wiki pages for the many landed and lesser
   houses of Westeros that never appear on the map itself. Each carries its own
   banner art (assets/sigils/new/<id>.png). The wiki engine reads window.EXTRA_HOUSES,
   lists them under "Houses & Orders" by region, and renders a page per house.

   Schema: { id, name, region, seat, words?, liege?, sigil, blurb, paras? }
   Paths here are written relative to the ROOT wiki (wiki.html). This is batch one —
   the Crownlands houses for which new sigils exist. More regions to follow. */
window.EXTRA_HOUSES = (window.EXTRA_HOUSES || []).concat([

  {
    id: "targaryen-of-kings-landing", name: "House Targaryen of King's Landing",
    region: "the-crownlands", seat: "King's Landing", words: "Fire and Blood",
    liege: "The Iron Throne", sigil: "assets/sigils/new/targaryen.webp",
    blurb: "The royal branch of the dragonlords — the kings who ruled the Seven Kingdoms from the Red Keep and the Iron Throne for very nearly three hundred years.",
    paras: [
      "When Aegon the Conqueror stepped off his ships he left the ancestral seat on Dragonstone to a heir and made his own house at the mouth of the Blackwater, where his army had first pitched their tents. The city that grew there — King's Landing — became the beating heart of the realm, and the Targaryens who sat the Iron Throne there ruled a kingdom welded together out of seven that had spent thousands of years at each other's throats. It is a house apart from the elder line on Dragonstone in seat and in purpose: this was the dynasty of the reigning kings, the small council, the Kingsguard in their white cloaks, and the great fortress of the Red Keep raised over Aegon's High Hill.",
      "Their words, Fire and Blood, proved a promise and a warning both. For three centuries the line held the throne through civil war, madness, and the slow dying-out of the dragons, until the last of the ruling kings, Aerys the Second, burned too many men and lost the love of his lords. When Robert Baratheon's rebellion ended at the Trident and in the sack of the city, the crown passed away from the dragon — but the ashes never fully cooled, and across the narrow sea a girl with silver hair remembered whose house had built the throne in the first place.",
    ],
  },

  {
    id: "rosby", name: "House Rosby",
    region: "the-crownlands", seat: "Rosby", liege: "The Iron Throne",
    sigil: "assets/sigils/new/rosby.webp",
    blurb: "A small, ancient house seated at the castle of Rosby on the kingsroad north of King's Landing — poor in swords but fat in coin, thanks to the traffic that passes their gates.",
    paras: [
      "Rosby is a house whose strength was never measured in armies. Its castle sits close enough to the capital that its lords are forever in the current of court, and rich enough on trade and land that greater houses have long eyed its inheritance. In the books its face is old Lord Gyles Rosby, a grey and coughing man who seems always one winter from the grave, cautious to the point of paralysis, and valuable chiefly for his empty coffers being full. Cersei Lannister names him her master of coin precisely because a man who wants nothing and offends no one is easy to seat on a council.",
      "When Gyles finally dies, the scramble over his lands and his young ward shows exactly how the game is played over the small houses: a lord matters less for what he did in life than for what falls loose when he dies. Rosby fields few spears, but a castle a day's ride from the Iron Throne is a prize worth quiet murder.",
    ],
  },

  {
    id: "stokeworth", name: "House Stokeworth",
    region: "the-crownlands", seat: "Stokeworth", liege: "The Iron Throne",
    sigil: "assets/sigils/new/stokeworth.webp",
    blurb: "A minor house seated at Stokeworth near King's Landing, remembered less for its deeds than for the schemer who married his way into it.",
    paras: [
      "For most of the tale Stokeworth is held by Lady Tanda, an anxious mother forever trying to marry off her two daughters — the elder Falyse, wed to Ser Balman Byrch, and the younger Lollys, a soft and simple girl unlucky in every way that matters. During the riot in King's Landing, Lollys is dragged from her litter and horribly used by the mob, and the shame the family feels over it becomes a lever for a cleverer man to pull.",
      "That man is Bronn. The sellsword who rose at Tyrion Lannister's side arranges to wed the unwanted Lollys, and through her and the child she carries he engineers himself into the lordship of Stokeworth — proof that in the game of thrones a castle can be taken as surely with a marriage contract as with a siege tower. The house's fortunes, humble to begin with, become a small and cynical comedy of ambition.",
    ],
  },

  {
    id: "hayford", name: "House Hayford",
    region: "the-crownlands", seat: "Hayford", liege: "The Iron Throne",
    sigil: "assets/sigils/new/hayford.webp",
    blurb: "A house reduced, by the time of the War of the Five Kings, to a single infant — a cradle-lady whose lands were folded into the lion's holdings before she could walk.",
    paras: [
      "House Hayford's misfortune was to have its men die faster than it could raise new ones, until the whole of its name and its lands rested on Lady Ermesande, a baby still in swaddling clothes. The Lannisters, ever alert to a heiress with no one to guard her, wed the child to Tyrek Lannister, so that her castle and title would pass quietly into their own reach the moment a Lannister spoke for her.",
      "It is a small, cold illustration of how the great houses feed on the small: no battle, no betrayal, just a marriage arranged over a crib. Tyrek himself vanished during the bread riots in the capital and was never certainly found, leaving even that neat arrangement tangled — an infant lady wed to a missing boy, her lands held in trust by lions.",
    ],
  },

  {
    id: "rykker", name: "House Rykker",
    region: "the-crownlands", seat: "Duskendale", liege: "The Iron Throne",
    sigil: "assets/sigils/new/rykker.webp",
    blurb: "The house that holds Duskendale and its Dun Fort — raised to that seat after the old lords of the town brought ruin on themselves.",
    paras: [
      "Duskendale was once the seat of House Darklyn, until Lord Denys Darklyn made the catastrophic decision to seize King Aerys the Second within his own walls — the episode the histories call the Defiance of Duskendale. When Tywin Lannister's siege and Barristan Selmy's daring rescue ended it, the Darklyns were extinguished root and branch, and their town and castle passed to House Rykker, who have held them since.",
      "The Rykkers are a solid, unglamorous Crownlands house, keepers of a port that looks out on Blackwater Bay. Their lord in the present day, Renfred Rykker, keeps the Dun Fort and the King's peace over a town that still remembers, uneasily, what it cost the last family to grow too bold beneath the dragon's eye.",
    ],
  },

  {
    id: "hollard", name: "House Hollard",
    region: "the-crownlands", seat: "Duskendale", liege: "The Iron Throne",
    sigil: "assets/sigils/new/hollard.webp",
    blurb: "A house all but wiped out in the fall of Duskendale, surviving in a single unlikely man — the drunken fool who helped a Stark girl slip a lion's cage.",
    paras: [
      "The Hollards were bannermen and kin to the Darklyns of Duskendale, and they shared in their masters' ruin: when House Darklyn was destroyed for the Defiance, the Hollards were cut down with them. Only a boy named Dontos was spared, on the plea of Ser Barristan Selmy, and taken into the King's service.",
      "Dontos Hollard grew into a sodden, ruined knight, kept at court as a drunken jester after he was too far gone in wine to fight. Yet it is this discarded fool, remembering the mercy once shown him, who becomes Sansa Stark's secret friend and the instrument of her escape from King's Landing — a reminder that in this tale the ones the powerful overlook are often the ones who change everything.",
    ],
  },

  {
    id: "massey", name: "House Massey",
    region: "the-crownlands", seat: "Stonedance", liege: "The Iron Throne",
    sigil: "assets/sigils/new/massey.webp",
    blurb: "A knightly house seated at Stonedance on Massey's Hook, the long claw of land that reaches out toward Dragonstone.",
    paras: [
      "House Massey gives its name to Massey's Hook itself, and its castle of Stonedance guards that stretch of coast on the approaches to Blackwater Bay. In the present day the house's most vivid figure is Ser Justin Massey — a smooth, smiling, fair-haired knight who attaches himself to Stannis Baratheon's cause and proves as ambitious as he is charming. Stannis trusts him enough to send him east to Braavos, to buy sellswords with the promise of the Iron Bank's gold and, if it comes to it, to secure the king's heir.",
      "It is a fitting errand for a Massey: a house of the narrow coast, comfortable moving between Westeros and the merchant powers across the water, playing the long and slippery game of loyalty and advantage.",
    ],
  },

  {
    id: "farring", name: "House Farring",
    region: "the-crownlands", seat: "", liege: "The Iron Throne",
    sigil: "assets/sigils/new/farring.webp",
    blurb: "A Crownlands house of proud, hard fighting men, several of whom followed Stannis Baratheon into the cold wars of the North.",
    paras: [
      "The Farrings are soldiers before they are courtiers. The most storied of them is Ser Godry Farring, who won the name Godry the Giantslayer by cutting down a fleeing giant beyond the Wall and was never shy of reminding anyone within earshot — a swaggering, devout knight in Stannis's host whose pride outruns his sense. Others of the name, such as Ser Perkin, appear among the swords of the capital and the king's men.",
      "Like many small Crownlands houses, the Farrings matter in the tale not through great lands or titles but through the men they put in the field at the moments the story turns — and Godry's brand of loud, brittle valor is exactly the kind the frozen march tests to breaking.",
    ],
  },

  {
    id: "staunton", name: "House Staunton",
    region: "the-crownlands", seat: "Rook's Rest", liege: "The Iron Throne",
    sigil: "assets/sigils/new/staunton.webp",
    blurb: "A minor house holding Rook's Rest on the Crownlands coast — a quiet seat with a bloody place in the songs of the dragon wars.",
    paras: [
      "House Staunton keeps the castle of Rook's Rest, a modest holdfast looking out over the waters of Blackwater Bay. In the present age the Stauntons are unremarkable lords sworn to the throne, but their seat is written large in the older histories: it was beneath the walls of Rook's Rest, during the Dance of the Dragons, that one of that terrible civil war's most fateful clashes of dragon against dragon was fought.",
      "For a small house, that is legacy enough — to hold a name that the maesters still turn to when they tell of the day the dragons fell burning from the sky.",
    ],
  },

  {
    id: "thorne", name: "House Thorne",
    region: "the-crownlands", seat: "", liege: "The Iron Throne",
    sigil: "assets/sigils/new/thorne.webp",
    blurb: "A small knightly house of the Crownlands whose name is carried, at the edge of the world, by one of the Night's Watch's hardest and most bitter men.",
    paras: [
      "House Thorne would be a footnote were it not for Ser Alliser Thorne, the master-at-arms of Castle Black. A Targaryen loyalist who was given the black as the price of the losing side after Robert's Rebellion, Alliser has spent the years since drilling frightened boys into something that can hold a sword, with a tongue like a lash and a contempt for softness that never sleeps.",
      "He is no friend to Jon Snow, and his sourness makes him easy to dislike — yet he is also a man who has kept a crumbling watch on a crumbling Wall long after the realm forgot the Watch existed. Whatever else Alliser Thorne is, he is not a man who ran from his post, and that grim constancy is the truest thing his house's name has to show.",
    ],
  },

  {
    id: "hogg", name: "House Hogg",
    region: "the-crownlands", seat: "Sow's Horn", liege: "The Iron Throne",
    sigil: "assets/sigils/new/hogg.webp",
    blurb: "A small house of the Crownlands seated at Sow's Horn, off the kingsroad in the wooded country south of the God's Eye.",
    paras: [
      "House Hogg holds the modest seat of Sow's Horn in the broken country the war passes through again and again — the lands between King's Landing and Harrenhal where armies forage and smallfolk hide. Ser Roger Hogg, a stubborn hedge-knight of the line, is the sort of minor lord the great war grinds against: he holds his tower and his few fields with a handful of men and a great deal of obstinacy while lions and wolves and worse tramp across his crops.",
      "Little of the house is set down in the grand histories, which is itself the point — for every banner that flies over a battlefield there are a dozen like the Hoggs, whose whole ambition is to still be holding their own gate when the fighting moves on.",
    ],
  },

  {
    id: "darkwood", name: "House Darkwood",
    region: "the-crownlands", seat: "", liege: "The Iron Throne",
    sigil: "assets/sigils/new/darkwood.webp",
    blurb: "One of the lesser houses of the Crownlands, sworn directly to the Iron Throne.",
    paras: [
      "House Darkwood belongs to the broad company of small landed houses that fill out the Crownlands — the knights and petty lords who owe their service straight to whoever holds the throne rather than to some great regional overlord. The chronicles set down little of their deeds beyond their name and their allegiance, but it is exactly such houses, summoned by the hundred, that turn a king's call to arms into an army.",
    ],
  },

  {
    id: "edgerton", name: "House Edgerton",
    region: "the-crownlands", seat: "", liege: "The Iron Throne",
    sigil: "assets/sigils/new/edgerton.webp",
    blurb: "A minor Crownlands house holding its lands in service to the crown.",
    paras: [
      "House Edgerton is counted among the smaller houses of the Crownlands, that ring of lands nearest the capital whose lords answer the summons of the Iron Throne more directly than most. Theirs is not a name the great histories dwell upon; they are of the countless quiet houses whose knights ride when the crown commands and whose fortunes rise or fall with the king they serve.",
    ],
  },

  {
    id: "follard", name: "House Follard",
    region: "the-crownlands", seat: "", liege: "The Iron Throne",
    sigil: "assets/sigils/new/follard.webp",
    blurb: "A small house of the Crownlands, bound in service to the Iron Throne.",
    paras: [
      "The Follards are one of the many minor houses seated in the Crownlands, the well-worked country around King's Landing whose lesser lords hold their lands from the crown itself. The maesters record little of them, but a house need not be great to be old, and the small banners of the Crownlands have flown over more coronations and more sackings of the capital than most of the mightier names of the distant kingdoms.",
    ],
  },

  {
    id: "gaunt", name: "House Gaunt",
    region: "the-crownlands", seat: "", liege: "The Iron Throne",
    sigil: "assets/sigils/new/gaunt.webp",
    blurb: "A lesser house of the Crownlands in the service of the crown.",
    paras: [
      "House Gaunt takes its place among the small landed houses of the Crownlands sworn to the Iron Throne. Little of their story survives in the great chronicles; like their neighbours they are a house whose worth is told in the swords they can raise for their king rather than in songs, the sort of quiet name that has served whatever dynasty sat the throne through changes of colour and cloak.",
    ],
  },

  {
    id: "harte", name: "House Harte",
    region: "the-crownlands", seat: "", liege: "The Iron Throne",
    sigil: "assets/sigils/new/harte.webp",
    blurb: "A minor house of the Crownlands, sworn to the Iron Throne.",
    paras: [
      "House Harte belongs to the lesser nobility of the Crownlands, the lords and knights whose modest holdings lie within the shadow of the capital and who owe their allegiance directly to the crown. The histories keep no long account of them, but such houses are the ordinary stuff of the realm — the men who fill a royal host and hold the roads and fields between the great castles.",
    ],
  },

  {
    id: "langward", name: "House Langward",
    region: "the-crownlands", seat: "", liege: "The Iron Throne",
    sigil: "assets/sigils/new/langward.webp",
    blurb: "A small Crownlands house holding of the Iron Throne.",
    paras: [
      "The Langwards are numbered among the minor houses of the Crownlands, sworn as so many are directly to whoever holds the Iron Throne. Their doings have not been thought worth the maesters' ink, but they endure among the small banners of the king's own lands, a name carried by lesser lords through the long turning of dynasties.",
    ],
  },

  {
    id: "mallery", name: "House Mallery",
    region: "the-crownlands", seat: "", liege: "The Iron Throne",
    sigil: "assets/sigils/new/mallery.webp",
    blurb: "A knightly house of the Crownlands in service to the crown.",
    paras: [
      "House Mallery is one of the small knightly houses of the Crownlands, its swords owed to the Iron Throne. Its knights ride in the tourneys and hosts of the capital as members of the lesser nobility, though the grand histories grant them little more than their name — a fate shared by most of the minor houses that cluster in the well-settled country around King's Landing.",
    ],
  },

  {
    id: "manning", name: "House Manning",
    region: "the-crownlands", seat: "", liege: "The Iron Throne",
    sigil: "assets/sigils/new/manning.webp",
    blurb: "A lesser house of the Crownlands, sworn to the Iron Throne.",
    paras: [
      "House Manning stands among the many small houses of the Crownlands that hold their lands from the crown. The chronicles say little of them, but they belong to the ordinary weave of the realm's nobility — a house of modest means and modest fame whose service, like that of its neighbours, is owed straight to the king who sits the Iron Throne.",
    ],
  },

  {
    id: "pyle", name: "House Pyle",
    region: "the-crownlands", seat: "", liege: "The Iron Throne",
    sigil: "assets/sigils/new/pyle.webp",
    blurb: "A minor house of the Crownlands holding of the crown.",
    paras: [
      "The Pyles are a small house of the Crownlands, counted among the lesser lords and knights who owe their service directly to the Iron Throne. Theirs is not a name that fills the histories, but it takes its place among the quiet banners of the king's own country, whose lords have watched more kings crowned and uncrowned than the songs remember.",
    ],
  },

  {
    id: "rambton", name: "House Rambton",
    region: "the-crownlands", seat: "", liege: "The Iron Throne",
    sigil: "assets/sigils/new/rambton.webp",
    blurb: "A small house of the Crownlands in the service of the Iron Throne.",
    paras: [
      "House Rambton is one of the minor houses seated in the Crownlands, sworn to the crown as its neighbours are. The maesters record little of their deeds; like the other small banners of the king's lands they are known chiefly for their allegiance and the swords they can bring to a royal host when the summons goes out.",
    ],
  },

  {
    id: "rollingford", name: "House Rollingford",
    region: "the-crownlands", seat: "", liege: "The Iron Throne",
    sigil: "assets/sigils/new/rollingford.webp",
    blurb: "A lesser Crownlands house sworn to the Iron Throne.",
    paras: [
      "House Rollingford belongs to the lesser nobility of the Crownlands, whose lords hold their lands directly from the crown. Little of them is set down in the great chronicles, but they endure among the small houses of the capital's country, a name numbered in the rolls of the king's bannermen through the long succession of those who have ruled from the Iron Throne.",
    ],
  },

]);
