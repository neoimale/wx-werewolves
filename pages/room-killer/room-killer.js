// pages/room-killer/room-killer.js
var Util = require('../../utils/util');
var Const = require('../../utils/const');
var _ = require('../../utils/lodash.core');

Page({
  data:{
    // role: '女巫',
    // roleDesc: '你有一瓶解药和毒药，用好它们是游戏胜利的关键',
    // roleColor: '#e64340',
    // roomInfo: [{
    //   key: '当前房号',
    //   value: '8888'
    // }, {
    //   key: '你是',
    //   value: '2号'
    // }, {
    //   key: '游戏人数',
    //   value: '8'
    // }, {
    //   key: '游戏配置',
    //   value: '3狼人, 3村民, 1预言家, 1女巫, 0猎人, 0丘比特, 0白痴'
    // }]
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    // console.log(options);
    var roomNum = options.number;
    var cacheKey = options.cache;
    var data = getApp().getCache(cacheKey);
    if(data) {
      var roleColor = Util.roleColor(data.role);
      data = this.processInfo(data);
      data.roomInfo.unshift({key: '当前房号:', value: roomNum});
      data.roleColor = roleColor;
      this.setData(data);
      wx.setNavigationBarTitle({
        title: (data.gameType == Const.GAME.GAME_WOLF ? '狼人杀 - ' : '杀人游戏 - ') + roomNum
      })
    }
  },
  processInfo: function(data) {
    var out = {};
    var gameType = data.roomInfo.type;
    out.gameType = gameType;
    out.role = Util.translateRole(gameType, data.role);
    out.roleDesc = data.desc;
    out.roomInfo = [];
    var config = data.roomInfo.config;
    out.roomInfo.push({key: '你是:', value: data.num + '号'});
    out.roomInfo.push({key: '游戏人数:', value: data.roomInfo.num});
    var configString = [];
    _.each(config, (value, key) => {
      if(value > 0) {
        configString.push('' + value + Util.translateRole(gameType, key));
      }
    })
    out.roomInfo.push({
      key: '游戏配置:',
      value: configString.join(', ')
    })
    return out;
  },
  go2RulePage: function() {
    var gameType = this.data.gameType;
    if(gameType == Const.GAME.GAME_WOLF) {
      wx.navigateTo({
        url: '../wolf-rule/wolf-rule'
      })
    } else if(gameType == Const.GAME.GAME_KILLER) {
      wx.navigateTo({
        url: '../killer-rule/killer-rule'
      })
    }
    
  },
  onUnload:function(){
    // 页面关闭
  }
})