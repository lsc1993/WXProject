package com.fuyao.util;

public class Log {
	private static boolean on_off = false;
	
	public static void log(String message) {
		if (on_off) {
			System.out.println(message);
		}
	}
}
