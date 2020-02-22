var util = require('../../../utils/util.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nvabarData: {
      showCapsule: 1,
      title: '在线简历'
    },
    topHeight: app.globalData.topHeight,
    language:{},
    huntingStatus: [],//求职意愿选项
    idTypes: [], //证件类别选项
    languageTypes: [], //语言类别选项
    jobTypes: [], //期望工作类别选项
    studyTypes: [], //学历和专业选项
    workTypes: [], //工作经历职位选项
    interest: 0,//求职意愿默认选项
    detail: {//默认显示在页面的数据
      imgUrl: "",//头像
      chineseName: "",//中文姓名
      foreignName: "",//外文姓名
      idType: "",//证件类别
      nickname: "",//惯用称呼
      gender: 0,//性别 0未知1男2女
      phone: "",//联系电话
      wechatId: "",//微信号
      birthday: "", //出生日期
      height: "",//身高
      languageSkills: [],//语言
      description: "",//关于我
      skills: "",//专长和技能
      jobPositions: [],//理想的工作类别
      experience: [], //工作经验
      education: [], //学历资料
      certificate: [], //证书
      match: [] //课程活动比赛
    }
  },

  myData: {
    ruleForm: {//默认用来编辑，提交的数据
      chineseName: "", //中文姓名
      foreignName: "", //外文姓名
      idType: "", //证件类别
      nickname: "", //惯用称呼
      gender: 1, //性别 0未知1男2女
      phone: [
        {
          area: '',//区号
          phones: ''//手机号码
        }
      ], //联系电话
      wechatId: "", //微信号
      birthday: "", //出生日期
      height: "", //身高
      languageSkills: [
        {
          language: []
        }
      ], //语言
      description: "", //关于我
      skills: "", //专长和技能
      experience: [],//工作经验列表
      education: [], //学历认证
      certificate: [], //证书认证
      match: [], //比赛活动记录
      jobPositions: [] //理想的工作类别
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    this.setLanguage();
    wx.event.on("languageChanged", this, this.setLanguage); 
    this.resumeBeforeLoad();
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
    let that = this;
    let ruleForm = that.myData.ruleForm;
    //监听编辑个人基本信息返回数据
    let basicItem = wx.getStorageSync("editBasicObj");
    if (basicItem != '' && basicItem != null) {
      that.myData.ruleForm = basicItem;
      let changResumeData = that.changResumeData();//将编辑格式转化成显示格式
      that.setData({
        detail: changResumeData
      })
      wx.setStorageSync("editBasicObj", '');
    }
    //监听编辑自我描述返回数据
    let description = wx.getStorageSync("editDescObj");
    if (description != '' && description != null) {
      that.setData({
        ['detail.description']: description
      })
      that.myData.ruleForm.description = description;
      wx.setStorageSync("editDescObj", '');
    }
    //监听编辑专长技能返回数据
    let skills = wx.getStorageSync("editSkillsObj");
    if (skills != '' && skills != null) {
      that.setData({
        ['detail.skills']: skills
      })
      that.myData.ruleForm.skills = skills;
      wx.setStorageSync("editSkillsObj", '');
    }
    //监听编辑工作经历返回数据
    let expItem = wx.getStorageSync("editExperienceObj");
    if (expItem != '' && expItem != null) {
      if (expItem.index == -1) {
        //新增
        ruleForm.experience.push(expItem.obj);
      } else if (expItem.index == -2) {
        //删除
        ruleForm.experience.splice(expItem.obj, 1);
      } else {
        //修改
        ruleForm.experience[expItem.index] = expItem.obj;
      }
      that.myData.ruleForm = ruleForm;
      let changResumeData = that.changResumeData();//将编辑格式转化成显示格式
      that.setData({
        detail: changResumeData
      })
      wx.setStorageSync("editExperienceObj", '');
    }
    //监听编辑教育经历返回数据
    let eduItem = wx.getStorageSync("editEducationObj");
    if (eduItem != '' && eduItem != null) {
      if (eduItem.index == -1) {
        //新增
        ruleForm.education.push(eduItem.obj);
      } else if (eduItem.index == -2) {
        //删除
        ruleForm.education.splice(eduItem.obj, 1);
      } else {
        //修改
        ruleForm.education[eduItem.index] = eduItem.obj;
      }
      that.myData.ruleForm = ruleForm;
      let changResumeData = that.changResumeData();//将编辑格式转化成显示格式
      that.setData({
        detail: changResumeData
      })
      wx.setStorageSync("editEducationObj", '');
    }
    //监听编辑证书返回数据
    let cerItem = wx.getStorageSync("editCertificateObj");
    if (cerItem != '' && cerItem != null) {
      if (cerItem.index == -1) {
        //新增
        ruleForm.certificate.push(cerItem.obj);
      } else if (cerItem.index == -2) {
        //删除
        ruleForm.certificate.splice(cerItem.obj, 1);
      } else {
        //修改
        ruleForm.certificate[cerItem.index] = cerItem.obj;
      }
      that.myData.ruleForm = ruleForm;
      let changResumeData = that.changResumeData();//将编辑格式转化成显示格式
      that.setData({
        detail: changResumeData
      })
      wx.setStorageSync("editCertificateObj", '');
    }
    //监听编辑比賽返回数据
    let matItem = wx.getStorageSync("editMatchObj");
    if (matItem != '' && matItem != null) {
      if (matItem.index == -1) {
        //新增
        ruleForm.match.push(matItem.obj);
      } else if (matItem.index == -2) {
        //删除
        ruleForm.match.splice(matItem.obj, 1);
      } else {
        //修改
        ruleForm.match[matItem.index] = matItem.obj;
      }
      that.myData.ruleForm = ruleForm;
      let changResumeData = that.changResumeData();//将编辑格式转化成显示格式
      that.setData({
        detail: changResumeData
      })
      wx.setStorageSync("editMatchObj", '');
    }


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
    wx.setStorageSync("editBasicObj", '');
    wx.setStorageSync("editDescObj", '');
    wx.setStorageSync("editSkillsObj", '');
    wx.setStorageSync("editExperienceObj", '');
    wx.setStorageSync("editEducationObj", '');
    wx.setStorageSync("editCertificateObj", '');
    wx.setStorageSync("editMatchObj", '');
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
      language: wx.T.getLanguage('resume'),
      ['nvabarData.title']: wx.T.getLanguage('resume').title
    });
  },

  /**
   * 保存formId
   */
  shareSubmit: function (e) {
    var temp = wx.getStorageSync("userInfo");
    let formId = e.detail.formId;
    if (temp == "" || temp == undefined) { } else {
      if (formId == 'the formId is a mock one' || formId == undefined) { } else {
        util.dealFormIds(formId);
      }
    }
  },

  /**
   * 加载简历修改页面的相关选项基础信息
   */
  resumeBeforeLoad: function () {
    let that = this;
    wx.showLoading({
      title: that.data.language.str1,
      mask: true
    })
    util.request(wx.api.resumeBeforeLoad, {}, 'GET').then(function (res) {
      if (res.success == true) {
        let resData = res.result;
        let langs = resData.language;
        let languageTypes = [];
        let son = [
          {
            value: 1,
            label: that.data.language.str2
          },
          {
            value: 2,
            label: that.data.language.str3
          },
          {
            value: 3,
            label: that.data.language.str4
          }
        ];
        for (let i in langs) {
          languageTypes.push({
            value: langs[i].id,
            label: langs[i].desc,
            desc: langs[i].value,
            children: son
          });
        }

        let huntingStatus = [
          { id: '0', name: that.data.language.str5 },
          { id: '1', name: that.data.language.str6 },
          { id: '2', name: that.data.language.str7 },
          { id: '3', name: that.data.language.str8 },
          { id: '4', name: that.data.language.str9 }
        ]

        that.setData({
          huntingStatus: huntingStatus,//求职意愿选项
          idTypes: resData.idTypes,//证件类别选项
          languageTypes: languageTypes,//语言类别选项
          jobTypes: resData.jobTypes,//工作类别选项
          studyTypes: resData.studyTypes,//学历和专业选项
          workTypes: resData.workTypes//工作经历职位选项
        })
        wx.setStorageSync("resumeOptionType", {
          idTypes: resData.idTypes,//证件类别选项
          languageTypes: languageTypes,//语言类别选项
          jobTypes: resData.jobTypes,//工作类别选项
          studyTypes: resData.studyTypes,//学历和专业选项
          workTypes: resData.workTypes//工作经历职位选项
        });
        that.queryJobHuntingStatus();
        that.loadUserResume();
      } else {
        wx.hideLoading();
        util.showTips(res.message);
      }
    }).catch(function (res) {
      wx.hideLoading();
      util.showErrorToast('网络错误');
    })
  },

  /**
   * 加载用户简历信息
   */
  loadUserResume: function () {
    let that = this;
    util.request(wx.api.loadUserResume, {}, 'GET').then(function (res) {
      wx.hideLoading();
      if (res.success == true) {
        let userInfo = wx.getStorageSync("userInfo");
        if (res.result == null) {
          //用户未填写简历
          that.setData({
            ['detail.chineseName']: userInfo.userInfo.nickname,
            ['detail.imgUrl']: userInfo.userInfo.avatarUrl
          })
          that.myData.ruleForm.chineseName = userInfo.userInfo.nickname;
          return;
        }
        //用户填写了简历,先将简历的格式转成可编辑数据格式
        let {
          chineseName,
          foreignName,
          idType,
          nickname,
          gender,
          phone,
          wechatId,
          birthday,
          height,
          languageSkills,
          description,
          skills,
          details,
          jobPositions
        } = res.result.resumeInfo;
        //语言技能转换格式
        let lang = [];
        for (let i in languageSkills) {
          lang.push({
            language: [
              languageSkills[i].languageId,
              languageSkills[i].status
            ]
          });
        }
        languageSkills = lang;
        //电话号码将区号和号码分开转格式
        let phoneArray = [];
        for (let i in phone) {
          let first = phone[i].indexOf(" "); //区号和手机号的间隔符是空格
          let area = phone[i].substring(0, first);
          let phones = phone[i].substring(first + 1, phone[i].length);
          phoneArray.push({
            area: area,
            phones: phones
          });
        }
        phone = phoneArray;
        //从details中抽取工作经验,学历,证书,比赛活动等内容
        let nowData = that.getNowData();
        let experience = [];
        let education = [];
        let certificate = [];
        let match = [];
        for (let i in details) {
          let organizationName = details[i].organizationName; //组织名称
          let jobTypeId = details[i].jobTypeId; //工作和学历选择的种类ID
          let description = details[i].description; //详细简介
          let title = details[i].title;
          if (details[i].experienceType == 1) {
            //学历
            let times = []; //时间
            if (details[i].dateTo) {
              if (details[i].dateTo != null && details[i].dateTo != "") {
                times = [details[i].dateFrom, details[i].dateTo];
              } else {
                times = [details[i].dateFrom, nowData];
              }
            } else {
              times = [details[i].dateFrom, nowData];
            }
            let studyTypes = that.data.studyTypes;
            let major = []; //学历专业的ID
            for (let a in studyTypes) {
              if (studyTypes[a].son) {
                for (let b in studyTypes[a].son) {
                  if (studyTypes[a].son[b].id == jobTypeId) {
                    major = [studyTypes[a].id, studyTypes[a].son[b].id];
                  }
                }
              }
            }
            education.push({
              times: times,
              organizationName: organizationName,
              major: major,
              description: description
            });
          }
          if (details[i].experienceType == 2) {
            //工作经验
            let times = []; //时间
            if (details[i].dateTo) {
              if (details[i].dateTo != null && details[i].dateTo != "") {
                times = [details[i].dateFrom, details[i].dateTo];
              } else {
                times = [details[i].dateFrom, nowData];
              }
            } else {
              times = [details[i].dateFrom, nowData];
            }
            let workTypes = that.data.workTypes;
            let position = []; //职位
            for (let a in workTypes) {
              if (workTypes[a].son) {
                for (let b in workTypes[a].son) {
                  if (workTypes[a].son[b].id == jobTypeId) {
                    position = [workTypes[a].id, workTypes[a].son[b].id];
                  }
                }
              }
            }
            experience.push({
              times: times,
              organizationName: organizationName,
              position: position,
              description: description
            });
          }
          if (details[i].experienceType == 3) {
            //证书
            certificate.push({
              times: details[i].dateFrom,
              organizationName: organizationName,
              title: title,
              description: description
            });
          }
          if (details[i].experienceType == 4) {
            //比賽,活動,課程
            match.push({
              times: details[i].dateFrom,
              organizationName: organizationName,
              title: title,
              description: description
            });
          }
        }

        let jobPositionsArray = [];
        for (let i in jobPositions) {//理想的工作类别
          jobPositionsArray.push(jobPositions[i].jobTypeId);
        }
        let ruleForm = {
          chineseName: chineseName, //中文姓名
          foreignName: foreignName, //外文姓名
          idType: idType, //证件类别
          nickname: nickname, //惯用称呼
          gender: gender, //性别
          phone: phone, //联系电话
          wechatId: wechatId, //微信号
          birthday: birthday, //出生日期
          height: height, //身高
          languageSkills: languageSkills, //语言
          description: description, //关于我
          skills: skills, //专长和技能
          experience: experience, //工作经验列表
          education: education, //学历认证
          certificate: certificate, //证书认证
          match: match, //比赛活动记录
          jobPositions: jobPositionsArray //理想的工作类别
        };
        that.myData.ruleForm = ruleForm;
        console.log(that.myData.ruleForm)
        let changResumeData = that.changResumeData();//将编辑格式转化成显示格式
        that.setData({
          detail: changResumeData
        })
      } else {
        util.showTips(res.message);
      }
    }).catch(function (res) {
      wx.hideLoading();
      util.showErrorToast('网络错误');
    })
  },

  /**
   * 获取这个月的yyyy-mm-dd日期格式
   */
  getNowData: function () {
    let date = new Date();
    let mon = date.getMonth() + 1;
    let day = date.getDate();
    let nowDay =
      date.getFullYear() + "-" + (mon < 10 ? "0" + mon : mon) + "-01";
    return nowDay;
    //+(day<10?"0"+day:day);
  },

  /**
   * 将yyyy-mm-dd格式转为yyyy.mm
   */
  changDataFormat: function (time) {
    let str = "";
    let last = time.lastIndexOf("-");
    str = time.substring(0, last);
    str = str.replace(/-/g, ".");
    return str;
  },

  /**
   * 将简历信息转化成为可以显示的信息
   */
  changResumeData: function () {
    let that = this;
    let userInfo = wx.getStorageSync("userInfo");
    let ruleForm = that.myData.ruleForm;
    let idTypes = that.data.idTypes;
    let languageTypes = that.data.languageTypes;
    let jobTypes = that.data.jobTypes; //期望的工作类别选项
    let workTypes = that.data.workTypes; //工作经历职位选项
    let studyTypes = that.data.studyTypes; //学历和专业选项
    let resData = {
      imgUrl: userInfo.userInfo.avatarUrl,
      chineseName: ruleForm.chineseName,
      foreignName: ruleForm.foreignName,
      idType: "",
      nickname: ruleForm.nickname,
      gender: ruleForm.gender,
      phone: "",
      wechatId: ruleForm.wechatId,
      birthday: ruleForm.birthday,
      height: ruleForm.height,
      languageSkills: [],
      description: ruleForm.description,
      skills: ruleForm.skills,
      jobPositions: [],
      experience: [], //工作经验
      education: [], //学历资料
      certificate: [], //证书
      match: [] //课程活动比赛
    };
    let phoneStr = "";
    for (let i in ruleForm.phone) {
      //联系电话
      if (i > 0) {
        let str =
          "、" + ruleForm.phone[i].area + " " + ruleForm.phone[i].phones;
        phoneStr += str;
      } else {
        let str = ruleForm.phone[i].area + " " + ruleForm.phone[i].phones;
        phoneStr += str;
      }
    }
    resData.phone = phoneStr;
    for (let i in idTypes) {
      //证件类型
      if (ruleForm.idType == idTypes[i].idType) {
        resData.idType = idTypes[i].name;
      }
    }
    for (let i in ruleForm.languageSkills) {
      //语言
      let language = ruleForm.languageSkills[i].language;
      if (language.length > 1) {
        for (let a in languageTypes) {
          if (language[0] == languageTypes[a].value) {
            for (let b in languageTypes[a].children) {
              if (language[1] == languageTypes[a].children[b].value) {
                let str =
                  languageTypes[a].label +
                  "/" +
                  languageTypes[a].children[b].label;
                resData.languageSkills.push(str);
              }
            }
          }
        }
      }
    }
    for (let i in ruleForm.jobPositions) {
      for (let a in jobTypes) {
        if (ruleForm.jobPositions[i] == jobTypes[a].id) {
          resData.jobPositions.push(jobTypes[a].name);
        }
      }
    }
    for (let i in ruleForm.experience) {
      //工作经验
      let item = ruleForm.experience[i];
      if (item.times != "" && item.position.length > 1) {
        let timeStr =
          that.changDataFormat(item.times[0]) +
          "-" +
          that.changDataFormat(item.times[1]);
        let position = ""; //担任的职位名称
        for (let a in workTypes) {
          if (item.position[0] == workTypes[a].id) {
            for (let b in workTypes[a].son) {
              if (item.position[1] == workTypes[a].son[b].id) {
                position = workTypes[a].name + "/" + workTypes[a].son[b].name;
              }
            }
          }
        }
        resData.experience.push({
          organizationName: item.organizationName,
          position: position,
          times: timeStr,
          description: item.description
        });
      }
    }
    for (let i in ruleForm.education) {
      //学历
      let item = ruleForm.education[i];
      if (item.times != "" && item.major.length > 1) {
        let timeStr =
          that.changDataFormat(item.times[0]) +
          "-" +
          that.changDataFormat(item.times[1]);
        let major = ""; //学历的专业名称
        for (let a in studyTypes) {
          if (item.major[0] == studyTypes[a].id) {
            for (let b in studyTypes[a].son) {
              if (item.major[1] == studyTypes[a].son[b].id) {
                major = studyTypes[a].name + "/" + studyTypes[a].son[b].name;
              }
            }
          }
        }
        resData.education.push({
          organizationName: item.organizationName,
          major: major,
          times: timeStr,
          description: item.description
        });
      }
    }
    for (let i in ruleForm.certificate) {
      //证书
      let item = ruleForm.certificate[i];
      if (item.times != "") {
        let timeStr = that.changDataFormat(item.times);
        resData.certificate.push({
          organizationName: item.organizationName,
          title: item.title,
          times: timeStr,
          description: item.description
        });
      }
    }
    for (let i in ruleForm.match) {
      //课程活动比赛
      let item = ruleForm.match[i];
      if (item.times != "") {
        let timeStr = that.changDataFormat(item.times);
        resData.match.push({
          organizationName: item.organizationName,
          title: item.title,
          times: timeStr,
          description: item.description
        });
      }
    }

    return resData;

  },

  /**
   * 选择头像上传
   */
  chooseImage: function () {
    let that = this;
    let userInfo = wx.getStorageSync('userInfo')
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        for (let index in res.tempFilePaths) {
          if (index == 0) {
            let tempFilesSize = res.tempFiles[index].size; //获取图片的大小，单位B
            if (tempFilesSize <= 2000000) { //图片小于或者等于2M时 可以执行获取图片
              wx.showLoading({
                title: that.data.language.str10,
                mask: true
              })
              wx.uploadFile({
                url: wx.api.uploadAvatar,
                filePath: res.tempFilePaths[index],
                name: 'file',
                header: {
                  'WX-Access-Token': wx.getStorageSync('token'),
                },
                success(re) {
                  console.log('图片上传完成')
                  console.log(re)
                  wx.hideLoading();
                  if (re.data.success == true) {
                    util.showTips(that.data.language.str11, 'success');
                    that.setData({
                      ['detail.imgUrl']: res.tempFilePaths[index]
                    })
                    userInfo.userInfo.avatarUrl = res.tempFilePaths[index];
                  } else {
                    util.showTips(that.data.language.str12);
                  }
                },
                fail(res) {
                  console.log('图片上传失败')
                  console.log(res)
                  wx.hideLoading();
                }
              })

            } else {
              util.showTips(that.data.language.str13);
            }
          }
        }
      }
    })
  },

  /**
   * 跳转到编辑个人信息
   */
  linkToEditBasic: function () {
    let that = this;
    wx.setStorageSync("editBasicObj", that.myData.ruleForm);
    wx.navigateTo({
      url: '/packageA/pages/edit/editBasic/editBasic'
    })
  },

  /**
   * 跳转到编辑自我介绍
   */
  linkToEditDesc: function () {
    let that = this;
    wx.setStorageSync("editDescObj", that.data.detail.description);
    wx.navigateTo({
      url: '/packageA/pages/edit/editDesc/editDesc'
    })
  },

  /**
   * 跳转到编辑专长和技能
   */
  linkToEditSkills: function () {
    let that = this;
    wx.setStorageSync("editSkillsObj", that.data.detail.skills);
    wx.navigateTo({
      url: '/packageA/pages/edit/editSkills/editSkills'
    })
  },

  /**
   * 跳转到编辑工作经历
   */
  linkToEditExperience: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    if (index != '-1') {//-1表示新增
      let editItem = {
        index: index,
        obj: that.myData.ruleForm.experience[index]
      }
      wx.setStorageSync("editExperienceObj", editItem);
    } else {
      wx.setStorageSync("editExperienceObj", '');
    }
    wx.navigateTo({
      url: '/packageA/pages/edit/editExperience/editExperience'
    })
  },

  /**
   * 跳转到编辑教育经历
   */
  linkToEditEducation: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    if (index != '-1') {//-1表示新增
      let editItem = {
        index: index,
        obj: that.myData.ruleForm.education[index]
      }
      wx.setStorageSync("editEducationObj", editItem);
    } else {
      wx.setStorageSync("editEducationObj", '');
    }
    wx.navigateTo({
      url: '/packageA/pages/edit/editEducation/editEducation'
    })
  },

  /**
   * 跳转到编辑证书
   */
  linkToEditCertificate: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    if (index != '-1') {//-1表示新增
      let editItem = {
        index: index,
        obj: that.myData.ruleForm.certificate[index]
      }
      wx.setStorageSync("editCertificateObj", editItem);
    } else {
      wx.setStorageSync("editCertificateObj", '');
    }
    wx.navigateTo({
      url: '/packageA/pages/edit/editCertificate/editCertificate'
    })
  },

  /**
   * 跳转到编辑課程/比賽/活動经历
   */
  linkToEditMatch: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    if (index != '-1') {//-1表示新增
      let editItem = {
        index: index,
        obj: that.myData.ruleForm.match[index]
      }
      wx.setStorageSync("editMatchObj", editItem);
    } else {
      wx.setStorageSync("editMatchObj", '');
    }
    wx.navigateTo({
      url: '/packageA/pages/edit/editMatch/editMatch'
    })
  },

  /**
   * 保存简历前先检查
   */
  checkSaveResume: function () {
    let that = this;
    let ruleForm = JSON.parse(JSON.stringify(that.myData.ruleForm));
    if (ruleForm.birthday == '') {
      util.showTips(that.data.language.str14);
      return;
    }
    if (ruleForm.description == '') {
      util.showTips(that.data.language.str15);
      return;
    }
    if (ruleForm.skills == '') {
      util.showTips(that.data.language.str16);
      return;
    }
    if (ruleForm.education.length == 0) {
      util.showTips(that.data.language.str17);
      return;
    }

    let details = [];
    for (let i in ruleForm.education) {
      //学历列表
      let title = "";
      let studyTypes = that.data.studyTypes;
      let jobTypeId = ruleForm.education[i].major[1]; //学历专业的ID
      for (let a in studyTypes) {
        if (studyTypes[a].son) {
          for (let b in studyTypes[a].son) {
            if (studyTypes[a].son[b].id == jobTypeId) {
              title =
                studyTypes[a].name + "/" + studyTypes[a].son[b].name;
            }
          }
        }
      }
      let detailsObj = {
        dateFrom: ruleForm.education[i].times[0],
        dateTo: ruleForm.education[i].times[1],
        description: ruleForm.education[i].description,
        experienceType: 1,
        jobTypeId: jobTypeId,
        organizationName: ruleForm.education[i].organizationName,
        title: title
      };
      details.push(detailsObj);
    }

    for (let i in ruleForm.experience) {
      //工作经历列表
      let title = "";
      let workTypes = that.data.workTypes;
      let jobTypeId = ruleForm.experience[i].position[1]; //工作职位的ID
      for (let a in workTypes) {
        if (workTypes[a].son) {
          for (let b in workTypes[a].son) {
            if (workTypes[a].son[b].id == jobTypeId) {
              title = workTypes[a].name + "/" + workTypes[a].son[b].name;
            }
          }
        }
      }
      let detailsObj = {
        dateFrom: ruleForm.experience[i].times[0],
        dateTo: ruleForm.experience[i].times[1],
        description: ruleForm.experience[i].description,
        experienceType: 2,
        jobTypeId: jobTypeId,
        organizationName: ruleForm.experience[i].organizationName,
        title: title
      };
      details.push(detailsObj);
    }

    for (let i in ruleForm.certificate) {
      //证书列表
      let detailsObj = {
        dateFrom: ruleForm.certificate[i].times,
        description: ruleForm.certificate[i].description,
        experienceType: 3,
        jobTypeId: 0,
        organizationName: ruleForm.certificate[i].organizationName,
        title: ruleForm.certificate[i].title
      };
      details.push(detailsObj);
    }

    for (let i in ruleForm.match) {
      //比賽,活動,課程列表
      let detailsObj = {
        dateFrom: ruleForm.match[i].times,
        description: ruleForm.match[i].description,
        experienceType: 4,
        jobTypeId: 0,
        organizationName: ruleForm.match[i].organizationName,
        title: ruleForm.match[i].title
      };
      details.push(detailsObj);
    }
    ruleForm.details = details;
    let jobPositions = [];
    for (let i in ruleForm.jobPositions) {
      jobPositions.push({
        jobTypeId: ruleForm.jobPositions[i]
      });
    }
    ruleForm.jobPositions = jobPositions;
    //语言数组
    let languageSkills = [];
    for (let i in ruleForm.languageSkills) {
      languageSkills.push({
        languageId: ruleForm.languageSkills[i].language[0],
        status: ruleForm.languageSkills[i].language[1]
      });
    }
    ruleForm.languageSkills = languageSkills;
    //联系电话合并转数组
    let phone = [];
    for (let i in ruleForm.phone) {
      let phoneStr =
        ruleForm.phone[i].area + " " + ruleForm.phone[i].phones;
      phone.push(phoneStr);
    }
    ruleForm.phone = phone;
    delete ruleForm.experience;
    delete ruleForm.education;
    delete ruleForm.certificate;
    delete ruleForm.match;
    this.saveResume(ruleForm);

  },

  /**
   * 保存简历信息
   */
  saveResume: function (ruleForm) {
    let that = this;
    wx.showLoading({
      title: that.data.language.str18,
      mask: true
    })
    util.request(wx.api.saveResume, ruleForm, 'POST').then(function (res) {
      wx.hideLoading();
      if (res.success == true) {
        util.showTips(that.data.language.str19, 'success');
        that.editJobHuntingStatus();
        //更新用户昵称
        let userInfo = wx.getStorageSync("userInfo");
        userInfo.completeResume = true;
        userInfo.userInfo.nickname = ruleForm.nickname;
        wx.setStorageSync("userInfo", userInfo);
        setTimeout(function () {
          wx.navigateBack();
        }, 1000);
      } else {
        util.showTips(res.message);
      }
    }).catch(function (res) {
      wx.hideLoading();
      util.showErrorToast('网络错误');
    })
  },

  /**
   * 查询用户个人求职意愿和是否显示和隐藏简历
   */
  queryJobHuntingStatus: function () {
    let that = this;
    let huntingStatus = that.data.huntingStatus;
    util.request(wx.api.queryJobHuntingStatus, {}, 'GET').then(function (res) {
      if (res.success == true) {
        let jobHuntingStatus = res.result.jobHuntingStatus.toString();
        let interest = 0;
        for (let i in huntingStatus) {
          if (huntingStatus[i].id == jobHuntingStatus) {
            interest = i;
          }
        }
        that.setData({
          interest: interest
        })
      } else {
        util.showTips(res.message);
      }
    }).catch(function (res) {
      util.showErrorToast('网络错误');
    })
  },


  /**
   * 修改用户个人求职意愿
   */
  editJobHuntingStatus: function () {
    let that = this;
    let huntingStatus = that.data.huntingStatus;
    let status = 0;
    let interest = that.data.interest;
    status = huntingStatus[interest].id;
    util.request(wx.api.editJobHuntingStatus, { status: status }, 'GET').then(function (res) {
      if (res.success == true) {
      } else {
        util.showTips(res.message);
      }
    }).catch(function (res) {
      util.showErrorToast('网络错误');
    })
  },

  bindDateChange: function (e) {
    let that = this;
    let name = e.currentTarget.dataset.name;
    that.setData({
      [name]: e.detail.value
    })
    if (name == 'interest') {
      that.editJobHuntingStatus();
    }
  }

})