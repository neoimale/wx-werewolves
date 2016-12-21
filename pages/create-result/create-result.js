// pages/create-result/create-result.js
var request = require('../../utils/request').request;

Page({
  data:{
    roomNumber: 1,
  },

  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      roomNumber: options.room,      
    })
  },

  clickGodViewAction: function(e) {
    this.goToGodView(this.data.roomNumber);  
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
  }
})