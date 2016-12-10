var Const = require('./const');

var DEBUG = true;
var debugInfo;

function _debugStart(url, data, method) {
    if(DEBUG) {
      debugInfo = {};
      debugInfo.startTime = Date.now();
      debugInfo.url = url;
      debugInfo.data = data;
      debugInfo.method = method
    }
}

function _debugEnd(res) {
    if(DEBUG) {
      debugInfo = debugInfo || {};
      debugInfo.res = res;
      debugInfo.endTime = Date.now();
      console.log(debugInfo.method + ' ' + debugInfo.url, 
        (debugInfo.endTime - debugInfo.startTime) + 'ms',debugInfo.data, ' >>> ', debugInfo.res);
    }
}

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
                // console.log('sessionid:', sessionId);
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
                
                _debugStart(Const.HTTPS_URL + options.url, options.data, options.method || 'GET')
                wx.request({
                  url: Const.HTTPS_URL + options.url,
                  data: options.data,
                  method: options.method || 'GET',
                  header: options.header || {}, 
                  success: function(res){
                    _debugEnd(res.data);
                    if(res.data.code == 0) {
                        options.success && options.success(res.data);
                    } else {
                        options.error && options.error(res.data);
                    }
                  },
                  fail: function() {
                    _debugEnd('fail');
                    options.fail && options.fail();
                  }
                })
            }
        })
    } else {
        _debugStart(Const.HTTPS_URL + options.url, options.data, options.method || 'GET')
        wx.request({
            url: Const.HTTPS_URL + options.url,
            data: options.data,
            method: options.method || 'GET',
            header: options.header || {}, 
            success: function(res){
              _debugEnd(res.data);
              if(res.data.code == 0) {
                  options.success && options.success(res.data);
              } else {
                  options.error && options.error(res.data);
              }
            },
            fail: function() {
              _debugEnd('fail');
              options.fail && options.fail();
            }
        })
    }
}

module.exports = {
    login: login,
    request: request
}