package com.hivapp.courseuth.config;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.hivapp.courseuth.domain.User;
import com.hivapp.courseuth.domain.dto.ResLoginDTO;
import com.hivapp.courseuth.service.UserService;
import com.hivapp.courseuth.util.SecurityUtil;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class CustomOAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final SecurityUtil securityUtil;
    private final UserService userService;

    @Value("${hivapp.jwt.refresh-token.expiration}")
    private long refreshExpiration;

    public CustomOAuth2SuccessHandler(SecurityUtil securityUtil, UserService userService) {
        this.securityUtil = securityUtil;
        this.userService = userService;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        
        OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
        String email = oauth2User.getAttribute("email");
        
        // Lấy thông tin user từ database
        User user = userService.handleGetUserByEmail(email);
        
        if (user != null) {
            // Tạo ResLoginDTO
            ResLoginDTO res = new ResLoginDTO();
            ResLoginDTO.UserLogin userLogin = res.new UserLogin(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole()
            );
            res.setUser(userLogin);

            // Tạo access token
            String accessToken = securityUtil.createAccessToken(authentication, res.getUser());
            res.setAccessToken(accessToken);

            // Tạo refresh token
            String refreshToken = securityUtil.createRefreshToken(email, res);
            userService.updateUserToken(refreshToken, email);

            // Set refresh token vào cookie
            Cookie refreshCookie = new Cookie("refresh_token", refreshToken);
            refreshCookie.setHttpOnly(true);
            refreshCookie.setSecure(false); // Set false cho development
            refreshCookie.setPath("/");
            refreshCookie.setMaxAge((int) refreshExpiration);
            response.addCookie(refreshCookie);

            // Chuyển hướng về frontend với access token
            String redirectUrl = String.format("http://localhost:5173?access_token=%s&user_id=%d&user_name=%s&user_email=%s", 
                accessToken, 
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole()
            );
            response.sendRedirect(redirectUrl);
        } else {
            // Nếu không tìm thấy user, chuyển về trang lỗi
            response.sendRedirect("http://localhost:5173/login?error=user_not_found");
        }
    }
} 