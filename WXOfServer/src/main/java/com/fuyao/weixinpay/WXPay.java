package com.fuyao.weixinpay;

import com.fuyao.weixinpay.util.WXPayUtil;

import java.util.HashMap;
import java.util.Map;

public class WXPay {

    private WXPayConstants.SignType signType;
    private  WXPayConfig config;
    private WXPayRequest wxPayRequest;

    public WXPay() {
        this.config = new WXPayConfig();
        this.wxPayRequest = new WXPayRequest();
    }

    public WXPay (WXPayConstants.SignType signType) {
        this();
        this.signType = signType;
    }

    public HashMap<String, String> request(Map<String, String> data) throws Exception {
        String param = WXPayUtil.mapToXml(data);
        return request(this.config.getORDERURL(), "POST", param, false);
    }

    public HashMap<String, String> request(final String requestUrl, final String method, String param, boolean useCert) {
        String strXml = wxPayRequest.request(requestUrl, method, param, useCert, config.getHttpConnectTimeoutMs(), config.getHttpReadTimeoutMs());
        HashMap<String, String> data;
        try {
            data = (HashMap<String, String>) WXPayUtil.xmlToMap(strXml);
        } catch (Exception e) {
            data = null;
            e.printStackTrace();
        }
        return data;
    }

    public Map<String, String>  fillRequestData(Map<String, String> data) throws Exception {
        data.put("appid", config.getAPPID());
        data.put("mch_id", config.getMCHID());
        data.put("nonce_str", WXPayUtil.generateNonceStr());
        data.put("notify_url",WXPayConstants.NOTIFYURL);
        data.put("spbill_create_ip", WXPayConstants.SERVERIP);
        data.put("trade_type", WXPayConstants.JSAPI);
        if (WXPayConstants.SignType.MD5.equals(this.signType)) {
            data.put("sign_type", WXPayConstants.MD5);
        }
        else if (WXPayConstants.SignType.HMACSHA256.equals(this.signType)) {
            data.put("sign_type", WXPayConstants.HMACSHA256);
        }
        data.put("sign", WXPayUtil.generateSignature(data, config.getKEY(), this.signType));
        return data;
    }
}
