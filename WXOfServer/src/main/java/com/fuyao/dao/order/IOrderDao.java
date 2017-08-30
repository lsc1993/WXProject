package com.fuyao.dao.order;

import java.util.HashMap;
import java.util.List;

import com.fuyao.model.order.Order;
import com.fuyao.service.order.OrderService.OrderStatus;

public interface IOrderDao {
	HashMap<String,String> submitOrder(Order order);
	long getOrderCount();
	List<Order> getOrderList(OrderStatus status, int start, int limit, long uid);
}
