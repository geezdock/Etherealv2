package com.ethereal.feedback.controller;

import com.ethereal.feedback.domain.FeedbackSession;
import com.ethereal.feedback.domain.Question;
import com.ethereal.feedback.dto.DTOs.CreateSessionRequest;
import com.ethereal.feedback.repository.SessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.SecureRandom;

@RestController
@RequestMapping("/api/sessions")
@CrossOrigin(origins = "http://localhost:5173")
public class SessionController {

    @Autowired
    private SessionRepository sessionRepository;

    private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final SecureRandom RANDOM = new SecureRandom();

    private String generateCode() {
        StringBuilder code;
        do {
            code = new StringBuilder(6);
            for (int i = 0; i < 6; i++) {
                code.append(CHARACTERS.charAt(RANDOM.nextInt(CHARACTERS.length())));
            }
        } while (sessionRepository.findByCode(code.toString()).isPresent());
        return code.toString();
    }

    @PostMapping
    public ResponseEntity<FeedbackSession> createSession(@RequestBody CreateSessionRequest request) {
        FeedbackSession session = new FeedbackSession();
        session.setHostName(request.getHostName());
        session.setTopic(request.getTopic());
        session.setCode(generateCode());

        if (request.getQuestions() != null) {
            for (var qDto : request.getQuestions()) {
                Question q = new Question();
                q.setText(qDto.getText());
                q.setType(qDto.getType());
                q.setSession(session);
                session.getQuestions().add(q);
            }
        }

        FeedbackSession saved = sessionRepository.save(session);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/{code}")
    public ResponseEntity<FeedbackSession> getSession(@PathVariable String code) {
        return sessionRepository.findByCode(code.toUpperCase())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PutMapping("/{code}/stop")
    public ResponseEntity<Void> stopSession(@PathVariable String code) {
        return sessionRepository.findByCode(code.toUpperCase()).map(session -> {
            session.setActive(false);
            sessionRepository.save(session);
            return ResponseEntity.ok().<Void>build();
        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }
}
