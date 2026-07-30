/* HOUSE FAMILY TREES — the lineages of the great houses.
   Cross-checked against the published family trees (The World of Ice & Fire,
   Fire & Blood) and the Wiki of Westeros; where show and book disagree
   (Corlys's father Corwyn, Vaemond as brother, Oscar Tully's descent) the
   show's telling is preferred and the difference noted.
   Node: { n, t (title), img ("got/..jpg" | "hotd/..jpg"), king, bastard,
           note, sp: [{ n, house?, note? }], kids: [...] }
   king marks a crowned head (crown glyph); bastard draws the dashed border. */

const TREE_HOUSES = [

// ==================== HOUSE TARGARYEN ====================
{ id: "targaryen", name: "House Targaryen", sigil: "../assets/sigils/new/targaryen.webp",
  words: "Fire and Blood",
  blurb: "The dragonlords of old Valyria who alone survived the Doom, conquered the Seven Kingdoms, and held the Iron Throne for near three hundred years. One royal line, root to ruin — from the Conqueror to the Mother of Dragons.",
  segments: [
    { title: "Out of the Doom",
      note: "Aenar the Exile brought his family and the last dragons to Dragonstone twelve years before Valyria burned. Five generations kept the rock — then Aegon looked west.",
      root:
      { n: "Aerion Targaryen", t: "Lord of Dragonstone", note: "fifth from Aenar the Exile",
        sp: [{ n: "Valaena Velaryon", house: "velaryon" }],
        kids: [
          { n: "Aegon I Targaryen", t: "the Conqueror", king: true,
            sp: [{ n: "Visenya, his sister", note: "rider of Vhagar" }, { n: "Rhaenys, his sister", note: "rider of Meraxes" }],
            kids: [
              { n: "Aenys I", t: "by Rhaenys", king: true,
                sp: [{ n: "Alyssa Velaryon", house: "velaryon" }],
                kids: [
                  { n: "Rhaena", t: "the Queen in the West", note: "wed her brother Aegon, then Androw Farman" },
                  { n: "Aegon", t: "the Uncrowned", note: "slain by Maegor above the Gods Eye" },
                  { n: "Viserys", t: "died of Maegor's questioning" },
                  { n: "Jaehaerys I", t: "the Old King, the Conciliator", king: true,
                    sp: [{ n: "Alysanne, his sister", note: "Good Queen Alysanne" }],
                    kids: [
                      { n: "Aemon", t: "Prince of Dragonstone", note: "heir, slain on Tarth",
                        sp: [{ n: "Jocelyn Baratheon", house: "baratheon" }],
                        kids: [
                          { n: "Rhaenys", t: "the Queen Who Never Was",
                            sp: [{ n: "Corlys Velaryon", house: "velaryon" }],
                            note: "her children carry the seahorse — see House Velaryon" } ] },
                      { n: "Baelon", t: "the Brave, Prince of Dragonstone",
                        sp: [{ n: "Alyssa, his sister", note: "mother of Viserys I and Daemon" }],
                        kids: [
                          { n: "Viserys I", t: "the Old King's peace, spent", king: true, img: "hotd/viserys-i.jpg",
                            sp: [{ ref: "aemma-arryn", n: "Aemma Arryn", house: "arryn" }, { n: "Alicent Hightower", house: "hightower" }],
                            kids: [
                              { n: "Rhaenyra", t: "the Half-Year Queen · by Aemma", king: true, img: "hotd/rhaenyra-targaryen.jpg",
                                sp: [{ n: "Laenor Velaryon", house: "velaryon" }, { ref: "daemon-rp", n: "Daemon", note: "her uncle" }],
                                kids: [
                                  { n: "Jacaerys Velaryon", t: "rider of Vermax", img: "hotd/jacaerys-velaryon.jpg", note: "lost in the Gullet" },
                                  { n: "Lucerys Velaryon", t: "rider of Arrax", img: "hotd/lucerys-velaryon.jpg", note: "taken by Vhagar" },
                                  { n: "Joffrey Velaryon", t: "rider of Tyraxes", img: "hotd/joffrey-velaryon.jpg", note: "fell over the Dragonpit" },
                                  { n: "Aegon III", t: "the Dragonbane · by Daemon", king: true, img: "hotd/aegon-the-younger.jpg",
                                    sp: [{ n: "Jaehaera Targaryen" }, { n: "Daenaera Velaryon", house: "velaryon" }],
                                    kids: [
                                      { n: "Daeron I", t: "the Young Dragon", king: true },
                                      { n: "Baelor", t: "the Blessed", king: true },
                                      { n: "Daena", t: "the Defiant", note: "mother of Daemon Blackfyre" },
                                      { n: "Rhaena & Elaena", t: "the younger daughters" } ] },
                                  { n: "Viserys II", t: "by Daemon · king for a year", king: true, img: "hotd/viserys-the-younger.jpg",
                                    sp: [{ n: "Larra Rogare of Lys" }],
                                    kids: [
                                      { n: "Aegon IV", t: "the Unworthy", king: true,
                                        sp: [{ n: "Naerys, his sister" }],
                                        kids: [
                                          { n: "Daeron II", t: "the Good", king: true,
                                            sp: [{ n: "Myriah Martell", house: "martell" }],
                                            kids: [
                                              { n: "Baelor", t: "Breakspear, Hand of the King", note: "died of his brother's mace at Ashford" },
                                              { n: "Aerys I", t: "the bookish king", king: true },
                                              { n: "Rhaegel", t: "the gentle, mad prince" },
                                              { n: "Maekar I", t: "the Anvil", king: true,
                                                kids: [
                                                  { n: "Daeron", t: "the Drunken", note: "Dunk's first master's foe" },
                                                  { n: "Aerion", t: "Brightflame", note: "died of a cup of wildfire" },
                                                  { n: "Aemon", t: "maester at the Wall", img: "got/maester-aemon.jpg", note: "refused the crown for the chain" },
                                                  { n: "Aegon V", t: "the Unlikely — 'Egg'", king: true,
                                                    sp: [{ n: "Betha Blackwood" }],
                                                    kids: [
                                                      { n: "Duncan", t: "Prince of Dragonflies", note: "gave up the crown for Jenny of Oldstones" },
                                                      { n: "Jaehaerys II", t: "the frail king", king: true,
                                                        sp: [{ n: "Shaera, his sister" }],
                                                        kids: [
                                                          { n: "Aerys II", t: "the Mad King", king: true, img: "got/aerys-targaryen.jpg",
                                                            sp: [{ n: "Rhaella, his sister" }],
                                                            kids: [
                                                              { n: "Rhaegar", t: "Prince of Dragonstone", img: "got/rhaegar-targaryen.jpg",
                                                                sp: [{ n: "Elia Martell", house: "martell" }, { n: "Lyanna Stark", house: "stark", note: "wed in secret", reveal: { s: 7, b: 5 } }],
                                                                kids: [
                                                                  { n: "Rhaenys", t: "by Elia", note: "slain in the Sack" },
                                                                  { n: "Aegon", t: "by Elia", note: "slain in the Sack" },
                                                                  { n: "Jon Snow", t: "by Lyanna — the show's Aegon", img: "got/jon-snow.jpg", king: true, reveal: { s: 7, b: 5 }, note: "raised as Ned Stark's bastard son" } ] },
                                                              { n: "Viserys", t: "the Beggar King", img: "got/viserys-targaryen.jpg", note: "crowned in gold at Vaes Dothrak" },
                                                              { n: "Daenerys", t: "Stormborn, Mother of Dragons", king: true, img: "got/daenerys-targaryen.jpg",
                                                                sp: [{ n: "Khal Drogo", img: "got/khal-drogo.jpg" }],
                                                                note: "the last dragon of the line" } ] } ] },
                                                      { n: "Rhaelle", t: "wed to Storm's End", sp: [{ n: "Ormund Baratheon", house: "baratheon" }],
                                                        note: "grandmother of Robert, Stannis and Renly" } ] } ] } ] },
                                          { n: "Daemon Blackfyre", t: "the black dragon", bastard: true, note: "legitimized; rose in rebellion" },
                                          { n: "Aegor Rivers", t: "Bittersteel", bastard: true },
                                          { n: "Brynden Rivers", t: "Bloodraven", bastard: true, img: "got/three-eyed-raven.jpg", note: "Hand, then the last greenseer" },
                                          { n: "Shiera Seastar", t: "the sorceress", bastard: true } ] },
                                      { n: "Aemon", t: "the Dragonknight", note: "the whitest of white cloaks" } ] } ] },
                              { n: "Aegon II", t: "by Alicent · rider of Sunfyre", king: true, img: "hotd/aegon-ii.jpg",
                                sp: [{ n: "Helaena, his sister", img: "hotd/helaena-targaryen.jpg" }],
                                kids: [
                                  { n: "Jaehaerys", t: "a son for a son", img: "hotd/jaehaerys-targaryen.jpg" },
                                  { n: "Jaehaera", t: "wed to Aegon III", img: "hotd/jaehaera-targaryen.jpg" },
                                  { n: "Maelor", t: "lost at Bitterbridge", note: "the book's telling only" } ] },
                              { n: "Aemond", t: "by Alicent · One-Eye, rider of Vhagar", img: "hotd/aemond-targaryen.jpg", note: "fell with Daemon above the Gods Eye" },
                              { n: "Daeron", t: "by Alicent · the Daring", note: "fell at Second Tumbleton" } ] },
                          { n: "Daemon", t: "the Rogue Prince, rider of Caraxes", img: "hotd/daemon-targaryen.jpg", key: "daemon-rp",
                            sp: [{ n: "Rhea Royce", house: "arryn", note: "of Runestone" }, { n: "Laena Velaryon", house: "velaryon" }],
                            kids: [
                              { n: "Baela", t: "by Laena · rider of Moondancer", img: "hotd/baela-targaryen.jpg", sp: [{ n: "Alyn Velaryon", house: "velaryon" }] },
                              { n: "Rhaena Targaryen", t: "by Laena · keeper of the eggs", img: "hotd/rhaena-targaryen.jpg" } ] } ] },
                      { n: "Daella", t: "the gentlest daughter",
                        sp: [{ n: "Rodrik Arryn", house: "arryn" }],
                        kids: [{ n: "Aemma Arryn", t: "queen to Viserys I", house: "arryn", img: "hotd/aemma-arryn.jpg", key: "aemma-arryn", note: "died in the birthing bed" }] },
                      { n: "Aegon", t: "died in the cradle" },
                      { n: "Daenerys", t: "died young of a fever" },
                      { n: "Maegelle", t: "septa, healer of greyscale" },
                      { n: "Vaegon", t: "the Dragonless, archmaester" },
                      { n: "Saera", t: "the wild one, fled to Lys" },
                      { n: "Viserra", t: "died in a drunken horse race" },
                      { n: "Gaemon", t: "died in the cradle" },
                      { n: "Valerion", t: "died young" },
                      { n: "Gael", t: "the Winter Child" } ] },
                  { n: "Vaella", t: "died in the cradle" } ] },
              { n: "Maegor I", t: "the Cruel · by Visenya", king: true,
                sp: [{ n: "Ceryse Hightower", house: "hightower" }, { n: "Alys Harroway" }, { n: "Tyanna of the Tower" },
                      { n: "Elinor Costayne" }, { n: "Jeyne Westerling" }, { n: "Rhaena, his niece" }],
                note: "six wives, no living issue; found dead upon the Iron Throne" } ] } ] } } ] },

// ==================== HOUSE STARK ====================
{ id: "stark", name: "House Stark", sigil: "../assets/sigils/new/stark.webp",
  words: "Winter Is Coming",
  blurb: "Kings of Winter for eight thousand years, Wardens of the North since the dragons came. The documented line runs unbroken from the Wolf of the Dance to the children of Winterfell.",
  segments: [
    { title: "From the Wolf of the North to the Young Wolf",
      note: "Bran the Builder raised Winterfell in the Age of Heroes; the tree below begins with Cregan Stark, who ruled the North through the Dance of the Dragons and judged King's Landing in the Hour of the Wolf.",
      root:
      { n: "Cregan Stark", t: "the Wolf of the North", img: "hotd/cregan-stark.jpg",
        sp: [{ n: "Arra Norrey" }, { n: "Alysanne Blackwood", note: "Black Aly" }],
        kids: [
          { n: "Rickon", t: "by Arra", note: "died fighting in Dorne" },
          { n: "Jonnel & Edric", t: "by Alysanne", note: "each Lord of Winterfell in turn" },
          { n: "Barthogan", t: "Barth Blacksword", note: "died at Skagos" },
          { n: "Brandon", t: "by Alysanne",
            kids: [
              { n: "Beron Stark", t: "Lord of Winterfell", sp: [{ n: "Lorra Royce", house: "arryn", note: "of Runestone" }],
                kids: [
                  { n: "Donnor", t: "the heir", note: "died without living issue" },
                  { n: "Willam", t: "Lord of Winterfell", sp: [{ n: "Lyanne Glover" }], note: "slain by Raymun Redbeard",
                    kids: [
                      { n: "Edwyle Stark", t: "Lord of Winterfell", sp: [{ n: "Marna Locke" }],
                        kids: [
                          { n: "Rickard Stark", t: "Lord of Winterfell", img: "got/rickard-stark.jpg",
                            sp: [{ n: "Lyarra Stark", note: "his cousin, Rodrik's daughter" }],
                            note: "burned in his armor before the Mad King",
                            kids: [
                              { n: "Brandon", t: "the wild wolf", note: "strangled reaching for his father's sword" },
                              { n: "Eddard", t: "Lord of Winterfell, Hand", img: "got/eddard-stark.jpg",
                                sp: [{ n: "Catelyn Tully", house: "tully" }],
                                kids: [
                                  { n: "Robb", t: "the Young Wolf, King in the North", king: true, img: "got/robb-stark.jpg",
                                    sp: [{ n: "Talisa Maegyr", note: "Jeyne Westerling in the books", reveal: { s: 2, b: 3 } }] },
                                  { n: "Sansa", t: "the eldest daughter, a little bird", img: "got/sansa-stark.jpg",
                                    spoil: { s: 8, b: 99, t: "Queen in the North", king: true } },
                                  { n: "Arya", t: "the she-wolf", img: "got/arya-stark.jpg",
                                    spoil: { s: 6, t: "the she-wolf, No One" } },
                                  { n: "Bran", t: "the climber, the dreamer", img: "got/bran-stark.jpg",
                                    spoil: { s: 8, b: 99, t: "the Three-Eyed Raven, the Broken King", king: true } },
                                  { n: "Rickon", t: "the youngest wolf", img: "got/rickon-stark.jpg" },
                                  { n: "Jon Snow", t: "Ned's bastard son", bastard: true, img: "got/jon-snow.jpg", until: { s: 7, b: 5 },
                                    note: "raised at Winterfell, a brother of the Night's Watch" } ] },
                              { n: "Lyanna", t: "the winter rose", img: "got/lyanna-stark.jpg",
                                sp: [{ n: "Rhaegar Targaryen", house: "targaryen", note: "wed in secret", reveal: { s: 7, b: 5 } }],
                                kids: [{ n: "Jon Snow", t: "her son — R+L=J", bastard: true, king: true, img: "got/jon-snow.jpg", reveal: { s: 7, b: 5 }, note: "raised as Ned's bastard; a dragon in wolf's clothing" }] },
                              { n: "Benjen", t: "First Ranger", img: "got/benjen-stark.jpg" } ] } ] } ] },
                  { n: "Artos", t: "the Implacable", sp: [{ n: "Lysara Karstark" }],
                    kids: [{ n: "Brandon & Benjen", t: "the uncles of Winterfell" }] },
                  { n: "Rodrik", t: "the wandering wolf", sp: [{ n: "Arya Flint" }],
                    kids: [{ n: "Lyarra Stark", t: "wed her cousin Rickard", note: "mother of Ned Stark" }] } ] } ] } ] } } ] },

// ==================== HOUSE LANNISTER ====================
{ id: "lannister", name: "House Lannister", sigil: "../assets/sigils/lannister.svg",
  words: "Hear Me Roar",
  blurb: "The lions of Casterly Rock, descended from Lann the Clever who winkled the Rock from the Casterlys with nothing but his wits. Gold in their mines and in their hair — and debts always, always paid.",
  segments: [
    { title: "The Lions of the Dance",
      note: "In the Dance of the Dragons the west was led by twin lions: one who raised the banners and one who counted the crown's coin.",
      root:
      { n: "Ceira Lannister", t: "lady of the Rock", note: "mother of the twins",
        kids: [
          { n: "Jason Lannister", t: "Lord of Casterly Rock", img: "hotd/jason-lannister.jpg",
            sp: [{ n: "Johanna Westerling", note: "held the west after him" }],
            note: "fell at the crossing of the Red Fork",
            kids: [
              { n: "Loreon", t: "Lord of Casterly Rock at four",
                note: "his mother Johanna ruled in his name and repaid the ironborn island by island" },
              { n: "Cerelle & Tyshara", t: "two of his five daughters" } ] },
          { n: "Tyland Lannister", t: "master of ships, then of coin", img: "hotd/tyland-lannister.jpg",
            note: "quartered the crown's gold; Hand in the regency" } ] } },
    { title: "The Lions of the Rebellion",
      note: "The record loses the Rock for a while after Lord Loreon. It finds the lions again in Damon the Grey Lion, whose descent from Loreon no history troubles to spell out; from Damon forward the line to Tywin is unbroken and well attested.",
      root:
      { n: "Damon Lannister", t: "the Grey Lion, Lord of Casterly Rock",
        sp: [{ n: "Cerissa Brax" }],
        note: "beaten before the gates of Lannisport by Fireball in the first Blackfyre rising; carried off by the Great Spring Sickness in 210 AC",
        kids: [
          { n: "Tybolt", t: "Lord of Casterly Rock, 210 to 212 AC",
            note: "dead within two years, of nothing the Rock cared to name",
            kids: [
              { n: "Cerelle", t: "Lady of Casterly Rock at three",
                note: "held the west less than a year with her uncle as regent, and then did not hold it at all" } ] },
          { n: "Gerold Lannister", t: "the Golden, Lord of Casterly Rock",
            sp: [{ n: "Alysanne Farman", note: "no issue" }, { n: "Rohanne Webber", note: "the Red Widow of Coldmoat" }],
            note: "regent for his niece, then lord in her place",
            kids: [
          { n: "Tywald", t: "the heir", note: "died squiring in the Peake Uprising" },
          { n: "Tion", t: "the second son", note: "fell against the Blackfyres" },
          { n: "Jason", t: "the youngest of the four", note: "his daughter married the Rock",
            kids: [
              { n: "Damon", t: "his heir" },
              { n: "Joanna", t: "wed her cousin Tywin", note: "mother of Cersei, Jaime and Tyrion" },
              { n: "Stafford", t: "the uncle who lost at Oxcross", note: "father of Daven and Cerenna" } ] },
          { n: "Tytos", t: "the Laughing Lion", sp: [{ n: "Jeyne Marbrand" }],
            note: "a gentle lord the west learned to mock",
            kids: [
              { n: "Tywin", t: "the Great Lion, Hand of three kings", img: "got/tywin-lannister.jpg",
                sp: [{ n: "Joanna Lannister", note: "his cousin — died birthing Tyrion" }],
                kids: [
                  { n: "Cersei", t: "Queen of the Seven Kingdoms", king: true, img: "got/cersei-lannister.jpg",
                    sp: [{ n: "Robert Baratheon", house: "baratheon" }],
                    kids: [
                      { n: "Joffrey", t: "Baratheon in name", king: true, bastard: true, img: "got/joffrey-baratheon.jpg", note: "born of the twins" },
                      { n: "Myrcella", t: "Baratheon in name", bastard: true, img: "got/myrcella-baratheon.jpg" },
                      { n: "Tommen", t: "Baratheon in name", king: true, bastard: true, img: "got/tommen-baratheon.jpg" } ] },
                  { n: "Jaime", t: "the Kingslayer, Lord Commander", img: "got/jaime-lannister.jpg" },
                  { n: "Tyrion", t: "the Imp, Hand of the Queen", img: "got/tyrion-lannister.jpg",
                    sp: [{ n: "Sansa Stark", house: "stark", note: "unconsummated" }] } ] },
              { n: "Kevan", t: "the loyal brother", img: "got/kevan-lannister.jpg",
                sp: [{ n: "Dorna Swyft" }],
                kids: [
                  { n: "Lancel", t: "of the Faith Militant", img: "got/lancel-lannister.jpg" },
                  { n: "Willem", t: "a twin", note: "murdered at Riverrun by Karstark men" },
                  { n: "Martyn", t: "a twin", note: "taken hostage in the war" },
                  { n: "Janei", t: "the youngest, in the books" } ] },
              { n: "Genna", t: "the shrewdest lion", sp: [{ n: "Emmon Frey", note: "of the Twins" }],
                kids: [{ n: "Cleos, Lyonel, Tion & Walder", t: "Frey-Lannisters, in the books", bastard: false }] },
              { n: "Tygett", t: "the fierce brother", note: "died of a pox", sp: [{ n: "Darlessa Marbrand" }],
                kids: [{ n: "Tyrek", t: "squire, lost in the King's Landing riot" }] },
              { n: "Gerion", t: "the lost brother", note: "sailed to seek the lost sword Brightroar and never returned",
                kids: [{ n: "Joy Hill", t: "his bastard daughter, in the books", bastard: true }] } ] } ] } ] } } ] },

// ==================== HOUSE VELARYON ====================
{ id: "velaryon", name: "House Velaryon", sigil: "../hotd/assets/sigils/velaryon.png",
  words: "The Old, the True, the Brave",
  blurb: "Old Valyria's other house in Westeros, older on Driftmark than the dragons on Dragonstone. Masters of ship and salt, kin to the dragon by marriage in every generation that mattered.",
  segments: [
    { title: "The Seahorse Line",
      note: "Daemon Velaryon was the Conqueror's first master of ships; Alyssa Velaryon mothered the Old King himself. The tree below follows the Sea Snake's own line.",
      root:
      { n: "Corwyn Velaryon", t: "of the old blood of Driftmark",
        kids: [
          { n: "Corlys Velaryon", t: "the Sea Snake, Lord of the Tides", img: "hotd/corlys-velaryon.jpg",
            sp: [{ n: "Rhaenys Targaryen", house: "targaryen", note: "the Queen Who Never Was" }],
            kids: [
              { n: "Laena", t: "rider of Vhagar", img: "hotd/laena-velaryon.jpg",
                sp: [{ n: "Daemon Targaryen", house: "targaryen" }],
                kids: [
                  { n: "Baela Targaryen", t: "rider of Moondancer", img: "hotd/baela-targaryen.jpg" },
                  { n: "Rhaena Targaryen", t: "keeper of the eggs", img: "hotd/rhaena-targaryen.jpg" } ] },
              { n: "Laenor", t: "rider of Seasmoke", img: "hotd/laenor-velaryon.jpg",
                sp: [{ n: "Rhaenyra Targaryen", house: "targaryen" }],
                kids: [
                  { n: "Jacaerys", t: "Velaryon by law", img: "hotd/jacaerys-velaryon.jpg", note: "Harwin Strong's blood, the court whispered" },
                  { n: "Lucerys", t: "heir to Driftmark", img: "hotd/lucerys-velaryon.jpg" },
                  { n: "Joffrey", t: "the youngest", img: "hotd/joffrey-velaryon.jpg" } ] } ] },
          { n: "Vaemond Velaryon", t: "the Sea Snake's brother", img: "hotd/vaemond-velaryon.jpg",
            note: "spoke of bastards before the throne, briefly" } ] } },
    { title: "The Sons of Hull",
      note: "Corlys's unclaimed blood, born to a shipwright's daughter of Hull — silver-haired, dragon-worthy, and in the end given the name. Whether the Sea Snake was their father or their grandfather he never said plainly, which is why they stand apart from the seahorse line above. After Oakenfist the tide goes out: the Rogare bank swallowed much of the Driftmark gold within a generation, and no chronicle carries a line of descent from him down to Lord Monford Velaryon, who burned on the Blackwater leaving a boy named Monterys behind him.",
      root:
      { n: "Corlys Velaryon", t: "the Sea Snake", img: "hotd/corlys-velaryon.jpg",
        kids: [
          { n: "Addam of Hull", t: "rider of Seasmoke", bastard: true, img: "hotd/addam-of-hull.jpg",
            note: "legitimized Addam Velaryon; died proving it at Second Tumbleton" },
          { n: "Alyn of Hull", t: "later Alyn Oakenfist", bastard: true, img: "hotd/alyn-of-hull.jpg",
            sp: [{ n: "Baela Targaryen", house: "targaryen" }],
            note: "Lord of the Tides after the Dance; six voyages, a Dornish war, and a last sail he never came back from",
            kids: [
              { n: "Laena", t: "born 134 AC", note: "her name-day egg hatched a blind white worm on Driftmark" },
              { n: "Corlys & Vaelon", t: "the sons of Oakenfist" },
              { n: "Vaelle", t: "the youngest" },
              { n: "Jon & Jeyne Waters", t: "by Princess Elaena Targaryen", bastard: true } ] } ] } } ] },

// ==================== HOUSE HIGHTOWER ====================
{ id: "hightower", name: "House Hightower", sigil: "../assets/sigils/hightower.png",
  words: "We Light the Way",
  blurb: "Lords of Oldtown since before the Andals, keepers of the great lighthouse tower. Kingmakers by marriage rather than conquest — never more so than in the generation that made a queen and unmade a peace.",
  segments: [
    { title: "The Greens' Own House",
      note: "A younger son of the Hightower went to court as a king's counselor — and his daughter's sons wore crowns and eyepatches. Lord Ormund is named Otto's nephew, so his father was one of Otto's brothers; Ser Hobert is the brother the histories name, and the link below follows that reading rather than any stated line. Nothing at all joins Ormund's sons to Leyton Hightower, the Old Man of Oldtown who holds the tower in Robert's day — the Hightowers simply keep their tower and drop out of the tale for two hundred years.",
      root:
      { n: "The Lord of Oldtown", t: "of the ancient line",
        kids: [
          { n: "Hobert Hightower", t: "Otto's elder brother",
            kids: [
              { n: "Ormund Hightower", t: "commander of the green host",
                sp: [{ n: "Samantha Tarly", note: "his second wife, two years older than his heir" }],
                note: "fell at First Tumbleton with his banners burning",
                kids: [
                  { n: "Lyonel", t: "Lord of the Hightower at fifteen" },
                  { n: "Martyn", t: "the second son" },
                  { n: "Garmund", t: "cupbearer at Highgarden" },
                  { n: "Bethany", t: "his daughter" } ] } ] },
          { n: "Otto Hightower", t: "Hand to three kings", img: "hotd/otto-hightower.jpg",
            kids: [
              { n: "Alicent", t: "the Queen in Green", img: "hotd/alicent-hightower.jpg",
                sp: [{ n: "Viserys I Targaryen", house: "targaryen" }],
                kids: [
                  { n: "Aegon II Targaryen", t: "the green king", king: true, img: "hotd/aegon-ii.jpg" },
                  { n: "Helaena Targaryen", t: "rider of Dreamfyre", img: "hotd/helaena-targaryen.jpg" },
                  { n: "Aemond Targaryen", t: "One-Eye", img: "hotd/aemond-targaryen.jpg" },
                  { n: "Daeron Targaryen", t: "the Daring" } ] },
              { n: "Gwayne", t: "knight of Oldtown", img: "hotd/gwayne-hightower.jpg" } ] } ] } } ] },

// ==================== HOUSE BARATHEON ====================
{ id: "baratheon", name: "House Baratheon", sigil: "../assets/sigils/baratheon.svg",
  words: "Ours Is the Fury",
  blurb: "The youngest great house, founded by the Conqueror's rumored bastard brother on the storm king's seat he took. Stag and dragon marry into one another for three centuries — until a stag takes the throne itself.",
  segments: [
    { title: "The Storm Lords of the Dance",
      note: "Orys Baratheon took Storm's End, its king's daughter, and its words. His line kept faith with the dragons — mostly.",
      root:
      { n: "Rogar Baratheon", t: "Lord of Storm's End, Hand", sp: [{ n: "Alyssa Velaryon", house: "velaryon", note: "the Old King's mother, twice wed" }],
        kids: [
          { n: "Boremund", t: "the stone stag",
            kids: [
              { n: "Borros", t: "four daughters, no letters", img: "hotd/borros-baratheon.jpg",
                sp: [{ n: "Elenda Caron", note: "of Nightsong" }],
                note: "chose the green letter; fell at the Kingsroad",
                kids: [
                  { n: "Cassandra, Maris, Ellyn & Floris", t: "the four daughters of Storm's End" },
                  { n: "Royce", t: "Lord of Storm's End at seven days old",
                    note: "born after his father was buried; Borros had asked for him to be called Aegon, and Elenda named him for her own father instead" } ] } ] },
          { n: "Jocelyn", t: "the black bride", sp: [{ n: "Aemon Targaryen", house: "targaryen" }],
            kids: [{ n: "Rhaenys Targaryen", t: "the Queen Who Never Was" }] } ] } },
    { title: "The Stags of the Rebellion",
      note: "Between the infant Lord Royce above and the Laughing Storm below lies a hundred years in which the books name no Lord of Storm's End at all — the stags are simply not written down. From Lyonel forward the descent is firm again: Ormund is called Lyonel's heir (a son, the histories imply, though they never say the word), and Ormund's marriage to a Targaryen princess is why, when the dragons fell, the realm could pretend the stag's crown was still the blood of the Conqueror.",
      root:
      { n: "Lyonel Baratheon", t: "the Laughing Storm", note: "rebelled once over a jilted daughter, yielded to Ser Duncan the Tall, and laughed after",
        kids: [
          { n: "his daughter", t: "promised to Prince Duncan", note: "he married Jenny of Oldstones instead, and the stormlands went to war about it" },
          { n: "Ormund Baratheon", t: "Lord of Storm's End, Hand",
            sp: [{ n: "Rhaelle Targaryen", house: "targaryen", note: "Egg's daughter" }],
            kids: [
              { n: "Steffon", t: "Lord of Storm's End", sp: [{ n: "Cassana Estermont" }],
                note: "drowned in Shipbreaker Bay before his sons' eyes",
                kids: [
                  { n: "Robert", t: "the Usurper, the whole of the realm", king: true, img: "got/robert-baratheon.jpg",
                    sp: [{ n: "Cersei Lannister", house: "lannister" }],
                    kids: [
                      { n: "Gendry", t: "a smith's apprentice of Flea Bottom", bastard: true, img: "got/gendry.jpg",
                        reveal: { s: 2, b: 2 }, note: "King Robert's bastard, though he does not know it",
                        spoil: { s: 8, b: 99, t: "Lord of Storm's End", note: "legitimized a Baratheon lord at the last" } },
                      { n: "Joffrey, Myrcella & Tommen", t: "the young princes", note: "Robert's trueborn heirs, golden of hair",
                        spoil: { s: 2, b: 2, bastard: true, t: "'his' children", note: "golden-haired, every one — the queen's by her brother; see House Lannister" } } ] },
                  { n: "Stannis", t: "the rightful heir, the iron king", king: true, img: "got/stannis-baratheon.jpg",
                    sp: [{ n: "Selyse Florent" }],
                    kids: [{ n: "Shireen", t: "the greyscale princess", img: "got/shireen-baratheon.jpg", note: "given to the flames" }] },
                  { n: "Renly", t: "the king in Highgarden", king: true, img: "got/renly-baratheon.jpg",
                    sp: [{ n: "Margaery Tyrell", house: "tyrell" }] } ] } ] } ] } } ] },

// ==================== HOUSE TULLY ====================
{ id: "tully", name: "House Tully", sigil: "../assets/sigils/tully.svg",
  words: "Family, Duty, Honor",
  blurb: "Lords of Riverrun and Lords Paramount of the Trident since the Conquest — raised over older river kings for being first to the Conqueror's side. Their daughters married half the realm's wars into being.",
  segments: [
    { title: "The Trouts of the Dance",
      note: "Old Lord Grover wanted the greens; his grandsons rode for the blacks. (The show hands Riverrun straight from Grover to his grandson Oscar — the books put Elmo and Kermit between.)",
      root:
      { n: "Grover Tully", t: "the old lord, green at heart",
        kids: [
          { n: "Elmo", t: "lord for nine and forty days",
            kids: [
              { n: "Kermit", t: "the young lord of the rivers", note: "led the rivermen at the Kingsroad" },
              { n: "Oscar", t: "the second son", note: "thrice a knight in one battle" } ] } ] } },
    { title: "The Trouts of the Rebellion",
      note: "Hoster's father is never given a name in any book — the last Tully of Riverrun the histories do name before him is Lord Medgar, who was knocked off his horse at Ashford in 209 AC and dead within two years, leaving a lord of eight behind him. Somewhere in that unnamed stretch the trout line reaches Hoster, who married his daughters into every war in the realm, and Brynden the Blackfish, who quarrelled with him and never married at all. Family, duty, honor — in that order.",
      root:
      { n: "Lord Tully", t: "Lord of Riverrun", note: "unnamed in the books — the chain from Lord Kermit down to him is not recorded",
        kids: [
          { n: "Hoster Tully", t: "Lord of Riverrun", img: "got/hoster-tully.jpg",
            sp: [{ n: "Minisa Whent", note: "of Harrenhal" }],
            kids: [
              { n: "Catelyn", t: "Lady of Winterfell", img: "got/catelyn-stark.jpg",
                sp: [{ n: "Eddard Stark", house: "stark" }],
                note: "her children are the wolves — see House Stark" },
              { n: "Lysa", t: "Lady of the Eyrie", img: "got/lysa-arryn.jpg",
                sp: [{ n: "Jon Arryn", house: "arryn" }, { n: "Petyr Baelish", note: "briefly", reveal: { s: 4, b: 4 } }],
                kids: [{ n: "Robin Arryn", t: "Lord of the Vale", img: "got/robin-arryn.jpg" }] },
              { n: "Edmure", t: "Lord of Riverrun", img: "got/edmure-tully.jpg",
                sp: [{ n: "Roslin Frey", note: "the Red Wedding's bride", reveal: { s: 3, b: 3 } }],
                kids: [{ n: "the heir of Riverrun", t: "born after the Red Wedding", note: "in the books; conceived on Edmure's wedding night", reveal: { s: 6, b: 5 } }] } ] },
          { n: "Brynden Tully", t: "the Blackfish", img: "got/brynden-tully.jpg",
            note: "Hoster's brother, the finest soldier the rivers ever made — and unwed to his brother's dying fury" } ] } } ] },

// ==================== HOUSE ARRYN ====================
{ id: "arryn", name: "House Arryn", sigil: "../assets/sigils/arryn.svg",
  words: "As High as Honor",
  blurb: "The oldest line of Andal nobility, Kings of Mountain and Vale before the Conquest and Wardens of the East after. The falcon marries into the dragon's story at both ends of it.",
  segments: [
    { title: "The Falcons of the Dance",
      note: "A Targaryen princess married into the Eyrie and gave the realm Queen Aemma; her kinswoman Jeyne held the Vale for Aemma's daughter.",
      root:
      { n: "Rodrik Arryn", t: "Lord of the Eyrie",
        sp: [{ n: "Daella Targaryen", house: "targaryen", note: "the Old King's daughter" }],
        kids: [
          { n: "Aemma Arryn", t: "queen to Viserys I", img: "hotd/aemma-arryn.jpg",
            sp: [{ n: "Viserys I Targaryen", house: "targaryen" }],
            kids: [{ n: "Rhaenyra Targaryen", t: "the black queen", img: "hotd/rhaenyra-targaryen.jpg" }] } ] } },
    { title: "The Maiden of the Vale",
      note: "Jeyne Arryn, cousin to Aemma's line, ruled the Vale in her own right against four male cousins' rebellions — and lent her falcons to a queen. She died of a chest cold in Gulltown in 134 AC with no child of her body, and the Vale went not down but sideways: her will gave the Eyrie to a fourth cousin who had guarded her Bloody Gate for ten years, and Ser Corwyn Corbray made the will stick over two other claimants, one imprisoned, one beheaded and one who got away.",
      root: { n: "Jeyne Arryn", t: "the Maiden of the Vale", img: "hotd/jeyne-arryn.jpg", note: "Lady of the Eyrie in her own right; died childless in 134 AC",
        kids: [{ n: "Joffrey Arryn", t: "her named heir — a fourth cousin, not a son",
          note: "Knight of the Bloody Gate, made Lord of the Eyrie by her testament rather than by her blood" }] } },
    { title: "The Falcons of the Rebellion",
      note: "Nothing in the books runs from Lord Joffrey to the falcons of the last century — no Arryn of the Eyrie is named again until Jasper, and his father is not among the named. From Jasper on it is plain: Jon Arryn raised two rebel wards, refused to give them up, and called his banners, and the war that ended the dragons began as high as honor.",
      root:
      { n: "Jasper Arryn", t: "Lord of the Eyrie", note: "the first Arryn the record names again, generations after the Maiden",
        kids: [
          { n: "Jon Arryn", t: "Lord of the Eyrie, Hand",
            sp: [{ n: "Jeyne Royce", note: "his first wife" }, { n: "Rowena Arryn", note: "his cousin, his second" }, { n: "Lysa Tully", house: "tully", note: "his third wife" }],
            note: "the death that starts the whole tale",
            kids: [{ n: "Robin Arryn", t: "Lord of the Vale, Defender of the Vale", img: "got/robin-arryn.jpg" }] },
          { n: "Ronnel", t: "Jon's brother" },
          { n: "Alys", t: "wed to Ser Elys Waynwood" } ] } } ] },

// ==================== HOUSE MARTELL ====================
{ id: "martell", name: "House Martell", sigil: "../assets/sigils/new/martell.webp",
  words: "Unbowed, Unbent, Unbroken",
  blurb: "Princes of Dorne since Nymeria of the Rhoyne burned her ten thousand ships and wed Mors Martell. Dorne bowed to no dragon — it married one, a century after the Dance, and kept its title of Prince either way.",
  segments: [
    { title: "The Suns of Sunspear",
      note: "Dorne needs no bridge because Dorne never broke: Qoren Martell sat out the Dance entirely, his daughter Aliandra fancied herself the new Nymeria, and a century and a half later Prince Maron wed King Daeron's sister and brought Dorne into the realm by contract rather than by conquest, in 187 AC. The princess below is the ruling Princess of Dorne some generations after that — never named in the books. Her daughter married the last dragon prince, and her sons never forgot what came of it.",
      root:
      { n: "The Princess of Dorne", t: "ruler of Sunspear",
        kids: [
          { n: "Doran", t: "Prince of Dorne, the patient", img: "got/doran-martell.jpg",
            sp: [{ n: "Mellario of Norvos" }],
            kids: [
              { n: "Arianne", t: "the heir, in the books" },
              { n: "Quentyn", t: "the dragon-taker, in the books", note: "dragons are not tamed by good intentions" },
              { n: "Trystane", t: "betrothed to Myrcella", img: "got/trystane-martell.jpg" } ] },
          { n: "Elia", t: "princess, wed to the dragon", img: "got/elia-martell.jpg",
            sp: [{ n: "Rhaegar Targaryen", house: "targaryen" }],
            kids: [{ n: "Rhaenys & Aegon", t: "slain in the Sack of King's Landing" }] },
          { n: "Oberyn", t: "the Red Viper", img: "got/oberyn-martell.jpg",
            sp: [{ n: "Ellaria Sand", note: "his paramour, and mother of the youngest" }],
            kids: [
              { n: "Obara Sand", t: "the eldest Sand Snake, the spear", bastard: true, img: "got/obara-sand.jpg" },
              { n: "Nymeria Sand", t: "'Lady Nym', the whip", bastard: true, img: "got/nymeria-sand.jpg" },
              { n: "Tyene Sand", t: "the poisoner, septa's daughter", bastard: true, img: "got/tyene-sand.jpg" },
              { n: "Sarella Sand", t: "'Alleras' at the Citadel, in the books", bastard: true },
              { n: "Elia Sand", t: "the eldest of Ellaria's daughters, in the books", bastard: true },
              { n: "Obella, Dorea & Loreza", t: "Ellaria's younger Sand Snakes, in the books", bastard: true } ] } ] } } ] },

// ==================== HOUSE TYRELL ====================
{ id: "tyrell", name: "House Tyrell", sigil: "../assets/sigils/tyrell.svg",
  words: "Growing Strong",
  blurb: "Stewards of Highgarden raised to rule the Reach when the last Gardener king burned on the Field of Fire. The rose grows toward whatever throne shines warmest — and its thorns were always the grandmother's.",
  segments: [
    { title: "The Roses of Highgarden",
      note: "The rose has no gap to close: Lord Lyonel was an infant through the Dance and his regents held the Reach for him, Leo Longthorn jousted his way through two more reigns, and the record simply thins to a list of names until Luthor Tyrell rode his horse off a cliff hawking. Everything that mattered at Highgarden afterward was Olenna's doing, whoever held the title.",
      root:
      { n: "Luthor Tyrell", t: "Lord of Highgarden",
        sp: [{ n: "Olenna Redwyne", note: "the Queen of Thorns", img: "got/olenna-tyrell.jpg" }],
        kids: [
          { n: "Mace", t: "Lord of Highgarden, thrice a fool", img: "got/mace-tyrell.jpg",
            sp: [{ n: "Alerie Hightower", house: "hightower", note: "of Oldtown" }],
            kids: [
              { n: "Willas", t: "the crippled heir, in the books", note: "a leg ruined in a tourney by Oberyn Martell" },
              { n: "Garlan", t: "the Gallant, in the books", sp: [{ n: "Leonette Fossoway" }] },
              { n: "Loras", t: "the Knight of Flowers", img: "got/loras-tyrell.jpg" },
              { n: "Margaery", t: "thrice a queen", king: true, img: "got/margaery-tyrell.jpg",
                sp: [{ n: "Renly Baratheon", house: "baratheon" }, { n: "Joffrey Baratheon", house: "lannister" }, { n: "Tommen Baratheon", house: "lannister" }] } ] },
          { n: "Mina", t: "wed to the Arbor", sp: [{ n: "Paxter Redwyne" }],
            kids: [{ n: "Horas & Hobber", t: "'Horror and Slobber', in the books" }, { n: "Desmera Redwyne", t: "the Arbor's daughter, in the books" }] },
          { n: "Janna", t: "wed to a Fossoway", sp: [{ n: "Ser Jon Fossoway" }] } ] } } ] },

// ==================== HOUSE GREYJOY ====================
{ id: "greyjoy", name: "House Greyjoy", sigil: "../assets/sigils/new/greyjoy.webp",
  words: "We Do Not Sow",
  blurb: "Krakens of Pyke, chosen to rule the Iron Islands when the black line of Harren burned. Lords Reaper who pay the iron price — on other people's coasts, whenever the green lands are busy killing each other.",
  segments: [
    { title: "The Red Kraken",
      note: "Dalton Greyjoy was Lord Reaper at sixteen and treated the Dance as an invitation. The west still remembers his longships. He never took a rock wife, so when a salt wife opened his throat at Faircastle in 133 AC the Seastone Chair fell to boys nobody could agree on, and the islands spent years killing each other over the answer.",
      root: { n: "Dalton Greyjoy", t: "the Red Kraken", note: "reaved the western coasts through the Dance; knifed in a stolen bed at Faircastle",
        kids: [
          { n: "Toron", t: "a salt son", note: "the chair was his by law, which held for about as long as anything holds on Pyke" },
          { n: "Rodrik", t: "a salt son", note: "raised up against his half-brother by Dalton's cousins; taken west in the end, gelded, and kept as a fool at Casterly Rock" } ] } },
    { title: "The Krakens of the Rebellions",
      note: "Who held Pyke between the Red Kraken's murder and Dagon Greyjoy, the Last Reaver, is not written anywhere. What is written is that Quellon was Dagon's grandson — so exactly one man stands between them, and nobody troubled to record his name. Quellon tried to gentle the ironborn; his sons preferred the Old Way, twice, and paid for it both times.",
      root:
      { n: "Dagon Greyjoy", t: "the Last Reaver, Lord Reaper of Pyke",
        note: "raided the Sunset Sea coasts through Aerys I's reign, while the Iron Throne was busy reading",
        kids: [
        { n: "a son of Lord Dagon", t: "unnamed in the record",
          note: "the histories give Quellon as Dagon's grandson and stop there; the generation between is a blank",
          kids: [
      { n: "Quellon Greyjoy", t: "Lord Reaper of Pyke, the reformer",
        note: "died raiding the Reach in Robert's Rebellion",
        kids: [
          { n: "Balon", t: "the twice-crowned kraken", king: true, img: "got/balon-greyjoy.jpg",
            sp: [{ n: "Alannys Harlaw", note: "of Ten Towers" }],
            kids: [
              { n: "Rodrik", t: "the heir", note: "slain at Seagard in the first rebellion" },
              { n: "Maron", t: "the second son", note: "slain in the storming of Pyke" },
              { n: "Asha", t: "Yara in the show — the she-kraken", img: "got/yara-greyjoy.jpg" },
              { n: "Theon", t: "ward of Winterfell, Reek, redeemed", img: "got/theon-greyjoy.jpg" } ] },
          { n: "Euron", t: "the Crow's Eye", king: true, img: "got/euron-greyjoy.jpg", note: "kinslayer, kingsmoot king" },
          { n: "Victarion", t: "the Iron Captain, in the books" },
          { n: "Aeron", t: "the Damphair, priest of the Drowned God", img: "got/aeron-greyjoy.jpg" },
          { n: "Urrigon", t: "'Urri', died young", note: "of a poisoned wound" },
          { n: "Harlon & Robin", t: "the brothers who died young", note: "of greyscale and in the cradle" } ] } ] } ] } } ] },
];
