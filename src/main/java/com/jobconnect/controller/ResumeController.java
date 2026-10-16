
package com.jobconnect.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.jobconnect.dto.ResumeResponse;
import com.jobconnect.entity.JobSeeker;
import com.jobconnect.entity.Resume;
import com.jobconnect.repository.JobSeekerRepository;
import com.jobconnect.service.ResumeService;

@RestController
@RequestMapping("/api/resumes")
public class ResumeController {

    private final ResumeService resumeService;
    private final JobSeekerRepository jobSeekerRepository;

    public ResumeController(
            ResumeService resumeService,
            JobSeekerRepository jobSeekerRepository) {
        this.resumeService = resumeService;
        this.jobSeekerRepository = jobSeekerRepository;
    }

    @PostMapping("/upload")
    public ResponseEntity<ResumeResponse> uploadResume(
            @RequestParam("file") MultipartFile file,
            @RequestParam Long jobSeekerId) throws IOException {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        String originalFileName = file.getOriginalFilename();

        if (originalFileName == null || originalFileName.isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        String fileName = Paths.get(originalFileName)
                .getFileName()
                .toString();

        // Accept PDF files for resume uploads.
        if (!fileName.toLowerCase(Locale.ROOT).endsWith(".pdf")) {
            return ResponseEntity.badRequest().build();
        }

        JobSeeker jobSeeker = jobSeekerRepository.findById(jobSeekerId)
                .orElseThrow(() ->
                        new RuntimeException("Job seeker not found"));

        Path uploadDirectory = Paths.get(
                System.getProperty("user.home"),
                "JobConnect",
                "uploads",
                "resumes"
        ).toAbsolutePath().normalize();

        Files.createDirectories(uploadDirectory);

        // Use a unique stored name to prevent overwriting another resume.
        String storedFileName = System.currentTimeMillis() + "_" + fileName;
        Path filePath = uploadDirectory.resolve(storedFileName).normalize();

        if (!filePath.startsWith(uploadDirectory)) {
            return ResponseEntity.badRequest().build();
        }

        // Check that the file actually contains PDF data.
        byte[] fileBytes = file.getBytes();

        if (fileBytes.length < 5
                || fileBytes[0] != '%'
                || fileBytes[1] != 'P'
                || fileBytes[2] != 'D'
                || fileBytes[3] != 'F'
                || fileBytes[4] != '-') {
            return ResponseEntity.badRequest().build();
        }

        Files.write(filePath, fileBytes);

        Resume resume = new Resume();
        resume.setJobSeeker(jobSeeker);
        resume.setFileName(fileName);
        resume.setFilePath(filePath.toString());

        Resume savedResume = resumeService.saveResume(resume);

        return ResponseEntity.ok(convertToResponse(savedResume));
    }

    @GetMapping("/seeker/{jobSeekerId}")
    public ResponseEntity<List<ResumeResponse>> getResumesByJobSeeker(
            @PathVariable Long jobSeekerId) {

        List<ResumeResponse> responses = resumeService
                .getResumesByJobSeeker(jobSeekerId)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(responses);
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<Resource> downloadResume(
            @PathVariable Long id) throws IOException {

        Resume resume = resumeService.getResumeById(id)
                .orElseThrow(() ->
                        new RuntimeException("Resume not found. ID: " + id));

        Path filePath = Paths.get(resume.getFilePath())
                .toAbsolutePath()
                .normalize();

        System.out.println("Resume ID: " + id);
        System.out.println("Resume file path: " + filePath);
        System.out.println("File exists: " + Files.exists(filePath));

        if (!Files.exists(filePath)
                || !Files.isRegularFile(filePath)
                || !Files.isReadable(filePath)) {
            System.err.println("Resume file is missing or unreadable: " + filePath);
            return ResponseEntity.notFound().build();
        }

        Resource resource = new UrlResource(filePath.toUri());

        String safeFileName = resume.getFileName()
                .replace("\"", "")
                .replace("\r", "")
                .replace("\n", "");

        boolean isPdf = safeFileName.toLowerCase(Locale.ROOT).endsWith(".pdf");

        MediaType contentType = isPdf
                ? MediaType.APPLICATION_PDF
                : MediaType.APPLICATION_OCTET_STREAM;

        String disposition = isPdf ? "inline" : "attachment";

        return ResponseEntity.ok()
                .contentType(contentType)
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        disposition + "; filename=\"" + safeFileName + "\""
                )
                .contentLength(Files.size(filePath))
                .body(resource);
    }

    private ResumeResponse convertToResponse(Resume resume) {
        Long jobSeekerId = null;

        if (resume.getJobSeeker() != null) {
            jobSeekerId = resume.getJobSeeker().getId();
        }

        return new ResumeResponse(
                resume.getId(),
                jobSeekerId,
                resume.getFileName(),
                resume.getFilePath(),
                resume.getUploadDate()
        );
    }
}

