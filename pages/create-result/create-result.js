// pages/create-result/create-result.js
var request = require('../../utils/request').request;
var QR = require('../../utils/qrcode');

Page({
  data:{
    roomNumber: 1,
    showPopup: false
  },

  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      roomNumber: options.room     
    })
    this.drawQRCode('wolf://join-room/join-room?room=' + this.data.roomNumber);
  },
  clickShareAction: function() {
    this.showPopup();
    // setTimeout(() => {
    //   this.drawQRCode('../join-room/join-room?room=' + this.data.roomNumber);
    // }, 1000);
  },
  clickGodViewAction: function(e) {
    this.goToGodView(this.data.roomNumber);  
  },
  clickQRCode: function(e) {

  },
  goToGodView: function(roomNum) {
      request({
          url: '/room/join/' + roomNum,
          data: {god: 1},
          method: 'POST',
          success: function(rlt) {
              if(rlt.data.god) {
                wx.navigateTo({
                    url: '../god-view/god-view?room=' + roomNum + '&type=' + rlt.data.roomInfo.type,
                })
              }
          }
      })
  },
  drawQRCode: function(url) {
    console.log('drawQRCode');
    try {
      var res = wx.getSystemInfoSync();
      var scale = 750 / 500;
      var width = res.windowWidth / scale;
      var height = width;
      QR.qrApi.draw(url, 'qrCanvas', width, height);
    } catch (e) {
      console.log(e);
    }
  },
  showPopup: function() {
    this.setData({
      showPopup: true
    })
  },

  dismissPopup: function() {
    this.setData({
      showPopup: false
    })
  },
  onShareAppMessage: function() {
    return {
        title: '房间号 - ' + this.data.roomNumber,
        desc: '一起来微信狼人杀吧',
        path: '/pages/join-room/join-room?room=' + this.data.roomNumber
    }
  }
})