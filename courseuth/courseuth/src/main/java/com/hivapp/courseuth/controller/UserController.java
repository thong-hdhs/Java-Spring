package com.hivapp.courseuth.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
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
import com.hivapp.courseuth.domain.dto.ResLoginDTO;
import com.hivapp.courseuth.domain.dto.ResUpdateUserDTO;
import com.hivapp.courseuth.domain.dto.ResUserDTO;
import com.hivapp.courseuth.domain.dto.ResetPasswordDTO;
import com.hivapp.courseuth.domain.dto.ResultPaginationDTO;
import com.hivapp.courseuth.domain.dto.UpdateUserDTO;
import com.hivapp.courseuth.repository.BlogActivityRepository;
import com.hivapp.courseuth.repository.BlogRepository;
import com.hivapp.courseuth.service.UserService;
import com.hivapp.courseuth.service.error.IdInvalidException;
import com.hivapp.courseuth.util.SecurityUtil;
import com.hivapp.courseuth.util.anotation.ApiMessage;
import com.hivapp.courseuth.util.constant.RoleEnum;
import com.turkraft.springfilter.boot.Filter;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
public class UserController {
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final BlogActivityRepository blogActivityRepository;
    private final BlogRepository blogRepository;
    private final SecurityUtil securityUtil;

    public UserController(UserService userService, PasswordEncoder passwordEncoder, 
            BlogActivityRepository blogActivityRepository, BlogRepository blogRepository, SecurityUtil securityUtil) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.blogActivityRepository = blogActivityRepository;
        this.blogRepository = blogRepository;
        this.securityUtil = securityUtil;
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
    public ResponseEntity<Map<String, String>> deleteUser(@PathVariable("id") Long id)
            throws IdInvalidException {
        User currentUser = this.userService.fetchUserById(id);
        if (currentUser == null) {
            throw new IdInvalidException("User với id = " + id + " không tồn tại");
        }

        try {
            this.userService.handleDeleteUser(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Xóa user và tất cả dữ liệu liên quan thành công");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            throw new IdInvalidException("Lỗi khi xóa user: " + e.getMessage());
        }
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
        Long totalPosts = blogRepository.countByUserId(id);
        Long totalActivities = blogActivityRepository.countBlogsByUserId(id);

        profileDTO.setTotalLikes(totalLikes != null ? totalLikes.longValue() : 0L);
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

    @PutMapping("/users/{id}")
    @ApiMessage("Update a user")
    public ResponseEntity<ResUpdateUserDTO> updateUser(
            @PathVariable("id") Long id,
            @Valid @RequestBody UpdateUserDTO userUpdateDTO) throws IdInvalidException {
        User user = userService.fetchUserById(id);
        if (user == null) {
            throw new IdInvalidException("User với id = " + id + " không tồn tại");
        }
        // Chỉ cập nhật các trường cho phép
        user.setFullName(userUpdateDTO.getFullName());
        user.setPhoneNumber(userUpdateDTO.getPhoneNumber());
        user.setAge(userUpdateDTO.getAge());
        user.setGender(userUpdateDTO.getGender());
        user.setAddress(userUpdateDTO.getAddress());
        // KHÔNG cập nhật password, createAt, role, ...
        User updatedUser = userService.handleUpdateUser(user);
        return ResponseEntity.ok(userService.convertToResUpdateUserDTO(updatedUser));
    }

    @PutMapping("/users/{id}/role")
    @ApiMessage("Update user role")
    public ResponseEntity<ResUserDTO> updateUserRole(
            @PathVariable("id") Long id,
            @RequestBody Map<String, String> payload) throws IdInvalidException {
        String roleString = payload.get("role");
        if (roleString == null || roleString.isEmpty()) {
            throw new IdInvalidException("Role cannot be empty");
        }
        try {
            RoleEnum newRole = RoleEnum.valueOf(roleString.toUpperCase());
            User updatedUser = userService.updateUserRole(id, newRole);
            return ResponseEntity.ok(userService.convertToResUserDTO(updatedUser));
        } catch (IllegalArgumentException e) {
            throw new IdInvalidException("Invalid role: " + roleString);
        }
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

    @PutMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordDTO resetPasswordDTO) {
        // Lấy user theo email
        User user = userService.handleGetUserByEmail(resetPasswordDTO.getEmail());
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy tài khoản!");
        }

        // Kiểm tra nếu user đăng nhập bằng Google (không có trường provider nên kiểm tra password null hoặc rỗng)
        if (user.getPassword() == null || user.getPassword().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("Tài khoản bạn đăng nhập bằng Google, không thể thay đổi!");
        }

        // Kiểm tra mật khẩu hiện tại
        if (!passwordEncoder.matches(resetPasswordDTO.getCurrPass(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("Mật khẩu hiện tại không đúng!");
        }

        // Cập nhật mật khẩu mới
        user.setPassword(passwordEncoder.encode(resetPasswordDTO.getNewPass()));
        userService.handleUpdateUser(user);

        // Tạo accessToken mới (dùng SecurityUtil)
        ResUserDTO resUserDTO = userService.convertToResUserDTO(user);
        // Tạo ResLoginDTO.UserLogin để truyền vào createAccessToken
        ResLoginDTO resLoginDTO = new ResLoginDTO();
        ResLoginDTO.UserLogin userLogin = resLoginDTO.new UserLogin(
            user.getId(), user.getFullName(), user.getEmail(), user.getRole()
        );
        // Authentication cho accessToken
        Authentication authentication = new UsernamePasswordAuthenticationToken(user.getEmail(), null);
        String accessToken = securityUtil.createAccessToken(authentication, userLogin);

        Map<String, Object> response = new HashMap<>();
        response.put("user", resUserDTO);
        response.put("accessToken", accessToken);
        return ResponseEntity.ok(response);
    }
}
