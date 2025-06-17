package com.hivapp.courseuth.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.hivapp.courseuth.domain.User;
import com.hivapp.courseuth.domain.dto.Meta;
import com.hivapp.courseuth.domain.dto.ResCreateUserDTO;
import com.hivapp.courseuth.domain.dto.ResUpdateUserDTO;
import com.hivapp.courseuth.domain.dto.ResUserDTO;
import com.hivapp.courseuth.domain.dto.ResultPaginationDTO;
import com.hivapp.courseuth.repository.UserRepository;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
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

    public void handleDeleteUser(Long id) {
        this.userRepository.deleteById(id);
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
