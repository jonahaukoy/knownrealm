/* THE COMBINED TREE — one interconnected lineage for the "All the Houses" view.
   The Targaryen line is the spine; the great houses that wed into it (Velaryon,
   Baratheon, Hightower, Arryn, Royce, Martell, Blackwood) branch off at their
   marriages, each member coloured by their own house via the node's `house`
   field. Curated (not every cradle-death child) so it reads like the great
   drawn trees. Each person is placed once in their lineage home; a marriage
   into another line is shown as a coloured spouse-card on one partner.
   Node schema is the same as trees-data.js; `house` sets a node's own colour. */
const COMBINED_TREE = {
  title: "The Dragon and the Great Houses",
  note: "One tree, many houses — the blood of the dragon and the great lines wed into it, each in its own hue. From Jaehaerys the Conciliator to the Mother of Dragons, by way of the Dance that near unmade them all.",
  root:
  { n: "Jaehaerys I", t: "the Old King, the Conciliator", king: true,
    sp: [{ n: "Alysanne, his sister", note: "the Good Queen" }],
    kids: [

      /* ---- Aemon's line: the Velaryons marry in ---- */
      { n: "Aemon", t: "Prince of Dragonstone", note: "heir, slain on Tarth",
        sp: [{ n: "Jocelyn Baratheon", house: "baratheon" }],
        kids: [
          { n: "Rhaenys", t: "the Queen Who Never Was", img: "hotd/rhaenys-targaryen.jpg",
            sp: [{ n: "Corlys Velaryon", house: "velaryon", note: "the Sea Snake" }],
            kids: [
              { n: "Laena Velaryon", t: "rider of Vhagar", house: "velaryon", img: "hotd/laena-velaryon.jpg",
                sp: [{ n: "Daemon Targaryen", house: "targaryen", note: "the Rogue Prince" }],
                kids: [
                  { n: "Baela", t: "by Daemon · rider of Moondancer", img: "hotd/baela-targaryen.jpg",
                    sp: [{ n: "Alyn of Hull", house: "velaryon", note: "the Oakenfist" }] },
                  { n: "Rhaena", t: "by Daemon · keeper of the eggs", img: "hotd/rhaena-targaryen.jpg",
                    sp: [{ n: "Corwyn Corbray" }] } ] },
              { n: "Laenor Velaryon", t: "rider of Seasmoke", house: "velaryon", img: "hotd/laenor-velaryon.jpg",
                sp: [{ n: "Rhaenyra, the queen", house: "targaryen" }], note: "his heirs carry the queen's line" },
              { n: "Addam of Hull", t: "the dragonseed", house: "velaryon", bastard: true, note: "silver-haired, dragon-worthy — given the name at the last" } ] } ] },

      /* ---- Baelon's line: the main dragon spine ---- */
      { n: "Baelon", t: "the Brave, Prince of Dragonstone",
        sp: [{ n: "Alyssa, his sister", note: "mother of Viserys I and Daemon" }],
        kids: [

          { n: "Viserys I", t: "the golden age, spent", king: true, img: "hotd/viserys-i.jpg",
            sp: [{ n: "Aemma Arryn", house: "arryn" }, { n: "Alicent Hightower", house: "hightower" }],
            kids: [
              { n: "Rhaenyra", t: "the Realm's Delight · by Aemma", king: true, img: "hotd/rhaenyra-targaryen.jpg",
                sp: [{ n: "Laenor Velaryon", house: "velaryon" }, { n: "Daemon, her uncle" }],
                kids: [
                  { n: "Jacaerys Velaryon", t: "by Laenor · rider of Vermax", house: "velaryon", img: "hotd/jacaerys-velaryon.jpg", note: "lost in the Gullet" },
                  { n: "Lucerys Velaryon", t: "by Laenor · rider of Arrax", house: "velaryon", img: "hotd/lucerys-velaryon.jpg", note: "taken by Vhagar" },
                  { n: "Joffrey Velaryon", t: "by Laenor · rider of Tyraxes", house: "velaryon", img: "hotd/joffrey-velaryon.jpg" },
                  { n: "Aegon III", t: "the Dragonbane · by Daemon", king: true, img: "hotd/aegon-the-younger.jpg",
                    sp: [{ n: "Jaehaera Targaryen", note: "his cousin" }, { n: "Daenaera Velaryon", house: "velaryon" }],
                    kids: [
                      { n: "Daeron I", t: "the Young Dragon", king: true },
                      { n: "Baelor", t: "the Blessed", king: true },
                      { n: "Daena", t: "the Defiant", note: "mother of Daemon Blackfyre" } ] },
                  { n: "Viserys II", t: "by Daemon · king for a year", king: true, img: "hotd/viserys-the-younger.jpg",
                    kids: [
                      { n: "Aegon IV", t: "the Unworthy", king: true,
                        sp: [{ n: "Naerys, his sister" }],
                        kids: [
                          { n: "Daeron II", t: "the Good", king: true,
                            sp: [{ n: "Myriah Martell", house: "martell" }],
                            kids: [
                              { n: "Maekar I", t: "the Anvil", king: true,
                                kids: [
                                  { n: "Aemon", t: "maester at the Wall", img: "got/maester-aemon.jpg", note: "refused the crown for the chain" },
                                  { n: "Aegon V", t: "the Unlikely — 'Egg'", king: true,
                                    sp: [{ n: "Betha Blackwood", house: "blackwood", note: "Black Betha" }],
                                    kids: [
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
                                                  { n: "Jon Snow", t: "by Lyanna — R+L=J", img: "got/jon-snow.jpg", king: true, reveal: { s: 7, b: 5 }, note: "raised as Ned Stark's bastard son" } ] },
                                              { n: "Viserys", t: "the Beggar King", img: "got/viserys-targaryen.jpg" },
                                              { n: "Daenerys", t: "Stormborn, Mother of Dragons", king: true, img: "got/daenerys-targaryen.jpg",
                                                sp: [{ n: "Khal Drogo", img: "got/khal-drogo.jpg" }], note: "the last dragon of the line" } ] } ] },
                                      { n: "Rhaelle", t: "wed to Storm's End",
                                        sp: [{ n: "Ormund Baratheon", house: "baratheon" }],
                                        kids: [
                                          { n: "Steffon Baratheon", t: "Lord of Storm's End", house: "baratheon",
                                            sp: [{ n: "Cassana Estermont", house: "baratheon" }],
                                            kids: [
                                              { n: "Robert", t: "the Usurper", house: "baratheon", king: true, img: "got/robert-baratheon.jpg",
                                                sp: [{ n: "Cersei Lannister", house: "lannister" }] },
                                              { n: "Stannis", t: "the iron king", house: "baratheon", king: true, img: "got/stannis-baratheon.jpg",
                                                sp: [{ n: "Selyse Florent" }],
                                                kids: [{ n: "Shireen", t: "the greyscale princess", house: "baratheon", img: "got/shireen-baratheon.jpg" }] },
                                              { n: "Renly", t: "the king in Highgarden", house: "baratheon", king: true, img: "got/renly-baratheon.jpg",
                                                sp: [{ n: "Margaery Tyrell", house: "tyrell" }] } ] } ] } ] } ] } ] } ] } ] } ] },

              { n: "Aegon II", t: "the elder · by Alicent", king: true, img: "hotd/aegon-ii.jpg",
                sp: [{ n: "Helaena, his sister", img: "hotd/helaena-targaryen.jpg" }],
                kids: [
                  { n: "Jaehaerys", t: "a son for a son", img: "hotd/jaehaerys-targaryen.jpg" },
                  { n: "Jaehaera", t: "wed to Aegon III", img: "hotd/jaehaera-targaryen.jpg" },
                  { n: "Maelor", t: "lost at Bitterbridge", note: "the book's telling only" } ] },
              { n: "Aemond", t: "by Alicent · One-Eye, rider of Vhagar", img: "hotd/aemond-targaryen.jpg", note: "fell with Daemon above the Gods Eye" },
              { n: "Daeron", t: "by Alicent · the Daring", note: "fell at Second Tumbleton" } ] },

          { n: "Daemon", t: "the Rogue Prince, rider of Caraxes", img: "hotd/daemon-targaryen.jpg",
            sp: [{ n: "Rhea Royce", house: "royce", note: "the Bronze Fury, of Runestone" }, { n: "Laena Velaryon", house: "velaryon" }, { n: "Rhaenyra, his niece" }],
            note: "his children ride with the queen — see Rhaenyra and Laena" } ] },

      /* ---- Daella's line: the falcons of the Vale ---- */
      { n: "Daella", t: "the gentlest daughter",
        sp: [{ n: "Rodrik Arryn", house: "arryn" }],
        kids: [
          { n: "Aemma Arryn", t: "queen to Viserys I", house: "arryn", img: "hotd/aemma-arryn.jpg",
            sp: [{ n: "Viserys I, the king", house: "targaryen" }], note: "her daughter is Rhaenyra the queen" } ] } ] }
};

/* the in-law patriarchs whose own kin sit beside the dragons: shown as small
   side-roots so their houses are whole (Hightower, and the Sea Snake's brother). */
const COMBINED_SIDE = [
  { house: "hightower",
    root: { n: "Otto Hightower", t: "Hand of the King", house: "hightower",
      note: "the clever second son of Oldtown who set his daughter beside the throne",
      kids: [
        { n: "Alicent", t: "the queen · Viserys I's second wife", house: "hightower", img: "hotd/alicent-hightower.jpg",
          note: "her children are the greens — see the dragon line" },
        { n: "Gwayne", t: "a knight of Oldtown", house: "hightower" } ] } },
  { house: "velaryon",
    root: { n: "Vaemond Velaryon", t: "the Sea Snake's brother", house: "velaryon",
      note: "pressed his own claim to Driftmark — and lost his head for it" } }
];
