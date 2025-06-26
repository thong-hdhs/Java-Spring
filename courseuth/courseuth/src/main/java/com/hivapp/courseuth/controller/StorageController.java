package com.hivapp.courseuth.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

import java.time.Duration;
import java.util.UUID;

@RestController
public class StorageController {

    @Autowired
    private S3Presigner s3Presigner;

    @Value("${spring.cloud.aws.s3.bucket-name}")
    private String bucketName;

    @GetMapping("/get-upload-url")
    public ResponseEntity<String> getUploadUrl() {
        String fileName = UUID.randomUUID().toString();
        System.out.println("Generating pre-signed URL for bucket: " + bucketName + " and file: " + fileName);
        PutObjectRequest objectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(fileName)
                .build();

        PutObjectPresignRequest presignRequest = PutObjectPresignRequest.builder()
                .signatureDuration(Duration.ofMinutes(5))
                .putObjectRequest(objectRequest)
                .build();

        String url = s3Presigner.presignPutObject(presignRequest).url().toString();
        System.out.println("Generated pre-signed URL: " + url);
        return ResponseEntity.ok(url);
    }
}
