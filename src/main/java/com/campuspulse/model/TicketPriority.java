package com.campuspulse.model;

public enum TicketPriority {
    LOW("Low"), MEDIUM("Medium"), HIGH("High"), CRITICAL("Critical");
    private final String label;
    TicketPriority(String label) { this.label = label; }
    public String getLabel() { return label; }
}
