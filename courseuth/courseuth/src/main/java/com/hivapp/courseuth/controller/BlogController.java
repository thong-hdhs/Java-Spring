package com.hivapp.courseuth.controller;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hivapp.courseuth.domain.Blog;
import com.hivapp.courseuth.domain.RestResponse;
import com.hivapp.courseuth.domain.User;
import com.hivapp.courseuth.domain.dto.BlogDTO;
import com.hivapp.courseuth.domain.dto.LastedBlogDTO;
import com.hivapp.courseuth.domain.dto.ResBlogDTO;
import com.hivapp.courseuth.domain.dto.ResUserDTO;
import com.hivapp.courseuth.service.BlogService;
import com.hivapp.courseuth.service.UserService;
import com.hivapp.courseuth.util.SecurityUtil;

@RestController
@RequestMapping("/api/blogs")
public class BlogController {

    @Autowired
    private BlogService blogService;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserService userService;

    @GetMapping
    public List<Blog> getAllBlogs() {
        return blogService.getAllBlogs();
    }

    @GetMapping("/{id}")
    public ResponseEntity<RestResponse<ResBlogDTO>> getBlogById(@PathVariable Long id) {
        return blogService.getBlogById(id)
                .map(blog -> {
                    ResBlogDTO resBlog = new ResBlogDTO();
                    resBlog.setId(blog.getId());
                    resBlog.setTitle(blog.getTitle());
                    resBlog.setBanner(blog.getBanner());
                    resBlog.setDes(blog.getDes());
                    resBlog.setContent(blog.getContent());
                    resBlog.setTags(blog.getTags());
                    resBlog.setBlogActivity(blog.getBlogActivity());
                    if (blog.getUser() != null) {
                        ResUserDTO resUser = userService.convertToResUserDTO(blog.getUser());
                        resBlog.setUser(resUser);
                    }
                    RestResponse<ResBlogDTO> response = new RestResponse<>();
                    response.setStatusCode(200);
                    response.setError(null);
                    response.setMessage("Call API Success");
                    response.setData(resBlog);
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public RestResponse<ResBlogDTO> createBlog(@RequestBody BlogDTO blogDTO) throws IOException {
        Blog blog = new Blog();
        blog.setTitle(blogDTO.getTitle());
        blog.setBanner(blogDTO.getBanner());
        blog.setDes(blogDTO.getDes());
        blog.setContent(objectMapper.writeValueAsString(blogDTO.getContent()));
        blog.setTags(blogDTO.getTags());
        // Lấy user từ JWT
        String email = SecurityUtil.getCurrentUserLogin().orElse(null);
        User user = userService.handleGetUserByEmail(email);
        blog.setUser(user);
        Blog savedBlog = blogService.createBlog(blog);
        // Map sang ResBlogDTO
        ResBlogDTO resBlog = new ResBlogDTO();
        resBlog.setId(savedBlog.getId());
        resBlog.setTitle(savedBlog.getTitle());
        resBlog.setBanner(savedBlog.getBanner());
        resBlog.setDes(savedBlog.getDes());
        resBlog.setContent(savedBlog.getContent());
        resBlog.setTags(savedBlog.getTags());
        resBlog.setBlogActivity(savedBlog.getBlogActivity());
        resBlog.setUser(userService.convertToResUserDTO(user));
        RestResponse<ResBlogDTO> response = new RestResponse<>();
        response.setStatusCode(200);
        response.setError(null);
        response.setMessage("Call API Success");
        response.setData(resBlog);
        return response;
    }

    @PutMapping("/{id}")
    public ResponseEntity<Blog> updateBlog(@PathVariable Long id, @RequestBody BlogDTO blogDTO) throws IOException {
        try {
            Blog blog = new Blog();
            blog.setTitle(blogDTO.getTitle());
            blog.setBanner(blogDTO.getBanner());
            blog.setDes(blogDTO.getDes());
            blog.setContent(objectMapper.writeValueAsString(blogDTO.getContent()));
            blog.setTags(blogDTO.getTags());
            Blog updatedBlog = blogService.updateBlog(id, blog);
            return ResponseEntity.ok(updatedBlog);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBlog(@PathVariable Long id) {
        try {
            blogService.deleteBlog(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/latest-blogs")
    public ResponseEntity<RestResponse<List<LastedBlogDTO>>> getLastedBlogs() {
        List<Blog> blogs = blogService.getAllBlogs();
        List<LastedBlogDTO> lastedBlogs = blogs.stream()
            .map(blog -> {
                LastedBlogDTO lastedBlog = new LastedBlogDTO();
                lastedBlog.setBlog_id(blog.getId());
                lastedBlog.setTitle(blog.getTitle());
                lastedBlog.setBanner(blog.getBanner());
                lastedBlog.setDes(blog.getDes());
                lastedBlog.setTags(blog.getTags());
                lastedBlog.setPublished_at(blog.getPublished_at());

                // Set activity
                if (blog.getBlogActivity() != null) {
                    LastedBlogDTO.BlogActivityDTO activity = new LastedBlogDTO.BlogActivityDTO();
                    activity.setTotal_likes(blog.getBlogActivity().getTotal_likes());
                    activity.setTotal_comments(blog.getBlogActivity().getTotal_comments());
                    activity.setTotal_reads(blog.getBlogActivity().getTotal_views());
                    activity.setTotal_parent_comments(blog.getBlogActivity().getTotal_parent_comments());
                    lastedBlog.setActivity(activity);
                }

                // Set author
                if (blog.getUser() != null) {
                    LastedBlogDTO.AuthorDTO author = new LastedBlogDTO.AuthorDTO();
                    LastedBlogDTO.AuthorDTO.PersonalInfoDTO personalInfo = new LastedBlogDTO.AuthorDTO.PersonalInfoDTO();
                    personalInfo.setFullName(blog.getUser().getFullName());
                    personalInfo.setEmail(blog.getUser().getEmail());
                    // personalInfo.setGender(blog.getUser().getGender().toString());
                    author.setPersonal_info(personalInfo);
                    lastedBlog.setAuthor(author);
                    
                }

                return lastedBlog;
            })
            .sorted((b1, b2) -> b2.getPublished_at().compareTo(b1.getPublished_at()))
            .collect(Collectors.toList());

        RestResponse<List<LastedBlogDTO>> response = new RestResponse<>();
        response.setStatusCode(200);
        response.setError(null);
        response.setMessage("Call API Success");
        response.setData(lastedBlogs);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/trending-blogs")
    public ResponseEntity<RestResponse<List<LastedBlogDTO>>> getTrendingBlogs() {
        List<Blog> blogs = blogService.getAllBlogs();
        List<LastedBlogDTO> trendingBlogs = blogs.stream()
            .map(blog -> {
                LastedBlogDTO lastedBlog = new LastedBlogDTO();
                lastedBlog.setBlog_id(blog.getId());
                lastedBlog.setTitle(blog.getTitle());
                lastedBlog.setBanner(blog.getBanner());
                lastedBlog.setDes(blog.getDes());
                lastedBlog.setTags(blog.getTags());
                lastedBlog.setPublished_at(blog.getPublished_at());

                // Set activity
                if (blog.getBlogActivity() != null) {
                    LastedBlogDTO.BlogActivityDTO activity = new LastedBlogDTO.BlogActivityDTO();
                    activity.setTotal_likes(blog.getBlogActivity().getTotal_likes());
                    activity.setTotal_comments(blog.getBlogActivity().getTotal_comments());
                    activity.setTotal_reads(blog.getBlogActivity().getTotal_views());
                    activity.setTotal_parent_comments(blog.getBlogActivity().getTotal_parent_comments());
                    lastedBlog.setActivity(activity);
                }

                // Set author
                if (blog.getUser() != null) {
                    LastedBlogDTO.AuthorDTO author = new LastedBlogDTO.AuthorDTO();
                    LastedBlogDTO.AuthorDTO.PersonalInfoDTO personalInfo = new LastedBlogDTO.AuthorDTO.PersonalInfoDTO();
                    personalInfo.setFullName(blog.getUser().getFullName());
                    personalInfo.setEmail(blog.getUser().getEmail());
                    // Nếu gender null thì để rỗng
                    personalInfo.setGender(blog.getUser().getGender() != null ? blog.getUser().getGender().toString() : "");
                    author.setPersonal_info(personalInfo);
                    lastedBlog.setAuthor(author);
                }
                return lastedBlog;
            })
            .sorted((b1, b2) -> {
                // Sắp xếp theo tổng lượt xem, lượt like, thời gian phát hành
                int cmp = Integer.compare(
                    b2.getActivity() != null && b2.getActivity().getTotal_reads() != null ? b2.getActivity().getTotal_reads().intValue() : 0,
                    b1.getActivity() != null && b1.getActivity().getTotal_reads() != null ? b1.getActivity().getTotal_reads().intValue() : 0
                );
                if (cmp == 0) {
                    cmp = Integer.compare(
                        b2.getActivity() != null && b2.getActivity().getTotal_likes() != null ? b2.getActivity().getTotal_likes().intValue() : 0,
                        b1.getActivity() != null && b1.getActivity().getTotal_likes() != null ? b1.getActivity().getTotal_likes().intValue() : 0
                    );
                }
                if (cmp == 0) {
                    if (b2.getPublished_at() != null && b1.getPublished_at() != null) {
                        cmp = b2.getPublished_at().compareTo(b1.getPublished_at());
                    }
                }
                return cmp;
            })
            .collect(Collectors.toList());

        RestResponse<List<LastedBlogDTO>> response = new RestResponse<>();
        response.setStatusCode(200);
        response.setError(null);
        response.setMessage("Call API Success");
        response.setData(trendingBlogs);
        return ResponseEntity.ok(response);
    }
} 