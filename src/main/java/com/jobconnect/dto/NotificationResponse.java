
package com.jobconnect.dto;

import java.time.LocalDateTime;

public class NotificationResponse {

    private Long id;
    private Long userId;
    private Long applicationId;
    private Long jobId;
    private String message;
    private Boolean isRead;
    private LocalDateTime createdAt;

    public NotificationResponse() {
    }

    // Existing constructor
    public NotificationResponse(
            Long id,
            Long userId,
            String message,
            Boolean isRead,
            LocalDateTime createdAt) {

        this.id = id;
        this.userId = userId;
        this.message = message;
        this.isRead = isRead;
        this.createdAt = createdAt;
    }

    // Constructor including applicationId
    public NotificationResponse(
            Long id,
            Long userId,
            Long applicationId,
            String message,
            Boolean isRead,
            LocalDateTime createdAt) {

        this.id = id;
        this.userId = userId;
        this.applicationId = applicationId;
        this.message = message;
        this.isRead = isRead;
        this.createdAt = createdAt;
    }

    // Constructor including applicationId and jobId
    public NotificationResponse(
            Long id,
            Long userId,
            Long applicationId,
            Long jobId,
            String message,
            Boolean isRead,
            LocalDateTime createdAt) {

        this.id = id;
        this.userId = userId;
        this.applicationId = applicationId;
        this.jobId = jobId;
        this.message = message;
        this.isRead = isRead;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getApplicationId() {
        return applicationId;
    }

    public void setApplicationId(Long applicationId) {
        this.applicationId = applicationId;
    }

    public Long getJobId() {
        return jobId;
    }

    public void setJobId(Long jobId) {
        this.jobId = jobId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Boolean getIsRead() {
        return isRead;
    }

    public void setIsRead(Boolean isRead) {
        this.isRead = isRead;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}

