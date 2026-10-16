
package com.jobconnect.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.jobconnect.dto.ApplicationRequest;
import com.jobconnect.dto.ApplicationResponse;
import com.jobconnect.dto.ApplicationStatusRequest;
import com.jobconnect.entity.Application;
import com.jobconnect.entity.Job;
import com.jobconnect.entity.JobSeeker;
import com.jobconnect.entity.Resume;
import com.jobconnect.entity.Notification;
import com.jobconnect.enums.ApplicationStatus;
import com.jobconnect.repository.JobRepository;
import com.jobconnect.repository.JobSeekerRepository;
import com.jobconnect.repository.ResumeRepository;
import com.jobconnect.service.ApplicationService;
import com.jobconnect.service.NotificationService;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "http://localhost:5175")
public class ApplicationController {

    private final ApplicationService applicationService;
    private final JobRepository jobRepository;
    private final JobSeekerRepository jobSeekerRepository;
    private final ResumeRepository resumeRepository;
    private final NotificationService notificationService;

    public ApplicationController(
            ApplicationService applicationService,
            JobRepository jobRepository,
            JobSeekerRepository jobSeekerRepository,
            ResumeRepository resumeRepository,
            NotificationService notificationService) {

        this.applicationService = applicationService;
        this.jobRepository = jobRepository;
        this.jobSeekerRepository = jobSeekerRepository;
        this.resumeRepository = resumeRepository;
        this.notificationService = notificationService;
    }

    // ==========================================
    // APPLY FOR A JOB
    // ==========================================

    @PostMapping
    public ResponseEntity<ApplicationResponse> applyForJob(
            @RequestBody ApplicationRequest request) {

        // Check duplicate application
        if (applicationService.existsByJobIdAndSeekerId(
                request.getJobId(),
                request.getSeekerId())) {

            return ResponseEntity.badRequest().build();
        }

        // Find job
        Job job = jobRepository
                .findById(request.getJobId())
                .orElseThrow(() ->
                        new RuntimeException("Job not found"));

        // Find job seeker
        JobSeeker seeker = jobSeekerRepository
                .findById(request.getSeekerId())
                .orElseThrow(() ->
                        new RuntimeException("Job seeker not found"));

        // Find resume if provided
        Resume resume = null;

        if (request.getResumeId() != null) {
            resume = resumeRepository
                    .findById(request.getResumeId())
                    .orElseThrow(() ->
                            new RuntimeException("Resume not found"));
        }

        // Create application
        Application application = new Application();
        application.setJob(job);
        application.setSeeker(seeker);
        application.setResume(resume);
        application.setCoverLetter(request.getCoverLetter());

        // Save application first
        Application savedApplication =
                applicationService.saveApplication(application);

        // ==========================================
        // NOTIFY RECRUITER ABOUT NEW APPLICATION
        // ==========================================

        if (job.getRecruiter() != null
                && job.getRecruiter().getUser() != null) {

            Notification notification = new Notification();

            notification.setUser(job.getRecruiter().getUser());
            notification.setApplicationId(savedApplication.getId());
            notification.setJobId(job.getId());

            String seekerName = "a job seeker";

            if (seeker.getUser() != null
                    && seeker.getUser().getName() != null) {
                seekerName = seeker.getUser().getName();
            }

            notification.setMessage(
                    "New application received from "
                    + seekerName
                    + " for the job: "
                    + job.getTitle());

            notification.setIsRead(false);

            notificationService.saveNotification(notification);
        }

        return ResponseEntity.ok(
                convertToResponse(savedApplication));
    }

    // ==========================================
    // GET APPLICATIONS BY SEEKER
    // ==========================================

    @GetMapping("/seeker/{seekerId}")
    public ResponseEntity<List<ApplicationResponse>> getApplicationsBySeeker(
            @PathVariable Long seekerId) {

        List<ApplicationResponse> responses =
                applicationService
                        .getApplicationsBySeekerId(seekerId)
                        .stream()
                        .map(this::convertToResponse)
                        .collect(Collectors.toList());

        return ResponseEntity.ok(responses);
    }

    // ==========================================
    // GET APPLICATIONS BY JOB
    // ==========================================

