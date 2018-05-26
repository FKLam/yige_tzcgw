var __placeImgeUrlHttps = "https";

var __emojisReg = "";

var __emojisBaseSrc = "";

var __emojis = {};

var wxDiscode = require("./wxDiscode.js");

var HTMLParser = require("./htmlparser.js");

var empty = makeMap("area,base,basefont,br,col,frame,hr,img,input,link,meta,param,embed,command,keygen,source,track,wbr");

var block = makeMap("br,a,code,address,article,applet,aside,audio,blockquote,button,canvas,center,dd,del,dir,div,dl,dt,fieldset,figcaption,figure,footer,form,frameset,h1,h2,h3,h4,h5,h6,header,hgroup,hr,iframe,ins,isindex,li,map,menu,noframes,noscript,object,ol,output,p,pre,section,script,table,tbody,td,tfoot,th,thead,tr,ul,video");

var inline = makeMap("abbr,acronym,applet,b,basefont,bdo,big,button,cite,del,dfn,em,font,i,iframe,img,input,ins,kbd,label,map,object,q,s,samp,script,select,small,span,strike,strong,sub,sup,textarea,tt,u,var");

var closeSelf = makeMap("colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr");

var fillAttrs = makeMap("checked,compact,declare,defer,disabled,ismap,multiple,nohref,noresize,noshade,nowrap,readonly,selected");

var special = makeMap("wxxxcode-style,script,style,view,scroll-view,block");

function makeMap(e) {
    var t = {}, r = e.split(",");
    for (var a = 0; a < r.length; a++) {
        t[r[a]] = true;
    }
    return t;
}

function q(e) {
    return '"' + e + '"';
}

function removeDOCTYPE(e) {
    return e.replace(/<\?xml.*\?>\n/, "").replace(/<.*!doctype.*\>\n/, "").replace(/<.*!DOCTYPE.*\>\n/, "");
}

function trimHtml(e) {
    return e.replace(/\r?\n+/g, "").replace(/<!--.*?-->/gi, "").replace(/\/\*.*?\*\//gi, "").replace(/[ ]+</gi, "<");
}

function html2json(e, t) {
    e = removeDOCTYPE(e);
    e = trimHtml(e);
    e = wxDiscode.strDiscode(e);
    var r = [];
    var a = {
        node: t,
        nodes: [],
        images: [],
        imageUrls: []
    };
    var s = 0;
    HTMLParser(e, {
        start: function e(i, n, o) {
            var l = {
                node: "element",
                tag: i
            };
            if (r.length === 0) {
                l.index = s.toString();
                s += 1;
            } else {
                var d = r[0];
                if (d.nodes === undefined) {
                    d.nodes = [];
                }
                l.index = d.index + "." + d.nodes.length;
            }
            if (block[i]) {
                l.tagType = "block";
            } else if (inline[i]) {
                l.tagType = "inline";
            } else if (closeSelf[i]) {
                l.tagType = "closeSelf";
            }
            if (n.length !== 0) {
                l.attr = n.reduce(function(e, t) {
                    var r = t.name;
                    var a = t.value;
                    if (r == "class") {
                        console.dir(a);
                        l.classStr = a;
                    }
                    if (r == "style") {
                        console.dir(a);
                        l.styleStr = a;
                    }
                    if (a.match(/ /)) {
                        a = a.split(" ");
                    }
                    if (e[r]) {
                        if (Array.isArray(e[r])) {
                            e[r].push(a);
                        } else {
                            e[r] = [ e[r], a ];
                        }
                    } else {
                        e[r] = a;
                    }
                    return e;
                }, {});
            }
            if (l.tag === "img") {
                l.imgIndex = a.images.length;
                var c = l.attr.src;
                if (c[0] == "") {
                    c.splice(0, 1);
                }
                c = wxDiscode.urlToHttpUrl(c, __placeImgeUrlHttps);
                l.attr.src = c;
                l.from = t;
                a.images.push(l);
                a.imageUrls.push(c);
            }
            if (l.tag === "font") {
                var m = [ "x-small", "small", "medium", "large", "x-large", "xx-large", "-webkit-xxx-large" ];
                var f = {
                    color: "color",
                    face: "font-family",
                    size: "font-size"
                };
                if (!l.attr.style) l.attr.style = [];
                if (!l.styleStr) l.styleStr = "";
                for (var p in f) {
                    if (l.attr[p]) {
                        var u = p === "size" ? m[l.attr[p] - 1] : l.attr[p];
                        l.attr.style.push(f[p]);
                        l.attr.style.push(u);
                        l.styleStr += f[p] + ": " + u + ";";
                    }
                }
            }
            if (l.tag === "source") {
                a.source = l.attr.src;
            }
            if (o) {
                var d = r[0] || a;
                if (d.nodes === undefined) {
                    d.nodes = [];
                }
                d.nodes.push(l);
            } else {
                r.unshift(l);
            }
        },
        end: function e(t) {
            var s = r.shift();
            if (s.tag !== t) console.error("invalid state: mismatch end tag");
            if (s.tag === "video" && a.source) {
                s.attr.src = a.source;
                delete a.source;
            }
            if (r.length === 0) {
                a.nodes.push(s);
            } else {
                var i = r[0];
                if (i.nodes === undefined) {
                    i.nodes = [];
                }
                i.nodes.push(s);
            }
        },
        chars: function e(t) {
            var i = {
                node: "text",
                text: t,
                textArray: transEmojiStr(t)
            };
            if (r.length === 0) {
                i.index = s.toString();
                s += 1;
                a.nodes.push(i);
            } else {
                var n = r[0];
                if (n.nodes === undefined) {
                    n.nodes = [];
                }
                i.index = n.index + "." + n.nodes.length;
                n.nodes.push(i);
            }
        },
        comment: function e(t) {}
    });
    return a;
}

function transEmojiStr(e) {
    var t = [];
    if (__emojisReg.length == 0 || !__emojis) {
        var r = {};
        r.node = "text";
        r.text = e;
        s = [ r ];
        return s;
    }
    e = e.replace(/\[([^\[\]]+)\]/g, ":$1:");
    var a = new RegExp("[:]");
    var s = e.split(a);
    for (var i = 0; i < s.length; i++) {
        var n = s[i];
        var r = {};
        if (__emojis[n]) {
            r.node = "element";
            r.tag = "emoji";
            r.text = __emojis[n];
            r.baseSrc = __emojisBaseSrc;
        } else {
            r.node = "text";
            r.text = n;
        }
        t.push(r);
    }
    return t;
}

function emojisInit() {
    var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
    var t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "/wxParse/emojis/";
    var r = arguments[2];
    __emojisReg = e;
    __emojisBaseSrc = t;
    __emojis = r;
}

module.exports = {
    html2json: html2json,
    emojisInit: emojisInit
};