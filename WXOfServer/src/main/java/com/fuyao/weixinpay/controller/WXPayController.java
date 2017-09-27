package com.fuyao.weixinpay.controller;

import com.fuyao.weixinpay.service.WXPayService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

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
    private Map<String,String> payOrder(@RequestBody HashMap<String,String> data) {
        return wxPayService.payOrder(data);
    }

    @ResponseBody
    @RequestMapping(value="/notify", method = RequestMethod.POST)
    private Map<String, String> notifyPayResult(HttpServletRequest request) {
        return wxPayService.notifyPay(request);
    }
}
