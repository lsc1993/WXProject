package com.fuyao.dao.order;

import java.util.HashMap;
import java.util.List;

import com.fuyao.model.order.Order;
import com.fuyao.service.order.OrderService.OrderStatus;

public interface IOrderDao {
	HashMap<String,String> submitOrder(Order order);
	long getOrderCount(long uid);
	List<Order> getOrderList(OrderStatus status, int start, int limit, long uid);
	HashMap<String,String> confirmReceive(long id, long uid, String status);
	HashMap<String,String> submitComment(long uid, String comment);
}
