package com.stardust.autojs.websocket;

import java.net.URI;

/**
 * Describe:
 * Author: Heaven
 * CtrateTime: 2020/10/28 9:57 AM
 */
public class WebSocketClientInstance {

    MyWebSocketClient mMyWebSocketClient;

    /**
     * 构造使用单例模式
     */
    public static WebSocketClientInstance getInstance() {
        return LazyHolder.INSTANCE;
    }

    /**
     * 实现了线程安全，又避免了同步带来的性能影响
     */
    private static class LazyHolder {
        private static final WebSocketClientInstance INSTANCE = new WebSocketClientInstance();
    }

    public MyWebSocketClient getWebSocketClient(URI serverUri) {
        if (null != mMyWebSocketClient && mMyWebSocketClient.isOpen()) {
            mMyWebSocketClient.close(1000);
            mMyWebSocketClient = null;
        }
        mMyWebSocketClient = new MyWebSocketClient(serverUri);
        return mMyWebSocketClient;
    }

}