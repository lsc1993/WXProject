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
import com.fuyao.model.order.OrderComment;
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

	public long getOrderCount(long uid) {
		// TODO Auto-generated method stub
		String hql = "select count(id) from Order where uid=:uid";
		Query<Long> query = this.getCurrentSession().createQuery(hql,Long.class);
		query.setParameter("uid", uid);
		return query.getSingleResult();
	}

	public List<Order> getOrderList(OrderStatus status, int start, int limit, long uid) {
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
				hql = "from Order where uid=:uid and status=:status";
				query = page.createQuery(this.getCurrentSession(), hql, start, limit);
				query.setParameter("uid", uid);
				query.setParameter("status", status.getStatus());
				break;
			case ALL:
				hql = "from Order where uid=:uid";
				query = page.createQuery(this.getCurrentSession(), hql, start, limit);
				query.setParameter("uid", uid);
				break;
			default:
				hql = "from Order where uid=:uid";
				query = page.createQuery(this.getCurrentSession(), hql, start, limit);
				query.setParameter("uid", uid);
				break;
		}
		return query.getResultList();
	}

	public HashMap<String, String> confirmReceive(long id, long uid, String status) {
		// TODO Auto-generated method stub
		HashMap<String, String> result = new HashMap<String, String>();
		String hql = "update Order set status=:status where id=:id and uid=:uid";
		Query<?> query = this.getCurrentSession().createQuery(hql);
		query.setParameter("status", status);
		query.setParameter("id", id);
		query.setParameter("uid", uid);
		int updateCount = query.executeUpdate();
		if (updateCount == 1) {
			result.put("result", "success");
		} else {
			result.put("result", "fault");
			result.put("message", "确认收货失败，请稍后重试");
		}
		return result;
	}

	public HashMap<String, String> submitComment(long uid, String comment) {
		// TODO Auto-generated method stub
		HashMap<String,String> result = new HashMap<String,String>();
		OrderComment orderComment = new OrderComment();
		orderComment.setUid(uid);
		orderComment.setComment(comment);
		try {
			this.getCurrentSession().save(orderComment);
			result.put("result", "success");
		} catch (HibernateException e) {
			e.printStackTrace();
			result.put("result", "falut");
			result.put("message", "提交意见失败");
		}
		return result;
	}
}
