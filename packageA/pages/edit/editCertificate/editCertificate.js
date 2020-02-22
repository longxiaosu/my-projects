var util = require('../../../../utils/util.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nvabarData: {
      showCapsule: 1,
      title: '添加证书'
    },
    topHeight: app.globalData.topHeight,
    language: {},
    editCertificateObj: '',
    dateFrom: "",//获得日期
    organizationName: "", //单位或地点名称
    title: "", //证书名称
    description: "" //证书简介
  },

  myData: {
    editCertificateObj: ''
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
    let nvabarDataTitle = language.str1;
    let editCertificateObj = wx.getStorageSync("editCertificateObj");
    that.myData.editCertificateObj = editCertificateObj;
    if (editCertificateObj == '' || editCertificateObj == null) {
      nvabarDataTitle = language.title;
    }
    wx.setStorageSync("editCertificateObj", '');
    let times = this.getNowFormatDate();
    that.setData({
      ['nvabarData.title']: nvabarDataTitle,
      maxDate: times,
      editCertificateObj: editCertificateObj,
      dateFrom: editCertificateObj == '' ? '' : that.changDataFormat(editCertificateObj.obj.times),
      organizationName: editCertificateObj == '' ? '' : editCertificateObj.obj.organizationName,
      description: editCertificateObj == '' ? '' : editCertificateObj.obj.description,
      title: editCertificateObj == '' ? '' : editCertificateObj.obj.title,
    })

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
      language: wx.T.getLanguage('editCertificate'),
      ['nvabarData.title']: wx.T.getLanguage('editCertificate').title
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
    if (e.detail.value.organizationName == '' || e.detail.value.organizationName == null) {
      util.showTips(language.str2);
      return;
    }
    if (e.detail.value.title == '' || e.detail.value.title == null) {
      util.showTips(language.str3);
      return;
    }
    if (that.data.dateFrom == '') {
      util.showTips(language.str4);
      return;
    }


    let description = e.detail.value.textarea;
    let title = e.detail.value.title;
    let organizationName = e.detail.value.organizationName;
    let times = that.data.dateFrom + '-01';
    let editCertificateObj = that.myData.editCertificateObj;
    if (editCertificateObj != '') {
      //编辑修改
      editCertificateObj.obj = {
        description: description,
        organizationName: organizationName,
        title: title,
        times: times
      }
    } else {
      //新增
      editCertificateObj = {
        index: -1,
        obj: {
          description: description,
          organizationName: organizationName,
          title: title,
          times: times
        }
      }
    }
    wx.setStorageSync("editCertificateObj", editCertificateObj);
    wx.navigateBack();
  },

  getNowFormatDate: function () {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
  },

  bindDateChange: function (e) {
    let that = this;
    let name = e.currentTarget.dataset.name;
    that.setData({
      [name]: e.detail.value
    })
  },

  /**
   * 将yyyy-mm-dd格式转为yyyy-mm
   */
  changDataFormat: function (time) {
    let str = "";
    let last = time.lastIndexOf("-");
    str = time.substring(0, last);
    return str;
  },

  DeleteItem: function () {
    let that = this;
    let language = that.data.language;
    wx.showModal({
      content: language.str5,
      showCancel: true,
      cancelText: language.str6,
      cancelColor: '#999999',
      confirmText: language.str7,
      confirmColor: '#16B38A',
      success(res) {
        if (res.confirm) {
          let {index,obj} = that.myData.editCertificateObj;
          wx.setStorageSync("editCertificateObj", {
            index: -2,
            obj: index
          });
          wx.navigateBack();
        } else if (res.cancel) {

        }
      }
    })
  }


})