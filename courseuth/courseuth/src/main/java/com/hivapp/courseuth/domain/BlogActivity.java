package com.hivapp.courseuth.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "blog_activities")
@Getter
@Setter
public class BlogActivity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;

    private Number total_likes;
    
    private Number total_comments;

    private Number total_views;

    private Number total_parent_comments;
    
}
