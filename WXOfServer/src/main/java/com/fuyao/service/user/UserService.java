package com.fuyao.service.user;

import java.util.HashMap;
import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSON;
import com.fuyao.dao.user.IUserDao;
import com.fuyao.model.user.UserAddress;
import com.fuyao.util.Log;

@Transactional
@Service("userService")
public class UserService {
	
	@Resource
	private IUserDao userDao;

	public void setUserDao(IUserDao userDao) {
		this.userDao = userDao;
	}
	
	public JSON getAddressList(HashMap<String,String> data) {
		String userToken = data.get("userToken");
		
		StringBuilder builder = new StringBuilder();
		builder.append("{");
		if (userToken != null) {
			long uId = userDao.getUserId(userToken);
			List<UserAddress> address = userDao.getAddressList(uId);
			builder.append("\"address\":").append(JSON.toJSONString(address)).append(",");
			builder.append("\"result\":").append("\"success\"");
		} else {
			builder.append("\"result\":").append("\"fault\"");
		}
		builder.append("}");
		Log.log(builder.toString());
		return (JSON) JSON.parse(builder.toString());
	}
	
	public HashMap<String,String> addAddress(HashMap<String,String> data) {
		return userDao.addAddress(this.setAddressProperty(data));
	}
	
	public HashMap<String,String> updateAddress(HashMap<String,String> data) {
		return userDao.updateAddress(this.setAddressProperty(data));
	}
	
	public HashMap<String,String> deleteAddress(HashMap<String,String> data) {
		return userDao.deleteAddress(this.setAddressProperty(data));
	}
	
	private UserAddress setAddressProperty(HashMap<String,String> data) {
		UserAddress address = new UserAddress();
		if (null != data.get("id") && !"".equals(data.get("id"))) {
			address.setId(Long.parseLong(data.get("id")));
		}
		long uId = userDao.getUserId(data.get("userToken"));
		address.setUId(uId);
		address.setReceiver(data.get("receiver"));
		address.setPhone(data.get("phone"));
		address.setProvince(data.get("province"));
		address.setCity(data.get("city"));
		address.setRegion(data.get("region"));
		address.setDetailAddress(data.get("detailAddress"));
		address.setPostcode(data.get("postcode"));
		return address;
	}
}
