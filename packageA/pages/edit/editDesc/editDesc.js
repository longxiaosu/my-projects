var util = require('../../../../utils/util.js');
var api = require('../../../../config/api.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nvabarData: {
      showCapsule: 1,
      title: '添加自我描述'
    },
    topHeight: app.globalData.topHeight,
    language: {},
    editDesc: ''
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
    let editDescObj = wx.getStorageSync("editDescObj");
    if (editDescObj == '' || editDescObj == null) {} else {
      this.setData({
        editDesc: editDescObj,
        ['nvabarData.title']: language.str1
      })
    }
    wx.setStorageSync("editDescObj", '');
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
      language: wx.T.getLanguage('editDesc'),
      ['nvabarData.title']: wx.T.getLanguage('editDesc').title
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
    if(e.detail.value.textarea == ''||e.detail.value.textarea == null){
      util.showTips(language.str2);
    }else{
      wx.setStorageSync("editDescObj",e.detail.value.textarea);
      wx.navigateBack();
    }
  },
  /**
   * 监听文章输入
   */
  inputs: function (e) {
    this.setData({
      editDesc: e.detail.value
    });
  }


})