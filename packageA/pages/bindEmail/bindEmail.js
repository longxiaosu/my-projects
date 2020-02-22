var util = require('../../../utils/util.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nvabarData: {
      showCapsule: 1,
      title: ''
    },
    topHeight: app.globalData.topHeight,
    language: {},
    currentTab: 0 //0=新用户绑定，1=老用户绑定
  },

  myData: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    let that = this;
    this.setLanguage();
    wx.event.on("languageChanged", this, this.setLanguage);


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
   * 加载语言
   */
  setLanguage() {
    this.setData({
      language: wx.T.getLanguage('bindEmail')
    });
  },


  radioChange: function (e) {
    this.setData({
      currentTab: e.detail.value
    })
  },

  /**
   * 新用户注册
   * @param {*} e 
   */
  bindEmail: function (e) {
    let that = this;
    let language = that.data.language;
    let account = e.detail.value.account;
    let passWord = e.detail.value.passWord;
    let passWordRes = e.detail.value.passWordRes;
    if (account == '' || account == null) {
      util.showTips(language.str1);
      return;
    }
    let reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    if (!reg.test(account)) {
      util.showTips(language.str4);
      return;
    }
    if (passWord == '' || passWord == null) {
      util.showTips(language.str2);
      return;
    }
    if (passWordRes == '' || passWordRes == null) {
      util.showTips(language.str3);
      return;
    }
    if (passWord != passWordRes) {
      util.showTips(language.str5);
      return;
    }
    that.bindMailRequest(account,passWord,0);
  },

  /**
   * 老用户绑定
   * @param {*} e 
   */
  bindEmail2: function (e) {
    let that = this;
    let language = that.data.language;
    let account = e.detail.value.account;
    let passWord = e.detail.value.passWord;

    if (account == '' || account == null) {
      util.showTips(language.str1);
      return;
    }

    let reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    if (!reg.test(account)) {
      util.showTips(language.str4);
      return;
    }

    if (passWord == '' || passWord == null) {
      util.showTips(language.str2);
      return;
    }

    that.bindMailRequest(account,passWord,1);
  },

  /**
   * 绑定邮箱
   */
  bindMailRequest: function (email, password,currentTab) {
    let that = this;
    let language = that.data.language;
    wx.showLoading({
      title: language.str7,
      mask: true
    })
    util.request(wx.api.bindMail, {
      email: email,
      password: password,
      type: currentTab
    }, 'POST').then(function (res) {
      wx.hideLoading();
      if (res.success == true) {
        util.showTips(language.str8, 'success');
        let userInfoRecord = wx.getStorageSync('userInfoRecord');
        userInfoRecord.bindEmail = true;
        wx.setStorageSync('userInfo', userInfoRecord);
        wx.removeStorageSync('userInfoRecord');
        wx.socketConnectTask.linkSocket();//连接socket
        setTimeout(function () {
          wx.navigateBack();
        }, 1000)
      } else {
        util.showTips(res.message);
      }
    }).catch(function (res) {
      wx.hideLoading();
      util.showErrorToast('网络错误');
    })
  }




})