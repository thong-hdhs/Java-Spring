package com.hivapp.courseuth.service;

import java.util.Collections;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

@Component("userDetailService")
public class UserDetailCustom implements UserDetailsService{

    private final UserService userService;

    public UserDetailCustom(UserService userService) {
        this.userService = userService;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        com.hivapp.courseuth.domain.User user = this.userService.handleGetUserByEmail(email);

        return new User(
            user.getEmail(),
            user.getPassword(),
            Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"))
        );
    }

}
