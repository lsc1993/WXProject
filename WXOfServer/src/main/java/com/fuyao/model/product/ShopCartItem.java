package com.fuyao.model.product;

public class ShopCartItem extends ShopCart {
	private String status;
	
	public ShopCartItem() {
		
	}
	
	public ShopCartItem(ShopCart shopCart) {
		this.setId(shopCart.getId());
		this.setUid(shopCart.getUid());
		this.setPid(shopCart.getPid());
		this.setSid(shopCart.getSid());
		this.setPno(shopCart.getPno());
		this.setName(shopCart.getName());
		this.setImgurl(shopCart.getImgurl());
		this.setCount(shopCart.getCount());
		this.setPrice(shopCart.getPrice());
		this.setStandard(shopCart.getStandard());
		this.setDate(shopCart.getDate());
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}
}
