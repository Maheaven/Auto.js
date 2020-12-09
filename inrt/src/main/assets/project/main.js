"ui";

var window

var list = []

var vn = app.versionName

var logStr = "logStr"

var utils = require('utils.js');
var levent = require('live-event.js');
var storagesutils = require('storage-utils.js');
var netutils = require('net-utils.js');
var windowlistener = require('windowlistener.js');
var hevent = require('havenum-event.js');
var vevent = require('video-event.js');


ui.layout(
    <relative padding="16" marginLeft="40" marginRight="40" >
        <vertical w="*" >
            <text text="登录服务器" textColor="black" textSize="20sp" marginTop="40" textStyle="bold" layout_gravity="center" w="auto" />

            <horizontal marginTop="20" w="*">
                <text text="账      号：" textColor="black" textSize="14sp" />
                <input id="uName" hint="输入账号" w="*" textColor="black" textSize="14sp" text="" />
            </horizontal>

            <horizontal marginTop="20" w="*">
                <text text="密      码：" textColor="black" textSize="14sp" />
                <input id="pwd" hint="输入密码" w="*" textColor="black" textSize="14sp" text="" />
            </horizontal>

            <horizontal marginTop="20" w="*">
                <text text="手机名称：" textColor="black" textSize="14sp" />
                <input id="pName" hint="输入手机在系统展示的名称" w="*" textColor="black" textSize="14sp" text="" />
            </horizontal>

            <button id="loginBtn" text="登录" w="*" style="Widget.AppCompat.Button.Colored" marginTop="20" textSize="14sp" />

            <relative marginTop="20" w="*">
                <checkbox id="rememberInfo" text="记住登录信息" textColor="black" textSize="14sp" layout_alignParentLeft="true" />
                <checkbox id="autoLogin" text="自动登录" textColor="black" textSize="14sp" layout_alignParentRight="true" />
            </relative>
        </vertical>

        <checkbox id="auotStartCheckBox" text="随系统启动" textColor="black" textSize="14sp" layout_above="accessibleServiceBtn"
            layout_centerHorizontal="true" />

        <button id="accessibleServiceBtn" text="无障碍服务（未启用）" w="*" style="Widget.AppCompat.Button.Colored" marginTop="20"
            textSize="14sp" layout_above="floatingWindowBtn" />
        <button id="floatingWindowBtn" text="悬浮窗权限（未启用）" w="*" style="Widget.AppCompat.Button.Colored" textSize="14sp"
            layout_above="versionTxt" layout_marginBottom="30" />

        <text id="versionTxt" text="云控-v{{app.versionName}}" textColor="black" textSize="14sp" layout_above="timeTxt"
            layout_centerHorizontal="true" />

        <text id="timeTxt" text="" textColor="black" textSize="7sp" layout_alignParentBottom="true"
            layout_centerHorizontal="true" />
    </relative>
)

/**
 * 程序主入口
 */
