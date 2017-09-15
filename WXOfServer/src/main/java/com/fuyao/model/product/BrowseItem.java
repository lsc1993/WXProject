package com.fuyao.model.product;

public class BrowseItem extends ProductBrowse {
	
	private String status;
	
	public BrowseItem() {
		
	}
	
	public BrowseItem(ProductBrowse browse) {
		this.setId(browse.getId());
		this.setUid(browse.getUid());
		this.setPid(browse.getPid());
		this.setPno(browse.getPno());
		this.setPname(browse.getPname());
		this.setPrice(browse.getPrice());
		this.setImgurl(browse.getImgurl());
		this.setBrowseTime(browse.getBrowseTime());
	}
 
	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}
}
