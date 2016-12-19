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
        case 'dead': {
          let id = msg.content.message;
          let players = this.data.players;
          let match = _.find(players, item => item.id == id);
          if(match) {
            match.status = 'dead';
          }
          this.setData({
            players: players
          })
          break;
        }
        case 'bringback': {
          let id = msg.content.message;
          let players = this.data.players;
          let match = _.find(players, item => item.id == id);
          if(match) {
            match.status = '';
          }
          this.setData({
            players: players
          })
          break;
        }
        case 'headset': {
          let newId = msg.content.message.newId;
          let oldId = msg.content.message.oldId;
          let players = this.data.players;
          _.each(players, (item) => {
            if(item.id == newId) {
              item.isHead = true;
            } else {
              item.isHead = false;
            }
          })
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
    let info = player.info;
    let roleName = Util.translateRole(this.data.roomType, player.role);
    let color = Util.roleColor(player.role);
    return {
      id: player.id,
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
        wx.onSocketClose(() => this.socketOpen = false);
        wx.onSocketMessage((msg) => {
          this.onMessage(msg.data);
        })
      }
    })
  },
  onTapPlayer: function(e) {
    console.log(e);
    let actions = [];
    let messages = [];
    let player = _.find(this.data.players, (item) => {
      return item.id == e.currentTarget.id;
    })
    if(player) {
      if(!player.head) {
        actions.push('选为警长');
        messages.push({
          type: 1,
          content: {
            event: 'head',
            message: {
              room: this.data.roomNum,
              key: player.id
            }
          }
        })
      }
      if(player.status == 'dead') {
        actions.push('撤销死亡');
        messages.push({
          type: 1,
          content: {
            event: 'reborn',
            message: {
              room: this.data.roomNum,
              key: player.id
            }
          }
        })
      } else {
        actions.push('死亡');
        messages.push({
          type: 1,
          content: {
            event: 'death',
            message: {
              room: this.data.roomNum,
              key: player.id
            }
          }
        })
      }
      wx.showActionSheet({
        itemList: actions,
        success: (res) => {
          if(!res.cancel && this.socketOpen) {
            wx.sendSocketMessage({
              data: JSON.stringify(messages[res.tapIndex])
            })
          }
        }
      })
    }
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
  onUnload:function(){
    // 页面关闭
    wx.closeSocket();
  }
})