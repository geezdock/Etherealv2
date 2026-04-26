package com.ethereal.feedback.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ethereal.feedback.domain.UserResponse;
import com.ethereal.feedback.dto.DTOs.SubmitResponseRequest;
import com.ethereal.feedback.service.FeedbackService;

@RestController
@RequestMapping("/api/sessions/{code}/responses")
@CrossOrigin(origins = {"http://localhost:5173", "https://ethereal-v2.vercel.app"})
public class FeedbackController {

    private final FeedbackService feedbackService;

    public FeedbackController(FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }

    @PostMapping
    public ResponseEntity<Void> submitResponse(
            @PathVariable String code,
            @RequestBody SubmitResponseRequest request) {

        if (feedbackService.submitResponse(code, request.getAnswers())) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @GetMapping
    public ResponseEntity<List<UserResponse>> getResponses(
            @PathVariable String code,
            @RequestParam(value = "hostToken") String hostToken) {
        
        Optional<List<UserResponse>> responses = feedbackService.getResponses(code, hostToken);
        
        if (responses.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        
        List<UserResponse> list = responses.get();
        if (list == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        return ResponseEntity.ok(list);
    }
}
