package com.campuspulse.service;

import com.campuspulse.model.*;
import java.time.LocalDateTime;
import java.util.EnumSet;
import java.util.Map;
import java.util.Set;

public final class TicketPolicy {
    private static final Map<TicketStatus, Set<TicketStatus>> TRANSITIONS = Map.of(
        TicketStatus.SUBMITTED, EnumSet.of(TicketStatus.ACKNOWLEDGED, TicketStatus.ASSIGNED, TicketStatus.CANCELLED),
        TicketStatus.ACKNOWLEDGED, EnumSet.of(TicketStatus.ASSIGNED, TicketStatus.IN_PROGRESS, TicketStatus.CANCELLED),
        TicketStatus.ASSIGNED, EnumSet.of(TicketStatus.IN_PROGRESS, TicketStatus.CANCELLED),
        TicketStatus.IN_PROGRESS, EnumSet.of(TicketStatus.RESOLVED, TicketStatus.ASSIGNED, TicketStatus.CANCELLED),
        TicketStatus.RESOLVED, EnumSet.of(TicketStatus.CLOSED, TicketStatus.REOPENED),
        TicketStatus.CLOSED, EnumSet.of(TicketStatus.REOPENED),
        TicketStatus.REOPENED, EnumSet.of(TicketStatus.ASSIGNED, TicketStatus.IN_PROGRESS, TicketStatus.CANCELLED),
        TicketStatus.CANCELLED, EnumSet.noneOf(TicketStatus.class)
    );
    private TicketPolicy() {}

    public static TicketPriority suggestPriority(String categorySlug, TicketImpact impact, TicketUrgency urgency) {
        if ("campus-safety".equals(categorySlug) && urgency == TicketUrgency.URGENT) return TicketPriority.CRITICAL;
        if (urgency == TicketUrgency.URGENT || impact == TicketImpact.CAMPUS || impact == TicketImpact.MANY) return TicketPriority.HIGH;
        if (urgency == TicketUrgency.SOON || impact == TicketImpact.SMALL_GROUP) return TicketPriority.MEDIUM;
        return TicketPriority.LOW;
    }

    public static LocalDateTime deadline(TicketPriority priority, LocalDateTime now) {
        int hours = switch (priority) { case CRITICAL -> 4; case HIGH -> 24; case MEDIUM -> 72; case LOW -> 120; };
        return now.plusHours(hours);
    }

    public static boolean canTransition(TicketStatus from, TicketStatus to) {
        return from != null && to != null && TRANSITIONS.getOrDefault(from, Set.of()).contains(to);
    }
}
