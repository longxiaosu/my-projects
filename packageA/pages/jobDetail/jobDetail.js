var util = require('../../../utils/util.js');
var tool = require('../../../utils/public.js');
const easyCanvas = require('../../../easyCanvas/easyCanvas.js');
const pageManager = require('../../../utils/pageManager');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nvabarData: {
      showCapsule: 1,
      title: '职位详情'
    },
    topHeight: app.globalData.topHeight,
    language: {},
    loginShow: false,//登陆弹窗显示
    applyShow: false,//申请工作弹窗显示
    msgShow: false,//发送消息弹窗显示
    shareShow: false,//分享组件显示
    shareImgShow: false, //是否显示生成完成的分享图
    shareImg: '',//生成的图片本地路径
    resumeOptions: [],//用户的简历
    jobDetail: null
  },

  myData: {
    jobId: '',
    qrCode: 'https://weapp.lagou.com/api/weapp-code/71452551344286/image/logo.png'//分享二维码
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    this.setLanguage();
    wx.event.on("languageChanged", this, this.setLanguage);
    if (options.id) {
      that.myData.jobId = options.id;
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    let that = this;
    let language = that.data.language;
    let jobDetail = that.data.jobDetail;
    let shareStr = '?url=jobDetail&id=' + jobDetail.jobId;
    let title = jobDetail.companyName + ' ' + language.str16 + ' ' + jobDetail.jobTitle;
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
      language: wx.T.getLanguage('jobDetail'),
      ['nvabarData.title']: wx.T.getLanguage('jobDetail').title
    });
  },

  /**
   * 保存formId
   */
  shareSubmit: function (e) {
    let temp = wx.getStorageSync("userInfo");
    let formId = e.detail.formId;
    if (temp == "" || temp == undefined) { } else {
      if (formId == 'the formId is a mock one' || formId == undefined) { } else {
        util.dealFormIds(formId);
      }
    }
  },

  /**
   * 读取上一页预请求的数据
   */
  preLoadData: function () {
    let that = this;
    let language = that.data.language;
    wx.showLoading({
      title: language.str14,
      mask: true
    })
    let jobDetail = pageManager.getData('jobDetail');
    if (jobDetail) {
      //如果在上一页有预加载
      let resData = jobDetail.then(
        function (res) {
          that.processData(res);
        },
        function () {
          wx.hideLoading();
          util.showErrorToast('网络错误');
        }
      )
      pageManager.removeData('jobDetail');
    } else {
      //没有预加载
      let userId = '';
      let userInfo = wx.getStorageSync("userInfo");
      if (userInfo != '' && userInfo != null) {
        userId = userInfo.userInfo.userId;
      }
      util.request(wx.api.queryJobDetail, {
        jobId: that.myData.jobId,
        userId: userId,
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
    let language = that.data.language;
    if (res.success == true) {
      let detail = res.result;
      let salaryStr = language.str11;//薪资面议
      if (detail.isFace == 1) {
        //如果是面议
      } else if (detail.salaryMaximum != null && detail.salaryMinimum != null && detail.salaryMaximum >= 1000 && detail.salaryMinimum >= 1000) {
        //不是面议,将工资转化为K显示
        let wage1 = that.formatWage(detail.salaryMinimum);
        let wage2 = that.formatWage(detail.salaryMaximum);
        salaryStr = 'MOP $' + wage1 + '-' + wage2;
      } else if (detail.salaryMaximum != null && detail.salaryMinimum != null) {
        salaryStr = 'MOP $' + detail.salaryMaximum;
      }
      detail.salaryStr = salaryStr;

      let relevantWorks = detail.relevantWorks;//转换相似工作的薪资显示
      for (let i in relevantWorks) {
        let salaryStr = language.str11;//薪资面议
        if (relevantWorks[i].isFace == 1) {
          //如果是面议
        } else if (relevantWorks[i].salaryMaximum != null && relevantWorks[i].salaryMinimum != null && relevantWorks[i].salaryMaximum >= 1000 && relevantWorks[i].salaryMinimum >= 1000) {
          //不是面议,将工资转化为K显示
          let wage1 = that.formatWage(relevantWorks[i].salaryMinimum);
          let wage2 = that.formatWage(relevantWorks[i].salaryMaximum);
          salaryStr = wage1 + '-' + wage2;
        } else if (relevantWorks[i].salaryMaximum != null && relevantWorks[i].salaryMinimum != null) {
          salaryStr = 'MOP $' + relevantWorks[i].salaryMaximum;
        }
        relevantWorks[i].salaryStr = salaryStr;
      }
      detail.relevantWorks = relevantWorks;

      that.setData({
        jobDetail: detail
      }, () => {
        wx.hideLoading();
        let checkCompleteResume = that.checkCompleteResume();
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

  /**
   * 检查用户是否已经登录和填写了简历
   */
  checkCompleteResume: function () {
    let that = this;
    let userInfo = wx.getStorageSync('userInfo');
    let result = true;
    if (userInfo == '' || userInfo == null) {
      that.setData({
        loginShow: true
      })
      result = false;
    } else {
      //如果已经登录，检查是否完成了简历
      if (userInfo.completeResume == false) {
        //提示用户去完成简历
        wx.showModal({
          content: language.str1,
          showCancel: true,
          cancelText: language.str2,
          cancelColor: '#999999',
          confirmText: language.str3,
          confirmColor: '#16B38A',
          success(res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '/packageA/pages/resume/resume'
              })
            }
          }
        })
        result = false;
      }
    }
    return result;
  },

  /**
 * 关闭登录弹窗
 */
  closeLogin: function (e) {
    let that = this;
    that.setData({
      loginShow: false
    })
    let success = e.detail.success;
    if (success == true) {//登录完成
      let userInfo = wx.getStorageSync("userInfo");
      if (userInfo == "" || userInfo == undefined) {
      } else {
        //登陆完成后，重新读取一次当前工作，判断是否已经申请过
        that.preLoadData();
      }
    }
  },

  linkToJobDetail: function (e) {
    let id = e.currentTarget.dataset.id;
    tool.preQueryJobDetail(id, 'jobDetail');
    wx.navigateTo({
      url: '/packageA/pages/jobDetail/jobDetail?id=' + id
    })
  },

  /**
   * 跳转到公司主页
   */
  linkToCompanyDetail: function () {
    let that = this;
    let isReal = that.data.jobDetail.isReal;
    if (isReal == 1) {
      let id = that.data.jobDetail.companyId;
      tool.preQueryCompany(id, 'companyDetail');
      wx.navigateTo({
        url: '/packageA/pages/company/company?id=' + id
      })
    }
  },

  /**
   * 打开申请工作的弹窗
   */
  openApplyJob: function () {
    let that = this;
    let language = that.data.language;
    let checkCompleteResume = that.checkCompleteResume();
    if (checkCompleteResume == false) {
      return;
    }
    wx.showLoading({
      title: language.str14,
      mask: true
    })
    util.request(wx.api.queryUserResume, {
      jobId: that.myData.jobId
    }, 'GET').then(function (res) {
      wx.hideLoading();
      if (res.success == true) {
        let resData = res.result;
        if (resData.length == 0) {
          //当前用户一个简历都没有
          //提示用户去完成简历
          wx.showModal({
            content: language.str1,
            showCancel: true,
            cancelText: language.str2,
            cancelColor: '#999999',
            confirmText: language.str3,
            confirmColor: '#16B38A',
            success(res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '/packageA/pages/resume/resume'
                })
              }
            }
          })
        } else {
          that.setData({
            applyShow: true,
            resumeOptions: resData
          })
        }
      } else {
        util.showTips(res.message);
      }
    }).catch(function (res) {
      wx.hideLoading();
      util.showErrorToast('网络错误');
    })
  },

  /**
   * 关闭申请工作的弹窗
   */
  closeApplyJob: function (e) {
    let that = this;
    that.setData({
      applyShow: false
    })
    let success = e.detail.success;
    if (success == true) {//申请完成,将当前工作的状态改为已申请
      that.setData({
        ['jobDetail.userInfo']: { hasApply: true }
      })
    }
  },

  /**
   * 打开发送消息弹窗
   */
  openMsgShow: function() {
    let that = this;
    let checkCompleteResume = that.checkCompleteResume();
    if (checkCompleteResume == false) {
      return;
    }
    that.setData({
      msgShow: true
    })
  },
  
  /**
   * 关闭发送消息弹窗
   */
  closeMsgShow: function(e) {
    this.setData({
      msgShow: false
    })
  },

  /**
   * 打开分享组件
   */
  openShare: function () {
    this.setData({
      shareShow: true
    })
  },

  /**
   * 关闭分享组件
   */
  closeShare: function () {
    this.setData({
      shareShow: false
    })
  },

  /**
   * 用户打开海报预览窗口
   */
  openShareImgBox: function () {
    this.setData({
      shareImgShow: true
    })
  },

  /**
   * 关闭海报预览窗口
   */
  closeShareImgBox: function (e) {
    this.setData({
      shareImgShow: false
    })
  },

  /**
   * 生成分享图
   */
  shareFriend: function () {
    console.log('生成朋友圈图片')
    this.downLoadQr();
  },

  /**
  * 获得分享的二维码
  */
  downLoadQr: function () {
    let that = this;
    let detail = that.data.jobDetail;
    let language = that.data.language;
    if (that.data.shareImg != '') {
      that.openShareImgBox();
      return;
    } else {
      wx.showLoading({
        title: language.str21,
        mask: true
      })
      that.loadCanvasImgInfo();
    }


    //下载二维码
    // util.request(wx.createTeamQr, {
    //   page: 'inviteCoupon',
    //   loveGoodId: detail.id,
    //   userId: wx.getStorageSync("userId")
    // }, 'POST').then(function (res) {
    //   if (res.errno === 0) {
    //     that.myData.qrCode = res.data;
    //     //将图片信息下载到本地
    //     that.loadCanvasImgInfoInvite();
    //   } else {
    //     wx.hideLoading();
    //     util.showErrorToast(language.str22);
    //   }
    // }).catch(function (res) {
    //   wx.hideLoading();
    //   util.showErrorToast(language.str22);
    // })

  },

  /**
   * 开始获取画图所需的图片信息(工作分享图)
   */
  loadCanvasImgInfo() {
    let that = this;
    let language = that.data.language;
    let jobDetail = that.data.jobDetail;
    let logo = jobDetail.companyInfoDTO.logo == null ? 'https://www.lgstatic.com/thumbnail_120x120/images/logo_default.png' : jobDetail.companyInfoDTO.logo;
    // logo = 'https://www.lgstatic.com/thumbnail_120x120/i/image2/M01/7B/6B/CgoB5l1d99uARqFtAAAr9jphQFs606.jpg';
    wx.getImageInfo({
      src: that.myData.qrCode,
      success: res => {
        that.myData.qrCodeSrc = res.path;//二维码本地路径
        wx.getImageInfo({
          src: logo,
          success: res => {
            console.log(res)
            that.myData.logoSrc = res;//公司LOGO图本地路径
            that.createdCanvas();
            setTimeout(() => {
              wx.canvasToTempFilePath({
                x: 0,
                y: 0,
                width: 1125,
                height: 1728,
                destWidth: 1125,
                destHeight: 1728,
                canvasId: 'jobShare',
                success: function (res) {
                  wx.hideLoading();
                  that.setData({
                    shareImg: res.tempFilePath
                  })
                  that.openShareImgBox();
                },
                fail: function (res) { }
              })
            }, 500)
          },
          fail: res => {
            wx.hideLoading();
            util.showTips(language.str23);
          }
        })
      },
      fail: res => {
        wx.hideLoading();
        util.showTips(language.str23);
      }
    })

  },

  /**
   * 开始绘图(工作分享图)
   */
  createdCanvas() {
    let that = this;
    let language = that.data.language;
    let bgImgSrc = '/packageA/assets/pngs/job-bg.png';
    let qrCodeSrc = that.myData.qrCodeSrc;
    let logoSrc = that.myData.logoSrc;
    let detail = that.data.jobDetail;
    if (detail.companyName.length > 25) {
      detail.companyName = detail.companyName.slice(0, 20) + '...';
    };
    if (detail.jobTitle.length > 25) {
      detail.jobTitle = detail.jobTitle.slice(0, 20) + '...';
    };
    detail.companyInfoDTO.description = detail.companyInfoDTO.description == null ? language.str29 : detail.companyInfoDTO.description;
    const ctx = wx.createCanvasContext('jobShare'); //绘图上下文
    ctx.save()
    ctx.drawImage(bgImgSrc, 0, 0, 1125, 1728); //绘制背景图
    ctx.restore();
    easyCanvas.drawImageOld(ctx, logoSrc.path, 110, 150, 180, 180, 0, 0, logoSrc.width, logoSrc.height);//画公司logo
    easyCanvas.drawLongText(ctx, detail.companyName, 45, "#333333", 330, 220, 50, 650, 1, true);//画公司名称
    easyCanvas.drawText(ctx, detail.companyInfoDTO.jobNum + language.str26, 40, "#333333", 330, 300, false);//画几份工作在招
    easyCanvas.drawLongText(ctx, detail.companyInfoDTO.description, 38, '#333333', 150, 430, 50, 830, 3);//画公司描述
    easyCanvas.drawTextCenter(ctx, detail.jobTitle, 50, '#333333', 1125, 750, true);//画职位名称
    easyCanvas.drawTextCenter(ctx, detail.salaryStr, 80, '#FD5F39', 1125, 860, true);//画薪资数量
    let str3 = language.str27 + detail.recruitment + language.str28;
    easyCanvas.drawTextCenter(ctx, str3, 45, '#333333', 1125, 950);//画招多少人
    ctx.save()
    ctx.drawImage(qrCodeSrc, 402.5, 1064, 320, 320);
    ctx.restore();
    let str1 = detail.companyName + language.str24;
    let str2 = language.str25;
    easyCanvas.drawTextCenter(ctx, str1, 40, '#000', 1125, 1450);
    easyCanvas.drawTextCenter(ctx, str2, 38, '#999999', 1125, 1520);
    ctx.draw();
  }



})