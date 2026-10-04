package com.jobconnect.repository;

import com.jobconnect.entity.Job;
import com.jobconnect.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long>, JpaSpecificationExecutor<Job> {
    List<Job> findByEmployer(User employer);
    List<Job> findByEmployerIdOrderByCreatedAtDesc(Long employerId);
    Page<Job> findByStatusOrderByCreatedAtDesc(String status, Pageable pageable);
    List<Job> findTop6ByStatusOrderByCreatedAtDesc(String status);
    long countByEmployerId(Long employerId);
    long countByStatus(String status);

    @Query("SELECT j.category, COUNT(j) FROM Job j GROUP BY j.category")
    List<Object[]> countJobsByCategory();
}
