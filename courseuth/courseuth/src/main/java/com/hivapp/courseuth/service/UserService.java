package com.hivapp.courseuth.service;

import org.springframework.stereotype.Service;

import com.hivapp.courseuth.domain.User;
import com.hivapp.courseuth.repository.UserRepository;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public void handleCreateUser(User user){
        this.userRepository.save(user);
    }

    public User handleGetUserByEmail(String email) {
        return this.userRepository.findByEmail(email);
    }
}
