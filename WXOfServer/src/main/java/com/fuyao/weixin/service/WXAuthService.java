package com.fuyao.weixin.service;

import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;

import javax.annotation.Resource;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.fuyao.dao.user.IUserDao;
import com.fuyao.model.user.User;
import com.fuyao.util.FuyaoUtil;
import com.fuyao.util.Log;
import com.fuyao.weixin.WXAuthConnect;
import com.fuyao.weixin.WXAuthMessage;
import com.fuyao.weixin.dao.WXAuthDao;
import com.fuyao.weixin.model.WXAuthority;
import com.fuyao.weixin.model.WXUserInfo;

@Transactional
@Service("wxAuthService")
public class WXAuthService {
	
	@Resource
	private WXAuthDao wxDao;
	
	public void setWxDao(WXAuthDao wxDao) {
		this.wxDao = wxDao;
	}
	
	@Resource 
	private IUserDao userDao;
	
	public void setUserDao(IUserDao userDao) {
		this.userDao = userDao;
	}

	/*
	 * 获取微信用户的openid
	 */
	private HashMap<String,String> getAuthOpenid(String code) {
		HashMap<String,String> result = new HashMap<String,String>();
		String url = String.format(WXAuthMessage.getInstance().getTokenUrl(), WXAuthMessage.getInstance().getAPPID(), WXAuthMessage.getInstance().getSECRT(), code);
		JSONObject json = (JSONObject) WXAuthConnect.getAuthResult(url, "GET");
		Log.log("json:" + json);
		if (null != json) {
			result.put("openid", json.getString("openid"));
			result.put("accessToken", json.getString("access_token"));
		}
		return result;
	}
	
	/*
	 * 获取微信用户信息
	 */
	private WXUserInfo getWXUserInfo(long uId, String openid, String accessToken) {
		WXUserInfo wUser = new WXUserInfo();
		String url = String.format(WXAuthMessage.getInstance().getUserinfoUrl(), accessToken, openid);
		JSONObject json = (JSONObject) WXAuthConnect.getAuthResult(url, "GET");
		wUser.setUid(uId);
		wUser.setName(json.getString("nickname"));
		wUser.setSex(json.getString("sex"));
		wUser.setCountry(json.getString("country"));
		wUser.setProvince(json.getString("province"));
		wUser.setCity(json.getString("city"));
		wUser.setHeadImg(json.getString("headimgurl"));
		wUser.setAuthTime(new Date());
		return wUser;
	}
	
	/*
	 * 认证用户，生成cookie
	 */
	public HashMap<String,String> authWXUser(HttpServletRequest request, HttpServletResponse response) {
		HashMap<String,String> result = new HashMap<String,String>();
		String userToken = null;
		String openid = null;
		String accessToken = null;
		String code = request.getParameter("code");
		
		HashMap<String,String> data = this.getAuthOpenid(code);
		openid = data.get("openid");
		accessToken = data.get("accessToken"); 
		WXAuthority  wAuth = null;
		
		if (null != openid && null != accessToken) {
			wAuth = wxDao.getWXUserAuth(openid);
		} else {
			result.put("result", "fault");
			result.put("message", "微信认证失败，请重试");
			return result;
		}
		
		if (null != wAuth) {
			userToken = userDao.getUserToken(wAuth.getUid());
			if (Calendar.getInstance().get(Calendar.DAY_OF_WEEK) % 5 == 0) {
				WXUserInfo user = wxDao.getWXUserInfo(wAuth.getUid());
				WXUserInfo wUser = this.getWXUserInfo(wAuth.getUid(),openid, accessToken);
				user.setAuthTime(wUser.getAuthTime());
				user.setName(wUser.getName());
				user.setCountry(wUser.getCountry());
				user.setProvince(wUser.getProvince());
				user.setCity(wUser.getCity());
				user.setHeadImg(wUser.getHeadImg());
				user.setSex(wUser.getSex());
				wxDao.addWXUserInfo(user);
			}
		} else {
			User user = new User();
			userToken = FuyaoUtil.generateUserToken();
			user.setUserToken(userToken);
			userDao.addUser(user);
			
			WXAuthority auth = new WXAuthority();
			long uId = userDao.getUser(userToken).getId();
			auth.setUid(uId);
			auth.setOpenid(openid);
			wxDao.addWXAuthMessage(auth);
			
			WXUserInfo wUser = this.getWXUserInfo(uId, openid, accessToken);
			wxDao.addWXUserInfo(wUser);
			result.put("message", "欢迎光临"+wUser.getName());
		}
		generateCookie(userToken, response);
		result.put("result", "success");
		return result;
	}
	
	private void generateCookie(String userToken, HttpServletResponse response) {
		Cookie authCookie = new Cookie("user_token", userToken);
		authCookie.setPath("/");
		response.addCookie(authCookie);
	}
	
	public JSON getWXUserinfo(HashMap<String,String> data) {
		if (null == data.get("userToken")) {
			String result = "{\"result\": \"fault\"}";
			return (JSON) JSON.parse(result);
		}
		long uId = userDao.getUserId(data.get("userToken"));
		WXUserInfo wUser = wxDao.getWXUserInfo(uId);
		return (JSON) JSON.toJSON(wUser);
	}
}
