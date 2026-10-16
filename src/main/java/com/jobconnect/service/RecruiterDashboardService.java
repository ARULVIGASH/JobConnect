package com.jobconnect.service;

import org.springframework.stereotype.Service;

import com.jobconnect.dto.RecruiterDashboardResponse;
import com.jobconnect.enums.ApplicationStatus;
import com.jobconnect.enums.JobStatus;
import com.jobconnect.repository.ApplicationRepository;
import com.jobconnect.repository.JobRepository;

@Service
public class RecruiterDashboardService {

    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;

    public RecruiterDashboardService(
            JobRepository jobRepository,
            ApplicationRepository applicationRepository) {

        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
    }

    public RecruiterDashboardResponse getDashboardStats(
            Long recruiterId) {

        long totalJobs =
                jobRepository.countByRecruiterId(recruiterId);

        long activeJobs =
                jobRepository.countByRecruiterIdAndStatus(
                        recruiterId,
                        JobStatus.ACTIVE);

        long totalApplications =
                applicationRepository.countByJobRecruiterId(
                        recruiterId);

        long selectedCandidates =
                applicationRepository.countByJobRecruiterIdAndStatus(
                        recruiterId,
                        ApplicationStatus.SELECTED);

        return new RecruiterDashboardResponse(
                totalJobs,
                activeJobs,
                totalApplications,
                selectedCandidates);
    }
}