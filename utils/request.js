var Const = require('./const');
var Promise = require('./es6-promise').Promise;

var DEBUG = false;
var debugInfo;

function _debugStart(url, data, method) {
    if(DEBUG) {
      debugInfo = {};
      debugInfo.startTime = Date.now();
      debugInfo.url = url;
      debugInfo.data = data;
      debugInfo.method = method;
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

function verifySession() {
   return new Promise(function(resolve, reject) {
     request({
        url: '/login/verify',
        method: 'GET',
        success: (res) => {
            resolve({
                code: 0,
                message: 'session valid'
            })
        },
        error: () => {
            resolve({
                code: -1,
                message: 'verify failed'
            })
        }
      })     
    })  
}

function login() {
    verifySession().then(function(result) {
        if(!result || result.code != 0) {
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
    })
}

function request(options, withSeesion = true) {
    return new Promise((resolve, reject) => {
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
                    resolve(res);
                  },
                  fail: function() {
                    _debugEnd('fail');
                    options.error && options.error({code: -1, message: '当前网络出现异常'});
                    options.fail && options.fail();
                    reject({code: -1, message: '当前网络出现异常'});
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
              resolve(res);
            },
            fail: function() {
              _debugEnd('fail');
              options.error && options.error({code: -1, message: '当前网络出现异常'});
              options.fail && options.fail();
              reject({code: -1, message: '当前网络出现异常'});
            }
        })
    }
    })
}

module.exports = {
    login: login,
    request: request
}