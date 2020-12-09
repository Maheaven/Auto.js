package com.stardust.autojs.websocket;


import org.java_websocket.client.WebSocketClient;
import org.java_websocket.drafts.Draft_6455;
import org.java_websocket.handshake.ServerHandshake;

import java.net.URI;

/**
 * Describe:
 * Author: Heaven
 * CtrateTime: 2020/10/27 11:02 AM
 */
public class MyWebSocketClient extends WebSocketClient {

    OnSocketListener mOnSocketListener;

    public void setOnSocketListener(OnSocketListener onSocketListener) {
        mOnSocketListener = onSocketListener;
    }

    @Override
    public boolean isOpen() {
        return super.isOpen();
    }

    @Override
    public void close() {
        super.close();
    }

    public MyWebSocketClient(URI serverUri) {
        super(serverUri, new Draft_6455());
    }

    @Override
    public void onOpen(ServerHandshake handshakedata) {
        if (null != mOnSocketListener) {
            mOnSocketListener.onOpen(handshakedata);
        }
    }

    @Override
    public void onMessage(String message) {
        if (null != mOnSocketListener) {
            mOnSocketListener.onMessage(message);
        }
    }

    @Override
    public void onClose(int code, String reason, boolean remote) {
        if (null != mOnSocketListener) {
            mOnSocketListener.onClose(code, reason, remote);
        }
    }

    @Override
    public void onError(Exception ex) {
        try {
            if (null != mOnSocketListener) {
                mOnSocketListener.onError(ex.getMessage());
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}