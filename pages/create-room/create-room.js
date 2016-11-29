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

  radioChange: function(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },

  clickCreateGameAction: function(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
  },
})
