package com.fuyao.weixin;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;

import com.alibaba.fastjson.JSON;
import com.fuyao.util.Log;

public class WXAuthConnect {
	
	public static JSON getAuthResult(final String requestUrl, final String method) {
		HttpURLConnection conn = null;
		JSON json = null;
		try {
			URL url = new URL(requestUrl);
			conn = (HttpURLConnection) url.openConnection();
			conn.setDoOutput(true);
			conn.setDoInput(true);
			conn.setUseCaches(false);
			conn.setRequestMethod(method);
			conn.setConnectTimeout(15000);
			conn.setReadTimeout(15000);
			conn.connect();
			Log.log("resCode:" + conn.getResponseCode());
			if (conn.getResponseCode() == HttpURLConnection.HTTP_OK) {
				InputStream in = conn.getInputStream();
				InputStreamReader reader = new InputStreamReader(in, "UTF-8");
				BufferedReader br = new BufferedReader(reader);
				String str;
				StringBuilder builder = new StringBuilder();
				while((str = br.readLine()) != null) {
					builder.append(str);
				}
				json = (JSON) JSON.parse(builder.toString());
				br.close();
				reader.close();
				in.close();
			}
		} catch (MalformedURLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} finally {
			if (null != conn) {
				conn.disconnect();
			}
		}
		return json;
	}
}
