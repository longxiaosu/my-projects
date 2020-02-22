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
      title: '讯息'
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
    userInfo: null,
    current: 1,
    size: 30,
    currentSwipe: '',//当前滑动的那个选项
    chatObj: null//当前正在和哪个聊天
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    this.setLanguage();
    wx.event.on("languageChanged", this, this.setLanguage);
    wx.event.on("socketReceive", this, this.socketMsg);
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
    that.myData.chatObj = null;
    let language = that.data.language;
    let reLoadChat = wx.getStorageSync('reLoadChat');
    if (that.data.list.length == 0) {
      wx.showLoading({
        title: language.str1
      })
      that.queryChatMsgs();
    }else if(reLoadChat == 1){
      wx.setStorageSync('reLoadChat','');
      that.onPullDownRefresh();
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
    setTimeout(function () {
      wx.stopPullDownRefresh();
    }, 1000)

    let that = this;
    let language = that.data.language;
    wx.showLoading({
      title: language.str1
    })
    that.setData({
      hideLoad: true,
      total: -1,
      list: []
    })
    that.myData.current = 1;
    that.queryChatMsgs();


  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this;
    let isBottomRefreshing = that.myData.isBottomRefreshing;
    if (isBottomRefreshing == true) {
      return;
    }
    this.pushMoreChatMsgs();
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
      language: wx.T.getLanguage('chat'),
    });
    wx.setNavigationBarTitle({
      title: wx.T.getLanguage('chat').title
    })
  },

  /**
   * 监听socket返回的消息
   */
  socketMsg(res) {
    console.log('chat收到消息')
    console.log(res)
    this.dealNewCompanyMessage(res);
  },

  /**
   * 跳转到聊天详情
   */
  linkToDetail: function (e) {
    let that = this;
    let list = that.data.list;
    let index = e.currentTarget.dataset.index;
    if (that.myData.currentSwipe != '') {
      let current = this.selectComponent('#' + that.myData.currentSwipe);
      current.close();
      that.myData.currentSwipe = '';
    }
    that.myData.chatObj = list[index];
    that.setData({//将当前未读消息清空
      ['list['+index+'].msgNum'] : 0
    })
    wx.setStorageSync("chatObj", list[index]);
    tool.preChatMsgDetail('chatMsgDetail');
    wx.navigateTo({
      url: '/packageA/pages/chatDetail/chatDetail'
    })
  },

  touchStart: function (e) {
    let that = this;
    if (that.myData.currentSwipe != '') {
      if (that.myData.currentSwipe != e.currentTarget.dataset.id) {
        //把之前滑动的那个选项还原
        let current = this.selectComponent('#' + that.myData.currentSwipe);
        current.close();
        that.myData.currentSwipe = '';
      }
    } else {

    }

  },

  touchEnd: function (e) {
    let that = this;
    that.myData.currentSwipe = e.currentTarget.dataset.id;
  },

  /**
   * 查询聊天对象列表
   */
  queryChatMsgs: function () {
    let that = this;
    util.request(wx.api.queryChatMsgs, {
      current: that.myData.current,
      size: that.myData.size,
      userType: 0
    }, 'POST').then(function (res) {
      wx.hideLoading();
      if (res.success == true) {
        let resData = res.result;
        let list = resData.records;
        let chatMsgs = that.data.list;
        for (let i in list) {
          let a = list[i].gmtCreate.split(" ");
          let b = a[0].split("-");
          list[i].timeStr = b[1] + "月" + b[2] + "日";
          if (list[i].receiverAvatar == null) {
            list[i].imgUrl = "https://img.bosszhipin.com/boss/avatar/avatar_15.png?x-oss-process=image/resize,w_60,limit_0";
          } else {
            list[i].imgUrl = list[i].receiverAvatar;
          }
          //判断是不是FastFindJob系统帐号
          if (list[i].companyName == null && list[i].companyId == null) {
          } else {
            chatMsgs.push(list[i]);
          }
        }

        let hideLoad = true;
        if (list.length == 0 || list.length < that.myData.size) {
          hideLoad = false;
        }

        that.setData({
          isBottomRefreshing: false,
          hideLoad: hideLoad,
          total: resData.total,
          list: chatMsgs
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
   * 加载更多聊天对象列表
   */
  pushMoreChatMsgs: function () {
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
      that.queryChatMsgs();
    }
  },

  /**
   * 删除一个聊天
   */
  deleteChat: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let list = that.data.list;
    list.splice(index, 1);
    that.setData({
      list: list
    })
  },

  /**
   * 处理新的聊天消息推送
   */
  dealNewCompanyMessage: function (res) {
    let that = this;
    let chatMsgs = that.data.list;
    let currentItem = that.myData.chatObj;//当前的聊天对象
    let objIndex = "";
    let tIndex = 0;
    let hasExist = false; //false表示在当前聊天对象列表不存在

    for (let i in chatMsgs) {
      //来自相同的用户和相同的公司，说明当前推送的聊天对象已经存在列表中
      if (chatMsgs[i].companyId == res.fromCompanyId) {
        hasExist = true;
        //检查当前是否和这个聊天正在对话
        if (currentItem != null && currentItem.companyId == res.fromCompanyId) {
          chatMsgs[i].msg = res.msg;
          let a = res.sendTime.split(" ");
          let b = a[0].split("-");
          chatMsgs[i].timeStr = b[1] + "月" + b[2] + "日";
          objIndex = i;
        } else {
          //当前不是和这个聊天对象对话,将这个聊天对象的下标往前提升
          chatMsgs[i].msgNum += 1;
          chatMsgs[i].msg = res.msg;
          let a = res.sendTime.split(" ");
          let b = a[0].split("-");
          chatMsgs[i].timeStr = b[1] + "月" + b[2] + "日";
          objIndex = i;
          tIndex = 1;
        }
        if(currentItem == null) {
          tIndex = 0;
        }
      }
    }

    if (hasExist == false) {
      //如果在当前的聊天列表不存在这个对象,将这个新的聊天对象插入到第二个位置
      let a = res.sendTime.split(" ");
      let b = a[0].split("-");
      let timeStr = b[1] + "月" + b[2] + "日";
      let newObj = {
        companyId: res.fromCompanyId,
        companyName: res.companyName,
        fromCompanyId: res.fromCompanyId,
        gmtCreate: res.sendTime,
        id: res.msgId,
        imgUrl:
          res.fromUserAvatar == null
            ? "https://img.bosszhipin.com/boss/avatar/avatar_15.png?x-oss-process=image/resize,w_60,limit_0"
            : res.fromUserAvatar,
        isRead: 1,
        jobId: res.jobId,
        jobTitle: res.jobTitle,
        msg: res.msg,
        msgNum: 1,
        receiverAvatar: res.fromUserAvatar,
        receiverId: res.fromUserId,
        receiverName: res.fromUserName,
        timeStr: timeStr,
        toCompanyId: null,
        toUserId: null
      };
      chatMsgs.splice(1, 0, newObj);
      that.setData({
        list: chatMsgs
      })
      return;
    }

    if (objIndex != '') {
      //将这个聊天对象的下标往前提升
      that.sortArrayIndex(chatMsgs, objIndex, tIndex);
    }

  },

  /**
   * 将元素排列到数组指定的下标
   */
  sortArrayIndex: function (chatMsgs, index, tindex) {
    let that = this;
    let arr = chatMsgs;
    //如果当前元素在拖动目标位置的下方，先将当前元素从数组拿出，数组长度-1，我们直接给数组拖动目标位置的地方新增一个和当前元素值一样的元素，
    //我们再把数组之前的那个拖动的元素删除掉，所以要len+1
    if (index > tindex) {
      arr.splice(tindex, 0, arr[index]);
      arr.splice(index + 1, 1);
    } else {
      //如果当前元素在拖动目标位置的上方，先将当前元素从数组拿出，数组长度-1，我们直接给数组拖动目标位置+1的地方新增一个和当前元素值一样的元素，
      //这时，数组len不变，我们再把数组之前的那个拖动的元素删除掉，下标还是index
      arr.splice(tindex + 1, 0, arr[index]);
      arr.splice(index, 1);
    }
    that.setData({
      list: arr
    })
  }


})