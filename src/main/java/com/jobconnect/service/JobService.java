package com.jobconnect.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.jobconnect.entity.Job;
import com.jobconnect.enums.JobStatus;
import com.jobconnect.repository.JobRepository;

@Service
public class JobService {

    private final JobRepository jobRepository;

    public JobService(JobRepository jobRepository) {
        this.jobRepository = jobRepository;
    }

    public Job saveJob(Job job) {
        return jobRepository.save(job);
    }

    public Optional<Job> getJobById(Long id) {
        return jobRepository.findById(id);
    }

    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    public List<Job> getActiveJobs() {
        return jobRepository.findByStatus(JobStatus.ACTIVE);
    }

    public List<Job> searchByLocation(String location) {
        return jobRepository.findByLocationContainingIgnoreCase(location);
    }

    public List<Job> searchByTitle(String title) {
        return jobRepository.findByTitleContainingIgnoreCase(title);
    }

    public List<Job> getJobsByCategory(Long categoryId) {
        return jobRepository.findByCategoryId(categoryId);
    }

    public List<Job> searchByMinimumSalary(Integer salaryMin) {
        return jobRepository.findBySalaryMinGreaterThanEqual(salaryMin);
    }

    public List<Job> searchByMaximumSalary(Integer salaryMax) {
        return jobRepository.findBySalaryMaxLessThanEqual(salaryMax);
    }

    public List<Job> getJobsByRecruiterId(Long recruiterId) {
        return jobRepository.findByRecruiterId(recruiterId);
    }

    public List<Job> getJobsByCompany(Long companyId) {
        return jobRepository.findByCompanyId(companyId);
    }

    public void deleteJob(Long id) {
        jobRepository.deleteById(id);
    }
}