package com.fuyao.weixinpay;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;

public class WXPayRequest {

    public WXPayRequest(){

    }

    public String requestOnce(final String requestUrl, final String method, String param, boolean useCert, int connectTimeOut, int readTimeOut) {
        HttpURLConnection conn = null;
        StringBuilder builder = new StringBuilder();
        try {
            URL url = new URL(requestUrl);
            conn = (HttpURLConnection) url.openConnection();
            conn.setDoOutput(true);
            conn.setDoInput(true);
            conn.setUseCaches(false);
            conn.setRequestMethod(method);
            conn.setConnectTimeout(connectTimeOut);
            conn.setReadTimeout(readTimeOut);
            OutputStream out = conn.getOutputStream();
            out.write(param.getBytes());
            out.flush();
            out.close();
            int responseCode = conn.getResponseCode();
            if (responseCode == 200) {
                InputStream inputStream = conn.getInputStream();
                BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream, "utf-8"));
                String line = null;
                while ((line = reader.readLine()) != null) {
                    builder.append(line);
                }
                reader.close();
                inputStream.close();
            }
        } catch (MalformedURLException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return builder.toString();
    }

    public String request(final String requestUrl, final String method, String param, boolean useCert, int connectTimeOut, int readTimeOut) {
        return requestOnce(requestUrl, method, param, useCert, connectTimeOut, readTimeOut);
    }
}
