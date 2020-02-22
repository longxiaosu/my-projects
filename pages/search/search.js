var util = require('../../utils/util.js');
const app = getApp();
var timer = null;//函数防抖的时间
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nvabarData: {
      showCapsule: 1,
      title: '搜索职位'
    },
    topHeight: app.globalData.topHeight,
    language: {},
    showGoTop: false,//回到顶部按钮
    classIfy: 1,//1是显示职位结果2显示公司搜索结果
    searchName: '',//输入的搜索关键字
    showAdvice: true, //切换显示搜索提示或搜索结果
    historyResults: [],//历史记录
    hotList: [],//热门分类
    isBottomRefreshing: false,
    cisBottomRefreshing: false,
    hideLoad: true,
    chideLoad: true,
    total: -1,
    ctotal: -1,
    list: [],
    clist: []
  },

  myData: {
    current: 1,
    size: 15,
    ccurrent: 1,
    csize: 15
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    this.setLanguage();
    wx.event.on("languageChanged", this, this.setLanguage);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this;
    that.setHistoryList();
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
    let that = this;
    let classIfy = that.data.classIfy;
    if (classIfy == 1) {
      that.pushMoreJobs();
    }
    if (classIfy == 2) {
      that.pushMoreCompanies();
    }
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
      language: wx.T.getLanguage('search'),
      ['nvabarData.title']: wx.T.getLanguage('search').title
    });
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
   * 切换显示公司还是职位 
   */
  changeClassify: function (e) {
    let that = this;
    let id = e.currentTarget.dataset.id;
    that.setData({
      classIfy: id
    })
  },

  /**
   * 监听搜索栏输入
   */
  bindDataInput: function (e) {
    let that = this;
    let searchName = e.detail.value;
    if (searchName == "") {
      that.myData.current = 1;
      that.myData.ccurrent = 1;
      that.setData({
        searchName: searchName,
        showAdvice: true,
        total: -1,
        ctotal: -1,
        list: [],
        clist: [],
        isBottomRefreshing: false,
        hideLoad: true,
        cisBottomRefreshing: false,
        chideLoad: true
      })
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 500
      })
    } else {
      that.setData({
        searchName: searchName
      })
    }
  },

  /**
   * 清空搜索栏内容
   */
  cleanSearchInput: function () {
    let that = this;
    let searchName = '';
    that.myData.current = 1;
    that.myData.ccurrent = 1;
    that.setData({
      searchName: searchName,
      showAdvice: true,
      total: -1,
      ctotal: -1,
      list: [],
      clist: [],
      isBottomRefreshing: false,
      hideLoad: true,
      cisBottomRefreshing: false,
      chideLoad: true
    })
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 500
    })
  },

  /**
   * 点击搜索 
   */
  searchJob: function (e) {
    let that = this;
    let language = that.data.language;
    let name = e.currentTarget.dataset.name;//点击分类名称
    if (name != undefined) {
      that.setData({
        searchName: name
      })
    }
    if (that.data.searchName == "") {
      util.showTips(language.str1);
      return;
    }
    wx.showLoading({
      title: language.str2,
      mask: true
    })
    let historyList = that.addHistory();
    that.myData.current = 1;
    that.myData.ccurrent = 1;
    that.setData({
      classIfy: 1,
      showAdvice: false,
      historyResults: historyList,
      total: -1,
      ctotal: -1,
      list: [],
      clist: [],
      isBottomRefreshing: false,
      hideLoad: true,
      cisBottomRefreshing: false,
      chideLoad: true
    })
    that.queryJobs();
    that.queryCompanies();
  },

  /**
   * 添加历史搜索记录
   */
  addHistory: function () {
    let that = this;
    let historyList = wx.getStorageSync('historyList');
    if (historyList == '' || historyList == null) {
      historyList = [];
    }
    historyList.unshift(that.data.searchName)
    historyList = that.unique(historyList)
    for (let index in historyList) {
      if (index > 10) {
        historyList.splice(index, 1)
      }
    }
    wx.setStorageSync('historyList', historyList)
    return historyList;//返回新的历史搜索记录
  },

  /**
   * 数组去除重复内容 
   */
  unique: function (array) {
    return array.filter(function (el, index, arr) {
      return index == arr.indexOf(el);
    });
  },

  /**
   * 读取历史搜索记录和热门搜索
   */
  setHistoryList: function () {
    let that = this;
    let hotList = wx.getStorageSync('jobTypesArray');
    if (hotList == '' || hotList == null) {
      hotList = [];
    }
    let historyList = wx.getStorageSync('historyList');
    if (historyList == '' || historyList == null) {
      historyList = [];
    }
    wx.setStorageSync('historyList', historyList)
    that.setData({
      hotList: hotList,
      historyResults: historyList
    })
  },

  /**
   * 清空历史搜索记录
   */
  deleteHistory: function () {
    let that = this;
    let language = that.data.language;
    wx.showModal({
      title: language.str3,
      content: language.str4,
      confirmColor: '#2DC998',
      success(res) {
        if (res.confirm) {
          that.setData({
            historyResults: []
          })
          wx.setStorageSync('historyList', [])
        } else if (res.cancel) { }
      }
    })
  },

  /**
   * 查询职位
   */
  queryJobs: function () {
    let that = this;
    let language = that.data.language;
    let hotList = that.data.hotList;
    let searchName = that.data.searchName;
    let jobType = '';
    for (let i in hotList) {
      if (hotList[i].name == searchName) {
        jobType = hotList[i].id;
      }
    }
    util.request(wx.api.queryJobs, {
      current: that.myData.current,
      size: that.myData.size,
      careerType: "", //工作性质
      queryParam: searchName, //搜索关键字
      jobType: jobType, //工作行业分类
      queryType: 1,//排序方式
      salaryType: "" //薪资范围
    }, 'POST').then(function (res) {
      wx.hideLoading();
      if (res.success == true) {
        let list = that.data.list;
        let dataList = res.result.records;
        let len = dataList.length;
        for (let i = 0; i < len; i++) {
          let salaryText = language.str5;
          if (dataList[i].isFace == 1) {
            //如果是面议
          } else if (dataList[i].salaryMaximum != null && dataList[i].salaryMinimum != null && dataList[i].salaryMaximum >= 1000 && dataList[i].salaryMinimum >= 1000) {
            //不是面议,将工资转化为K显示
            let wage1 = that.formatWage(dataList[i].salaryMinimum);
            let wage2 = that.formatWage(dataList[i].salaryMaximum);
            salaryText = 'MOP $' + wage1 + '-' + wage2;
          } else if (dataList[i].salaryMaximum != null && dataList[i].salaryMinimum != null) {
            salaryText = 'MOP $' + dataList[i].salaryMaximum;
          }
          dataList[i].salaryText = salaryText;
          list.push(dataList[i])
        }
        let hideLoad = true;
        if (dataList.length == 0 || dataList.length < that.myData.size) {
          hideLoad = false;
        }

        that.setData({
          isBottomRefreshing: false,
          hideLoad: hideLoad,
          total: res.result.total,
          list: list
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
   * 将数字后面加K显示
   */
  formatWage: function (num, addK = 1) {
    let numStr = num / 1000;
    if (numStr > 1) {
      numStr = Math.round(numStr * 10) / 10; //保留1位小数,不足1位不补零
      if (addK == 1) {
        numStr = numStr + "K";
      } else {
      }
    } else {
      //小于1千就保留原来的数
      numStr = num;
    }
    return numStr;
  },

  /**
   * 加载更多职位
   */
  pushMoreJobs: function () {
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
      that.queryJobs();
    }
  },

  /**
   * 查询公司
   */
  queryCompanies: function () {
    let that = this;
    let searchName = that.data.searchName;
    util.request(wx.api.queryCompanies, {
      current: that.myData.ccurrent,
      size: that.myData.csize,
      companyName: searchName //搜索关键字
    }, 'POST').then(function (res) {
      wx.hideLoading();
      let list = that.data.clist;
      let dataList = res.records;
      let len = dataList.length;
      for (let i = 0; i < len; i++) {
        list.push(dataList[i])
      }
      let hideLoad = true;
      if (dataList.length == 0 || dataList.length < that.myData.csize) {
        hideLoad = false;
      }

      that.setData({
        cisBottomRefreshing: false,
        chideLoad: hideLoad,
        ctotal: res.total,
        clist: list
      })
    }).catch(function (res) {
      wx.hideLoading();
      util.showErrorToast('网络错误');
    })
  },

  /**
   * 加载更多公司
   */
  pushMoreCompanies: function () {
    let that = this;
    if (that.data.cisBottomRefreshing == true || that.data.ctotal <= 0) {
      return;
    }
    let c = that.myData.ccurrent;
    let size = that.myData.csize;
    let total = that.data.ctotal;
    if (total >= (c * size - size)) {
      c += 1;
      that.myData.ccurrent = c;
      that.setData({
        chideLoad: true,
        cisBottomRefreshing: true
      })
      that.queryCompanies();
    }
  }



})