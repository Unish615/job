package com.jobconnect.controller;

import com.jobconnect.dto.JobResponse;
import com.jobconnect.security.CustomUserPrincipal;
import com.jobconnect.service.SavedJobService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/saved-jobs")
@PreAuthorize("hasRole('JOB_SEEKER')")
public class SavedJobController {

    private final SavedJobService savedJobService;

    public SavedJobController(SavedJobService savedJobService) {
        this.savedJobService = savedJobService;
    }

    @PostMapping("/{jobId}")
    public ResponseEntity<Map<String, String>> saveJob(
            @PathVariable Long jobId,
            @AuthenticationPrincipal CustomUserPrincipal principal) {
        savedJobService.saveJob(jobId, principal.getId());
        Map<String, String> response = new HashMap<>();
        response.put("message", "Job saved successfully");
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{jobId}")
    public ResponseEntity<Map<String, String>> removeSavedJob(
            @PathVariable Long jobId,
            @AuthenticationPrincipal CustomUserPrincipal principal) {
        savedJobService.removeSavedJob(jobId, principal.getId());
        Map<String, String> response = new HashMap<>();
        response.put("message", "Job removed from saved list");
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<JobResponse>> getSavedJobs(
            @AuthenticationPrincipal CustomUserPrincipal principal) {
        List<JobResponse> list = savedJobService.getSavedJobs(principal.getId());
        return ResponseEntity.ok(list);
    }
}
