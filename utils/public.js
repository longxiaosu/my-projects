const util = require('../utils/util.js');
const pageManager = require('../utils/pageManager');
const app = getApp();


/**
 * /判断 val 字符串是否存在于 arr 数组中,存在返回true 否则false
 * @param {*} arr 
 * @param {*} val 
 */
function IsInArray(arr, val) {
    var testStr = ',' + arr.join(",") + ",";
    return testStr.indexOf("," + val + ",") != -1;
}

/**
 * 判断首页参数跳转
 */
function checkOptions(options) {
    if (options.fromUserId) {

    }

    if (options.url) {
        if (options.url == 'jobDetail' && options.id) {
            //工作详情页面
            wx.navigateTo({
                url: '/packageA/pages/jobDetail/jobDetail?id=' + options.id
            })
        } else if (options.url == 'company' && options.id) {
            //公司详情页面
            wx.navigateTo({
                url: '/packageA/pages/company/company?id=' + options.id
            })
        }
    }

    if (options.q) { //从二维码跳转进来
        var q = decodeURIComponent(options.q)
        if (q != 'undefined') {
            let urlStr = util.getStr(q, '?');
            console.log(urlStr);
            if (urlStr == 'https://66order.cn/share') {
                //通过二维码邀请新用户进来
                let code = util.getQueryString(q, 'code');
                let item = {
                    shareCode: code,
                    send: 0 //0表示还未发送请求
                }
                if (userId == '' || userId == undefined) {
                    wx.setStorageSync("stepCodeShare", item);
                }
            }
            if (urlStr == 'https://66order.cn/coupon') {
                //跳转到店铺里面的优惠券
                let code = util.getQueryString(q, 'code');
                wx.navigateTo({
                    url: '/pages/index/store/coupon?code=' + code
                })
            }
            if (urlStr == 'https://66order.cn/store') {
                //跳转到店铺
                let code = util.getQueryString(q, 'code');
                wx.navigateTo({
                    url: '/pages/index/store?code=' + code
                })
            }
            if (urlStr == 'https://66order.cn/shop') {
                //跳转到店铺签到
                let code = util.getQueryString(q, 'code');
                wx.navigateTo({
                    url: '/pages/index/store?enterCode=' + code
                })
            }
            if (urlStr == 'https://66order.cn/note') {
                //跳转到食评文章
                let code = util.getQueryString(q, 'code');
                wx.navigateTo({
                    url: '/pages/index/web?code=' + code
                })
            }
            if (urlStr == 'https://eat1bo.com/order') {
                //扫码点餐进来
                if (q.indexOf('https://eat1bo.com/order?table=') != -1) {
                    let tableCode = util.getQueryString(q, 'table');
                    app.globalData.tableCode = tableCode;
                    wx.navigateTo({
                        url: '/pages/index/store?tableCode=' + tableCode
                    })
                } else {
                    let code = q.split('https://eat1bo.com/order?table')
                    app.globalData.tableCode = code[1];
                    wx.navigateTo({
                        url: '/pages/index/store?tableCode=' + code
                    })
                }
            }
            if (urlStr == 'https://66order.cn/recommend') {
                //用来判断推广人邀请用户进来的积分
                let code = util.getQueryString(q, 'code');
                wx.setStorageSync('recommendCode', code);
            }
            if (urlStr == 'https://66order.cn/purchaseCoupon') {
                //跳转抢购福利券详情
                let code = util.getQueryString(q, 'code');
                preCouponDetail('', code);
                wx.navigateTo({
                    url: '/packageA/pages/priceCoupon/detail?code=' + code
                })
            }
        }
    }

}

/**
 * 预加载工作详情jobDetail
 */
function preQueryJobDetail(jobId, saveName) {
    let userId = '';
    let userInfo = wx.getStorageSync("userInfo");
    if (userInfo != '' && userInfo != null) {
        userId = userInfo.userInfo.userId;
    }
    pageManager.putData(saveName, util.request(wx.api.queryJobDetail, {
        jobId: jobId,
        userId: userId
    }, 'GET'));
}

/**
 * 预加载公司详情companyDetail  
 */
function preQueryCompany(companyId, saveName) {
    let userId = '';
    let userInfo = wx.getStorageSync("userInfo");
    if (userInfo != '' && userInfo != null) {
        userId = userInfo.userInfo.userId;
    }
    pageManager.putData(saveName, util.request(wx.api.queryCompany, {
        companyId: companyId,
        userId: userId
    }, 'GET'));
}

/**
 * 预加载聊天详情chatMsgDetail
 */
function preChatMsgDetail(saveName) {
    let chatObj = wx.getStorageSync("chatObj");
    pageManager.putData(saveName, util.request(wx.api.queryChatMsgDetail, {
        current: 1,
        size: 50,
        userType: 0,
        companyId: chatObj.companyId,
        jobId: chatObj.jobId,
        otherUserId: chatObj.receiverId
    }, 'POST'));
}


/**
 * 预加载求职者查询当前已申请的工作和公司的邀请queryApplies
 */
function preQueryApplies(saveName) {
    pageManager.putData(saveName, util.request(wx.api.queryApplies, {
        current: 1,
        size: 20
    }, 'POST'));
}


module.exports = {
    IsInArray,
    checkOptions,
    preQueryJobDetail,
    preQueryCompany,
    preChatMsgDetail,
    preQueryApplies
}