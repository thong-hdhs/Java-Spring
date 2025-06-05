package com.hivapp.courseuth.domain;

import java.time.Instant;

import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.hivapp.courseuth.util.constant.GenderEnum;
import com.hivapp.courseuth.util.constant.RoleEnum;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
@EntityListeners(AuditingEntityListener.class)
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Tên là bắc buộc")
    private String fullName;

    @NotBlank(message = "Email là bắc buộc")
    private String email;

    // @NotBlank(message = "Password là bắc buộc")
    private String password;
    private String phoneNumber;
    private int age;

    @Enumerated(EnumType.STRING)
    private GenderEnum gender;
    private String address;

    @Column(columnDefinition="MEDIUMTEXT")
    private String refreshToken;

    @Enumerated(EnumType.STRING)
    private RoleEnum role = RoleEnum.GUEST;

    @CreatedDate
    private Instant createAt;

    @LastModifiedDate
    private Instant updateAt;

    @CreatedBy
    private String createBy;

    @LastModifiedBy
    private String updateBy;

}
