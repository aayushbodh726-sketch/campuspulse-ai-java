package com.campuspulse.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "campus_notices")
public class CampusNotice {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(nullable = false, length = 140) private String title;
    @Column(nullable = false, columnDefinition = "TEXT") private String body;
    @Column(nullable = false, length = 60) private String category = "Guidance";
    @Column(nullable = false) private LocalDateTime publishedAt;
    private LocalDateTime expiresAt;
    @Column(nullable = false) private boolean published = true;
    @PrePersist void onCreate() { if (publishedAt == null) publishedAt = LocalDateTime.now(); }
    public CampusNotice() {}
    public CampusNotice(String title, String body, String category) { this.title=title; this.body=body; this.category=category; this.published=true; }
    public Long getId() { return id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title=title; }
    public String getBody() { return body; }
    public void setBody(String body) { this.body=body; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category=category; }
    public LocalDateTime getPublishedAt() { return publishedAt; }
    public LocalDateTime getExpiresAt() { return expiresAt; }
    public boolean isPublished() { return published; }
    public void setPublished(boolean published) { this.published=published; }
}
