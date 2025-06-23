package com.hivapp.courseuth.domain.dto;

import java.time.Instant;
import java.util.List;

import com.hivapp.courseuth.domain.Blog;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MiniBlogDTO {
    private Long blog_id;
    private String title;
    private String banner;
    private String des;
    private List<String> tags;
    private Instant published_at;
    private BlogActivityDTO activity;
    private AuthorDTO author;

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
            private String email;
            private String gender;
        }
    }

    public static MiniBlogDTO fromBlog(Blog blog) {
        MiniBlogDTO miniBlog = new MiniBlogDTO();
        miniBlog.setBlog_id(blog.getId());
        miniBlog.setTitle(blog.getTitle());
        miniBlog.setBanner(blog.getBanner());
        miniBlog.setDes(blog.getDes());
        miniBlog.setTags(blog.getTags());
        miniBlog.setPublished_at(blog.getPublished_at());

        if (blog.getBlogActivity() != null) {
            BlogActivityDTO activity = new BlogActivityDTO();
            activity.setTotal_likes(blog.getBlogActivity().getTotal_likes());
            miniBlog.setActivity(activity);
        }

        if (blog.getUser() != null) {
            AuthorDTO author = new AuthorDTO();
            AuthorDTO.PersonalInfoDTO personalInfo = new AuthorDTO.PersonalInfoDTO();
            personalInfo.setFullName(blog.getUser().getFullName());
            personalInfo.setEmail(blog.getUser().getEmail());
            personalInfo.setGender(blog.getUser().getGender() != null ? blog.getUser().getGender().toString() : "");
            author.setPersonal_info(personalInfo);
            miniBlog.setAuthor(author);
        }

        return miniBlog;
    }
} 