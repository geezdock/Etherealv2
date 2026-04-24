package com.ethereal.feedback.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ethereal.feedback.domain.FeedbackSession;
import com.ethereal.feedback.domain.Question;
import com.ethereal.feedback.dto.DTOs.CreateSessionRequest;
import com.ethereal.feedback.service.SessionService;

@RestController
@RequestMapping("/api/sessions")
public class SessionController {

    private final SessionService sessionService;

    public SessionController(SessionService sessionService) {
        this.sessionService = sessionService;
    }

    @PostMapping
    public ResponseEntity<FeedbackSession> createSession(@RequestBody CreateSessionRequest request) {
        FeedbackSession session = new FeedbackSession();
        session.setHostName(request.getHostName());
        session.setTopic(request.getTopic());

        if (request.getQuestions() != null) {
            for (var qDto : request.getQuestions()) {
                Question q = new Question();
                q.setText(qDto.getText());
                q.setType(qDto.getType());
                session.getQuestions().add(q);
            }
        }

        FeedbackSession saved = sessionService.createSession(session);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/{code}")
    public ResponseEntity<FeedbackSession> getSession(@PathVariable String code) {
        return sessionService.getSessionByCode(code.toUpperCase())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PutMapping("/{code}/stop")
    public ResponseEntity<Void> stopSession(@PathVariable String code) {
        if (sessionService.stopSession(code.toUpperCase())) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
}
