/**
 * 视频事件
 */
var vevent = {}

/**
 * 打开视频 6888248979834899725
 */
vevent.openVideo = function (videoId) {
    threads.start(
        function () {
            try {
                logc("收到任务--打开视频");
                //进入视频页面
                app.startActivity({
                    action: "android.intent.action.VIEW",
                    data: "snssdk1128://aweme/detail/" + videoId,
                });

                logc("等待进入视频页面......")
                //判断是否进入视频页面
                while (true) {
                    var u = id("pd").find()
                    if (u.length > 0) {
                        break
                    }
                    sleep(1000);
                }
                logc("任务完成--进入视频页面")
            } catch (e) {
                log(e)
            }
        })
}

/**
 * 关注
 */
vevent.focus = function () {
    threads.start(
        function () {
            try {
                logc("收到任务--关注");

                var bImg = captureScreen()
                // var clip = images.clip(bImg, device.width - 200, 700, 199, 200);
                // images.save(clip, "/sdcard/clip.png")

                // images.save(bImg, "/sdcard/bImg.png")

                // var sImg = images.read("./imgs/gz.png")
                //  images.save(sImg, "/sdcard/sImg.png")

                // for (var i = 0; i < 10; i++) {
                try {
                    var p = images.findColorEquals(bImg, "#FF2E57")
                    if (p) {
                        logc("找到关注按钮:" + p);
                        click(p.x, p.y)
                        // break
                    } else {
                        logc("没有找到按钮");
                    }
                } catch (e) {
                    logc(e)
                }
                //     sleep(500)
                // }
                logc("完成任务--关注");
            } catch (e) {
                log(e)
            }
        })
}

/**
 * 点赞
 */
vevent.zan = function () {
    threads.start(
        function () {
            try {
                logc("收到任务--视频点赞");
                // click(device.width / 2 - random(0, 100), device.height / 2 - random(0, 100))
                // click(device.width / 2 - random(0, 100), device.height / 2 - random(0, 100))
                click(device.width / 2, device.height / 2)
                sleep(100)
                click(device.width / 2, device.height / 2)
                sleep(100)
                click(device.width / 2, device.height / 2)
                logc("完成任务--视频点赞");
            } catch (e) {
                log(e)
            }
        })
}

/**
 * 评论
 * @param {*} commentTxt 
 */
vevent.comment = function (commentTxt) {
    threads.start(
        function () {
            try {
                logc("收到任务--视频评论");
                var w = id("pd").find()
                if (w.length > 0) {
                    click(w[0].bounds().centerX(), w[0].bounds().centerY());
                    sleep(2000)
                    setText(commentTxt)
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
                logc("完成任务--视频评论");
            } catch (e) {
                logc(e)
                return 0
            }
        })
}

/**
 * 评论点赞
 */
vevent.commentZan = function () {
    threads.start(
        function () {
            try {
                logc("收到任务--视频评论点赞");
                var commentCount = openComment()
                var zanCount = getZanCount(commentCount)
                logc("点赞次数:" + zanCount)
                for (var i = 0; i < zanCount; i++) {
                    var w = id("cd1").find()
                    if (w.length > 0) {
                        var pos = random(0, w.length - 1)
                        if (!w[pos].selected()) {
                            click(w[pos].bounds().centerX(), w[pos].bounds().centerY());
                            logc("点赞成功")
                            sleep(2000);
                        } else {
                            logc("该评论已点赞，不需要重复点")
                        }
                        var b = classNameEndsWith("RecyclerView").scrollForward();
                        logc("上滑")
                        sleep(2000);
                    } else {
                        logc("没有找到点赞按钮")
                    }
                    sleep(2000);
                }
                back()
                logc("完成任务--视频评论点赞");
            } catch (e) {
                logc(e)
            }
        })
}

/**
 * 获取需要点赞次数
 * @param {}} commentCount 
 */
function getZanCount(commentCount) {
    var zanCount;
    if (commentCount > 500) {
        return random(2, 5)
    } else if (commentCount > 50) {
        return random(2, 3)
    } else if (commentCount > 10) {
        return 1
    } else if (commentCount == 0) {
        return 0
    }
}

/**
 * 打开评论，返回评论条数
 */
function openComment() {
    try {
        var sImg = images.read("./imgs/pl.png")
        var p = images.findImage(captureScreen(), sImg, {
            threshold: 0.5
        })
        if (p) {
            log("找到评论按钮:" + p);
            click(p.x, p.y);
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
            logc("没有找到按钮");
            return 0
        }
    } catch (e) {
        logc(e)
        return 0
    }
}

/**
 * 获取评论数量
 * @param {} txt 
 */
function getCommentCount(txt) {
    try {
        if (txt == "暂无评论") {
            back()
            return 0
        } else {
            txt = txt.substring(0, txt.indexOf("条"))
            log("" + txt)
            if (txt.substring(txt.length - 2, txt.length - 1) == "w") {
                txt = txt.substring(0, txt.indexOf("w"));
                return parseFloat(txt) * 10000
            } else {
                return parseInt(txt)
            }
        }
    } catch (e) {
        logc(e)
        return 0
    }
}

module.exports = vevent;