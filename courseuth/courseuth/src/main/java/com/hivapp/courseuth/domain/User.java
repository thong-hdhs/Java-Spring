package com.hivapp.courseuth.domain;

import java.util.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "users")
@Getter
@Setter
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private String id;
    private String fullName;

    @NotBlank(message = "Email là bắc buộc")
    private String email;
    private String password;
    private String phoneNumber;
    private int age;
    private String gender;
    private String address;
    private String refreshToken;
    private Date createAt;
    private Date updateAt;
    private String createBy;
    private String updateBy;
}
