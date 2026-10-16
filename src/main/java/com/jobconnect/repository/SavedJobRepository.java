package com.jobconnect.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.jobconnect.entity.SavedJob;

public interface SavedJobRepository extends JpaRepository<SavedJob, Long> {


List<SavedJob> findByJobSeekerId(Long jobSeekerId);

boolean existsByJobSeekerIdAndJobId(Long jobSeekerId, Long jobId);

@Modifying
@Transactional
@Query("DELETE FROM SavedJob s WHERE s.jobSeeker.id = :jobSeekerId AND s.job.id = :jobId")
void deleteByJobSeekerIdAndJobId(
        @Param("jobSeekerId") Long jobSeekerId,
        @Param("jobId") Long jobId
);


}
