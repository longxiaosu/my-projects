var util = require('../../utils/util.js');
var api = require('../../config/api.js');
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false,
      observer: function (newVal, oldVal) { }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    detail: {
      focus: false,
      val: ''
    },
    language: {}
  },

  lifetimes: {
    created: function () {
      //在组件实例刚刚被创建时执行

    },
    attached: function () {
      // 在组件实例进入页面节点树时执行
      this.setLanguage();
      wx.event.on("languageChanged", this, this.setLanguage);
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },

  // 组件所在页面的生命周期函数
  pageLifetimes: {
    show() {

    }
  },

  /**
   * 组件的方法列表
   */
  methods: {

    /**
     * 加载语言
     */
    setLanguage() {
      this.setData({
        language: wx.T.getLanguage('loginPanel')
      });
    },

    /**
     * 阻止默认滚动事件
     */
    preSlide: function () {
      return;
    },

    /**
     * 关闭窗口 
     */
    closePopUp: function () {
      let that = this;
      let myEventDetail = {
        success: false
      }
      that.triggerEvent('close', myEventDetail);
    },

    /**
     * 微信登录
     * @param {*} e 
     */
    userLogin: function (e) {
      let that = this;
      let language = that.data.language;
      var version = wx.getSystemInfoSync().SDKVersion
      if (util.compareVersion(version, '2.4.3') >= 0) {
        if (e.detail.userInfo) {
          wx.showLoading({
            title: language.str3,
            mask: true
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
                      if(re.result.bindEmail == false){
                        that.triggerEvent('close', { success: false });
                        wx.setStorageSync('userInfoRecord', re.result);
                        wx.navigateTo({
                          url: '/packageA/pages/bindEmail/bindEmail'
                        })
                        return;
                      }

                      util.showTips(language.str4, 'success');
                      wx.setStorageSync('userInfo', re.result);
                      wx.socketConnectTask.linkSocket();//连接socket
                      that.triggerEvent('close', { success: true });
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
          title: language.str5,
          content: language.str6
        })
      }
    }


  }
})