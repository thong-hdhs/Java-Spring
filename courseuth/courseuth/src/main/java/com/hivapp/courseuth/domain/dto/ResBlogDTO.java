package com.hivapp.courseuth.domain.dto;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResBlogDTO {
    private Long id;
    private String title;
    private String banner;
    private String des;
    private String content;
    private List<String> tags;
    private Object blogActivity;
    private ResUserDTO user;
} 