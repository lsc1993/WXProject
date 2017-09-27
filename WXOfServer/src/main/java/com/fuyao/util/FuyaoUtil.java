package com.fuyao.util;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Random;
import java.util.UUID;

public class FuyaoUtil {
	
	public static String getCurrentTimeAtString(final String format) {
		Date currentTime = new Date();
		SimpleDateFormat formatter = new SimpleDateFormat(format);
		String dateString = formatter.format(currentTime);
		return dateString;
	}
	
	public static String generateUserToken() {
		String s = UUID.randomUUID().toString().toUpperCase().replace("-", "");
		return s;
	}

	public static String generateOrderId() {
		Random random = new Random();
		int randomNum = random.nextInt(100000);
		return new StringBuilder().append("E").
				append(FuyaoUtil.getCurrentTimeAtString("yyyyMMddHHmmss")).
				append(randomNum).toString();
	}
}
