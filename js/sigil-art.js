/* SIGIL ART — which house arms have been redrawn by the site's owner.

   The engines used to hardcode `<dir><id>.svg`, which pointed at third-party
   heraldry. They now call sigilSrc(id, dir), which prefers the owner's own
   drawing where one exists and falls back to the old file where it does not.
   The art lives in a `new/` folder inside each site's sigil directory, so the
   same relative path works from the root map, from hotd/ and from knight/.

   Regenerate with the swap script when new art is added. */
window.SIGIL_ART_IDS = [ "allyrion", "bar-emmon", "baratheon-and-lannister", "baratheon-fireheart", "blackfyre", "blackmont", "blacktyde", "blount", "boggs", "botley", "briar", "brook", "brownhill", "brune", "buckwell", "byrch", "bywater", "cargyll", "cave", "celtigar", "chelsted", "chyttering", "codd", "crabb", "cressey", "dalt", "dargood", "darke", "darklyn", "darkwood", "dayne", "drinkwater", "drumm", "dryland", "edgerton", "farring", "farwyn", "follard", "fowler", "gargalen", "gaunt", "goodbrother", "greyjoy", "greyjoy-of-orkmont", "hardy", "harlaw-of-the-grey-garden", "harlaw-of-the-harridan-hill", "harlaw-of-the-tower-glimmering", "harte", "hayford", "hoare", "hogg", "hollard", "holt", "hull", "humble", "ironmaker", "jordayne", "kenning", "ladybright", "lake", "langward", "mallery", "manning", "manwoody", "martell", "massey", "merlyn", "mollen", "moss", "myre", "orkwood", "overton", "poole", "pyle", "pyne", "qorgyle", "rambton", "redbeard", "rollingford", "rosby", "ryder-of-the-rills", "rykker", "ryswell", "saltcliffe", "santagar", "sharp", "shell", "shepherd", "slate", "slynt", "sparr", "stark", "staunton", "stokeworth", "stonehouse", "stonetree", "stout", "sunderly", "sunglass", "tallhart", "targaryen", "tawney", "thenn", "thorne", "toland", "towers", "uller", "umber", "vaith", "velaryon", "volmark", "wade", "waterman", "weaver", "wells", "whitehill", "woodfoot", "woolfield", "wyl", "wynch", "yronwood" ];

window.sigilSrc = function (id, dir) {
  dir = dir == null ? "assets/sigils/" : dir;
  return window.SIGIL_ART_IDS.indexOf(id) >= 0 ? dir + "new/" + id + ".webp" : dir + id + ".svg";
};
