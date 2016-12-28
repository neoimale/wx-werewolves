var request = require('../../utils/request').request;
var Const = require('../../utils/const');
var _ = require('../../utils/lodash.core');

Page({
  data: {
    typeList: ['狼人杀','杀人游戏'],
    totalList: [6, 7, 8, 9,10,11,12,13, 14, 15, 16],
    typeIndex: 0,
    totalIndex: 0,
    gameType: Const.GAME.GAME_WOLF,

    items: [
      {name: 'oracle', value: '预言家', checked: 'true'},
      {name: 'witch', value: '女巫', checked: 'true'},
      {name: 'hunter', value: '猎人'},
      {name: 'cupid', value: '丘比特'},
      {name: 'guard', value: '守卫'},
      {name: 'idiot', value: '白痴'},
    ]
  },

  // 选择游戏类型
  bindPickerChangeToGameType: function(e) {
      let selectValue = e.detail.value;
      let totalList = this.data.totalList;
      let totalIndex = this.data.totalIndex;
      this.config = this.calculateConfig({
          type: (selectValue == 0) ? Const.GAME.GAME_WOLF :Const.GAME.GAME_KILLER,
          num: totalList[totalIndex]
      });
      let data = _.extend({
          typeIndex: selectValue
      }, this.parseConfig(this.config));
      this.setData(data);
  },

  onLoad:function(options){
      let totalList = this.data.totalList;
      let totalIndex = this.data.totalIndex;
      this.config = this.calculateConfig({
          type: Const.GAME.GAME_WOLF,
          num: totalList[totalIndex]
      })
      this.setData(this.parseConfig(this.config));
  },

  // 选择总人数
  bindPickerChangeToTotal: function(e) {
      var totalList = this.data.totalList;
      let gameType = this.data.gameType;
      this.config = this.calculateConfig({
          type: gameType,
          num: totalList[e.detail.value]
      })
      var data = _.extend({totalIndex: e.detail.value},this.parseConfig(this.config));
      this.setData(data);
  },

  // 选择狼人
  bindPickerChangeToWerwolf: function(e) {
      var werwolfList = this.data.werwolfList;
      this.config = this.calculateConfig({
          type: Const.GAME.GAME_WOLF,
          num: this.config.num,
          config: _.extend({}, this.config.config, {
              wolf: werwolfList[e.detail.value],
              civilian: 0
          })
      })
      var data = this.parseConfig(this.config);
      this.setData(data);
  },

  // 选择杀手
  bindPickerChangeToKiller: function(e) {
      var killerList = this.data.killerList;
      var gameType = this.data.gameType;
      this.config = this.calculateConfig({
          type: gameType,
          num: this.config.num,
          config: {
              killer: killerList[e.detail.value],
              police: this.config.config.police
          }
      })
      var data = this.parseConfig(this.config);
      this.setData(data);
  },

  // 选择村民
  bindPickerChangeToVillager: function(e) {
      var villagerList = this.data.villagerList;
      var gameType = this.data.gameType;
      this.config = this.calculateConfig({
          type: gameType,
          num: this.config.num,
          config: gameType == Const.GAME.GAME_WOLF ? _.extend({}, this.config.config, {
              civilian: villagerList[e.detail.value],
              wolf: 0
          }) : {civilian: villagerList[e.detail.value]}
      })
      var data = this.parseConfig(this.config);
      this.setData(data);
  },

  // 选择警察
  bindPickerChangeToPolice: function(e) {
      var policeList = this.data.policeList;
      var gameType = this.data.gameType;
      this.config = this.calculateConfig({
          type: gameType,
          num: this.config.num,
          config: {
              police: policeList[e.detail.value],
              killer: this.config.config.killer
          }
      })
      var data = this.parseConfig(this.config);
      this.setData(data);
  },

  checkboxChange: function(e) {
      if(e.detail.value.length > this.config.num - 2) {
          wx.showModal({
              title: '无效操作',
              content: '当前游戏总人数为' + this.config.num + '人',
              showCancel: false
          });
          this.setData(this.parseConfig(this.config));
          return;
      }
      var conf = {};
      _.each(e.detail.value, (key) => {
          conf[key] = 1;
      })
      this.config = this.calculateConfig({
          type: this.config.type,
          num: this.config.num,
          config: _.extend({}, {
              wolf: this.config.config.wolf,
              civilian: 0,
              oracle: 0,
              witch: 0,
              hunter: 0,
              cupid: 0,
              guard:0,
              idiot: 0
          }, conf)
      })
      var data = this.parseConfig(this.config);
      this.setData(data);
  },

  calculateConfig: function(conf) {
    // 计算按照优先级: 总人数 > 特殊身份 > 狼人 > 平民
    // 选择总人数时只需传总人数，其余要传整个config过来
    if(conf.type == Const.GAME.GAME_WOLF) {
        conf.config = conf.config || {};
        let {wolf=0, civilian=0, oracle=0, witch=0, hunter=0, cupid=0, guard=0, idiot=0} = conf.config;
        if(_.isEmpty(conf.config)) {
            oracle = oracle || 1;
            witch = witch || 1;
            hunter = hunter || (conf.num > 8 ? 1 : 0);
            guard = guard || (conf.num > 11 ? 1 : 0);
        }
        let special = oracle + witch + hunter + cupid + guard + idiot;
        let max = Math.max(conf.num - special - 1, 1);
        wolf = wolf || (civilian ? conf.num - civilian - special : Math.floor(conf.num / 3));
        wolf = Math.min(max, wolf);
        civilian = civilian || (conf.num - wolf - special);
        conf.config = _.extend(conf.config, {
            wolf: wolf,
            civilian: civilian,
            oracle: oracle,
            witch: witch,
            hunter: hunter,
            guard: guard,
            cupid: cupid,
            idiot: idiot
        })
        return conf;
    } else if(conf.type == Const.GAME.GAME_KILLER) {
        conf.config = conf.config || {};
        let special = Math.min(Math.floor(conf.num / 4), 4);
        let killer = conf.config.killer || special;
        let police = conf.config.police || special;
        let civilian = conf.num - killer - police;
        conf.config = _.extend(conf.config, {
            killer: killer,
            police: police,
            civilian: civilian
        });
        return conf;
    }
  },

  parseConfig: function(conf) {
    var totalList = this.data.totalList;
    var tatalIndex = totalList.indexOf(conf.num);
    if(conf.type == Const.GAME.GAME_WOLF) {
        var werwolfIndex, villagerIndex;
        var werwolfList = [], villagerList = [];
        let {oracle=0, witch=0, hunter=0, cupid=0, guard=0, idiot=0} = conf.config;
        let special = oracle + witch + hunter + cupid + guard + idiot;
        for(var i=1;i<conf.num-special;i++) {
            werwolfList.push(i);
            villagerList.push(i);
            if(i == conf.config.wolf) {
                werwolfIndex = i - 1;
            }
            if(i == conf.config.civilian) {
                villagerIndex = i - 1;
            }
        }
        var items = this.data.items;
        items[0].checked = conf.config.oracle > 0;
        items[1].checked = conf.config.witch > 0;
        items[2].checked = conf.config.hunter > 0;
        items[3].checked = conf.config.cupid > 0;
        items[4].checked = conf.config.guard > 0;
        items[5].checked = conf.config.idiot > 0;
        return {
            gameType: conf.type,
            werwolfList: werwolfList,
            villagerList: villagerList,
            totalIndex: tatalIndex,
            werwolfIndex: werwolfIndex,
            villagerIndex: villagerIndex,
            items: items
        }
    } else if(conf.type == Const.GAME.GAME_KILLER) {
        let killerList = [], policeList = [], villagerList = [];
        let killerIndex, policeIndex, villagerIndex;
        for(var i=1;i<conf.num-1;i++) {
            if(i < Math.floor(conf.num/2)) {
                killerList.push(i);
                policeList.push(i);
            }
            villagerList.push(i);
            if(i == conf.config.police) {
                policeIndex = i - 1;
            }
            if(i == conf.config.killer) {
                killerIndex = i - 1;
            }
            if(i == conf.config.civilian) {
                villagerIndex = i - 1;
            }
        }
        return {
            gameType: conf.type,
            killerList: killerList,
            policeList: policeList,
            villagerList: villagerList,
            killerIndex: killerIndex,
            policeIndex: policeIndex,
            villagerIndex: villagerIndex
        };
    }   
  },

  clickCreateGameAction: function(e) {
    var that = this;
    wx.showToast({
      title: '正在创建房间',
      icon: 'loading',
      duration: 10000
    })
    request({
        url: '/room/create',
        data: this.config,
        method: 'POST',
        success: function(rlt) {
            wx.hideToast();
            var roomNum = rlt.data.id;
            that.goResultView(roomNum);
        },
        error: function() {
            wx.hideToast();
            wx.showModal({
              title: '创建游戏失败',
              content: '网络出现异常',
              showCancel: false
            });
        }
    })
  },
  goResultView: function(roomNumber) {
      wx.redirectTo({
        url: '../create-result/create-result?room='+roomNumber,
      })
  }

})
