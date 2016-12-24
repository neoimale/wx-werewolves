var request = require('../../utils/request').request;
var Const = require('../../utils/const');
var _ = require('../../utils/lodash.core');

Page({
  data: {
    totalList: [6, 7, 8, 9,10,11,12,13, 14, 15, 16],
    werwolfList: [1, 2, 3, 4, 5],
    villagerList: [1, 2, 3, 4, 5],
    totalIndex: 0,
    werwolfIndex: 1,
    villagerIndex: 1,

    items: [
      {name: 'oracle', value: '预言家', checked: 'true'},
      {name: 'witch', value: '女巫', checked: 'true'},
      {name: 'hunter', value: '猎人'},
      {name: 'cupid', value: '丘比特'},
      {name: 'guard', value: '守卫'},
      {name: 'idiot', value: '白痴'},
    ]
  },

  onLoad:function(options){
      this.config = this.calculateConfig({
          type: Const.GAME.GAME_WOLF,
          num: 6
      })
      this.setData(this.parseConfig(this.config));
  },

  bindPickerChangeToTotal: function(e) {
      var totalList = this.data.totalList;
      this.config = this.calculateConfig({
          type: Const.GAME.GAME_WOLF,
          num: totalList[e.detail.value]
      })
      var data = this.parseConfig(this.config);
      this.setData(data);
  },

  bindPickerChangeToWerwolf: function(e) {
      var werwolfList = this.data.werwolfList;
      this.config = this.calculateConfig({
          type: Const.GAME.GAME_WOLF,
          num: this.config.num,
          config: {
              wolf: werwolfList[e.detail.value]
          }
      })
      var data = this.parseConfig(this.config);
      this.setData(data);
  },

  bindPickerChangeToVillager: function(e) {
      this.setData({
          villagerIndex: e.detail.value
      })
  },

  checkboxChange: function(e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
  },

  calculateConfig: function(conf) {
    if(conf.type == Const.GAME.GAME_WOLF) {
        conf.config = conf.config || {};
        let {wolf=0, civilian=0, oracle=0, witch=0, hunter=0, cupid=0, guard=0, idiot=0} = conf.config;
        let special = oracle + witch + hunter + cupid + guard + idiot;
        special = special || Math.min(Math.floor(conf.num / 3), 4);
        hunter = hunter || (conf.num > 8 ? 1 : 0);
        guard = guard || (conf.num > 11 ? 1 : 0);
        wolf = wolf || Math.min(Math.floor(conf.num / 3), conf.num - civilian - special);
        civilian = civilian || (conf.num - wolf - special);
        oracle = oracle || 1;
        witch = witch || 1;
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
    }
  },

  parseConfig: function(conf) {
    var totalList = this.data.totalList;
    var tatalIndex = totalList.indexOf(conf.num);
    if(conf.type == Const.GAME.GAME_WOLF) {
        var werwolfIndex, villagerIndex;
        var werwolfList = [], villagerList = [];
        for(var i=1;i<conf.num;i++) {
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
            werwolfList: werwolfList,
            villagerList: villagerList,
            totalIndex: tatalIndex,
            werwolfIndex: werwolfIndex,
            villagerIndex: villagerIndex,
            items: items
        }
    }      
  },

  clickCreateGameAction: function(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    var page = this;
    request({
          url: '/room/create',
          data: {
              type: Const.GAME.GAME_WOLF,
              num: 8,
              config: { //房间配置
                "wolf": 2, //狼人数
                "oracle": 1, //预言家
                "witch": 1, //女巫
                "civilian": 3, //平民
                "hunter": 0,//猎人
                "cupid": 0, //丘比特
                "guard": 0, //守卫
                "idiot": 1  //白痴
              }
          },
          method: 'POST',
          success: function(rlt) {
              var roomNum = rlt.data.id;
              page.goResultView(roomNum);
          }
    })
  },
  goResultView: function(roomNumber) {
      wx.redirectTo({
        url: '../create-result/create-result?room='+roomNumber,
      })
  }

})
