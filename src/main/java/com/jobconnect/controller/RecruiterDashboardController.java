package com.jobconnect.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.jobconnect.dto.RecruiterDashboardResponse;
import com.jobconnect.service.RecruiterDashboardService;

@RestController
@RequestMapping("/api/recruiter/dashboard")
@CrossOrigin(origins = "http://localhost:5175")
public class RecruiterDashboardController {

    private final RecruiterDashboardService dashboardService;

    public RecruiterDashboardController(
            RecruiterDashboardService dashboardService) {

        this.dashboardService = dashboardService;
    }

    @GetMapping("/{recruiterId}")
    public ResponseEntity<RecruiterDashboardResponse> getDashboardStats(
            @PathVariable Long recruiterId) {

        RecruiterDashboardResponse response =
                dashboardService.getDashboardStats(recruiterId);

        return ResponseEntity.ok(response);
    }
}