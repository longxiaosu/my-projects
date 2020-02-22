import zh from './lang/zh.js';
import zhs from './lang/zhs.js';
import T from './lang/i18n.js';
import event from './lang/event.js';
import api from './config/api.js';
//注册locale
T.registerLocale({
  'zh_fan':zhs,
  'zh_jian':zh
});
//当前语言设置为用户上一次选择的语言，如果是第一次使用，则调用 T.setLocaleByIndex(0) 将语言设置成繁体中文
T.setLocaleByIndex(wx.getStorageSync('langIndex') || 0);
//将 T 注册到 wx 之下，这样在任何地方都可以调用 wx.T.getLanguage() 来得到当前的语言对象了。
wx.T = T;
wx.event = event;
//将API注册到wx
wx.api = api;
import socketTask from './config/socket.js';
wx.socketConnectTask = socketTask;//在线聊天的socket


App({
  onLaunch: function () {
    let that = this;
    //设置默认语言包
    let langIndex = wx.getStorageSync('langIndex');
    if(langIndex == ''||langIndex == null){
      wx.setStorageSync('langIndex', 0);
    }
    
    //获取设备顶部窗口的高度（不同设备窗口高度不一样，根据这个来设置自定义导航栏的高度）
    wx.getSystemInfo({
      success: (res) => {
        if (res.statusBarHeight >= 44) {
          that.globalData.isIphoneX = true;
        } else {

        }
        that.globalData.height = res.statusBarHeight; //顶部高度,单位PX
        var clientHeight = res.windowHeight, //下方区域高度,单位PX
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        that.globalData.rpxR = rpxR;
        that.globalData.calc = clientHeight * rpxR; //计算scroll-view高度需要
        that.globalData.topHeight = that.globalData.isIphoneX ? that.globalData.height * 2 : that.globalData.height * 2 + 25;
        that.globalData.winHeight = that.globalData.calc - that.globalData.topHeight * rpxR;
      }
    })

    wx.socketConnectTask.linkSocket();//连接socket
  },
  onShow(options) {
    let cityType = wx.getStorageSync('cityType');
    if (cityType == '' || cityType == null) {
      wx.setStorageSync('cityType', 0); //0代表简体字
      wx.setStorageSync('districtCity', '珠海市');//设置默认城市
    }else{
      this.globalData.districtCity =  wx.getStorageSync('districtCity');
      this.globalData.cityType = wx.getStorageSync('cityType');
    }

    //从其他小程序跳转进来传递的参数
    if (options.referrerInfo.extraData) {
      this.globalData.code = options.referrerInfo.extraData.code ? options.referrerInfo.extraData.code : 0;
    }

    // 判断是否由微信聊天主界面下拉，「最近使用」栏（基础库2.2.4版本起包含「我的小程序」栏）
    if (options.scene == 1089) {

    } 

  },
  globalData: {
    appId: 'wx4215c487bd76592a',
    isIphoneX: false, //判断是否有刘海屏
    share: false, // 是否从分享页面进来
    height: 0,//顶部高度,单位PX
    topHeight:0,//顶部导航栏占的高度,单位PX
    winHeight: 0,//计算scroll-view占的页面高度
    districtCity: '珠海市',//显示哪个城市的内容
    cityType: 0 //1繁体0简体
  }
})