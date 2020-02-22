// 本地服务器API地址
// var WxApiRoot = 'http://192.168.31.175:8010/wx/client/';
// var PayApi = 'http://192.168.31.175:8082/eat1bo_system/';
// var socketApi = 'ws://192.168.31.175:8083/';

// 线上服务器地址
var WxApiRoot = 'https://www.eat2bo.com/wx/client/';
var PayApi = 'https://www.eat2bo.com/eat1bo_system/';
var socketApi = 'wss://www.eat2bo.com/';

// 图片压缩的后缀
var indexMini = "?x-oss-process=style/note";
var noteDetail = "?x-oss-process=style/notedetail";

module.exports = {
  step: {
    getWeRunData: WxApiRoot + "step/getWeRunData", //获取当天步数和已经完成的任务
    getWeRunDataHistory: WxApiRoot + "step/getWeRunDataHistory", //获取卡路里记录
    finishMission: WxApiRoot + "step/finishMission",//点击泡泡确认完成任务
    openShare: WxApiRoot + "step/openShare",//用户打开他人分享的小程序
    addToMyDesktop: WxApiRoot + "step/addToMyDesktop",//完成添加到我的小程序任务
    signInfo: WxApiRoot + "step/signInfo",//加载当前用户的签到信息
    sign: WxApiRoot + "step/sign",//每日签到获取步数
    queryStepToLove: WxApiRoot + "step/queryStepToLove",//查询当前步数能够兑换成多少爱心值
    stepToLove: WxApiRoot + "step/stepToLove",//当天步数兑换爱心值
    userLoveRecords: WxApiRoot + "step/userLoveRecords",//查询爱心值记录
    getPhone: WxApiRoot + "step/getPhone",//获取绑定的手机号,完成手机绑定任务
    loadMissions: WxApiRoot + "step/loadMissions", //读取任务列表
    loadQuestion: WxApiRoot + "step/loadQuestion", //加载问题列表
    answerQuestion: WxApiRoot + "step/answerQuestion", //回答问题
    shareQuestion: WxApiRoot + "step/shareQuestion", //回答问题好友助力
    viewAd: WxApiRoot + "step/viewAd",//观看激励
    queryTopLoveProducts: WxApiRoot + "shop/product/queryTopLoveProducts",///查询爱心值的首页置顶商品列表
    queryLoveProducts: WxApiRoot + "shop/product/queryLoveProducts",//查询爱心值可以兑换的商品列表
    loveProductDetail: WxApiRoot + "shop/product/loveProductDetail",//爱心商品详情
    buildTeam: WxApiRoot + "loveGood/buildTeam",//创建一个团队(拼团商品)88
    loadCollaboration: WxApiRoot + "loveGood/loadCollaboration",//查询团队信息(拼团商品)88
    acceptInvitation: WxApiRoot + "loveGood/acceptInvitation",//接受加入团队邀请(拼团商品)88
    queryLoveNumRange: WxApiRoot + "loveGood/queryLoveNumRange",//查询团队成员爱心值出价范围88
    giveLoveNum: WxApiRoot + "loveGood/giveLoveNum",//团队成员奉献出爱心值88
    sendClockOnMsg: WxApiRoot + "loveGood/sendClockOnMsg",//发送打卡通知给团员88
    removeMember: WxApiRoot + "loveGood/removeMember",//踢出团员或团员自己退出88
    disbandTeam: WxApiRoot + "loveGood/disbandTeam",//解散团队88
    collaborationRecords: WxApiRoot + "loveGood/collaborationRecords",//查询团队爱心值记录88
    rankList: WxApiRoot + "loveGood/rankList",//团队排名(get请求)
    myTeams: WxApiRoot + "loveGood/myTeams",//我的团队
    queryShareInfo: WxApiRoot + "step/queryShareInfo",//查询分享信息
    buyLoveProduct: WxApiRoot + "shop/product/buyLoveProduct",//购买爱心商品或爱心优惠券
    createTeamQr: WxApiRoot + "loveGood/createTeamQr"//生成团队邀请二维码
  },
  game:{
    linkGame: socketApi + 'game', //连接组队答题的socket
    changePostion: WxApiRoot + "game/changePostion",//房主关闭队伍的座位
    removeMember: WxApiRoot + "game/removeMember",//房主踢出成员
    exitRoom: WxApiRoot + "game/exitRoom",//玩家退出房间
    exchangeTeam: WxApiRoot + "game/exchangeTeam"//玩家交换位置
  },
  charity: {
    queryLoveContributions: WxApiRoot + "loveContribution/queryLoveContributions",//分页查找慈善列表
    queryLoveContributionDetail: WxApiRoot + "loveContribution/queryLoveContributionDetail",//查询慈善项目详情
    giveLoveNum: WxApiRoot + "loveContribution/giveLoveNum"//用户捐款慈善
  },

  
  indexMini: indexMini,
  noteDetail: noteDetail
};