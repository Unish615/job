package com.jobconnect.dto;

import java.time.LocalDateTime;

public class EmployerProfileResponse {

    private Long id;
    private Long userId;
    private String companyName;
    private String email;
    private String phone;
    private String logo;
    private String description;
    private String industry;
    private String location;
    private String website;
    private String companySize;
    private Integer foundedYear;
    private long totalJobs;
    private long activeJobs;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public EmployerProfileResponse() {}

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public Long getUserId() {
        return userId;
    }
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    public String getCompanyName() {
        return companyName;
    }
    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getPhone() {
        return phone;
    }
    public void setPhone(String phone) {
        this.phone = phone;
    }
    public String getLogo() {
        return logo;
    }
    public void setLogo(String logo) {
        this.logo = logo;
    }
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }
    public String getIndustry() {
        return industry;
    }
    public void setIndustry(String industry) {
        this.industry = industry;
    }
    public String getLocation() {
        return location;
    }
    public void setLocation(String location) {
        this.location = location;
    }
    public String getWebsite() {
        return website;
    }
    public void setWebsite(String website) {
        this.website = website;
    }
    public String getCompanySize() {
        return companySize;
    }
    public void setCompanySize(String companySize) {
        this.companySize = companySize;
    }
    public Integer getFoundedYear() {
        return foundedYear;
    }
    public void setFoundedYear(Integer foundedYear) {
        this.foundedYear = foundedYear;
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
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
