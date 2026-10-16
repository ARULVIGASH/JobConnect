package com.jobconnect.dto;

import com.jobconnect.enums.ApplicationStatus;

public class ApplicationStatusRequest {

    private ApplicationStatus status;

    public ApplicationStatusRequest() {
    }

    public ApplicationStatus getStatus() {
        return status;
    }

    public void setStatus(ApplicationStatus status) {
        this.status = status;
    }
}