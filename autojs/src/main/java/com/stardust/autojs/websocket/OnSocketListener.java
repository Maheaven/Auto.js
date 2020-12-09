package com.stardust.autojs.websocket;

import org.java_websocket.handshake.ServerHandshake;

/**
 * Describe:
 * Author: Heaven
 * CtrateTime: 2020/10/27 11:07 AM
 */
interface OnSocketListener {

    public void onOpen(ServerHandshake handshakedata);

    public void onMessage(String message);

    public void onClose(int code, String reason, boolean remote);

    public void onError(String ex);

}
