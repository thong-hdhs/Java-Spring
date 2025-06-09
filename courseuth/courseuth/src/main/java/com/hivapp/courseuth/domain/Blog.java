package com.hivapp.courseuth.domain;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "blogs")
@Getter
@Setter
public class Blog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message="title là bắc buộc")
    private String title;

    private String banner;

    private String des;

    @NotBlank(message="content là bắc buộc")
    @Lob
    private String content;

    @ElementCollection
    private List<String> tags;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "blog_activity_id")
    private BlogActivity blogActivity;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
