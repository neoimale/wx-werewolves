//index2.js
Page({
    data: {

    },
    tapCreate: (event) => {
        wx.navigateTo({
          url: '../create-room/create-room'
        })
    },
    tapJoin: (event) => {
        wx.navigateTo({
          url: '../join-room/join-room'
        })
    },
    onShareAppMessage: () => {
        return {
            title: '天天狼人杀',
            desc: '一起来微信狼人杀吧',
            path: '/pages/index/index'
        }
    }
})