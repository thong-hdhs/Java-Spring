package com.hivapp.courseuth.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hivapp.courseuth.domain.Blog;
import com.hivapp.courseuth.domain.BlogActivity;
import com.hivapp.courseuth.domain.dto.Meta;
import com.hivapp.courseuth.domain.dto.ResultPaginationDTO;
import com.hivapp.courseuth.repository.BlogRepository;

@Service
public class BlogService {
    
    @Autowired
    private BlogRepository blogRepository;


    public BlogService(BlogRepository blogRepository) {
        this.blogRepository = blogRepository;
    }

    public ResultPaginationDTO getAllBlogs(Pageable pageable) {
        Page<Blog> page = blogRepository.findAll(pageable);
        ResultPaginationDTO rs = new ResultPaginationDTO();
        Meta mt = new Meta();

        mt.setPage(page.getNumber() + 1);
        mt.setPageSize(page.getSize());
        mt.setPages(page.getTotalPages());
        mt.setTotal(page.getTotalElements());

        rs.setMeta(mt);
        rs.setResult(page.getContent());

        return rs;
    }

    public Optional<Blog> getBlogById(Long id) {
        return blogRepository.findById(id);
    }

    @Transactional
    public Blog createBlog(Blog blog) {
        // Tạo BlogActivity mới khi tạo Blog
        BlogActivity blogActivity = new BlogActivity();
        blogActivity.setUser(blog.getUser());
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

    public Page<Blog> findAllBySpecification(Specification<Blog> spec, Pageable pageable) {
        return blogRepository.findAll(spec, pageable);
    }
} 