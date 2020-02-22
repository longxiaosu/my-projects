const util = require('../utils/util.js');
const api = require('../config/api.js');
const app = getApp();


/**
 * Promise封装wx.login
 */
function login() {
  return new Promise(function (resolve, reject) {
    wx.login({
      success: function (res) {
        if (res.code) {
          console.log(res);
          resolve(res);
        } else {
          reject(res);
        }
      },
      fail: function (err) {
        reject(err);
      }
    });
  });
}

/**
 * 调用微信登录
 */
function loginByWeixin(userInfo) {
  return new Promise(function (resolve, reject) {
    wx.showLoading({
      title: '登录中...',
    })
    let appId = app.globalData.appId;
    wx.login({
      success: function (res) {
        // console.log('wx.login返回数据');
        // console.log(res);
        if (res.code) {
          util.request(api.LoginByWeixin, {
            code: res.code,
            userInfo: userInfo,
            appid: appId
          }, 'POST').then(function (res) {
            // console.log('服务器LoginByWeixin返回数据')
            // console.log(res)
            if (res.errno == 0) {
              let sessionKey = res.data.sessionKey;
              res.data.userInfo.nickName = res.data.userInfo.nickname;
              wx.setStorageSync('userInfo', res.data.userInfo);
              wx.setStorageSync('token', res.data.token);
              wx.setStorageSync('userId', res.data.userInfo.userId);
              wx.getUserInfo({
                withCredentials: true,
                success(res) {
                  // console.log('wx.getUserInfo返回数据')
                  // console.log(res)
                  let { signature, encryptedData, rawData, iv } = res;
                  util.request(api.LoginByWeixins, {
                    sessionKey: sessionKey,
                    signature: signature,
                    encryptedData: encryptedData,
                    rawData: rawData,
                    iv: iv,
                    appid: appId
                  }, 'POST').then(function (res) {
                    if (res.errno == 0) {
                      wx.hideLoading();
                      wx.showToast({
                        title: '登录成功',
                      })
                      resolve(res);
                    } else {
                      showFail();
                    }
                  })
                },
                fail(res) {
                  showFail();
                }
              })
            } else {
              showFail();
            }
          })
        } else {
          wx.hideLoading();
          reject(res);
        }
      },
      fail: function (err) {
        showFail();
        reject(err);
      }
    })

  });
}

function showFail() {
  wx.hideLoading();
  util.showErrorToast('登录失败');
}


//let that = this;
// util.request(api.StaffList, {
//   userId: wx.getStorageSync('userId')
// }, 'POST').then(function (res) {
//   console.log(res)
//   if (res.errno == 0) {

//   } else {
//     util.showTips(res.errmsg);
//   }
// }).catch(function (res) {
//   util.showErrorToast('网络错误');
// })
// for (let i = 0, len = persons.length; i < len; i++) {
//   console.log(persons[i])
// }

module.exports = {
  login,
  loginByWeixin
};