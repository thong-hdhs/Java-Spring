package com.hivapp.courseuth.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.hivapp.courseuth.domain.dto.LoginDTO;
import com.hivapp.courseuth.domain.dto.ResLoginDTO;
import com.hivapp.courseuth.util.SecurityUtil;


@RestController
public class AuthController {

    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    private final SecurityUtil securityUtil;
    public AuthController(AuthenticationManagerBuilder authenticationManagerBuilder, SecurityUtil securityUtil) {
        this.authenticationManagerBuilder = authenticationManagerBuilder;
        this.securityUtil = securityUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<ResLoginDTO> login(@RequestBody LoginDTO loginDTO) {
        //nap pass va email vao authentication token
        UsernamePasswordAuthenticationToken authenticationToken =
            new UsernamePasswordAuthenticationToken(loginDTO.getEmail(), loginDTO.getPassword());
        //xac thuc nguoi dung
        Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);
           //create token
            String access_token = this.securityUtil.createToken(authentication);
            SecurityContextHolder.getContext().setAuthentication(authentication);
            ResLoginDTO res = new ResLoginDTO();
            res.setAccessToken(access_token);
            return ResponseEntity.ok().body(res);
    }
}
