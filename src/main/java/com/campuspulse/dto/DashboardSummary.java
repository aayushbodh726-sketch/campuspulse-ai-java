package com.campuspulse.dto;

import com.campuspulse.model.CampusNotice;
import com.campuspulse.model.CampusTicket;
import com.campuspulse.model.TicketCategory;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record DashboardSummary(
    long total, long open, long resolved, long overdue, BigDecimal avgResolutionHours,
    List<CampusTicket> recentTickets, List<CategoryCount> categoryBreakdown,
    List<RecurringIssue> recurringIssues, List<CampusNotice> notices,
    List<TicketCategory> categories, boolean demoMode
) {
    public record CategoryCount(String name, long count) {}
    public record RecurringIssue(String categoryName, String location, long count, LocalDateTime latestReport) {}
}
