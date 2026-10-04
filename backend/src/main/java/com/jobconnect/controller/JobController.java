package com.jobconnect.controller;

import com.jobconnect.dto.JobRequest;
import com.jobconnect.dto.JobResponse;
import com.jobconnect.security.CustomUserPrincipal;
import com.jobconnect.service.JobService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @GetMapping
    public ResponseEntity<Page<JobResponse>> searchJobs(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String jobType,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String experience,
            @RequestParam(defaultValue = "latest") String sortBy,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal CustomUserPrincipal principal) {
        Long currentUserId = principal != null ? principal.getId() : null;
        Page<JobResponse> results = jobService.searchJobs(keyword, category, jobType, location, experience, sortBy, page, size, currentUserId);
        return ResponseEntity.ok(results);
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobResponse> getJobById(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserPrincipal principal) {
        Long currentUserId = principal != null ? principal.getId() : null;
        JobResponse response = jobService.getJobById(id, currentUserId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/featured")
    public ResponseEntity<List<JobResponse>> getFeaturedJobs(
            @AuthenticationPrincipal CustomUserPrincipal principal) {
        Long currentUserId = principal != null ? principal.getId() : null;
        List<JobResponse> jobs = jobService.getLatestFeaturedJobs(currentUserId);
        return ResponseEntity.ok(jobs);
    }

    @GetMapping("/categories")
    public ResponseEntity<Map<String, Long>> getCategoryCounts() {
        return ResponseEntity.ok(jobService.getCategoryCounts());
    }

    @GetMapping("/employer/my")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<List<JobResponse>> getEmployerJobs(
            @AuthenticationPrincipal CustomUserPrincipal principal) {
        List<JobResponse> jobs = jobService.getEmployerJobs(principal.getId());
        return ResponseEntity.ok(jobs);
    }

    @PostMapping
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<JobResponse> createJob(
            @Valid @RequestBody JobRequest request,
            @AuthenticationPrincipal CustomUserPrincipal principal) {
        JobResponse response = jobService.createJob(principal.getId(), request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<JobResponse> updateJob(
            @PathVariable Long id,
            @Valid @RequestBody JobRequest request,
            @AuthenticationPrincipal CustomUserPrincipal principal) {
        JobResponse response = jobService.updateJob(id, principal.getId(), request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('EMPLOYER', 'ADMIN')")
    public ResponseEntity<Map<String, String>> deleteJob(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserPrincipal principal) {
        jobService.deleteJob(id, principal.getId());
        Map<String, String> response = new HashMap<>();
        response.put("message", "Job deleted successfully");
        return ResponseEntity.ok(response);
    }
}
