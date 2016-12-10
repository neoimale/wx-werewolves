// pages/room-killer/room-killer.js
Page({
  data:{
    role: '女巫',
    roleDesc: '你有一瓶解药和毒药，用好它们是游戏胜利的关键',
    roomInfo: [{
      key: '当前房号',
      value: '8888'
    }, {
      key: '你是',
      value: '2号'
    }, {
      key: '游戏人数',
      value: '8'
    }, {
      key: '游戏配置',
      value: '3狼人, 3村民, 1预言家, 1女巫, 0猎人, 0丘比特, 0白痴'
    }]
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    // console.log(options);
    var roomNum = options.number;
    var cacheKey = options.cache;
    var data = getApp().getCache(cacheKey);
    console.log(data);
    wx.setNavigationBarTitle({
      title: '狼人杀 - ' + roomNum
    })
  },
  processInfo: function(data) {

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
  }
})