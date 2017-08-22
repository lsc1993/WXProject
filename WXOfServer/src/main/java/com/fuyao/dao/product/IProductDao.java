package com.fuyao.dao.product;

import java.util.HashMap;
import java.util.List;

import com.fuyao.model.product.Product;
import com.fuyao.model.product.ProductBrowse;
import com.fuyao.model.product.ProductCollection;
import com.fuyao.model.product.ProductImages;
import com.fuyao.model.product.ProductSaleVolum;
import com.fuyao.model.product.ProductStandard;
import com.fuyao.model.product.ShopCart;

public interface IProductDao {
	List<Product> getProductList(HashMap<String,String> data);
	List<ProductImages> getProductImages(long pId);
	List<ProductStandard> getProductStandard(long pId);
	Product getProduct(String pId);
	ProductSaleVolum getProductSaleVolum(long pId);
	HashMap<String,String> collectProduct(ProductCollection collection);
	List<ProductCollection> getProductCollection(long uId);
	void browseHistory(ProductBrowse browse);
	List<ProductBrowse> getProductBrowse(long uId);
	
	HashMap<String,String> addShopCart(ShopCart shopCart);
	List<ShopCart> getShopCartList(long uId);
	HashMap<String,String> deleteShopItem(long id);
}
