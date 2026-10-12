package com.campuspulse.controller;

import com.campuspulse.dto.DashboardSummary;
import com.campuspulse.dto.TicketForm;
import com.campuspulse.model.*;
import com.campuspulse.repository.*;
import com.campuspulse.service.*;
import jakarta.validation.Valid;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import java.util.List;
import java.util.Locale;

@Controller
public class WebController {
    private final CurrentUserService currentUserService;
    private final DashboardService dashboardService;
    private final TicketService ticketService;
    private final TicketHistoryRepository history;
    private final TicketCategoryRepository categories;
    private final CampusNoticeRepository notices;
    private final AppUserRepository users;
    private final DepartmentRepository departments;

    public WebController(CurrentUserService currentUserService, DashboardService dashboardService, TicketService ticketService,
                         TicketHistoryRepository history, TicketCategoryRepository categories, CampusNoticeRepository notices,
                         AppUserRepository users, DepartmentRepository departments) {
        this.currentUserService=currentUserService; this.dashboardService=dashboardService; this.ticketService=ticketService;
        this.history=history; this.categories=categories; this.notices=notices; this.users=users; this.departments=departments;
    }

    @GetMapping("/login")
    public String login() { return "login"; }

    @GetMapping("/")
    public String dashboard(Model model) {
        AppUser user = currentUserService.requireCurrentUser();
        addDashboard(model, dashboardService.build(user));
        return "dashboard";
    }

    @GetMapping("/tickets")
    public String tickets(@RequestParam(required = false, defaultValue = "") String q, Model model) {
        AppUser user = currentUserService.requireCurrentUser();
        String search = q.trim().toLowerCase(Locale.ROOT);
        List<CampusTicket> list = ticketService.visibleTickets(user).stream()
            .filter(t -> search.isBlank() || (t.getTicketNumber()+" "+t.getTitle()+" "+t.getLocation()+" "+t.getCategory().getName()+" "+t.getStatus().getLabel()).toLowerCase(Locale.ROOT).contains(search))
            .toList();
        model.addAttribute("tickets", list); model.addAttribute("q", q);
        return "tickets";
    }

    @GetMapping("/tickets/new")
    public String newTicket(Model model) {
        model.addAttribute("ticketForm", new TicketForm());
        model.addAttribute("categories", categories.findByActiveTrueOrderByNameAsc());
        model.addAttribute("impacts", TicketImpact.values());
        model.addAttribute("urgencies", TicketUrgency.values());
        return "ticket-form";
    }

    @PostMapping("/tickets")
    public String createTicket(@Valid @ModelAttribute("ticketForm") TicketForm form, BindingResult result, Model model,
                               RedirectAttributes redirect) {
        if (result.hasErrors()) {
            model.addAttribute("categories", categories.findByActiveTrueOrderByNameAsc());
            model.addAttribute("impacts", TicketImpact.values());
            model.addAttribute("urgencies", TicketUrgency.values());
            return "ticket-form";
        }
        try {
            CampusTicket ticket = ticketService.create(form, currentUserService.requireCurrentUser());
            redirect.addFlashAttribute("successMessage", "Report submitted successfully. Ticket " + ticket.getTicketNumber() + ".");
            return "redirect:/tickets/" + ticket.getId();
        } catch (IllegalArgumentException ex) {
            model.addAttribute("categories", categories.findByActiveTrueOrderByNameAsc());
            model.addAttribute("impacts", TicketImpact.values());
            model.addAttribute("urgencies", TicketUrgency.values());
            model.addAttribute("formError", ex.getMessage());
            return "ticket-form";
        }
    }

    @GetMapping("/tickets/{id}")
    public String ticketDetail(@PathVariable Long id, Model model, RedirectAttributes redirect) {
        try {
            AppUser user = currentUserService.requireCurrentUser();
            CampusTicket ticket = ticketService.findVisibleById(id, user);
            model.addAttribute("ticket", ticket);
            model.addAttribute("history", history.findByTicket_IdOrderByCreatedAtDesc(id));
            model.addAttribute("statusForm", new com.campuspulse.dto.TicketStatusForm());
            model.addAttribute("canUpdate", user.getRole() == UserRole.STAFF || user.getRole() == UserRole.ADMIN);
            model.addAttribute("allowedStatuses", java.util.Arrays.stream(TicketStatus.values()).filter(s -> TicketPolicy.canTransition(ticket.getStatus(), s)).toList());
            return "ticket-detail";
        } catch (AccessDeniedException ex) {
            redirect.addFlashAttribute("errorMessage", ex.getMessage());
            return "redirect:/tickets";
        }
    }

    @PostMapping("/tickets/{id}/status")
    public String updateStatus(@PathVariable Long id, @Valid @ModelAttribute("statusForm") com.campuspulse.dto.TicketStatusForm form,
                               BindingResult result, RedirectAttributes redirect) {
        if (result.hasErrors()) {
            redirect.addFlashAttribute("errorMessage", "Choose a valid next status and try again.");
            return "redirect:/tickets/" + id;
        }
        try {
            CampusTicket ticket = ticketService.updateStatus(id, form, currentUserService.requireCurrentUser());
            redirect.addFlashAttribute("successMessage", "Ticket status updated to " + ticket.getStatus().getLabel() + ".");
        } catch (IllegalArgumentException | AccessDeniedException ex) {
            redirect.addFlashAttribute("errorMessage", ex.getMessage());
        }
        return "redirect:/tickets/" + id;
    }

    @GetMapping("/insights")
    public String insights(Model model) {
        addDashboard(model, dashboardService.build(currentUserService.requireCurrentUser()));
        return "insights";
    }

    @GetMapping("/notices")
    public String noticePage(Model model) {
        model.addAttribute("notices", notices.findByPublishedTrueOrderByPublishedAtDesc());
        return "notices";
    }

    private void addDashboard(Model model, DashboardSummary summary) {
        model.addAttribute("summary", summary);
        model.addAttribute("total", summary.total());
        model.addAttribute("openCount", summary.open());
        model.addAttribute("resolvedCount", summary.resolved());
        model.addAttribute("overdueCount", summary.overdue());
        model.addAttribute("avgResolutionHours", summary.avgResolutionHours());
        model.addAttribute("recentTickets", summary.recentTickets());
        model.addAttribute("categoryBreakdown", summary.categoryBreakdown());
        model.addAttribute("recurringIssues", summary.recurringIssues());
        model.addAttribute("notices", summary.notices());
        model.addAttribute("categories", summary.categories());
        model.addAttribute("demoMode", summary.demoMode());
    }
}
