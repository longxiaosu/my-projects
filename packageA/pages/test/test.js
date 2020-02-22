var util = require('../../../utils/util.js');
var tool = require('../../../utils/public.js');
const pageManager = require('../../../utils/pageManager');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nvabarData: {
      showCapsule: 1,
      title: '投递记录'
    },
    topHeight: app.globalData.topHeight,
    language: {},
    isBottomRefreshing: false,
    hideLoad: true,
    total: -1,
    list: []
  },

  myData: {
    userInfo: null,
    current: 1,
    size: 20,
    isRefreshing: false
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
   * 加载语言
   */
  setLanguage() {
    this.setData({
      language: wx.T.getLanguage('chatDetail'),
    });
    wx.setNavigationBarTitle({
      title: wx.T.getLanguage('chatDetail').title
    })
  },

  /**
   * 读取上一页预请求的数据
   */
  preLoadData: function () {
    let that = this;
    let language = that.data.language;
    wx.showLoading({
      title: language.str1,
      mask: true
    })
    let chatMsgDetail = pageManager.getData('chatMsgDetail');
    if (chatMsgDetail) {
      //如果在上一页有预加载
      let resData = chatMsgDetail.then(
        function (res) {
          that.processData(res);
        },
        function () {
          wx.hideLoading();
          util.linkToBack('网络错误');
        }
      )
      pageManager.removeData('chatMsgDetail');
    } else {
      that.queryChatMsgDetail();
    }
  },

  /**
   * 处理ajax返回的数据
   */
  processData: function (res) {
    let that = this;
    let language = that.data.language;
    that.myData.isRefreshing =  false;
    if (res.success == true) {
      let list = res.result.page.records;
      let chatMsgsDetail = that.data.list;

      let hideLoad = true;
      if (list.length == 0 || list.length < that.myData.size) {
        hideLoad = false;
      }

      that.setData({
        isBottomRefreshing: false,
        hideLoad: hideLoad,
        total: res.result.page.total,
        list: chatMsgsDetail
      }, () => {
        wx.hideLoading();
      })

    } else {
      wx.hideLoading();
      util.linkToBack(res.errmsg);
    }


  },

  /**
   * 查询工作申请
   */
  queryChatMsgDetail: function () {
    let that = this;
    util.request(wx.api.queryChatMsgDetail, {
      current: that.myData.current,
      size: that.myData.size,
    }, 'POST').then(function (res) {
      that.processData(res);
    }).catch(function (res) {
      wx.hideLoading();
      util.showErrorToast('网络错误');
    })
  },

  /**
   * 加载更多工作申请记录
   */
  pushMoreMsgDetail: function () {
    let that = this;
    console.log('更多')
    if (that.data.isBottomRefreshing == true || that.data.total <= 0) {
      return;
    }
    let c = that.myData.current;
    let size = that.myData.size;
    let total = that.data.total;
    if (total >= (c * size - size)) {
      c += 1;
      that.myData.current = c;
      that.setData({
        hideLoad: true,
        isBottomRefreshing: true
      })
      that.queryChatMsgDetail();
    }
  },

  /**
   * 下拉
   */
  pullDown: function () {
    let that = this;
    let isRefreshing = that.myData.isRefreshing;
    let language = that.data.language;
    if (isRefreshing == true) {
      return;
    }
    wx.showLoading({
      title: '加载中'
    })
    that.myData.current = 1;
    that.myData.isRefreshing = true;
    that.setData({
      isBottomRefreshing: false,
      hideLoad: true,
      list: [],
      total: -1
    })
    setTimeout(function () {
      that.queryArticleList();
    }, 500)
  }




})