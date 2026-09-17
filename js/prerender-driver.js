/* PRERENDER DRIVER — inert in production.
 *
 * Does nothing at all unless the page is opened with ?prerender=1. Under that flag
 * it walks every route the wiki engine reports (window.KW_PRERENDER), renders each
 * to finished HTML, wraps it in a complete, crawlable static document, and drops a
 * JSON manifest of { path, loc, html } into <pre id="kw-prerender-out"> for the
 * build script (prerender/build.ps1) to write to disk.
 *
 * All page-shaping lives here in JS (which has the DOM and the data) so the build
 * script stays thin I/O. It is fully re-runnable: it reads whatever the data files
 * currently hold, so adding pages later needs no change here — just re-run the build.
 *
 * Per-site settings come from window.KW_PRERENDER_CFG, set inline in each wiki.html:
 *   { siteName, assetBase, spaHref, outRoot, origin, css:[...] }
 *   assetBase  <base href> so the content's relative asset/link URLs resolve
 *              ("/" for the root GoT wiki, "/hotd/" and "/knight/" for the others)
 *   spaHref    absolute path to the live single-page wiki ("/wiki.html")
 *   outRoot    where the static files go, relative to the deploy root ("p/got")
 *   origin     absolute site origin for <loc>/canonical (swap the placeholder at deploy)
 */
