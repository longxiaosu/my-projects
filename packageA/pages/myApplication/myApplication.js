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
    that.preLoadData();

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
    wx.stopPullDownRefresh();
    this.pullDown();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.pushMoreMsgDetail();
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
      language: wx.T.getLanguage('myApplication'),
      ['nvabarData.title']: wx.T.getLanguage('myApplication').title
    });

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
    let queryApplies = pageManager.getData('queryApplies');
    if (queryApplies) {
      //如果在上一页有预加载
      let resData = queryApplies.then(
        function (res) {
          that.processData(res);
        },
        function () {
          wx.hideLoading();
          util.linkToBack('网络错误');
        }
      )
      pageManager.removeData('queryApplies');
    } else {
      that.queryApplies();
    }
  },

  /**
   * 处理ajax返回的数据
   */
  processData: function (res) {
    let that = this;
    let language = that.data.language;
    that.myData.isRefreshing = false;
    if (res.success == true) {
      let list = res.result.records;
      let myList = that.data.list;
      for (let i in list) {
        list[i].applyStatusDesc = that.handleStatusDesc(list[i].applyStatus);
        myList.push(list[i]);
      }

      let hideLoad = true;
      if (list.length == 0 || list.length < that.myData.size) {
        hideLoad = false;
      }

      that.setData({
        isBottomRefreshing: false,
        hideLoad: hideLoad,
        total: res.result.total,
        list: myList
      }, () => {
        wx.hideLoading();
      })

    } else {
      wx.hideLoading();
      util.linkToBack(res.errmsg);
    }


  },

  /**
   * 查询工作申请列表
   */
  queryApplies: function () {
    let that = this;
    util.request(wx.api.queryApplies, {
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
      that.queryApplies();
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
      that.queryApplies();
    }, 500)
  },

  //返回对应的状态字符串
  handleStatusDesc(val) {
    let that = this;
    let language = that.data.language;
    let desc = '';
    if (val == 0) {
      desc = language.str8;
    }
    if (val == 1) {
      desc = language.str9;
    }
    if (val == 2) {
      desc = language.str10;
    }
    if (val == 3) {
      desc = language.str11;
    }
    if (val == 4) {
      desc = language.str12;
    }
    if (val == 5) {
      desc = language.str13;
    }
    if (val == 6) {
      desc = language.str14;
    }
    if (val == 7) {
      desc = language.str15;
    }
    if (val == 8) {
      desc = language.str16;
    }
    return desc;
  },

  /**
   * 用户接受邀请
   */
  acceptApply(e) {
    let that = this;
    let language = that.data.language
    let index = e.currentTarget.dataset.index;
    let list = that.data.list
    let item = list[index];
    let tips = language.str20 + item.companyName + language.str21;
    wx.showModal({
      content: tips,
      showCancel: true,
      cancelText: language.str23,
      cancelColor: '#999999',
      confirmText: language.str22,
      confirmColor: '#16B38A',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: language.str1,
            mask: true
          })
          util.request(wx.api.acceptApply, {
            applyId: item.applyId
          }, 'GET').then(function (res) {
            wx.hideLoading();
            if (res.success == true) {
              util.showTips(language.str18, 'success');
              //修改状态
              let statusDesc = that.handleStatusDesc(4);
              that.setData({
                ['list[' + index + '].applyStatus']: 4,
                ['list[' + index + '].applyStatusDesc']: statusDesc
              })
            } else {
              util.showTips(res.message);
            }
          }).catch(function (res) {
            wx.hideLoading();
            util.showErrorToast('网络错误');
          })
        }
      }
    })
  },

  /**
   * 用户拒绝邀请
   */
  refuseApply(e) {
    let that = this;
    let language = that.data.language
    let index = e.currentTarget.dataset.index;
    let list = that.data.list
    let item = list[index];
    let tips = language.str24 + item.companyName + language.str21;
    wx.showModal({
      content: tips,
      showCancel: true,
      cancelText: language.str23,
      cancelColor: '#999999',
      confirmText: language.str22,
      confirmColor: '#16B38A',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: language.str1,
            mask: true
          })
          util.request(wx.api.rejectApply, {
            applyId: item.applyId
          }, 'GET').then(function (res) {
            wx.hideLoading();
            if (res.success == true) {
              util.showTips(language.str19, 'success');
              //修改状态
              let statusDesc = that.handleStatusDesc(8);
              that.setData({
                ['list[' + index + '].applyStatus']: 8,
                ['list[' + index + '].applyStatusDesc']: statusDesc
              })
            } else {
              util.showTips(res.message);
            }
          }).catch(function (res) {
            wx.hideLoading();
            util.showErrorToast('网络错误');
          })
        }
      }
    })
  },

  /**
   * 用户撤回申请
   */
  cancelApply(e) {
    let that = this;
    let language = that.data.language
    let index = e.currentTarget.dataset.index;
    let list = that.data.list
    let item = list[index];
    let tips = language.str25 + item.jobTitle + language.str26;
    wx.showModal({
      content: tips,
      showCancel: true,
      cancelText: language.str23,
      cancelColor: '#999999',
      confirmText: language.str22,
      confirmColor: '#16B38A',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: language.str1,
            mask: true
          })
          util.request(wx.api.cancelApply, {
            applyId: item.applyId
          }, 'GET').then(function (res) {
            wx.hideLoading();
            if (res.success == true) {
              util.showTips(language.str17, 'success');
              //修改状态
              let statusDesc = that.handleStatusDesc(2);
              that.setData({
                ['list[' + index + '].applyStatus']: 2,
                ['list[' + index + '].applyStatusDesc']: statusDesc
              })
            } else {
              util.showTips(res.message);
            }
          }).catch(function (res) {
            wx.hideLoading();
            util.showErrorToast('网络错误');
          })
        }
      }
    })
  },

  /**
   * 跳转到职位详情
   */
  linkToJobDetail: function (e) {
    let that = this;
    let id = e.currentTarget.dataset.id;
    tool.preQueryJobDetail(id, 'jobDetail');
    wx.navigateTo({
      url: '/packageA/pages/jobDetail/jobDetail?id=' + id
    })
  }




})