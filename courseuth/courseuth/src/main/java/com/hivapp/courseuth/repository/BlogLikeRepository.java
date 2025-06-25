package com.hivapp.courseuth.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.hivapp.courseuth.domain.Blog;
import com.hivapp.courseuth.domain.BlogLike;
import com.hivapp.courseuth.domain.User;

@Repository
public interface BlogLikeRepository extends JpaRepository<BlogLike, Long> {
    Optional<BlogLike> findByUserAndBlog(User user, Blog blog);
    
    // Tìm tất cả like của một user
    List<BlogLike> findByUserId(Long userId);
    
    // Tìm tất cả like của một blog
    List<BlogLike> findByBlogId(Long blogId);
    
    // Xóa tất cả like của một user
    @Modifying
    @Query("DELETE FROM BlogLike bl WHERE bl.user.id = :userId")
    void deleteByUserId(@Param("userId") Long userId);
    
    // Xóa tất cả like của một blog
    @Modifying
    @Query("DELETE FROM BlogLike bl WHERE bl.blog.id = :blogId")
    void deleteByBlogId(@Param("blogId") Long blogId);
} 