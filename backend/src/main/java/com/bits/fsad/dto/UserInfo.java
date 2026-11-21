package com.bits.fsad.dto;

import com.bits.fsad.entity.Role;

public class UserInfo {
    private Long userId;
    private String username;
    private Role role;
    private String fullName;
    private String email;
    private Boolean isActive;

    public UserInfo() {}

    public UserInfo(Long userId, String username, Role role, String fullName, String email) {
        this.userId = userId;
        this.username = username;
        this.role = role;
        this.fullName = fullName;
        this.email = email;
    }

    public UserInfo(Long userId, String username, Role role, String fullName, String email, Boolean isActive) {
        this.userId = userId;
        this.username = username;
        this.role = role;
        this.fullName = fullName;
        this.email = email;
        this.isActive = isActive;
    }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
}
