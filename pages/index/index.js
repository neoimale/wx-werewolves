//index2.js
Page({
    data: {

    },
    tapCreate: (event) => {
        console.log('tap create');
    },
    tapJoin: (event) => {
        console.log('tap join');
        wx.navigateTo({
          url: '../join-room/join-room'
        })
    }
})