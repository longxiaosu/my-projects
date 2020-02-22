// 本地服务器API地址
// var baseURL = 'http://192.168.3.15:8083/recruit';
// var baseSocketURL = 'ws://192.168.3.15:8084/recruit';

// 线上服务器地址
var baseURL = 'https://www.fastfindjob.com/recruit';
var baseSocketURL = 'wss://www.fastfindjob.com/recruit'


module.exports = {
  LoginByWeixin: baseURL + '/wx/user/code2Session', //微信登录
  login: baseURL + '/wx/user/login', //登录获得用户信息
  articleList: baseURL + '/open/jobInfo/article/list', //查询新闻列表
  articleDetail: baseURL + '/open/jobInfo/article/detail', //查询新闻详情
  resumeBeforeLoad: baseURL + '/resumeInfo/beforeLoad', //加载简历修改页面的相关选项基础信息get
  loadUserResume: baseURL + '/resumeInfo/loadResume',//加载当前用户的个人简历信息(编辑页面)
  saveResume: baseURL + '/resumeInfo/saveResume',//保存和修改用户简历post
  editJobHuntingStatus: baseURL + '/resumeInfo/editJobHuntingStatus',//修改用户个人求职意愿(编辑页面)get
  queryJobHuntingStatus: baseURL + '/resumeInfo/queryJobHuntingStatus',//查询用户个人求职意愿和是否显示和隐藏简历get
  editResumeHidden: baseURL + '/resumeInfo/editResumeHidden',//修改是否隐藏简历，不让雇主看到
  uploadAvatar: baseURL + '/resumeInfo/uploadAvatar',//用户上传简历头像
  loadPreQuery: baseURL + '/open/jobInfo/loadPreQuery',//查询职位列表前加载基础选项信息get
  queryJobs: baseURL + '/open/jobInfo/queryJobs',//查询职位列表post
  queryCompanies: baseURL + '/open/jobInfo/queryCompanies',//查询公司列表post
  queryJobDetail: baseURL + '/open/jobInfo/queryJobDetail',//查询职位详情get
  queryCompany: baseURL + '/open/jobInfo/queryCompany',//查询公司详情get
  queryUserResume: baseURL + '/jobApply/queryUserResume',//求职者点击申请工作前先加载用户的简历信息get
  submission: baseURL + '/jobApply/submission',//求职者点击申请工作get
  sendMessage: baseURL + '/jobApply/sendMessage',//求职者在工作详情页面发送普通消息给公司post
  queryChatMsgs: baseURL + '/sysMessage/queryChatMsgs',//分页查询聊天列表post
  queryChatMsgDetail: baseURL + '/sysMessage/queryChatMsgDetail',//分页查询聊天详情post
  chatSocket: baseSocketURL + '/connect',//在线聊天socket
  sysSendMessage: baseURL + '/sysMessage/sendMessage',//求职者在消息页面发送消息给对方post
  queryApplies: baseURL + '/jobApply/queryApplies',//求职者查询当前已申请的工作和公司的邀请post
  acceptApply: baseURL + '/jobApply/acceptApply',////求职者接受公司邀请get
  rejectApply: baseURL + '/jobApply/rejectApply',//求职者拒绝公司邀请get
  cancelApply: baseURL + '/jobApply/cancelApply',//求职者撤回自己的申请get
  bindMail: baseURL + '/jobUser/bindMail',//用户绑定邮箱(求职者)post
  querySwitch: baseURL + '/open/jobInfo/querySwitch'//控制真假显示
};