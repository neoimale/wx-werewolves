//index2.js
Page({
    data: {

    },
    onLoad: (options) => {
        // wx.connectSocket({
        //   url: "wss://api.byutech.cn/ws/sessionid"
        // })
        // wx.onSocketOpen(function() {
        //   wx.sendSocketMessage({
        //     data: 'I got U'
        //   })
        // })
    },
    tapCreate: (event) => {
        wx.navigateTo({
          url: '../create-room/create-room',
          success: function(res){
            // success
          },
          fail: function() {
            // fail
          },
          complete: function() {
            // complete
          }
        })
    },
    tapJoin: (event) => {
        wx.navigateTo({
          url: '../join-room/join-room'
        })
    }
})