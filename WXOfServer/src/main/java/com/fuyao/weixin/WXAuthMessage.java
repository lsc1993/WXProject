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
	
	private final String APPID = "wx29ffb7f4b6c0a1bb";
	private final String SECRT = "c5d24a32b5e23b11ceee1b87212eb97a";
	private final String MCHID = "1480515542";
	
	private final String tokenUrl = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=%s&secret=%s&code=%s&grant_type=authorization_code";
	private final String userinfoUrl = "https://api.weixin.qq.com/sns/userinfo?access_token=%s&openid=%s&lang=zh_CN";
	
	//----------------微信appid以及secrt------------------------
	public String getAPPID() {
		return APPID;
	}
	
	public String getSECRT() {
		return SECRT;
	}

	public String getMCHID() {
		return MCHID;
	}

	//--------------------微信认证请求链接-------------------------
	public String getTokenUrl() {
		return tokenUrl;
	}

	public String getUserinfoUrl() {
		return userinfoUrl;
	}
}
