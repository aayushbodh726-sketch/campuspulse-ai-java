package com.campuspulse.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ticket_history", indexes = @Index(name = "idx_history_ticket_created", columnList = "ticket_id, created_at"))
public class TicketHistory {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "ticket_id", nullable = false)
    private CampusTicket ticket;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "actor_id")
    private AppUser actor;
    @Enumerated(EnumType.STRING) @Column(name = "old_status", length = 24)
    private TicketStatus oldStatus;
    @Enumerated(EnumType.STRING) @Column(name = "new_status", nullable = false, length = 24)
    private TicketStatus newStatus;
    @Column(nullable = false, length = 500)
    private String note;
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    @PrePersist void onCreate() { createdAt = LocalDateTime.now(); }
    public TicketHistory() {}
    public TicketHistory(CampusTicket ticket, AppUser actor, TicketStatus oldStatus, TicketStatus newStatus, String note) { this.ticket=ticket; this.actor=actor; this.oldStatus=oldStatus; this.newStatus=newStatus; this.note=note; }
    public Long getId() { return id; }
    public CampusTicket getTicket() { return ticket; }
    public AppUser getActor() { return actor; }
    public TicketStatus getOldStatus() { return oldStatus; }
    public TicketStatus getNewStatus() { return newStatus; }
    public String getNote() { return note; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
