package com.yno.cinemabookingbackend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private Long userId;
    private String username;
    private String email;
    private String role;
    private String phoneNumber;
    private String message;
    private String token;
}
