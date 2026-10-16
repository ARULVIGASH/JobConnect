package com.jobconnect.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jobconnect.entity.Application;
import com.jobconnect.enums.ApplicationStatus;

public interface ApplicationRepository extends JpaRepository<Application, Long> {

    List<Application> findBySeekerId(Long seekerId);

    List<Application> findByJobId(Long jobId);

    List<Application> findByStatus(ApplicationStatus status);

    boolean existsByJobIdAndSeekerId(Long jobId, Long seekerId);

    long countByJobRecruiterId(Long recruiterId);

    long countByJobRecruiterIdAndStatus(
            Long recruiterId,
            ApplicationStatus status);

    long countByStatus(ApplicationStatus status);
}