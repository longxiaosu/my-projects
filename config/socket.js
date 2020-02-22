let ws = {}; //WebSocket 任务
let reconnect = true; //判断是否需要进行socket重新连接
let limit = 0; //最大重连次数
let timers = null;
let lockReconnect = false;
let heartCheck = {
    timeout: 5000, //10秒发一次心跳重连
    timeoutObj: null, //清除定时器用的对象
    serverTimeoutObj: null,
    reset: function () { //重置定时器
        clearTimeout(this.timeoutObj);
        clearTimeout(this.serverTimeoutObj);
        return this;
    },
    start: function () { //发送心跳重连
        this.timeoutObj = setTimeout(() => {
            // console.log('发送ping')
            //发送ping
            ws.send({
                data: 'ping',
                success(res) { }
            })
            this.serverTimeoutObj = setTimeout(() => {
                console.log('没收到回应，手动关闭触发ws.onClose')
                //没收到ping数据,自动断开重连
                ws.close();
            }, this.timeout);
        }, this.timeout);
    }
};

/**
 * 初始化连接Socket
 */
function linkSocket() {
    let userInfo = wx.getStorageSync('userInfo');
    if (userInfo == null || userInfo == '') {
        console.log('没有用户登陆，不连接socket')
        return;
    }
    if (ws.readyState !== 0 && ws.readyState !== 1) { } else {
        console.log('已经连接上了socket,不重复连接')
        return;
    }

    let socketLink = wx.api.chatSocket + "?userId=" + userInfo.userInfo.userId + "&role=0";//0-求职者 1-招者
    reconnect = true;
    console.log('开始连接socket')
    ws = wx.connectSocket({
        url: socketLink,
        success() {
            limit = 0;//将重连次数清零
        }
    })

    ws.onOpen(function () {
        // var sendObj = { //
        //   type: 2,
        //   msg: 'room'
        // };
        // sendObj = JSON.stringify(sendObj);
        // console.log('ws.send')
        // console.log(sendObj);
        //发送参数
        // ws.send({ 
        //   data: sendObj,
        //   success(res) { },
        //   fail(res) { }
        // })
        heartCheck.reset().start() //开启心跳重连
    })

    //接收数据
    ws.onMessage(function (res) {
        heartCheck.reset().start()
        if (res.data == 'pong') {
            return;
        }
        var objData = JSON.parse(res.data);


        let msgNum = objData.msgNum;//有新消息的提示,显示小红点
        if (typeof msgNum != "undefined"){
            if (objData.msgNum == 0) {
                wx.removeTabBarBadge({ index: 2 })
            } else {
                wx.setTabBarBadge({
                    index: 2,
                    text: String(objData.msgNum)
                })
            }
        }
        let applyNum = objData.applyNum;//有新的工作申请消息的提示,显示小红点
        if (typeof applyNum != "undefined"){
            if (objData.applyNum == 0) {
                wx.removeTabBarBadge({ index: 3 })
            } else {
                wx.setTabBarBadge({
                    index: 3,
                    text: String(objData.applyNum)
                })
            }
            wx.setStorageSync('applyNum', objData.applyNum)
            wx.event.emit('socketApplyNum', objData);
        }

        
        if (objData.companyName !== undefined&&objData.fromUserId != userInfo.userInfo.userId) {
            //发过来的消息,只处理别人发过来的消息，自己发出去的消息暂不处理
            console.log('接收信息')
            console.log(objData)
            wx.event.emit('socketReceive', objData);
        }

    })

    //连接失败
    ws.onError(function () {
        console.log('ws.onError')
        if (reconnect == true) {
            reConnected();
        }
    })

    //监听ws.close()事件
    ws.onClose((res) => {
        console.log('ws.onClose')
        if (reconnect == true) {
            reConnected();
        }
    })

}

/**
 * 断线重连,设置一个锁和最大的重连次数，避免无限重连，5秒重试一次，最多请求10次
 */
function reConnected() {
    if (lockReconnect) {
        return;
    }
    lockReconnect = true;
    clearTimeout(timers);
    if (limit < 10) {
        timers = setTimeout(() => {
            linkSocket();
            lockReconnect = false;
        }, 5000);
        limit = limit - 0 + 1;
    }
}

/**
 * 关闭连接
 */
function closeSocket() {
    reconnect = false;//避免触发重新连接
    heartCheck.reset();
    wx.removeTabBarBadge({ index: 2 })
    wx.removeTabBarBadge({ index: 3 })
    if (ws.readyState) {
        ws.close();
    }
}

module.exports = {
    linkSocket,
    closeSocket
}