var util = require('../../utils/util.js');
const app = getApp();
var timer = null;//函数防抖的时间
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nvabarData: {
      showCapsule: 0,
      title: '大小事'
    },
    topHeight: app.globalData.topHeight,
    language: {},
    isBottomRefreshing: false,
    hideLoad: true,
    total: -1,
    list: [],
    showGoTop: false
  },

  myData: {
    current: 1,
    size: 10,
    isRefreshing: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    this.setLanguage();
    wx.event.on("languageChanged", this, this.setLanguage);
    let language = that.data.language;
    wx.showLoading({
      title: language.str1
    })
    that.queryArticleList();
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
    let that = this;
    let isRefreshing = that.myData.isRefreshing;
    let language = that.data.language;
    if (isRefreshing == true) {
      return;
    }
    wx.showLoading({
      title: language.str1
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this;
    let isRefreshing = that.myData.isRefreshing;
    if (isRefreshing == true) {
      return;
    }
    this.pushMoreArticleList();
  },

  /**
   * 获取滚动条当前位置
   */
  onPageScroll: function (e) {
    let that = this;
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    timer = setTimeout(function () {
      let showGoTop = that.data.showGoTop;
      if (e.scrollTop > 400 && showGoTop == false) {
        that.setData({
          showGoTop: true
        });
      } else if (e.scrollTop < 400 && showGoTop == true) {
        that.setData({
          showGoTop: false
        });
      }
    }, 500)
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
      language: wx.T.getLanguage('recruitment'),
      ['nvabarData.title']: wx.T.getLanguage('recruitment').title
    });
    wx.setNavigationBarTitle({
      title: wx.T.getLanguage('recruitment').title 
    })
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
   * 跳转招日详情
   */
  linkToArticleDetail: function (event) {
    let id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/packageA/pages/articleDetail/articleDetail?id='+id
    })
  },

  /**
   * 查询招日列表
   */
  queryArticleList: function () {
    let that = this;
    util.request(wx.api.articleList, {
      articleType: 2, //0-大小事，2-招日，3-文青時刻
      current: that.myData.current,
      size: that.myData.size
    }, 'POST').then(function (res) {
      wx.stopPullDownRefresh();
      wx.hideLoading();

      let list = that.data.list;
      let dataList = res.records;
      let len = dataList.length;
      for (let i = 0; i < len; i++) {
        let a = dataList[i].gmtCreate.split(" ");
        dataList[i].timeStr = a[0];
        list.push(dataList[i])
      }
      let hideLoad = true;
      if (dataList.length == 0 || dataList.length < that.myData.size) {
        hideLoad = false;
      }
      that.myData.isRefreshing = false;

      that.setData({
        isBottomRefreshing: false,
        hideLoad: hideLoad,
        total: res.total,
        list: list
      })

    }).catch(function (res) {
      wx.stopPullDownRefresh();
      wx.hideLoading();
      util.showErrorToast('网络错误');
    })
  },

  /**
   * 加载更多招日列表
   */
  pushMoreArticleList: function () {
    let that = this;
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
      that.queryArticleList();
    }
  }





})