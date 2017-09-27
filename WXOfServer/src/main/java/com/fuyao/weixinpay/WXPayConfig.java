package com.fuyao.weixinpay;

public class WXPayConfig {

    public WXPayConfig() {}

    private final String APPID = "wx29ffb7f4b6c0a1bb";
    private final String KEY = "liushuang19930123fuyaoINTNETBXFW";
    private final String MCHID = "1480515542";
    private final String ORDERURL = "https://api.mch.weixin.qq.com/pay/unifiedorder";
    private final String JSAPI = "JSAPI";
    private final String SERVER_IP = "120.24.81.6";
    private final String NOTIFY_URL = "http://www.hzfuyao.com:8080/WXOfServer/wxpay/notify";

    public String getAPPID() {
        return APPID;
    }

    public String getKEY() {
        return KEY;
    }

    public String getMCHID() {
        return MCHID;
    }

    public String getORDERURL() {
        return ORDERURL;
    }

    public String getJSAPI() {
        return JSAPI;
    }

    public String getSERVER_IP() {
        return SERVER_IP;
    }

    public String getNOTIFY_URL() {
        return NOTIFY_URL;
    }

    /**
     * HTTP(S) 连接超时时间，单位毫秒
     *
     * @return
     */
    public int getHttpConnectTimeoutMs() {
        return 6*1000;
    }

    /**
     * HTTP(S) 读数据超时时间，单位毫秒
     *
     * @return
     */
    public int getHttpReadTimeoutMs() {
        return 8*1000;
    }
}
