package com.fuyao.service.product;

import java.util.Date;
import java.util.HashMap;
import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSON;
import com.fuyao.dao.product.IProductDao;
import com.fuyao.model.product.Product;
import com.fuyao.model.product.ProductBrowse;
import com.fuyao.model.product.ProductCollection;
import com.fuyao.model.product.ProductImages;
import com.fuyao.model.product.ProductSaleVolum;
import com.fuyao.model.product.ProductStandard;
import com.fuyao.util.Log;

@Transactional
@Service("productService")
public class ProductService {
	
	@Resource
	private IProductDao productDao;

	public void setProductDao(IProductDao productDao) {
		this.productDao = productDao;
	}
	
	public JSON getProductDetail(HashMap<String,String> data) {
		long pId = Long.parseLong(data.get("pId"));
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
		for (Product p : pList) {
			long pId = p.getId();
			List<ProductImages> images = productDao.getProductImages(pId);
			builder.append("{").append("\"product\":").append(JSON.toJSONString(p)).append(",");
			for (ProductImages image : images) {
				if (image.getImage().startsWith("sImg")) {
					builder.append("\"image\":").append(JSON.toJSONString(image)).append("}").append(",");
				}
			}
		}
		builder.append("]").append(",").append("\"size\":").append(pList.size()).append("}");
		Log.log(builder.toString());
		Log.log("----------------------------------------");
		return (JSON) JSON.parse(builder.toString());
	}
	
	public HashMap<String,String> collectProduct(HashMap<String,String> data) {
		HashMap<String,String> result = new HashMap<String,String>();
		long uid,pid;
		try {
			uid = Long.parseLong(data.get("uId"));
		} catch (NumberFormatException e) {
			uid = 0;
			result.put("result", "fault");
			result.put("message", "该用户不存在，请先登录！");
			e.printStackTrace();
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
		long uid,pid;
		try {
			uid = Long.parseLong(data.get("uId"));
		} catch (NumberFormatException e) {
			uid = 0;
			result.put("result", "fault");
			result.put("message", "该用户不存在，请先登录！");
			e.printStackTrace();
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
		ProductBrowse brwose = new ProductBrowse();
		brwose.setUid(uid);
		brwose.setPid(pid);
		brwose.setBrowseTime(new Date());
		productDao.browseHistory(brwose);
		return result;
	}
	
	
}
