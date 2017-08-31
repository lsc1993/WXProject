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
	@RequestMapping(value="/cookie",method=RequestMethod.POST)
	private HashMap<String,String> testCookie(HttpServletRequest request,HttpServletResponse response) {
		response.setCharacterEncoding("UTF-8");
		//设置浏览器以UTF-8编码进行接收,解决中文乱码问题
		response.setContentType("text/html;charset=UTF-8");
		Cookie[] cookies = request.getCookies();
		Log.log("cookies length:" + cookies.length);
		for (int i = 0;i < cookies.length;++i) {
			try {
				Log.log("name:" + cookies[i].getName() + "value:" + URLDecoder.decode(cookies[i].getValue(), "utf-8") + "path:" + cookies[i].getPath());
			} catch (UnsupportedEncodingException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		return null;
	}
}