    @GetMapping("/job/{jobId}")
    public ResponseEntity<List<ApplicationResponse>> getApplicationsByJob(
            @PathVariable Long jobId) {

        List<ApplicationResponse> responses =
                applicationService
                        .getApplicationsByJobId(jobId)
                        .stream()
                        .map(this::convertToResponse)
                        .collect(Collectors.toList());

        return ResponseEntity.ok(responses);
    }

    // ==========================================
    // UPDATE APPLICATION STATUS
    // ==========================================

    @PutMapping("/{id}/status")
    public ResponseEntity<ApplicationResponse> updateApplicationStatus(
            @PathVariable Long id,
            @RequestBody ApplicationStatusRequest request) {

        Application updatedApplication =
                applicationService.updateApplicationStatus(
                        id,
                        request.getStatus());

        Job job = updatedApplication.getJob();
        JobSeeker seeker = updatedApplication.getSeeker();

        // ==========================================
        // NOTIFY JOB SEEKER ABOUT STATUS CHANGE
        // ==========================================

        if (seeker != null
                && seeker.getUser() != null
                && job != null) {

            String message;
            ApplicationStatus status =
                    updatedApplication.getStatus();

            switch (status) {
                case SHORTLISTED:
                    message = "Your application for the job '"
                            + job.getTitle()
                            + "' has been shortlisted.";
                    break;

                case INTERVIEW:
                    message = "Your application for the job '"
                            + job.getTitle()
                            + "' has been moved to interview.";
                    break;

                case SELECTED:
                    message = "Congratulations! You have been selected for the job '"
                            + job.getTitle() + "'.";
                    break;

                case REJECTED:
                    message = "Your application for the job '"
                            + job.getTitle()
                            + "' has been rejected.";
                    break;

                case UNDER_REVIEW:
                    message = "Your application for the job '"
                            + job.getTitle()
                            + "' is now under review.";
                    break;

                case APPLIED:
                    message = "Your application for the job '"
                            + job.getTitle()
                            + "' has been received.";
                    break;

                default:
                    message = "Your application status has been updated to "
                            + status + ".";
            }

            Notification notification = new Notification();

            notification.setUser(seeker.getUser());
            notification.setApplicationId(updatedApplication.getId());
            notification.setJobId(job.getId());
            notification.setMessage(message);
            notification.setIsRead(false);

            notificationService.saveNotification(notification);
        }

        return ResponseEntity.ok(
                convertToResponse(updatedApplication));
    }

    // ==========================================
    // CONVERT APPLICATION ENTITY TO RESPONSE
    // ==========================================

    private ApplicationResponse convertToResponse(
            Application application) {

        Long jobId = null;
        String jobTitle = null;
        String location = null;
        String jobType = null;
        String workMode = null;
        String companyName = null;
        Integer salaryMin = null;
        Integer salaryMax = null;
        Long seekerId = null;
        String seekerName = null;
        Long resumeId = null;

        // Job details
        if (application.getJob() != null) {
            Job job = application.getJob();

            jobId = job.getId();
            jobTitle = job.getTitle();
            location = job.getLocation();

            if (job.getJobType() != null) {
                jobType = job.getJobType().name();
            }

            if (job.getWorkMode() != null) {
                workMode = job.getWorkMode().name();
            }

            if (job.getSalaryMin() != null) {
                salaryMin =
                        ((Number) job.getSalaryMin()).intValue();
            }

            if (job.getSalaryMax() != null) {
                salaryMax =
                        ((Number) job.getSalaryMax()).intValue();
            }

            if (job.getCompany() != null) {
                companyName = job.getCompany().getName();
            }
        }

        // Job seeker details
        if (application.getSeeker() != null) {
            seekerId = application.getSeeker().getId();

            if (application.getSeeker().getUser() != null) {
                seekerName =
                        application.getSeeker().getUser().getName();
            }
        }

        // Resume details
        if (application.getResume() != null) {
            resumeId = application.getResume().getId();
        }

        // Application status
        String status = null;

        if (application.getStatus() != null) {
            status = application.getStatus().name();
        }

        return new ApplicationResponse(
                application.getId(),
                jobId,
                jobTitle,
                location,
                jobType,
                workMode,
                companyName,
                salaryMin,
                salaryMax,
                seekerId,
                seekerName,
                resumeId,
                application.getCoverLetter(),
                status,
                application.getAppliedAt(),
                application.getUpdatedAt()
        );
    }
}

