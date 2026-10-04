package com.jobconnect.dto;

public class EmployerProfileRequest {

    private String companyName;
    private String description;
    private String industry;
    private String location;
    private String website;
    private String companySize;
    private Integer foundedYear;
    private String phone;

    public EmployerProfileRequest() {}

    public String getCompanyName() {
        return companyName;
    }
    public void setCompanyName(String companyName) {
        this.companyName = companyName;
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
    public String getPhone() {
        return phone;
    }
    public void setPhone(String phone) {
        this.phone = phone;
    }
}
