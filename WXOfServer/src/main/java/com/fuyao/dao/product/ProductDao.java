package com.fuyao.dao.product;

import java.util.Date;
import java.util.HashMap;
import java.util.List;

import javax.annotation.Resource;
import javax.persistence.NoResultException;

import org.hibernate.HibernateException;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
import org.springframework.stereotype.Repository;

import com.fuyao.model.product.Product;
import com.fuyao.model.product.ProductBrowse;
import com.fuyao.model.product.ProductCollection;
import com.fuyao.model.product.ProductImages;
import com.fuyao.model.product.ProductSaleVolum;
import com.fuyao.model.product.ProductStandard;
import com.fuyao.model.product.ShopCart;
import com.fuyao.page.CommonPage;
import com.fuyao.util.Log;

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

	/*
	 * 获取产品列表
	 * @see com.fuyao.dao.product.IProductDao#getProductList(java.util.HashMap)
	 * @param data 产品查询参数
	 */
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
		String hql = "select p from Product p";
		CommonPage page = new CommonPage();
		Query<Product> query = page.createQuery(this.getCurrentSession(), hql, start, limit);
		return query.getResultList();
	}

	/*
	 * 获取产品图片
	 * @see com.fuyao.dao.product.IProductDao#getProductImages(long)
	 * @param pId 产品id
	 */
	public List<ProductImages> getProductImages(long pId) {
		// TODO Auto-generated method stub
		String hql = "from ProductImages where pid=:pid";
		Query<ProductImages> query = this.getCurrentSession().createQuery(hql, ProductImages.class);
		query.setParameter("pid", pId);
		return query.getResultList();
	}

	/*
	 * 获取产品规格
	 * @see com.fuyao.dao.product.IProductDao#getProductStandard(long)
	 * @param pId 产品id
	 */
	public List<ProductStandard> getProductStandard(long pId) {
		// TODO Auto-generated method stub
		String hql = "from ProductStandard where pid=:pid";
		Query<ProductStandard> query = this.getCurrentSession().createQuery(hql, ProductStandard.class);
		query.setParameter("pid", pId);
		return query.getResultList();
	}

	/*
	 * 获取产品详情
	 * @see com.fuyao.dao.product.IProductDao#getProduct(java.util.HashMap)
	 * @param data 产品查询参数
	 */
	public Product getProduct(String pId) {
		// TODO Auto-generated method stub
		String hql = "from Product where pid=:pid";
		Query<Product> query = this.getCurrentSession().createQuery(hql,Product.class);
		query.setParameter("pid", pId);
		Product p;
		try {
			p = query.getSingleResult();
		} catch (NoResultException e) {
			p = null;
			e.printStackTrace();  
		}
		return p;
	}

	/*
	 * 获取产品销量
	 * @see com.fuyao.dao.product.IProductDao#getProductSaleVolum(long)
	 * @param pId 产品id
	 */
	public ProductSaleVolum getProductSaleVolum(long pId) {
		// TODO Auto-generated method stub
		String hql = "from ProductSaleVolum where pid=:pid";
		Query<ProductSaleVolum> query = this.getCurrentSession().createQuery(hql,ProductSaleVolum.class);
		query.setParameter("pid", pId);
		return query.getSingleResult();
	}

	/*
	 * 收藏产品
	 * @see com.fuyao.dao.product.IProductDao#collectProduct(com.fuyao.model.product.ProductCollection)
	 * @param collection 收藏产品详情
	 */
	public HashMap<String,String> collectProduct(ProductCollection collection) {
		// TODO Auto-generated method stub
		HashMap<String,String> result = new HashMap<String,String>();
		Session session = this.getCurrentSession();
		String hql = "form ProductCollection where uid=:uid and pid=:pid";
		Query<ProductCollection> query = session.createQuery(hql, ProductCollection.class);
		if (query.getResultList().size() >= 1) {
			result.put("result", "fault");
			result.put("message", "已收藏改商品");
			return result;
		} else {
			this.getCurrentSession().save(collection);
			result.put("result", "success");
			result.put("message", "收藏成功");
			return result;
		}
		
	}

	/*
	 * 记录用户产品浏览记录
	 * @see com.fuyao.dao.product.IProductDao#browseHistory(com.fuyao.model.product.ProductBrowse)
	 * @param browse 浏览产品详情
	 */
	public void browseHistory(ProductBrowse browse) {
		// TODO Auto-generated method stub
		Session session = this.getCurrentSession();
		String hql = "from ProductBrowse where uid=:uid and pid=:pid";
		Log.log(browse.getUid() + " " + browse.getPid());
		Query<ProductBrowse> query = session.createQuery(hql, ProductBrowse.class);
		query.setParameter("uid", browse.getUid());
		query.setParameter("pid", browse.getPid());
		if (query.getResultList().size() >= 1) {
			query.getResultList().get(0).setBrowseTime(new Date());
		} else {
			List<ProductBrowse> pList = this.getProductBrowse(browse.getUid());
			int count = pList.size();
			if (count >= 10) { //最多保留10调浏览记录
				pList.get(0).setPid(browse.getPid());
				pList.get(0).setBrowseTime(new Date());
			} else {
				this.getCurrentSession().save(browse);
			}
		}
	}

	/*
	 * 获取用户产品收藏列表
	 * @see com.fuyao.dao.product.IProductDao#getProductCollection(long)
	 * @param uId 用户id
	 */
	public List<ProductCollection> getProductCollection(long uId) {
		// TODO Auto-generated method stub
		Session session = this.getCurrentSession();
		String hql = "form ProductCollection where uid=:uid order by collect_time ASC";
		Query<ProductCollection> query = session.createQuery(hql,ProductCollection.class);
		query.setParameter("uid", uId);
		return query.getResultList();
	}

	/*
	 * 获取用户产品浏览记录
	 * @see com.fuyao.dao.product.IProductDao#getProductCollection(long)
	 * @param uId 用户id
	 */
	public List<ProductBrowse> getProductBrowse(long uId) {
		// TODO Auto-generated method stub
		Session session = this.getCurrentSession();
		String hql = "from ProductBrowse where uid=:uid order by browse_time ASC";
		Query<ProductBrowse> query = session.createQuery(hql,ProductBrowse.class);
		query.setParameter("uid", uId);
		return query.getResultList();
	}

	public HashMap<String, String> addShopCart(ShopCart shopCart) {
		// TODO Auto-generated method stub
		HashMap<String, String> result = new HashMap<String, String>();
		String hql = "from ShopCart where uid=:uid and pid=:pid";
		Session session = this.getCurrentSession();
		Query<ShopCart> query = session.createQuery(hql,ShopCart.class);
		query.setParameter("uid", shopCart.getUid());
		query.setParameter("pid", shopCart.getPid());
		if (query.getResultList().size() >= 1) {
			int count = query.getResultList().get(0).getCount();
			count++;
			query.getResultList().get(0).setCount(count);
		} else {
			session.save(shopCart);
		}
		result.put("result", "success");
		result.put("message", "已添加到购物车");
		return result;
	}

	public List<ShopCart> getShopCartList(long uId) {
		// TODO Auto-generated method stub
		String hql = "from ShopCart where uid=:uid";
		Session session = this.getCurrentSession();
		Query<ShopCart> query = session.createQuery(hql,ShopCart.class);
		query.setParameter("uid", uId);
		return query.getResultList();
	}

	public HashMap<String, String> deleteShopItem(long id) {
		// TODO Auto-generated method stub
		HashMap<String, String> result = new HashMap<String, String>();
		try {
			Session session = this.getCurrentSession();
			ShopCart shopcart = session.get(ShopCart.class, id);
			if (null != shopcart) {
				session.delete(shopcart);
			}
			result.put("result", "success");
			result.put("message", "已删除");
		} catch (HibernateException e) {
			result.put("result", "fault");
			result.put("message", "删除失败，请稍后重试");
		}
		return result;
	}
}
