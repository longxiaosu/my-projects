var util = require('../../utils/util.js');
var tool = require('../../utils/public.js');
var api = require('../../config/api.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nvabarData: {
      showCapsule: 0,
      title: '我的'
    },
    topHeight: app.globalData.topHeight,
    language: {},
    langIndex: 0,
    loginShow: false,
    applyNum: 0,//工作申请通知数量
    userInfo: {
      userInfo: {
        userId: '',
        nickname: '',
        avatarUrl: 'https://img.bosszhipin.com/boss/avatar/avatar_15.png?x-oss-process=image/resize,w_60,limit_0'
      }
    }
  },

  myData: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      langIndex: wx.getStorageSync('langIndex')
    });
    this.setLanguage();
    wx.event.on("socketApplyNum", this, this.socketMsg);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    util.checkToLogin().then(function (res) {
      let userInfo = wx.getStorageSync("userInfo");
      let applyNum = wx.getStorageSync('applyNum');
      applyNum = applyNum == '' ? 0 : applyNum;
      that.setData({
        applyNum: applyNum,
        userInfo: userInfo
      })
    }).catch(function (res) {
      that.setData({
        applyNum: 0,
        loginShow: true,
        userInfo: {
          userInfo: {
            userId: '',
            nickname: '',
            avatarUrl: 'https://img.bosszhipin.com/boss/avatar/avatar_15.png?x-oss-process=image/resize,w_60,limit_0'
          }
        }
      })
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {


  },

  /**
   * 保存formId
   */
  shareSubmit: function (e) {
    var temp = wx.getStorageSync("userInfo");
    let formId = e.detail.formId;
    if (temp == "" || temp == undefined) { } else {
      if (formId == 'the formId is a mock one' || formId == undefined) { } else {
        util.dealFormIds(formId);
      }
    }
  },

  /**
   * 跳转其他页面
   */
  linkToPage: function (event) {
    let that = this;
    let urls = event.currentTarget.dataset.url;
    util.checkToLogin().then(function (res) {
      if (urls == '/packageA/pages/myApplication/myApplication') {
        //如果跳转的是投递记录，就预加载内容
        tool.preQueryApplies('queryApplies');
      }
      wx.navigateTo({
        url: urls
      })
    }).catch(function (res) {
      that.setData({
        loginShow: true
      })
    })
  },

  /**
   * 跳转到企业版程序
   */
  linkOthersWe: function () {
    wx.navigateToMiniProgram({
      appId: 'wxd0e4ca099097e02f',
      fail(res) { }
    })
  },

  /**
 * 关闭登录弹窗
 */
  closeLogin: function (e) {
    let that = this;
    that.setData({
      loginShow: false
    })
    let success = e.detail.success;
    if (success == true) {//登录完成
      let userInfo = wx.getStorageSync("userInfo");
      if (userInfo == "" || userInfo == undefined) {
      } else {
        that.setData({
          userInfo: userInfo
        })
      }
    }
  },

  /**
   * 用户登录
   * @param {*} e 
   */
  getUserInfo: function (e) {
    let that = this;
    var version = wx.getSystemInfoSync().SDKVersion
    if (util.compareVersion(version, '2.4.3') >= 0) {
      if (e.detail.userInfo) {
        wx.showLoading({
          title: '正在登录...'
        })
        wx.removeStorageSync('userInfo');
        wx.removeStorageSync('token');
        wx.login({
          success(res) {
            util.request(api.LoginByWeixin, {
              code: res.code,
            }, 'GET').then(function (r) {
              if (r.success == true) {
                util.request(api.login, {
                  encryptedData: e.detail.encryptedData,
                  iv: e.detail.iv,
                  signature: e.detail.signature,
                  rawData: e.detail.rawData,
                  sessionKey: r.result.sessionKey
                }, 'GET').then(function (re) {
                  wx.hideLoading();
                  if (re.success == true) {
                    if (re.result.bindEmail == false) {
                      wx.setStorageSync('userInfoRecord', re.result);
                      wx.navigateTo({
                        url: '/packageA/pages/bindEmail/bindEmail'
                      })
                      return;
                    }

                    util.showTips('登入成功', 'success');
                    wx.setStorageSync('userInfo', re.result);
                    wx.socketConnectTask.linkSocket();//连接socket
                    that.setData({
                      userInfo: re.result
                    })
                  } else {
                    util.showTips(re.message);
                  }
                }).catch(function (res) {
                  wx.hideLoading();
                  util.showErrorToast('网络错误');
                })
              } else {
                wx.hideLoading();
                util.showTips(r.message);
              }
            }).catch(function (r) {
              wx.hideLoading();
              util.showErrorToast('网络错误');
            })
          },
          fail(res) {
            wx.hideLoading();
            util.showErrorToast('登录失败');
          }

        })

      }
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },

  /**
   * 加载语言
   */
  setLanguage() {
    this.setData({
      language: wx.T.getLanguage('mine')
    });
  },

  /**
   * 监听socket返回的消息
   */
  socketMsg(res) {
    let that = this;
    let applyNum = res.applyNum;//有新的工作申请消息的提示,显示小红点
    if (typeof applyNum != "undefined") {
      if (applyNum == 0 && that.data.applyNum != 0) {
        console.log(22222)
        that.setData({
          applyNum: 0
        })
      } else if (that.data.applyNum != applyNum) {
        console.log(11111)
        that.setData({
          applyNum: applyNum
        })
      }

    }


  },


  /**
   * 切换语言
   */
  changeLanguage: function () {
    let that = this;
    wx.showActionSheet({
      itemList: ['繁體中文', '简体中文'],
      success(res) {
        if (res.tapIndex == 0) {
          util.showTips('切換成功', 'success');
        }
        if (res.tapIndex == 1) {
          util.showTips('切换成功', 'success');
        }

        that.setData({
          langIndex: res.tapIndex
        });
        wx.T.setLocaleByIndex(res.tapIndex);
        that.setLanguage();
        wx.event.emit('languageChanged');
        wx.setStorageSync('langIndex', res.tapIndex);
      },
      fail(res) {

      }
    })

  },

  /**
   * 退出登录
   */
  loginOut: function () {
    let that = this;
    wx.showModal({
      content: that.data.language.str10,
      showCancel: true,
      cancelText: that.data.language.str11,
      cancelColor: '#999999',
      confirmText: that.data.language.str12,
      confirmColor: '#16B38A',
      success(res) {
        if (res.confirm) {
          wx.removeStorageSync('userInfo');
          wx.removeStorageSync('token');
          wx.socketConnectTask.closeSocket();
          that.setData({
            applyNum: 0,
            userInfo: {
              userInfo: {
                userId: '',
                nickname: '',
                avatarUrl: 'https://img.bosszhipin.com/boss/avatar/avatar_15.png?x-oss-process=image/resize,w_60,limit_0'
              }
            }
          })
        } else if (res.cancel) { }
      }
    })
  }



})