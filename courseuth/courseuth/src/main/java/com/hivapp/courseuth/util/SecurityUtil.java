package com.hivapp.courseuth.util;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;


@Service
public class SecurityUtil {

    private final JwtEncoder jwtEncoder;


    public static final MacAlgorithm JWT_ALGORITHM = MacAlgorithm.HS512;

    @Value("${hivapp.jwt.secret}")
    private String jwtKey;

    @Value("${hivapp.jwt.expiration}")
    private long jwtExpiration;

    public SecurityUtil(JwtEncoder jwtEncoder) {
        this.jwtEncoder = jwtEncoder;
    }

    public String createToken(Authentication authentication ){
        Instant now = Instant.now();
        Instant validity = now.plus(this.jwtExpiration, ChronoUnit.SECONDS);

        // Create Jwt
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .subject(authentication.getName())
                .issuedAt(now)
                .expiresAt(validity)
                .claim(jwtKey, validity)
                .build();
        JwsHeader jwsHeader = JwsHeader.with(JWT_ALGORITHM).build();
        return this.jwtEncoder.encode(JwtEncoderParameters.from(jwsHeader, claims)).getTokenValue();
    }
}
