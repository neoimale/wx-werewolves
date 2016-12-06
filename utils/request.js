var Const = require('./const');

function login() {
    wx.login({
      success: function (loginRes) {
        wx.getUserInfo({
          success: function (userRes) {
            request({
              url: '/login',
              data: {code: loginRes.code},
              method: 'POST',
              success: function(sres){
                var sessionId = sres.data.sessionid;
                console.log('sessionid:', sessionId);
                wx.setStorage({
                  key: 'session_id',
                  data: sessionId
                })
                request({
                    url: '/user/info',
                    data: {userInfo: userRes.userInfo, rawData: userRes.rawData},
                    method: 'POST'
                })
              }
            }, false)
          }
        })
      }
    })
}

function request(options, withSeesion = true) {
    if(withSeesion) {
        wx.getStorage({
            key: 'session_id',
            success: function(res) {
                options.data = options.data || {};
                options.data.sessionid = res.data;
                
                wx.request({
                  url: Const.HTTPS_URL + options.url,
                  data: options.data,
                  method: options.method || 'GET',
                  header: options.header || {}, 
                  success: function(res){
                    if(res.data.code == 0) {
                        options.success && options.success(res.data);
                    } else {
                        options.error && options.error(res.data);
                    }
                  },
                  fail: function() {
                    options.fail && options.fail();
                  }
                })
            }
        })
    } else {
        wx.request({
            url: Const.HTTPS_URL + options.url,
            data: options.data,
            method: options.method,
            header: options.header || {}, 
            success: function(res){
              if(res.data.code == 0) {
                  options.success && options.success(res.data);
              } else {
                  options.error && options.error(res.data);
              }
            },
            fail: function() {
              options.fail && options.fail();
            }
        })
    }
}

module.exports = {
    login: login,
    request: request
}