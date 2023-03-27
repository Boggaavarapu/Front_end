package com.example.WebDemo.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.WebDemo.Model.Data1;
@Repository
public interface Data1Repo extends JpaRepository<Data1,Long > {

}
