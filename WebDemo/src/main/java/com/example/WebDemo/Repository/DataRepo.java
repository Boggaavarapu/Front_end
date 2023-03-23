package com.example.WebDemo.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.WebDemo.Model.Data;
@Repository
public interface DataRepo extends JpaRepository<Data,Long > {

}
