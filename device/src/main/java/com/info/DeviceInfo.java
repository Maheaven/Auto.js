package com.info;


import android.Manifest;
import android.content.Context;
import android.content.pm.PackageManager;
import android.text.TextUtils;
import android.util.Log;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

import androidx.core.content.ContextCompat;

/**
 * Describe:
 * Author: Heaven
 * CtrateTime: 2021/1/19 6:01 PM
 */
public class DeviceInfo {

    private static class SingletonHolder {
        private static final DeviceInfo INSTANCE = new DeviceInfo();
    }

    private DeviceInfo() {

    }

    public static final DeviceInfo getInstance() {
        return SingletonHolder.INSTANCE;
    }

    public void start(Context context, MainActivity.CallBack callBack) {
        String ua = Utils.getUserAgentString(context);
        new Thread(new Runnable() {
            @Override
            public void run() {
                String adid = "";
                try {
                    adid = AdvertisingIdClient.getGoogleAdId(context);
                    Log.e("getDeviceInfo:", "adid:  " + adid);
                } catch (Exception e) {
                    e.printStackTrace();
                }
                getDeviceInfo(context, adid, ua, callBack);
            }
        }).start();
    }

    private void getDeviceInfo(Context context, String adid, String ua, MainActivity.CallBack callBack) {
        try {
            int device_width = Utils.getDeviceWidth(context);
            int device_height = Utils.getDeviceHeight(context);

            String imei = "";
            String imsi = "";
            if (ContextCompat.checkSelfPermission(context, Manifest.permission.READ_PHONE_STATE) == PackageManager.PERMISSION_GRANTED) {
                imei = Utils.getIMEI(context);
                imsi = Utils.getIMSI(context);
            }
            String manufacturer = Utils.getDeviceManufacturer();
            String product = Utils.getDeviceProduct();
            String brand = Utils.getDeviceBrand();
            String model = Utils.getDeviceModel();
            String board = Utils.getDeviceBoard();
            String device = Utils.getDeviceDevice();
            String fingerprint = Utils.getDeviceFubgerprint();
            String hardware = Utils.getDeviceHardware();
            String host = Utils.getDeviceHost();
            String display = Utils.getDeviceDisplay();
            String build_id = Utils.getDeviceId();
            String user = Utils.getDeviceUser();
            String serial = Utils.getDeviceSerial();
            int sdk_int = Utils.getDeviceSDK();
            String version_release = Utils.getDeviceAndroidVersion();
            String language = Utils.getDeviceDefaultLanguage();
            String getprop = "";
            try {
                getprop = Cmd.execCmd("getprop");
                getprop = "{" + getprop + "[end]:[end]}";
                getprop = getprop.replaceAll("\"", "");
                getprop = getprop.replaceAll("\n", ",");
                getprop = getprop.replaceAll("\\[", "\"");
                getprop = getprop.replaceAll("]", "\"");
            } catch (Exception e) {
                e.printStackTrace();
            }
            JSONObject jsonObject = new JSONObject();
            jsonObject.put("adid", adid);
            jsonObject.put("device_width", device_width);
            jsonObject.put("device_height", device_height);
            jsonObject.put("imei", imei);
            jsonObject.put("imsi", imsi);
            jsonObject.put("manufacturer", manufacturer);
            jsonObject.put("product", product);
            jsonObject.put("brand", brand);
            jsonObject.put("model", model);
            jsonObject.put("board", board);
            jsonObject.put("device", device);
            jsonObject.put("fingerprint", fingerprint);
            jsonObject.put("hardware", hardware);
            jsonObject.put("host", host);
            jsonObject.put("display", display);
            jsonObject.put("build_id", build_id);
            jsonObject.put("user", user);
            jsonObject.put("serial", serial);
            jsonObject.put("sdk_int", sdk_int);
            jsonObject.put("version_release", version_release);
            jsonObject.put("language", language);
            jsonObject.put("ua", ua);
            jsonObject.put("getprop", getprop);
            sendPost(context, jsonObject.toString(), callBack);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void sendPost(Context context, String json, MainActivity.CallBack callBack) {
        String urlPath = "http://159.138.145.182/api/Deviceinfo/add";
//        String urlPath = "http://139.9.214.110/api/Deviceinfo/add";
        HttpURLConnection conn = null;
        try {
            URL url = new URL(urlPath);
            conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setDoOutput(true);
            conn.setDoInput(true);
            conn.setConnectTimeout(20000);
            conn.setReadTimeout(20000);
            conn.setUseCaches(false);
            conn.setRequestProperty("Connection", "Keep-Alive");
            conn.setRequestProperty("Charset", "UTF-8");
            // 设置文件类型:
            conn.setRequestProperty("Content-Type", "application/json; charset=UTF-8");
            conn.setRequestProperty("accept", "application/json");
            // 往服务器里面发送数据
            if (json != null && !TextUtils.isEmpty(json)) {
                byte[] writebytes = json.getBytes();
                // 设置文件长度
                conn.setRequestProperty("Content-Length", String.valueOf(writebytes.length));
                OutputStream outwritestream = conn.getOutputStream();
                outwritestream.write(json.getBytes());
                outwritestream.flush();
                outwritestream.close();
                Log.e("getDeviceInfo:", "getResponseCode=" + conn.getResponseCode());
                if (200 == conn.getResponseCode()) {
                    BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream(), "utf-8"));
                    String resultData = "";
                    String inputLine = "";
                    while ((inputLine = reader.readLine()) != null) {
                        resultData += inputLine + "\n";
                    }
                    reader.close();
                    Log.e("getDeviceInfo", "resultData:" + resultData);
                    try {
                        JSONObject jsonObject = new JSONObject(resultData);
                        if (jsonObject.getInt("code") == 0) {
                            callBack.success();
                            Log.e("getDeviceInfo", "上报成功");
                        } else {
                            Log.e("getDeviceInfo", "上报失败");
                        }
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            if (null != conn) {
                conn.disconnect();
            }
        }
    }
}