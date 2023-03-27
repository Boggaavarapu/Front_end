package com.example.WebDemo.Model;

public class Messprofile {
	private String username;
	private boolean login;
	private byte[] image;
	
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

	public byte[] getImage() {
		return image;
	}

	public void setImage(byte[] image) {
		this.image = image;
	}

	public Messprofile(String username, boolean login, byte[] image) {
		super();
		this.username = username;
		this.login = login;
		this.image = image;
	}

	public Messprofile() {
		// TODO Auto-generated constructor stub
	}

}
