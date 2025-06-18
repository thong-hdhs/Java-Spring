package com.hivapp.courseuth.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.hivapp.courseuth.domain.Blog;

@Repository
public interface BlogRepository extends JpaRepository<Blog, Long>, JpaSpecificationExecutor<Blog> {
    // Có thể thêm các phương thức tìm kiếm tùy chỉnh ở đây
    @Query("SELECT COUNT(b) FROM Blog b WHERE b.user.id = ?1")
    Long countByUserId(Long userId);
} 