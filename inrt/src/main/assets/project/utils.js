var utils = {}

/**
 * 获取app版本号
 * @param {*} package_name 
 */
utils.getVerName = function (package_name) {
  let pkgs = context.getPackageManager().getInstalledPackages(0).toArray();
  for (let i in pkgs) {
    if (pkgs[i].packageName.toString() === package_name) return pkgs[i].versionName;
  }
}

/**
 * 获取设备id
 */
utils.getDid = function () {
  return device.getAndroidId()
}

/**
 * 无障碍是否开启
 */
utils.checkAccessibleServiceEnable = function () {
  return auto.service != null
}

/**
 * 检测 悬浮窗权限是否开启
 */
utils.checkFloatingWindowEnable = function () {
  importClass('com.stardust.autojs.util.FloatingPermission')
  return FloatingPermission.canDrawOverlays(context)
}

/**
 * 跳转开启 悬浮窗 权限设置页面
 */
utils.settingFloatingWindow = function () {
  importClass('com.stardust.autojs.util.FloatingPermission')
  try {
    FloatingPermission.waitForPermissionGranted(context);
  } catch (e) {
    log(e)
  }
}

var cid = 1000000
/**
 * 获取cid
 */
utils.getCid = function () {
  cid++
  return "C" + Date.parse(new Date()) + "-" + cid
}


module.exports = utils
