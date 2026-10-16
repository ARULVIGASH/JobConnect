package com.jobconnect.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.jobconnect.dto.JobSeekerProfileRequest;
import com.jobconnect.dto.JobSeekerResponse;
import com.jobconnect.entity.JobSeeker;
import com.jobconnect.service.JobSeekerService;

@RestController
@RequestMapping("/api/job-seekers")
public class JobSeekerController {

    private final JobSeekerService jobSeekerService;

    public JobSeekerController(JobSeekerService jobSeekerService) {
        this.jobSeekerService = jobSeekerService;
    }

    // Get JobSeeker by JobSeeker ID
    @GetMapping("/{id}")
    public ResponseEntity<JobSeekerResponse> getJobSeekerById(
            @PathVariable Long id) {

        return jobSeekerService.getJobSeekerById(id)
                .map(this::convertToResponse)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Get JobSeeker by User ID
    @GetMapping("/user/{userId}")
    public ResponseEntity<JobSeekerResponse> getJobSeekerByUserId(
            @PathVariable Long userId) {

        return jobSeekerService.getJobSeekerByUserId(userId)
                .map(this::convertToResponse)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Update JobSeeker Profile
    @PutMapping("/{id}")
    public ResponseEntity<JobSeekerResponse> updateJobSeekerProfile(
            @PathVariable Long id,
            @RequestBody JobSeekerProfileRequest request) {

        JobSeeker updatedJobSeeker =
                jobSeekerService.updateJobSeekerProfile(id, request);

        return ResponseEntity.ok(
                convertToResponse(updatedJobSeeker)
        );
    }

    // Convert JobSeeker Entity to Response
    private JobSeekerResponse convertToResponse(
            JobSeeker jobSeeker) {

        return new JobSeekerResponse(
                jobSeeker.getId(),
                jobSeeker.getUser().getId(),
                jobSeeker.getUser().getName(),
                jobSeeker.getUser().getEmail(),
                jobSeeker.getUser().getPhone(),
                jobSeeker.getAddress(),
                jobSeeker.getExperienceYears(),
                jobSeeker.getSkills()
        );
    }
}