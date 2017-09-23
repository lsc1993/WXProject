package com.fuyao.weixinpay.util;

import com.fuyao.weixinpay.WXPayConstants;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.io.StringWriter;
import java.security.MessageDigest;
import java.util.*;

public class WXPayUtil {

    /**
    *  将xml格式的字符串转化为map
    *  @param strXml xml格式的字符串
    *  @return map
    * */
    public static Map<String,String> xmlToMap(String strXml) throws Exception {
        Map<String,String> data = new HashMap<String, String>();
        DocumentBuilderFactory documentBuilderFactory = DocumentBuilderFactory.newInstance();
        try {
            DocumentBuilder builder = documentBuilderFactory.newDocumentBuilder();
            InputStream stream = new ByteArrayInputStream(strXml.getBytes("utf-8"));
            Document doc = builder.parse(stream);
            doc.getDocumentElement().normalize();
            NodeList nodeList = doc.getDocumentElement().getChildNodes();
            for (int i = 0;i < nodeList.getLength();++i) {
                Node node = nodeList.item(i);
                if (node.getNodeType() == Node.ELEMENT_NODE) {
                    Element element = (Element) node;
                    data.put(element.getNodeName(), element.getTextContent());
                }
            }
            try {
                stream.close();
            } catch (Exception ex) {
                // do nothing
            }
            return data;
        } catch (Exception e) {
            e.printStackTrace();
            throw  e;
        }
    }

    /**
     * 将map转化为xml形式的字符串
     * @param param map
     * @return xml形式字符串
     */
    public static String mapToXml(Map<String, String> param) throws Exception {
        DocumentBuilderFactory documentBuilderFactory = DocumentBuilderFactory.newInstance();
        DocumentBuilder documentBuilder = documentBuilderFactory.newDocumentBuilder();
        Document document = documentBuilder.newDocument();
        Element root = document.createElement("xml");
        document.appendChild(root);
        for (String key : param.keySet()) {
            String value = param.get(key);
            if (value == null) {
                value = "";
            }
            value = value.trim();
            Element filed = document.createElement(key);
            filed.appendChild(document.createTextNode(value));
            root.appendChild(filed);
        }
        TransformerFactory tf = TransformerFactory.newInstance();
        Transformer transformer = tf.newTransformer();
        DOMSource source = new DOMSource(document);
        transformer.setOutputProperty(OutputKeys.ENCODING, "UTF-8");
        transformer.setOutputProperty(OutputKeys.INDENT, "yes");
        StringWriter writer = new StringWriter();
        StreamResult result = new StreamResult(writer);
        transformer.transform(source, result);
        String output = writer.getBuffer().toString();
        writer.close();
        return output;
    }

    /**
    *  生成随机字符串 nonce str
    *  @return 获取随机字符串
    * */
    public static String generateNonceStr() {
        return UUID.randomUUID().toString().replace("-","").substring(0,32);
    }

    /**
     * 生成 MD5
     * @param data 待处理数据
     * @return MD5处理结果
     */
    public static String MD5(String data) throws Exception {
        MessageDigest md = MessageDigest.getInstance("MD5");
        byte[] array = md.digest(data.getBytes("UTF-8"));
        StringBuilder builder = new StringBuilder();
        for (byte item : array) {
            builder.append(Integer.toHexString((item & 0xFF | 0x100)).substring(1,3));
        }
        return builder.toString().toUpperCase();
    }

    /**
     * 生成签名 MD5 HMACSHA256
     * @param data 参数
     * @param key API密钥
     * @param signType 签名方式
     * @return 签名
     */
    public static String generateSignature(final Map<String,String> data, String key, WXPayConstants.SignType signType) throws Exception {
        Set<String> keySet = data.keySet();
        String[] keyArray = keySet.toArray(new String[keySet.size()]);
        Arrays.sort(keyArray);
        StringBuilder sb = new StringBuilder();
        for (String k : keyArray) {
            if (k.equals(WXPayConstants.FIELD_SIGN)) {
                continue;
            }
            if (data.get(k).trim().length() > 0) {
                sb.append(k).append("=").append(data.get(k).trim()).append("&");
            }
            sb.append("key=").append(key);
            if (WXPayConstants.SignType.MD5 == signType) {
                return MD5(sb.toString().toUpperCase());
            }
        }
        throw new Exception(String.format("Invalid sign_type: %s", signType));
    }
}
