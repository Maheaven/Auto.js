var netutils = {}

var user_key

var loginThread

var imgUploadTime = 5 * 1000

var heartTime = 20 * 1000

var heartTimer = 0

var timer = 0

//正式
var URL = "139.9.66.11:8080"
//测试
// var URL = "192.168.196.188:8091"

/**
 * http 登录
 * @param {*} issave
 * @param {*} uName 
 * @param {*} pwd 
 * @param {*} pName 
 */
netutils.userLogin = function (issave, uName, pwd, pName) {
    loginThread = threads.start(
        function () {
            let params = {
                "username": uName,
                "password": pwd,
                "phone_name": pName,
                "did": utils.getDid(),
            };
            var url = "http://" + URL + "/v1/user/login"
            try {
                let res = http.postJson(url, params);
                let resJson = res.body.string()
                log(resJson)
                let json = JSON.parse(resJson)
                if (json.code == 0) {
                    log("登录成功")
                    if (issave) {
                        storagesutils.saveInfo(uName, pwd)
                    }
                    storagesutils.savePname(pName)
                    ui.run(() => {
                        ui.loginBtn.setText("已登录")
                    })
                    user_key = json.data.user_key
                    // threads.start(function () {
                    logWindow()
                    // })
                    home()
                    startSocket()
                } else {
                    toast("登录失败:" + json.msg)
                }
            } catch (e) {
                log("登录异常:" + e)
                toast("登录异常" + e)
            }
        }
    )
}

/**
 * 获取评论列表数据
 * @param {*} time 
 */
function getCommentList(time) {
    let params = {};
    var url = "http://" + URL + "/v1/comment_pool/list"
    try {
        let res = http.postJson(url, params);
        let resJson = res.body.string()
        log(resJson)
        let json = JSON.parse(resJson)
        if (json.code == 0) {
            logc("评论数据获取成功")
            hevent.start(time, json.data.video_list)
        } else {
            logc("评论数据获取失败:" + json.msg)
        }
    } catch (e) {
        logc("评论数据获取异常:" + e)
    }
}

var ws

/**
 * WebSocket 链接
 * @param {*} user_key 
 */
function startSocket() {

    importClass('org.java_websocket.client.WebSocketClient')
    importClass('org.java_websocket.handshake.ServerHandshake')
    importClass('java.net.URI')
    importClass('com.stardust.autojs.websocket.MyWebSocketClient')
    importClass('com.stardust.autojs.websocket.WebSocketClientInstance')

    var url = "ws://" + URL + "/v1/ws?dpi_width=" + device.width + "&dpi_height=" + device.height + "&did=" + utils.getDid()
        + "&user_key=" + user_key + "&app_vid=" + vn + "&tiktok_vid=" + utils.getVerName("com.ss.android.ugc.aweme") + ""

    log("socket url:" + url)

    var uri = URI.create(url)
    ws = WebSocketClientInstance.getInstance().getWebSocketClient(uri)
    ws.setOnSocketListener({
        onOpen(handshakedata) {
            toast("连接成功")
            logc("socket 链接成功")
        },
        onMessage(message) {
            log("收到消息:" + message)
            let json = JSON.parse(message)
            switch (json.cmd) {
                case "open_room"://打开直播间
                    levent.openRoom(json.data.live_room_id)
                    break
                case "quit_room"://退出直播间
                    levent.closeRoom()
                    break
                case "send_barrage"://发送弹幕
                    levent.comment(json.data.cont)
                    break
                case "give_like"://点赞
                    levent.zan(json.data.zan_count)
                    break
                case "focus_user"://关注在线用户

                    break
                case "open_shopping_cart"://打开购物车
                    levent.shopping()
                    break
                case "brush_gift"://刷礼物
                    break
                case "focus_host"://关注主播
                    levent.focus()
                    break
                case "thumb_up_barrage"://点赞弹幕
                    break
                case "join_fan"://加入粉丝团
                    break
                case "give_light_card"://赠送灯牌
                    break
                case "rob_bag"://抢福袋
                    break
                case "heartbeat":
                    logc("收到心跳")
                    break
                case "event"://点击和滑动事件
                    if (json.data.coordinates_move == "click") {
                        levent.clickEvent(json.data.coordinates)
                    } else if (json.data.coordinates_move == "move") {
                        levent.gestureEvent(json.data.coordinates_move_time, json.data.coordinates)
                    } else if (json.data.coordinates_move == "menu") {
                        levent.key_menu()
                    } else if (json.data.coordinates_move == "home") {
                        levent.key_home()
                    } else if (json.data.coordinates_move == "back") {
                        levent.key_back()
                    }
                    break
                case "setting": //设置
                    if (json.data.setting_type == "upload_img") {
                        imgUploadTime = json.data.setting_time * 1000
                        capture()
                    } else if (json.data.setting_type == "open_log") {
                        logWindow()
                    } else if (json.data.setting_type == "close_log") {
                        closeWindow()
                    }
                    break
                case "cultivate"://养号
                    if (json.data.is_open == 1) {
                        getCommentList(json.data.setting_time);
                    } else if (json.data.is_open == 0) {
                        hevent.stopTask()
                    }
                    break
                case "video"://视频
                    if (json.data.button_type == 1) {  //打开视频
                        vevent.openVideo(json.data.video_id)
                    } else if (json.data.button_type == 2) { //视频评论
                        vevent.comment(json.data.cont)
                    } else if (json.data.button_type == 3) { //视频点赞
                        vevent.zan()
                    } else if (json.data.button_type == 4) { //关注作者
                        vevent.focus()
                    } else if (json.data.button_type == 5) { //点赞评论
                        vevent.commentZan()
                    }
                    break
                default:
                    break
            }
            if (!json.hasOwnProperty("response")) {
                var reply = '{"seq":"' + json.seq + '","cmd":"' + json.cmd + '","response":{"code":0,"msg":"success","data":null}}'
                sendTxt(reply)
            }
        },
        onClose(code, reason, remote) {
            logc("链接已关闭:  /code:" + code + "  /reason:" + reason + " /remote:" + remote)
        },
        onError(ex) {
            logc("发生错误已关闭:" + ex)
        }
    })
    try {
        if (!ws.isOpen()) {
            ws.connectBlocking()
            heartBeat()
        }
    } catch (e) {
        logc("onError=" + e)
    }
}



