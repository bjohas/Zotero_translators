{
    "translatorID": "1bcb866f-c3f4-4da5-bb79-6f37fd41d402",
    "label": "Bjoerns stringify (Bjoern_stringify.js)",
    "creator": "Bjoern Hassler",
    "target": "html",
    "minVersion": "3.0",
    "maxVersion": "",
    "priority": 100,
    "displayOptions": {
	"exportCharset": "UTF-8"
    },
    "inRepository": true,
    "translatorType": 2,
    "browserSupport": "",
    "lastUpdated": "2019-02-02 12:03:33"
}

// legal types are weird
var LEGAL_TYPES = ["bill","case","gazette","hearing","patent","regulation","statute","treaty"];
var Mem = function (item) {
    var lst = [];
    var isLegal = isLegal = (LEGAL_TYPES.indexOf(item.itemType)>-1);
    this.set = function (str, punc, slug) { if (!punc) {punc=""}; if (str) {lst.push((str + punc))} else if (!isLegal) {lst.push(slug)}};
    this.setlaw = function (str, punc) { if (!punc) {punc=""}; if (str && isLegal) {lst.push(str + punc)}};
    this.get = function () { return lst.join(" ") };
}

function doExport() {
    var item;
    while (item = Zotero.nextItem()) {
	var myJSON = JSON.stringify(item);
	Zotero.write(myJSON+"\n\n");
    }
}
