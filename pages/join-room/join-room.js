// pages/join-room/join-room.js
var request = require('../../utils/request').request;

Page({
  data:{
    placeholder: '请输入房间号'
  },
  searchRoom: function(event) {
    var roomNum = event.detail.value.keyword;
    wx.showToast({
      title: '正在加入房间',
      icon: 'loading',
      duration: 10000
    })
    request({
      url: '/room/join/' + roomNum,
      method: 'POST',
      success: function(res) {
        wx.hideToast();
        var cacheKey = 'join-room-'+ roomNum
        getApp().setCache(cacheKey, res.data);
        wx.redirectTo({
          url: '../room-killer/room-killer?cache=' + cacheKey + '&number=' + roomNum
        })
      },
      error: function(data) {
        wx.hideToast();
      }
    })
  },
  onLoad:function(options){
    
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
    // wx.closeSocket();
  }
})