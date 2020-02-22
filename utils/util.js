var api = require('../config/api.js');
var app = getApp();
var QQMapWX = require('qqmap-wx-jssdk.js');
var qqmapsdk = new QQMapWX({
  key: '6AGBZ-X77RV-IDUPG-UL5JW-CHKZF-LNFDR'
});
let getQueryString = function (url, name) {
  var reg = new RegExp('(^|&|/?)' + name + '=([^&|/?]*)(&|/?|$)', 'i')
  var r = url.substr(1).match(reg)
  if (r != null) {
    return r[2]
  }
  return null;
}

/**
 * Request请求封装
 */
function request(url, data = {}, method = "GET") {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: url,
      data: data,
      method: method,
      header: {
        'Content-Type': 'application/json;charset=UTF-8',
        'WX-Access-Token': wx.getStorageSync('token'),
      },
      success: function (res) {
        // console.log('--------------------------')
        // console.log(res)
        // console.log('--------------------------')
        if (res.statusCode == 500) {
          // 清除登录相关内容
          wx.removeStorageSync('userInfo');
          wx.removeStorageSync('token');
          wx.socketConnectTask.closeSocket();
          reject(res.data.message);
          wx.showModal({
            title: '',
            content: '登入過期，請重新登入',
            showCancel: false,
            cancelColor: '#999999',
            confirmColor: '#16B38A',
            success(res) {
              if (res.confirm) {
                wx.switchTab({
                  url: '/pages/index/index'
                });
              }
            }
          })
        } else if (res.statusCode == 200) {
          if (res.header['WX-Access-Token']) {
            wx.setStorageSync('token', res.header['WX-Access-Token']);
          }
          if (res.header['wx-access-token']) {
            wx.setStorageSync('token', res.header['wx-access-token']);
          }
          if (res.data.code == '500') {
            // 返回错误
            resolve(res.data);
          } else {
            resolve(res.data);
          }
        } else {
          reject(res.errMsg);
        }
      },
      fail: function (err) {
        showErrorToast("请尝试切换网络");
        reject(err)
      }
    })
  });
}

/**
 * 保存表单formId到服务器,发送模板消息的时候使用
 * @param {*} formId 
 */
function dealFormIds(formId) {
  return;
  if (formId == '' || formId == 'undefined') {
    return;
  }
  let data = {
    formid: formId,
    expiretime: parseInt(new Date().getTime() / 1000) + 604800 //计算7天后的过期时间时间戳
  }
  var time = formatTime(parseInt(new Date().getTime()) + 604800000, "Y-M-D h:m:s");
  request(api.SaveFormId, {
    userId: wx.getStorageSync("userId"),
    formIds: formId,
    expiretime: time
  }, 'POST').then(function (res) { })
}

/**
 * 时间戳转化为年 月 日 时 分 秒
 * number: 传入时间戳
 * format：返回格式，支持自定义，但参数必须与formateArr里保持一致
 */
