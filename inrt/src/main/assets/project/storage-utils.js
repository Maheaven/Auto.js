var storagesutils = {}

var storage = storages.create("Userinfo");

var filePath = "/sdcard/id.txt"

/**
 * 保存登录信息
 */
storagesutils.saveInfo = function (uName, pwd) {
    storage.put("FG", true)
    storage.put("UN", uName)
    storage.put("PD", pwd)
}

storagesutils.savePname = function (pName) {
    files.write(filePath, pName, encoding = "UTF-8")//写内容到文件,如果文件存在则覆盖，不存在则创建。(覆写)
}

storagesutils.getPname = function () {
    if (files.exists(filePath)) { 
        return files.read(filePath, encoding = "UTF-8")
    } else {
        return ""
    }
}

/**
 * 获取保存信息
 * @param {*} key 
 */
storagesutils.getInfo = function (key) {
    return storage.get(key, "")
}

/**
 * 是否有保存的登录信息
 */
storagesutils.isSave = function () {
    return storage.get("FG")
}

module.exports = storagesutils