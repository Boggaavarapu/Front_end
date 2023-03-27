package com.example.WebDemo.ModelController;
import java.io.IOException;
import java.time.Duration;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import com.example.WebDemo.Model.Data1;
import com.example.WebDemo.Model.Messprofile;
import com.example.WebDemo.Model.PassEncTech1;
import com.example.WebDemo.Model.UserData;
import com.example.WebDemo.Repository.Data1Repo;
import com.example.WebDemo.Repository.DataRepo;
import com.example.WebDemo.Repository.JpaRepo;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.Delegate;
@Service
@RestController
@CrossOrigin("http://localhost:3000")
@RequestMapping("/web")
public class MyController {
	
	@Autowired
	private JavaMailSender mailsender;
	@Autowired
	private JpaRepo status;
	@Autowired
	private DataRepo jp1;
	@Autowired
	private Data1Repo jp2;
	private static final String OTP_CHARS = "0123456789";
    private static final int OTP_LENGTH = 6;
    private static final Random random = new Random();

   public static String generateOTP() {
      StringBuilder otp = new StringBuilder();
      for (int i = 0; i < OTP_LENGTH; i++) {
         otp.append(OTP_CHARS.charAt(random.nextInt(OTP_CHARS.length())));
      }
      return otp.toString();
   }
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
	@PostMapping("/poststatus/{email}/{username}")
	private void poststatus(@RequestParam("status") MultipartFile file,@PathVariable String email,@PathVariable String username) throws IOException {
		LocalTime currentTime = LocalTime.now(); // get the current time
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm:ss"); // create a formatter for the desired format
		String currentTimeString = currentTime.format(formatter);
		UserData userdata=new UserData(email,username,file.getContentType(),file.getBytes(),currentTimeString);
		status.save(userdata);
	}
	@DeleteMapping()
	public void updatestatus() {
		List<UserData> userdata=status.findAll();
		
		for(UserData ud:userdata) {
			DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm:ss"); // create a formatter for the string format
			LocalTime time = LocalTime.parse(ud.getTime(), formatter);
			Duration duration = Duration.between(LocalTime.now(), time);
			if (duration.equals(Duration.ofHours(24))) {
				  status.deleteById(ud.getId());
			}
		}
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
	@GetMapping("/getStatus")
	private List<UserData> getstatus(){
		List<UserData> ud=status.findAll();
		return ud;
	}
	
	@PostMapping("/postprofile/{folderName11}/{folderName21}/{folderName31}/{otp_check}")
	private ResponseEntity<String> profile(@RequestParam("file1") MultipartFile file,@PathVariable String folderName11,@PathVariable String folderName21,@PathVariable String folderName31,@PathVariable String otp_check ) throws IOException{
		if (ps.verification( folderName31, otp_check)) {
			String password=ps.hasing(folderName21);
			List<Data1> ud=jp2.findAll();
			for (Data1 ud1:ud) {
				if(ud1.getNumber().equals(folderName31)) {
					System.out.println("duplicate");
					return ResponseEntity.ok("change user name");
				}
			}
			
			Data1 ud2=new Data1(folderName11,password,folderName31,false,file.getBytes());
			jp2.save(ud2);
			ps.Deleteemail(folderName31);
			return ResponseEntity.ok("created");
		}
		else {
			return ResponseEntity.ok("enter correct otp");
		}
	}
	@PostMapping("/otp/{email}")
	private String call(@PathVariable String email) {
		String subject="verifiation otp for authetication ";
		String body=generateOTP();
		MimeMessage message = mailsender.createMimeMessage();
	    MimeMessageHelper helper;
	    try {
	        helper = new MimeMessageHelper(message, true);
	        helper.setTo(email);
	        helper.setSubject(subject);
	        helper.setText(body, true);
	        mailsender.send(message);
	    } catch (MessagingException e) {
	        e.printStackTrace();
	    }
	    ps.Insertotp(email,body);
	    return body;
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
