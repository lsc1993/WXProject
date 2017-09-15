package com.fuyao.service.order;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.fuyao.dao.order.IOrderDao;
import com.fuyao.dao.product.IProductDao;
import com.fuyao.dao.user.IUserDao;
import com.fuyao.model.order.Order;
import com.fuyao.model.order.OrderItem;
import com.fuyao.util.FuyaoUtil;
import com.fuyao.util.Log;

@Transactional
@Service("orderService")
public class OrderService {
	
	@Resource
	private IOrderDao orderDao;

	public void setOrderDao(IOrderDao orderDao) {
		this.orderDao = orderDao;
	}
	
	@Resource
	private IUserDao userDao;
	
	public void setUserDao(IUserDao userDao) {
		this.userDao = userDao;
	}
	
	@Resource
	private IProductDao productDao;

	public void setProductDao(IProductDao productDao) {
		this.productDao = productDao;
	}

	public HashMap<String,String> submitOrder(HashMap<String,String> data) {
		HashMap<String,String> result = new HashMap<String,String>();
		long uId = -1;
		String token = data.get("userToken");
		uId = userDao.getUserId(token);
		if (uId == -1) {
			result.put("result", "fault");
			result.put("message", "用户认证失败，请重新登录");
			return result;
		}
		Order order = new Order();
		long orderCount = orderDao.getOrderCount(uId);
		String orderId = new StringBuilder().append("E").
							append(FuyaoUtil.getCurrentTimeAtString("yyyyMMddHHmmss"))
							.append(String.format("%06d", orderCount+1)).toString();
		order.setOrderId(orderId);
		order.setDate(new Date());
		order.setUid(uId);
		order.setPid(data.get("pid"));
		order.setSid(Long.parseLong(data.get("sid")));
		order.setName(data.get("pName"));
		order.setImgurl(data.get("imgurl"));
		order.setPTotal(Float.parseFloat(data.get("pTotal")));
		order.setSendCost(Float.parseFloat(data.get("sendCost")));
		order.setTotal(Float.parseFloat(data.get("total")));
		order.setPCount(Integer.parseInt(data.get("count")));
		order.setStandard(data.get("standard"));
		order.setDiscount(data.get("discount"));
		order.setBuyerMsg(data.get("buyerMsg"));
		order.setSendWay(data.get("sendWay"));
		order.setAid(Long.parseLong(data.get("aid")));
		order.setReceiver(data.get("receiver"));
		order.setPhone(data.get("phone"));
		order.setAddress(data.get("address"));
		order.setPostcode(data.get("postcode"));
		order.setStatus(OrderStatus.WAITSEND.getStatus());
		return orderDao.submitOrder(order);
	}
	
	public HashMap<String,String> submitMultiOrder(String data) {
		HashMap<String,String> result = new HashMap<String,String>();
		JSONObject object = JSON.parseObject(data);
		JSONArray array = (JSONArray) object.get("orders");
		JSONObject common = object.getJSONObject("common");
		long uId = -1;
		String token = common.getString("userToken");
		uId = userDao.getUserId(token);
		if (uId == -1) {
			result.put("result", "fault");
			result.put("message", "用户认证失败，请重新登录");
			return result;
		}
		String discount = common.getString("discount");
		long aId = common.getLongValue("aid");
		String receiver = common.getString("receiver");
		String phone = common.getString("phone");
		String address = common.getString("address");
		String postcode;
		if (null == common.getString("postcode")) {
			postcode = "";
		} else {
			postcode = common.getString("postcode");
		}
		String sendWay = common.getString("sendWay");
		String buyMsg = common.getString("buyMsg");
		float sendCost = common.getFloatValue("sendCost");
		
		int len = array.size();
		for (int i = 0;i < len; ++i) {
			JSONObject obj = array.getJSONObject(i);
			long orderCount = orderDao.getOrderCount(uId);
			String orderId = new StringBuilder().append("E").
								append(FuyaoUtil.getCurrentTimeAtString("yyyyMMddHHmmss"))
								.append(String.format("%06d", orderCount+1)).toString();
			Order order = new Order();
			order.setOrderId(orderId);
			order.setDate(new Date());
			//-----------------common---------------------
			order.setUid(uId);
			order.setDiscount(discount);
			order.setAid(aId);
			order.setReceiver(receiver);
			order.setPhone(phone);
			order.setAddress(address);
			order.setPostcode(postcode);
			order.setSendWay(sendWay);
			order.setBuyerMsg(buyMsg);
			order.setSendCost(sendCost);
			order.setStatus(OrderStatus.WAITSEND.getStatus());
			//------------------order---------------------
			order.setPid(obj.getString("pno"));
			order.setName(obj.getString("pname"));
			order.setSid(obj.getLongValue("sId"));
			order.setStandard(obj.getString("standard"));
			order.setImgurl(obj.getString("imgname"));
			order.setPTotal(obj.getFloatValue("price"));
			order.setPCount(obj.getIntValue("count"));
			order.setTotal(obj.getFloatValue("total"));
			
			result = orderDao.submitOrder(order);
		}
		return result;
	}
	
