# Legal notes for running The Known World commercially

*Compiled July 2026. This is research and reasoning, not legal advice — spend an hour with an IP
lawyer before switching ads on (in Norway: Advokatforeningen's referral service).*

## The core principle

**Crediting is not a license.** Attribution satisfies moral courtesy; it does not grant the right to
use copyrighted material commercially. "Every picture is HBO's" written under a picture changes
nothing about whether the picture may be used to earn money.

## Item-by-item risk map

### 1. Character portraits / show stills — HIGH RISK
All ~300 portraits are cropped promotional stills © Home Box Office, Inc. / Warner Bros. Discovery,
plus the actors have publicity rights in their likenesses.
- Current mitigation (done): shown small, next to original commentary, credited ("Still © HBO"),
  takedown offer on credits.html — this is a **fair-use posture** (identification & commentary),
  which is a defense argued in court, not a permission.
- Real fix: commission original character artwork, or remove portraits.
- Note: ad networks (AdSense) may reject the site on the stills alone, regardless of legal merits.

### 2. The base map — MITIGATED WITH ORIGINAL ARTWORK
`assets/ASOIAF_map.jpg` and `.png` are now an original 5652×3682 redraw made for this site. The
surface textures and terrain symbols were generated specifically for the replacement; roads, the
Wall, rivers, labels, snow, coast cleanup, and decorative placement are independently authored by
the local deterministic compositor. The old promotional raster is retained only as an offline
registration reference under `assets/_sources/map-redraw/legacy-reference/` and must remain excluded
from deployment.
- Keep the build manifest and source notes with the project as provenance. This materially reduces
  the artwork-copying risk, but it does not remove separate rights questions around the fictional
  setting, names, trademarks, or the rest of the site's media.

### 3. Heraldry / sigils from fan wikis — LOW RISK IF ATTRIBUTED
Fandom & awoiaf publish under **CC BY-SA 3.0** → commercial use IS allowed, if you (a) credit the
artists/source, (b) link the license, (c) share adaptations under the same license. Done on
credits.html. The hand-drawn shields (two-color arms, Dunk & Egg sigils) are original to this site.

### 4. Site text — SAFE (kept that way)
All chronicle text, wiki articles, quiz questions and descriptions were written originally for this
site; nothing is copied from any wiki (wiki text is CC BY-SA — copying it would force share-alike
licensing). Names, episode titles and plot **facts** are not copyrightable; describing what happens
in your own words is broadly fine. Very long verbatim-faithful plot retellings can edge toward
"derivative work" — keep summaries in commentary voice.

### 5. Quotes ("Words of the day") — LOW-MEDIUM RISK
Verbatim show/book lines. Short quotes are usually defensible; in an ad-funded product keep them few
and brief, or remove.

### 6. Trademarks — MANAGEABLE, RULES APPLIED
"Game of Thrones", "House of the Dragon", "Westeros" etc. are registered marks (HBO / GRRM).
- Allowed: *referring* to them descriptively (nominative use) — "an unofficial companion to…".
- Not allowed: branding yourself with them — don't put franchise names in the domain, logo, or site
  name. Site brand is "The Known World"; keep it that way. "Unofficial — not affiliated with,
  endorsed, sponsored, or approved by HBO or George R.R. Martin" disclaimers are in every footer.

### 7. Fonts & glyphs — SAFE
Cinzel + EB Garamond: SIL Open Font License (commercial OK). Map pin glyphs: game-icons.net
(Delapouite) CC BY 3.0 — credited on credits.html.

## How the big wikis get away with it

1. **Platform safe harbor**: Fandom's images are uploaded by *users*, so Fandom shelters behind the
   DMCA safe harbor for user-generated content and removes items on request. A site whose owner
   uploads everything himself gets NO such shelter for his own uploads.
2. **Fair use posture** (US): small images, identification/commentary context, encyclopedic purpose,
   no market substitution. It's a defense, not permission — but it's why rights holders usually send
   a takedown email rather than a lawsuit.
3. **Facts aren't copyrightable**: names, episode titles, plot facts are free to describe in your own
   words. Wiki *text* is CC BY-SA (user-contributed), which is reusable **with** attribution +
   share-alike.

## Compliance to do BEFORE ads go live (Norway/EEA)

- **GDPR + ePrivacy**: consent banner via a TCF-registered CMP (Google requires it in the EEA),
  privacy policy, cookie policy.
- **Site owner identification** (ehandelsloven): name + contact on the site (About page contact card
  is still blank — fill it).
- **Terms of service** page.
- **DMCA / takedown contact**; if hosted in the US, register a DMCA agent.
- **Business registration**: ENK/AS in Brønnøysundregistrene, MVA threshold, declare ad income.
- **AdSense policy**: expect review friction over the stills; have the commissioned-art plan ready.

## Priority action list

1. Keep the original basemap source package and manifest out of the deploy bundle but in project archives.
2. Decide on stills: keep the fair-use posture (risk) or commission portraits (safe + distinctive).
3. Privacy policy + consent banner + filled contact card + ToS before monetizing.
4. One hour with an IP lawyer to bless the setup.

## What is already in place on the site (July 2026)

- credits.html: full credits & licenses page with takedown offer.
- Original 5652×3682 basemap replacement, deterministic build manifest, and source provenance.
- "Still © HBO · credits" captions under every portrait (map character cards + wiki pages).
- "Unofficial — not affiliated…" footers on home, wikis, credits.
- All text original; heraldry attribution; nominative-use branding ("The Known World").
- No "non-commercial" claims anywhere (site is intended to be commercial).
