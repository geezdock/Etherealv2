package com.ethereal.feedback.security;

import io.github.bucket4j.Bucket;
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Refill;
import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class RateLimitFilter implements Filter {

    @org.springframework.beans.factory.annotation.Value("${ALLOWED_ORIGINS:http://localhost:5173}")
    private String allowedOrigins;

    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();

    // Create a bucket for a new IP
    private Bucket createNewBucket() {
        // Refill 60 tokens every minute, with a burst capacity of 60
        Bandwidth limit = Bandwidth.classic(60, Refill.intervally(60, Duration.ofMinutes(1)));
        return Bucket.builder()
                .addLimit(limit)
                .build();
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        // Apply rate limiting to API endpoints only, excluding OPTIONS requests
        if (httpRequest.getRequestURI().startsWith("/api/") && !"OPTIONS".equalsIgnoreCase(httpRequest.getMethod())) {
            String ip = httpRequest.getRemoteAddr();
            Bucket bucket = buckets.computeIfAbsent(ip, k -> createNewBucket());

            if (bucket.tryConsume(1)) {
                chain.doFilter(request, response);
            } else {
                httpResponse.setStatus(429); // Too Many Requests
                
                String origin = httpRequest.getHeader("Origin");
                String responseOrigin = allowedOrigins.split(",")[0];
                if (origin != null && java.util.Arrays.asList(allowedOrigins.split(",")).contains(origin)) {
                    responseOrigin = origin;
                }
                
                httpResponse.setHeader("Access-Control-Allow-Origin", responseOrigin);
                httpResponse.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
                httpResponse.setHeader("Access-Control-Allow-Headers", "*");
                httpResponse.setHeader("Access-Control-Allow-Credentials", "true");
                httpResponse.setContentType("application/json");
                httpResponse.getWriter().write("{\"error\": \"Atmospheric turbulence detected. Please slow down and breathe deep.\"}");
            }
        } else {
            chain.doFilter(request, response);
        }
    }
}
