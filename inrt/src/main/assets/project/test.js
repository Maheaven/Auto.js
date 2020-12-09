
// log("openComment:" + openComment())
function openComment() {
  try {
    var w = id("ach").find()
    if (w.length > 0) {
      click(w[1].bounds().centerX(), w[1].bounds().centerY());

      sleep(1000)
      w = id("title").find()
      if (w.length > 0) {
        log(w.length)
        for (var i = 0; i < w.length; i++) {
          var txt = w[i].text().toString()
          log(txt)
          if (txt.indexOf("条评论") != -1 || txt.indexOf("暂无评论") != -1) {
            return getCommentCount(txt)
          }
        }
      } else {
        log("没有发现评论数title")
        return 0
      }
    } else {
      log("没有发现评论按钮")
      return 0
    }
  } catch (e) {
    log(e)
    return 0
  }
}

function getCommentCount(txt) {
  if (txt == "暂无评论") {
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
}

// comment()

/**
 * 评论
 */
function comment() {
  var w = id("acc").find()
  if (w.length > 0) {
    w[0].setText("6666666666")
    click(w[0].bounds().centerX(), w[0].bounds().centerY());
    sleep(1000)
    w = id("acw").find()
    if (w.length > 0) {
      click(w[0].bounds().centerX(), w[0].bounds().centerY());
    } else {
      log("没有发现发送按钮")
    }
  } else {
    log("没有发现评论框")
  }
}



// threads.start(
//   function () {
//     threads.start(
//       function () {
//         setTimeout(function () {
//           log("养号任务执行完成，等待本次执行结束...")
//         }, 5 * 1000)
//       })
//     while (true) {
//       log("1")
//       sleep(100)
//     }
//   })
// var w = textContains("点击进入直播间").find()
// if (w.length > 0) {
//   var w = device.width
//   var h = device.height
//   swipe(parseInt(w / 2 - 23), parseInt(h / 2 + 167), parseInt(w / 3 - 6), parseInt(h / 2 - 387), 303)
// }


//  log(device.getAndroidId())

// var w = id("bfw").find()
// log("wwwwww：" + w.length)

// app.startActivity({
//   action: "android.intent.action.VIEW",
//   data: "snssdk1128://live?room_id=6894940668364655373",
// });

var list = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]

list.splice(0, list.length - 5)
console.log('list ', list)