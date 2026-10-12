package com.campuspulse.dto;

import com.campuspulse.model.TicketImpact;
import com.campuspulse.model.TicketUrgency;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class TicketForm {
    @NotBlank @Size(min = 6, max = 120)
    private String title;
    @NotBlank @Size(min = 15, max = 3000)
    private String description;
    @NotBlank @Size(min = 2, max = 140)
    private String location;
    @NotNull private Long categoryId;
    @NotNull private TicketImpact impact = TicketImpact.INDIVIDUAL;
    @NotNull private TicketUrgency urgency = TicketUrgency.ROUTINE;
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
    public TicketImpact getImpact() { return impact; }
    public void setImpact(TicketImpact impact) { this.impact = impact; }
    public TicketUrgency getUrgency() { return urgency; }
    public void setUrgency(TicketUrgency urgency) { this.urgency = urgency; }
}
