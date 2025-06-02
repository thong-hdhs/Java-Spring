package com.hivapp.courseuth.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hivapp.courseuth.domain.User;

@Repository
public interface  UserRepository extends JpaRepository<User, String>{
    User findByEmail(String email);
}
