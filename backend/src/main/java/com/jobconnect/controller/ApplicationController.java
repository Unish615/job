package com.jobconnect.controller;

import com.jobconnect.dto.ApplicationRequest;
import com.jobconnect.dto.ApplicationResponse;
import com.jobconnect.dto.StatusUpdateRequest;
import com.jobconnect.security.CustomUserPrincipal;
import com.jobconnect.service.ApplicationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping
    @PreAuthorize("hasRole('JOB_SEEKER')")
    public ResponseEntity<ApplicationResponse> apply(
            @Valid @RequestBody ApplicationRequest request,
            @AuthenticationPrincipal CustomUserPrincipal principal) {
        ApplicationResponse response = applicationService.applyForJob(principal.getId(), request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('JOB_SEEKER')")
    public ResponseEntity<List<ApplicationResponse>> getMyApplications(
            @AuthenticationPrincipal CustomUserPrincipal principal) {
        List<ApplicationResponse> responses = applicationService.getMyApplications(principal.getId());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/employer")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<List<ApplicationResponse>> getEmployerApplications(
            @RequestParam(required = false) Long jobId,
            @AuthenticationPrincipal CustomUserPrincipal principal) {
        List<ApplicationResponse> responses = applicationService.getEmployerApplications(principal.getId(), jobId);
        return ResponseEntity.ok(responses);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<ApplicationResponse> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateRequest request,
            @AuthenticationPrincipal CustomUserPrincipal principal) {
        ApplicationResponse response = applicationService.updateApplicationStatus(id, principal.getId(), request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('JOB_SEEKER')")
    public ResponseEntity<Map<String, String>> cancelApplication(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserPrincipal principal) {
        applicationService.cancelApplication(id, principal.getId());
        Map<String, String> response = new HashMap<>();
        response.put("message", "Application cancelled successfully");
        return ResponseEntity.ok(response);
    }
}
