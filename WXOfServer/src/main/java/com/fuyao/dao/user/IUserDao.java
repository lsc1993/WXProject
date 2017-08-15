package com.fuyao.dao.user;

import java.util.HashMap;
import java.util.List;

import com.fuyao.model.user.UserAddress;

public interface IUserDao {
	List<UserAddress> getAddressList(long uId);
	HashMap<String,String> updateAddress(UserAddress address);
	HashMap<String,String> deleteAddress(UserAddress address);
	HashMap<String,String> addAddress(UserAddress address);
}
