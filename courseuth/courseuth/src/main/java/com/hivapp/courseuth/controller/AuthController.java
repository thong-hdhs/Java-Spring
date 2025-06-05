package com.hivapp.courseuth.controller;


import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.hivapp.courseuth.domain.User;
import com.hivapp.courseuth.domain.dto.LoginDTO;
import com.hivapp.courseuth.domain.dto.RegisterDTO;
import com.hivapp.courseuth.domain.dto.ResLoginDTO;
import com.hivapp.courseuth.service.UserService;
import com.hivapp.courseuth.service.error.IdInvalidException;
import com.hivapp.courseuth.util.SecurityUtil;
import com.hivapp.courseuth.util.anotation.ApiMessage;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;


@Slf4j
@RestController
public class AuthController {

    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    private final SecurityUtil securityUtil;
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    public AuthController(AuthenticationManagerBuilder authenticationManagerBuilder, SecurityUtil securityUtil,
            UserService userService, PasswordEncoder passwordEncoder) {
        this.authenticationManagerBuilder = authenticationManagerBuilder;
        this.securityUtil = securityUtil;
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    @Value("${hivapp.jwt.refresh-token.expiration}")
    private long refreshExpiration;

    @PostMapping("/auth/login")
    public ResponseEntity<ResLoginDTO> login(@Valid @RequestBody LoginDTO loginDTO) {
        log.info("Attempting login for email: {}", loginDTO.getEmail());
        try {
            // Tạo authentication token
            UsernamePasswordAuthenticationToken authenticationToken =
                new UsernamePasswordAuthenticationToken(loginDTO.getEmail(), loginDTO.getPassword());
            
            // Xác thực người dùng
            Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);
            SecurityContextHolder.getContext().setAuthentication(authentication);
            log.info("Authentication successful for user: {}", loginDTO.getEmail());

            // Tạo response
            ResLoginDTO res = new ResLoginDTO();
            User currUserDB = this.userService.handleGetUserByEmail(loginDTO.getEmail());
            if (currUserDB != null) {
                ResLoginDTO.UserLogin userLogin = res.new UserLogin(
                    currUserDB.getId(),
                    currUserDB.getFullName(),
                    currUserDB.getEmail()
                );
                res.setUser(userLogin);
            }

            // Tạo access token
            String access_token = this.securityUtil.createAccessToken(authentication, res.getUser());
            res.setAccessToken(access_token);

            // Tạo refresh token
            String refresh_token = this.securityUtil.createRefreshToken(loginDTO.getEmail(), res);
            this.userService.updateUserToken(refresh_token, loginDTO.getEmail());

            // Set cookie
            ResponseCookie resCookies = ResponseCookie.from("refresh_token", refresh_token)
                    .httpOnly(true)
                    .secure(false) // Set to false for local development
                    .path("/")
                    .maxAge(refreshExpiration)
                    .build();

            return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, resCookies.toString())
                .body(res);
        } catch (Exception e) {
            log.error("Login failed for user: {} - Error: {}", loginDTO.getEmail(), e.getMessage());
            throw new RuntimeException("Invalid email or password");
        }
    }

    @GetMapping("/auth/account")
    @ApiMessage("Lấy thông tin tài khoản hiện tại")
    public ResponseEntity<ResLoginDTO.UserLogin> getAccount(){
        String email = SecurityUtil.getCurrentUserLogin().isPresent() ?
        SecurityUtil.getCurrentUserLogin().get(): "";

        User currentUserDB = this.userService.handleGetUserByEmail(email);
        ResLoginDTO res = new ResLoginDTO();
        ResLoginDTO.UserLogin userLogin = res.new UserLogin();
        if (currentUserDB != null) {
            userLogin.setId(currentUserDB.getId());
            userLogin.setFullName(currentUserDB.getFullName());
            userLogin.setEmail(currentUserDB.getEmail());
        }

        return ResponseEntity.ok().body(userLogin);
    }

    @GetMapping("/auth/refresh")
    @ApiMessage("Get User by refresh token")
    public ResponseEntity<ResLoginDTO> getRefreshToken(
            @CookieValue(name = "refresh_token", defaultValue = "abc") String refresh_token) throws IdInvalidException {
        if (refresh_token.equals("abc")) {
            throw new IdInvalidException("Bạn không có refresh token ở cookie");
        }
        // check valid
        Jwt decodedToken = this.securityUtil.checkValidRefreshToken(refresh_token);
        String email = decodedToken.getSubject();

        // check user by token + email
        User currentUser = this.userService.getUserByRefreshTokenAndEmail(refresh_token, email);
        if (currentUser == null) {
            throw new IdInvalidException("Refresh Token không hợp lệ");
        }

        // issue new token/set refresh token as cookies
        ResLoginDTO res = new ResLoginDTO();
        User currentUserDB = this.userService.handleGetUserByEmail(email);
        if (currentUserDB != null) {
            ResLoginDTO.UserLogin userLogin = res.new UserLogin(
                    currentUserDB.getId(),
                    currentUserDB.getFullName(),
                    currentUserDB.getEmail());
            res.setUser(userLogin);
        }

        // Tạo access token mới
        Authentication authentication = new UsernamePasswordAuthenticationToken(email, null);
        String access_token = this.securityUtil.createAccessToken(authentication, res.getUser());
        res.setAccessToken(access_token);

        // Tạo refresh token mới
        String new_refresh_token = this.securityUtil.createRefreshToken(email, res);
        this.userService.updateUserToken(new_refresh_token, email);

        // Set cookie mới
        ResponseCookie resCookies = ResponseCookie.from("refresh_token", new_refresh_token)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(refreshExpiration)
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, resCookies.toString())
                .body(res);
    }

    @PostMapping("/auth/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterDTO registerDTO) {
        if (userService.isEmailExit(registerDTO.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of(
                    "statusCode", HttpStatus.CONFLICT.value(),
                    "message", "Email đã tồn tại."
                ));
        }

        User user = new User();
        user.setFullName(registerDTO.getFullName());
        user.setEmail(registerDTO.getEmail());
        user.setPassword(passwordEncoder.encode(registerDTO.getPassword()));
        user.setRole(com.hivapp.courseuth.util.constant.RoleEnum.MEMBER);
        userService.handleCreateUser(user);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(Map.of(
                "statusCode", HttpStatus.CREATED.value(),
                "message", "Đăng ký thành công! Bạn có thể đăng nhập ngay."
            ));
    }

}
