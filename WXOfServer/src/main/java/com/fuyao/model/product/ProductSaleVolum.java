package com.fuyao.model.product;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="product_sale_volum")
public class ProductSaleVolum {
	private long id;
	private long pId;
	private int saleVolum;
	private Date saleDate;
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(name="id",nullable=false,length=11)
	public long getId() {
		return id;
	}
	public void setId(long id) {
		this.id = id;
	}
	
	@Column(name="pid",nullable=false,length=11)
	public long getPId() {
		return pId;
	}
	public void setPId(long pId) {
		this.pId = pId;
	}
	
	@Column(name="sale_volum",nullable=false)
	public int getSaleVolum() {
		return saleVolum;
	}
	public void setSaleVolum(int saleVolum) {
		this.saleVolum = saleVolum;
	}
	
	@Column(name="sale_time",nullable=false)
	public Date getSaleDate() {
		return saleDate;
	}
	public void setSaleDate(Date saleDate) {
		this.saleDate = saleDate;
	}
	
}
