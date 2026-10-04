package com.jobconnect.repository;

import com.jobconnect.entity.Application;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByJobSeekerIdOrderByAppliedAtDesc(Long jobSeekerId);
    List<Application> findByEmployerIdOrderByAppliedAtDesc(Long employerId);
    List<Application> findByJobIdOrderByAppliedAtDesc(Long jobId);
    List<Application> findAllByOrderByAppliedAtDesc();
    Page<Application> findByEmployerId(Long employerId, Pageable pageable);
    
    boolean existsByJobIdAndJobSeekerId(Long jobId, Long jobSeekerId);
    Optional<Application> findByJobIdAndJobSeekerId(Long jobId, Long jobSeekerId);

    long countByJobSeekerId(Long jobSeekerId);
    long countByJobSeekerIdAndStatus(Long jobSeekerId, String status);

    long countByEmployerId(Long employerId);
    long countByEmployerIdAndStatus(Long employerId, String status);

    long countByStatus(String status);

    @Query("SELECT a.status, COUNT(a) FROM Application a GROUP BY a.status")
    List<Object[]> countApplicationsByStatus();

    @Query(value = "SELECT DATE_FORMAT(applied_at, '%Y-%m-%d') as app_date, COUNT(*) as app_count FROM applications GROUP BY DATE_FORMAT(applied_at, '%Y-%m-%d') ORDER BY app_date ASC", nativeQuery = true)
    List<Object[]> countApplicationsOverTime();
}
