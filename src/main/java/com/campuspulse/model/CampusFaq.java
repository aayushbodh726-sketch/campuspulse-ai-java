package com.campuspulse.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "campus_faqs")
public class CampusFaq {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(nullable = false, unique = true, length = 240) private String question;
    @Column(nullable = false, columnDefinition = "TEXT") private String answer;
    @Column(nullable = false, length = 80) private String category = "General";
    @Column(name = "is_published", nullable = false) private boolean published = true;
    @Column(nullable = false) private LocalDateTime updatedAt;
    @PrePersist @PreUpdate void onWrite() { updatedAt = LocalDateTime.now(); }
    public CampusFaq() {}
    public CampusFaq(String question, String answer, String category) { this.question=question; this.answer=answer; this.category=category; this.published=true; }
    public Long getId() { return id; }
    public String getQuestion() { return question; }
    public String getAnswer() { return answer; }
    public String getCategory() { return category; }
    public boolean isPublished() { return published; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
