package com.fuyao.weixin;

public class WXAuthMessage {
	
	private WXAuthMessage() {
		
	}
	
	private static WXAuthMessage instance;
	
	public static WXAuthMessage getInstance() {
		if (instance == null) {
			instance = new WXAuthMessage();
		}
		return instance;
	}
	
	private final String APPID = "XXXXXXX";
	private final String SECRT = "XXXXXX";
	
	private String requestUrl = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=%s&secret=%s&code=%s&grant_type=authorization_code";
	
	private String openid;
	private String refreshToken;
	
	//----------------微信appid以及secrt------------------------
	public String getAPPID() {
		return APPID;
	}
	
	public String getSECRT() {
		return SECRT;
	}

	//--------------------微信认证请求链接-------------------------
	public String getRequestUrl() {
		return requestUrl;
	}

	//-----------------维护微信openid---------------------------
	public String getOpenid() {
		return openid;
	}

	public void setOpenid(String openid) {
		this.openid = openid;
	}

	public String getRefreshToken() {
		return refreshToken;
	}

	public void setRefreshToken(String refreshToken) {
		this.refreshToken = refreshToken;
	}
}
