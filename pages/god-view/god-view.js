// pages/god-view/god-view.js
var request = require('../../utils/request').request;
var _ = require('../../utils/lodash.core');
var Util = require('../../utils/util');

Page({
  data:{
    roomNum: 8888,
    roomType: 100,
    players: []
  },
  onMessage: function(msg) {
    console.log('socket msg>>>', msg);
    try {
      if(typeof msg === 'string') {
        msg = JSON.parse(msg);
      }
      
      switch(msg.content.event) {
        case 'connected': {
          let players = msg.content.message.players;
          players = _.map(players, (player) => {
            return this.processPlayerInfo(player);
          })
          this.setData({
            players: players
          })
          break;
        }
        case 'join': {
          let player = msg.content.message;
          player = this.processPlayerInfo(player);
          let players = this.data.players || [];
          players.push(player);
          this.setData({
            players: players
          })
          break;
        }
      }
    } catch(e) {
      console.error(e);
    }
  },
  processPlayerInfo: function(player) {
    let info = JSON.parse(player.info);
    let roleName = Util.translateRole(this.data.roomType, player.role);
    let color = Util.roleColor(player.role);
    return {
      num: player.num,
      color: color,
      nickName: info.nickName,
      avatarUrl: info.avatarUrl,
      role: player.role,
      roleName: roleName
    }
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var roomNumber = options.room;
    var roomType = options.type;
    this.setData({
      roomNum: roomNumber, 
      roomType: roomType     
    })

    wx.getStorage({
      key: 'session_id',
      success: (res) => {
        wx.connectSocket({
          url: "wss://api.byutech.cn/ws/" + res.data + "?room=" + roomNumber +"&business=god"
        })
        wx.onSocketOpen(() => this.socketOpen = true);
        wx.onSocketMessage((msg) => {
          this.onMessage(msg.data);
        })
      }
    })
  },
  restartGame: function() {
    wx.showModal({
      title: '重新开始',
      content: '确定要重新开始游戏吗?',
      success: (res) => {
        if(res.confirm) {
          request({
            url: '/room/restart/' + this.data.roomNum,
            method: 'POST',
            success: (rlt) => {
              this.setData({
                players: []
              })
            } 
          })
        }
      }
    })
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
    wx.closeSocket();
  }
})