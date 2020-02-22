var util = require('../../../../utils/util.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nvabarData: {
      showCapsule: 1,
      title: '添加專長/技能'
    },
    topHeight: app.globalData.topHeight,
    language: {},
    editSkills: ''
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
    let language = that.data.language;
    let editSkillsObj = wx.getStorageSync("editSkillsObj");
    if (editSkillsObj == '' || editSkillsObj == null) {
      this.setData({
        ['nvabarData.title']: language.title
      })
    } else {
      this.setData({
        editSkills: editSkillsObj,
        ['nvabarData.title']: language.str1
      })
    }
    wx.setStorageSync("editSkillsObj", '');
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
      language: wx.T.getLanguage('editSkills'),
      ['nvabarData.title']: wx.T.getLanguage('editSkills').title
    });
  },

  /**
   * 保存formId
   */
  shareSubmit: function (e) {
    let that = this;
    var temp = wx.getStorageSync("userInfo");
    let formId = e.detail.formId;
    if (temp == "" || temp == undefined) { } else {
      if (formId == 'the formId is a mock one' || formId == undefined) { } else {
        util.dealFormIds(formId);
      }
    }
    let language = that.data.language;
    if (e.detail.value.textarea == '' || e.detail.value.textarea == null) {
      util.showTips(language.str2);
    } else {
      wx.setStorageSync("editSkillsObj", e.detail.value.textarea);
      wx.navigateBack();
    }
  }


})