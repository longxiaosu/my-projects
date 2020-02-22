var util = require('../../utils/util.js');
Component({
  /**
   * 分享栏组件的属性列表
   */
  properties: {
    popUp: {
      type: Object,
      value: {
        show: false
      },
      observer: function (newVal, oldVal) { }
    },
    shareType: {
      type: String,
      value: '',
      observer: function (newVal, oldVal) { }
    },
    tipStr: {
      type: String,
      value: '',
      observer: function (newVal, oldVal) { }
    },
    bgColor: {
      type: String,
      value: 'rgba(0, 0, 0, 0)',
      observer: function (newVal, oldVal) { }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
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
