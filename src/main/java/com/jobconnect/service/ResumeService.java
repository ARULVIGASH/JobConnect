package com.jobconnect.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.jobconnect.entity.Resume;
import com.jobconnect.repository.ResumeRepository;

@Service
public class ResumeService {

    private final ResumeRepository resumeRepository;

    public ResumeService(ResumeRepository resumeRepository) {
        this.resumeRepository = resumeRepository;
    }

    // Save Resume
    public Resume saveResume(Resume resume) {

        if (resume == null) {
            throw new RuntimeException("Resume cannot be null");
        }

        return resumeRepository.save(resume);
    }

    // Get Resume by ID
    public Optional<Resume> getResumeById(Long id) {

        return resumeRepository.findById(id);
    }

    // Get all resumes of a Job Seeker
    public List<Resume> getResumesByJobSeeker(Long jobSeekerId) {

        return resumeRepository.findByJobSeekerId(jobSeekerId);
    }

    // Get all resumes
    public List<Resume> getAllResumes() {

        return resumeRepository.findAll();
    }

    // Delete Resume
    public void deleteResume(Long id) {

        if (!resumeRepository.existsById(id)) {
            throw new RuntimeException("Resume not found");
        }

        resumeRepository.deleteById(id);
    }
}