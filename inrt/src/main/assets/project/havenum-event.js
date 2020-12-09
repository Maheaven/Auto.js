/**
 * 养号事件
 */
var hevent = {}

var isHaveNum = true

var commentList

/**
 * 开始养号任务
 */
hevent.start = function (time, cList) {
    commentList = cList
    isHaveNum = true
    threads.start(
        function () {
            logc("开始养号任务")
            threads.start(
                function () {
                    setTimeout(function () {
                        hevent.stopTask()
                    }, time * 1000)
                })
            startApp()
            sleep(12000)
            nextVideo()
            while (isHaveNum) {
                doTask()
            }
            home()
        })
}

function doTask() {
    sleep(getDefRandom())
    var w = textContains("点击进入直播间").find()
    if (w.length > 0) {
        //直播视频
        logc("直播视频 跳过")
    } else {
        var num = random(0, 1)
        // if (true) {
        if (num == 0) {//喜欢
            logc("喜欢视频")
            sleep(getDefRandom())
            num = random(0, 9)
            if (num == 0) {
                // if (true) {
                logc("关注作者")
                focus()
            } else {
                logc("不关注作者:" + num)
                sleep(getRandom())
            }

            //点赞视频 
            sleep(getDefRandom())
            num = random(0, 4)
            if (num == 0) {
                // if (true) {
                logc("视频点赞")
                like()
            } else {
                logc("不点赞:" + num)
                sleep(getRandom())
            }

            //看评论 
            sleep(getDefRandom())
            num = random(0, 4)
            if (num == 0) {
                // if (true) {
                logc("看评论")
                var commentCount = openComment()
                log("commentCount=" + commentCount)
                if (commentCount > 10) {
                    logc("评论数大于10条")
                    sleep(getDefRandom())
                    logc("滑动浏览评论")
                    scollComment()
                    //评论
                    sleep(getDefRandom())
                    num = random(0, 9)
                    if (num == 0) {
                        // if (true) {
                        logc("评论")
                        comment()
                        sleep(1000)
                    } else {
                        logc("不评论了:" + num)
                        sleep(getRandom())
                    }
                } else {
                    logc("评论太少")
                    sleep(getRandom())
                }
                back()
            } else {
                logc("不看评论:" + num)
                sleep(getRandom())
            }

        } else {
            logc("不喜欢视频")
        }
    }
    sleep(getDefRandom())
    nextVideo()
}

/**
 * 结束养号
 */
hevent.stopTask = function () {
    logc("养号任务完成，等待本次执行结束")
    isHaveNum = false;
}

function startApp() {
    try {
        logc("重启app")
        var result = shell("am force-stop com.ss.android.ugc.aweme", false)
        log(result);
        app.launch("com.ss.android.ugc.aweme")
    } catch (e) {
        log(e)
    }
}

/**
 * 点赞
 */
function like() {
    try {
        var u = id("as9").find()
        if (u.length > 0) {
            // var tr = u[0].bounds();
            // click(tr.centerX(), tr.centerY());
            click(device.width / 2 - random(0, 100), device.height / 2 - random(0, 100))
            sleep(50)
            click(device.width / 2 - random(0, 100), device.height / 2 - random(0, 100))
        } else {
            logc("没有发现点赞按钮")
        }
    } catch (e) {
        log(e)
    }
}

/**
 * 关注作者
 */
function focus() {
    try {
        var w = id("bfw").find()
        if (w.length > 1) {
            click(w[1].bounds().centerX(), w[1].bounds().centerY());
        } else {
            logc("没有发现关注按钮")
        }
    } catch (e) {
        log(e)
    }
}

/**
 * 打开评论，返回评论条数
 */
function openComment() {
    try {
        var w = id("ach").find()
        if (w.length > 0) {
            click(w[1].bounds().centerX(), w[1].bounds().centerY());
            sleep(2000)
            w = id("acw").find()
            if (w.length > 0) {
                //判断页面是否出现了 发送评论按钮，如果有则无评论  直接掉起了键盘，需要先关闭键盘
                back()
            }
            sleep(1000)
            w = id("title").find()
            if (w.length > 0) {
                log(w.length)
                for (var i = 0; i < w.length; i++) {
                    var txt = w[i].text().toString()
                    if (txt.indexOf("条评论") != -1 || txt.indexOf("暂无评论") != -1) {
                        return getCommentCount(txt)
                    }
                }
            } else {
                logc("没有发现评论数title")
                return 0
            }
        } else {
            logc("没有发现评论按钮")
            return 0
        }
    } catch (e) {
        log(e)
        return 0
    }
}

function getCommentCount(txt) {
    try {
        if (txt == "暂无评论") {
            back()
            return 0
        } else {
            txt = txt.substring(0, txt.indexOf("条"))
            log("txt==" + txt)
            if (txt.substring(txt.length - 2, txt.length - 1) == "w") {
                txt = txt.substring(0, txt.indexOf("w"));
                return parseFloat(txt) * 10000
            } else {
                return parseInt(txt)
            }
        }
    } catch (e) {
        log(e)
        return 0
    }
}

/**
 * 滑动评论列表
 */
function scollComment() {
    try {
        var scrollTimes = random(1, 5)
        classNameEndsWith("RecyclerView").scrollForward();
        logc("上滑")
        sleep(2000);
        for (var i = 1; i < scrollTimes; i++) {
            if (i % 2 == 0) {
                classNameEndsWith("RecyclerView").scrollBackward()
                logc("下滑")
            } else {
                classNameEndsWith("RecyclerView").scrollForward()
                logc("上滑")
            }
            sleep(2000);
        }
    } catch (e) {
        log(e)
        return 0
    }
}

/**
 * 评论
 */
function comment() {
    try {
        if (null != commentList && commentList.length > 0) {
            var w = id("acc").find()
            if (w.length > 0) {
                w[0].setText(commentList[random(0, commentList.length - 1)].cont)
                click(w[0].bounds().centerX(), w[0].bounds().centerY());
                sleep(1000)
                w = id("acw").find()
                if (w.length > 0) {
                    click(w[0].bounds().centerX(), w[0].bounds().centerY());
                } else {
                    logc("没有发现发送按钮")
                }
            } else {
                logc("没有发现评论框")
            }
        } else {
            logc("没有评论数据，无法评论")
        }
    } catch (e) {
        log(e)
        return 0
    }
}

function nextVideo() {
    try {
        var w = device.width
        var h = device.height
        logc("下一个视频")
        swipe(parseInt(w / 2 - 23), parseInt(h / 2 + 167), parseInt(w / 3 - 6), parseInt(h / 2 - 387), 303)
    } catch (e) {
        log(e)
        return 0
    }
}

function getDefRandom() {
    return random(1, 7) * 1000 + random(100, 999);
}

function getRandom() {
    return random(1, 4) * 1000 + random(100, 999);
}

module.exports = hevent;