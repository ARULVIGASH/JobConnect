package com.jobconnect.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.jobconnect.entity.SavedJob;
import com.jobconnect.repository.SavedJobRepository;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SavedJobService {

    private final SavedJobRepository savedJobRepository;

    public SavedJobService(SavedJobRepository savedJobRepository) {
        this.savedJobRepository = savedJobRepository;
    }

    public SavedJob saveSavedJob(SavedJob savedJob) {
        return savedJobRepository.save(savedJob);
    }

    public Optional<SavedJob> getSavedJobById(Long id) {
        return savedJobRepository.findById(id);
    }

    public List<SavedJob> getSavedJobsByJobSeeker(Long jobSeekerId) {
        return savedJobRepository.findByJobSeekerId(jobSeekerId);
    }

    public boolean isJobSaved(Long jobSeekerId, Long jobId) {
        return savedJobRepository.existsByJobSeekerIdAndJobId(
                jobSeekerId, jobId);
    }

    @Transactional
    public void removeSavedJob(Long jobSeekerId, Long jobId) {
        savedJobRepository.deleteByJobSeekerIdAndJobId(
                jobSeekerId, jobId);
    }

    public List<SavedJob> getAllSavedJobs() {
        return savedJobRepository.findAll();
    }

    public void deleteSavedJob(Long id) {
        savedJobRepository.deleteById(id);
    }
}