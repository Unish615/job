package com.jobconnect.controller;

import com.jobconnect.dto.*;
import com.jobconnect.entity.User;
import com.jobconnect.security.CustomUserPrincipal;
import com.jobconnect.service.AdminService;
import com.jobconnect.service.ApplicationService;
import com.jobconnect.service.JobService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;
    private final JobService jobService;
    private final ApplicationService applicationService;

    public AdminController(AdminService adminService,
                           JobService jobService,
                           ApplicationService applicationService) {
        this.adminService = adminService;
        this.jobService = jobService;
        this.applicationService = applicationService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardStatsResponse> getDashboardStats() {
        DashboardStatsResponse stats = adminService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String role) {
        List<User> users = adminService.getAllUsers(search, role);
        return ResponseEntity.ok(users);
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<User> updateUser(
            @PathVariable Long id,
            @RequestBody AdminUserUpdateRequest request) {
        User updated = adminService.updateUser(id, request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Map<String, String>> deleteUser(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserPrincipal principal) {
        if (principal.getId().equals(id)) {
            Map<String, String> err = new HashMap<>();
            err.put("message", "Cannot delete your own admin account");
            return ResponseEntity.badRequest().body(err);
        }
        adminService.deleteUser(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "User deleted successfully");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/job-seekers")
    public ResponseEntity<List<JobSeekerProfileResponse>> getAllJobSeekers() {
        return ResponseEntity.ok(adminService.getAllJobSeekers());
    }

    @GetMapping("/employers")
    public ResponseEntity<List<EmployerProfileResponse>> getAllEmployers() {
        return ResponseEntity.ok(adminService.getAllEmployers());
    }

    @GetMapping("/jobs")
    public ResponseEntity<Page<JobResponse>> getAllJobs(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String jobType,
            @RequestParam(required = false) String location,
            @RequestParam(defaultValue = "latest") String sortBy,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {
        Page<JobResponse> jobs = jobService.searchJobs(keyword, category, jobType, location, null, sortBy, page, size, null);
        return ResponseEntity.ok(jobs);
    }

    @DeleteMapping("/jobs/{id}")
    public ResponseEntity<Map<String, String>> deleteJob(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserPrincipal principal) {
        jobService.deleteJob(id, principal.getId());
        Map<String, String> response = new HashMap<>();
        response.put("message", "Job listing removed successfully by admin");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/applications")
    public ResponseEntity<List<ApplicationResponse>> getAllApplications() {
        List<ApplicationResponse> list = applicationService.getAllApplications();
        return ResponseEntity.ok(list);
    }
}
