// DTO nhận dữ liệu reset password từ frontend
package com.hivapp.courseuth.domain.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResetPasswordDTO {
    private String email;
    private String currPass;
    private String newPass;
} 