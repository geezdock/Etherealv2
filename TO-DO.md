
# Full Overhaul Plan (15 fixes)

## High Priority (5 fixes)

1. Remove debug statements from FeedbackService.java (8+ System.out.println calls)
2. Fix GlobalExceptionHandler - Remove stack trace exposure and debug messages to clients
3. Fix race condition - Make session code generation atomic using database constraints
4. Add input validation - Use @Valid and @NotBlank/@Size annotations on backend DTOs
5. Fix Respond.jsx - Add user-facing error messages instead of silent failures

## Medium Priority (7 fixes)

1. Fix FetchType.EAGER → LAZY on Answer.question and FeedbackSession.questions
2. Fix Dashboard.jsx - Handle realtime subscription errors
3. Fix JoinSession.jsx - Differentiate network errors from "session not found"
4. Add .env.example files for both frontend and backend
5. Add session expiry logic to backend (currently only frontend checks expires_at)
6. Add pagination to responses endpoint
7. Switch to Flyway - Replace ddl-auto=update with proper migrations

## Low Priority (3 fixes)

1. Unify CORS config - Use either WebConfig or @CrossOrigin, not both
2. Fix Google Fonts - Change http:// to https://
3. Remove unused axios dependency from package.json
