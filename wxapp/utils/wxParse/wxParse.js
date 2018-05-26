var _showdown = require("./showdown.js");

var _showdown2 = _interopRequireDefault(_showdown);

var _html2json = require("./html2json.js");

var _html2json2 = _interopRequireDefault(_html2json);

function _interopRequireDefault(e) {
    return e && e.__esModule ? e : {
        default: e
    };
}

function _defineProperty(e, a, r) {
    if (a in e) {
        Object.defineProperty(e, a, {
            value: r,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        e[a] = r;
    }
    return e;
}

var realWindowWidth = 0;

var realWindowHeight = 0;

wx.getSystemInfo({
    success: function e(a) {
        realWindowWidth = a.windowWidth;
        realWindowHeight = a.windowHeight;
    }
});

function wxParse() {
    var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "wxParseData";
    var a = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "html";
    var r = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '<div class="color:red;">数据不能为空</div>';
    var t = arguments[3];
    var i = arguments[4];
    var n = t;
    var o = {};
    if (a == "html") {
        o = _html2json2.default.html2json(r, e);
        console.log(JSON.stringify(o, " ", " "));
    } else if (a == "md" || a == "markdown") {
        var d = new _showdown2.default.Converter();
        var s = d.makeHtml(r);
        o = _html2json2.default.html2json(s, e);
        console.log(JSON.stringify(o, " ", " "));
    }
    o.view = {};
    o.view.imagePadding = 0;
    if (typeof i != "undefined") {
        o.view.imagePadding = i;
    }
    var l = {};
    l[e] = o;
    n.setData(l);
    n.wxParseImgLoad = wxParseImgLoad;
    n.wxParseImgTap = wxParseImgTap;
}

function wxParseImgTap(e) {
    var a = this;
    var r = e.target.dataset.src;
    var t = e.target.dataset.from;
    if (typeof t != "undefined" && t.length > 0) {
        wx.previewImage({
            current: r,
            urls: a.data[t].imageUrls
        });
    }
}

function wxParseImgLoad(e) {
    var a = this;
    var r = e.target.dataset.from;
    var t = e.target.dataset.idx;
    if (typeof r != "undefined" && r.length > 0) {
        calMoreImageInfo(e, t, a, r);
    }
}

function calMoreImageInfo(e, a, r, t) {
    var i;
    var n = r.data[t];
    if (!n || n.images.length == 0) {
        return;
    }
    var o = n.images;
    var d = wxAutoImageCal(e.detail.width, e.detail.height, r, t);
    var s = o[a].index;
    var l = "" + t;
    var u = true;
    var f = false;
    var v = undefined;
    try {
        for (var g = s.split(".")[Symbol.iterator](), m; !(u = (m = g.next()).done); u = true) {
            var h = m.value;
            l += ".nodes[" + h + "]";
        }
    } catch (e) {
        f = true;
        v = e;
    } finally {
        try {
            if (!u && g.return) {
                g.return();
            }
        } finally {
            if (f) {
                throw v;
            }
        }
    }
    var w = l + ".width";
    var c = l + ".height";
    r.setData((i = {}, _defineProperty(i, w, d.imageWidth), _defineProperty(i, c, d.imageheight), 
    i));
}

function wxAutoImageCal(e, a, r, t) {
    var i = 0, n = 0;
    var o = 0, d = 0;
    var s = {};
    var l = r.data[t].view.imagePadding;
    i = realWindowWidth - 2 * l;
    n = realWindowHeight;
    if (e > i) {
        o = i;
        d = o * a / e;
        s.imageWidth = o;
        s.imageheight = d;
    } else {
        s.imageWidth = e;
        s.imageheight = a;
    }
    return s;
}

function wxParseTemArray(e, a, r, t) {
    var i = [];
    var n = t.data;
    var o = null;
    for (var d = 0; d < r; d++) {
        var s = n[a + d].nodes;
        i.push(s);
    }
    e = e || "wxParseTemArray";
    o = JSON.parse('{"' + e + '":""}');
    o[e] = i;
    t.setData(o);
}

function emojisInit() {
    var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
    var a = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "/wxParse/emojis/";
    var r = arguments[2];
    _html2json2.default.emojisInit(e, a, r);
}

module.exports = {
    wxParse: wxParse,
    wxParseTemArray: wxParseTemArray,
    emojisInit: emojisInit
};