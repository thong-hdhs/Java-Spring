package com.hivapp.courseuth.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hivapp.courseuth.domain.User;
import com.hivapp.courseuth.domain.dto.GetUserProfileDTO;
import com.hivapp.courseuth.domain.dto.Meta;
import com.hivapp.courseuth.domain.dto.ResCreateUserDTO;
import com.hivapp.courseuth.domain.dto.ResUpdateUserDTO;
import com.hivapp.courseuth.domain.dto.ResUserDTO;
import com.hivapp.courseuth.domain.dto.ResultPaginationDTO;
import com.hivapp.courseuth.repository.BlogActivityRepository;
import com.hivapp.courseuth.repository.BlogRepository;
import com.hivapp.courseuth.service.UserService;
import com.hivapp.courseuth.service.error.IdInvalidException;
import com.hivapp.courseuth.util.anotation.ApiMessage;
import com.turkraft.springfilter.boot.Filter;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
public class UserController {
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final BlogActivityRepository blogActivityRepository;
    private final BlogRepository blogRepository;

    public UserController(UserService userService, PasswordEncoder passwordEncoder, 
            BlogActivityRepository blogActivityRepository, BlogRepository blogRepository) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.blogActivityRepository = blogActivityRepository;
        this.blogRepository = blogRepository;
    }

    @PostMapping("/users")
    @ApiMessage("Create a new user")
    public ResponseEntity<ResCreateUserDTO> createNewUser(@Valid @RequestBody User postManUser)
            throws IdInvalidException {
        boolean isEmailExist = this.userService.isEmailExit(postManUser.getEmail());
        if (isEmailExist) {
            throw new IdInvalidException(
                    "Email " + postManUser.getEmail() + " đã tồn tại, vui lòng sử dụng email khác.");
        }

        String hashPassword = this.passwordEncoder.encode(postManUser.getPassword());
        postManUser.setPassword(hashPassword);
        User ericUser = this.userService.handleCreateUser(postManUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(this.userService.convertToResCreateUserDTO(ericUser));
    }

    @DeleteMapping("/users/{id}")
    @ApiMessage("Delete a user")
    public ResponseEntity<Void> deleteUser(@PathVariable("id") Long id)
            throws IdInvalidException {
        User currentUser = this.userService.fetchUserById(id);
        if (currentUser == null) {
            throw new IdInvalidException("User với id = " + id + " không tồn tại");
        }

        this.userService.handleDeleteUser(id);
        return ResponseEntity.ok(null);
    }

    @GetMapping("/users/{id}")
    @ApiMessage("fetch user profile by id")
    public ResponseEntity<GetUserProfileDTO> getUserById(@PathVariable("id") Long id) throws IdInvalidException {
        User fetchUser = this.userService.fetchUserById(id);
        if (fetchUser == null) {
            throw new IdInvalidException("User với id = " + id + " không tồn tại");
        }

        GetUserProfileDTO profileDTO = new GetUserProfileDTO();
        profileDTO.setUserInfo(this.userService.convertToResUserDTO(fetchUser));

        // Lấy thông tin hoạt động blog của user
        Number totalLikes = blogActivityRepository.sumTotalLikesByUserId(id);
        Number totalViews = blogActivityRepository.sumTotalViewsByUserId(id);
        Long totalPosts = blogRepository.countByUserId(id);
        Long totalActivities = blogActivityRepository.countBlogsByUserId(id);

        profileDTO.setTotalLikes(totalLikes != null ? totalLikes.longValue() : 0L);
        profileDTO.setTotalViews(totalViews != null ? totalViews.longValue() : 0L);
        profileDTO.setTotalPosts(totalPosts != null ? totalPosts : 0L);
        profileDTO.setTotalActivities(totalActivities != null ? totalActivities : 0L);

        return ResponseEntity.status(HttpStatus.OK).body(profileDTO);
    }

    @GetMapping("/users")
    @ApiMessage("fetch all users")
    public ResponseEntity<ResultPaginationDTO> getAllUser(
            @Filter Specification<User> spec,
            Pageable pageable) {
        return ResponseEntity.status(HttpStatus.OK).body(
                this.userService.fetchAllUser(spec, pageable));
    }

    @PutMapping("/users")
    @ApiMessage("Update a user")
    public ResponseEntity<ResUpdateUserDTO> updateUser(@Valid @RequestBody User user) throws IdInvalidException {
        User ericUser = this.userService.handleUpdateUser(user);
        if (ericUser == null) {
            throw new IdInvalidException("User với id = " + user.getId() + " không tồn tại");
        }
        return ResponseEntity.ok(this.userService.convertToResUpdateUserDTO(ericUser));
    }

    @GetMapping("/search-users")
    @ApiMessage("search users with filter and pagination")
    public ResponseEntity<ResultPaginationDTO> searchUsers(
            @Filter Specification<User> spec,
            Pageable pageable) {
        // Lấy danh sách user theo filter và phân trang
        ResultPaginationDTO rs = new ResultPaginationDTO();
        Page<User> pageUser = this.userService.findAllBySpecification(spec, pageable);
        List<ResUserDTO> result = pageUser.getContent().stream()
                .map(this.userService::convertToResUserDTO)
                .collect(Collectors.toList());
        Meta meta = new Meta();
        meta.setPage(pageable.getPageNumber() + 1);
        meta.setPageSize(pageable.getPageSize());
        meta.setPages(pageUser.getTotalPages());
        meta.setTotal(pageUser.getTotalElements());
        rs.setMeta(meta);
        rs.setResult(result);
        return ResponseEntity.ok(rs);
    }
}
