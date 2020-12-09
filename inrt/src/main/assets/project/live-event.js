/**
 * 直播事件
 */
var levent = {}

/**
 * 进入直播间
 */
levent.openRoom = function (roomId) {
    threads.start(
        function () {
            try {
                logc("收到任务--打开直播间")

                //进入直播间
                app.startActivity({
                    action: "android.intent.action.VIEW",
                    data: "snssdk1128://live?room_id=" + roomId,
                });

                waitForPackage("com.ss.android.ugc.aweme")
                logc("打开app")

                logc("等待进入直播页面......")
                waitForActivity("com.ss.android.ugc.aweme.live.LivePlayActivity")
                //判断是否进入直播页面
                while (true) {
                    var u = id("a_j").find()
                    var u1 = id("b14").find()
                    if (u.length > 0 && u1.length > 0) {
                        break
                    }
                    sleep(1000);
                }
                logc("任务完成--进入直播页面")
            } catch (e) {
                log(e)
            }
        })
}

/**
 * 关闭直播间
 */
levent.closeRoom = function () {
    threads.start(
        function () {
            try {
                logc("收到任务--关闭直播间")
                back()
                logc("任务完成--关闭直播间")
            } catch (e) {
                log(e)
            }
        })
}

/**
 * 发弹幕
 */
levent.comment = function (cont) {
    threads.start(
        function () {
            try {
                logc("收到任务--发弹幕")
                var u = id("b14").find()
                if (u.length > 0) {
                    var tr = u[0].bounds();
                    click(tr.centerX(), tr.centerY());
                    sleep(1000);
                    input(0, cont)
                    sleep(1000);
                    var u = id("f_k").find()
                    if (u.length > 0) {
                        var tr = u[0].bounds();
                        click(tr.centerX(), tr.centerY());
                        logc("任务完成--弹幕已发送完成")
                    } else {
                        logc("发送失败2")
                    }
                } else {
                    logc("发送失败1")
                }
            } catch (e) {
                log(e)
            }
        })
}

/**
 * 点赞
 */
levent.zan = function (zan_count) {
    threads.start(
        function () {
            try {
                logc("收到任务--点赞" + zan_count + "次")
                for (var i = 0; i < zan_count; i++) {
                    click(device.width - 100 - random(0, 100), device.height / 2 - random(0, 100))
                    click(device.width - 100 - random(0, 100), device.height / 2 - random(0, 100))
                    sleep(500)
                }
                logc("收到任务--点赞完成")
            } catch (e) {
                log(e)
            }
        })
}

/**
 * 浏览小黄车
 */
levent.shopping = function () {
    threads.start(
        function () {
            try {
                logc("收到任务--浏览小黄车")
                var u = id("azz").find()
                if (u.length > 0) {
                    logc("有小黄车")
                    var tr = u[0].bounds();
                    click(tr.centerX(), tr.centerY());
                    sleep(2000);
                    //上滑
                    var b = classNameEndsWith("RecyclerView").scrollForward();
                    logc("上滑")
                    sleep(2000);
                    //下滑
                    classNameEndsWith("RecyclerView").scrollBackward()
                    logc("下滑")
                    sleep(2000);
                    logc("关闭小黄车")
                    back()
                    logc("完成任务--浏览小黄车")
                } else {
                    logc("没有小黄车")
                }
            } catch (e) {
                log(e)
            }
        })
}

/**
 * 关注
 */
levent.focus = function () {
    threads.start(
        function () {
            try {
                logc("收到任务--关注主播")
                var u = id("bfw").find()
                if (u.length > 0) {
                    var tr = u[0].bounds();
                    click(tr.centerX(), tr.centerY());
                    logc("完成任务--关注成功")
                } else {
                    logc("完成任务--已关注")
                }
            } catch (e) {
                log(e)
            }
        })
}

/**
 * 模拟点击事件
 * @param {*}} x 
 * @param {*} y 
 */
levent.clickEvent = function (position) {
    threads.start(
        function () {
            try {
                logc("收到任务--点击事件")
                // logc("W:" + position[0].x + ",H:" + position[0].y)
                // logc("W:" + device.width + ",H:" + device.height)
                // logc("X:" + device.width * position[0].x + ",Y:" + device.height * position[0].y)
                click(device.width * position[0].x, device.height * position[0].y)
                logc("完成任务--已点击")
            } catch (e) {
                log(e)
            }
        })
}

/**
 *  模拟滑动事件
 * @param {*} params 
 */
levent.swipeEvent = function (position) {
    threads.start(
        function () {
            try {
                logc("收到任务--滑动事件")
                var duration = 200
                var w = device.width
                var h = device.height
                swipe(w * position[0].x, h * position[0].y, w * position[1].x, h * position[1].y, duration)
                logc("完成任务--已处罚滑动事件")
            } catch (e) {
                log(e)
            }
        })
}

/**
 *  模拟手势滑动路径的一系列坐标
 * @param {*} params 
 */
levent.gestureEvent = function (duration, position) {
    threads.start(
        function () {
            try {
                logc("收到任务--滑动事件")
                var w = device.width
                var h = device.height
                var point = new Array()
                for (i = 0; i < position.length; i++) {
                    point.push([position[i].x * w, position[i].y * h])
                }
                // log("坐标：" + point)
                gesture(duration, point)
                logc("完成任务--已触发滑动事件")
            } catch (e) {
                log(e)
            }
        })
}

/**
 * 按键 menu
 */
levent.key_menu = function () {
    threads.start(
        function () {
            try {
                recents()
            } catch (e) {
                log(e)
            }
        })
}

/**
 * 按键 home
 */
levent.key_home = function () {
    threads.start(
        function () {
            try {
                 home()
            } catch (e) {
                log(e)
            }
        })
}

/**
 * 按键 back
 */
levent.key_back = function () {
    threads.start(
        function () {
            try {
               back()
            } catch (e) {
                log(e)
            }
        })
}

module.exports = levent;