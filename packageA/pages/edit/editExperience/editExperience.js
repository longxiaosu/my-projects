var util = require('../../../../utils/util.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nvabarData: {
      showCapsule: 1,
      title: '添加工作經歷'
    },
    topHeight: app.globalData.topHeight,
    language: {},
    editExperienceObj: '',
    dateFrom: "",//入职日期
    dateTo: "",//离职日期
    organizationName: "", //公司
    position: [], //职位
    description: "", //工作简介
    rangeArray: [[], []]
  },

  myData: {
    workTypes: [],//职位名称选项
    position: [],
    editExperienceObj: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    let that = this;
    this.setLanguage();
    wx.event.on("languageChanged", this, this.setLanguage);
    let language = that.data.language;
    let nvabarDataTitle = language.str1;
    let editExperienceObj = wx.getStorageSync("editExperienceObj");
    console.log(editExperienceObj)
    that.myData.editExperienceObj = editExperienceObj;
    if (editExperienceObj == '' || editExperienceObj == null) {
      nvabarDataTitle = language.title;
    }
    wx.setStorageSync("editExperienceObj", '');
    let resumeOptionType = wx.getStorageSync("resumeOptionType");
    let workTypes = resumeOptionType == '' ? [] : resumeOptionType.workTypes;//职位名称选项
    let times = this.getNowFormatDate();
    that.myData.workTypes = workTypes;
    let rangeArray = that.setDefaultMulti(editExperienceObj);
    that.setData({
      ['nvabarData.title']: nvabarDataTitle,
      maxDate: times,
      editExperienceObj: editExperienceObj,
      rangeArray: rangeArray,
      dateFrom: editExperienceObj == '' ? '' : that.changDataFormat(editExperienceObj.obj.times[0]),
      dateTo: editExperienceObj == '' ? '' : that.changDataFormat(editExperienceObj.obj.times[1]),
      organizationName: editExperienceObj == '' ? '' : editExperienceObj.obj.organizationName,
      description: editExperienceObj == '' ? '' : editExperienceObj.obj.description,
      position: that.myData.position
    })

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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

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
      language: wx.T.getLanguage('editExperience'),
      ['nvabarData.title']: wx.T.getLanguage('editExperience').title
    });
  },

  /**
   * 保存formId
   */
  shareSubmit: function (e) {
    let that = this;
    var temp = wx.getStorageSync("userInfo");
    let formId = e.detail.formId;
    if (temp == "" || temp == undefined) { } else {
      if (formId == 'the formId is a mock one' || formId == undefined) { } else {
        util.dealFormIds(formId);
      }
    }
    console.log(e.detail.value)
    let language = that.data.language;
    if (e.detail.value.organizationName == '' || e.detail.value.organizationName == null) {
      util.showTips(language.str2);
      return;
    }
    if (that.data.position.length == 0) {
      util.showTips(language.str3);
      return;
    }
    if (that.data.dateFrom == '') {
      util.showTips(language.str4);
      return;
    }
    if (that.data.dateTo == '') {
      util.showTips(language.str5);
      return;
    }
    if (e.detail.value.textarea == '' || e.detail.value.textarea == null) {
      util.showTips(language.str6);
      return;
    }

    let workTypes = that.myData.workTypes;
    let description = e.detail.value.textarea;
    let organizationName = e.detail.value.organizationName;
    let position = [workTypes[that.data.position[0]].id, workTypes[that.data.position[0]].son[that.data.position[1]].id];
    let times = [that.data.dateFrom + '-01', that.data.dateTo + '-01'];

    let editExperienceObj = that.myData.editExperienceObj;
    if (editExperienceObj != '') {
      //编辑修改
      editExperienceObj.obj = {
        description: description,
        organizationName: organizationName,
        position: position,
        times: times
      }
    } else {
      //新增
      editExperienceObj = {
        index: -1,
        obj: {
          description: description,
          organizationName: organizationName,
          position: position,
          times: times
        }
      }
    }
    wx.setStorageSync("editExperienceObj", editExperienceObj);
    wx.navigateBack();
  },

  getNowFormatDate: function () {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
  },

  bindDateChange: function (e) {
    let that = this;
    let name = e.currentTarget.dataset.name;
    that.setData({
      [name]: e.detail.value
    })
  },

  /**
   * 设置默认的职位名称选项
   */
  setDefaultMulti: function (editExperienceObj) {
    let that = this;
    let rangeArray = [[], []];
    let position = [];
    let positionArray = [-1, 0];
    let workTypes = that.myData.workTypes;
    if (editExperienceObj != '') {
      position = editExperienceObj.obj.position;
    }
    if (position.length > 0) {
      rangeArray[0] = workTypes;
      for (let i in workTypes) {
        if (workTypes[i].id == position[0]) {//循环获取对应下标
          positionArray[0] = i;
          rangeArray[1] = workTypes[i].son;
          for (let a in workTypes[i].son) {
            if (workTypes[i].son[a].id == position[1]) {
              positionArray[1] = a;
            }
          }
        }
      }
      if (positionArray[0] != -1) {
        that.myData.position = positionArray;
      }
    } else {
      if (workTypes.length > 0) {
        rangeArray[0] = workTypes;
        rangeArray[1] = workTypes[0].son;
      }
    }
    return rangeArray;
  },

  /**
   * 选择职位名称,改变选择
   * @param {*} e 
   */
  bindMultiChange: function (e) {
    let that = this;
    that.setData({
      position: e.detail.value
    })
  },

  /**
   * 选择职位名称,滚动picker,修改对应列的数据
   * @param {*} e 
   */
  bindColumnChange: function (e) {
    let that = this;
    let column = e.detail.column;
    let value = e.detail.value;

    //如果是更改了第一列选项,则要对应修改第二列
    if (column == 0) {
      let workTypes = that.myData.workTypes;
      let son = workTypes[value].son;
      let position = [value, 0];
      that.setData({
        ['rangeArray[1]']: son,
        position: position
      })
    }

    //如果是更改了第二列选项
    if (column == 1) {
      that.setData({
        ['position[1]']: value
      })
    }

  },

  /**
   * 将yyyy-mm-dd格式转为yyyy-mm
   */
  changDataFormat: function (time) {
    let str = "";
    let last = time.lastIndexOf("-");
    str = time.substring(0, last);
    return str;
  },

  DeleteItem: function () {
    let that = this;
    let language = that.data.language;
    wx.showModal({
      content: language.str7,
      showCancel: true,
      cancelText: language.str8,
      cancelColor: '#999999',
      confirmText: language.str9,
      confirmColor: '#16B38A',
      success(res) {
        if (res.confirm) {
          let {index,obj} = that.myData.editExperienceObj;
          wx.setStorageSync("editExperienceObj", {
            index: -2,
            obj: index
          });
          wx.navigateBack();
        } else if (res.cancel) {

        }
      }
    })
  }


})