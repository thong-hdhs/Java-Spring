package com.hivapp.courseuth.domain;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RestResponse<T>{
    private int statusCode;
    private String error;

    private String message;
    private T data;
}
