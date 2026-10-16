package com.jobconnect.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.jobconnect.entity.Job;
import com.jobconnect.service.JobService;

@RestController
@RequestMapping("/api/admin/jobs")
@CrossOrigin(origins = "http://localhost:5175")
public class AdminJobController {

private final JobService jobService;

public AdminJobController(JobService jobService) {
    this.jobService = jobService;
}

@GetMapping
public ResponseEntity<List<Job>> getAllJobs() {
    return ResponseEntity.ok(jobService.getAllJobs());
}

@DeleteMapping("/{id}")
public ResponseEntity<Void> deleteJob(
        @PathVariable Long id) {

    if (jobService.getJobById(id).isEmpty()) {
        return ResponseEntity.notFound().build();
    }

    jobService.deleteJob(id);

    return ResponseEntity.noContent().build();
}

}