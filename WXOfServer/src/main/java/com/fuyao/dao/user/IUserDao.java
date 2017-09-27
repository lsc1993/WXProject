package com.fuyao.dao.user;

import java.util.HashMap;
import java.util.List;

import com.fuyao.model.user.User;
import com.fuyao.model.user.UserAddress;

public interface IUserDao {
	List<UserAddress> getAddressList(long uId);
	HashMap<String,String> updateAddress(UserAddress address);
	HashMap<String,String> deleteAddress(UserAddress address);
	HashMap<String,String> addAddress(UserAddress address);
	String getUserToken(long uId);
	String getOpenId(long uId);
	long getUserId(String token);
	void addUser(User user);
	User getUser(String userToken);
}
