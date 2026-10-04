package com.jobconnect.dto;

import java.util.List;
import java.util.Map;

public class DashboardStatsResponse {

    // General / Admin stats
    private long totalUsers;
    private long totalJobSeekers;
    private long totalEmployers;
    private long totalJobs;
    private long activeJobs;
    private long totalApplications;
    private long pendingApplications;
    private long acceptedApplications;
    private long rejectedApplications;
    private long reviewedApplications;
    private long savedJobsCount;

    // Profile Completion (for job seeker)
    private int profileCompletionPercentage;

    // Chart Data (for Admin / Employer)
    private Map<String, Long> applicationsByStatus;
    private Map<String, Long> jobsByCategory;
    private Map<String, Long> usersByRole;
    private List<Map<String, Object>> applicationsOverTime;

    public DashboardStatsResponse() {}

    public long getTotalUsers() {
        return totalUsers;
    }
    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }
    public long getTotalJobSeekers() {
        return totalJobSeekers;
    }
    public void setTotalJobSeekers(long totalJobSeekers) {
        this.totalJobSeekers = totalJobSeekers;
    }
    public long getTotalEmployers() {
        return totalEmployers;
    }
    public void setTotalEmployers(long totalEmployers) {
        this.totalEmployers = totalEmployers;
    }
    public long getTotalJobs() {
        return totalJobs;
    }
    public void setTotalJobs(long totalJobs) {
        this.totalJobs = totalJobs;
    }
    public long getActiveJobs() {
        return activeJobs;
    }
    public void setActiveJobs(long activeJobs) {
        this.activeJobs = activeJobs;
    }
    public long getTotalApplications() {
        return totalApplications;
    }
    public void setTotalApplications(long totalApplications) {
        this.totalApplications = totalApplications;
    }
    public long getPendingApplications() {
        return pendingApplications;
    }
    public void setPendingApplications(long pendingApplications) {
        this.pendingApplications = pendingApplications;
    }
    public long getAcceptedApplications() {
        return acceptedApplications;
    }
    public void setAcceptedApplications(long acceptedApplications) {
        this.acceptedApplications = acceptedApplications;
    }
    public long getRejectedApplications() {
        return rejectedApplications;
    }
    public void setRejectedApplications(long rejectedApplications) {
        this.rejectedApplications = rejectedApplications;
    }
    public long getReviewedApplications() {
        return reviewedApplications;
    }
    public void setReviewedApplications(long reviewedApplications) {
        this.reviewedApplications = reviewedApplications;
    }
    public long getSavedJobsCount() {
        return savedJobsCount;
    }
    public void setSavedJobsCount(long savedJobsCount) {
        this.savedJobsCount = savedJobsCount;
    }
    public int getProfileCompletionPercentage() {
        return profileCompletionPercentage;
    }
    public void setProfileCompletionPercentage(int profileCompletionPercentage) {
        this.profileCompletionPercentage = profileCompletionPercentage;
    }
    public Map<String, Long> getApplicationsByStatus() {
        return applicationsByStatus;
    }
    public void setApplicationsByStatus(Map<String, Long> applicationsByStatus) {
        this.applicationsByStatus = applicationsByStatus;
    }
    public Map<String, Long> getJobsByCategory() {
        return jobsByCategory;
    }
    public void setJobsByCategory(Map<String, Long> jobsByCategory) {
        this.jobsByCategory = jobsByCategory;
    }
    public Map<String, Long> getUsersByRole() {
        return usersByRole;
    }
    public void setUsersByRole(Map<String, Long> usersByRole) {
        this.usersByRole = usersByRole;
    }
    public List<Map<String, Object>> getApplicationsOverTime() {
        return applicationsOverTime;
    }
    public void setApplicationsOverTime(List<Map<String, Object>> applicationsOverTime) {
        this.applicationsOverTime = applicationsOverTime;
    }
}
