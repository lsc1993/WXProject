package com.fuyao.service.order;

import java.util.Date;
import java.util.HashMap;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fuyao.dao.order.IOrderDao;
import com.fuyao.model.order.Order;
import com.fuyao.util.FuyaoUtil;

@Transactional
@Service("orderService")
public class OrderService {
	
	@Resource
	private IOrderDao orderDao;

	public void setOrderDao(IOrderDao orderDao) {
		this.orderDao = orderDao;
	}
	
	public HashMap<String,String> submitOrder(HashMap<String,String> data) {
		Order order = new Order();
		long orderCount = orderDao.getOrderCount();
		String orderId = new StringBuilder().append("E").
							append(FuyaoUtil.getCurrentTimeAtString("yyyyMMddHHmmss"))
							.append(String.format("%06d", orderCount+1)).toString();
		order.setOrderId(orderId);
		order.setDate(new Date());
		order.setUid(Long.parseLong(data.get("uid")));
		order.setPid(data.get("pid"));
		order.setSid(Long.parseLong(data.get("sid")));
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
		return orderDao.submitOrder(order);
	}
}
