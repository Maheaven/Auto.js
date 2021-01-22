package com.info;

/**
 * Describe:
 * Author: Heaven
 * CtrateTime: 2021/1/19 5:18 PM
 */

import android.util.Log;

import java.io.BufferedReader;
import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;

/**
 * Android运行linux命令
 */
public final class Cmd {

    /**
     * 执行命令并且输出结果
     */
    public static String execCmd(String cmd) {
        String result = "";
        DataOutputStream dos = null;
        DataInputStream dis = null;

        try {
            Process p = Runtime.getRuntime().exec(cmd);
            dos = new DataOutputStream(p.getOutputStream());
            dis = new DataInputStream(p.getInputStream());

            Reader reader = new InputStreamReader(dis);
            BufferedReader bf = new BufferedReader(reader);
            String line = null;
            try {
                while ((line = bf.readLine()) != null) {
                    result += line + "\n";
//                    Log.e("getDeviceInfo:", line);
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
            p.waitFor();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (dos != null) {
                try {
                    dos.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            if (dis != null) {
                try {
                    dis.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
        return result;
    }

}