package com.jobconnect.controller;

import com.jobconnect.dto.EmployerProfileRequest;
import com.jobconnect.dto.EmployerProfileResponse;
import com.jobconnect.security.CustomUserPrincipal;
import com.jobconnect.service.EmployerProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/employer")
public class EmployerProfileController {

    private final EmployerProfileService employerProfileService;

    public EmployerProfileController(EmployerProfileService employerProfileService) {
        this.employerProfileService = employerProfileService;
    }

    @GetMapping("/profile")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<EmployerProfileResponse> getProfile(
            @AuthenticationPrincipal CustomUserPrincipal principal) {
        EmployerProfileResponse response = employerProfileService.getProfile(principal.getId());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/profile")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<EmployerProfileResponse> createOrUpdateProfile(
            @RequestBody EmployerProfileRequest request,
            @AuthenticationPrincipal CustomUserPrincipal principal) {
        EmployerProfileResponse response = employerProfileService.updateProfile(principal.getId(), request);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/profile")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<EmployerProfileResponse> updateProfile(
            @RequestBody EmployerProfileRequest request,
            @AuthenticationPrincipal CustomUserPrincipal principal) {
        EmployerProfileResponse response = employerProfileService.updateProfile(principal.getId(), request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/profile/logo")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<EmployerProfileResponse> uploadLogo(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal CustomUserPrincipal principal) {
        EmployerProfileResponse response = employerProfileService.uploadLogo(principal.getId(), file);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/profile")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<Map<String, String>> deleteAccount(
            @AuthenticationPrincipal CustomUserPrincipal principal) {
        employerProfileService.deleteCompanyAccount(principal.getId());
        Map<String, String> response = new HashMap<>();
        response.put("message", "Employer company account deleted successfully");
        return ResponseEntity.ok(response);
    }

    // Public Companies Directory
    @GetMapping("/companies")
    public ResponseEntity<List<EmployerProfileResponse>> getAllCompanies(
            @RequestParam(required = false) String search) {
        List<EmployerProfileResponse> list = employerProfileService.getAllCompanies(search);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/companies/{id}")
    public ResponseEntity<EmployerProfileResponse> getCompanyById(@PathVariable Long id) {
        EmployerProfileResponse response = employerProfileService.getCompanyById(id);
        return ResponseEntity.ok(response);
    }
}
