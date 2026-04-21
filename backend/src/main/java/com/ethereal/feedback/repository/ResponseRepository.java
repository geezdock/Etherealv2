package com.ethereal.feedback.repository;

import com.ethereal.feedback.domain.UserResponse;
import com.ethereal.feedback.domain.FeedbackSession;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ResponseRepository extends JpaRepository<UserResponse, Long> {
    List<UserResponse> findBySession(FeedbackSession session);
}
