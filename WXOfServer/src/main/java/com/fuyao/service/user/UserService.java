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
		long uId = 0;
		try {
			uId = Long.parseLong(data.get("uId"));
		} catch (NumberFormatException e) {
			e.printStackTrace();
			uId = -1;
		}
		StringBuilder builder = new StringBuilder();
		builder.append("{");
		if (uId != -1) {
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
	
	public HashMap<String,String> addAddress(UserAddress address) {
		return userDao.addAddress(address);
	}
	
	public HashMap<String,String> updateAddress(UserAddress address) {
		return userDao.updateAddress(address);
	}
	
	public HashMap<String,String> deleteAddress(UserAddress address) {
		return userDao.deleteAddress(address);
	}
}
