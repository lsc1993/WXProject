package com.fuyao.dao.login;

import java.util.HashMap;

import com.fuyao.model.login.UserLogin;

public interface IUserLoginDao {
	HashMap<String,String> login(UserLogin user);
}
