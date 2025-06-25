package com.hivapp.courseuth.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.hivapp.courseuth.domain.BlogActivity;

@Repository
public interface BlogActivityRepository extends JpaRepository<BlogActivity, Long> {
    BlogActivity findByUserId(Long userId);

    @Query("SELECT SUM(ba.total_likes) FROM BlogActivity ba WHERE ba.user.id = ?1")
    Number sumTotalLikesByUserId(Long userId);

    @Query("SELECT SUM(ba.total_views) FROM BlogActivity ba WHERE ba.user.id = ?1")
    Number sumTotalViewsByUserId(Long userId);

    @Query("SELECT COUNT(ba) FROM BlogActivity ba WHERE ba.user.id = ?1")
    Long countBlogsByUserId(Long userId);
    
    // Xóa tất cả activity của một user
    @Modifying
    @Query("DELETE FROM BlogActivity ba WHERE ba.user.id = :userId")
    void deleteByUserId(@Param("userId") Long userId);
} 