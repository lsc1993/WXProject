package com.fuyao.dao.order;

import java.util.HashMap;
import java.util.List;

import javax.annotation.Resource;

import org.hibernate.HibernateException;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
import org.springframework.stereotype.Repository;

import com.fuyao.model.order.Order;
import com.fuyao.page.CommonPage;
import com.fuyao.service.order.OrderService.OrderStatus;

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

	public List<Order> getOrderList(OrderStatus status, int start, int limit) {
		// TODO Auto-generated method stub
		String hql = null;
		Query<Order> query = null;
		CommonPage page = new CommonPage();
		switch(status) {
			case CANCEL:
			case WAITPAY:
			case WAITSEND:
			case WAITRECEIVE:
			case COMPLETE:
				hql = "from Order where status=:status";
				query = page.createQuery(this.getCurrentSession(), hql, start, limit);
				query.setParameter("status", status.getStatus());
				break;
			case ALL:
				hql = "from Order";
				query = page.createQuery(this.getCurrentSession(), hql, start, limit);
				break;
			default:
				hql = "from Order";
				query = page.createQuery(this.getCurrentSession(), hql, start, limit);
				break;
		}
		return query.getResultList();
	}
}
