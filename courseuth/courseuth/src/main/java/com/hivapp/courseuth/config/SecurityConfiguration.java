package com.hivapp.courseuth.config;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.oauth2.server.resource.web.BearerTokenAuthenticationEntryPoint;
import org.springframework.security.oauth2.server.resource.web.access.BearerTokenAccessDeniedHandler;
import org.springframework.security.web.SecurityFilterChain;

import com.hivapp.courseuth.domain.User;
import com.hivapp.courseuth.domain.dto.ResLoginDTO;
import com.hivapp.courseuth.service.CustomOAuth2UserService;
import com.hivapp.courseuth.service.UserService;
import com.hivapp.courseuth.util.SecurityUtil;
import com.nimbusds.jose.jwk.source.ImmutableSecret;
import com.nimbusds.jose.util.Base64;

@Configuration
@EnableMethodSecurity(securedEnabled = true)
public class SecurityConfiguration {

    @Value("${hivapp.jwt.secret}")
    private String jwtKey;

    @Value("${hivapp.jwt.refresh-token.expiration}")
    private long refreshExpiration;

    private final CustomOAuth2UserService customOAuth2UserService;

    public SecurityConfiguration(CustomOAuth2UserService customOAuth2UserService) {
        this.customOAuth2UserService = customOAuth2UserService;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, CustomAuthenticationEntryPoint customAuthenticationEntryPoint, CustomOAuth2UserService customOAuth2UserService, CustomOAuth2SuccessHandler customOAuth2SuccessHandler, UserService userService, SecurityUtil securityUtil) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(Customizer.withDefaults())
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/auth/login", "/auth/refresh", "/auth/register", "/auth/google", "/auth/google/callback", "/").permitAll()
                .anyRequest().authenticated()
            )
            .oauth2Login(oauth2 -> oauth2
                .successHandler((request, response, authentication) -> {
                    // Lấy thông tin user từ authentication
                    OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
                    String email = oauth2User.getAttribute("email");
                    String fullName = oauth2User.getAttribute("name");

                    // Tìm hoặc tạo user
                    User existingUser = userService.handleGetUserByEmail(email);
                    if (existingUser == null) {
                        User newUser = new User();
                        newUser.setEmail(email);
                        newUser.setFullName(fullName);
                        newUser.setRole(com.hivapp.courseuth.util.constant.RoleEnum.MEMBER);
                        newUser.setPassword(passwordEncoder().encode(java.util.UUID.randomUUID().toString()));
                        existingUser = userService.handleCreateUser(newUser);
                    }

                    // Tạo response
                    ResLoginDTO res = new ResLoginDTO();
                    ResLoginDTO.UserLogin userLogin = res.new UserLogin(
                        existingUser.getId(),
                        existingUser.getFullName(),
                        existingUser.getEmail()
                    );
                    res.setUser(userLogin);

                    // Tạo access token
                    Authentication auth = new UsernamePasswordAuthenticationToken(email, null);
                    String access_token = securityUtil.createAccessToken(auth, res.getUser());
                    res.setAccessToken(access_token);

                    // Tạo refresh token
                    String refresh_token = securityUtil.createRefreshToken(email, res);
                    userService.updateUserToken(refresh_token, email);

                    // Set cookie
                    ResponseCookie resCookies = ResponseCookie.from("refresh_token", refresh_token)
                            .httpOnly(true)
                            .secure(false)
                            .path("/")
                            .maxAge(refreshExpiration)
                            .build();
                    response.addHeader(HttpHeaders.SET_COOKIE, resCookies.toString());

                    // Redirect về frontend với token trong URL
                    String frontendUrl = "http://localhost:5173"; // URL frontend React/Vite thường chạy trên port 5173
                    String redirectUrl = frontendUrl + "?access_token=" + access_token + 
                                       "&user_id=" + existingUser.getId() + 
                                       "&user_name=" + java.net.URLEncoder.encode(existingUser.getFullName(), "UTF-8") + 
                                       "&user_email=" + existingUser.getEmail();
                    response.sendRedirect(redirectUrl);
                })
                .userInfoEndpoint(userInfo -> userInfo
                    .userService(customOAuth2UserService)
                )
            )
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(Customizer.withDefaults())
                .authenticationEntryPoint(customAuthenticationEntryPoint)
            )
            .exceptionHandling(exception -> exception
                .authenticationEntryPoint(new BearerTokenAuthenticationEntryPoint())
                .accessDeniedHandler(new BearerTokenAccessDeniedHandler())
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
            );

        return http.build();
    }

    @Bean
    public JwtEncoder jwtEncoder() {
        return new NimbusJwtEncoder(new ImmutableSecret<>(getSecretKey()));
    }

    @Bean
    public JwtDecoder jwtDecoder() {
        NimbusJwtDecoder jwtDecoder = NimbusJwtDecoder.withSecretKey(getSecretKey())
            .macAlgorithm(SecurityUtil.JWT_ALGORITHM)
            .build();
        return token -> {
            try {
                return jwtDecoder.decode(token);
            } catch (Exception e) {
                throw new RuntimeException("Invalid JWT token: " + e.getMessage());
            }
        };
    }

    private SecretKey getSecretKey() {
        byte[] keyBytes = Base64.from(jwtKey).decode();
        return new SecretKeySpec(keyBytes, 0, keyBytes.length, SecurityUtil.JWT_ALGORITHM.getName());
    }

    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter grantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
        grantedAuthoritiesConverter.setAuthorityPrefix("");
        grantedAuthoritiesConverter.setAuthoritiesClaimName("permissions");

        JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(grantedAuthoritiesConverter);
        return jwtAuthenticationConverter;
    }
}