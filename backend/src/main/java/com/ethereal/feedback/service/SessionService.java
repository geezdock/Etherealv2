package com.ethereal.feedback.service;

import com.ethereal.feedback.domain.FeedbackSession;
import com.ethereal.feedback.domain.Question;
import com.ethereal.feedback.repository.SessionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.Random;
import java.util.UUID;

@Service
public class SessionService {

    private final SessionRepository sessionRepository;

    public SessionService(SessionRepository sessionRepository) {
        this.sessionRepository = sessionRepository;
    }

    @Transactional
    public FeedbackSession createSession(FeedbackSession session) {
        session.setCode(generateUniqueCode());
        session.setHostToken(UUID.randomUUID().toString());
        
        // Set order index for questions
        if (session.getQuestions() != null) {
            for (int i = 0; i < session.getQuestions().size(); i++) {
                Question q = session.getQuestions().get(i);
                q.setSession(session);
                q.setOrderIndex(i);
            }
        }
        
        return sessionRepository.save(session);
    }

    public Optional<FeedbackSession> getSessionByCode(String code) {
        return sessionRepository.findByCode(code);
    }

    @Transactional
    public boolean stopSession(String code) {
        return sessionRepository.findByCode(code).map(session -> {
            session.setActive(false);
            sessionRepository.save(session);
            return true;
        }).orElse(false);
    }

    private String generateUniqueCode() {
        String chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        Random rnd = new Random();
        String code;
        do {
            StringBuilder sb = new StringBuilder(6);
            for (int i = 0; i < 6; i++) {
                sb.append(chars.charAt(rnd.nextInt(chars.length())));
            }
            code = sb.toString();
        } while (sessionRepository.findByCode(code).isPresent());
        return code;
    }
}
