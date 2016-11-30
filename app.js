//app.js
var requestHelper = require('./utils/request');

App({
  onLaunch: function () {
    requestHelper.login();
  },
  // getUserInfo:function(cb){
  //   var that = this
  //   if(this.globalData.userInfo){
  //     typeof cb == "function" && cb(this.globalData.userInfo)
  //   }else{
  //     //调用登录接口
      
  //   }
  // },
  globalData:{
    userInfo:null
  }
})