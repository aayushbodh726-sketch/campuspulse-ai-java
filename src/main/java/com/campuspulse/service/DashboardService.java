package com.campuspulse.service;

import com.campuspulse.dto.DashboardSummary;
import com.campuspulse.model.*;
import com.campuspulse.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {
    private final CampusTicketRepository tickets;
    private final TicketCategoryRepository categories;
    private final CampusNoticeRepository notices;
    private final TicketService ticketService;
    public DashboardService(CampusTicketRepository tickets, TicketCategoryRepository categories, CampusNoticeRepository notices, TicketService ticketService) {
        this.tickets=tickets; this.categories=categories; this.notices=notices; this.ticketService=ticketService;
    }

    @Transactional(readOnly = true)
    public DashboardSummary build(AppUser viewer) {
        List<CampusTicket> all = tickets.findAllByOrderByCreatedAtDesc();
        List<CampusTicket> visible = ticketService.visibleTickets(viewer);
        LocalDateTime now = LocalDateTime.now();
        List<CampusTicket> done = all.stream().filter(t -> t.getResolvedAt() != null).toList();
        BigDecimal avg = done.isEmpty() ? BigDecimal.ZERO : BigDecimal.valueOf(done.stream().mapToLong(t -> Math.max(0, Duration.between(t.getCreatedAt(), t.getResolvedAt()).toMinutes())).average().orElse(0) / 60.0).setScale(1, RoundingMode.HALF_UP);
        long open = all.stream().filter(t -> !EnumSet.of(TicketStatus.RESOLVED, TicketStatus.CLOSED, TicketStatus.CANCELLED).contains(t.getStatus())).count();
        long resolved = all.stream().filter(t -> t.getStatus() == TicketStatus.RESOLVED || t.getStatus() == TicketStatus.CLOSED).count();
        long overdue = all.stream().filter(t -> !EnumSet.of(TicketStatus.RESOLVED, TicketStatus.CLOSED, TicketStatus.CANCELLED).contains(t.getStatus()) && t.getResolutionDeadline().isBefore(now)).count();

        List<DashboardSummary.CategoryCount> breakdown = all.stream().collect(Collectors.groupingBy(t -> t.getCategory().getName(), Collectors.counting()))
            .entrySet().stream().map(e -> new DashboardSummary.CategoryCount(e.getKey(), e.getValue())).sorted(Comparator.comparingLong(DashboardSummary.CategoryCount::count).reversed()).toList();
        Map<String, List<CampusTicket>> grouped = all.stream().filter(t -> t.getCreatedAt().isAfter(now.minusDays(90)))
            .collect(Collectors.groupingBy(t -> t.getCategory().getSlug() + "|" + t.getLocation().trim().toLowerCase(Locale.ROOT)));
        List<DashboardSummary.RecurringIssue> recurring = grouped.values().stream().filter(group -> group.size() > 1)
            .map(group -> new DashboardSummary.RecurringIssue(group.get(0).getCategory().getName(), group.get(0).getLocation(), group.size(), group.stream().map(CampusTicket::getCreatedAt).max(Comparator.naturalOrder()).orElse(now)))
            .sorted(Comparator.comparingLong(DashboardSummary.RecurringIssue::count).reversed()).limit(8).toList();
        boolean demo = all.stream().anyMatch(CampusTicket::isDemo);
        List<CampusNotice> publishedNotices = notices.findByPublishedTrueOrderByPublishedAtDesc().stream()
            .filter(n -> n.getExpiresAt() == null || n.getExpiresAt().isAfter(now)).limit(5).toList();
        return new DashboardSummary(all.size(), open, resolved, overdue, avg, visible.stream().limit(8).toList(), breakdown, recurring, publishedNotices, categories.findByActiveTrueOrderByNameAsc(), demo);
    }
}
