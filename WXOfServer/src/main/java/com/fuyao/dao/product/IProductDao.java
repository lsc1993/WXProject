package com.fuyao.dao.product;

import java.util.HashMap;
import java.util.List;

import com.fuyao.model.product.Product;
import com.fuyao.model.product.ProductImages;
import com.fuyao.model.product.ProductSaleVolum;
import com.fuyao.model.product.ProductStandard;

public interface IProductDao {
	List<Product> getProductList(HashMap<String,String> data);
	List<ProductImages> getProductImages(long pId);
	List<ProductStandard> getProductStandard(long pId);
	Product getProduct(HashMap<String,String> data);
	ProductSaleVolum getProductSaleVolum(long pId);
}
