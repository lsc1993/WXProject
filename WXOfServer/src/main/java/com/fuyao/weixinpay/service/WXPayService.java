package com.fuyao.weixinpay.service;

import com.fuyao.dao.order.IOrderDao;
import com.fuyao.dao.user.IUserDao;
import com.fuyao.util.FuyaoConstants;
import com.fuyao.util.FuyaoUtil;
import com.fuyao.weixinpay.WXPay;
import com.fuyao.weixinpay.WXPayConstants;

import com.fuyao.weixinpay.util.WXPayUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.BufferedReader;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

@Transactional
@Service("wxPayService")
public class WXPayService {
	
	@Resource
	private IUserDao userDao;
	
    public void setUserDao(IUserDao userDao) {
		this.userDao = userDao;
	}

	@Resource
	private IOrderDao orderDao;

    public void setOrderDao(IOrderDao orderDao) {
        this.orderDao = orderDao;
    }

    public Map<String,String> payOrder(HashMap<String,String> data) {
        Map<String,String> result = new HashMap<String,String>();
        long uId = -1;
        String token = data.get("userToken");
        uId = userDao.getUserId(token);
        if (uId == -1) {
            result.put("result", "fault");
            result.put("message", "用户认证失败，请重新登录");
            return result;
        }
        String openid = userDao.getOpenId(uId);
        int totalFee = (int)(Float.parseFloat(data.get("total")) * 100);
        String orderId = FuyaoUtil.generateOrderId();

        Map<String,String> param = new HashMap<String, String>();
        param.put("openid", openid);
        param.put("orderId", orderId);
        param.put("body", FuyaoConstants.DETAIL + data.get("body"));
        param.put("totalFee", String.valueOf(totalFee));

        WXPay pay = new WXPay(WXPayConstants.SignType.MD5);
        Map<String,String> payResult = pay.payOrder(param);
        if ("SUCCESS".equals(payResult.get("return_code")) && "SUCCESS".equals(payResult.get("result_code"))) {
            result = payResult;
        } else {
            result.put("result", "fault");
            result.put("message", "微信支付认证失败");
        }
        return result;
    }

    public Map<String, String> notifyPay(HttpServletRequest request) {
        BufferedReader reader = null;
        String orderId = null;
        try {
            reader = request.getReader();
            String line = null;
            StringBuilder builder = new StringBuilder();
            while ((line = reader.readLine()) != null) {
                builder.append(line);
            }
            Map<String, String> param = WXPayUtil.xmlToMap(builder.toString());
            orderId = param.get("out_trade_no");
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                reader.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        return orderDao.notifyPayOrder(orderId == null? "" : orderId);
    }
}