function formatTime(number, format) {
  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  var returnArr = [];
  var date = new Date(number);
  returnArr.push(date.getFullYear());
  returnArr.push(formatNumber(date.getMonth() + 1));
  returnArr.push(formatNumber(date.getDate()));
  returnArr.push(formatNumber(date.getHours()));
  returnArr.push(formatNumber(date.getMinutes()));
  returnArr.push(formatNumber(date.getSeconds()));
  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 判断是否跳到登陆页面和不登陆需要返回的tab路径
 * @param {*是否跳到登录页} hasLinkLogin 
 * @param {*登录页} url 
 * @param {*不登陆返回的页面} backIndex 
 */
function linkToLogin(hasLinkLogin, url = '/pages/index/login', backIndex = '/pages/index/index') {
  return new Promise(function (resolve, reject) {
    var temp = wx.getStorageSync("userInfo");
    if (temp == "" || temp == undefined) {
      if (hasLinkLogin) {
        wx.navigateTo({
          url: url
        })
      } else {
        wx.switchTab({
          url: backIndex
        })
      }
    } else {
      resolve('next');
    }
  })
}

/**
 * 判断是否登录了
 */
function checkToLogin() {
  return new Promise(function (resolve, reject) {
    let userInfo = wx.getStorageSync("userInfo");
    if (userInfo == "" || userInfo == undefined) {
      reject('toLogin')//如果没登陆返回一个错误
    } else {
      resolve('next');
    }
  })
}

/**
 * 将多组网络图片下载到本地路径来进行画图
 * @param {*图片数组} list 
 */
function getImageListInfo(list) {
  return new Promise(function (resolve, reject) {
    let localList = [];
    for (let i in list) {
      wx.getImageInfo({ // 下载背景图
        src: list[i],
        success: res => {
          console.log('下标  ' + i)
          console.log(res.path)
          localList.push({
            id: i,
            path: res.path,
            w: res.width,
            h: res.height
          });
          if (localList.length == list.length) {
            localList.sort(sortRule);
            resolve(localList);
          }
        },
        fail: res => {
          showTips('图片下载失败, 请检查网络');
          reject('failed');
        }
      })
    }
    if (list.length == 0) {
      resolve(list);
    }
  })
}

/**
 * 上传完图片,根据ID排序
 */
function sortRule(a, b) {
  return a.id - b.id;
}

/**
 * 时间戳转换成对应当前时间字符串显示
 * @param {*时间戳} date 
 */
function dateStr(date) {
  var time = new Date().getTime(); //获取当前时间的时间戳
  time = parseInt((time - date) / 1000);
  //存储转换值 
  var s;
  if (time < 60 * 1) { //一分钟内
    return '刚刚';
  } else if ((time < 60 * 60) && (time >= 60 * 1)) {
    //超过一分钟少于1小时
    s = Math.floor(time / 60);
    return s + "分钟前";
  } else if ((time < 60 * 60 * 24) && (time >= 60 * 60)) {
    //超过1小时少于24小时
    s = Math.floor(time / 60 / 60);
    return s + "小时前";
  } else if ((time < 60 * 60 * 24 * 30) && (time >= 60 * 60 * 24)) {
    //超过1天少于30天内
    s = Math.floor(time / 60 / 60 / 24);
    return s + "天前";
  } else if ((time < 60 * 60 * 24 * 365) && (time >= 60 * 60 * 24 * 30)) {
    //超过30天少于365天内
    s = Math.floor(time / 60 / 60 / 24 / 30);
    return s + "个月前";
  } else {
    //超过365天
    // var date = new Date(parseInt(date) * 1000);
    var date = new Date(date);
    return date.toLocaleDateString().replace(/\//g, "-") + '\xa0\xa0' + date.toTimeString().substr(0, 8)
    // return date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
  }
}

/**
 * 传入日期（XXXX-XX-XX格式）与当前日期比较
 * @param {*} myDate 
 */
function compareDate(myDate) {
  var d = new Date();
  var formatDate = function (date) {
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    return y + '-' + m + '-' + d;
  }
  var today = formatDate(d);
  d.setTime(d.getTime() + 24 * 60 * 60 * 1000);
  var tomorrow = formatDate(d);
  if (myDate === today) {
    return "今天";//是当前日期
  } else if (myDate === tomorrow) {
    return "明天";//非当前日,是明天
  } else {
    return myDate;//非当前日期，直接返回日期
  }
}

/**数组根据数组对象中的某个属性值进行排序的方法 
     * 使用例子：newArray.sort(sortBy('number',false)) //表示根据number属性降序排列;若第二个参数不传递，默认表示升序排序
     * @param attr 排序的属性 如number属性
     * @param rev true表示升序排列，false降序排序
     * */
function sortBy(attr, rev) {
  //第二个参数没有传递 默认升序排列
  if (rev == undefined) {
    rev = 1;
  } else {
    rev = (rev) ? 1 : -1;
  }

  return function (a, b) {
    a = a[attr];
    b = b[attr];
    if (a < b) {
      return rev * -1;
    }
    if (a > b) {
      return rev * 1;
    }
    return 0;
  }
}

/**
 * 对比微信版本号
 * @param {最新的版本} v1 
 * @param {要求的最低版本} v2 
 */
function compareVersion(v1, v2) {
  v1 = v1.split('.')
  v2 = v2.split('.')
  const len = Math.max(v1.length, v2.length)
  while (v1.length < len) {
    v1.push('0')
  }
  while (v2.length < len) {
    v2.push('0')
  }
  for (let i = 0; i < len; i++) {
    const num1 = parseInt(v1[i])
    const num2 = parseInt(v2[i])
    if (num1 > num2) {
      return 1
    } else if (num1 < num2) {
      return -1
    }
  }
  return 0
}

/**
 * wx.showToast封装
 * @param {*} msg 
 * @param {*} icon 
 * @param {*显示时长} time 
 */
function showTips(msg, icon = 'none', time = 1500) {
  wx.showToast({
    title: msg,
    icon: icon,
    duration: time
  })
}

/**
 * 显示错误提示
 * @param {*} msg 
 */
function showErrorToast(msg) {
  wx.showToast({
    title: msg,
    image: '/assets/pngs/icon_error.png',
    duration: 1500
  })
}


/**
 * 发生错误,返回上一页
 */
function linkToBack(str = '服务器未响应') {
  wx.showModal({
    content: str,
    showCancel: false,
    confirmColor: '#16B38A',
    success(res) {
      if (res.confirm) {
        wx.navigateBack();
      }
    }
  })
}


module.exports = {
  request,
  getQueryString,
  dealFormIds,
  linkToLogin,
  checkToLogin,
  compareVersion,
  showTips,
  showErrorToast,
  getImageListInfo,
  dateStr,
  compareDate,
  sortBy,
  linkToBack
}


// wx.showModal({
//   content: content,
//   showCancel: true,
//   cancelText: language.str2,
//   cancelColor: '#999999',
//   confirmText: language.str3,
//   confirmColor: '#16B38A',
//   success(res) {
//     if (res.confirm) {
//       wx.navigateTo({
//         url: '/packageA/pages/resume/resume'
//       })
//     }
//   }
// })