package com.fuyao.model.product;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="browse_history")
public class ProductBrowse {

	private long id;
	private long uid;
	private long pid;
	private Date browseTime;
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(name="id",nullable=false,length=11)
	public long getId() {
		return id;
	}
	public void setId(long id) {
		this.id = id;
	}
	
	@Column(name="uid",nullable=false,length=11)
	public long getUid() {
		return uid;
	}
	public void setUid(long uid) {
		this.uid = uid;
	}
	
	@Column(name="pid",nullable=false,length=11)
	public long getPid() {
		return pid;
	}
	public void setPid(long pid) {
		this.pid = pid;
	}
	
	@Column(name="browse_time",nullable=false)
	public Date getBrowseTime() {
		return browseTime;
	}
	public void setBrowseTime(Date browse_time) {
		this.browseTime = browse_time;
	}
}
