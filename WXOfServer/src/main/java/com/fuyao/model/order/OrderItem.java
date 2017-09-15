package com.fuyao.model.order;

public class OrderItem extends Order {
	
	private String pstatus;
	
	public OrderItem() {
		
	}
	
	public OrderItem(Order order) {
		this.setId(order.getId());
		this.setOrderId(order.getOrderId());
		this.setPid(order.getPid());
		this.setSid(order.getSid());
		this.setAid(order.getAid());
		this.setName(order.getName());
		this.setImgurl(order.getImgurl());
		this.setPCount(order.getPCount());
		this.setPTotal(order.getPTotal());
		this.setSendCost(order.getSendCost());
		this.setStandard(order.getStandard());
		this.setBuyerMsg(order.getBuyerMsg());
		this.setSendWay(order.getSendWay());
		this.setDiscount(order.getDiscount());
		this.setReceiver(order.getReceiver());
		this.setPhone(order.getPhone());
		this.setAddress(order.getAddress());
		this.setPostcode(order.getPostcode());
		this.setDate(order.getDate());
	}

	public String getPstatus() {
		return pstatus;
	}

	public void setPstatus(String pstatus) {
		this.pstatus = pstatus;
	}	
}
