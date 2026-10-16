package com.jobconnect.service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.jobconnect.dto.JobSeekerProfileRequest;
import com.jobconnect.entity.JobSeeker;
import com.jobconnect.entity.User;
import com.jobconnect.repository.JobSeekerRepository;

@Service
public class JobSeekerService {

    private final JobSeekerRepository jobSeekerRepository;

    public JobSeekerService(JobSeekerRepository jobSeekerRepository) {
        this.jobSeekerRepository = jobSeekerRepository;
    }

    // Save Job Seeker
    public JobSeeker saveJobSeeker(JobSeeker jobSeeker) {

        return jobSeekerRepository.save(jobSeeker);
    }

    // Get Job Seeker by Job Seeker ID
    public Optional<JobSeeker> getJobSeekerById(Long id) {

        return jobSeekerRepository.findById(id);
    }

    // Get Job Seeker by User ID
    public Optional<JobSeeker> getJobSeekerByUserId(Long userId) {

        return jobSeekerRepository.findByUserId(userId);
    }

    // Update Job Seeker Profile
    public JobSeeker updateJobSeekerProfile(
            Long id,
            JobSeekerProfileRequest request) {

        JobSeeker jobSeeker = jobSeekerRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Job seeker not found"));

        // Update User information
        User user = jobSeeker.getUser();

        if (request.getName() != null) {
            user.setName(request.getName());
        }

        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }

        // Update Job Seeker information
        if (request.getAddress() != null) {
            jobSeeker.setAddress(request.getAddress());
        }

        if (request.getExperienceYears() != null) {
            jobSeeker.setExperienceYears(
                    request.getExperienceYears()
            );
        }

        if (request.getSkills() != null) {
            jobSeeker.setSkills(request.getSkills());
        }

        return jobSeekerRepository.save(jobSeeker);
    }

    // Delete Job Seeker
    public void deleteJobSeeker(Long id) {

        jobSeekerRepository.deleteById(id);
    }
}