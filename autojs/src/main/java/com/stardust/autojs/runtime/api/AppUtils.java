package com.stardust.autojs.runtime.api;

import android.accessibilityservice.AccessibilityServiceInfo;
import android.accounts.Account;
import android.accounts.AccountManager;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.Notification;
import android.app.NotificationManager;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.ResolveInfo;
import android.net.Uri;
import android.provider.Settings;
import android.util.Log;
import android.view.accessibility.AccessibilityManager;

import com.stardust.autojs.R;
import com.stardust.autojs.annotation.ScriptInterface;
import com.stardust.util.IntentUtil;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.lang.ref.WeakReference;
import java.util.List;

import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;
import androidx.localbroadcastmanager.content.LocalBroadcastManager;

/**
 * Created by Stardust on 2017/4/2.
 */

public class AppUtils {

    private Context mContext;
    private volatile WeakReference<Activity> mCurrentActivity = new WeakReference<>(null);
    private final String mFileProviderAuthority;

    public AppUtils(Context context) {
        mContext = context;
        mFileProviderAuthority = null;
    }

    public AppUtils(Context context, String fileProviderAuthority) {
        mContext = context;
        mFileProviderAuthority = fileProviderAuthority;
    }

    @ScriptInterface
    public boolean launchPackage(String packageName) {
        try {
            PackageManager packageManager = mContext.getPackageManager();
            mContext.startActivity(packageManager.getLaunchIntentForPackage(packageName)
                    .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK));
            return true;
        } catch (Exception e) {
            return false;
        }

    }

    @ScriptInterface
    public void sendLocalBroadcastSync(Intent intent) {
        LocalBroadcastManager.getInstance(mContext).sendBroadcastSync(intent);
    }

    @ScriptInterface
    public boolean launchApp(String appName) {
        String pkg = getPackageName(appName);
        if (pkg == null)
            return false;
        return launchPackage(pkg);
    }

    @ScriptInterface
    public String getPackageName(String appName) {
        PackageManager packageManager = mContext.getPackageManager();
        List<ApplicationInfo> installedApplications = packageManager.getInstalledApplications(PackageManager.GET_META_DATA);
        for (ApplicationInfo applicationInfo : installedApplications) {
            if (packageManager.getApplicationLabel(applicationInfo).toString().equals(appName)) {
                return applicationInfo.packageName;
            }
        }
        return null;
    }

    @ScriptInterface
    public String getAppName(String packageName) {
        PackageManager packageManager = mContext.getPackageManager();
        try {
            ApplicationInfo applicationInfo = packageManager.getApplicationInfo(packageName, 0);
            CharSequence appName = packageManager.getApplicationLabel(applicationInfo);
            return appName == null ? null : appName.toString();
        } catch (PackageManager.NameNotFoundException e) {
            return null;
        }
    }

    @ScriptInterface
    public boolean openAppSetting(String packageName) {
        return IntentUtil.goToAppDetailSettings(mContext, packageName);
    }

    @ScriptInterface
    public String getFileProviderAuthority() {
        return mFileProviderAuthority;
    }

    @ScriptInterface
    public String getTargetVersionName(String packageName) {
        PackageManager pckMan = mContext.getPackageManager();
        List<PackageInfo> packageInfo = pckMan.getInstalledPackages(0);
        for (PackageInfo pInfo : packageInfo) {
            if (pInfo.packageName.equals(packageName)) {
                return pInfo.versionName;
            }
        }
        return null;
    }

    @ScriptInterface
    public String getUserApp() {
        PackageManager packageManager = mContext.getPackageManager();
        Intent intent = new Intent(Intent.ACTION_MAIN, null);
        intent.addCategory(Intent.CATEGORY_LAUNCHER);
        @SuppressLint("WrongConstant")
        List<ResolveInfo> list = packageManager.queryIntentActivities(intent, PackageManager.PERMISSION_GRANTED);
        JSONArray jsonArray = new JSONArray();
        JSONObject jsonObject;
        for (ResolveInfo resolveInfo : list) {
            if ((resolveInfo.activityInfo.applicationInfo.flags & ApplicationInfo.FLAG_SYSTEM) == 0) {
                try {
                    jsonObject = new JSONObject();
                    String appName = packageManager.getApplicationLabel(resolveInfo.activityInfo.applicationInfo).toString();
                    jsonObject.put("appPackage", resolveInfo.activityInfo.applicationInfo.packageName);
                    jsonObject.put("appName", appName);
                    jsonArray.put(jsonObject);
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        }
//        Log.e("CCCCCCCCC:", "" + jsonArray.toString());
        return jsonArray.toString();


//        List<PackageInfo> packageInfo = pckMan.getInstalledPackages(0);
//        List<PackageInfo> userPackage = new ArrayList<>();
//        for (PackageInfo pInfo : packageInfo) {
//            if ((pInfo.applicationInfo.flags & ApplicationInfo.FLAG_SYSTEM) == 0) {
//                // 系统应用
//                userPackage.add(pInfo);
//                Log.e("CCCCCCCCC:", "" + pInfo.);
//            }
//        }
//        Gson gson = new Gson();
//        String json = gson.toJson(userPackage);
//        Log.e("CCCCCCCCC:", "" + json);
//        return json;
    }

    @Nullable
    public Activity getCurrentActivity() {
        Log.d("App", "getCurrentActivity: " + mCurrentActivity.get());
        return mCurrentActivity.get();
    }

    @ScriptInterface
    public void uninstall(String packageName) {
        mContext.startActivity(new Intent(Intent.ACTION_DELETE, Uri.parse("package:" + packageName))
                .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK));
    }

    @ScriptInterface
    public void viewFile(String path) {
        if (path == null)
            throw new NullPointerException("path == null");
        IntentUtil.viewFile(mContext, path, mFileProviderAuthority);
    }

    @ScriptInterface
    public void editFile(String path) {
        if (path == null)
            throw new NullPointerException("path == null");
        IntentUtil.editFile(mContext, path, mFileProviderAuthority);
    }

    @ScriptInterface
    public void openUrl(String url) {
        if (!url.startsWith("http://") && !url.startsWith("https://")) {
            url = "http://" + url;
        }
        mContext.startActivity(new Intent(Intent.ACTION_VIEW)
                .setData(Uri.parse(url))
                .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK));
    }

    public void setCurrentActivity(Activity currentActivity) {
        mCurrentActivity = new WeakReference<>(currentActivity);
        Log.d("App", "setCurrentActivity: " + currentActivity);
    }

    //开启无障碍服务  com.stardust.autojs.core.accessibility.AccessibilityService
    @ScriptInterface
    public void autoOpenAccessibilityService() {
        Log.d("XXXXXX", "start!");
        if (!isStartAccessibilityServiceEnable()) {
            Log.d("XXXXXX", "没有权限，开始申请!");
            Settings.Secure.putString(mContext.getContentResolver(),
                    Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES,
                    "com.stardust.autojs/AccessibilityService");
            Settings.Secure.putInt(mContext.getContentResolver(),
                    Settings.Secure.ACCESSIBILITY_ENABLED, 1);
            Log.d("XXXXXX", "申请成功!");
        } else {
            Log.d("XXXXXX", "有权限，无需申请!");
        }
    }

    /**
     * 判断无障碍服务是否开启
     *
     * @return
     */
    private boolean isStartAccessibilityServiceEnable() {
        AccessibilityManager accessibilityManager =
                (AccessibilityManager)
                        mContext.getSystemService(Context.ACCESSIBILITY_SERVICE);
        assert accessibilityManager != null;
        List<AccessibilityServiceInfo> accessibilityServices =
                accessibilityManager.getEnabledAccessibilityServiceList(
                        AccessibilityServiceInfo.FEEDBACK_ALL_MASK);
        for (AccessibilityServiceInfo info : accessibilityServices) {
            if (info.getId().contains(mContext.getPackageName())) {
                return true;
            }
        }
        return false;
    }

    /**
     * 获取google 账号
     *
     * @return
     */
    @ScriptInterface
    public String getGoogleAccount() {
        AccountManager accountManager = AccountManager.get(mContext);
        Account[] accounts = accountManager.getAccounts();
        for (Account account : accounts) {
            if (account.type.equals("com.google")) {
                return account.name;
            }
        }
        return "";
    }

    @ScriptInterface
    public void addIconToStatusbar(boolean isSocketEnable) {
        try {
            NotificationManager manager = (NotificationManager) mContext.getSystemService(Context.NOTIFICATION_SERVICE);
            // 创建一个Notification并设置相关属性
            NotificationCompat.Builder builder = new NotificationCompat.Builder(mContext);
            int smallIcon = isSocketEnable ? R.drawable.socket_enable : R.drawable.socket_disenable;
            builder.setAutoCancel(false)//通知设置不会自动显示
                    .setShowWhen(false)//显示时间
                    .setSmallIcon(smallIcon)//设置通知的小图标
//                .setContentTitle("")
                    .setContentText("Socket连接");//设置通知的内容
            Notification notification = builder.build();
            manager.notify(0, notification);// 显示通知
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void deleteIconToStatusbar() {
        try {
            NotificationManager notificationManager = (NotificationManager) mContext.getSystemService(Context.NOTIFICATION_SERVICE);
            notificationManager.cancel(0);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    @ScriptInterface
    public void addGoogleToStatusbar(boolean isSocketEnable) {
        try {
            NotificationManager manager = (NotificationManager) mContext.getSystemService(Context.NOTIFICATION_SERVICE);
            // 创建一个Notification并设置相关属性
            NotificationCompat.Builder builder = new NotificationCompat.Builder(mContext);
            int smallIcon = isSocketEnable ? R.drawable.google_enable : R.drawable.google_disenable;
            builder.setAutoCancel(false)//通知设置不会自动显示
                    .setShowWhen(false)//显示时间
                    .setSmallIcon(smallIcon);//设置通知的小图标
//                .setContentTitle("")
//                    .setContentText("");//设置通知的内容
            Notification notification = builder.build();
            manager.notify(1, notification);// 显示通知
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void deleteGoogleToStatusbar() {
        try {
            NotificationManager notificationManager = (NotificationManager) mContext.getSystemService(Context.NOTIFICATION_SERVICE);
            notificationManager.cancel(1);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
