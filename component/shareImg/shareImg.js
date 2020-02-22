Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false,
      observer: function (newVal, oldVal) {

      }
    },
    shareImgs: {
      type: String, //用户的分享海报
      value: '',
      observer: function (newVal, oldVal) {

      }
    },
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
        language: wx.T.getLanguage('shareImg')
      });
    },

    closeTips: function () {
      return;
    },

    /**
     * 关闭窗口 
     */
    closeWindow: function () {
      let that = this;
      that.triggerEvent('close');
    },

    lookImg: function () {
      let shareImgs = this.data.shareImgs;
      wx.previewImage({
        urls: [shareImgs]
      })
    },

    /**
     * 保存图片
     */
    saveImg() {
      let that = this;
      let language = that.data.language;
      wx.showLoading({
        title: language.str1
      })
      wx.getSetting({
        success(res) {
          if (!res.authSetting['scope.writePhotosAlbum']) {
            wx.authorize({
              scope: 'scope.writePhotosAlbum',
              success() {
                wx.saveImageToPhotosAlbum({
                  filePath: that.data.shareImgs,
                  success() {
                    wx.hideLoading()
                    wx.showToast({
                      title: language.str2,
                      icon: 'success',
                      duration: 1500
                    })
                    that.closeWindow()
                  },
                  fail() {
                    wx.hideLoading()
                    wx.showToast({
                      title: language.str3,
                      icon: 'none'
                    })
                  }
                })
              },
              fail() { }
            })
          } else {
            wx.saveImageToPhotosAlbum({
              filePath: that.data.shareImgs,
              success() {
                wx.hideLoading()
                wx.showToast({
                  title: language.str2,
                  icon: 'success',
                  duration: 1500
                })
                that.closeWindow()
              },
              fail() {
                wx.hideLoading()
                wx.showToast({
                  title: language.str3,
                  icon: 'none'
                })
              }
            })
          }
        },
        fail(res) {
          wx.hideLoading()
        }
      })
    }

  }
})