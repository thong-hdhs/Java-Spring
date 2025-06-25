package com.hivapp.courseuth.domain.dto;

import com.hivapp.courseuth.util.constant.RoleEnum;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
public class ResLoginDTO {
    String accessToken;
    private UserLogin user;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public class UserLogin{
        private long id;
        private String fullName;
        private String email;
        private RoleEnum role;
    }
}
