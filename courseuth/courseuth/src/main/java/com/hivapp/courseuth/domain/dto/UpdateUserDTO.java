package com.hivapp.courseuth.domain.dto;

import com.hivapp.courseuth.util.constant.GenderEnum;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateUserDTO {
    private String fullName;
    private String phoneNumber;
    private int age;
    private GenderEnum gender;
    private String address;
} 