//index2.js
Page({
    data: {

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
        console.log('tap join');
        wx.navigateTo({
          url: '../join-room/join-room'
        })
    }
})