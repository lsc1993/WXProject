package com.fuyao.controller.order;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.HashMap;

import javax.annotation.Resource;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSON;
import com.fuyao.service.order.OrderService;
import com.fuyao.util.Log;

@Controller
@RequestMapping("/order")
public class OrderController {
	
	@Resource
	private OrderService orderService;

	public void setOrderService(OrderService orderService) {
		this.orderService = orderService;
	}
	
	@ResponseBody
	@RequestMapping(value="/submit",method=RequestMethod.POST)
	private HashMap<String,String> submitOrder(@RequestBody HashMap<String,String> data) {
		Log.log(data.toString());
		return orderService.submitOrder(data);
	}
	
	@ResponseBody
	@RequestMapping(value="/submit-multi",method=RequestMethod.POST)
	private HashMap<String,String> submitMultiOrder(@RequestBody String data) {
		Log.log("------multi-------");
		Log.log(data);
		HashMap<String,String> result = new HashMap<String,String>();
		result = orderService.submitMultiOrder(data);
		return result;
	}
	
	@ResponseBody
	@RequestMapping(value="/list",method=RequestMethod.POST)
	private JSON getOrderList(@RequestBody HashMap<String,String> data) {
		Log.log(data.toString());
		return orderService.getOrderList(data);
	}
	
	@ResponseBody
	@RequestMapping(value="/receive",method=RequestMethod.POST)
	private HashMap<String,String> confirmReceive(@RequestBody HashMap<String,String> data) {
		Log.log(data.toString());
		return orderService.confirmReceive(data);
	}

	@ResponseBody
	@RequestMapping(value="/comment",method=RequestMethod.POST)
	private HashMap<String,String> submitComment(@RequestBody HashMap<String,String> data) {
		Log.log(data.toString());
		return orderService.submitComment(data);
	}
}
