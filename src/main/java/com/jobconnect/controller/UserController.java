package com.jobconnect.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.jobconnect.dto.UserResponse;
import com.jobconnect.dto.JobSeekerResponse;
import com.jobconnect.entity.User;
import com.jobconnect.enums.UserStatus;
import com.jobconnect.service.JobSeekerService;
import com.jobconnect.service.UserService;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5175")
public class UserController {

    private final UserService userService;
    private final JobSeekerService jobSeekerService;

    public UserController(
            UserService userService,
            JobSeekerService jobSeekerService) {

        this.userService = userService;
        this.jobSeekerService = jobSeekerService;
    }

    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers() {

        List<UserResponse> users =
                userService.getAllUsers()
                        .stream()
                        .map(user -> new UserResponse(
                                user.getId(),
                                user.getName(),
                                user.getEmail(),
                                user.getPhone(),
                                user.getRole().name(),
                                user.getStatus().name()
                        ))
                        .toList();

        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(
            @PathVariable Long id) {

        Optional<User> userOptional =
                userService.getUserById(id);

        if (userOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = userOptional.get();

        UserResponse response = new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole().name(),
                user.getStatus().name()
        );

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<UserResponse> updateUserStatus(
            @PathVariable Long id,
            @RequestParam UserStatus status) {

        Optional<User> updatedUser =
                userService.updateUserStatus(id, status);

        if (updatedUser.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = updatedUser.get();

        UserResponse response = new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole().name(),
                user.getStatus().name()
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/job-seeker/{userId}")
    public ResponseEntity<JobSeekerResponse> getJobSeekerByUserId(
            @PathVariable Long userId) {

        return jobSeekerService.getJobSeekerByUserId(userId)
                .map(jobSeeker -> {

                    JobSeekerResponse response =
                            new JobSeekerResponse(
                                    jobSeeker.getId(),
                                    jobSeeker.getUser().getId(),
                                    jobSeeker.getUser().getName(),
                                    jobSeeker.getUser().getEmail(),
                                    jobSeeker.getUser().getPhone(),
                                    jobSeeker.getAddress(),
                                    jobSeeker.getExperienceYears(),
                                    jobSeeker.getSkills()
                            );

                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}