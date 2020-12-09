var windowlistener = {}

windowlistener.addWindowListener = function () {
    threads.start(
        function () {
            while (true) {
                try {

                    findTxtClick("立即开始");
                    findTxtClick("我知道了");
                    findTxtClick("好的");
                    findTxtClick("以后再说");
                    findTxtClick("取消");
                    findTxtClick("确认");
                    findTxtClick("总是允许");
                    findTxtClick("暂时不要");
                    findTxtClick("同意授权");
                    findTxtClick("不允许");
                    // findTxtClick("同意并继续");

                    findTxtBack("推荐好友")
                    findTxtBack("好友推荐")
                    findTxtBack("查看通讯录")
                    findTxtBack("不感兴趣")
                    findTxtBack("为你推荐更多主播")
                    findTxtBack("取消关注")

                    sleep(500)
                } catch (e) {
                    log("监听屏幕异常" + e)
                }
            } s
        })
}

function findTxtClick(txt) {
    ui = text(txt).findOne(500);
    if (ui) {
        ui.click();
    }
}

function findTxtBack(txt) {
    ui = text(txt).findOne(500);
    if (ui) {
        back()
    }
}

module.exports = windowlistener