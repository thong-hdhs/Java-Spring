package com.hivapp.courseuth.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hivapp.courseuth.domain.Blog;

@Repository
public interface BlogRepository extends JpaRepository<Blog, Long> {
    // Có thể thêm các phương thức tìm kiếm tùy chỉnh ở đây
} 