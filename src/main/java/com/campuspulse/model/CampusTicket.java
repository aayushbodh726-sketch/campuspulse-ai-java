package com.campuspulse.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tickets", indexes = {
    @Index(name = "idx_ticket_status", columnList = "status"),
    @Index(name = "idx_ticket_location_category", columnList = "location, category_id"),
    @Index(name = "idx_ticket_due_date", columnList = "resolution_deadline")
})
public class CampusTicket {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "ticket_number", nullable = false, unique = true, length = 32)
    private String ticketNumber;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "requester_id", nullable = false)
    private AppUser requester;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "category_id", nullable = false)
    private TicketCategory category;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "department_id", nullable = false)
    private Department department;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "assigned_staff_id")
    private AppUser assignedStaff;
    @Column(nullable = false, length = 120)
    private String title;
    @Column(nullable = false, length = 3000, columnDefinition = "TEXT")
    private String description;
    @Column(nullable = false, length = 140)
    private String location;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 20)
    private TicketImpact impact;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 20)
    private TicketUrgency urgency;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 20)
    private TicketPriority priority;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 24)
    private TicketStatus status = TicketStatus.SUBMITTED;
    @Column(name = "resolution_deadline", nullable = false)
    private LocalDateTime resolutionDeadline;
    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;
    @Column(name = "is_demo", nullable = false)
    private boolean demo;
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist void onCreate() { LocalDateTime now = LocalDateTime.now(); if (createdAt == null) createdAt = now; updatedAt = now; }
    @PreUpdate void onUpdate() { updatedAt = LocalDateTime.now(); }
    public CampusTicket() {}
    public Long getId() { return id; }
    public String getTicketNumber() { return ticketNumber; }
    public void setTicketNumber(String ticketNumber) { this.ticketNumber = ticketNumber; }
    public AppUser getRequester() { return requester; }
    public void setRequester(AppUser requester) { this.requester = requester; }
    public TicketCategory getCategory() { return category; }
    public void setCategory(TicketCategory category) { this.category = category; }
    public Department getDepartment() { return department; }
    public void setDepartment(Department department) { this.department = department; }
    public AppUser getAssignedStaff() { return assignedStaff; }
    public void setAssignedStaff(AppUser assignedStaff) { this.assignedStaff = assignedStaff; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public TicketImpact getImpact() { return impact; }
    public void setImpact(TicketImpact impact) { this.impact = impact; }
    public TicketUrgency getUrgency() { return urgency; }
    public void setUrgency(TicketUrgency urgency) { this.urgency = urgency; }
    public TicketPriority getPriority() { return priority; }
    public void setPriority(TicketPriority priority) { this.priority = priority; }
    public TicketStatus getStatus() { return status; }
    public void setStatus(TicketStatus status) { this.status = status; }
    public LocalDateTime getResolutionDeadline() { return resolutionDeadline; }
    public void setResolutionDeadline(LocalDateTime resolutionDeadline) { this.resolutionDeadline = resolutionDeadline; }
    public LocalDateTime getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(LocalDateTime resolvedAt) { this.resolvedAt = resolvedAt; }
    public boolean isDemo() { return demo; }
    public void setDemo(boolean demo) { this.demo = demo; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
