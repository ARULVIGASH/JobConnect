package com.jobconnect.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jobconnect.entity.Resume;

public interface ResumeRepository extends JpaRepository<Resume, Long> {

    List<Resume> findByJobSeekerId(Long jobSeekerId);

}