package com.jobconnect.dto;

import java.time.LocalDateTime;

public class SavedJobResponse {

    private Long id;
    private Long jobSeekerId;
    private Long jobId;
    private String jobTitle;
    private String companyName;
    private String location;
    private LocalDateTime savedAt;

    public SavedJobResponse() {
    }

    public SavedJobResponse(Long id, Long jobSeekerId, Long jobId,
                            String jobTitle, String companyName,
                            String location, LocalDateTime savedAt) {
        this.id = id;
        this.jobSeekerId = jobSeekerId;
        this.jobId = jobId;
        this.jobTitle = jobTitle;
        this.companyName = companyName;
        this.location = location;
        this.savedAt = savedAt;
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

    public Long getJobId() {
        return jobId;
    }

    public void setJobId(Long jobId) {
        this.jobId = jobId;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public LocalDateTime getSavedAt() {
        return savedAt;
    }

    public void setSavedAt(LocalDateTime savedAt) {
        this.savedAt = savedAt;
    }
}