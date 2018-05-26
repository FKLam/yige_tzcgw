var app = getApp();

Page({
    data: {},
    onLoad: function a(n) {
        var t = this;
        app.getGlobalInfo(function(a) {
            t.setData({
                info: a
            });
            app.util.request({
                url: "entry/wxapp/wxapp",
                method: "POST",
                data: {
                    m: "yige_tzcgw"
                },
                success: function a(n) {
                    var e = n.data.data;
                    t.setData({
                        wxapp: e.wxapp,
                        swiper: e.swiper
                    });
                }
            });
        });
    },
    onReady: function a() {},
    onShow: function a() {},
    onHide: function a() {},
    onUnload: function a() {},
    onPullDownRefresh: function a() {},
    onReachBottom: function a() {},
    onShareAppMessage: function a() {},
    wxapp_click: function a(n) {
        var t = this;
        var e = n.currentTarget.dataset.index;
        var i = t.data.wxapp[e].appid;
        wx.navigateToMiniProgram({
            appId: i
        });
    },
    swiper_click: function a(n) {
        var t = this;
        var e = n.currentTarget.dataset.index;
        var i = t.data.swiper[e].appid;
        var o = t.data.swiper[e].url;
        if (t.data.swiper[e].appid != "") {
            wx.navigateToMiniProgram({
                appId: i
            });
        } else {
            wx.navigateTo({
                url: "../web/web?url=" + o
            });
        }
    },
    callmobile: function a(n) {
        var t = this;
        var e = t.data.info.phone;
        console.log(e);
        wx.makePhoneCall({
            phoneNumber: e
        });
    }
});