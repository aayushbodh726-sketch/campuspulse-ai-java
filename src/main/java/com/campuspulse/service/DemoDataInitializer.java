package com.campuspulse.service;

import com.campuspulse.model.*;
import com.campuspulse.repository.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;

@Component
public class DemoDataInitializer implements CommandLineRunner {
    private final DepartmentRepository departments;
    private final TicketCategoryRepository categories;
    private final AppUserRepository users;
    private final CampusTicketRepository tickets;
    private final TicketHistoryRepository history;
    private final CampusNoticeRepository notices;
    private final CampusFaqRepository faqs;
    private final PasswordEncoder encoder;
    @Value("${app.demo.seed:true}") private boolean seedDemo;

    public DemoDataInitializer(DepartmentRepository departments, TicketCategoryRepository categories, AppUserRepository users,
      CampusTicketRepository tickets, TicketHistoryRepository history, CampusNoticeRepository notices,
      CampusFaqRepository faqs, PasswordEncoder encoder) {
        this.departments=departments; this.categories=categories; this.users=users; this.tickets=tickets; this.history=history;
        this.notices=notices; this.faqs=faqs; this.encoder=encoder;
    }

    @Override @Transactional
    public void run(String... args) {
        if (!seedDemo) return;
        Department it = department("IT Services", "it-services");
        Department facilities = department("Facilities & Maintenance", "facilities");
        Department housekeeping = department("Housekeeping", "housekeeping");
        Department admin = department("Campus Administration", "administration");
        TicketCategory wifi = category("IT & Wi-Fi", "it-wifi", it);
        TicketCategory classroom = category("Classroom Equipment", "classroom-equipment", facilities);
        TicketCategory hostel = category("Hostel Maintenance", "hostel-maintenance", facilities);
        TicketCategory clean = category("Cleanliness & Sanitation", "cleanliness", housekeeping);
        category("Campus Safety", "campus-safety", admin);
        category("Other Campus Service", "other-service", admin);

        AppUser student = user("student@campuspulse.local", "Student123!", "Demo Student", UserRole.STUDENT, null);
        user("staff@campuspulse.local", "Staff123!", "Demo IT Staff", UserRole.STAFF, it);
        user("admin@campuspulse.local", "Admin123!", "Demo Administrator", UserRole.ADMIN, admin);

        if (notices.count() == 0) {
            notices.save(new CampusNotice("Welcome to the CampusPulse preview", "This is a demonstration notice. Replace sample content with verified campus announcements before a real-world rollout.", "Platform"));
            notices.save(new CampusNotice("How to report a campus issue", "Choose the closest category, add the building or room, explain what happened, and select impact and urgency. Do not include passwords or sensitive personal information.", "Guidance"));
            notices.save(new CampusNotice("A transparent resolution journey", "Each ticket records its status changes so the appropriate student and campus team can follow progress.", "How it works"));
        }
        if (faqs.count() == 0) {
            faqs.save(new CampusFaq("How do I report a campus issue?", "Open Report an issue, choose a category and location, describe the problem clearly, and submit. Keep the ticket number to follow progress.", "Getting started"));
            faqs.save(new CampusFaq("What details should I include in a report?", "Include a short title, relevant location, what happened, and who or what is affected. Do not include passwords, government identifiers, or unnecessary private information.", "Tickets"));
            faqs.save(new CampusFaq("How is ticket priority calculated?", "CampusPulse uses explainable rules based on category, urgency, and impact. Staff should review suggested priorities, especially safety-related reports.", "Tickets"));
            faqs.save(new CampusFaq("What does in progress mean?", "The responsible campus team has started working on the issue. Check the ticket timeline for the most recent recorded update.", "Tickets"));
        }
        if (tickets.count() == 0) {
            createDemoTicket(student, wifi, "Wi-Fi drops during lab sessions", "Sample record: intermittent connection reported in a shared computer lab.", "Block B · Computer Lab", TicketImpact.MANY, TicketUrgency.SOON, TicketStatus.IN_PROGRESS, 7, 2);
            createDemoTicket(student, classroom, "Projector not starting", "Sample record: classroom projector does not power on.", "Academic Block · Room 204", TicketImpact.MANY, TicketUrgency.SOON, TicketStatus.ACKNOWLEDGED, 24, 1);
            createDemoTicket(student, hostel, "Water leak near wash area", "Sample record: water is collecting near a hostel wash area and needs inspection.", "Hostel Block A · Ground Floor", TicketImpact.SMALL_GROUP, TicketUrgency.URGENT, TicketStatus.SUBMITTED, 1, 0);
            createDemoTicket(student, clean, "Waste bin needs clearing", "Sample record: a waste bin is full in a shared student area.", "Student Centre · First Floor", TicketImpact.SMALL_GROUP, TicketUrgency.ROUTINE, TicketStatus.RESOLVED, 48, 12);
            createDemoTicket(student, wifi, "Connection drops in the same lab", "Sample record: a similar connectivity concern has been reported in this laboratory before.", "Block B · Computer Lab", TicketImpact.MANY, TicketUrgency.SOON, TicketStatus.SUBMITTED, 0, 0);
        }
    }

    private Department department(String name, String slug) { return departments.findBySlug(slug).orElseGet(() -> departments.save(new Department(name, slug))); }
    private TicketCategory category(String name, String slug, Department department) { return categories.findBySlug(slug).orElseGet(() -> categories.save(new TicketCategory(name, slug, department))); }
    private AppUser user(String email, String password, String name, UserRole role, Department department) {
        return users.findByEmailIgnoreCase(email).orElseGet(() -> users.save(new AppUser(email, encoder.encode(password), name, role, department)));
    }
    private void createDemoTicket(AppUser student, TicketCategory category, String title, String desc, String location, TicketImpact impact, TicketUrgency urgency, TicketStatus status, int createdHoursAgo, int resolvedHoursAgo) {
        TicketPriority priority = TicketPolicy.suggestPriority(category.getSlug(), impact, urgency);
        LocalDateTime created = LocalDateTime.now().minusHours(createdHoursAgo);
        CampusTicket ticket = new CampusTicket();
        ticket.setTicketNumber("CP-DEMO-" + (1001 + tickets.count())); ticket.setRequester(student); ticket.setCategory(category); ticket.setDepartment(category.getDepartment());
        ticket.setTitle(title); ticket.setDescription(desc); ticket.setLocation(location); ticket.setImpact(impact); ticket.setUrgency(urgency); ticket.setPriority(priority);
        ticket.setStatus(status); ticket.setResolutionDeadline(TicketPolicy.deadline(priority, created)); ticket.setDemo(true); ticket.setCreatedAt(created);
        if (status == TicketStatus.RESOLVED || status == TicketStatus.CLOSED) ticket.setResolvedAt(LocalDateTime.now().minusHours(Math.max(1, resolvedHoursAgo)));
        ticket = tickets.save(ticket);
        TicketHistory submitted = new TicketHistory(ticket, student, null, TicketStatus.SUBMITTED, "Sample history record for demonstration only.");
        submitted.setCreatedAt(created); history.save(submitted);
        if (status != TicketStatus.SUBMITTED) {
            TicketHistory changed = new TicketHistory(ticket, student, TicketStatus.SUBMITTED, status, "Sample status history for demonstration only.");
            changed.setCreatedAt(created.plusMinutes(Math.min(30, Math.max(0, createdHoursAgo)))); history.save(changed);
        }
    }
}
