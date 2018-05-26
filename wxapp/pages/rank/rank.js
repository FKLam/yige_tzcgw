function _toConsumableArray(a) {
    if (Array.isArray(a)) {
        for (var t = 0, e = Array(a.length); t < a.length; t++) {
            e[t] = a[t];
        }
        return e;
    } else {
        return Array.from(a);
    }
}

var app = getApp();

Page({
    data: {
        nav_index: 0,
        page: 2,
        more: true
    },
    onLoad: function a(t) {
        var e = this;
        app.getGlobalInfo(function(a) {
            e.setData({
                info: a
            });
        });
        app.util.request({
            url: "entry/wxapp/rank",
            method: "POST",
            data: {
                m: "yige_tzcgw"
            },
            success: function a(t) {
                var n = t.data.data;
                e.setData({
                    rank_word: n.rank_word,
                    user: n.user
                });
            }
        });
        app.util.request({
            url: "entry/wxapp/rank1",
            method: "POST",
            data: {
                m: "yige_tzcgw"
            },
            success: function a(t) {
                var n = t.data.data;
                e.setData({
                    rank_friend: n.rank_friend,
                    user1: n.user
                });
            }
        });
    },
    loadMore: function a() {
        var t = this;
        if (!t.data.more) {
            return;
        }
        app.util.request({
            url: "entry/wxapp/rank",
            method: "POST",
            data: {
                page: t.data.page,
                m: "yige_tzcgw"
            },
            success: function a(e) {
                console.log(e.data.data);
                var n = e.data.data;
                if (n.rank_word.length == 0) {
                    wx.showToast({
                        title: "已经到底了~",
                        icon: "success",
                        duration: 2e3
                    });
                    t.setData({
                        more: false
                    });
                } else {
                    t.setData({
                        rank_word: [].concat(_toConsumableArray(t.data.rank_word), _toConsumableArray(n.rank_word)),
                        page: ++t.data.page
                    });
                }
            }
        });
    },
    changeNav: function a(t) {
        var e = t.currentTarget.dataset.index;
        this.setData({
            nav_index: e
        });
    },
    onReady: function a() {},
    onShow: function a() {},
    onHide: function a() {},
    onUnload: function a() {},
    onPullDownRefresh: function a() {},
    onReachBottom: function a() {},
    onShareAppMessage: function a() {
        var t = this;
        return wx.updateShareMenu({
            withShareTicket: !0,
            success: function a(t) {}
        }), {
            title: t.data.info.share_text ? t.data.info.share_text : t.data.info.name,
            path: "/pages/index/index?friendid=" + app.globalData.userid,
            success: function a(t) {
                console.log("/pages/index/index?friendid=" + app.globalData.userid);
            }
        };
    }
});