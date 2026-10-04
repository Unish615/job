package com.jobconnect.controller;

import com.jobconnect.dto.JobSeekerProfileRequest;
import com.jobconnect.dto.JobSeekerProfileResponse;
import com.jobconnect.security.CustomUserPrincipal;
import com.jobconnect.service.JobSeekerProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/job-seekers/profile")
@PreAuthorize("hasRole('JOB_SEEKER')")
public class JobSeekerProfileController {

    private final JobSeekerProfileService profileService;

    public JobSeekerProfileController(JobSeekerProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping
    public ResponseEntity<JobSeekerProfileResponse> getProfile(
            @AuthenticationPrincipal CustomUserPrincipal principal) {
        JobSeekerProfileResponse response = profileService.getProfile(principal.getId());
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<JobSeekerProfileResponse> createOrUpdateProfile(
            @RequestBody JobSeekerProfileRequest request,
            @AuthenticationPrincipal CustomUserPrincipal principal) {
        JobSeekerProfileResponse response = profileService.updateProfile(principal.getId(), request);
        return ResponseEntity.ok(response);
    }

    @PutMapping
    public ResponseEntity<JobSeekerProfileResponse> updateProfile(
            @RequestBody JobSeekerProfileRequest request,
            @AuthenticationPrincipal CustomUserPrincipal principal) {
        JobSeekerProfileResponse response = profileService.updateProfile(principal.getId(), request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/resume")
    public ResponseEntity<JobSeekerProfileResponse> uploadResume(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal CustomUserPrincipal principal) {
        JobSeekerProfileResponse response = profileService.uploadCV(principal.getId(), file);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/resume")
    public ResponseEntity<JobSeekerProfileResponse> removeResume(
            @AuthenticationPrincipal CustomUserPrincipal principal) {
        JobSeekerProfileResponse response = profileService.removeCV(principal.getId());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/avatar")
    public ResponseEntity<JobSeekerProfileResponse> uploadAvatar(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal CustomUserPrincipal principal) {
        JobSeekerProfileResponse response = profileService.uploadProfileImage(principal.getId(), file);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping
    public ResponseEntity<Map<String, String>> deleteAccount(
            @AuthenticationPrincipal CustomUserPrincipal principal) {
        profileService.deleteAccount(principal.getId());
        Map<String, String> response = new HashMap<>();
        response.put("message", "Job seeker account deleted successfully");
        return ResponseEntity.ok(response);
    }
}
