package com.jobconnect.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.jobconnect.dto.RecruiterResponse;
import com.jobconnect.service.RecruiterService;

@RestController
@RequestMapping("/api/recruiters")
@CrossOrigin(origins = "http://localhost:5175")
public class RecruiterController {

    private final RecruiterService recruiterService;

    public RecruiterController(RecruiterService recruiterService) {
        this.recruiterService = recruiterService;
    }

    // Get recruiter by recruiter ID
    @GetMapping("/{id}")
    public ResponseEntity<RecruiterResponse> getRecruiterById(
            @PathVariable Long id) {

        return recruiterService.getRecruiterById(id)
                .map(recruiter -> {

                    RecruiterResponse response = new RecruiterResponse(
                            recruiter.getId(),
                            recruiter.getUser().getId(),
                            recruiter.getUser().getName(),
                            recruiter.getUser().getEmail(),
                            recruiter.getUser().getPhone()
                    );

                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Get recruiter by USER ID
    @GetMapping("/user/{userId}")
    public ResponseEntity<RecruiterResponse> getRecruiterByUserId(
            @PathVariable Long userId) {

        return recruiterService.getRecruiterByUserId(userId)
                .map(recruiter -> {

                    RecruiterResponse response = new RecruiterResponse(
                            recruiter.getId(),
                            recruiter.getUser().getId(),
                            recruiter.getUser().getName(),
                            recruiter.getUser().getEmail(),
                            recruiter.getUser().getPhone()
                    );

                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}