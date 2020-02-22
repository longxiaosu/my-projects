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
        if (newVal == true) {
          let language = this.data.language;
          let jobName = this.data.jobName;
          let msg1 = language.str7 + jobName + language.str8;
          let msg2 = language.str9 + jobName + language.str10;
          let msg3 = language.str11 + jobName + language.str12;
          let msgOptions = [
            { id: 0, name: msg1 },
            { id: 1, name: msg2 },
            { id: 2, name: msg3 }
          ];
          this.setData({
            msgOptions: msgOptions,
            form: {
              msgId: 0,
              resumeId: 0
            }
          })
        }
      }
    },
    resumeOption: {
      type: Array,
      value: [],
      observer: function (newVal, oldVal) { }
    },
    jobId: {
      type: String,
      value: '',
      observer: function (newVal, oldVal) { }
    },
    jobName: {
      type: String,
      value: '',
      observer: function (newVal, oldVal) {

      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    language: {},
    msgOptions: [],
    form: {
      msgId: 0, //默认选择第一条消息模板
      resumeId: 0 //0是系统默认简历
    }
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
        language: wx.T.getLanguage('applyJob')
      });
    },

    /**
     * 阻止默认滚动事件
     */
    preSlide: function () {
      return;
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
     * 发送申请工作的请求
     */
    submission: function () {
      let that = this;
      that.onClose();
      let language = that.data.language;
      let msgOptions = that.data.msgOptions;
      let msg = msgOptions[that.data.form.msgId].name;
      wx.showLoading({
        title: language.str6,
        mask: true
      })
      util.request(wx.api.submission, {
        jobId: that.data.jobId,
        resumeId: that.data.form.resumeId,
        msg: msg
      }, 'GET').then(function (res) {
        wx.hideLoading();
        if (res.success == true) {
          util.showTips(res.message,'success');
          that.triggerEvent('close', { success: true });
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