package com.campuspulse.service;

import com.campuspulse.model.*;
import org.junit.jupiter.api.Test;
import java.time.LocalDateTime;
import static org.junit.jupiter.api.Assertions.*;

class TicketPolicyTest {
    @Test void urgentSafetyIssueIsCritical() {
        assertEquals(TicketPriority.CRITICAL, TicketPolicy.suggestPriority("campus-safety", TicketImpact.SMALL_GROUP, TicketUrgency.URGENT));
    }
    @Test void widespreadRoutineIssueIsHigh() {
        assertEquals(TicketPriority.HIGH, TicketPolicy.suggestPriority("it-wifi", TicketImpact.CAMPUS, TicketUrgency.ROUTINE));
    }
    @Test void lowImpactRoutineIssueIsLow() {
        assertEquals(TicketPriority.LOW, TicketPolicy.suggestPriority("cleanliness", TicketImpact.INDIVIDUAL, TicketUrgency.ROUTINE));
    }
    @Test void transitionRulesPreventSkippingWorkflow() {
        assertTrue(TicketPolicy.canTransition(TicketStatus.SUBMITTED, TicketStatus.ACKNOWLEDGED));
        assertFalse(TicketPolicy.canTransition(TicketStatus.SUBMITTED, TicketStatus.CLOSED));
        assertTrue(TicketPolicy.canTransition(TicketStatus.RESOLVED, TicketStatus.REOPENED));
    }
    @Test void criticalDeadlineIsFourHours() {
        LocalDateTime now = LocalDateTime.of(2026, 10, 12, 9, 0);
        assertEquals(now.plusHours(4), TicketPolicy.deadline(TicketPriority.CRITICAL, now));
    }
}
