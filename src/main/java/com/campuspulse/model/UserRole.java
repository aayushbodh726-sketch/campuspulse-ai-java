package com.campuspulse.model;

public enum UserRole {
    STUDENT("Student"), STAFF("Staff"), ADMIN("Administrator");
    private final String label;
    UserRole(String label) { this.label = label; }
    public String getLabel() { return label; }
}
