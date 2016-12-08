// pages/god-view/god-view.js
Page({
  data:{
    roomNum: 8888,
    players: [{
      avatarUrl: "http://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eqSeUf9vO3vicicnaPeFfibcM4H6CiaNiakfSSRMAZoFFvgiaFicUVcV3ibpTok9aeA9y6hfe0iaC3Sia9RwlbQ/0",
      nickName: "neo",
      roleName: "女巫",
      role: "witch"
    }, {
      avatarUrl: "http://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eqSeUf9vO3vicicnaPeFfibcM4H6CiaNiakfSSRMAZoFFvgiaFicUVcV3ibpTok9aeA9y6hfe0iaC3Sia9RwlbQ/0",
      nickName: "neo",
      roleName: "女巫",
      role: "witch"
    }, {
      avatarUrl: "http://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eqSeUf9vO3vicicnaPeFfibcM4H6CiaNiakfSSRMAZoFFvgiaFicUVcV3ibpTok9aeA9y6hfe0iaC3Sia9RwlbQ/0",
      nickName: "neo",
      roleName: "女巫",
      role: "witch"
    }, {
      avatarUrl: "http://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eqSeUf9vO3vicicnaPeFfibcM4H6CiaNiakfSSRMAZoFFvgiaFicUVcV3ibpTok9aeA9y6hfe0iaC3Sia9RwlbQ/0",
      nickName: "neo",
      roleName: "女巫",
      role: "witch"
    }, {
      avatarUrl: "http://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eqSeUf9vO3vicicnaPeFfibcM4H6CiaNiakfSSRMAZoFFvgiaFicUVcV3ibpTok9aeA9y6hfe0iaC3Sia9RwlbQ/0",
      nickName: "neo",
      roleName: "女巫",
      role: "witch"
    }]
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    wx.getStorage({
      key: 'session_id',
      success: function(res){
        wx.connectSocket({
          url: "wss://api.byutech.cn/ws/" + res.data
        })
        wx.onSocketOpen(() => this.socketOpen = true);
        wx.onSocketMessage((data) => {
          console.log('socket msg>>>', data);
        })
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