	public JSON getOrderList(HashMap<String,String> data) {
		int start,limit;
		try {
			start = Integer.parseInt(data.get("start"));
		} catch (NumberFormatException e) {
			start = 0;
			e.printStackTrace();
		}
		try {
			limit = Integer.parseInt(data.get("limit"));
		} catch (NumberFormatException e) {
			limit = 10;
			e.printStackTrace();
		}
		long uId = -1;
		String token = data.get("userToken");
		uId = userDao.getUserId(token);
		OrderStatus s = OrderStatus.valueOf(data.get("status"));
		List<Order> orderList = orderDao.getOrderList(s, start, limit, uId);
		int length = orderList.size();
		List<OrderItem> orderItems = new ArrayList<OrderItem>(length); 
		
		for (Order order : orderList) {
			String status = productDao.getProductStatus(order.getPid());
			OrderItem item = new OrderItem(order);
			item.setPstatus(status);
			orderItems.add(item);
		}
		StringBuilder builder = new StringBuilder();
		builder.append("{").append("\"rows\":").
				append(JSON.toJSONString(orderItems)).
				append(",").append("\"result\":").append(length).
				append("}");
		Log.log("orderList:" + builder.toString());
		return (JSON) JSON.parse(builder.toString());
	}
	
	public HashMap<String,String> confirmReceive(HashMap<String,String> data) {
		HashMap<String,String> result = new HashMap<String,String>();
		long uId = -1;
		String token = data.get("userToken");
		uId = userDao.getUserId(token);
		if (uId == -1) {
			result.put("result", "fault");
			result.put("message", "用户认证失败，请重新登录");
			return result;
		}
		
		long id = Long.parseLong(data.get("id"));
		String status = data.get("status");
		OrderStatus s = OrderStatus.valueOf(status);
		return orderDao.confirmReceive(id, uId, s.getStatus());
	}

	public HashMap<String,String> submitComment(HashMap<String,String> data) {
		HashMap<String,String> result = new HashMap<String,String>();
		long uId = -1;
		String token = data.get("userToken");
		uId = userDao.getUserId(token);
		if (uId == -1) {
			result.put("result", "fault");
			result.put("message", "用户认证失败，请重新登录");
			return result;
		}
		String comment = data.get("comment");
		return orderDao.submitComment(uId, comment);
	}
	
	public enum OrderStatus{
		WAITPAY("待付款"),CANCEL("已取消"),WAITSEND("待发货"),WAITRECEIVE("待收货"),COMPLETE("交易完成"),ALL("全部订单");
		
		private String status;
		
		private OrderStatus(String status) {
			this.status = status;
		}
		
		public String getStatus() {
			return status;
		}
		
		@Override
		public String toString() {
			return this.status;
		}
	}
}
