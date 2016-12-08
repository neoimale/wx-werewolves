// pages/join-room/join-room.js
var request = require('../../utils/request').request;

Page({
  data:{
    placeholder: '请输入房间号'
  },
  searchRoom: function(event) {
    request({
      url: '/room/join/' + event.detail.value.keyword,
      method: 'POST',
      success: function(data) {
        console.log(data);
        wx.redirectTo({
          url: '../room-killer/room-killer?number=' + data.num + '&role=' + data.role
        })
      },
      error: function(data) {
        console.log(data);
      }
    })
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    // wx.getStorage({
    //   key: 'session_id',
    //   success: function(res){
    //     wx.connectSocket({
    //       url: "wss://api.byutech.cn/ws/" + res.data
    //     })
    //     wx.onSocketOpen(function() {
    //       wx.sendSocketMessage({
    //         data: 'I got U'
    //       })
    //     })
    //     wx.onSocketMessage(function(data) {
    //       console.log('socket msg>>>', data);
    //     })
    //   }
    // })
    
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