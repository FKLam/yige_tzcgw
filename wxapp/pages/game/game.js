var a = getApp();

var app = getApp();

function getNowFormatDate() {
    var t = new Date();
    var a = "-";
    var e = t.getFullYear();
    var i = t.getMonth() + 1;
    var s = t.getDate();
    if (i >= 1 && i <= 9) {
        i = "0" + i;
    }
    if (s >= 0 && s <= 9) {
        s = "0" + s;
    }
    var n = e + a + i + a + s;
    return n;
}

Page({
    data: {
        myScore: 0,
        curIndex: -1,
        curFail: !0,
        curPlay: !1,
        curMusic: 0,
        answerTrue: [],
        answerMine: [],
        problemText: "",
        listMusic: [],
        listOne: [],
        listTwo: [],
        help_list: [],
        bg: "",
        cd: ""
    },
    onLoad: function t(a) {
        var e = this;
        var i = a.member_id;
        this.data.member_id = i;
        var s = a.autoplay || "";
        this.data.autoplay = s;
        app.getGlobalInfo(function(t) {
            wx.setNavigationBarTitle({
                title: t.name
            });
            var a = t.bg1 ? t.bg1 : "../../image/bg2.jpg";
            var i = t.cd ? t.cd : "../../image/icon_4.png";
            e.setData({
                info: t,
                bg1: a,
                cd: i
            });
            e.loadIndex();
        });
    },
    tip: function t() {
        var a = this;
        if (a.data.info.review_version == 4) {
            return;
        }
        var e = a.data.info.is_pay;
        if (e == 1) {
            wx.showModal({
                title: "获取音符",
                content: "音符可以通过分享到微信群获得，或者直接购买。是否需要购买300音符？",
                cancelText: "我再看看",
                confirmText: "我要购买",
                success: function t(e) {
                    if (e.confirm) {
                        console.log("用户点击确定");
                        var i = wx.getStorageSync("userInfo");
                        app.util.request({
                            url: "entry/wxapp/buy",
                            method: "POST",
                            data: {
                                m: "yige_tzcgw",
                                name: i.wxInfo.nickName,
                                avatar: i.wxInfo.avatarUrl
                            },
                            success: function t(e) {
                                console.log(e);
                                wx.requestPayment({
                                    timeStamp: e.data.data.timeStamp,
                                    nonceStr: e.data.data.nonceStr,
                                    package: e.data.data.package,
                                    signType: "MD5",
                                    paySign: e.data.data.paySign,
                                    success: function t(e) {
                                        console.log(e);
                                        app.util.request({
                                            url: "entry/wxapp/credit",
                                            method: "POST",
                                            data: {
                                                m: "yige_tzcgw",
                                                type: "add",
                                                value: 300
                                            },
                                            success: function t(e) {
                                                a.setData({
                                                    myScore: e.data.data.credit
                                                });
                                            }
                                        });
                                        wx.showModal({
                                            title: "购买成功",
                                            content: "支付成功，音符已经到账",
                                            showCancel: false
                                        });
                                    },
                                    fail: function t(a) {
                                        console.log(a);
                                        if (a.errMsg == "requestPayment:fail cancel") {
                                            a.errMsg = "用户取消支付";
                                        }
                                        wx.showModal({
                                            title: "购买音符失败",
                                            content: "购买音符失败，原因：" + a.errMsg,
                                            showCancel: false
                                        });
                                    }
                                });
                            }
                        });
                    } else if (e.cancel) {
                        console.log("用户点击取消");
                        wx.showShareMenu({
                            withShareTicket: true
                        });
                    }
                }
            });
        } else {
            wx.showModal({
                title: "提示",
                content: "分享到不同的微信群可以获取30音符",
                showCancel: false
            });
        }
    },
    myRotate: function t(a, e) {
        return Math.floor(Math.random() * (a - e) + e);
    },
    bindHelpTwo: function t() {
        this.setData({
            firendHelp: !this.data.firendHelp
        });
    },
    bindStart: function t() {
        var a = this, e = a.data.curPlay, i = a.data.curMusic, s = a.data.listMusic, n = wx.getBackgroundAudioManager();
        0 == e ? (e = !0, n.src = s[i].musicOne, n.title = this.data.info.name, n.epname = this.data.info.name, 
        n.singer = "歌王", n.coverImgUrl = "http://bnthb.oss-cn-beijing.aliyuncs.com/64/tiaozhancaigewang.jpg", 
        n.play(), a.setData({
            curPlay: e
        }), this.data.time = setTimeout(function() {
            n.stop(), e = !1, a.setData({
                curPlay: e
            }), console.log(10);
        }, 1e4)) : (e = !1, n.stop(), clearTimeout(this.data.time), a.setData({
            curPlay: e
        }));
    },
    bindSelectOne: function t(a) {
        var e = a.currentTarget.dataset.index, i = this.data.listOne, s = this.data.listTwo, n = this.data.answerMine, o = this.data.curFail, r = i[e].state;
        r > -1 && (i[e].text = "", s[r].state = !1, n[e] = "", o = !0, console.log(n)), 
        this.setData({
            listOne: i,
            listTwo: s,
            answerMine: n,
            curFail: o
        });
    },
    bindSelectTwo: function t(a) {
        for (var e = a.currentTarget.dataset.index, i = this.data.listOne, s = this.data.listTwo, n = this.data.curIndex, o = this.data.answerTrue, r = this.data.answerMine, c = (this.data.myScore, 
        this.data.curFail), d = 0; d < i.length; d++) {
            if ("" == i[d].text) {
                n = d - 1;
                break;
            }
        }
        n < i.length - 1 && 0 == s[e].state && ("" != r[++n] && void 0 !== r[n] || (i[n].text = s[e].text, 
        i[n].state = e, s[e].state = !0)), n < o.length && ("" == r[n] || void 0 === r[n]) && (r[n] = s[e].text), 
        r.join("").length == o.length && (r.toString() == o.toString() ? (this.musicPlay(), 
        this.addRecord()) : (c = !1, wx.showToast({
            title: "答错了",
            mask: !0,
            duration: 500,
            image: "../../image/icon_15.png"
        }), this.setData({
            curFail: c
        }))), this.setData({
            listOne: i,
            listTwo: s,
            curIndex: n,
            answerMine: r
        });
    },
    bindTip: function t() {
        this.setData({
            answerTip: !this.data.answerTip
        });
    },
    bindTipTrue: function t() {
        var a = this;
        var e = this.data.listOne, i = this.data.listTwo, s = this.data.curIndex, n = this.data.answerTrue, o = this.data.answerMine, r = this.data.myScore, c = this.data.curFail, d = 30, l = [];
        if (o.join("").length != n.length) if (r < d) wx.showToast({
            title: "音符不足",
            mask: !0,
            duration: 500,
            image: "../../image/icon_15.png"
        }); else {
            for (var u = 0; u < e.length; u++) {
                "" == e[u].text && l.push(u);
            }
            if (0 != l.length) {
                var h = this;
                this.setData({
                    answerTip: !h.data.answerTip
                });
                app.util.request({
                    url: "entry/wxapp/credit",
                    method: "POST",
                    data: {
                        m: "yige_tzcgw",
                        type: "sub",
                        value: 30
                    },
                    success: function t(a) {
                        s = l[Math.round(Math.random() * (l.length - 1))], o[s] = n[s], e[s].text = n[s];
                        for (var d = 0; d < i.length; d++) {
                            if (i[d].text == n[s]) {
                                i[d].state = !0, e[s].state = d;
                                break;
                            }
                        }
                        r = a.data.data.credit;
                        h.setData({
                            listOne: e,
                            listTwo: i,
                            curIndex: s,
                            answerMine: o,
                            myScore: r
                        }, function() {
                            o.join("").length == n.length && (o.toString() == n.toString() ? (h.musicPlay(), 
                            h.addRecord()) : (c = !1, wx.showToast({
                                title: "答错了",
                                mask: !0,
                                duration: 500,
                                image: "../../image/icon_15.png"
                            }), h.setData({
                                curFail: c
                            })));
                        });
                    }
                });
            }
        }
    },
    bindRefresh: function t() {
        for (var a = this.data.listOne, e = this.data.listTwo, i = (this.data.curIndex, 
        this.data.answerMine), s = (this.data.curFail, 0); s < a.length; s++) {
            a[s].text = "", e[s].state = !1;
        }
        for (s = 0; s < e.length; s++) {
            e[s].state = !1;
        }
        for (s = 0; s < i.length; s++) {
            i[s] = "";
        }
        this.setData({
            listOne: a,
            listTwo: e,
            curIndex: -1,
            answerMine: i,
            curFail: !0
        });
    },
    bindAnswerSuccess: function t() {
        this.musicStop();
        wx.redirectTo({
            url: "../game/game?autoplay=1"
        });
    },
    loadIndex: function t() {
        this.loadQuestion(), this.loadInformation();
    },
    loadQuestion: function t() {
        var a = this;
        app.util.request({
            url: "entry/wxapp/subject",
            method: "POST",
            data: {
                m: "yige_tzcgw"
            },
            success: function t(e) {
                var i = e.data;
                for (var s = [], n = 0; n < i.data.list.right_answer_arr.length; n++) {
                    s.push({
                        text: "",
                        state: -1
                    });
                }
                var o = a.data.info.imgHost ? a.data.info.imgHost : "http://bnthb.oss-cn-beijing.aliyuncs.com/";
                a.setData({
                    list: i.data.list,
                    listTwo: i.data.list.answer,
                    answerTrue: i.data.list.right_answer_arr,
                    listMusic: [ {
                        musicOne: o + i.data.list.song_prelude,
                        musicTwo: o + i.data.list.song_climax
                    } ],
                    listOne: s
                }), 1 == a.data.autoplay && a.bindStart();
            }
        });
    },
    loadInformation: function t() {
        var a = this;
        app.util.request({
            url: "entry/wxapp/credit",
            method: "POST",
            data: {
                m: "yige_tzcgw"
            },
            success: function t(e) {
                a.setData({
                    myScore: e.data.data.credit,
                    pass_num: e.data.data.pass
                });
            }
        });
    },
    check_time: function t(a) {
        return !(new Date().getTime() - a > 6e5);
    },
    addRecord: function t() {
        var a = this;
        app.util.request({
            url: "entry/wxapp/pass",
            method: "POST",
            data: {
                m: "yige_tzcgw"
            },
            success: function t(e) {
                a.setData({
                    myScore: e.data.data,
                    answerSuccess: !a.data.answerSuccess
                });
            }
        });
    },
    onShareAppMessage: function t(a) {
        var e = this;
        var i = "";
        if (e.data.pass_num < 10) {
            i = "入门歌手";
        } else if (e.data.pass_num < 100) {
            i = "超级明星";
        } else {
            i = "灵魂歌者";
        }
        return {
            title: "我在" + e.data.info.name + "猜对了" + e.data.pass_num + "首歌，达成成就 " + i + "，邀你一起来猜",
            path: "/pages/index/index?friendid=" + app.globalData.userid,
            success: function t(a) {
                console.log("/pages/index/index?friendid=" + app.globalData.userid);
                var i = getNowFormatDate();
                var s = wx.getStorageSync(i);
                console.log(s);
                if (e.data.info.share_credit > 0 && s.length > e.data.info.share_credit - 1) {
                    wx.showModal({
                        title: "提示",
                        content: "分享成功，今日分享获取音符次数已经达到上限！",
                        showCancel: !1,
                        confirmColor: "#b06402",
                        mask: !0
                    });
                    return;
                }
                app.util.request({
                    url: "entry/wxapp/credit",
                    method: "POST",
                    data: {
                        m: "yige_tzcgw",
                        type: "add",
                        value: 30
                    },
                    success: function t(a) {
                        console.log(s);
                        wx.setStorageSync(i, s + 1);
                        wx.showModal({
                            title: "提示",
                            content: "分享成功，获得30音符！",
                            showCancel: !1,
                            confirmColor: "#b06402",
                            mask: !0
                        });
                        e.setData({
                            myScore: a.data.data.credit
                        });
                    }
                });
            }
        };
    },
    addFriendRelation: function t() {
        var e = this.data.member_id || "", i = a.globalData.member_id;
        e.length > 0 && i.length > 0 && wx.request({
            url: a.globalData.hosts + "/MemberRelation/add",
            header: {
                Cookie: "PHPSESSID=" + a.globalData.sessionId
            },
            data: {
                friend_id: e,
                me_id: i
            },
            success: function t(a) {
                a.data.code;
            }
        });
    },
    musicPlay: function t() {
        var a = this.data.curPlay, e = this.data.curMusic, i = this.data.listMusic, s = wx.getBackgroundAudioManager();
        s.src = i[e].musicTwo, s.title = this.data.info.name, s.epname = this.data.info.name, 
        s.singer = "歌王", s.coverImgUrl = "https://console-api.oss-cn-shenzhen.aliyuncs.com/Img/tiaozhancaigewang.jpg", 
        s.play(), a = !0, this.setData({
            curPlay: a
        }), e++, clearTimeout(this.data.time);
        var n = this;
        this.data.time2 = setTimeout(function() {
            s.stop(), a = !1, n.setData({
                curPlay: a
            });
        }, 14e3);
    },
    musicStop: function t() {
        this.data.curPlay;
        var a = wx.getBackgroundAudioManager();
        a.title = this.data.info.name, a.epname = this.data.info.name, a.singer = "歌王", 
        a.coverImgUrl = "https://console-api.oss-cn-shenzhen.aliyuncs.com/Img/tiaozhancaigewang.jpg", 
        a.stop(), clearTimeout(this.data.time2), this.setData({
            answerSuccess: !this.data.answerSuccess,
            curPlay: !1
        });
    },
    goMore: function t() {
        wx.redirectTo({
            url: "../more/more"
        });
    }
});