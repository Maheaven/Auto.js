var window = floaty.rawWindow(
    <vertical bg="#80000000" id="rootView" >

        <frame w="*" h="auto" bg="#80000000" >
            <text id="title" textColor="#FFFFFF" w="*" h="*" gravity="center_vertical" textSize="16sp" marginLeft="10dp">辅助工具</text>
            <text id="closeBtn" textColor="#FFFFFF" layout_gravity="right" w="auto" textSize="20sp" padding="5dp" marginRight="5dp">X</text>
        </frame>
        <list id="loglist">
            <text id="logTxt" text="{{val}}" textColor="#FFFFFF" w="*" h="auto" gravity="center_vertical" textSize="12sp" marginLeft="10dp" />
        </list>
    </vertical>
);

var targetDouYinVersion = "11.9.0";
var list = []
showWindow()
liveTask()
// capture();

function showWindow() {

    window.setSize(device.width / 2, device.height / 3);
    window.exitOnClose()//使悬浮窗被关闭时自动结束脚本运行。
    window.setTouchable(true)

    let x = 0;
    let y = 0;
    //记录按键被按下时的悬浮窗位置
    let windowX;
    let windowY;
    window.rootView.setOnTouchListener(function (view, event) {
        switch (event.getAction()) {
            case event.ACTION_DOWN:
                x = event.getRawX();
                y = event.getRawY();
                windowX = window.getX();
                windowY = window.getY();
                break
            case event.ACTION_MOVE:
                //移动距离过大则判断为移动状态
                if (Math.abs(event.getRawY() - y) > 5 && Math.abs(event.getRawX() - x) > 5) {
                    let tmpX = windowX + (event.getRawX() - x);
                    let tmpY = windowY + (event.getRawY() - y);
                    tmpX = tmpX < 0 ? 0 : tmpX
                    tmpX = tmpX > device.width - window.width ? device.width - window.width : tmpX
                    tmpY = tmpY < 0 ? 0 : tmpY
                    tmpY = tmpY > device.height - window.height ? device.height - window.height : tmpY
                    //移动手指时调整悬浮窗位置
                    window.setPosition(tmpX, tmpY);
                }
                break
            case event.ACTION_MOVE:
                break
        }
        return true
    });
    window.closeBtn.click(function () {
        window.close()
    });

    ui.run(() => {
        window.loglist.setDataSource(list)
    })
    setInterval(() => {
    }, 1000);
}

function log(msg) {
    ui.run(() => {
        var s = { val: msg }
        list.push(s)
        window.loglist.scrollToButtom()
    })
}

function liveTask() {
    var douyinVersion = app.getTargetVersionName("com.ss.android.ugc.aweme")
    if(targetDouYinVersion == douyinVersion){
        log("软件启动，版本号：" + app.getTargetVersionName("com.ss.android.ugc.aweme"))
    }else{
        alert("版本不匹配!");
        log("版本不匹配")
        return
    }
    
    //进入直播间
    app.startActivity({
        action: "android.intent.action.VIEW",
        data: "snssdk1128://live?room_id=6885999161834277632",
    });

    waitForPackage("com.ss.android.ugc.aweme")
    log("打开app")

   
    log("等待进入直播页面......")
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

    log("进入直播页面")  

    //关注
    sleep(1000);
    var u = id("bfw").find()
    if (u.length > 0) {
        var tr = u[0].bounds();
        click(tr.centerX(), tr.centerY());
        log("关注成功")
    } else {
        log("已关注")
    }

    //评论
    sleep(1000);
    var u = id("b14").find()
    if (u.length > 0) {
        var tr = u[0].bounds();
        click(tr.centerX(), tr.centerY());
        sleep(1000);
        input(0, "666666")
        sleep(1000);
        var u = id("f_k").find()
        if (u.length > 0) {
            var tr = u[0].bounds();
            click(tr.centerX(), tr.centerY());
            log("评论成功")
        } else {
            log("评论失败2")
        }
    } else {
        log("评论失败1")
    }

    //浏览小黄车
    sleep(1000);
    var u = id("azz").find()
    if (u.length > 0) {
        log("有小黄车")
        var tr = u[0].bounds();
        click(tr.centerX(), tr.centerY());
        sleep(2000);
        //上滑
        var b = classNameEndsWith("RecyclerView").scrollForward();
        log("上滑")
        sleep(2000);
        //下滑
        classNameEndsWith("RecyclerView").scrollBackward()
        log("下滑")
        sleep(2000);
        log("关闭小黄车")
        back()

    } else {
        log("没有小黄车")
    }

    //点赞
    sleep(1000);
    var zanCount = 10
    log("开始点赞" + zanCount + "次")
    for (var i = 0; i < zanCount; i++) {
        click(device.width / 2, device.height / 2)
        click(device.width / 2, device.height / 2)
        sleep(500)
    }
    log("点赞完成")
}

function capture(){
//请求截图
log("请求截图...");
if(!requestScreenCapture()){
    log("请求截图失败");
    exit();
}
captureScreen("/sdcard/screencapture_autojs.png");
log("截屏完成");
//连续截图10张图片(间隔1秒)并保存到存储卡目录
// for(var i = 0; i < 10; i++){
//     captureScreen("/sdcard/screencapture" + i + ".png");
//     sleep(1000);
// }
}


