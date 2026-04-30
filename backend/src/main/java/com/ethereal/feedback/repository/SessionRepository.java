package com.ethereal.feedback.repository;

import com.ethereal.feedback.domain.FeedbackSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;

public interface SessionRepository extends JpaRepository<FeedbackSession, Long> {
    @Query("SELECT s FROM FeedbackSession s LEFT JOIN FETCH s.questions WHERE s.code = :code")
    Optional<FeedbackSession> findByCode(@Param("code") String code);
}

// Ensure the files are separated normally, but Java requires one public class per file.
// I will just put the second interface in the same package but not public, actually it's better to create a new file.
