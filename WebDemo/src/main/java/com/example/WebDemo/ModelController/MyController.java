package com.example.WebDemo.ModelController;
import java.io.IOException;
import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.socket.WebSocketSession;
import com.example.WebDemo.Model.Data;
import com.example.WebDemo.Model.Data1;
import com.example.WebDemo.Model.Message;
import com.example.WebDemo.Model.Messprofile;
import com.example.WebDemo.Model.PassEncTech1;
import com.example.WebDemo.Model.UserData;
import com.example.WebDemo.Repository.Data1Repo;
import com.example.WebDemo.Repository.DataRepo;
import com.example.WebDemo.Repository.JpaRepo;

@RestController
@CrossOrigin("http://localhost:3000")
@RequestMapping("/web")
public class MyController {
//	@Autowired
//	private JpaRepo jp;
	@Autowired
	private DataRepo jp1;
	@Autowired
	private Data1Repo jp2;
	private PassEncTech1 ps =new PassEncTech1();	
	@GetMapping("/getsprofiles/{number}/{password}")
	private String fetch(@PathVariable String number,@PathVariable String password) {
		String password1=ps.hasing(password);
		List<Data1> ud=jp2.findAll();
		int min = 200;  
		int max = 400;  
		for (Data1 ud1:ud) {
			if (ud1.getNumber().equals(number) && ud1.getPassword().equals(password1)) {
				int b = (int)(Math.random()*(max-min+1)+min); 
				ps.insert(ud1.getUsername(),b);
				return ud1.getUsername();
			}
		}
		return "false";
	}
	@GetMapping("/unique/{user}")
	private Integer uniqueId(@PathVariable String user) {
		return ps.Number(user);
	}
	@GetMapping("/putprofile/{number}/{password}")
	private boolean puttings(@PathVariable String number,@PathVariable String password) {
		String password1=ps.hasing(password);
		List<Data1> ud=jp2.findAll();
		for (Data1 ud1:ud) {
			if (ud1.getNumber().equals(number) && ud1.getPassword().equals(password1)) {
				if (ud1.isLogin()) {
					return false;
				}
				ud1.setLogin(true);
				jp2.save(ud1);
				return true;
			}
		}
		return false;
	}
	@PostMapping("/postprofile/{folderName11}/{folderName21}/{folderName31}")
	private ResponseEntity<String> profile(@RequestParam("file1") MultipartFile file,@PathVariable String folderName11,@PathVariable String folderName21,@PathVariable String folderName31 ) throws IOException{
		System.out.println(ps);
		String password=ps.hasing(folderName21);
		List<Data1> ud=jp2.findAll();
		for (Data1 ud1:ud) {
			if(ud1.getUsername().equals(folderName11)) {
				System.out.println("duplicate");
				return ResponseEntity.ok("change user name");
			}
		}
		
		Data1 ud2=new Data1(folderName11,password,folderName31,false,file.getBytes());
		jp2.save(ud2);
		return ResponseEntity.ok("created");
	}
	@GetMapping("/onlinesprofile")
	private ArrayList<Messprofile> profiledata(){
		ArrayList<Messprofile> cars = new ArrayList<Messprofile>();
		List<Data1> ud=jp2.findAll();
		for(Data1 ud1:ud) {
			String username = ud1.getUsername();
	        boolean isLogin = ud1.isLogin();
	        byte[] image=ud1.getImage();
	        Messprofile message = new Messprofile(username, isLogin,image);
	        cars.add(message);
		}
		return cars;
	}
	@PutMapping("/put/{number}/{password}")
	private void putting1(@PathVariable String number,@PathVariable String password) {
		String password1=ps.hasing(password);
		List<Data1> ud=jp2.findAll();
		for (Data1 ud1:ud) {
			if (ud1.getNumber().equals(number) && ud1.getPassword().equals(password1)) {
				ud1.setLogin(false);
				jp2.save(ud1);
				
			}
		}
	}
}
