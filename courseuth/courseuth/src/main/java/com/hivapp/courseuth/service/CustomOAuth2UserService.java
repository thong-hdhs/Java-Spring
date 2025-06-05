package com.hivapp.courseuth.service;

import java.util.Map;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import com.hivapp.courseuth.domain.User;
import com.hivapp.courseuth.repository.UserRepository;
import com.hivapp.courseuth.util.constant.RoleEnum;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public CustomOAuth2UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oauth2User = super.loadUser(userRequest);
        try {
            return processOAuth2User(userRequest, oauth2User);
        } catch (Exception ex) {
            throw new OAuth2AuthenticationException(ex.getMessage());
        }
    }

    private OAuth2User processOAuth2User(OAuth2UserRequest userRequest, OAuth2User oauth2User) {
        Map<String, Object> attributes = oauth2User.getAttributes();
        String email = (String) attributes.get("email");
        
        User user = userRepository.findByEmail(email);
        if (user != null) {
            // Cập nhật thông tin nếu cần
            user.setFullName((String) attributes.get("name"));
            userRepository.save(user);
        } else {
            // Tạo user mới
            user = new User();
            user.setEmail(email);
            user.setFullName((String) attributes.get("name"));
            user.setRole(RoleEnum.MEMBER);
            // Đặt password là chuỗi ngẫu nhiên đã mã hóa
            user.setPassword(passwordEncoder.encode(java.util.UUID.randomUUID().toString()));
            userRepository.save(user);
        }

        return oauth2User;
    }
} 