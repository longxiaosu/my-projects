var util = require('../../../../utils/util.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nvabarData: {
      showCapsule: 1,
      title: '添加教育經歷'
    },
    topHeight: app.globalData.topHeight,
    language: {},
    editEducationObj: '',
    dateFrom: "",//开始日期
    dateTo: "",//结束日期
    organizationName: "", //学校名称
    position: [], //专业名称
    description: "", //补充说明
    rangeArray: [[], []]
  },

  myData: {
    studyTypes: [],//专业名称选项
    position: [],
    editEducationObj: ''
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
    let editEducationObj = wx.getStorageSync("editEducationObj");
    console.log(editEducationObj)
    that.myData.editEducationObj = editEducationObj;
    if (editEducationObj == '' || editEducationObj == null) {
      nvabarDataTitle = language.title;
    }
    wx.setStorageSync("editEducationObj", '');
    let resumeOptionType = wx.getStorageSync("resumeOptionType");
    let studyTypes = resumeOptionType == '' ? [] : resumeOptionType.studyTypes;//职位名称选项
    let times = this.getNowFormatDate();
    that.myData.studyTypes = studyTypes;
    let rangeArray = that.setDefaultMulti(editEducationObj);
    that.setData({
      ['nvabarData.title']: nvabarDataTitle,
      maxDate: times,
      editEducationObj: editEducationObj,
      rangeArray: rangeArray,
      dateFrom: editEducationObj == '' ? '' : that.changDataFormat(editEducationObj.obj.times[0]),
      dateTo: editEducationObj == '' ? '' : that.changDataFormat(editEducationObj.obj.times[1]),
      organizationName: editEducationObj == '' ? '' : editEducationObj.obj.organizationName,
      description: editEducationObj == '' ? '' : editEducationObj.obj.description,
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
      language: wx.T.getLanguage('editEducation'),
      ['nvabarData.title']: wx.T.getLanguage('editEducation').title
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

    let studyTypes = that.myData.studyTypes;
    let description = e.detail.value.textarea;
    let organizationName = e.detail.value.organizationName;
    let position = [studyTypes[that.data.position[0]].id, studyTypes[that.data.position[0]].son[that.data.position[1]].id];
    let times = [that.data.dateFrom + '-01', that.data.dateTo + '-01'];

    let editEducationObj = that.myData.editEducationObj;
    if (editEducationObj != '') {
      //编辑修改
      editEducationObj.obj = {
        description: description,
        organizationName: organizationName,
        major: position,
        times: times
      }
    } else {
      //新增
      editEducationObj = {
        index: -1,
        obj: {
          description: description,
          organizationName: organizationName,
          major: position,
          times: times
        }
      }
    }
    wx.setStorageSync("editEducationObj", editEducationObj);
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
   * 设置默认的专业名称选项
   */
  setDefaultMulti: function (editEducationObj) {
    let that = this;
    let rangeArray = [[], []];
    let position = [];
    let positionArray = [-1, 0];
    let studyTypes = that.myData.studyTypes;
    if (editEducationObj != '') {
      position = editEducationObj.obj.major;
    }
    if (position.length > 0) {
      console.log(position)
      rangeArray[0] = studyTypes;
      console.log(studyTypes)
      for (let i in studyTypes) {
        if (studyTypes[i].id == position[0]) {//循环获取对应下标
          positionArray[0] = i;
          rangeArray[1] = studyTypes[i].son;
          for (let a in studyTypes[i].son) {
            if (studyTypes[i].son[a].id == position[1]) {
              positionArray[1] = a;
            }
          }
        }
      }
      if (positionArray[0] != -1) {
        that.myData.position = positionArray;
      }
    } else {
      if (studyTypes.length > 0) {
        rangeArray[0] = studyTypes;
        rangeArray[1] = studyTypes[0].son;
      }
    }
    return rangeArray;
  },

  /**
   * 选择专业名称,改变选择
   * @param {*} e 
   */
  bindMultiChange: function (e) {
    let that = this;
    that.setData({
      position: e.detail.value
    })
  },

  /**
   * 选择专业名称,滚动picker,修改对应列的数据
   * @param {*} e 
   */
  bindColumnChange: function (e) {
    let that = this;
    let column = e.detail.column;
    let value = e.detail.value;

    //如果是更改了第一列选项,则要对应修改第二列
    if (column == 0) {
      let studyTypes = that.myData.studyTypes;
      let son = studyTypes[value].son;
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
      content: language.str6,
      showCancel: true,
      cancelText: language.str7,
      cancelColor: '#999999',
      confirmText: language.str8,
      confirmColor: '#16B38A',
      success(res) {
        if (res.confirm) {
          let {index,obj} = that.myData.editEducationObj;
          wx.setStorageSync("editEducationObj", {
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