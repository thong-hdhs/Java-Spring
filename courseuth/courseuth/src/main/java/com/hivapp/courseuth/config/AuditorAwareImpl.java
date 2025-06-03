package com.hivapp.courseuth.config;

import java.util.Optional;

import org.springframework.data.domain.AuditorAware;
import org.springframework.stereotype.Component;

import com.hivapp.courseuth.util.SecurityUtil;

@Component
public class AuditorAwareImpl implements AuditorAware<String> {
    @Override
    public Optional<String> getCurrentAuditor() {
        return SecurityUtil.getCurrentUserLogin();
    }
} 