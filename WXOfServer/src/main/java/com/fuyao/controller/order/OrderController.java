package com.fuyao.controller.order;

import java.util.HashMap;

import javax.annotation.Resource;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

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
}
