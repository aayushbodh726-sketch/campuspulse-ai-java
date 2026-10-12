package com.campuspulse.model;

public enum TicketImpact {
    INDIVIDUAL("Just me"), SMALL_GROUP("A small group"), MANY("Many students"), CAMPUS("Campus-wide");
    private final String label;
    TicketImpact(String label) { this.label = label; }
    public String getLabel() { return label; }
}
