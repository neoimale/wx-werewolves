//app.js
var requestHelper = require('./utils/request');
var LRUMap = require('./utils/lru');

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
  setCache: function(key, value) {
    if(!this.lruCache) {
      this.lruCache = new LRUMap(10);
    }
    this.lruCache.set(key, value);
  },
  getCache: function(key) {
    if(this.lruCache) {
      return this.lruCache.delete(key);
    }
  },
  globalData:{ 
    userInfo:null
  }
})