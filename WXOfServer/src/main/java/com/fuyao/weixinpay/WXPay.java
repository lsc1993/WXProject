package com.fuyao.weixinpay;

import com.fuyao.weixinpay.util.WXPayUtil;

import java.util.HashMap;
import java.util.Map;
/**
 * @author ls
 * 微信支付请求
 */
public class WXPay {

    private WXPayConstants.SignType signType;
    private WXPayConfig config;
    private WXPayRequest wxPayRequest;

    public WXPay() {
        this.config = new WXPayConfig();
        this.wxPayRequest = new WXPayRequest();
    }

    public WXPay (WXPayConstants.SignType signType) {
        this();
        this.signType = signType;
    }

    public WXPayConfig getConfig() {
		return config;
	}

	/**
	 * 统一下单请求
	 * @param data 请求参数
     * @return 统一下单认证结果
	 */
	public Map<String, String> request(Map<String, String> data) throws Exception {
        String param = WXPayUtil.mapToXml(data);
        return this.request(this.config.getORDERURL(), "POST", param, false);
    }

    /**
     * 发起微信支付认证请求
     * @param requestUrl 请求链接
     * @param method 请求方式
     * @param param 请求参数
     * @param useCert 是否使用证书
     * @return 认证结果
     */
    private Map<String, String> request(final String requestUrl, final String method, String param, boolean useCert) {
        String strXml = wxPayRequest.request(requestUrl, method, param, useCert, config.getHttpConnectTimeoutMs(), config.getHttpReadTimeoutMs());
        Map<String, String> data;
        try {
            data = WXPayUtil.xmlToMap(strXml);
        } catch (Exception e) {
            data = null;
            e.printStackTrace();
        }
        return data;
    }

    /**
     * 填充微信支付参数
     * @param data 需要填充的Hashmap
     * @return 参数
     */
    public Map<String, String>  fillRequestData(Map<String, String> data) throws Exception {
        data.put("appid", config.getAPPID());
        data.put("mch_id", config.getMCHID());
        data.put("nonce_str", WXPayUtil.generateNonceStr());
        data.put("notify_url",config.getNOTIFY_URL());
        data.put("spbill_create_ip", config.getSERVER_IP());
        data.put("trade_type", config.getJSAPI());
        if (WXPayConstants.SignType.MD5.equals(this.signType)) {
            data.put("sign_type", WXPayConstants.MD5);
        }
        else if (WXPayConstants.SignType.HMACSHA256.equals(this.signType)) {
            data.put("sign_type", WXPayConstants.HMACSHA256);
        }
        data.put("sign", WXPayUtil.generateSignature(data, config.getKEY(), this.signType));
        return data;
    }

    /**
     * 发起支付
     * @param data 支付参数
     * @return 支付结果
     */
    public Map<String,String> payOrder(Map<String,String> data) {
        return this.wxpayProcess(data);
    }

    private Map<String,String> wxpayProcess(Map<String, String> data) {
        Map<String, String> param = new HashMap<String, String>();
        param.put("out_trade_no", data.get("orderId"));
        param.put("body", data.get("body"));
        param.put("total_fee", data.get("totalFee"));
        param.put("openid", data.get("openid"));
        try {
            param = this.fillRequestData(param);
            Map<String, String> result = this.returnAuthParam(this.request(param), config.getKEY());
            result.put("orderId", data.get("orderId"));
            return result;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    private Map<String, String> returnAuthParam(Map<String, String> temp, String key) {
        Map<String, String> result = new HashMap<String, String>();
        long timestamp = System.currentTimeMillis() / 1000;
        result.put("appId", temp.get("appid"));
        result.put("timeStamp", String.valueOf(timestamp));
        result.put("nonceStr", temp.get("nonce_str"));
        result.put("package", "prepay_id=" + temp.get("prepay_id"));
        result.put("signType", WXPayConstants.MD5);
        String sign = null;
        try {
            sign = WXPayUtil.generateSignature(result, key, WXPayConstants.SignType.MD5);
        } catch (Exception e) {
            e.printStackTrace();
        }
        result.put("paySign", sign);
        result.put("return_code", temp.get("return_code"));
        result.put("result_code", temp.get("result_code"));
        return result;
    }
}
