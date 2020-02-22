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
      showCapsule: 0,
      title: '在线沟通'
    },
    topHeight: app.globalData.topHeight,
    language: {},
    isRefreshing: false,
    hideLoad: true,
    total: -1,
    list: [],
    chatCompany: null,
    msg: '',
    focus: false,
    inputBottom: 0,
    showEmotion: false,
    showMenu: false,
    menuType: 0//当前选择了哪个功能,0没选择1常用语
  },

  myData: {
    userInfo: null,
    current: 1,
    size: 50,
    chatObj: '',
    winHeight: 0,
    rpxR: 0//用来转换PX单位
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    let that = this;
    this.setLanguage();
    wx.event.on("languageChanged", this, this.setLanguage);
    wx.event.on("socketReceive", this, this.socketMsg);
    let chatObj = wx.getStorageSync("chatObj");
    if (chatObj == '' || chatObj == null) {
      wx.switchTab({
        url: '/pages/index/index'
      });
      return;
    }
    that.myData.chatObj = chatObj;
    console.log(chatObj)
    that.preLoadData();

    wx.getSystemInfo({
      success: (res) => {
        let isIphoneX = false;
        if (res.statusBarHeight >= 44) {
          isIphoneX = true;
        }
        let statusBarHeight = res.statusBarHeight; //顶部高度,单位PX
        let clientHeight = res.windowHeight; //下方区域高度,单位PX
        let clientWidth = res.windowWidth;
        let rpxR = 750 / clientWidth;
        let winHeight = clientHeight * rpxR; //计算scroll-view高度需要
        that.myData.winHeight = winHeight;
        that.myData.rpxR = rpxR;
        that.setData({
          winHeight: winHeight - 100
        })
      }
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
    let that = this;

    //判断是否登录
    let userInfo = wx.getStorageSync('userInfo');
    if (userInfo == '' || userInfo == null) {
      wx.switchTab({
        url: '/pages/mine/mine'
      });
      return;
    }
    that.myData.userInfo = userInfo;

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
    wx.setStorageSync("chatObj", '');
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
      language: wx.T.getLanguage('chatDetail'),
    });
    wx.setNavigationBarTitle({
      title: wx.T.getLanguage('chatDetail').title
    })
  },

  /**
   * 监听socket返回的消息
   */
  socketMsg(res) {
    this.dealNewMessage(res);
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
    if (res.success == true) {
      let list = res.result.page.records;
      let chatMsgsDetail = that.data.list;
      for (let i in list) {
        list[i].msg = list[i].msg.replace(/\#[\u4E00-\u9FA5]{1,3}\;/gi, that.emotions);
        chatMsgsDetail.unshift(list[i]);
      }

      if (that.data.chatCompany == null) {
        //绑定当前聊天对象所属的公司信息
        let obj = {
          companyName: res.result.companyName,
          currentUser: res.result.currentUser
        };
        wx.setNavigationBarTitle({
          title: res.result.companyName
        })
        that.setData({
          chatCompany: obj
        })
      }

      let hideLoad = true;
      if (list.length == 0 || list.length < that.myData.size) {
        hideLoad = false;
      }

      that.setData({
        isRefreshing: false,
        hideLoad: hideLoad,
        total: res.result.page.total,
        list: chatMsgsDetail
      }, () => {
        wx.hideLoading();
        if (that.myData.current == 1) {
          //需要滑动到最底部
          let scrollTop = list.length * 100 + 10000;
          that.setData({
            scrollTop: scrollTop
          })
        }
      })

    } else {
      wx.hideLoading();
      util.linkToBack(res.errmsg);
    }


  },

  /**
   * 查询聊天详情
   */
  queryChatMsgDetail: function () {
    let that = this;
    let chatObj = that.myData.chatObj;
    util.request(wx.api.queryChatMsgDetail, {
      current: that.myData.current,
      size: that.myData.size,
      userType: 0,
      companyId: chatObj.companyId,
      jobId: chatObj.jobId,
      otherUserId: chatObj.receiverId
    }, 'POST').then(function (res) {
      that.processData(res);
    }).catch(function (res) {
      wx.hideLoading();
      util.showErrorToast('网络错误');
    })
  },

  /**
   * 加载更多聊天详情
   */
  pushMoreMsgDetail: function () {
    let that = this;
    if (that.data.isRefreshing == true || that.data.total <= 0) {
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
        isRefreshing: true
      })
      that.queryChatMsgDetail();
    }
  },

  /**
   * 处理新的聊天消息推送
   */
  dealNewMessage: function (res) {
    let that = this;
    let list = that.data.list;
    let currentItem = that.myData.chatObj;//当前的聊天对象
    if (currentItem != null && currentItem != '' && currentItem.companyId == res.fromCompanyId) {
      //把这个新消息直接更新到聊天详情列表里面
      res.msg = res.msg.replace(/\#[\u4E00-\u9FA5]{1,3}\;/gi, that.emotions);
      list.push({
        companyId: res.fromCompanyId,
        currentAvatar: res.toUserAvatar,
        currentId: res.toUserId,
        currentName: res.toUserName,
        flag: 0,
        gmtCreate: res.sendTime,
        id: res.msgId,
        isRead: 1,
        jobId: res.jobId,
        msg: res.msg,
        otherAvatar: res.fromUserAvatar,
        otherId: res.fromUserId,
        otherName: res.fromUserName
      });
      let scrollTop = list.length * 100 + 10000;
      that.setData({
        list: list,
        scrollTop: scrollTop
      })
    }


  },

  /**
   * 用户发送消息
   */
  sendMsg: function () {
    let that = this;
    let language = that.data.language;
    let chatCompany = that.data.chatCompany;
    let sendMsgStr = that.data.msg;
    sendMsgStr = sendMsgStr.replace(/^\n+|\n+$/g, "");
    if (sendMsgStr == "" || sendMsgStr == null) {
      util.showTips(language.str2);
      return;
    }
    that.sysSendMessage(sendMsgStr);
    let chatMsgsDetail = that.data.list;
    sendMsgStr = sendMsgStr.replace(/\#[\u4E00-\u9FA5]{1,3}\;/gi, that.emotions);
    chatMsgsDetail.push({
      companyId: "",
      currentAvatar: chatCompany.currentUser.avatar,
      currentId: chatCompany.currentUser.jobUserId,
      currentName: chatCompany.currentUser.chineseName,
      flag: 1,
      gmtCreate: that.getFormatDate(),
      id: "",
      isRead: 0,
      jobId: "",
      msg: sendMsgStr,
      otherAvatar: "",
      otherId: "",
      otherName: ""
    });

    let scrollTop = chatMsgsDetail.length * 100 + 10000;
    let msgs = '';
    that.setData({
      list: chatMsgsDetail,
      scrollTop: scrollTop,
      msg: msgs
    })

  },

  /**
   * 用户发送消息请求
   */
  sysSendMessage: function (sendMsgStr) {
    let that = this;
    let currentItem = that.myData.chatObj;
    util.request(wx.api.sysSendMessage, {
      jobId: currentItem.jobId,
      msg: sendMsgStr,
      toCompanyId: currentItem.companyId,
      toUserId: currentItem.receiverId
    }, 'POST').then(function (res) {
      if (res.success == true) {
      } else {
        util.showTips(res.message);
      }
    }).catch(function (res) {
      util.showErrorToast('网络错误');
    })
  },

  bindDateChange: function (e) {
    let that = this;
    let name = e.currentTarget.dataset.name;
    that.setData({
      [name]: e.detail.value
    })
  },

  /**
   * js获取当前时间，并格式化为"yyyy-MM-dd HH:mm:ss"
   */
  getFormatDate: function () {
    let date = new Date();
    let month = date.getMonth() + 1;
    let strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    let currentDate =
      date.getFullYear() +
      "-" +
      month +
      "-" +
      strDate +
      " " +
      date.getHours() +
      ":" +
      date.getMinutes() +
      ":" +
      date.getSeconds();
    return currentDate;
  },

  linkToCompany: function () {
    let that = this;
    let currentItem = that.myData.chatObj;
    tool.preQueryCompany(currentItem.companyId, 'companyDetail');
    wx.navigateTo({
      url: '/packageA/pages/company/company?id=' + currentItem.companyId
    })
  },

  /**
   * 输入框聚焦
   */
  inputFocus: function (e) {
    let that = this;
    let list = that.data.list;
    let winHeight = that.myData.winHeight;
    let rpxR = that.myData.rpxR;
    let barHeight = e.detail.height * rpxR;//键盘高度
    winHeight = winHeight - 100 - barHeight;
    let scrollTop = list.length * 100 + 10000;
    that.setData({
      showEmotion: false,
      showMenu: false,
      winHeight: winHeight,
      inputBottom: barHeight
    })
    setTimeout(function () {
      that.setData({
        scrollTop: scrollTop
      })
    }, 300)
  },

  /**
   * 输入框失去聚焦
   */
  inputBlur: function () {
    let that = this;
    let scrollTop = that.data.scrollTop;
    let winHeight = that.myData.winHeight;
    winHeight = winHeight - 100;
    that.setData({
      inputBottom: 0,
      winHeight: winHeight,
      focus: false
    })
    setTimeout(function () {
      that.setData({
        scrollTop: scrollTop
      })
    }, 300)
  },

  /**
   * 显示表情栏
   */
  showEmotion: function () {
    let that = this;
    let scrollTop = that.data.scrollTop;
    let winHeight = that.myData.winHeight;
    winHeight = winHeight - 100 - 400;
    that.setData({
      showEmotion: true,
      showMenu: false,
      winHeight: winHeight
    })

    setTimeout(function () {
      that.setData({
        scrollTop: scrollTop
      })
    }, 300)
  },

  /**
   * 关闭表情栏
   */
  closeEmotion: function () {
    let that = this;
    that.setData({
      showEmotion: false,
      focus: true
    })
  },

  /**
   * 选择表情
   */
  selectEmotion: function (e) {
    let that = this;
    let emotion = e.detail.emotion;
    let msg = that.data.msg;
    msg += emotion;
    that.setData({
      msg: msg
    })
  },

  /**
   * 打开底部菜单栏
   */
  showMoreMenu: function () {
    let that = this;
    let scrollTop = that.data.scrollTop;
    let winHeight = that.myData.winHeight;
    winHeight = winHeight - 100 - 400;
    that.setData({
      showMenu: true,
      showEmotion: false,
      menuType: 0,
      winHeight: winHeight
    })

    setTimeout(function () {
      that.setData({
        scrollTop: scrollTop
      })
    }, 300)
  },

  /**
   * 关闭底部菜单栏
   */
  closeMoreMenu: function () {
    let that = this;
    that.setData({
      menuType: 0,
      showMenu: false,
      focus: true
    })
  },

  closeBottomShow: function () {
    let that = this;
    let showEmotion = that.data.showEmotion;
    let showMenu = that.data.showMenu;
    let winHeight = that.myData.winHeight;
    if (showEmotion == true || showMenu == true) {
      winHeight = winHeight - 100;
      that.setData({
        showMenu: false,
        showEmotion: false,
        winHeight: winHeight
      })
    }
  },

  /**
   * 选择底部菜单栏功能
   */
  selectMenuType: function (e) {
    let that = this;
    let type = e.currentTarget.dataset.type;
    that.setData({
      menuType: type
    })
  },

  /**
   * 选择常用语
   */
  selectPhrase: function (e) {
    let that = this;
    let msgs = e.currentTarget.dataset.msg;
    let msg = that.data.msg;
    msg += msgs;
    that.setData({
      msg: msg,
      menuType: 0,
      showMenu: false,
      focus: true
    })
  },

  // 将匹配结果替换表情图片
  emotions(res) {
    let word = res.replace(/\#|\;/gi, "");
    const list = [
      "微笑",
      "撇嘴",
      "色",
      "发呆",
      "得意",
      "流泪",
      "害羞",
      "闭嘴",
      "睡",
      "大哭",
      "尴尬",
      "发怒",
      "调皮",
      "呲牙",
      "惊讶",
      "难过",
      "酷",
      "冷汗",
      "抓狂",
      "吐",
      "偷笑",
      "可爱",
      "白眼",
      "傲慢",
      "饥饿",
      "困",
      "惊恐",
      "流汗",
      "憨笑",
      "大兵",
      "奋斗",
      "咒骂",
      "疑问",
      "嘘",
      "晕",
      "折磨",
      "衰",
      "骷髅",
      "敲打",
      "再见",
      "擦汗",
      "抠鼻",
      "鼓掌",
      "糗大了",
      "坏笑",
      "左哼哼",
      "右哼哼",
      "哈欠",
      "鄙视",
      "委屈",
      "快哭了",
      "阴险",
      "亲亲",
      "吓",
      "可怜",
      "菜刀",
      "西瓜",
      "啤酒",
      "篮球",
      "乒乓",
      "咖啡",
      "饭",
      "猪头",
      "玫瑰",
      "凋谢",
      "示爱",
      "爱心",
      "心碎",
      "蛋糕",
      "闪电",
      "炸弹",
      "刀",
      "足球",
      "瓢虫",
      "便便",
      "月亮",
      "太阳",
      "礼物",
      "拥抱",
      "强",
      "弱",
      "握手",
      "胜利",
      "抱拳",
      "勾引",
      "拳头",
      "差劲",
      "爱你",
      "NO",
      "OK",
      "爱情",
      "飞吻",
      "跳跳",
      "发抖",
      "怄火",
      "转圈",
      "磕头",
      "回头",
      "跳绳",
      "挥手",
      "激动",
      "街舞",
      "献吻",
      "左太极",
      "右太极"
    ];
    let index = list.indexOf(word);
    return `<img src="https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/${index}.gif" class="emotions-img" align="middle">`;
  }



})