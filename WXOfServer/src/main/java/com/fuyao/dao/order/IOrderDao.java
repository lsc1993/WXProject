package com.fuyao.dao.order;

import java.util.HashMap;

import com.fuyao.model.order.Order;

public interface IOrderDao {
	HashMap<String,String> submitOrder(Order order);
	long getOrderCount();
}
