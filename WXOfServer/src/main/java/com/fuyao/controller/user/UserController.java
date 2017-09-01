package com.fuyao.controller.user;

import java.util.HashMap;

import javax.annotation.Resource;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSON;
import com.fuyao.service.user.UserService;
import com.fuyao.util.Log;

@Controller
@RequestMapping("/user")
public class UserController {
	
	@Resource
	private UserService userService;

	public void setUserService(UserService userService) {
		this.userService = userService;
	}
	
	@ResponseBody
	@RequestMapping(value="/address",method=RequestMethod.POST)
	private JSON getAddressList(@RequestBody HashMap<String,String> data) {
		Log.log(data.toString());
		return userService.getAddressList(data);
	}
	
	@ResponseBody
	@RequestMapping("/add-addr")
	private HashMap<String,String> addAddress(@RequestBody HashMap<String,String> data) {
		Log.log(data.toString());
		return userService.addAddress(data);
	}
	
	@ResponseBody
	@RequestMapping("/update-addr")
	private HashMap<String,String> updateAddress(@RequestBody HashMap<String,String> data) {
		Log.log(data.toString());
		return userService.updateAddress(data);
	}
	
	@ResponseBody
	@RequestMapping("/del-addr")
	private HashMap<String,String> deleteAddress(@RequestBody HashMap<String,String> data) {
		Log.log(data.toString());
		return userService.deleteAddress(data);
	}
}
