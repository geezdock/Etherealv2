package com.ethereal.feedback.exception;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGeneralException(Exception ex) {
        Map<String, String> response = new HashMap<>();
        response.put("error", "The void encountered a disturbance.");
        response.put("message", "We are recalibrating the sanctuary. Please try again in a moment.");
        response.put("debug", ex.getMessage());
        
        ex.printStackTrace();
        
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleBadRequest(IllegalArgumentException ex) {
        Map<String, String> response = new HashMap<>();
        response.put("error", "Invalid transmission.");
        response.put("message", ex.getMessage());
        
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }
}
