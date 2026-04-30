package com.ethereal.feedback.exception;

public class AlreadySubmittedException extends RuntimeException {
    public AlreadySubmittedException(String message) { super(message); }
}
