var startTag = /^<([-A-Za-z0-9_]+)((?:\s+[a-zA-Z_:][-a-zA-Z0-9_:.]*(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/, endTag = /^<\/([-A-Za-z0-9_]+)[^>]*>/, attr = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))?/g;

var empty = makeMap("area,base,basefont,br,col,frame,hr,img,input,link,meta,param,embed,command,keygen,source,track,wbr");

var block = makeMap("a,address,code,article,applet,aside,audio,blockquote,button,canvas,center,dd,del,dir,div,dl,dt,fieldset,figcaption,figure,footer,form,frameset,h1,h2,h3,h4,h5,h6,header,hgroup,hr,iframe,ins,isindex,li,map,menu,noframes,noscript,object,ol,output,p,pre,section,script,table,tbody,td,tfoot,th,thead,tr,ul,video");

var inline = makeMap("abbr,acronym,applet,b,basefont,bdo,big,br,button,cite,del,dfn,em,font,i,iframe,img,input,ins,kbd,label,map,object,q,s,samp,script,select,small,span,strike,strong,sub,sup,textarea,tt,u,var");

var closeSelf = makeMap("colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr");

var fillAttrs = makeMap("checked,compact,declare,defer,disabled,ismap,multiple,nohref,noresize,noshade,nowrap,readonly,selected");

var special = makeMap("wxxxcode-style,script,style,view,scroll-view,block");

function HTMLParser(e, a) {
    var t, r, s, i = [], l = e;
    i.last = function() {
        return this[this.length - 1];
    };
    while (e) {
        r = true;
        if (!i.last() || !special[i.last()]) {
            if (e.indexOf("\x3c!--") == 0) {
                t = e.indexOf("--\x3e");
                if (t >= 0) {
                    if (a.comment) a.comment(e.substring(4, t));
                    e = e.substring(t + 3);
                    r = false;
                }
            } else if (e.indexOf("</") == 0) {
                s = e.match(endTag);
                if (s) {
                    e = e.substring(s[0].length);
                    s[0].replace(endTag, f);
                    r = false;
                }
            } else if (e.indexOf("<") == 0) {
                s = e.match(startTag);
                if (s) {
                    e = e.substring(s[0].length);
                    s[0].replace(startTag, o);
                    r = false;
                }
            }
            if (r) {
                t = e.indexOf("<");
                var n = "";
                while (t === 0) {
                    n += "<";
                    e = e.substring(1);
                    t = e.indexOf("<");
                }
                n += t < 0 ? e : e.substring(0, t);
                e = t < 0 ? "" : e.substring(t);
                if (a.chars) a.chars(n);
            }
        } else {
            e = e.replace(new RegExp("([\\s\\S]*?)</" + i.last() + "[^>]*>"), function(e, t) {
                t = t.replace(/<!--([\s\S]*?)-->|<!\[CDATA\[([\s\S]*?)]]>/g, "$1$2");
                if (a.chars) a.chars(t);
                return "";
            });
            f("", i.last());
        }
        if (e == l) throw "Parse Error: " + e;
        l = e;
    }
    f();
    function o(e, t, r, s) {
        t = t.toLowerCase();
        if (block[t]) {
            while (i.last() && inline[i.last()]) {
                f("", i.last());
            }
        }
        if (closeSelf[t] && i.last() == t) {
            f("", t);
        }
        s = empty[t] || !!s;
        if (!s) i.push(t);
        if (a.start) {
            var l = [];
            r.replace(attr, function(e, a) {
                var t = arguments[2] ? arguments[2] : arguments[3] ? arguments[3] : arguments[4] ? arguments[4] : fillAttrs[a] ? a : "";
                l.push({
                    name: a,
                    value: t,
                    escaped: t.replace(/(^|[^\\])"/g, '$1\\"')
                });
            });
            if (a.start) {
                a.start(t, l, s);
            }
        }
    }
    function f(e, t) {
        if (!t) var r = 0; else {
            t = t.toLowerCase();
            for (var r = i.length - 1; r >= 0; r--) {
                if (i[r] == t) break;
            }
        }
        if (r >= 0) {
            for (var s = i.length - 1; s >= r; s--) {
                if (a.end) a.end(i[s]);
            }
            i.length = r;
        }
    }
}

function makeMap(e) {
    var a = {}, t = e.split(",");
    for (var r = 0; r < t.length; r++) {
        a[t[r]] = true;
    }
    return a;
}

module.exports = HTMLParser;