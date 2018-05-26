var app = getApp();

Page({
    data: {
        bg: ""
    },
    onLoad: function a(e) {
        var t = this;
        app.getGlobalInfo(function(a) {
            wx.setNavigationBarTitle({
                title: a.name
            });
            var i = a.bg ? a.bg : "../../image/bg.jpg";
            t.setData({
                info: a,
                bg: i
            });
            if (a.zfb_kl != "") {
                wx.setClipboardData({
                    data: a.zfb_kl,
                    success: function a(e) {
                        console.log("剪切板完毕");
                    }
                });
            }
            app.getUserInfo(function(a) {
                var t = e.friendid;
                if (t) {
                    app.util.request({
                        url: "entry/wxapp/friend",
                        method: "POST",
                        data: {
                            m: "yige_tzcgw",
                            from: app.globalData.userid,
                            to: t
                        },
                        success: function a(e) {
                            console.log(e);
                        }
                    });
                }
            });
        });
    },
    onShareAppMessage: function a(e) {
        var t = this;
        return {
            title: t.data.info.share_text ? t.data.info.share_text : t.data.info.name,
            path: "/pages/index/index?friendid=" + app.globalData.userid,
            success: function a(e) {
                console.log("/pages/index/index?friendid=" + app.globalData.userid);
            }
        };
    }
});