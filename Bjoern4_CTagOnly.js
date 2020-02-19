{
    "translatorID": "8ec3050a-2dc1-4308-9763-c996818fb100",
	"label": "Bjoerns Citation String - Country tags only (Bjoern4)",
	"creator": "Bjoern Hassler — original creators Scott Campbell, Avram Lyon, Nathan Schneider, Sebastian Karcher, Frank Bennett",
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
	"lastUpdated": "2018-12-30 19:31:30"
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
    var beginning = "{| ";
    var middle = "|||";
    var end = "}";
    beginning = "❲";
    middle = "|";
    end = "❳";
    beginning = "❲";
    middle = "|(";
    end = ")❳";
    var keyAtFront = true;
    if (keyAtFront) {
	beginning = "⟦";
	middle = "|(";
	end = ")⟧";
    } else {
	beginning = "⟦(";
	middle = ")|";
	end = "⟧";
    };
    var item;
    while (item = Zotero.nextItem()) {
	var xbeginning = beginning;
	var xmiddle = middle;
	var xend = end;
	var citation = "";
        var mem = new Mem(item);
        var memdate = new Mem(item);
        // Zotero.write(beginning);
        var library_id = item.libraryID ? item.libraryID : 0;
	var tagstring = "";
        if (item.tags.length >0){
	    // There are tags.
	    // tagstring += JSON.stringify(item.tags);
	    var j=0;
	    for (var i=0; i<item.tags.length; i++) {
		var str = item.tags[i].tag;
		if (str.substring(0, 2) == "C:") {
		    if (j>0) {
			tagstring += ", ";
		    };
		    tagstring += str.substring(2);
		    j++;
		};
	    };
	} else {
	    tagstring = "NONE";
	};
	Zotero.write(tagstring);
    }
}