function main() {

    windowlistener.addWindowListener()

    //请求截图权限
    threads.start(function () {
        //请求截图
        if (!requestScreenCapture()) {
            toast("请求截图失败");
            exit();
        }
    })
    //自动点击  开启截图权限
    // threads.start(function () {
    //     sleep(1000)
    //     var u = textContains("开始截取您的屏幕上").find()
    //     if (u.length > 0) {
    //         var u = text("立即开始").findOne()
    //         var tr = u.bounds();
    //         click(tr.centerX(), tr.centerY());
    //     }
    // })

    setInterval(() => {
    }, 1000);

    ui.loginBtn.click(function () {
        var targetDouYinVersion = "11.9.0";
        var douyinVersion = utils.getVerName("com.ss.android.ugc.aweme")
        // if (douyinVersion == null || douyinVersion == "" || douyinVersion == 'undefined') {
        //     toast("请安装app")
        //     return
        // } else if (targetDouYinVersion != douyinVersion) {
        //     toast("版本不匹配，当前版本：" + douyinVersion)
        //     return
        // } else {
        //     log("软件启动，app版本号：" + douyinVersion)
        // }
        if (!utils.checkAccessibleServiceEnable()) {
            toast("需要开启无障碍服务")
            return
        }
        if (!utils.checkFloatingWindowEnable()) {
            toast("需要开启悬浮窗权限")
            return
        }
        var un = ui.uName.getText().toString()
        var pw = ui.pwd.getText().toString()
        var pn = ui.pName.getText().toString()

        if (un == "") {
            toast("请输入账号")
        }
        if (pw == "") {
            toast("请输入密码")
        }
        if (pn == "") {
            toast("请输入手机名称")
        }
        netutils.userLogin(ui.rememberInfo.checked, un, pw, pn)

    });

    ui.accessibleServiceBtn.click(function () {
        // 检测无障碍服务
        if (!utils.checkAccessibleServiceEnable()) {
            app.startActivity({
                action: "android.settings.ACCESSIBILITY_SETTINGS"
            });
        }
    });

    ui.floatingWindowBtn.click(function () {
        // 检测悬浮窗权限
        if (!utils.checkFloatingWindowEnable()) {
            utils.settingFloatingWindow()
        }
    });

    if (storagesutils.isSave()) {
        log("有保存的信息")
        ui.uName.setText(storagesutils.getInfo("UN"))
        ui.pwd.setText(storagesutils.getInfo("PD"))
        ui.rememberInfo.checked = true
    }
    ui.pName.setText(storagesutils.getPname())

    // 当用户回到本界面时，resume事件会被触发
    ui.emitter.on("resume", function () {
        checkService()
        checkPer()
    });
    checkService()
    checkPer()

    let t = android.os.SystemClock.elapsedRealtime();
    ui.timeTxt.setText(formatDuring(t))
}

function formatDuring(mss) {
    var days = parseInt(mss / (1000 * 60 * 60 * 24));
    var hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = (mss % (1000 * 60)) / 1000;
    return days + " 天 " + hours + " 小时 " + minutes + " 分钟 " + seconds + " 秒 ";
}

main()

/**
 * 无障碍检测
 */
function checkService() {
    if (utils.checkAccessibleServiceEnable()) {
        ui.accessibleServiceBtn.setText("无障碍服务（已启用）")
    } else {
        ui.accessibleServiceBtn.setText("无障碍服务（未启用）")
    }
}

function checkPer() {
    if (utils.checkFloatingWindowEnable()) {
        ui.floatingWindowBtn.setText("悬浮窗权限（已启用）")
    } else {
        ui.floatingWindowBtn.setText("悬浮窗权限（未启用）")
    }
}

/**
 * 悬浮窗
 */
function logWindow() {
    if (null != window) {
        return
    }
    window = floaty.rawWindow(
        <vertical bg="#80000000" id="rootView" >

            <frame w="*" h="auto" bg="#80000000" >
                <text id="title" textColor="#FFFFFF" w="*" h="*" gravity="center_vertical" textSize="14sp" marginLeft="10dp" text="云控-v{{app.versionName}}" />
                <text id="closeBtn" textColor="#FFFFFF" layout_gravity="right" w="auto" textSize="16sp" padding="5dp" marginRight="5dp">X</text>
            </frame>
            <list id="loglist">
                <text id="logTxt" text="{{logStr}}" textColor="#FFFFFF" w="*" h="auto" gravity="center_vertical" textSize="10sp" marginLeft="2dp" marginRight="2dp" />
            </list>
        </vertical>
    );

    window.setSize(device.width / 2, device.height / 3);
    // window.exitOnClose()//使悬浮窗被关闭时自动结束脚本运行。
    window.setPosition(0, 100)
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
        closeWindow()
    });

    ui.run(() => {
        window.loglist.setDataSource(list)
    })

}

function closeWindow() {
    try {
        if (null != window) {
            window.close()
            window = null
        }
    } catch (e) {
        log(e)
    }
}

function logc(msg) {
    console.log(msg)
    if (null != window) {
        var s = { logStr: "" + java.text.SimpleDateFormat("HH:mm:ss.SSS： ").format(new Date()) + msg }
        list.push(s)
        if (list.length > 500) {
            list.length = 0
            ui.run(() => {
                window.loglist.getAdapter().notifyDataSetChanged()
            })
        } else {
            ui.run(() => {
                window.loglist.scrollToButtom()
            })
        }
    }
}

function log(msg) {
    console.log(msg)
}



