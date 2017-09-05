package com.fuyao.weixin.controller;

import java.util.HashMap;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSON;
import com.fuyao.weixin.service.WXAuthService;

@Controller
@RequestMapping("/wxauth")
public class WXAuthController {
	
	@Resource
	private WXAuthService wxService;

	public void setWxService(WXAuthService wxService) {
		this.wxService = wxService;
	}
	
	@ResponseBody
	@RequestMapping("/auth")
	private HashMap<String,String> authWXUser(HttpServletRequest request, HttpServletResponse response) {
		return wxService.authWXUser(request, response);
	}
	
	@ResponseBody
	@RequestMapping("/userinfo")
	private JSON getWXUserinfo(@RequestBody HashMap<String,String> data) {
		return wxService.getWXUserinfo(data);
	}
}