(function () {
  if (location.search.indexOf("prerender=1") < 0) return;
  if (!window.KW_PRERENDER) { document.title = "KW_PRERENDER_ERROR:no-hook"; return; }
  var CFG = window.KW_PRERENDER_CFG || {};
  var siteName = CFG.siteName || "Wiki";
  var assetBase = CFG.assetBase || "/";
  var spaHref = CFG.spaHref || "/wiki.html";
  var mapHref = CFG.mapHref || assetBase;
  var outRoot = (CFG.outRoot || "p").replace(/\/+$/, "");
  var origin = (CFG.origin || "https://knownrealm.com").replace(/\/+$/, "");
  var css = CFG.css || [];

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  function slug(s) {
    return String(s).toLowerCase()
      .replace(/['’".]/g, "")          /* drop apostrophes/quotes/dots */
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "x";
  }
  /* map a hash route to a static file path under outRoot */
  function pathFor(href) {
    if (!href || href === "#") return outRoot + "/index.html";
    var body = href.charAt(0) === "#" ? href.slice(1) : href;
    var eq = body.indexOf("=");
    if (eq < 0) return outRoot + "/" + slug(body) + ".html";
    var kind = body.slice(0, eq);
    var id = decodeURIComponent(body.slice(eq + 1));
    /* episode/chapter ids look like "1-7" — keep them as-is, they slug cleanly */
    return outRoot + "/" + slug(kind) + "/" + slug(id) + ".html";
  }
  function trimDesc(s) {
    s = String(s || "").replace(/\s+/g, " ").trim();
    if (s.length > 155) s = s.slice(0, 152).replace(/\s+\S*$/, "") + "…";
    return s;
  }

  /* ---- structured data (JSON-LD) ----
     Google indexes THIS static mirror, not the live hash-routed SPA, so this is
     the only place schema.org markup can actually reach a crawler. Kept modest
     and honest: a breadcrumb trail on every page (real navigational value, and
     the piece most likely to surface in a search result), plus a type-specific
     entity — Person for a character, Organization for a house/order, Place for
     a location, WebSite for the home page, CollectionPage for a category index,
     and a plain WebPage everywhere else. No property is invented that the page
     itself doesn't already state. */
  var CATEGORY = {
    char: { label: "Characters", cat: "characters" },
    house: { label: "Houses & Orders", cat: "houses" },
    group: { label: "Houses & Orders", cat: "houses" },
    loc: { label: "Places", cat: "places" },
    episode: { label: "Episodes", cat: "episodes" },
    chapter: { label: "Chapters", cat: "chapters" },
  };
  var SCHEMA_TYPE = { char: "Person", house: "Organization", group: "Organization", loc: "Place" };
  function kindOf(href) {
    if (!href) return "";
    var body = href.charAt(0) === "#" ? href.slice(1) : href;
    var eq = body.indexOf("=");
    return eq < 0 ? body : body.slice(0, eq);
  }
  function breadcrumbLD(kind, pageTitle, pageLoc) {
    var items = [{ "@type": "ListItem", position: 1, name: siteName, item: origin + "/" + pathFor("") }];
    var pos = 2;
    if (kind && kind !== "cat" && CATEGORY[kind]) {
      items.push({ "@type": "ListItem", position: pos++, name: CATEGORY[kind].label,
        item: origin + "/" + pathFor("#cat=" + CATEGORY[kind].cat) });
    }
    if (kind) items.push({ "@type": "ListItem", position: pos++, name: pageTitle, item: pageLoc });
    return { "@type": "BreadcrumbList", itemListElement: items };
  }
  var CAT_LABEL = {
    characters: "Characters", houses: "Houses & Orders", places: "Places",
    episodes: "Episodes", chapters: "Chapters", ages: "The Ages of the Realm",
  };
  function entityLD(kind, pageTitle, desc, pageLoc, catId) {
    if (!kind) return { "@type": "WebSite", name: siteName, url: pageLoc, description: desc };
    if (kind === "cat") {
      var label = CAT_LABEL[catId] || pageTitle;
      return { "@type": "CollectionPage", name: label, description: label + " — " + siteName, url: pageLoc };
    }
    return { "@type": SCHEMA_TYPE[kind] || "WebPage", name: pageTitle, description: desc, url: pageLoc };
  }
  function ldJSON(href, pageTitle, desc, pageLoc) {
    var kind = kindOf(href);
    var catId = kind === "cat" ? decodeURIComponent((href.slice(1).split("=")[1] || "")) : "";
    var crumbTitle = kind === "cat" ? (CAT_LABEL[catId] || pageTitle) : pageTitle;
    var graph = { "@context": "https://schema.org", "@graph": [entityLD(kind, pageTitle, desc, pageLoc, catId), breadcrumbLD(kind, crumbTitle, pageLoc)] };
    return JSON.stringify(graph).replace(/</g, "\\u003c");
  }

  var manifest = [];
  var routes = window.KW_PRERENDER.routes();
  /* every path this run WILL write — computed up front so in-article links can be
     rewritten to real, crawlable sibling pages (see `content` below) instead of the
     live SPA's hash routes, which Google does not treat as separate crawlable URLs.
     Without this, all ~1,400 pages were orphans reachable only via the sitemap —
     zero internal link signal, which is a classic cause of mass
     "Discovered - currently not indexed". A link whose target isn't in this set
     (falls outside what routes() enumerates) still falls back to the live SPA. */
  var validPaths = {};
  for (var vi = 0; vi < routes.length; vi++) validPaths[pathFor(routes[vi])] = 1;

  var seen = {};
  for (var i = 0; i < routes.length; i++) {
    var href = routes[i];
    var path = pathFor(href);
    if (seen[path]) continue;               /* de-dupe (aliases can collide) */
    seen[path] = 1;

    var r;
    try { r = window.KW_PRERENDER.render(href); }
    catch (e) { continue; }                 /* a bad route never breaks the whole run */

    var loc = origin + "/" + path;
    var title = (r.title ? r.title + " — " : "") + siteName;
    var desc = trimDesc(r.desc) || siteName;
    /* point each in-article link at its sibling static page when one exists (real,
       crawlable navigation the mirror needs — see validPaths above), and fall back
       to the live SPA only for hash routes this build doesn't generate a page for */
    var content = r.html.replace(/href="#([^"]*)"/g, function (m, frag) {
      var target = pathFor("#" + frag);
      if (validPaths[target]) return 'href="/' + target + '"';
      return 'href="' + spaHref + '#' + frag + '"';
    });

    var doc =
      "<!doctype html>\n<html lang=\"en\">\n<head>\n" +
      "<meta charset=\"UTF-8\">\n" +
      "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n" +
      "<base href=\"" + esc(assetBase) + "\">\n" +
      "<title>" + esc(title) + "</title>\n" +
      "<meta name=\"description\" content=\"" + esc(desc) + "\">\n" +
      "<link rel=\"canonical\" href=\"" + esc(loc) + "\">\n" +
      "<script type=\"application/ld+json\">" + ldJSON(href, r.title || siteName, desc, loc) + "</script>\n" +
      css.map(function (h) { return "<link rel=\"stylesheet\" href=\"" + esc(h) + "\">"; }).join("\n") + "\n" +
      "</head>\n<body class=\"wiki-body\">\n" +
      "<header class=\"topbar wiki-topbar\" style=\"display:flex;align-items:center;gap:18px;flex-wrap:wrap\">" +
        "<a class=\"brand home-brand\" href=\"" + esc(spaHref) +
        "\" style=\"text-decoration:none;color:var(--text-light)\">" +
        "<span class=\"brand-icon\">&#10022;</span><span class=\"brand-name\">" + esc(siteName.toUpperCase()) +
        "</span></a>" +
        /* a reader who lands here straight from a search result has, without this,
           exactly one way off the page (the brand link above) — this row is the
           rest of the site's own nav, so "Home" and "Map" are one click away
           instead of a dead end. */
        "<nav style=\"display:flex;gap:14px;font-size:13px\">" +
          "<a href=\"" + esc(origin + "/") + "\" style=\"color:var(--text-muted)\">Home</a>" +
          "<a href=\"" + esc(mapHref) + "\" style=\"color:var(--text-muted)\">Map</a>" +
        "</nav></header>\n" +
      "<main class=\"wiki-main\">" + content + "</main>\n" +
      "<footer class=\"wiki-footer\">Unofficial companion &mdash; all chronicle text is original to this site. " +
        "<a href=\"" + esc(spaHref) + "\">Open the interactive wiki</a>.</footer>\n" +
      "</body>\n</html>\n";

    manifest.push({ path: path, loc: loc, html: doc });
  }

  /* NDJSON — one page per line — so the build script can parse it a line at a time
     instead of choking on one enormous JSON blob */
  var pre = document.createElement("pre");
  pre.id = "kw-prerender-out";
  pre.textContent = manifest.map(function (m) { return JSON.stringify(m); }).join("\n");
  document.body.innerHTML = "";
  document.body.appendChild(pre);
  document.title = "KW_PRERENDER_DONE:" + manifest.length;
})();
