package com.hivapp.courseuth.service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hivapp.courseuth.domain.Blog;
import com.hivapp.courseuth.domain.BlogActivity;
import com.hivapp.courseuth.domain.BlogLike;
import com.hivapp.courseuth.domain.User;
import com.hivapp.courseuth.domain.dto.Meta;
import com.hivapp.courseuth.domain.dto.ResultPaginationDTO;
import com.hivapp.courseuth.repository.BlogActivityRepository;
import com.hivapp.courseuth.repository.BlogLikeRepository;
import com.hivapp.courseuth.repository.BlogRepository;
import com.hivapp.courseuth.repository.UserRepository;

@Service
public class BlogService {
    
    @Autowired
    private BlogRepository blogRepository;

    @Autowired
    private BlogLikeRepository blogLikeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BlogActivityRepository blogActivityRepository;


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
        blog.setBlogActivity(blogActivity);
        
        return blogRepository.save(blog);
    }

    @Transactional
    public Map<String, Object> likeUnlikeBlog(Long blogId, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        Blog blog = blogRepository.findById(blogId)
                .orElseThrow(() -> new RuntimeException("Blog not found with id: " + blogId));

        Optional<BlogLike> existingLike = blogLikeRepository.findByUserAndBlog(user, blog);
        
        BlogActivity blogActivity = blog.getBlogActivity();
        boolean isLiked;

        if (existingLike.isPresent()) {
            // User đã like, bây giờ unlike
            blogLikeRepository.delete(existingLike.get());
            blogActivity.setTotal_likes(blogActivity.getTotal_likes() - 1);
            isLiked = false;
        } else {
            // User chưa like, bây giờ like
            BlogLike newLike = new BlogLike(user, blog);
            blogLikeRepository.save(newLike);
            blogActivity.setTotal_likes(blogActivity.getTotal_likes() + 1);
            isLiked = true;
        }

        blogActivityRepository.save(blogActivity); // Lưu lại để cập nhật total_likes

        Map<String, Object> response = new HashMap<>();
        response.put("total_likes", blogActivity.getTotal_likes());
        response.put("isLiked", isLiked);
        
        return response;
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