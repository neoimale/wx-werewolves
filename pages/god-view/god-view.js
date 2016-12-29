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
        case 'headcanceled': {
          let players = this.data.players;
          _.each(players, (item) => {
            item.isHead = false;
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
      roleName: roleName,
      isHead: player.head,
      status: player.status
    }
  },
  onLoad: function(options){
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
      if(!player.isHead) {
        actions.push('选为警长');
        messages.push({
          type: 1,
          content: {
            event: 'head',
            category: 'god',
            message: {
              room: this.data.roomNum,
              key: player.id
            }
          }
        })
      } else {
        actions.push('取消警长');
        messages.push({
          type: 1,
          content: {
            event: 'cancelhead',
            category: 'god',
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
            category: 'god',
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
            category: 'god',
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
  showGodOrder: function() {
    var content = '"天黑请闭眼"\n"丘比特请睁眼，丘比特请选择两位组成情侣" (第一晚)\n"守卫请睁眼，请选择你要守护的人"\n' + 
      '"狼人请睁眼，请确认你的同伴。狼人请杀人，统一好意见"\n"女巫请睁眼，今天晚上他死了，你要用解药救他吗？毒药要用吗？"\n' +
      '"预言家请睁眼，今天晚上你要验谁的身份？这个代表好人，这个代表坏人，他是这个。"\n"天亮了！"' ;
    wx.showModal({
      title: '上帝口令',
      content: content,
      showCancel: false
    });
  },
  onUnload:function(){
    // 页面关闭
    wx.closeSocket();
  }
})