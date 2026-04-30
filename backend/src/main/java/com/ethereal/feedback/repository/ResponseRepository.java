package com.ethereal.feedback.repository;

import com.ethereal.feedback.domain.UserResponse;
import com.ethereal.feedback.domain.FeedbackSession;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

import java.util.Optional;

public interface ResponseRepository extends JpaRepository<UserResponse, Long> {
    List<UserResponse> findBySession(FeedbackSession session);
    Optional<UserResponse> findBySessionAndSubmitterIp(FeedbackSession session, String submitterIp);
}
