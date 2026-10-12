package com.campuspulse.service;

import com.campuspulse.dto.TicketForm;
import com.campuspulse.dto.TicketStatusForm;
import com.campuspulse.model.*;
import com.campuspulse.repository.*;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class TicketService {
    private final CampusTicketRepository tickets;
    private final TicketCategoryRepository categories;
    private final TicketHistoryRepository history;
    public TicketService(CampusTicketRepository tickets, TicketCategoryRepository categories, TicketHistoryRepository history) {
        this.tickets=tickets; this.categories=categories; this.history=history;
    }

    @Transactional(readOnly = true)
    public List<CampusTicket> visibleTickets(AppUser user) {
        if (user.getRole() == UserRole.ADMIN) return tickets.findAllByOrderByCreatedAtDesc();
        if (user.getRole() == UserRole.STAFF) {
            Map<Long, CampusTicket> merged = new LinkedHashMap<>();
            if (user.getDepartment() != null) tickets.findByDepartment_IdOrderByCreatedAtDesc(user.getDepartment().getId()).forEach(t -> merged.put(t.getId(), t));
            tickets.findByAssignedStaff_IdOrderByCreatedAtDesc(user.getId()).forEach(t -> merged.put(t.getId(), t));
            return merged.values().stream().sorted(Comparator.comparing(CampusTicket::getCreatedAt).reversed()).toList();
        }
        return tickets.findByRequester_IdOrderByCreatedAtDesc(user.getId());
    }

    @Transactional(readOnly = true)
    public CampusTicket findVisibleById(Long id, AppUser user) {
        CampusTicket ticket = tickets.findById(id).orElseThrow(() -> new NoSuchElementException("Ticket was not found."));
        if (!canAccess(ticket, user)) throw new AccessDeniedException("You do not have access to this ticket.");
        return ticket;
    }

    public boolean canAccess(CampusTicket ticket, AppUser user) {
        if (user.getRole() == UserRole.ADMIN) return true;
        if (user.getRole() == UserRole.STAFF) {
            return (user.getDepartment() != null && ticket.getDepartment().getId().equals(user.getDepartment().getId()))
                || (ticket.getAssignedStaff() != null && ticket.getAssignedStaff().getId().equals(user.getId()));
        }
        return ticket.getRequester().getId().equals(user.getId());
    }

    @Transactional
    public CampusTicket create(TicketForm form, AppUser requester) {
        TicketCategory category = categories.findById(form.getCategoryId())
            .filter(TicketCategory::isActive).orElseThrow(() -> new IllegalArgumentException("Choose an active issue category."));
        TicketPriority priority = TicketPolicy.suggestPriority(category.getSlug(), form.getImpact(), form.getUrgency());
        CampusTicket ticket = new CampusTicket();
        ticket.setTicketNumber("CP-" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")) + "-" + UUID.randomUUID().toString().substring(0, 5).toUpperCase(Locale.ROOT));
        ticket.setRequester(requester); ticket.setCategory(category); ticket.setDepartment(category.getDepartment());
        ticket.setTitle(form.getTitle().trim()); ticket.setDescription(form.getDescription().trim()); ticket.setLocation(form.getLocation().trim());
        ticket.setImpact(form.getImpact()); ticket.setUrgency(form.getUrgency()); ticket.setPriority(priority);
        ticket.setStatus(TicketStatus.SUBMITTED); ticket.setResolutionDeadline(TicketPolicy.deadline(priority, LocalDateTime.now()));
        ticket.setDemo(false);
        ticket = tickets.save(ticket);
        history.save(new TicketHistory(ticket, requester, null, TicketStatus.SUBMITTED, "Ticket submitted by student."));
        return ticket;
    }

    @Transactional
    public CampusTicket updateStatus(Long id, TicketStatusForm form, AppUser actor) {
        if (actor.getRole() != UserRole.STAFF && actor.getRole() != UserRole.ADMIN) {
            throw new AccessDeniedException("Only authorized staff can update ticket status.");
        }
        CampusTicket ticket = findVisibleById(id, actor);
        if (!TicketPolicy.canTransition(ticket.getStatus(), form.getStatus())) {
            throw new IllegalArgumentException("That status transition is not allowed from " + ticket.getStatus().getLabel() + ".");
        }
        TicketStatus old = ticket.getStatus();
        ticket.setStatus(form.getStatus());
        if (form.getStatus() == TicketStatus.RESOLVED) ticket.setResolvedAt(LocalDateTime.now());
        if (form.getStatus() == TicketStatus.REOPENED) { ticket.setResolvedAt(null); ticket.setResolutionDeadline(TicketPolicy.deadline(ticket.getPriority(), LocalDateTime.now())); }
        CampusTicket saved = tickets.save(ticket);
        String note = form.getNote() == null || form.getNote().isBlank() ? "Status changed to " + form.getStatus().getLabel().toLowerCase(Locale.ROOT) + "." : form.getNote().trim();
        history.save(new TicketHistory(saved, actor, old, form.getStatus(), note));
        return saved;
    }
}
