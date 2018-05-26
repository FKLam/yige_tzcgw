App({
    onLaunch: function a() {},
    util: require("we7/resource/js/util.js"),
    globalData: {
        userInfo: null,
        openid: 0,
        userid: 0
    },
    getUserInfo: function a(o) {
        var l = this;
        if (l.globalData.userInfo) {
            o(l.globalData.userInfo);
        } else {
            this.util.getUserInfo(function(a) {
                console.log("请求了登录接口");
                l.globalData.userInfo = a.wxInfo;
                l.util.request({
                    url: "entry/wxapp/user",
                    method: "POST",
                    data: {
                        m: "yige_tzcgw",
                        nickName: l.globalData.userInfo.nickName,
                        gender: l.globalData.userInfo.gender,
                        language: l.globalData.userInfo.language,
                        city: l.globalData.userInfo.city,
                        province: l.globalData.userInfo.province,
                        country: l.globalData.userInfo.country,
                        avatarUrl: l.globalData.userInfo.avatarUrl
                    },
                    success: function a(e) {
                        var t = e.data.data;
                        l.globalData.userid = t.id;
                        console.log(l.globalData);
                        o(l.globalData.userInfo);
                    }
                });
            });
        }
    },
    getGlobalInfo: function a(o) {
        var l = this;
        if (l.globalData.info) {
            o(l.globalData.info);
        } else {
            l.util.request({
                url: "entry/wxapp/global",
                method: "POST",
                data: {
                    m: "yige_tzcgw"
                },
                success: function a(e) {
                    var t = e.data.data;
                    l.globalData.info = t.info;
                    console.log(l.globalData);
                    o(t.info);
                }
            });
        }
    },
    siteInfo: require("siteinfo.js")
});