/**
 * 心跳
 */
function heartBeat() {
    try {
        capture()
        if (heartTimer != 0) {
            logc("取消心跳计时器")
            loginThread.clearInterval(heartTimer)
            heartTimer = 0
        }
        logc("心跳线程已开启，心跳时间：" + heartTime)
        heartTimer = loginThread.setInterval(() => {
            if (ws.isOpen()) {
                var heart = '{ "seq": "' + utils.getCid() + '", "cmd": "heartbeat", "data": {} }';
                sendTxt(heart)
                log("发送心跳：" + heart)
                logc("发送心跳")
            } else {
                logc("链接已断开")
                reconnectWs()
            }
        }, heartTime)
    } catch (e) {
        logc(e)
    }
}


/**
 * 发送图片
 */
function capture() {
    try {
        if (timer != 0) {
            logc("取消图片计时器")
            loginThread.clearInterval(timer)
            timer = null
        }
        timer = loginThread.setInterval(() => {
            if (ws.isOpen()) {
                log("发送图片：")
                sendPic()
            }
        }, imgUploadTime)
    } catch (e) {
        logc(e)
    }
}

/**
 * 重连
 */
function reconnectWs() {

    // var u = "http://" + URL + "/v1/ws/check?dpi_width=" + device.width + "&dpi_height=" + device.height + "&did=" + utils.getDid()
    //     + "&user_key=" + user_key + "&app_vid=" + vn + "&tiktok_vid=" + utils.getVerName("com.ss.android.ugc.aweme") + ""

    // logc("SSSSSSSSSS验证请求:" + u)

    // var r = http.get(u)

    // logc("SSSSSSSSSS验证响应:" + r.body.string())

    try {
        logc("正在重连")
        ws.reconnectBlocking()
    } catch (error) {
        logc("reconnectWs error=" + error)
    }
}

/**
 * 发送图片 
 */
function sendPic() {
    try {
        var img = captureScreen();
        img = images.scale(img, 0.5, 0.5)
        var imgBase64 = images.toBase64(img, "jpg", 30)
        var info = {
            seq: utils.getCid(),
            cmd: "image_save",
            data: {
                image: 'data:image/png;base64,' + imgBase64
            }
        }
        info = JSON.stringify(info)
        ws.send(info);
        log("图片发送成功")
    } catch (e) {
        logc("发送图片异常:" + e)
    }
}

/**
 * 发送文字
 * @param {*} txt
 */
function sendTxt(txt) {
    try {
        ws.send(txt);
    } catch (e) {
        logc("发送消息异常:" + e)
    }
}


module.exports = netutils