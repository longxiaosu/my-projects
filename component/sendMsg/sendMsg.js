var util = require('../../utils/util.js');
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false,
      observer: function (newVal, oldVal) {
        let that = this;
        if (newVal == true) {
          that.setData({
            val: ''
          })
          setTimeout(function(){
            that.setData({
              focus: true
            })
          },500)
        }else{
          this.setData({
            focus: false
          })
        }
      }
    },
    jobId: {
      type: String,
      value: '',
      observer: function (newVal, oldVal) { }
    },
    companyId: {
      type: String,
      value: '',
      observer: function (newVal, oldVal) { }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    language: {},
    val: '',
    focus: false
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
    },
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
        language: wx.T.getLanguage('sendMsg')
      });
    },

    /**
     * 关闭窗口 
     */
    onClose: function () {
      let that = this;
      let myEventDetail = {
        success: false
      }
      that.triggerEvent('close', myEventDetail);
    },

    bindDataChange: function (e) {
      let that = this;
      let name = e.currentTarget.dataset.name;
      let updataStr = name;
      that.setData({
        [updataStr]: e.detail.value
      })
    },

    /**
     * 发送消息的请求
     */
    sendMsg: function () {
      let that = this;
      let language = that.data.language;
      let val = that.data.val;
      if(val == ''||val == null){
        util.showTips(language.str7);
        return;
      }
      that.onClose();
      wx.showLoading({
        title: language.str5,
        mask: true
      })
      util.request(wx.api.sendMessage, {
        jobId: that.data.jobId,
        msg: val,
        toCompanyId: that.data.companyId
      }, 'POST').then(function (res) {
        wx.hideLoading();
        if (res.success == true) {
          util.showTips(language.str6, 'success');
          setTimeout(function () {
            wx.setStorageSync('reLoadChat', 1);
            wx.switchTab({
              url: '/pages/chat/chat'
            });
          }, 1000);
        } else {
          util.showTips(res.message);
        }
      }).catch(function (res) {
        wx.hideLoading();
        util.showErrorToast('网络错误');
      })
    }



  }
})