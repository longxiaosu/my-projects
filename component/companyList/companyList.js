var util = require('../../utils/util.js');
var tool = require('../../utils/public.js');
const app = getApp();

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: {
      type: Array,
      value: [],
      observer: function (newVal, oldVal) {
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    language: {}
  },

  /**
   * 监听数据变化
   */
  observers: {
    'list': function (list) {

    }
  },

  /**
   * 组件的生命周期
   */
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

  /**
   * 组件所在页面的声明周期
   */
  pageLifetimes: {
    show: function () {
      // 页面被展示
    },
    hide: function () {
      // 页面被隐藏
    },
    resize: function (size) {
      // 页面尺寸变化
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
        language: wx.T.getLanguage('companyList')
      });
    },

    /**
     * 跳转到公司主页
     */
    linkToCompanyDetail: function (e) {
      let that = this;
      let id = e.currentTarget.dataset.id;
      tool.preQueryCompany(id, 'companyDetail');
      wx.navigateTo({
        url: '/packageA/pages/company/company?id=' + id
      })

    }


  }
})
