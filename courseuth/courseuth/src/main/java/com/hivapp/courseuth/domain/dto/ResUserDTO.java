package com.hivapp.courseuth.domain.dto;

import java.time.Instant;

import com.hivapp.courseuth.util.constant.GenderEnum;
import com.hivapp.courseuth.util.constant.RoleEnum;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResUserDTO {
    private Long id;
    private String fullName;
    private String email;
    private String phoneNumber;
    private int age;
    private GenderEnum gender;
    private String address;
    private RoleEnum role;
    private Instant createAt;
    private Instant updateAt;
    private String createBy;
    private String updateBy;
} 