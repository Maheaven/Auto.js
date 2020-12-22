package com.stardust.autojs.websocket;

import android.util.Log;

import java.io.IOException;
import java.util.concurrent.TimeUnit;

import okhttp3.Call;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

/**
 * Describe:
 * Author: Heaven
 * CtrateTime: 2020/12/21 5:10 PM
 */
public class HttpUtils {

    HttpUtils mHttpUtils;

    /**
     * 构造使用单例模式
     */
    public static HttpUtils getInstance() {
        return HttpUtils.LazyHolder.INSTANCE;
    }

    /**
     * 实现了线程安全，又避免了同步带来的性能影响
     */
    private static class LazyHolder {
        private static final HttpUtils INSTANCE = new HttpUtils();
    }

    public int isWebAccessible(String url) {
        OkHttpClient client = new OkHttpClient.Builder()
                .connectTimeout(1, TimeUnit.SECONDS)//设置连接超时时间
                .readTimeout(1, TimeUnit.SECONDS)//设置读取超时时间
                .build();
        Request request = new Request.Builder()
                .get()
                .url(url)
                .build();
        Call call = client.newCall(request);
        try {
            Response response = call.execute();
            Log.e("OkHttpClient:", "" + response.toString());
            return response.isSuccessful() ? 1 : 0;
        } catch (IOException e) {
            Log.e("OkHttpClient:", "IOException");
            e.printStackTrace();
        }
        return 0;
    }

}