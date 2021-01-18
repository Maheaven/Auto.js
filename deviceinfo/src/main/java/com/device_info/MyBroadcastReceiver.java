package com.device_info;

import android.app.ActivityManager;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.provider.Settings;
import android.util.Log;

import java.util.List;

/**
 * Describe:
 * Author: Heaven
 * CtrateTime: 2020/12/14 6:45 PM
 */
public class MyBroadcastReceiver extends BroadcastReceiver {
    Intent intent =  new Intent(Settings.ACTION_ADD_ACCOUNT);
    @Override
    public void onReceive(Context context, Intent intent) {
        Log.e("XXXXXXXXXXX：", "收到广播" + intent.getAction());
        if (Intent.ACTION_BOOT_COMPLETED.equals(intent.getAction())) {
            Log.e("XXXXXXXXXXX：", "手机开机。。。。。。。。。");
//            if (isRunning(context)) {
            Intent startIntent = new Intent(context, SplashActivity.class);
            startIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            context.startActivity(startIntent);
//            }
        }
    }

    private boolean isRunning(Context context) {
        ActivityManager am = (ActivityManager) context.getSystemService(Context.ACTIVITY_SERVICE);
        List<ActivityManager.RunningTaskInfo> list = am.getRunningTasks(100);
        for (ActivityManager.RunningTaskInfo info : list) {
            if (info.topActivity.getPackageName().equals("com.aso") && info.baseActivity.getPackageName().equals("com.aso")) {
                return true;
            }
        }
        return false;
    }

}