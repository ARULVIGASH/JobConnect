package com.jobconnect.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jobconnect.entity.Application;
import com.jobconnect.service.ApplicationService;

@RestController
@RequestMapping("/api/admin/applications")
@CrossOrigin(origins = "http://localhost:5175")
public class AdminApplicationController {

private final ApplicationService applicationService;

public AdminApplicationController(ApplicationService applicationService) {
    this.applicationService = applicationService;
}

@GetMapping
public ResponseEntity<List<Application>> getAllApplications() {
    return ResponseEntity.ok(
        applicationService.getAllApplications()
    );
}

}