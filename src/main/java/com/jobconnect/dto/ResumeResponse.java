package com.jobconnect.dto;

import java.time.LocalDateTime;

public class ResumeResponse {

    private Long id;
    private Long jobSeekerId;
    private String fileName;
    private String filePath;
    private LocalDateTime uploadDate;

    public ResumeResponse() {
    }

    public ResumeResponse(Long id, Long jobSeekerId,
                          String fileName, String filePath,
                          LocalDateTime uploadDate) {
        this.id = id;
        this.jobSeekerId = jobSeekerId;
        this.fileName = fileName;
        this.filePath = filePath;
        this.uploadDate = uploadDate;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getJobSeekerId() {
        return jobSeekerId;
    }

    public void setJobSeekerId(Long jobSeekerId) {
        this.jobSeekerId = jobSeekerId;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public LocalDateTime getUploadDate() {
        return uploadDate;
    }

    public void setUploadDate(LocalDateTime uploadDate) {
        this.uploadDate = uploadDate;
    }
}