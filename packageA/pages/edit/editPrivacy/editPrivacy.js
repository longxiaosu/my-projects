var util = require('../../../../utils/util.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nvabarData: {
      showCapsule: 1,
      title: '隐私设置'
    },
    topHeight: app.globalData.topHeight,
    language: {},
    resumeHidden: false //是否隐藏当前简历0不隐藏1隐藏
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
    that.queryJobHuntingStatus();

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
  onShareAppMessage: function (e) { },

  /**
   * 加载语言
   */
  setLanguage() {
    this.setData({
      language: wx.T.getLanguage('editPrivacy'),
      ['nvabarData.title']: wx.T.getLanguage('editPrivacy').title
    });
  },

  /**
   * 查询用户个人求职意愿和是否显示和隐藏简历
   */
  queryJobHuntingStatus: function () {
    let that = this;
    wx.showLoading({
      title: that.data.language.str2,
      mask: true
    })
    util.request(wx.api.queryJobHuntingStatus, {}, 'GET').then(function (res) {
      wx.hideLoading();
      if (res.success == true) {
        let resumeHidden = res.result.resumeHidden.toString();
        resumeHidden = resumeHidden == "0" ? false : true;
        that.setData({
          resumeHidden: resumeHidden
        })
      } else {
        util.showTips(res.message);
      }
    }).catch(function (res) {
      wx.hideLoading();
      util.showErrorToast('网络错误');
    })
  },

  /**
   * 修改是否隐藏简历
   */
  editResumeHidden: function () {
    let that = this;
    let resumeHidden = that.data.resumeHidden == false ? 0 : 1;
    util.request(wx.api.editResumeHidden, { status: resumeHidden }, 'GET').then(function (res) {
      if (res.success == true) {
      } else {
        util.showTips(res.message);
      }
    }).catch(function (res) {
      util.showErrorToast('网络错误');
    })
  },

  bindDateChange: function (e) {
    let that = this;
    let name = e.currentTarget.dataset.name;
    that.setData({
      [name]: e.detail.value
    })
    if (name == 'resumeHidden') {
      that.editResumeHidden();
    }
  }



})