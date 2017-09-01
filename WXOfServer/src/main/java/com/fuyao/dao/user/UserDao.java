package com.fuyao.dao.user;

import java.util.HashMap;
import java.util.List;

import javax.annotation.Resource;

import org.hibernate.HibernateException;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
import org.springframework.stereotype.Repository;

import com.fuyao.model.user.User;
import com.fuyao.model.user.UserAddress;

@Repository("userDao")
public class UserDao implements IUserDao {
	
	@Resource
	private SessionFactory sessionFactory;

	public void setSessionFactory(SessionFactory sessionFactory) {
		this.sessionFactory = sessionFactory;
	}
	
	private Session getCurrentSession() {
		return this.sessionFactory.getCurrentSession();
	}

	public List<UserAddress> getAddressList(long uId) {
		// TODO Auto-generated method stub
		String hql = "from UserAddress where uid=:uid";
		Query<UserAddress> query = this.getCurrentSession().createQuery(hql,UserAddress.class);
		query.setParameter("uid", uId);
		return query.getResultList();
	}

	public HashMap<String, String> updateAddress(UserAddress address) {
		// TODO Auto-generated method stub
		HashMap<String,String> result = new HashMap<String,String>();
		try {
			this.getCurrentSession().update(address);
			result.put("result", "success");
			result.put("message", "修改成功");
		} catch (HibernateException e) {
			e.printStackTrace();
			result.put("result", "falut");
			result.put("message", "修改失败，请稍后重试");
		}
		return result;
	}

	public HashMap<String, String> deleteAddress(UserAddress address) {
		// TODO Auto-generated method stub
		HashMap<String,String> result = new HashMap<String,String>();
		try {
			this.getCurrentSession().delete(address);
			result.put("result", "success");
			result.put("message", "删除成功");
		} catch (HibernateException e) {
			e.printStackTrace();
			result.put("result", "falut");
			result.put("message", "删除失败，请稍后重试");
		}
		return result;
	}

	public HashMap<String, String> addAddress(UserAddress address) {
		// TODO Auto-generated method stub
		long count = this.getAddressCount(address.getUId());
		HashMap<String,String> result = new HashMap<String,String>();
		if (count > 10) {
			result.put("result", "too many address");
			result.put("message", "每个用户最多只能有10个收货地址");
		} else {
			try {
				this.getCurrentSession().save(address);
				result.put("result", "success");
				result.put("message", "添加地址成功");
			} catch (HibernateException e) {
				e.printStackTrace();
				result.put("result", "falut");
				result.put("message", "添加地址失败，请稍后重试");
			}
		}
		return result;
	}
	
	private long getAddressCount(long uId) {
		String hql = "select count(*) from UserAddress where uid=:uid";
		Query<Long> query = this.getCurrentSession().createQuery(hql,Long.class);
		query.setParameter("uid", uId);
		return query.getSingleResult();
	}

	public String getUserToken(long uId) {
		// TODO Auto-generated method stub
		String hql = "select userToken from User where id=:id";
		Query<String> query = this.getCurrentSession().createQuery(hql,String.class);
		query.setParameter("id", uId);
		if (query.getResultList().size() == 1) {
			return query.getResultList().get(0);
		} else {
			return null;
		}
	}
	
	public long getUserId(String token) {
		// TODO Auto-generated method stub
		String hql = "select id from User where userToken=:userToken";
		Query<Long> query = this.getCurrentSession().createQuery(hql,Long.class);
		query.setParameter("userToken", token);
		if (query.getResultList().size() == 1) {
			return query.getResultList().get(0);
		} else {
			return -1;
		}
	}

	public void addUser(User user) {
		// TODO Auto-generated method stub
		this.getCurrentSession().save(user);
	}

	public User getUser(String userToken) {
		// TODO Auto-generated method stub
		String hql = "from User where user_token=:user_token";
		Query<User> query = this.getCurrentSession().createQuery(hql,User.class);
		query.setParameter("user_token", userToken);
		if (query.getResultList().size() == 1) {
			return query.getResultList().get(0);
		}
		return null;
	}
}
