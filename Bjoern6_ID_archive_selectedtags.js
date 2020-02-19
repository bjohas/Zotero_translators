{
	"translatorID": "16c89e98-eb4c-4697-ab2e-f00b73a46b13",
	"label": "Bjoerns citation string + tags and archiveLocation (Bjoern6)",
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
	"lastUpdated": "2018-12-12 15:21:30"
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
    var beginning = "{|";
    var middle = "|||";
    var end = "}";
    var bracketsYear = true;
    if (bracketsYear) {
	beginning = "⟦";
	middle = "|";
	end = ")⟧ ";
    } else {
	beginning = "(⟦";
	middle = "|";
	end = "⟧) ";
    };
    var item;
    while (item = Zotero.nextItem()) {
	try {
	    var citation = "";
	    var mem = new Mem(item);
	    var memdate = new Mem(item);
	    // Zotero.write(beginning);
	    var library_id = item.libraryID ? item.libraryID : 0;
	    var tagstring = "";
	    var qstring = "";
	    var rstring = "";
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
		    if (str.substring(0, 3) == "-Q:") { 
			//qstring = "q"+str.substring(3, 4);
			qstring += str.substring(3, 4).toLowerCase();
		    };
		    if (str.substring(0, 5) == "-RRQ:") { 
			//rstring = "r"+str.substring(5, 6);
			rstring += str.substring(5, 6).toUpperCase();
		    };
		}; 
		if (j>0) { 
		    // There were C: tags 
		    tagstring += ": "; 
		};
	    }
	    if ('creators' in item && item.creators.length >0){
		mem.set(item.creators[0].lastName,",");
		if (item.creators.length > 2) mem.set("et al.", ",");
		else if (item.creators.length == 2) mem.set("& " + item.creators[1].lastName, ",");
	    } else {
		mem.set(false, ",","anon.");
	    }
	    if (Zotero.getHiddenPref("ODFScan.includeTitle") || item.creators.length === 0) {
		mem.set(item.title,",","(no title)");
	    }
	    mem.setlaw(item.authority, ",");
	    mem.setlaw(item.volume);
	    mem.setlaw(item.reporter);
	    mem.setlaw(item.pages);
	    memdate.setlaw(item.court,",");
	    var date = Zotero.Utilities.strToDate(item.date);
	    var dateS = (date.year) ? date.year : item.date;
	    memdate.set(dateS,"","no date");
	    // Zotero.write("" + mem.get() + " " + memdate.get() + middle);
	    if (Zotero.getHiddenPref("ODFScan.useZoteroSelect")) {
		// Zotero.write("zotero://select/items/" + library_id + "_" + item.key + end);
		citation += beginning;
		citation += "" + mem.get() + " " + memdate.get() + middle;
		citation += "zotero://select/items/" + library_id + "_" + item.key + end;
	    } else {
		var m = item.uri.match(/http:\/\/zotero\.org\/(users|groups)\/([^\/]+)\/items\/(.+)/);
		var prefix;
		var lib;
		var key;
		if (m) {
		    if (m[1] === "users") {
			prefix = "zu:";
			if (m[2] === "local") {
			    lib = "0";
			} else {
			    lib = m[2];
			}
		    } else {
			prefix = "zg:";
			lib = m[2];
		    }
		} else {
		    prefix = "zu:";
		    lib = "0";
		}
		// Zotero.write(prefix + lib + ":" + item.key + end);
		var itemidentifier = prefix + lib + ":" + item.key;
		citation += beginning + itemidentifier + middle;
		citation += rstring+"."+qstring+"/"+tagstring;
		citation += "" + mem.get() + " " + memdate.get();
		citation += end;
		if ('archiveLocation' in item) {
		    if (item.archiveLocation) {
			citation += "\t" + item.archiveLocation ;
		    } else {
			citation += "\t";
		    };
		} else {
		    citation += "\t";
		}
		citation += "\t";
		if ('extra' in item) {
		    if (item.extra) {
			citation += item.extra ;
		    } else {
		    };
		} else {
		}
		citation += "\n";
	    }
	    Zotero.write(citation);
	} catch (e) {
	    // Zotero.write("ERROR "+e.message);
	}
    }
}
