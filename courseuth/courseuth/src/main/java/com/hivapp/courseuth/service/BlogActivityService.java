package com.hivapp.courseuth.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hivapp.courseuth.domain.BlogActivity;
import com.hivapp.courseuth.repository.BlogActivityRepository;

@Service
public class BlogActivityService {
    
    @Autowired
    private BlogActivityRepository blogActivityRepository;

    public Optional<BlogActivity> getBlogActivityById(Long id) {
        return blogActivityRepository.findById(id);
    }

    @Transactional
    public BlogActivity updateLikes(Long id, int increment) {
        BlogActivity activity = blogActivityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("BlogActivity not found with id: " + id));
        
        activity.setTotal_likes(activity.getTotal_likes() + increment);
        return blogActivityRepository.save(activity);
    }

    @Transactional
    public BlogActivity updateComments(Long id, int increment) {
        BlogActivity activity = blogActivityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("BlogActivity not found with id: " + id));
        
        activity.setTotal_comments(activity.getTotal_comments() + increment);
        return blogActivityRepository.save(activity);
    }

    @Transactional
    public BlogActivity updateViews(Long id, int increment) {
        BlogActivity activity = blogActivityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("BlogActivity not found with id: " + id));
        
        activity.setTotal_views(activity.getTotal_views() + increment);
        return blogActivityRepository.save(activity);
    }

    @Transactional
    public BlogActivity updateParentComments(Long id, int increment) {
        BlogActivity activity = blogActivityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("BlogActivity not found with id: " + id));
        
        activity.setTotal_parent_comments(activity.getTotal_parent_comments() + increment);
        return blogActivityRepository.save(activity);
    }
} 