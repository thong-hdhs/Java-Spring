package com.hivapp.courseuth.controller;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hivapp.courseuth.domain.Blog;
import com.hivapp.courseuth.domain.BlogActivity;
import com.hivapp.courseuth.domain.RestResponse;
import com.hivapp.courseuth.domain.User;
import com.hivapp.courseuth.domain.dto.BlogDTO;
import com.hivapp.courseuth.domain.dto.Meta;
import com.hivapp.courseuth.domain.dto.MiniBlogDTO;
import com.hivapp.courseuth.domain.dto.ResBlogActivityDTO;
import com.hivapp.courseuth.domain.dto.ResBlogDTO;
import com.hivapp.courseuth.domain.dto.ResUserDTO;
import com.hivapp.courseuth.domain.dto.ResultPaginationDTO;
import com.hivapp.courseuth.domain.dto.SearchBlogDTO;
import com.hivapp.courseuth.service.BlogService;
import com.hivapp.courseuth.service.UserService;
import com.hivapp.courseuth.util.SecurityUtil;
import com.turkraft.springfilter.boot.Filter;

@RestController
@RequestMapping("/api/blogs")
public class BlogController {

    @Autowired
    private BlogService blogService;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserService userService;

    @GetMapping
    public ResultPaginationDTO getAllBlogs(@RequestParam("current") Optional<String> currentOptional, @RequestParam("pageSize") Optional<String> pageSizeOptional) {
        // Lấy current và pageSize
        String sCurrent = currentOptional.isPresent() ? currentOptional.get() : "";
        String sPageSize = pageSizeOptional.isPresent() ? pageSizeOptional.get() : "";
        int current = Integer.parseInt(sCurrent);
        int pageSize = Integer.parseInt(sPageSize);
        Pageable pageable = PageRequest.of(current - 1, pageSize);
        return blogService.getAllBlogs(pageable);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RestResponse<ResBlogDTO>> getBlogById(@PathVariable Long id) {
        return blogService.getBlogById(id)
                .map(blog -> {
                    ResBlogDTO resBlog = new ResBlogDTO();
                    resBlog.setId(blog.getId());
                    resBlog.setTitle(blog.getTitle());
                    resBlog.setBanner(blog.getBanner());
                    resBlog.setDes(blog.getDes());
                    resBlog.setContent(blog.getContent());
                    resBlog.setTags(blog.getTags());
                    resBlog.setPublished_at(blog.getPublished_at());
                    if (blog.getBlogActivity() != null) {
                        BlogActivity activity = blog.getBlogActivity();
                        ResBlogActivityDTO activityDTO = new ResBlogActivityDTO();
                        activityDTO.setId(activity.getId());
                        activityDTO.setTotal_likes(activity.getTotal_likes());
                        activityDTO.setTotal_comments(activity.getTotal_comments());
                        activityDTO.setTotal_views(activity.getTotal_views());
                        activityDTO.setTotal_parent_comments(activity.getTotal_parent_comments());
                        resBlog.setBlogActivity(activityDTO);
                    }
                    if (blog.getUser() != null) {
                        ResUserDTO resUser = userService.convertToResUserDTO(blog.getUser());
                        resBlog.setUser(resUser);
                    }
                    RestResponse<ResBlogDTO> response = new RestResponse<>();
                    response.setStatusCode(200);
                    response.setError(null);
                    response.setMessage("Call API Success");
                    response.setData(resBlog);
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public RestResponse<ResBlogDTO> createBlog(@RequestBody BlogDTO blogDTO) throws IOException {
        Blog blog = new Blog();
        blog.setTitle(blogDTO.getTitle());
        blog.setBanner(blogDTO.getBanner());
        blog.setDes(blogDTO.getDes());
        blog.setContent(objectMapper.writeValueAsString(blogDTO.getContent()));
        blog.setTags(blogDTO.getTags());
        // Lấy user từ JWT
        String email = SecurityUtil.getCurrentUserLogin().orElse(null);
        User user = userService.handleGetUserByEmail(email);
        blog.setUser(user);
        Blog savedBlog = blogService.createBlog(blog);
        // Map sang ResBlogDTO
        ResBlogDTO resBlog = new ResBlogDTO();
        resBlog.setId(savedBlog.getId());
        resBlog.setTitle(savedBlog.getTitle());
        resBlog.setBanner(savedBlog.getBanner());
        resBlog.setDes(savedBlog.getDes());
        resBlog.setContent(savedBlog.getContent());
        resBlog.setTags(savedBlog.getTags());
        resBlog.setPublished_at(savedBlog.getPublished_at());
        if (savedBlog.getBlogActivity() != null) {
            BlogActivity activity = savedBlog.getBlogActivity();
            ResBlogActivityDTO activityDTO = new ResBlogActivityDTO();
            activityDTO.setId(activity.getId());
            activityDTO.setTotal_likes(activity.getTotal_likes());
            activityDTO.setTotal_comments(activity.getTotal_comments());
            activityDTO.setTotal_views(activity.getTotal_views());
            activityDTO.setTotal_parent_comments(activity.getTotal_parent_comments());
            resBlog.setBlogActivity(activityDTO);
        }
        resBlog.setUser(userService.convertToResUserDTO(user));
        RestResponse<ResBlogDTO> response = new RestResponse<>();
        response.setStatusCode(200);
        response.setError(null);
        response.setMessage("Call API Success");
        response.setData(resBlog);
        return response;
    }

    @PutMapping("/{id}")
    public ResponseEntity<Blog> updateBlog(@PathVariable Long id, @RequestBody BlogDTO blogDTO) throws IOException {
        try {
            Blog blog = new Blog();
            blog.setTitle(blogDTO.getTitle());
            blog.setBanner(blogDTO.getBanner());
            blog.setDes(blogDTO.getDes());
            blog.setContent(objectMapper.writeValueAsString(blogDTO.getContent()));
            blog.setTags(blogDTO.getTags());
            Blog updatedBlog = blogService.updateBlog(id, blog);
            return ResponseEntity.ok(updatedBlog);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBlog(@PathVariable Long id) {
        try {
            blogService.deleteBlog(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Helper method để tạo ResultPaginationDTO
    private ResultPaginationDTO createResultPaginationDTO(List<?> content, Pageable pageable, long total) {
        ResultPaginationDTO resultPaginationDTO = new ResultPaginationDTO();
        Meta meta = new Meta();
        meta.setPage(pageable.getPageNumber() + 1);
        meta.setPageSize(pageable.getPageSize());
        meta.setTotal(total);
        meta.setPages((int) Math.ceil((double) total / pageable.getPageSize()));
        resultPaginationDTO.setMeta(meta);
        resultPaginationDTO.setResult(content);
        return resultPaginationDTO;
    }

    @GetMapping("/latest-blogs")
    public ResponseEntity<RestResponse<ResultPaginationDTO>> getLastedBlogs(Pageable pageable) {
        ResultPaginationDTO resultPaginationDTO = blogService.getAllBlogs(pageable);
        List<MiniBlogDTO> lastedBlogs = ((List<Blog>) resultPaginationDTO.getResult()).stream()
            .map(MiniBlogDTO::fromBlog)
            .sorted((b1, b2) -> b2.getPublished_at().compareTo(b1.getPublished_at()))
            .collect(Collectors.toList());

        ResultPaginationDTO responseDTO = createResultPaginationDTO(lastedBlogs, pageable, resultPaginationDTO.getMeta().getTotal());
        RestResponse<ResultPaginationDTO> response = new RestResponse<>();
        response.setStatusCode(200);
        response.setError(null);
        response.setMessage("Call API Success");
        response.setData(responseDTO);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/trending-blogs")
    public ResponseEntity<RestResponse<ResultPaginationDTO>> getTrendingBlogs(Pageable pageable) {
        ResultPaginationDTO resultPaginationDTO = blogService.getAllBlogs(pageable);
        List<MiniBlogDTO> trendingBlogs = ((List<Blog>) resultPaginationDTO.getResult()).stream()
            .map(MiniBlogDTO::fromBlog)
            .sorted((b1, b2) -> {
                int cmp = Integer.compare(
                    b2.getActivity() != null && b2.getActivity().getTotal_reads() != null ? b2.getActivity().getTotal_reads().intValue() : 0,
                    b1.getActivity() != null && b1.getActivity().getTotal_reads() != null ? b1.getActivity().getTotal_reads().intValue() : 0
                );
                if (cmp == 0) {
                    cmp = Integer.compare(
                        b2.getActivity() != null && b2.getActivity().getTotal_likes() != null ? b2.getActivity().getTotal_likes().intValue() : 0,
                        b1.getActivity() != null && b1.getActivity().getTotal_likes() != null ? b1.getActivity().getTotal_likes().intValue() : 0
                    );
                }
                if (cmp == 0) {
                    if (b2.getPublished_at() != null && b1.getPublished_at() != null) {
                        cmp = b2.getPublished_at().compareTo(b1.getPublished_at());
                    }
                }
                return cmp;
            })
            .collect(Collectors.toList());

        ResultPaginationDTO responseDTO = createResultPaginationDTO(trendingBlogs, pageable, resultPaginationDTO.getMeta().getTotal());
        RestResponse<ResultPaginationDTO> response = new RestResponse<>();
        response.setStatusCode(200);
        response.setError(null);
        response.setMessage("Call API Success");
        response.setData(responseDTO);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/search-tags")
    public ResponseEntity<RestResponse<ResultPaginationDTO>> searchBlogs(
        @RequestBody SearchBlogDTO searchDTO,
        Pageable pageable
    ) {
        ResultPaginationDTO resultPaginationDTO = blogService.getAllBlogs(pageable);
        List<MiniBlogDTO> searchResults = ((List<Blog>) resultPaginationDTO.getResult()).stream()
            .filter(blog -> blog.getTags() != null && blog.getTags().contains(searchDTO.getTag()))
            .map(MiniBlogDTO::fromBlog)
            .sorted((b1, b2) -> {
                int cmp = Integer.compare(
                    b2.getActivity() != null && b2.getActivity().getTotal_reads() != null ? b2.getActivity().getTotal_reads().intValue() : 0,
                    b1.getActivity() != null && b1.getActivity().getTotal_reads() != null ? b1.getActivity().getTotal_reads().intValue() : 0
                );
                if (cmp == 0) {
                    cmp = Integer.compare(
                        b2.getActivity() != null && b2.getActivity().getTotal_likes() != null ? b2.getActivity().getTotal_likes().intValue() : 0,
                        b1.getActivity() != null && b1.getActivity().getTotal_likes() != null ? b1.getActivity().getTotal_likes().intValue() : 0
                    );
                }
                if (cmp == 0) {
                    if (b2.getPublished_at() != null && b1.getPublished_at() != null) {
                        cmp = b2.getPublished_at().compareTo(b1.getPublished_at());
                    }
                }
                return cmp;
            })
            .collect(Collectors.toList());

        ResultPaginationDTO responseDTO = createResultPaginationDTO(searchResults, pageable, searchResults.size());
        RestResponse<ResultPaginationDTO> response = new RestResponse<>();
        response.setStatusCode(200);
        response.setError(null);
        response.setMessage("Call API Success");
        response.setData(responseDTO);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/search-blogs")
    public ResponseEntity<RestResponse<ResultPaginationDTO>> searchBlogsByFilter(
        @Filter Specification<Blog> spec,
        Pageable pageable
    ) {
        // Lấy danh sách blog theo filter và phân trang
        Page<Blog> page = blogService.findAllBySpecification(spec, pageable);
        List<MiniBlogDTO> blogs = page.getContent().stream()
            .map(MiniBlogDTO::fromBlog)
            .collect(Collectors.toList());
        ResultPaginationDTO responseDTO = createResultPaginationDTO(blogs, pageable, page.getTotalElements());
        RestResponse<ResultPaginationDTO> response = new RestResponse<>();
        response.setStatusCode(200);
        response.setError(null);
        response.setMessage("Call API Success");
        response.setData(responseDTO);
        return ResponseEntity.ok(response);
    }
} 