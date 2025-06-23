package com.hivapp.courseuth.domain.dto;

import java.time.Instant;
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
    private Instant published_at;
    private Object blogActivity;
    private ResUserDTO user;
    private boolean isLikedByUser;
} 