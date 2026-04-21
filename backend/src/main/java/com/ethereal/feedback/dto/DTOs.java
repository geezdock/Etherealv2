package com.ethereal.feedback.dto;

import java.util.List;
import java.util.Map;

public class DTOs {

    public static class CreateSessionRequest {
        private String hostName;
        private String topic;
        private List<QuestionDto> questions;

        public String getHostName() { return hostName; }
        public void setHostName(String hostName) { this.hostName = hostName; }
        public String getTopic() { return topic; }
        public void setTopic(String topic) { this.topic = topic; }
        public List<QuestionDto> getQuestions() { return questions; }
        public void setQuestions(List<QuestionDto> questions) { this.questions = questions; }
    }

    public static class QuestionDto {
        private String text;
        private String type; // "TEXT" or "RATING"

        public String getText() { return text; }
        public void setText(String text) { this.text = text; }
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }
    }

    public static class SubmitResponseRequest {
        private Map<Long, String> answers;

        public Map<Long, String> getAnswers() { return answers; }
        public void setAnswers(Map<Long, String> answers) { this.answers = answers; }
    }
}
