package com.hivapp.courseuth.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.hivapp.courseuth.domain.Blog;

@Repository
public interface BlogRepository extends JpaRepository<Blog, Long>, JpaSpecificationExecutor<Blog> {
    // Có thể thêm các phương thức tìm kiếm tùy chỉnh ở đây
    @Query("SELECT COUNT(b) FROM Blog b WHERE b.user.id = ?1")
    Long countByUserId(Long userId);
    
    // Tìm tất cả blog của một user
    List<Blog> findByUserId(Long userId);
    
    // Xóa tất cả blog của một user
    @Modifying
    @Query("DELETE FROM Blog b WHERE b.user.id = :userId")
    void deleteByUserId(@Param("userId") Long userId);
} 