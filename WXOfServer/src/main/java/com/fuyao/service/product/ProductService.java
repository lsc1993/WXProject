package com.fuyao.service.product;

import java.util.HashMap;
import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSON;
import com.fuyao.dao.product.IProductDao;
import com.fuyao.model.product.Product;
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
		Product p = productDao.getProduct(data);
		if (null == p)
			return (JSON) JSON.parse("{\"result\":\"fault\",\"message\":,\"没有该产品\"}");
		//long pId = Long.parseLong(data.get("pId"));
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
}
