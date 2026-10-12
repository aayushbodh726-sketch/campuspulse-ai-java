package com.campuspulse.model;

public enum TicketStatus {
    SUBMITTED("Submitted"), ACKNOWLEDGED("Acknowledged"), ASSIGNED("Assigned"),
    IN_PROGRESS("In progress"), RESOLVED("Resolved"), CLOSED("Closed"),
    REOPENED("Reopened"), CANCELLED("Cancelled");
    private final String label;
    TicketStatus(String label) { this.label = label; }
    public String getLabel() { return label; }
}
