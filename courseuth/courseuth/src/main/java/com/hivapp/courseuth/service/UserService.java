package com.hivapp.courseuth.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hivapp.courseuth.domain.Blog;
import com.hivapp.courseuth.domain.User;
import com.hivapp.courseuth.domain.dto.Meta;
import com.hivapp.courseuth.domain.dto.ResCreateUserDTO;
import com.hivapp.courseuth.domain.dto.ResUpdateUserDTO;
import com.hivapp.courseuth.domain.dto.ResUserDTO;
import com.hivapp.courseuth.domain.dto.ResultPaginationDTO;
import com.hivapp.courseuth.repository.BlogActivityRepository;
import com.hivapp.courseuth.repository.BlogLikeRepository;
import com.hivapp.courseuth.repository.BlogRepository;
import com.hivapp.courseuth.repository.UserRepository;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final BlogRepository blogRepository;
    private final BlogLikeRepository blogLikeRepository;
    private final BlogActivityRepository blogActivityRepository;

    public UserService(UserRepository userRepository, BlogRepository blogRepository, 
                      BlogLikeRepository blogLikeRepository, BlogActivityRepository blogActivityRepository) {
        this.userRepository = userRepository;
        this.blogRepository = blogRepository;
        this.blogLikeRepository = blogLikeRepository;
        this.blogActivityRepository = blogActivityRepository;
    }

    public User handleCreateUser(User user) {
        return this.userRepository.save(user);
    }

    public User handleGetUserByEmail(String email) {
        return this.userRepository.findByEmail(email);
    }

    public boolean isEmailExit(String email) {
        return this.userRepository.existsByEmail(email);
    }

    public ResultPaginationDTO fetchAllUser(Specification<User> spec, Pageable pageable) {
        Page<User> pageUser = this.userRepository.findAll(spec, pageable);
        ResultPaginationDTO rs = new ResultPaginationDTO();
        Meta mt = new Meta();

        mt.setPage(pageable.getPageNumber() + 1);
        mt.setPageSize(pageable.getPageSize());
        mt.setPages(pageUser.getTotalPages());
        mt.setTotal(pageUser.getTotalElements());

        rs.setMeta(mt);

        List<ResUserDTO> listUser = pageUser.getContent()
                .stream().map(item -> this.convertToResUserDTO(item))
                .collect(Collectors.toList());

        rs.setResult(listUser);

        return rs;
    }

    public User fetchUserById(Long id) {
        return this.userRepository.findById(id).orElse(null);
    }

    public User handleUpdateUser(User user) {
        Optional<User> existingUser = this.userRepository.findById(user.getId());
        if (existingUser.isPresent()) {
            return this.userRepository.save(user);
        }
        return null;
    }

    @Transactional
    public void handleDeleteUser(Long id) {
        // Lấy user cần xóa
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        // 1. Xóa tất cả BlogLike của user này
        blogLikeRepository.deleteByUserId(id);

        // 2. Xóa tất cả BlogActivity của user này
        blogActivityRepository.deleteByUserId(id);

        // 3. Xóa tất cả Blog của user này (cùng với BlogActivity liên quan)
        List<Blog> userBlogs = blogRepository.findByUserId(id);
        
        for (Blog blog : userBlogs) {
            // Xóa tất cả like của blog này
            blogLikeRepository.deleteByBlogId(blog.getId());
            
            // Xóa blog (BlogActivity sẽ được xóa tự động do cascade)
            blogRepository.delete(blog);
        }

        // 4. Cuối cùng xóa User
        userRepository.delete(user);
    }

    public ResUserDTO convertToResUserDTO(User user) {
        ResUserDTO dto = new ResUserDTO();
        dto.setId(user.getId());
        dto.setFullName(user.getFullName());
        dto.setEmail(user.getEmail());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setAge(user.getAge());
        dto.setGender(user.getGender());
        dto.setAddress(user.getAddress());
        dto.setRole(user.getRole());
        dto.setCreateAt(user.getCreateAt());
        dto.setUpdateAt(user.getUpdateAt());
        dto.setCreateBy(user.getCreateBy());
        dto.setUpdateBy(user.getUpdateBy());
        return dto;
    }

    public ResCreateUserDTO convertToResCreateUserDTO(User user) {
        ResCreateUserDTO dto = new ResCreateUserDTO();
        dto.setId(user.getId());
        dto.setFullName(user.getFullName());
        dto.setEmail(user.getEmail());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setAge(user.getAge());
        dto.setGender(user.getGender());
        dto.setAddress(user.getAddress());
        dto.setCreateAt(user.getCreateAt());
        return dto;
    }

    public ResUpdateUserDTO convertToResUpdateUserDTO(User user) {
        ResUpdateUserDTO dto = new ResUpdateUserDTO();
        dto.setId(user.getId());
        dto.setFullName(user.getFullName());
        dto.setEmail(user.getEmail());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setAge(user.getAge());
        dto.setGender(user.getGender());
        dto.setAddress(user.getAddress());
        dto.setUpdateAt(user.getUpdateAt());
        dto.setUpdateBy(user.getUpdateBy());
        return dto;
    }

    public void updateUserToken(String refreshToken, String email) {
        User user = this.userRepository.findByEmail(email);
        if (user != null) {
            user.setRefreshToken(refreshToken);
            this.userRepository.save(user);
        }
    }

    public User getUserByRefreshTokenAndEmail(String refreshToken, String email) {
        return this.userRepository.findByRefreshTokenAndEmail(refreshToken, email);
    }

    public Page<User> findAllBySpecification(Specification<User> spec, Pageable pageable) {
        return this.userRepository.findAll(spec, pageable);
    }
}
