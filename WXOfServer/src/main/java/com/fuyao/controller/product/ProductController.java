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
}
