package com.campuspulse.model;

public enum TicketUrgency {
    ROUTINE("Routine"), SOON("Needs attention soon"), URGENT("Urgent");
    private final String label;
    TicketUrgency(String label) { this.label = label; }
    public String getLabel() { return label; }
}
