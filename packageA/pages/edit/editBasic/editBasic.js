var util = require('../../../../utils/util.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nvabarData: {
      showCapsule: 1,
      title: '编辑个人信息'
    },
    topHeight: app.globalData.topHeight,
    winHeight: app.globalData.winHeight - 200,
    language: {},
    popShow:false,//控制底部弹出层显示
    languageOptions: [[], []],
    idTypes: [],//证件类别选项
    genderOptions: [],//性别选项
    languageTypes: [],//语言类别选项
    phoneArea: [],//电话的区号选项
    jobTypes: [],//期望工作类别选项
    ruleForm: {//默认用来编辑的数据
      chineseName: "", //中文姓名--
      foreignName: "", //外文姓名--
      idType: "", //证件类别--
      nickname: "", //惯用称呼--
      gender: 0, //性别 0未知1男2女--
      wechatId: "", //微信号--
      birthday: "", //出生日期--
      height: "", //身高--
      phone: [
        {
          area: '',//区号
          phones: ''//手机号码
        }
      ], //联系电话--
      languageSkills: [
        {
          language: []
        }
      ], //语言--
      description: "", //关于我---
      skills: "", //专长和技能---
      experience: [],//工作经验列表---
      education: [], //学历认证---
      certificate: [], //证书认证---
      match: [], //比赛活动记录---
      jobPositions: [], //理想的工作类别
      jobPositionsStr: ''//理想的工作类别字符串显示
    }
  },

  myData: {
    genderOptions: [],//性别选项
    idTypes: [],//证件类别选项
    languageOptions: [[], []],
    phoneArea: [],//电话的区号选项
    languageTypes: [],//语言类别选项
    jobTypes: []//期望工作类别选项
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    let that = this;
    this.setLanguage();
    wx.event.on("languageChanged", this, this.setLanguage);
    let editBasicObj = wx.getStorageSync("editBasicObj");
    let language = that.data.language;
    console.log(editBasicObj)
    wx.setStorageSync("editBasicObj", '');
    if (editBasicObj == '') {
      wx.switchTab({
        url: '/pages/index/index'
      });
      return;
    }

    let resumeOptionType = wx.getStorageSync("resumeOptionType");
    let genderOptions = [
      { id: 1, name: language.str1 },
      { id: 2, name: language.str2 }
    ];
    let idTypes = resumeOptionType == '' ? [] : resumeOptionType.idTypes;//证件类别选项
    let languageTypes = resumeOptionType == '' ? [] : resumeOptionType.languageTypes;//语言类别选项
    let jobTypes = resumeOptionType == '' ? [] : resumeOptionType.jobTypes;//期望工作类别选项
    let languageOptions = [languageTypes, languageTypes.length > 0 ? languageTypes[0].children : []];
    let phoneArea = [//电话的区号选项
      { value: '+86', name: language.str3 },
      { value: '+852', name: language.str4 },
      { value: '+853', name: language.str5 },
      { value: '+886', name: language.str6 },
      { value: '+63', name: language.str7 },
      { value: '+95', name: language.str8 },
      { value: '+84', name: language.str9 },
      { value: '+977', name: language.str10 },
      { value: '+62', name: language.str11 }
    ]
    that.myData.genderOptions = genderOptions;
    that.myData.idTypes = idTypes;
    that.myData.languageTypes = languageTypes;
    that.myData.jobTypes = jobTypes;
    that.myData.languageOptions = languageOptions;
    that.myData.phoneArea = phoneArea;
    let times = this.getNowFormatDate();
    let ruleForm = that.changeDataSet(editBasicObj);
    that.setData({
      maxDate: times,
      idTypes: idTypes,
      genderOptions: genderOptions,
      languageOptions: languageOptions,
      phoneArea: phoneArea,
      jobTypes: jobTypes,
      ruleForm: ruleForm
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
  onShareAppMessage: function (e) { },

  /**
   * 加载语言
   */
  setLanguage() {
    this.setData({
      language: wx.T.getLanguage('editBasic'),
      ['nvabarData.title']: wx.T.getLanguage('editBasic').title
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
    if (e.detail.value.chineseName == '' || e.detail.value.chineseName == null) {
      util.showTips(language.str12);
      return;
    }

    if (e.detail.value.foreignName == '' || e.detail.value.foreignName == null) {
      util.showTips(language.str13);
      return;
    }

    if (e.detail.value.nickname == '' || e.detail.value.nickname == null) {
      util.showTips(language.str14);
      return;
    }

    if (that.data.ruleForm.idType == '') {
      util.showTips(language.str15);
      return;
    }

    if (that.data.ruleForm.birthday == '') {
      util.showTips(language.str16);
      return;
    }

    let languageSkills = that.data.ruleForm.languageSkills;
    for (let i in languageSkills) {
      if (languageSkills[i].language.length == 0) {
        util.showTips(language.str17);
        return;
      }
    }

    let phone = that.data.ruleForm.phone;
    if(phone.length == 0){
      util.showTips(language.str18);
      return;
    }

    for (let i in phone) {
      if (phone[i].area == '') {
        util.showTips(language.str19);
        return;
      }
      if (phone[i].phones == '') {
        util.showTips(language.str20);
        return;
      }
    }

    if(that.data.ruleForm.jobPositions.length == 0){
      util.showTips(language.str21);
      return;
    }

    let editBasicObj = that.changeDataSave();
    wx.setStorageSync("editBasicObj", editBasicObj);
    wx.navigateBack();
  },

  /**
   * 处理选项数据,将其转化成可以显示的格式
   */
  changeDataSet(editBasicObj) {
    let that = this;
    let detail = editBasicObj;
    let idTypes = that.myData.idTypes;//证件类别选项
    let genderOptions = that.myData.genderOptions;//性别选项
    let languageOptions = that.myData.languageOptions;//语言选项
    let phoneArea = that.myData.phoneArea;//电话区号选项
    let jobTypes = that.myData.jobTypes;//理想的工作类别选项

    let idType = "";
    for (let i in idTypes) {//找出当前选择的证件类别下标
      if (idTypes[i].idType == detail.idType) {
        idType = i;
      }
    }
    detail.idType = idType;

    let gender = 0;
    for (let i in genderOptions) {//找出当前选择的性别下标
      if (genderOptions[i].id == detail.gender) {
        gender = i;
      }
    }
    detail.gender = gender;

    let languageSkills = detail.languageSkills;
    for (let i in languageSkills) {//找出当前选择的语言下标
      if (languageSkills[i].language.length > 0) {
        let index1 = 0;
        let index2 = 0;
        for (let a in languageOptions[0]) {
          if (languageOptions[0][a].value == languageSkills[i].language[0]) {
            index1 = a;
          }
        }
        for (let b in languageOptions[1]) {
          if (languageOptions[1][b].value == languageSkills[i].language[1]) {
            index2 = b;
          }
        }
        languageSkills[i].language[0] = index1;
        languageSkills[i].language[1] = index2;
      }
    }
    detail.languageSkills = languageSkills;

    let phone = detail.phone;
    for (let i in phone) {//找出当前选择的电话区号下标
      let index1 = 0;
      for (let a in phoneArea) {
        if (phoneArea[a].value == phone[i].area) {
          index1 = a;
        }
      }
      phone[i].area = index1;
    }
    detail.phone = phone;

    let jobPositions = detail.jobPositions;
    let jobPositionsStr = '';//将理想的工作类别转字符显示
    for (let i in jobPositions) {
      let str = '';
      for (let a in jobTypes) {
        if (jobTypes[a].id == jobPositions[i]) {
          str = jobTypes[a].name;
        }
      }
      if (i == 0) {
        jobPositionsStr += str;
      } else {
        jobPositionsStr = jobPositionsStr + '、' + str;
      }
      jobPositions[i] = String(jobPositions[i]);
    }
    detail.jobPositionsStr = jobPositionsStr;
    detail.jobPositions = jobPositions;

    return detail;
  },

  /**
   * 处理选项数据,将其转化成可以保存的格式
   */
  changeDataSave() {
    let that = this;
    let idTypes = that.myData.idTypes;//证件类别选项
    let genderOptions = that.myData.genderOptions;//性别选项
    let phoneArea = that.myData.phoneArea;//电话区号选项
    let languageOptions = that.myData.languageOptions;//语言选项
    let detail = that.data.ruleForm;
    if (detail.idType != '') {
      detail.idType = idTypes[detail.idType].idType;
    }
    detail.gender = genderOptions[detail.gender].id;

    let phone = detail.phone;
    for (let i in phone) {//找出当前选择的电话区号下标,转化成value
      phone[i].area = phoneArea[phone[i].area].value;
    }
    detail.phone = phone;

    let languageSkills = detail.languageSkills;
    for (let i in languageSkills) {//找出当前选择的语言下标,转化成value
      if (languageOptions[0].length > 0) {
        languageSkills[i].language[0] = languageOptions[0][languageSkills[i].language[0]].value;
        languageSkills[i].language[1] = languageOptions[1][languageSkills[i].language[1]].value;
      }
    }
    detail.languageSkills = languageSkills;

    return detail;
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
   * 添加一个联络电话 
   */
  addPhone: function () {
    let that = this;
    let phone = that.data.ruleForm.phone;
    phone.push({
      area: '',//区号
      phones: ''//手机号码
    })
    let updataStr = 'ruleForm.phone';
    that.setData({
      [updataStr]: phone
    })
  },

  /**
   * 删除一个联系电话
   */
  deletePhone: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let phone = that.data.ruleForm.phone;
    phone.splice(index, 1);
    let updataStr = 'ruleForm.phone';
    that.setData({
      [updataStr]: phone
    })
  },

  /**
   * 选择电话区号
   * @param {*} e 
   */
  bindPhoneChange: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let updataStr = 'ruleForm.phone[' + index + '].area';
    that.setData({
      [updataStr]: e.detail.value
    })
  },

  bindPhoneDateChange: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let updataStr = 'ruleForm.phone[' + index + '].phones';
    that.setData({
      [updataStr]: e.detail.value
    })
  },

  /**
   * 添加一个语言
   */
  addLanguageSkills: function () {
    let that = this;
    let languageSkills = that.data.ruleForm.languageSkills;
    languageSkills.push({
      language: []
    })
    let updataStr = 'ruleForm.languageSkills';
    that.setData({
      [updataStr]: languageSkills
    })
  },

  /**
   * 删除一条语言
   * @param {*} e 
   */
  deleteLanguageSkills: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let languageSkills = that.data.ruleForm.languageSkills;
    languageSkills.splice(index, 1);
    let updataStr = 'ruleForm.languageSkills';
    that.setData({
      [updataStr]: languageSkills
    })
  },

  /**
   * 选择语言,改变选择
   * @param {*} e 
   */
  bindMultiChange: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let updataStr = 'ruleForm.languageSkills[' + index + '].language';
    that.setData({
      [updataStr]: e.detail.value
    })
  },

  showPopup() {
    this.setData({ popShow: true });
  },

  onClose() {
    this.setData({ popShow: false });
  },

  /**
   * 修改理想的工作类别
   * @param {} event 
   */
  onJobPositionsChange(event) {
    let that = this;
    let jobTypes = that.myData.jobTypes;//理想的工作类别选项
    let jobPositions = event.detail;
    let jobPositionsStr = '';//将理想的工作类别转字符显示
    for (let i in jobPositions) {
      let str = '';
      for (let a in jobTypes) {
        if (jobTypes[a].id == jobPositions[i]) {
          str = jobTypes[a].name;
        }
      }
      if (i == 0) {
        jobPositionsStr += str;
      } else {
        jobPositionsStr = jobPositionsStr + '、' + str;
      }
      jobPositions[i] = String(jobPositions[i]);
    }

    this.setData({
      ['ruleForm.jobPositions']: jobPositions,
      ['ruleForm.jobPositionsStr']: jobPositionsStr
    });
  },

  /**
   * 将yyyy-mm-dd格式转为yyyy-mm
   */
  changDataFormat: function (time) {
    let str = "";
    let last = time.lastIndexOf("-");
    str = time.substring(0, last);
    return str;
  }


})