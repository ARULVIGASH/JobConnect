package com.jobconnect.service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.jobconnect.entity.Recruiter;
import com.jobconnect.repository.RecruiterRepository;

@Service
public class RecruiterService {

    private final RecruiterRepository recruiterRepository;

    public RecruiterService(RecruiterRepository recruiterRepository) {
        this.recruiterRepository = recruiterRepository;
    }

    public Recruiter saveRecruiter(Recruiter recruiter) {
        return recruiterRepository.save(recruiter);
    }

    public Optional<Recruiter> getRecruiterById(Long id) {
        return recruiterRepository.findById(id);
    }

    public Optional<Recruiter> getRecruiterByUserId(Long userId) {
        return recruiterRepository.findByUserId(userId);
    }

    public void deleteRecruiter(Long id) {
        recruiterRepository.deleteById(id);
    }
}