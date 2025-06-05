package com.hivapp.courseuth.domain.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterDTO {
    @NotBlank(message = "Họ tên là bắt buộc")
    private String fullName;
    
    @NotBlank(message = "Email là bắt buộc")
    private String email;
    
    @NotBlank(message = "Mật khẩu là bắt buộc")
    private String password;
} 