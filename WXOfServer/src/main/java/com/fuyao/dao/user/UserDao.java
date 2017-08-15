package com.fuyao.dao.user;

import java.util.HashMap;
import java.util.List;

import javax.annotation.Resource;

import org.hibernate.HibernateException;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
import org.springframework.stereotype.Repository;

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
		} catch (HibernateException e) {
			e.printStackTrace();
			result.put("result", "falut");
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
			result.put("message", "删除失败");
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
			this.getCurrentSession().save(address);
			result.put("result", "success");
			result.put("message", "地址添加成功");
		}
		return result;
	}
	
	private long getAddressCount(long uId) {
		String hql = "select count(*) from UserAddress where uid=:uid";
		Query<Long> query = this.getCurrentSession().createQuery(hql,Long.class);
		query.setParameter("uid", uId);
		return query.getSingleResult();
	}

}
