# The Known Realm

**An unofficial fan companion to _Game of Thrones_, _House of the Dragon_ and _A Knight of the Seven Kingdoms_** — three interactive maps that follow the story point by point, three encyclopedias written out at length, the family trees of the great houses, a twelve-thousand-year timeline, and a handful of games. Live at **[knownrealm.com](https://knownrealm.com)**.

Built as plain, dependency-free **HTML, CSS and JavaScript** — no framework, no build step, no accounts. Every page opens straight in a browser.

## Running it locally

Open `index.html` in any modern browser. That's the whole thing. (A tiny static server such as `python -m http.server` is only needed if you want the hash-routed wiki pages to be fetched over `http://` rather than `file://`.)

## Layout

| Path | What it is |
|------|------------|
| `index.html` | Home |
| `map.html`, `hotd/`, `knight/` | The three interactive maps |
| `wiki.html`, `hotd/wiki.html`, `knight/wiki.html` | The encyclopedias |
| `trees/` | House family trees |
| `whitebook.html`, `timeline.html`, `gallery.html` | The White Book, the timeline, the gallery |
| `smallcouncil/`, `wordle/`, `higherlower/`, `whosaidit/`, `sigilmatch/`, `blur/`, `quiz/`, `trivia/` | The games |
| `js/`, `css/`, `assets/` | Shared engine, styles and art |
| `p/` | Prerendered static copies of the wiki articles (generated — see below) |
| `prerender/` | The re-runnable static-site generator (`build.ps1`) |

## Prerender (SEO)

The wikis are single-page apps, so their ~1,400 articles are invisible to search engines behind the `#` in the URL. `prerender/build.ps1` renders every article to a real static file under `p/` and writes `sitemap-prerender.xml`. Re-run it after adding content:

```powershell
& ".\prerender\build.ps1"
```

## Licence & credits

This is **not** open-source. The site's original work — its prose, code, layout, artwork (the gallery scenes, the base map and the weirwood emblem), and games — is **© Jon-Anders Haukøy, all rights reserved**; see [`LICENSE`](LICENSE). It also uses third-party material (television stills, some community heraldry, fonts and map-pin glyphs) under the terms set out on the site's [Credits & Licenses](credits.html) page. The underlying fictional worlds belong to George R.R. Martin and HBO / Warner Bros. Discovery; this project is unaffiliated with them.

## Contact

Corrections, lore and ideas are welcome — **knownrealm@gmail.com**.
