package com.hivapp.courseuth.service.error;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestController;

import com.hivapp.courseuth.domain.RestResponse;


@RestController
public class GlobalException {
    @ExceptionHandler(value= {
            UsernameNotFoundException.class,
            BadCredentialsException.class,
    })
    public ResponseEntity<RestResponse<Object>> handleIdException(Exception ex) {
        RestResponse<Object> res = new RestResponse<Object>();
        res.setStatusCode(HttpStatus.BAD_REQUEST.value());
        res.setError(ex.getMessage());
        res.setMessage("Invalid login information");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(res);
    }
}
