package com.hivapp.courseuth.domain.dto;

import java.time.Instant;
import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LastedBlogDTO {
    private Long blog_id;
    private String title;
    private String banner;
    private String des;
    private List<String> tags;
    private BlogActivityDTO activity;
    private AuthorDTO author;
    private Instant published_at;

    @Getter
    @Setter
    public static class BlogActivityDTO {
        private Number total_likes;
        private Number total_comments;
        private Number total_reads;
        private Number total_parent_comments;
    }

    @Getter
    @Setter
    public static class AuthorDTO {
        private PersonalInfoDTO personal_info;

        @Getter
        @Setter
        public static class PersonalInfoDTO {
            private String fullName;
            private String gender;
            private String email;
        }
    }
} 