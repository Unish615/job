package com.jobconnect.dto;

import com.jobconnect.entity.Role;

public class AdminUserUpdateRequest {

    private String name;
    private String phone;
    private String status; // ACTIVE, SUSPENDED
    private Role role;

    public AdminUserUpdateRequest() {}

    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getPhone() {
        return phone;
    }
    public void setPhone(String phone) {
        this.phone = phone;
    }
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }
    public Role getRole() {
        return role;
    }
    public void setRole(Role role) {
        this.role = role;
    }
}
