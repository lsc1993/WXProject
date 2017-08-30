package com.fuyao.controller.product;

import java.util.HashMap;

import javax.annotation.Resource;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSON;
import com.fuyao.service.product.ProductService;
import com.fuyao.util.Log;

@Controller
@RequestMapping("/product")
public class ProductController {

	@Resource
	private ProductService productService;

	public void setProductService(ProductService productService) {
		this.productService = productService;
	}
	
	@ResponseBody
	@RequestMapping(value="/list",method=RequestMethod.POST)
	private JSON getProductList(@RequestBody HashMap<String,String> data) {
		Log.log("list:" + data.toString());
		JSON json = productService.getIndexProductList(data);
		return json;
	}
	
	@ResponseBody
	@RequestMapping(value="/detail",method=RequestMethod.POST)
	private JSON getProductDetail(@RequestBody HashMap<String,String> data) {
		Log.log("detail:" + data.toString());
		JSON json = productService.getProductDetail(data);
		return json;
	}
	
	@ResponseBody
	@RequestMapping(value="/collect",method=RequestMethod.POST)
	private HashMap<String,String> collectProduct(@RequestBody HashMap<String,String> data) {
		Log.log(data.toString());
		return productService.collectProduct(data);
	}
	
	@ResponseBody
	@RequestMapping(value="/browse",method=RequestMethod.POST)
	private HashMap<String,String> browseHistory(@RequestBody HashMap<String,String> data) {
		Log.log(data.toString());
		return productService.browseHistory(data);
	}
	
	@ResponseBody
	@RequestMapping(value="/browse-history",method=RequestMethod.POST)
	private JSON getBrowseHistory(@RequestBody HashMap<String,String> data) {
		Log.log(data.toString());
		return productService.getBrowseHistory(data);
	}
	
	@ResponseBody
	@RequestMapping(value="/shopcart",method=RequestMethod.POST)
	private HashMap<String,String> addShopCart(@RequestBody HashMap<String,String> data) {
		Log.log(data.toString());
		return productService.addShopCart(data);
	}
	
	@ResponseBody
	@RequestMapping(value="/shopitem",method=RequestMethod.POST)
	private JSON getShopItems(@RequestBody HashMap<String,String> data) {
		Log.log(data.toString());
		return productService.getShopItems(data);
	}
	
	@ResponseBody
	@RequestMapping(value="/del-shop",method=RequestMethod.POST)
	private HashMap<String,String> deleteShopItem(@RequestBody HashMap<String,String> data) {
		Log.log(data.toString());
		return productService.deleteShopItem(data);
	}
}
