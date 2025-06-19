package com.hivapp.courseuth.domain.dto;

import lombok.Getter;
import lombok.Setter;

//response blog activity
@Getter
@Setter
public class ResBlogActivityDTO {
    private Long id;
    private Number total_likes;
    private Number total_comments;
    private Number total_views;
    private Number total_parent_comments;
}
