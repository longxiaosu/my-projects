const app = getApp()
Component({
  properties: {
    navbarData: {
      type: Object,
      value: {
        title: 'Fast find job',
        showCapsule: 1 //是否显示左上角图标
      },
      observer: function (newVal, oldVal) { }
    },
    navStyle: {
      type: Object,
      value: {
        background: 'rgba(255,255,255,1)',//让白色背景渐变
      },
      observer: function (newVal, oldVal) { }
    }
  },
  data: {
    height: '',
    topHeight: ''
  },
  attached: function () {
    // 获取是否是通过分享进入的小程序
    this.setData({
      height: app.globalData.height,
      share: app.globalData.share
    })
    // 定义导航栏的高度
    if (app.globalData.isIphoneX) {
      this.setData({
        topHeight: app.globalData.height * 2
      })
    } else {
      this.setData({
        topHeight: app.globalData.height * 2 + 25
      })
    }

  },
  methods: {
    // 返回上一页面
    _navback() {
      wx.navigateBack()
    },
    //返回到首页
    _backhome() {
      wx.switchTab({
        url: '/pages/index/index',
      })
    }
  }

})