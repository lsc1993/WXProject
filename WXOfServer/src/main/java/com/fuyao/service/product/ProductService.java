package com.fuyao.service.product;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSON;
import com.fuyao.dao.product.IProductDao;
import com.fuyao.dao.user.IUserDao;
import com.fuyao.model.product.BrowseItem;
import com.fuyao.model.product.Product;
import com.fuyao.model.product.ProductBrowse;
import com.fuyao.model.product.ProductCollection;
import com.fuyao.model.product.ProductImages;
import com.fuyao.model.product.ProductSaleVolum;
import com.fuyao.model.product.ProductStandard;
import com.fuyao.model.product.ShopCart;
import com.fuyao.model.product.ShopCartItem;
import com.fuyao.util.Log;

@Transactional
@Service("productService")
public class ProductService {
	
	@Resource
	private IProductDao productDao;

	public void setProductDao(IProductDao productDao) {
		this.productDao = productDao;
	}
	
	@Resource
	private IUserDao userDao;
	
	public void setUserDao(IUserDao userDao) {
		this.userDao = userDao;
	}
	
	public JSON getProductDetail(HashMap<String,String> data) {
		String pId = data.get("pId");
		Product p = productDao.getProduct(pId);
		if (null == p) {
			return (JSON) JSON.parse("{\"result\":\"fault\",\"message\":,\"没有该产品\"}");
		}	

		List<ProductImages> images = productDao.getProductImages(p.getId()); 
		List<ProductStandard> standard = productDao.getProductStandard(p.getId());
		ProductSaleVolum saleVolum = productDao.getProductSaleVolum(p.getId());
		StringBuilder builder = new StringBuilder();
		builder.append("{").append("\"product\":").append(JSON.toJSONString(p))
			.append(",").append("\"images\":").append(JSON.toJSONString(images))
			.append(",").append("\"standard\":").append(JSON.toJSONString(standard))
			.append(",").append("\"saleVolum\":").append(JSON.toJSONString(saleVolum))
			.append("}");
		Log.log("json:" + builder.toString());
		return (JSON) JSON.parse(builder.toString());
	}
	
	public JSON getIndexProductList(HashMap<String,String> data) {
		List<Product> pList = productDao.getProductList(data);
		StringBuilder builder = new StringBuilder();
		builder.append("{").append("\"rows\":").append("[");
		int len = 0;
		for (Product p : pList) {
			long pId = p.getId();
			List<ProductImages> images = productDao.getProductImages(pId);
			builder.append("{").append("\"product\":").append(JSON.toJSONString(p)).append(",");
			for (ProductImages image : images) {
				if (image.getImage().startsWith("sImg")) {
					builder.append("\"image\":").append(JSON.toJSONString(image)).append("}");
				}
				if (len != (images.size() - 1)) {
					builder.append(",");
				}
				len ++;
			}
		}
		builder.append("]").append(",").append("\"size\":").append(pList.size()).append("}");
		Log.log(builder.toString());
		Log.log("----------------------------------------");
		return (JSON) JSON.parse(builder.toString());
	}
	
	public HashMap<String,String> collectProduct(HashMap<String,String> data) {
		HashMap<String,String> result = new HashMap<String,String>();
		long pid;
		long uid = -1;
		String token = data.get("userToken");
		uid = userDao.getUserId(token);
		if (uid == -1) {
			result.put("result", "fault");
			result.put("message", "用户认证失败，请重新登录");
			return result;
		}
		
		try {
			pid = Long.parseLong(data.get("pId"));
		} catch (NumberFormatException e) {
			pid = 0;
			result.put("result", "fault");
			result.put("message", "产品记录表错误");
			e.printStackTrace();
			return result;
		}
		ProductCollection collection = new ProductCollection();
		collection.setUid(uid);
		collection.setPid(pid);
		collection.setCollectTime(new Date());
		result = productDao.collectProduct(collection);
		return result;
	}
	
