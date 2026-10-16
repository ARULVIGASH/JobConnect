package com.jobconnect.dto;

public class RecruiterDashboardResponse {

    private long totalJobs;
    private long activeJobs;
    private long totalApplications;
    private long selectedCandidates;

    public RecruiterDashboardResponse() {
    }

    public RecruiterDashboardResponse(
            long totalJobs,
            long activeJobs,
            long totalApplications,
            long selectedCandidates) {

        this.totalJobs = totalJobs;
        this.activeJobs = activeJobs;
        this.totalApplications = totalApplications;
        this.selectedCandidates = selectedCandidates;
    }

    public long getTotalJobs() {
        return totalJobs;
    }

    public void setTotalJobs(long totalJobs) {
        this.totalJobs = totalJobs;
    }

    public long getActiveJobs() {
        return activeJobs;
    }

    public void setActiveJobs(long activeJobs) {
        this.activeJobs = activeJobs;
    }

    public long getTotalApplications() {
        return totalApplications;
    }

    public void setTotalApplications(long totalApplications) {
        this.totalApplications = totalApplications;
    }

    public long getSelectedCandidates() {
        return selectedCandidates;
    }

    public void setSelectedCandidates(long selectedCandidates) {
        this.selectedCandidates = selectedCandidates;
    }
}