package com.example.WebDemo.Model;

import java.security.MessageDigest;
import java.util.HashMap;

public class PassEncTech1 {
	public static HashMap<String,Integer> unique=new HashMap<String,Integer>();
	public static HashMap<String,String> otps=new HashMap<String,String>();
	public void Insertotp(String email,String otp) {
		otps.put(email,otp);
	}
	public void Deleteemail(String email) {
		otps.remove(email);
	}
	public boolean verification(String email,String otp) {
		if (otps.get(email).equals(otp)) {
			return true;
		}
		else {
			return false;
		}
	}
	public PassEncTech1() {
		
	}
	public void insert(String username,Integer number) {
		unique.put(username,number);
	}
	public void delete(String st) {
		unique.remove(st);
	}
	public Integer Number(String name) {
		return unique.get(name);
	}
	public boolean Check(String username,Integer number) {
		if (unique.containsKey(username)) {
			if(unique.get(username).equals(number)) {
				return true;
			}
			return false;
		}
		return false;
	}
	public  String hasing(String password) { 
		String encryptedpassword=null;
		try {
			 MessageDigest m = MessageDigest.getInstance("MD5");  
	            m.update(password.getBytes());  
	            byte[] bytes = m.digest();   
	            StringBuilder s = new StringBuilder();  
	            for(int i=0; i< bytes.length ;i++)  
	            {  
	                s.append(Integer.toString((bytes[i] & 0xff) + 0x100, 16).substring(1));  
	            }
	           encryptedpassword = s.toString();  
		}catch(Exception e) {	
		}
		return encryptedpassword;
	}
	
}
