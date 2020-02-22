var util = require('../../utils/util.js');
var tool = require('../../utils/public.js');
const app = getApp();
var timer = null;//函数防抖的时间
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nvabarData: {
      showCapsule: 0,
      title: '首页'
    },
    topHeight: app.globalData.topHeight,
    winHeight: app.globalData.winHeight,
    calc: app.globalData.calc,
    language: {},
    showScreenBar: false,
    screenBarType: 1,//条件搜索栏1工作分类2其他要求
    isBottomRefreshing: false,
    hideLoad: true,
    total: -1,
    showGoTop: false,//回到顶部按钮
    jobTypes: [], //工作分类选项
    salaryRanges: [], //薪资范围选项
    queryParam: "", //搜索栏输入关键字查询，职位公司或地点
    jobTypeName: "全部",
    jobTypeId: 0, //工作分类选项查询，0不限
    sortType: 0, //排序方式,0热门1最新
    salaryType: 0, //月薪范围,0不限
    careerType: 0, //工作性质查询条件，0不限1全2兼
    optionsData: {//用来放在选项内显示
      jobTypeId: 0, //工作分类选项查询，0不限
      sortType: 0, //排序方式,0热门1最新
      salaryType: 0, //月薪范围,0不限
      careerType: 0 //工作性质查询条件，0不限1全2兼
    },
    list: [],
    showPage: 1//控制真假显示，0假1真
  },

  myData: {
    current: 1,
    size: 15,
    isRefreshing: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    tool.checkOptions(options);//检查首页跳转参数
    that.setLanguage();
    wx.event.on("languageChanged", this, this.setLanguage);
    that.loadPreQuery();
    wx.getSystemInfo({
      success: (res) => {
        let isIphoneX = false;
        if (res.statusBarHeight >= 44) {
          isIphoneX = true;
        }
        let statusBarHeight = res.statusBarHeight; //顶部高度,单位PX
        let clientHeight = res.windowHeight, //下方区域高度,单位PX
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        let calc = clientHeight * rpxR; //计算scroll-view高度需要
        let topHeight = isIphoneX ? statusBarHeight * 2 : statusBarHeight * 2 + 25;
        let winHeight = calc - topHeight * rpxR;
        that.setData({
          topHeight: topHeight,
          winHeight: winHeight,
          calc: calc
        })
      }
    })
    // wx.hideTabBar();
    // wx.setTabBarItem({
    //   index:0,
    //   text: '查询'
    // })
    // that.querySwitch();
    
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
    let that = this;
    if (that.data.list.length == 0) {
      let language = that.data.language;
      wx.showLoading({
        title: language.str5,
        mask: true
      })
      that.queryJobs();
    }


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
      title: language.str5,
      mask: true
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
      that.queryJobs();
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
    that.pushMoreJobs();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {


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
   * 加载语言
   */
  setLanguage() {
    this.setData({
      language: wx.T.getLanguage('index'),
      ['nvabarData.title']: wx.T.getLanguage('index').title
    });
  },

  /**
   * 跳转到搜索页面
   */
  linkToSearch() {
    wx.navigateTo({
      url: '/pages/search/search'
    })
  },

  /**
   * 加载基础选项信息
   */
  loadPreQuery: function () {
    let that = this;
    let language = that.data.language;
    let jobTypeId = that.data.jobTypeId;
    let jobTypeName = language.str2;
    util.request(wx.api.loadPreQuery, {}, 'GET').then(function (res) {
      wx.hideLoading();
      if (res.success == true) {
        let resData = res.result;
        wx.setStorageSync('jobTypesArray', resData.jobTypes);
        resData.jobTypes.unshift({
          englishName: "all",
          id: 0,
          name: language.str2
        });
        resData.salaryRanges.unshift({
          name: language.str6,
          type: 0
        });
        for (let i in resData.jobTypes) {
          if (resData.jobTypes[i].id == jobTypeId) {
            jobTypeName = resData.jobTypes[i].name;
          }
        }
        that.setData({
          jobTypeName: jobTypeName,
          jobTypes: resData.jobTypes,
          salaryRanges: resData.salaryRanges
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
   * 查询职位
   */
  queryJobs: function () {
    let that = this;
    let language = that.data.language;
    util.request(wx.api.queryJobs, {
      current: that.myData.current,
      size: that.myData.size,
      careerType: that.data.careerType == 0 ? "" : that.data.careerType, //工作性质
      queryParam: that.data.queryParam, //搜索关键字
      jobType: that.data.jobTypeId == 0 ? "" : that.data.jobTypeId, //工作行业分类
      queryType: that.data.sortType,//排序方式
      salaryType: that.data.salaryType == 0 ? "" : that.data.salaryType //薪资范围
    }, 'POST').then(function (res) {
      wx.stopPullDownRefresh();
      wx.hideLoading();
      if (res.success == true) {
        let list = that.data.list;
        let dataList = res.result.records;
        let len = dataList.length;
        for (let i = 0; i < len; i++) {
          let salaryText = language.str19;
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
        that.myData.isRefreshing = false;

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
      wx.stopPullDownRefresh();
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

  changeScreenBar: function (e) {
    let that = this;
    let id = e.currentTarget.dataset.id;
    let showScreenBar = that.data.showScreenBar;
    let screenBarType = that.data.screenBarType;//条件搜索栏1工作分类2其他要求
    if (showScreenBar == false) {
      let optionsData = {
        jobTypeId: that.data.jobTypeId,
        sortType: that.data.sortType,
        salaryType: that.data.salaryType,
        careerType: that.data.careerType
      }
      that.setData({
        optionsData: optionsData
      })
    }

    if (id == 1) {
      if (screenBarType == 1) {
        that.setData({
          showScreenBar: !showScreenBar
        })
      } else {
        that.setData({
          screenBarType: 1,
          showScreenBar: true
        })
      }
    }
    if (id == 2) {
      if (screenBarType == 2) {
        that.setData({
          showScreenBar: !showScreenBar
        })
      } else {
        that.setData({
          screenBarType: 2,
          showScreenBar: true
        })
      }
    }
  },

  /**
   * 阻止默认滚动事件
   */
  preSlide: function () {
    return;
  },

  closeScreenBar: function () {
    let that = this;
    that.setData({
      showScreenBar: false
    })
  },

  /**
   * 点击筛选栏的选项
   */
  changeOptionsData: function (e) {
    let that = this;
    let language = that.data.language;
    let name = e.currentTarget.dataset.name;
    let type = e.currentTarget.dataset.type;
    let updataStr = 'optionsData.' + name;
    if (name == 'jobTypeId') {
      //如果点击的是工作分类选项，就直接刷新
      let jobTypes = that.data.jobTypes;
      let jobTypeName = that.data.jobTypeName;
      for (let i in jobTypes) {
        if (jobTypes[i].id == type) {
          jobTypeName = jobTypes[i].name;
        }
      }
      that.setData({
        [updataStr]: type,
        jobTypeName: jobTypeName,
        showScreenBar: false,
        jobTypeId: type,
        isBottomRefreshing: false,
        hideLoad: true,
        list: [],
        total: -1
      })
      //刷新工作列表
      wx.showLoading({
        title: language.str5,
        mask: true
      })
      that.myData.current = 1;
      that.myData.isRefreshing = true;
      that.queryJobs();
    } else {
      that.setData({
        [updataStr]: type
      })
    }
  },

  /**
   * 将要求栏选项清空
   */
  setOptionsDefault: function () {
    let that = this;
    let optionsData = that.data.optionsData;
    optionsData.sortType = 0;
    optionsData.salaryType = 0;
    optionsData.careerType = 0;
    that.setData({
      optionsData: optionsData
    })
  },

  /**
   * 点击确定条件查询职位
   */
  searchOptions: function () {
    let that = this;
    let language = that.data.language;
    let { jobTypeId, sortType, salaryType, careerType } = that.data.optionsData;
    that.setData({
      jobTypeId: jobTypeId,
      sortType: sortType,
      salaryType: salaryType,
      careerType: careerType,
      showScreenBar: false,
      isBottomRefreshing: false,
      hideLoad: true,
      list: [],
      total: -1
    })
    //刷新工作列表
    wx.showLoading({
      title: language.str5,
      mask: true
    })
    that.myData.current = 1;
    that.myData.isRefreshing = true;
    that.queryJobs();
  },

  /**
   * 真假
   */
  querySwitch: function () {
    let that = this;
    let language = that.data.language;
    wx.showLoading({
      title: language.str5,
      mask: true
    })
    util.request(wx.api.querySwitch, {}, 'GET').then(function (res) {
      wx.hideLoading();
      if(res.result == 0){
        that.setData({
          showPage: 0
        })
      }else{
        that.setData({
          showPage: res.result
        })
        wx.showTabBar();
        wx.setTabBarItem({
          index:0,
          text: '職位'
        })
      }
    }).catch(function (res) {
      wx.hideLoading();
      util.showErrorToast('网络错误');
    })
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
      util.showTips('帐号不能为空');
      return;
    }

    if (passWord == '' || passWord == null) {
      util.showTips('密码不能为空');
      return;
    }
    wx.showLoading({
      title: language.str5,
      mask: true
    })
    setTimeout(function(){
      wx.hideLoading();
      if(account=='123456'&&passWord =='123456'){
        wx.navigateTo({
          url: '/pages/recruit/recruitment'
        })
      }else{
        util.showTips('您的帐号尚未加入FFJ');
      }
    },1500)

  }






})



