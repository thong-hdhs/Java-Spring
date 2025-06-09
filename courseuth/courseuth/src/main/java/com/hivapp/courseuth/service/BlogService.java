package com.hivapp.courseuth.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hivapp.courseuth.domain.Blog;
import com.hivapp.courseuth.domain.BlogActivity;
import com.hivapp.courseuth.repository.BlogRepository;

@Service
public class BlogService {
    
    @Autowired
    private BlogRepository blogRepository;

    public List<Blog> getAllBlogs() {
        return blogRepository.findAll();
    }

    public Optional<Blog> getBlogById(Long id) {
        return blogRepository.findById(id);
    }

    @Transactional
    public Blog createBlog(Blog blog) {
        // Tạo BlogActivity mới khi tạo Blog
        BlogActivity blogActivity = new BlogActivity();
        blogActivity.setTotal_likes(0);
        blogActivity.setTotal_comments(0);
        blogActivity.setTotal_views(0);
        blogActivity.setTotal_parent_comments(0);
        blog.setBlogActivity(blogActivity);
        
        return blogRepository.save(blog);
    }

    @Transactional
    public Blog updateBlog(Long id, Blog blogDetails) {
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Blog not found with id: " + id));
        
        blog.setTitle(blogDetails.getTitle());
        blog.setBanner(blogDetails.getBanner());
        blog.setDes(blogDetails.getDes());
        blog.setContent(blogDetails.getContent());
        blog.setTags(blogDetails.getTags());
        
        return blogRepository.save(blog);
    }

    @Transactional
    public void deleteBlog(Long id) {
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Blog not found with id: " + id));
        blogRepository.delete(blog);
    }
} 