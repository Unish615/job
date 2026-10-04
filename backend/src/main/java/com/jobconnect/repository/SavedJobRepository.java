package com.jobconnect.repository;

import com.jobconnect.entity.SavedJob;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SavedJobRepository extends JpaRepository<SavedJob, Long> {
    List<SavedJob> findByJobSeekerIdOrderBySavedAtDesc(Long jobSeekerId);
    boolean existsByJobIdAndJobSeekerId(Long jobId, Long jobSeekerId);
    Optional<SavedJob> findByJobIdAndJobSeekerId(Long jobId, Long jobSeekerId);
    void deleteByJobIdAndJobSeekerId(Long jobId, Long jobSeekerId);
    long countByJobSeekerId(Long jobSeekerId);
}