	public HashMap<String,String> browseHistory(HashMap<String,String> data) {
		HashMap<String,String> result = new HashMap<String,String>();
		long pid;
		long uid = -1;
		String token = data.get("userToken");
		uid = userDao.getUserId(token);
		if (uid == -1) {
			result.put("result", "fault");
			result.put("message", "用户认证失败，请重新登录");
			return result;
		}
		
		try {
			pid = Long.parseLong(data.get("pId"));
		} catch (NumberFormatException e) {
			pid = 0;
			result.put("result", "fault");
			result.put("message", "产品记录表错误");
			e.printStackTrace();
			return result;
		}
		ProductBrowse browse = new ProductBrowse();
		browse.setUid(uid);
		browse.setPid(pid);
		browse.setPno(data.get("pno"));
		browse.setPname(data.get("pname"));
		browse.setPrice(Float.parseFloat(data.get("price")));
		browse.setImgurl(data.get("imgurl"));
		browse.setBrowseTime(new Date());
		productDao.browseHistory(browse);
		return result;
	}
	
	public JSON getBrowseHistory(HashMap<String,String> data) {
		long uid = -1;
		String token = data.get("userToken");
		uid = userDao.getUserId(token);
		if (uid == -1) {
			return (JSON) JSON.parse("{\"result\":\"fault\",\"message\":,\"无此用户记录\"}");
		}
		
		List<ProductBrowse> browses = productDao.getProductBrowse(uid);
		List<BrowseItem> items = new ArrayList<BrowseItem>(browses.size());
		for (ProductBrowse browse : browses) {
			String status = productDao.getProductStatus(browse.getPno());
			BrowseItem item = new BrowseItem(browse);
			item.setStatus(status);
			items.add(item);
		}
		StringBuilder builder = new StringBuilder();
		builder.append("{").append("\"rows\":").append(JSON.toJSONString(items))
			   .append(",").append("\"size\":").append(items.size()).append("}");
		Log.log(builder.toString());
		return (JSON) JSON.parse(builder.toString());
	}
	
	public HashMap<String,String> addShopCart(HashMap<String,String> data) {
		long uid = -1;
		HashMap<String,String> result = new HashMap<String,String>();
		String token = data.get("userToken");
		uid = userDao.getUserId(token);
		if (uid == -1) {
			result.put("result", "fault");
			result.put("message", "用户认证失败，请重新登录");
			return result;
		}
		ShopCart shopCart = new ShopCart();
		shopCart.setUid(uid);
		shopCart.setPid(Long.parseLong(data.get("pId")));
		shopCart.setPno(data.get("pNo"));
		shopCart.setSid(Long.parseLong(data.get("sId")));
		shopCart.setName(data.get("pName"));
		shopCart.setImgurl(data.get("imgurl"));
		shopCart.setStandard(data.get("standard"));
		shopCart.setCount(Integer.parseInt(data.get("count")));
		shopCart.setPrice(Float.parseFloat(data.get("price")));
		shopCart.setDate(new Date());
		return productDao.addShopCart(shopCart);
	}
	
	public JSON getShopItems(HashMap<String,String> data) {
		long uid = -1;
		String token = data.get("userToken");
		uid = userDao.getUserId(token);
		if (uid == -1) {
			return (JSON) JSON.parse("{\"result\":\"fault\",\"message\":,\"无此用户\"}");
		}
		
		List<ShopCart> shopItems = productDao.getShopCartList(uid);
		List<ShopCartItem> items = new ArrayList<ShopCartItem>(shopItems.size());
		for (ShopCart item : shopItems) {
			String status = productDao.getProductStatus(item.getPno());
			ShopCartItem s = new ShopCartItem(item);	
			s.setStatus(status);
			items.add(s);
		}
		StringBuilder builder = new StringBuilder();
		builder.append("{").append("\"rows\":").append(JSON.toJSONString(items)).
				append(",").append("\"size\":").append(shopItems.size()).append("}");
		Log.log(builder.toString());
		return (JSON) JSON.parse(builder.toString());
	}
	
	public HashMap<String,String> deleteShopItem(HashMap<String,String> data) {
		long id = Long.parseLong(data.get("id"));
		return productDao.deleteShopItem(id);
	}
}
