var util = require('../../../utils/util.js');
var tool = require('../../../utils/public.js');
const pageManager = require('../../../utils/pageManager');
const app = getApp();
var timer = null;//函数防抖的时间
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nvabarData: {
      showCapsule: 1,
      title: '公司详情'
    },
    topHeight: app.globalData.topHeight,
    showGoTop: false,//回到顶部按钮
    language: {},
    detail:null,//公司详情
    teststr:'麥肯公司秉持著信、義、誠、敬四字箴言的企業理念，堅守每個承諾及不負企業所託，協助澳門本地各行業及人資部門建立最佳的營運團隊及專才，提昇傳統人資的作業性角色，成為事業主不可或缺的策略性夥伴。而在人才的供應端，臥龍也為求職者搭起一座長橋，通往安身、立命的企業寶塔。麥肯將不斷追求卓越，持續成為企業最有價值之策略夥伴。從累積十幾年的全球優秀人才資料庫中，透過臥麥肯特且精準的媒合系統，並輔以嚴謹篩選流程，搜尋最適任人選，力求在第一時間就能滿足人才端的下階段黃金職涯需求。',
    webContent:'<strong>店舖遍佈世界</strong>↵我們於91個市場內擁有超過7,000間店舖。不論你想選哪種風格的衣服，家飾用品，慶祝特殊節日或場合，Inditex都一應俱全。'
  },

  myData: {
    companyId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    this.setLanguage();
    wx.event.on("languageChanged", this, this.setLanguage);
    if (options.id) {
      console.log(options.id)
      that.myData.companyId = options.id;
      that.preLoadData();
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
    let that = this;
    let language = that.data.language;
    let detail = that.data.detail;
    let shareStr = '?url=company&id=' + detail.companyId;
    let title = detail.chineseName + language.str3;
    return {
      title: title,
      path: 'pages/index/index' + shareStr
    }
  },

  /**
   * 加载语言
   */
  setLanguage() {
    this.setData({
      language: wx.T.getLanguage('company'),
      ['nvabarData.title']: wx.T.getLanguage('company').title
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
      mask:true
    })
    let companyDetail = pageManager.getData('companyDetail');
    if (companyDetail) {
      //如果在上一页有预加载
      let resData = companyDetail.then(
        function (res) {
          that.processData(res);
        },
        function () {
          wx.hideLoading();
          util.showErrorToast('网络错误');
        }
      )
      pageManager.removeData('companyDetail');
    } else {
      //没有预加载
      let userId = '';
      let userInfo = wx.getStorageSync("userInfo");
      if (userInfo != '' && userInfo != null) {
        userId = userInfo.userInfo.userId;
      }
      util.request(wx.api.queryCompany, {
        companyId: that.myData.companyId,
        userId: userId
      }, 'GET').then(function (res) {
        that.processData(res);
      }).catch(function (res) {
        wx.hideLoading();
        util.showErrorToast('网络错误');
      })
    }
  },

  /**
   * 处理ajax返回的数据
   */
  processData: function (res) {
    let that = this;
    wx.hideLoading();
    let language = that.data.language;
    if (res.success == true) {
      let detail = res.result;
      detail.logo = detail.logo == null?'https://www.lgstatic.com/thumbnail_120x120/images/logo_default.png':detail.logo;
      let jobs = detail.jobs;//转换相似工作的薪资显示
      for (let i in jobs) {
        let salaryStr = language.str2;//薪资面议
        if (jobs[i].isFace == 1) {
          //如果是面议
        } else if (jobs[i].salaryMaximum != null && jobs[i].salaryMinimum != null && jobs[i].salaryMaximum >= 1000 && jobs[i].salaryMinimum >= 1000) {
          //不是面议,将工资转化为K显示
          let wage1 = that.formatWage(jobs[i].salaryMinimum);
          let wage2 = that.formatWage(jobs[i].salaryMaximum);
          salaryStr = 'MOP $' + wage1 + '-' + wage2;
        } else if (jobs[i].salaryMaximum != null && jobs[i].salaryMinimum != null) {
          salaryStr = 'MOP $' + jobs[i].salaryMaximum;
        }
        jobs[i].salaryStr = salaryStr;
      }
      detail.jobs = jobs;

      that.setData({
        detail: detail
      }, () => {
        wx.hideLoading();
      })

    } else {
      wx.hideLoading();
      util.linkToBack(res.errmsg);
    }


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

  linkToJobDetail: function (e) {
    let id = e.currentTarget.dataset.id;
    tool.preQueryJobDetail(id, 'jobDetail');
    wx.navigateTo({
      url: '/packageA/pages/jobDetail/jobDetail?id=' + id
    })
  }





})