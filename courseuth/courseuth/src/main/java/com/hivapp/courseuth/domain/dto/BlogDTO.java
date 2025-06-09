// DTO dùng để nhận dữ liệu từ client
package com.hivapp.courseuth.domain.dto;

import java.util.List;
import java.util.Map;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BlogDTO {
    private String title;
    private String banner;
    private String des;
    private Map<String, Object> content;
    private List<String> tags;
} 