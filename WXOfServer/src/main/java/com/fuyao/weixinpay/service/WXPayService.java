package com.fuyao.weixinpay.service;

import com.fuyao.util.FuyaoUtil;
import com.fuyao.weixin.dao.WXAuthDao;
import com.fuyao.weixinpay.WXPay;
import com.fuyao.weixinpay.WXPayConstants;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

import javax.annotation.Resource;

@Transactional
@Service("wxPayService")
public class WXPayService {
	
	@Resource
	private WXAuthDao wxAuthDao;
	
    public void setWxAuthDao(WXAuthDao wxAuthDao) {
		this.wxAuthDao = wxAuthDao;
	}

	public HashMap<String,String> payOrder(HashMap<String,String> data) {
        return wxpayProcess(data);
    }

    private HashMap<String,String> wxpayProcess(Map<String, String> data) {
        WXPay pay = new WXPay(WXPayConstants.SignType.MD5);
        HashMap<String, String> param = new HashMap<String, String>();
        Random random = new Random();
        int no = random.nextInt(100000);
        String orderId = new StringBuilder().append("E").
				append(FuyaoUtil.getCurrentTimeAtString("yyyyMMddHHmmss"))
				.append(String.format("%06d", no)).toString();
        param.put("out_trade_no", orderId);
        param.put("body", "BXFW");
        param.put("total_fee", Integer.parseInt(data.get("total"))+"");
        param.put("openid", wxAuthDao.getOpenId(data.get("userToken")));
        try {
            param = (HashMap<String, String>) pay.fillRequestData(param);
            /*HashMap<String, String> result = new HashMap<String, String>();
            result = */
            return pay.request(param);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}
