package com.hivapp.courseuth.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hivapp.courseuth.domain.BlogActivity;

@Repository
public interface BlogActivityRepository extends JpaRepository<BlogActivity, Long> {
    // Có thể thêm các phương thức tìm kiếm tùy chỉnh ở đây
} 