// pages/join-room/join-room.js
var request = require('../../utils/request').request;

Page({
  data: {
    editMode: 1
  },
  searchRoom: function(event) {
    var roomNum = event.detail.value.keyword;
    if(!roomNum) {
      wx.showModal({
        title: '请输入房间号',
        content: '房间号不能为空, 快去问问小伙伴房间号吧',
        showCancel: false
      });
      return;
    }
    this.join(roomNum);
  },
  join: function(roomNum) {
    var test = /(\d+)(god)$/.exec(roomNum);
    var isGod = test ? test[2] : false;
    roomNum = test ? test[1] : roomNum;
    
    wx.showToast({
      title: '正在加入房间',
      icon: 'loading',
      duration: 10000
    })
    request({
      url: '/room/join/' + roomNum,
      method: 'POST',
      data: isGod ? {god: 1} : {},
      success: function(res) {
        wx.hideToast();
        if(res.data.god) {
          wx.redirectTo({
            url: '../god-view/god-view?room=' + roomNum + '&type=' + res.data.roomInfo.type
          })
        } else {
          var cacheKey = 'join-room-'+ roomNum
          getApp().setCache(cacheKey, res.data);
          wx.redirectTo({
            url: '../room-killer/room-killer?cache=' + cacheKey + '&number=' + roomNum
          })
        }
      },
      error: function(data) {
        wx.hideToast();
        wx.showModal({
          title: '加入游戏失败',
          content: data.message,
          showCancel: false
        });
      }
    })
  },
  enterEdit: function() {
    this.setData({
      editMode: 1
    })
  },
  endEdit: function() {
    this.setData({
      editMode: 0
    })
  },
  scanCode: function() {
    wx.scanCode({
      success: (rlt) => {
        console.log('scan >>> ', rlt.result);
        if(rlt.result) {
          if(rlt.result.indexOf('join-room/join-room') != -1) {
            this.join('1000');
          } else {
            wx.navigateTo({
              url: rlt.result
            })
          }
        }
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