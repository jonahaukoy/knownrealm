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
    if (!href) return outRoot + "/index.html";
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

  var manifest = [];
  var routes = window.KW_PRERENDER.routes();
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
    /* point the article's own in-wiki links at the live SPA so a reader who lands
       here from search can click straight into the interactive experience */
    var content = r.html.replace(/href="#/g, 'href="' + spaHref + '#');

    var doc =
      "<!doctype html>\n<html lang=\"en\">\n<head>\n" +
      "<meta charset=\"UTF-8\">\n" +
      "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n" +
      "<base href=\"" + esc(assetBase) + "\">\n" +
      "<title>" + esc(title) + "</title>\n" +
      "<meta name=\"description\" content=\"" + esc(desc) + "\">\n" +
      "<link rel=\"canonical\" href=\"" + esc(loc) + "\">\n" +
      css.map(function (h) { return "<link rel=\"stylesheet\" href=\"" + esc(h) + "\">"; }).join("\n") + "\n" +
      "</head>\n<body class=\"wiki-body\">\n" +
      "<header class=\"topbar wiki-topbar\"><a class=\"brand home-brand\" href=\"" + esc(spaHref) +
        "\" style=\"text-decoration:none;color:var(--text-light)\">" +
        "<span class=\"brand-icon\">&#10022;</span><span class=\"brand-name\">" + esc(siteName.toUpperCase()) +
        "</span></a></header>\n" +
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
