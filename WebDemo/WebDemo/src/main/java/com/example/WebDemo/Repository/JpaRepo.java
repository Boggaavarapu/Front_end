package com.example.WebDemo.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.WebDemo.Model.UserData;
@Repository
public interface JpaRepo extends JpaRepository<UserData,Long > {
		
}
