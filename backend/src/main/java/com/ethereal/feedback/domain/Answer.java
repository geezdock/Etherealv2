package com.ethereal.feedback.domain;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "answer")
public class Answer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "response_id", nullable = false)
    @JsonIgnore
    private UserResponse response;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    @Column(name = "answer_value", nullable = false, length = 1000)
    private String value; // Text answer or "1" to "5" for rating

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public UserResponse getResponse() { return response; }
    public void setResponse(UserResponse response) { this.response = response; }
    public Question getQuestion() { return question; }
    public void setQuestion(Question question) { this.question = question; }
    public String getValue() { return value; }
    public void setValue(String value) { this.value = value; }
}
