package com.fuyao.weixin.dao;

import javax.annotation.Resource;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
import org.springframework.stereotype.Repository;

import com.fuyao.weixin.model.WXAuthority;
import com.fuyao.weixin.model.WXUserInfo;

@Repository("wxAuthDao")
public class WXAuthDao {
	
	@Resource
	private SessionFactory sessionFactory;	
	
	public void setSessionFactory(SessionFactory sessionFactory) {
		this.sessionFactory = sessionFactory;
	}
	
	private Session getCurrentSession() {
		return this.sessionFactory.getCurrentSession();
	}

	public WXAuthority getWXUserAuth(String openid) {
		String hql = "from WXAuthority where openid=:openid";
		Query<WXAuthority> query = this.getCurrentSession().createQuery(hql,WXAuthority.class);
		query.setParameter("openid", openid);
		if (query.getResultList().size() == 1) {
			return query.getResultList().get(0);
		} else {
			return null;
		}
	}
	
	public WXUserInfo getWXUserInfo(long uid) {
		String hql = "from WXUserInfo where uid=:uid";
		Query<WXUserInfo> query = this.getCurrentSession().createQuery(hql,WXUserInfo.class);
		query.setParameter("uid", uid);
		if (query.getResultList().size() == 1) {
			return query.getResultList().get(0);
		} else {
			return null;
		}
	}

	public void addWXAuthMessage(WXAuthority wAuth) {
		this.getCurrentSession().saveOrUpdate(wAuth);
	}
	
	public void addWXUserInfo(WXUserInfo wUser) {
		this.getCurrentSession().saveOrUpdate(wUser);
	}
	
	public String getOpenId(String userToken) {
		Session session = sessionFactory.openSession();
		long uId = getUserId(userToken);
		String hql = "select openid from WXAuthority where uid=:uid";
		Query<String> query = session.createQuery(hql, String.class);
		query.setParameter("uid", uId);
		if (query.getResultList().size() == 1) {
			return query.getResultList().get(0);
		} else {
			return null;
		}
	}
	
	public long getUserId(String token) {
		// TODO Auto-generated method stub
		Session session = sessionFactory.openSession();
		String hql = "select id from User where userToken=:userToken";
		Query<Long> query = session.createQuery(hql,Long.class);
		query.setParameter("userToken", token);
		if (query.getResultList().size() == 1) {
			return query.getResultList().get(0);
		} else {
			return -1;
		}
	}
}
