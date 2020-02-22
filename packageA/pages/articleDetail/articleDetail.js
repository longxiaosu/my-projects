var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nvabarData: {
      showCapsule: 1,
      title: '大小事'
    },
    topHeight: app.globalData.topHeight,
    language: {},
    detail: null
  },

  myData: {
    articleId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    this.setLanguage();
    wx.event.on("languageChanged", this, this.setLanguage);
    if (options.id) {
      this.myData.articleId = options.id;
      this.queryArticleDetail();
    } else {
      wx.switchTab({
        url: '/pages/index/index'
      });
    }

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
      language: wx.T.getLanguage('articleDetail'),
      ['nvabarData.title']: wx.T.getLanguage('articleDetail').title
    });
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

  queryArticleDetail: function () {
    let that = this;
    wx.showLoading({
      title: that.data.language.str1
    })
    util.request(api.articleDetail, {
      articleId: that.myData.articleId
    }, 'GET').then(function (res) {
      wx.hideLoading();
      if (res.success == true) {
        let detail = res.result;
        detail.webContent = detail.webContent.replace(/\<img/gi, '<img class="rich-img" ');
        that.setData({
          detail: detail
        })
      } else {
        util.showTips(res.message);
      }
    }).catch(function (res) {
      wx.hideLoading();
      util.showErrorToast('网络错误');
    })
  }

})