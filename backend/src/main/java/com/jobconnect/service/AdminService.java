package com.jobconnect.service;

import com.jobconnect.dto.AdminUserUpdateRequest;
import com.jobconnect.dto.DashboardStatsResponse;
import com.jobconnect.dto.EmployerProfileResponse;
import com.jobconnect.dto.JobSeekerProfileResponse;
import com.jobconnect.entity.Role;
import com.jobconnect.entity.User;
import com.jobconnect.exception.BadRequestException;
import com.jobconnect.exception.ResourceNotFoundException;
import com.jobconnect.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final JobSeekerProfileRepository jobSeekerProfileRepository;
    private final EmployerProfileRepository employerProfileRepository;
    private final JobSeekerProfileService jobSeekerProfileService;
    private final EmployerProfileService employerProfileService;

    public AdminService(UserRepository userRepository,
                        JobRepository jobRepository,
                        ApplicationRepository applicationRepository,
                        JobSeekerProfileRepository jobSeekerProfileRepository,
                        EmployerProfileRepository employerProfileRepository,
                        JobSeekerProfileService jobSeekerProfileService,
                        EmployerProfileService employerProfileService) {
        this.userRepository = userRepository;
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
        this.jobSeekerProfileRepository = jobSeekerProfileRepository;
        this.employerProfileRepository = employerProfileRepository;
        this.jobSeekerProfileService = jobSeekerProfileService;
        this.employerProfileService = employerProfileService;
    }

    public DashboardStatsResponse getDashboardStats() {
        DashboardStatsResponse stats = new DashboardStatsResponse();

        long totalUsers = userRepository.count();
        long totalJobSeekers = userRepository.countUsersByRole(Role.JOB_SEEKER);
        long totalEmployers = userRepository.countUsersByRole(Role.EMPLOYER);
        long totalJobs = jobRepository.count();
        long activeJobs = jobRepository.countByStatus("ACTIVE");
        long totalApps = applicationRepository.count();
        long pendingApps = applicationRepository.countByStatus("Pending");
        long acceptedApps = applicationRepository.countByStatus("Accepted");
        long rejectedApps = applicationRepository.countByStatus("Rejected");
        long reviewedApps = applicationRepository.countByStatus("Reviewed");

        stats.setTotalUsers(totalUsers);
        stats.setTotalJobSeekers(totalJobSeekers);
        stats.setTotalEmployers(totalEmployers);
        stats.setTotalJobs(totalJobs);
        stats.setActiveJobs(activeJobs);
        stats.setTotalApplications(totalApps);
        stats.setPendingApplications(pendingApps);
        stats.setAcceptedApplications(acceptedApps);
        stats.setRejectedApplications(rejectedApps);
        stats.setReviewedApplications(reviewedApps);

        // Chart: Users by Role
        Map<String, Long> roleMap = new HashMap<>();
        roleMap.put("Job Seekers", totalJobSeekers);
        roleMap.put("Employers", totalEmployers);
        roleMap.put("Admins", userRepository.countUsersByRole(Role.ADMIN));
        stats.setUsersByRole(roleMap);

        // Chart: Application status
        Map<String, Long> statusMap = new HashMap<>();
        statusMap.put("Pending", pendingApps);
        statusMap.put("Reviewed", reviewedApps);
        statusMap.put("Accepted", acceptedApps);
        statusMap.put("Rejected", rejectedApps);
        stats.setApplicationsByStatus(statusMap);

        // Chart: Jobs by category
        Map<String, Long> jobsByCat = new HashMap<>();
        List<Object[]> catRows = jobRepository.countJobsByCategory();
        for (Object[] row : catRows) {
            if (row[0] != null) {
                jobsByCat.put((String) row[0], (Long) row[1]);
            }
        }
        stats.setJobsByCategory(jobsByCat);

        // Chart: Applications over time
        List<Object[]> timeRows = applicationRepository.countApplicationsOverTime();
        List<Map<String, Object>> timeList = new ArrayList<>();
        for (Object[] row : timeRows) {
            Map<String, Object> point = new HashMap<>();
            point.put("date", row[0]);
            point.put("count", row[1]);
            timeList.add(point);
        }
        stats.setApplicationsOverTime(timeList);

        return stats;
    }

    public List<User> getAllUsers(String search, String roleFilter) {
        List<User> users = userRepository.findAll();

        if (roleFilter != null && !roleFilter.isBlank() && !"ALL".equalsIgnoreCase(roleFilter)) {
            try {
                Role r = Role.valueOf(roleFilter.toUpperCase());
                users = users.stream().filter(u -> u.getRole() == r).collect(Collectors.toList());
            } catch (IllegalArgumentException ignored) {}
        }

        if (search != null && !search.isBlank()) {
            String query = search.trim().toLowerCase();
            users = users.stream()
                    .filter(u -> (u.getName() != null && u.getName().toLowerCase().contains(query)) ||
                                 (u.getEmail() != null && u.getEmail().toLowerCase().contains(query)) ||
                                 (u.getPhone() != null && u.getPhone().toLowerCase().contains(query)))
                    .collect(Collectors.toList());
        }

        return users;
    }

    @Transactional
    public User updateUser(Long userId, AdminUserUpdateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (request.getName() != null && !request.getName().isBlank()) {
            user.setName(request.getName().trim());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }
        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            user.setStatus(request.getStatus().toUpperCase());
        }
        if (request.getRole() != null) {
            user.setRole(request.getRole());
        }

        return userRepository.save(user);
    }

    @Transactional
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (user.getRole() == Role.JOB_SEEKER) {
            jobSeekerProfileService.deleteAccount(userId);
        } else if (user.getRole() == Role.EMPLOYER) {
            employerProfileService.deleteCompanyAccount(userId);
        } else {
            userRepository.delete(user);
        }
    }

    public List<JobSeekerProfileResponse> getAllJobSeekers() {
        return userRepository.findByRole(Role.JOB_SEEKER).stream()
                .map(u -> jobSeekerProfileService.getProfile(u.getId()))
                .collect(Collectors.toList());
    }

    public List<EmployerProfileResponse> getAllEmployers() {
        return userRepository.findByRole(Role.EMPLOYER).stream()
                .map(u -> employerProfileService.getProfile(u.getId()))
                .collect(Collectors.toList());
    }
}
