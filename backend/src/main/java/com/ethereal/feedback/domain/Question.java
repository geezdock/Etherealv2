package com.ethereal.feedback.domain;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    @JsonIgnore
    private FeedbackSession session;

    @Column(nullable = false)
    private String text;

    @Column(nullable = false)
    private String type; // "TEXT" or "RATING"

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public FeedbackSession getSession() { return session; }
    public void setSession(FeedbackSession session) { this.session = session; }
    public String getText() { return text; }
    public void setText(String text) { this.text = text; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
}
