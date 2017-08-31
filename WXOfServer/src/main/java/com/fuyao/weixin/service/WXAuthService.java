package com.fuyao.weixin.service;

import java.util.HashMap;
import java.util.UUID;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSONObject;
import com.fuyao.dao.user.IUserDao;
import com.fuyao.model.user.User;
import com.fuyao.util.FuyaoUtil;
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

	private String getAuthOpenid(String code) {
		String openid = null;
		String url = String.format(WXAuthMessage.getInstance().getRequestUrl(), WXAuthMessage.getInstance().getAPPID(), WXAuthMessage.getInstance().getSECRT(), code);
		JSONObject json = (JSONObject) WXAuthConnect.getAuthResult(url, "GET");
		if (null != json) {
			openid = json.getString("openid");
			WXAuthMessage.getInstance().setOpenid(openid);
		}
		return openid;
	}
	
	private WXUserInfo getWXUserInfo(long uId, String code) {
		WXUserInfo wUser = new WXUserInfo();
		String url = String.format(WXAuthMessage.getInstance().getRequestUrl(), WXAuthMessage.getInstance().getAPPID(), WXAuthMessage.getInstance().getSECRT(), code);
		JSONObject json = (JSONObject) WXAuthConnect.getAuthResult(url, "GET");
		wUser.setUid(uId);
		wUser.setName(json.getString("nickname"));
		wUser.setSex(json.getString("sex"));
		wUser.setCountry(json.getString("country"));
		wUser.setProvince(json.getString("province"));
		wUser.setCity(json.getString("city"));
		return wUser;
	}
	
	private HashMap<String,String> authWXUser(String code) {
		String userToken = null;
		String openid = this.getAuthOpenid(code);
		WXAuthority  wAuth = wxDao.getWXUserAuth(openid);
		if (null != wAuth) {
			userToken = userDao.getUserToken(wAuth.getUid());
		} else {
			User user = new User();
			String token = FuyaoUtil.generateUserToken();
			user.setUserToken(token);
			userDao.addUser(user);
			
			WXAuthority auth = new WXAuthority();
			long uId = userDao.getUser(token).getId();
			auth.setUid(uId);
			auth.setOpenid(openid);
			wxDao.addWXAuthMessage(auth);
			
			WXUserInfo wUser = this.getWXUserInfo(uId, code);
			wxDao.addWXUserInfo(wUser);
		}
		
		return null;
	}
}
