package com.fuyao.util;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.UUID;

public class FuyaoUtil {
	
	public static String getCurrentTimeAtString(final String format) {
		Date currentTime = new Date();
		SimpleDateFormat formatter = new SimpleDateFormat(format);
		String dateString = formatter.format(currentTime);
		return dateString;
	}
	
	public static String generateUserToken() {
		String s = UUID.randomUUID().toString().toLowerCase();
		return s;
	}
}
