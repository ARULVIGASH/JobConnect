package com.jobconnect.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.jobconnect.dto.SavedJobResponse;
import com.jobconnect.entity.Job;
import com.jobconnect.entity.JobSeeker;
import com.jobconnect.entity.SavedJob;
import com.jobconnect.repository.JobRepository;
import com.jobconnect.repository.JobSeekerRepository;
import com.jobconnect.service.SavedJobService;

@RestController
@RequestMapping("/api/saved-jobs")
@CrossOrigin(origins = "http://localhost:5175")
public class SavedJobController {

    private final SavedJobService savedJobService;
    private final JobSeekerRepository jobSeekerRepository;
    private final JobRepository jobRepository;

    public SavedJobController(
            SavedJobService savedJobService,
            JobSeekerRepository jobSeekerRepository,
            JobRepository jobRepository) {

        this.savedJobService = savedJobService;
        this.jobSeekerRepository = jobSeekerRepository;
        this.jobRepository = jobRepository;
    }

    @PostMapping
    public ResponseEntity<SavedJobResponse> saveJob(
            @RequestParam Long jobSeekerId,
            @RequestParam Long jobId) {

        JobSeeker jobSeeker = jobSeekerRepository.findById(jobSeekerId)
                .orElseThrow(() ->
                        new RuntimeException("Job seeker not found"));

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() ->
                        new RuntimeException("Job not found"));

        if (savedJobService.isJobSaved(jobSeekerId, jobId)) {
            return ResponseEntity.badRequest().build();
        }

        SavedJob savedJob = new SavedJob();

        savedJob.setJobSeeker(jobSeeker);
        savedJob.setJob(job);

        SavedJob saved =
                savedJobService.saveSavedJob(savedJob);

        return ResponseEntity.ok(convertToResponse(saved));
    }

    @GetMapping("/seeker/{jobSeekerId}")
    public ResponseEntity<List<SavedJobResponse>> getSavedJobs(
            @PathVariable Long jobSeekerId) {

        List<SavedJobResponse> responses =
                savedJobService
                        .getSavedJobsByJobSeeker(jobSeekerId)
                        .stream()
                        .map(this::convertToResponse)
                        .collect(Collectors.toList());

        return ResponseEntity.ok(responses);
    }

    @DeleteMapping("/seeker/{jobSeekerId}/job/{jobId}")
    public ResponseEntity<String> removeSavedJob(
            @PathVariable Long jobSeekerId,
            @PathVariable Long jobId) {

        savedJobService.removeSavedJob(jobSeekerId, jobId);

        return ResponseEntity.ok(
                "Job removed from saved jobs");
    }

    private SavedJobResponse convertToResponse(
            SavedJob savedJob) {

        Long jobSeekerId = null;
        Long jobId = null;
        String jobTitle = null;
        String companyName = null;
        String location = null;

        if (savedJob.getJobSeeker() != null) {

            jobSeekerId =
                    savedJob.getJobSeeker().getId();
        }

        if (savedJob.getJob() != null) {

            jobId =
                    savedJob.getJob().getId();

            jobTitle =
                    savedJob.getJob().getTitle();

            location =
                    savedJob.getJob().getLocation();

            if (savedJob.getJob().getCompany() != null) {

                companyName =
                        savedJob.getJob()
                                .getCompany()
                                .getName();
            }
        }

        return new SavedJobResponse(
                savedJob.getId(),
                jobSeekerId,
                jobId,
                jobTitle,
                companyName,
                location,
                savedJob.getSavedAt()
        );
    }
}