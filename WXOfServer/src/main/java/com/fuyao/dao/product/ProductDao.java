package com.fuyao.dao.product;

import java.util.HashMap;
import java.util.List;

import javax.annotation.Resource;
import javax.persistence.NoResultException;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
import org.springframework.stereotype.Repository;

import com.fuyao.model.product.Product;
import com.fuyao.model.product.ProductImages;
import com.fuyao.model.product.ProductSaleVolum;
import com.fuyao.model.product.ProductStandard;
import com.fuyao.page.ProductPage;

@Repository("productDao")
public class ProductDao implements IProductDao {
	
	@Resource
	private SessionFactory sessionFactory;

	public void setSessionFactory(SessionFactory sessionFactory) {
		this.sessionFactory = sessionFactory;
	}
	
	private Session getCurrentSession() {
		return this.sessionFactory.getCurrentSession();
	}

	public List<Product> getProductList(HashMap<String, String> data) {
		// TODO Auto-generated method stub
		int start;
		try {
			start = Integer.parseInt(data.get("start"));
		} catch (NumberFormatException e) {
			start = 1;
			e.printStackTrace();
		}
		int limit;
		try {
			limit = Integer.parseInt(data.get("limit"));
		} catch (NumberFormatException e) {
			limit = 15;
			e.printStackTrace();
		}
		ProductPage page = new ProductPage();
		Query<Product> query = page.createQuery(this.getCurrentSession(), start, limit);
		return query.getResultList();
	}

	public List<ProductImages> getProductImages(long pId) {
		// TODO Auto-generated method stub
		String hql = "from ProductImages where pid=:pid";
		Query<ProductImages> query = this.getCurrentSession().createQuery(hql, ProductImages.class);
		query.setParameter("pid", pId);
		return query.getResultList();
	}

	public List<ProductStandard> getProductStandard(long pId) {
		// TODO Auto-generated method stub
		String hql = "from ProductStandard where pid=:pid";
		Query<ProductStandard> query = this.getCurrentSession().createQuery(hql, ProductStandard.class);
		query.setParameter("pid", pId);
		return query.getResultList();
	}

	public Product getProduct(HashMap<String, String> data) {
		// TODO Auto-generated method stub
		String pId = data.get("pId");
		String hql = "from Product where pid=:pid";
		Query<Product> query = this.getCurrentSession().createQuery(hql,Product.class);
		query.setParameter("pid", pId);
		Product p;
		try {
			p = query.getSingleResult();
		} catch (NoResultException e) {
			p = null;
		}
		return p;
	}

	public ProductSaleVolum getProductSaleVolum(long pId) {
		// TODO Auto-generated method stub
		String hql = "from ProductSaleVolum where pid=:pid";
		Query<ProductSaleVolum> query = this.getCurrentSession().createQuery(hql,ProductSaleVolum.class);
		query.setParameter("pid", pId);
		return query.getSingleResult();
	}

}
