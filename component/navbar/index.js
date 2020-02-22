const app = getApp()
Component({
  properties: {
    navbarData: { //navbarData   由父页面传递的数据，变量名字自命名
      type: Object,
      value: {},
      observer: function(newVal, oldVal) {}
    },
    navbarLink: {
      type: Object,
      value: {},
      observer: function(newVal, oldVal) {}
    },
    navbarCity: {
      type: Object,
      value: {},
      observer: function(newVal, oldVal) {}
    },
    cityType: {
      type: String,
      value: '0',
      observer: function(newVal, oldVal) {}
    }
  },
  data: {
    height: '',
    topHeight: '',
    //默认值  默认显示左上角
    navbarData: {
      showCapsule: 1
    },
    navbarLink: {
      money: false
    },
    navbarCity: {
      show: false, //是否显示城市
      city: null
    },
    cityList: [],//城市的列表
    popUp: {
      show: false
    }
  },
  attached: function() {
    // 获取是否是通过分享进入的小程序

    let cityList = app.globalData.cityList;
    let arrList = [];
    for(let i in cityList){
      if(cityList[i] != '中山市'){
        arrList.push(cityList[i]);
      }
    }

    this.setData({
      height: app.globalData.height,
      share: app.globalData.share,
      cityList: arrList
    })
    // 定义导航栏的高度   方便对齐
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
    },
    /**
     * 领钱
     */
    linkMoney() {
      this.triggerEvent('takeMoney')
    },
    /**
     * 选城市
     */
    changeCity(e) {
      let that = this;
      let city = e.currentTarget.dataset.city;
      let myEventDetail = {
        city: city
      }
      that.triggerEvent('updatecity', myEventDetail);
      that.popClose();
    },
    popOpen() {
      this.setData({
        ['popUp.show']: true
      });
    },
    popClose() {
      this.setData({
        ['popUp.show']: false
      });
    }
  }

})