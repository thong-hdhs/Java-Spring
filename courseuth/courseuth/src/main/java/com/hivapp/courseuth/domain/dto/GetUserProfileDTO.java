package com.hivapp.courseuth.domain.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GetUserProfileDTO {
    private ResUserDTO userInfo;
    private Long totalPosts;        // Tổng số bài viết (Blog)
    private Long totalActivities;   // Tổng số hoạt động (BlogActivity)
    private Long totalLikes;
    private Long totalViews;
} 