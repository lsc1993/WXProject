package com.fuyao.weixinpay.controller;

import com.fuyao.weixinpay.WXPay;
import com.fuyao.weixinpay.WXPayConstants;
import com.fuyao.weixinpay.service.WXPayService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import java.util.HashMap;

@Controller
@RequestMapping("/wxpay")
public class WXPayController {

    @Resource
    private WXPayService wxPayService;

    public void setWxPayService(WXPayService wxPayService) {
        this.wxPayService = wxPayService;
    }

    @ResponseBody
    @RequestMapping(value="/order-pay", method = RequestMethod.POST)
    private HashMap<String,String> payOrder(@RequestBody HashMap<String,String> data) {
        return wxPayService.payOrder(data);
    }
}
