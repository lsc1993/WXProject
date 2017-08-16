package com.fuyao.dao.order;

import java.util.HashMap;

import javax.annotation.Resource;

import org.hibernate.HibernateException;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
import org.springframework.stereotype.Repository;

import com.fuyao.model.order.Order;

@Repository("orderDao")
public class OrderDao implements IOrderDao {
	
	@Resource
	private SessionFactory sessionFactory;

	public void setSessionFactory(SessionFactory sessionFactory) {
		this.sessionFactory = sessionFactory;
	}
	
	private Session getCurrentSession() {
		return this.sessionFactory.getCurrentSession();
	}

	public HashMap<String, String> submitOrder(Order order) {
		// TODO Auto-generated method stub
		HashMap<String,String> result = new HashMap<String,String>();
		try {
			this.getCurrentSession().save(order);
			result.put("result", "success");
			result.put("message", "交易成功");
		} catch (HibernateException e) {
			e.printStackTrace();
			result.put("result", "falut");
			result.put("message", "交易失败，请重试");
		}
		return result;
	}

	public long getOrderCount() {
		// TODO Auto-generated method stub
		String hql = "select count(id) from Order";
		Query<Long> query = this.getCurrentSession().createQuery(hql,Long.class);
		return query.getSingleResult();
	}
}
