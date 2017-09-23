package com.fuyao.weixinpay;

public class WXPayConfig {

    public WXPayConfig() {}

    private final String APPID = "wx29ffb7f4b6c0a1bb";
    private final String KEY = "c5d24a32b5e23b11ceee1b87212eb97a";
    private final String MCHID = "1480515542";
    private final String ORDERURL = "https://api.mch.weixin.qq.com/pay/unifiedorder";

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
