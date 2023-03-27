package com.example.WebDemo.Model;

public class Message {
	  private String username;
	  private boolean login;
	  public Message() {}
	public Message(String username, boolean login) {
		super();
		this.username = username;
		this.login = login;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public boolean isLogin() {
		return login;
	}
	public void setLogin(boolean login) {
		this.login = login;
	}
	 
	  
	}