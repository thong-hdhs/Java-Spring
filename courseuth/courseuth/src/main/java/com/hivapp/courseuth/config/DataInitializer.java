package com.hivapp.courseuth.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.hivapp.courseuth.domain.User;
import com.hivapp.courseuth.service.UserService;
import com.hivapp.courseuth.util.constant.RoleEnum;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserService userService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // Kiểm tra xem tài khoản admin đã tồn tại chưa
        if (!userService.isEmailExit("admin3@ut.edu.vn")) {
            User admin = new User();
            admin.setEmail("admin3@ut.edu.vn");
            admin.setPassword(passwordEncoder.encode("Thideptrai21"));
            admin.setFullName("Administrator");
            admin.setRole(RoleEnum.ADMIN);
            userService.handleCreateUser(admin);
        }
    }
} 