package com.ethereal.feedback.service;

import com.ethereal.feedback.domain.Answer;
import com.ethereal.feedback.domain.Question;
import com.ethereal.feedback.domain.UserResponse;
import com.ethereal.feedback.repository.ResponseRepository;
import com.ethereal.feedback.repository.SessionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class FeedbackService {

    private final SessionRepository sessionRepository;
    private final ResponseRepository responseRepository;

    public FeedbackService(SessionRepository sessionRepository, ResponseRepository responseRepository) {
        this.sessionRepository = sessionRepository;
        this.responseRepository = responseRepository;
    }

    @Transactional
    public boolean submitResponse(String code, Map<Long, String> answers) {
        System.out.println("DEBUG: Submitting response for session: " + code);
        System.out.println("DEBUG: Received answers: " + answers);
        
        return sessionRepository.findByCode(code.toUpperCase()).map(session -> {
            if (!session.isActive()) {
                System.out.println("DEBUG: Session is NOT active");
                return false;
            }

            UserResponse userResponse = new UserResponse();
            userResponse.setSession(session);

            answers.forEach((questionId, value) -> {
                System.out.println("DEBUG: Processing questionId: " + questionId + ", value: " + value);
                Question question = session.getQuestions().stream()
                        .filter(q -> q.getId().equals(questionId))
                        .findFirst()
                        .orElse(null);

                if (question != null) {
                    System.out.println("DEBUG: Found question: " + question.getText());
                    Answer answer = new Answer();
                    answer.setResponse(userResponse);
                    answer.setQuestion(question);
                    answer.setValue(value);
                    userResponse.getAnswers().add(answer);
                } else {
                    System.out.println("DEBUG: Question NOT found for id: " + questionId);
                }
            });

            if (userResponse.getAnswers().isEmpty()) {
                System.out.println("DEBUG: No valid answers found, not saving response");
                return false;
            }

            responseRepository.save(userResponse);
            System.out.println("DEBUG: Response saved successfully");
            return true;
        }).orElseGet(() -> {
            System.out.println("DEBUG: Session not found for code: " + code);
            return false;
        });
    }

    public Optional<List<UserResponse>> getResponses(String code, String hostToken) {
        return sessionRepository.findByCode(code.toUpperCase()).map(session -> {
            if (!session.getHostToken().equals(hostToken)) {
                return null;
            }
            return responseRepository.findBySession(session);
        });
    }
}
