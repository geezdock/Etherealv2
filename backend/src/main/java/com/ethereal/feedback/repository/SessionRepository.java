package com.ethereal.feedback.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ethereal.feedback.domain.FeedbackSession;

public interface SessionRepository extends JpaRepository<FeedbackSession, Long> {
    Optional<FeedbackSession> findByCode(String code);
}

// Ensure the files are separated normally, but Java requires one public class per file.
// I will just put the second interface in the same package but not public, actually it's better to create a new file.
