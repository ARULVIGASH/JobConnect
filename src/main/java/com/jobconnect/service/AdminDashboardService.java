package com.jobconnect.service;

import org.springframework.stereotype.Service;

import com.jobconnect.dto.AdminDashboardResponse;
import com.jobconnect.enums.Role;
import com.jobconnect.enums.JobStatus;
import com.jobconnect.repository.ApplicationRepository;
import com.jobconnect.repository.JobRepository;
import com.jobconnect.repository.UserRepository;

@Service
public class AdminDashboardService {

    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;

    public AdminDashboardService(
            UserRepository userRepository,
            JobRepository jobRepository,
            ApplicationRepository applicationRepository) {

        this.userRepository = userRepository;
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
    }

    public AdminDashboardResponse getDashboardStats() {

        long totalUsers = userRepository.count();

        long totalJobSeekers =
                userRepository.countByRole(Role.JOB_SEEKER);

        long totalRecruiters =
                userRepository.countByRole(Role.RECRUITER);

        long totalJobs =
                jobRepository.count();

        long activeJobs =
                jobRepository.countByStatus(JobStatus.ACTIVE);

        long totalApplications =
                applicationRepository.count();

        return new AdminDashboardResponse(
                totalUsers,
                totalJobSeekers,
                totalRecruiters,
                totalJobs,
                activeJobs,
                totalApplications
        );
    }
}