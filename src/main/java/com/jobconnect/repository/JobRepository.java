package com.jobconnect.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jobconnect.entity.Job;
import com.jobconnect.enums.JobStatus;

public interface JobRepository extends JpaRepository<Job, Long> {

    List<Job> findByStatus(JobStatus status);

    List<Job> findByLocationContainingIgnoreCase(String location);

    List<Job> findByTitleContainingIgnoreCase(String title);

    List<Job> findByCategoryId(Long categoryId);

    List<Job> findByRecruiterId(Long recruiterId);

    List<Job> findByCompanyId(Long companyId);

    List<Job> findBySalaryMinGreaterThanEqual(Integer salaryMin);

    List<Job> findBySalaryMaxLessThanEqual(Integer salaryMax);

    long countByRecruiterId(Long recruiterId);

    long countByRecruiterIdAndStatus(
            Long recruiterId,
            JobStatus status);

    long countByStatus(JobStatus status);
}