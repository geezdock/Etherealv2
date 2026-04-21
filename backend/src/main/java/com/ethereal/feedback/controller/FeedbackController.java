package com.ethereal.feedback.controller;

import com.ethereal.feedback.domain.Answer;
import com.ethereal.feedback.domain.FeedbackSession;
import com.ethereal.feedback.domain.Question;
import com.ethereal.feedback.domain.UserResponse;
import com.ethereal.feedback.dto.DTOs.SubmitResponseRequest;
import com.ethereal.feedback.repository.ResponseRepository;
import com.ethereal.feedback.repository.SessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sessions/{code}/responses")
@CrossOrigin(origins = "http://localhost:5173")
public class FeedbackController {

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private ResponseRepository responseRepository;

    @PostMapping
    public ResponseEntity<Void> submitResponse(
            @PathVariable String code,
            @RequestBody SubmitResponseRequest request) {

        return sessionRepository.findByCode(code.toUpperCase()).map(session -> {
            if (!session.isActive()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).<Void>build(); // 400
            }

            UserResponse userResponse = new UserResponse();
            userResponse.setSession(session);

            request.getAnswers().forEach((questionId, value) -> {
                Question question = session.getQuestions().stream()
                        .filter(q -> q.getId().equals(questionId))
                        .findFirst()
                        .orElse(null);

                if (question != null) {
                    Answer answer = new Answer();
                    answer.setResponse(userResponse);
                    answer.setQuestion(question);
                    answer.setValue(value);
                    userResponse.getAnswers().add(answer);
                }
            });

            responseRepository.save(userResponse);
            return ResponseEntity.ok().<Void>build();
        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @GetMapping
    public ResponseEntity<List<UserResponse>> getResponses(@PathVariable String code) {
        return sessionRepository.findByCode(code.toUpperCase()).map(session -> {
            List<UserResponse> responses = responseRepository.findBySession(session);
            return ResponseEntity.ok(responses);
        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }
}
