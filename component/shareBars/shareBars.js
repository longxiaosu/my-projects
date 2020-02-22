var util = require('../../utils/util.js');
Component({
  /**
   * 分享栏组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false,
      observer: function (newVal, oldVal) { }
    },
    bgColor: {
      type: String,
      value: 'background-color:rgba(0, 0, 0, 0)',
      observer: function (newVal, oldVal) { }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    language: {}
  },

  lifetimes: {
    created: function () {
      //在组件实例刚刚被创建时执行

    },
    attached: function () {
      // 在组件实例进入页面节点树时执行
      this.setLanguage();
      wx.event.on("languageChanged", this, this.setLanguage);
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    }
  },

  // 组件所在页面的生命周期函数
  pageLifetimes: {
    show() {

    }
  },

  /**
   * 组件的方法列表
   */
  methods: {

    /**
     * 加载语言
     */
    setLanguage() {
      this.setData({
        language: wx.T.getLanguage('shareBars')
      });
    },

    shareSubmit: function (e) {
      var temp = wx.getStorageSync("userInfo");
      let formId = e.detail.formId;
      if (temp == "" || temp == undefined) { } else {
        if (formId == 'the formId is a mock one' || formId == undefined) { } else {
          util.dealFormIds(formId);
        }
      }
    },

    popClose: function () {
      this.triggerEvent('hides');
    },

    shares: function () {
      this.triggerEvent('hides');
      this.triggerEvent('shares');
    }
  }
})
