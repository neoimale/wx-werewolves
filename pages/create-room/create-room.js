var request = require('../../utils/request').request;

Page({
  data: {
    totalList: ['6', '7', '8', '9','10','11','12','13'],
    werwolfList: ['2'],
    villagerList: ['2'],
    totalIndex: 0,
    werwolfIndex: 0,
    villagerIndex: 0,

    items: [
      {name: 'prophet', value: '预言家'},
      {name: 'warlock', value: '女巫', checked: 'true'},
      {name: 'hunter', value: '猎人'},
      {name: 'cupid', value: '丘比特'},
      {name: 'guard', value: '守卫'},
      {name: 'idiot', value: '白痴'},
    ]
  },

  bindPickerChangeToTotal: function(e) {
      var select = e.detail.value
      this.setData({
          totalIndex: e.detail.value
      })
  },

  bindPickerChangeToWerwolf: function(e) {
      this.setData({
          werwolfIndex: e.detail.value
      })
  },

  bindPickerChangeToVillager: function(e) {
      this.setData({
          villagerIndex: e.detail.value
      })
  },

  checkboxChange: function(e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
  },

  clickCreateGameAction: function(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    var page = this;
    request({
          url: '/room/create',
          data: {
              type: 0,
              num: 8,
              config: { //房间配置
                "wolf": 3, //狼人数
                "oracle": 1, //预言家
                "witch": 1, //女巫
                "civilian": 3, //平民
                "hunter": 0,//猎人
                "cupid": 0, //丘比特
                "guard": 0, //守卫
                "idiot": 0  //白痴
              }
          },
          method: 'POST',
          success: function(rlt) {
              var roomNum = rlt.data.id;
              page.go2GodView(roomNum);
          }
    })
  },

  go2GodView: function(roomNum) {
      request({
          url: '/room/join/' + roomNum,
          data: {god: 1},
          method: 'POST',
          success: function(rlt) {
              if(rlt.data.god) {
                wx.redirectTo({
                    url: '../god-view/god-view'
                })
              }
          }
      })
  }
})
