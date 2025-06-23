package com.hivapp.courseuth.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hivapp.courseuth.domain.Blog;
import com.hivapp.courseuth.domain.BlogLike;
import com.hivapp.courseuth.domain.User;

@Repository
public interface BlogLikeRepository extends JpaRepository<BlogLike, Long> {
    Optional<BlogLike> findByUserAndBlog(User user, Blog blog);
} 