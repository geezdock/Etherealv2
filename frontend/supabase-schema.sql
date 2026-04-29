  -- Supabase Schema for Ethereal Feedback App
  -- Run this in your Supabase SQL Editor

  -- Drop duplicate tables created by JPA auto-ddl (if they exist)
  -- JPA uses singular names by default, but our schema uses plural
  DROP TABLE IF EXISTS answer CASCADE;
  DROP TABLE IF EXISTS user_response CASCADE;
  DROP TABLE IF EXISTS question CASCADE;
  DROP TABLE IF EXISTS feedback_session CASCADE;

  -- Enable UUID extension
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

  -- Sessions table
  CREATE TABLE IF NOT EXISTS sessions (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(6) UNIQUE NOT NULL,
    host_name VARCHAR(100) NOT NULL,
    topic VARCHAR(255) NOT NULL,
    host_token UUID UNIQUE NOT NULL DEFAULT uuid_generate_v4(),
    active BOOLEAN DEFAULT true,
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );

  -- Questions table
  CREATE TABLE IF NOT EXISTS questions (
    id BIGSERIAL PRIMARY KEY,
    session_id BIGINT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('TEXT', 'RATING')),
    order_index INTEGER DEFAULT 0
  );

  -- Responses table
  CREATE TABLE IF NOT EXISTS responses (
    id BIGSERIAL PRIMARY KEY,
    session_id BIGINT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );

  -- Answers table
  CREATE TABLE IF NOT EXISTS answers (
    id BIGSERIAL PRIMARY KEY,
    response_id BIGINT NOT NULL REFERENCES responses(id) ON DELETE CASCADE,
    question_id BIGINT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    value TEXT NOT NULL
  );

  -- Indexes for better query performance
  DROP INDEX IF EXISTS idx_sessions_code;
  DROP INDEX IF EXISTS idx_sessions_host_token;
  DROP INDEX IF EXISTS idx_questions_session_id;
  DROP INDEX IF EXISTS idx_responses_session_id;
  DROP INDEX IF EXISTS idx_answers_response_id;
  DROP INDEX IF EXISTS idx_answers_question_id;

  CREATE INDEX idx_sessions_code ON sessions(code);
  CREATE INDEX idx_sessions_host_token ON sessions(host_token);
  CREATE INDEX idx_questions_session_id ON questions(session_id);
  CREATE INDEX idx_responses_session_id ON responses(session_id);
  CREATE INDEX idx_answers_response_id ON answers(response_id);
  CREATE INDEX idx_answers_question_id ON answers(question_id);

  -- Row Level Security Policies
  -- Reset RLS policies (drop existing first)
  DROP POLICY IF EXISTS "Anyone can read sessions" ON sessions;
  DROP POLICY IF EXISTS "Anyone can read all session data" ON sessions;
  DROP POLICY IF EXISTS "Anyone can create sessions" ON sessions;
  DROP POLICY IF EXISTS "Host can update own session" ON sessions;

  ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
  ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
  ALTER TABLE responses ENABLE ROW LEVEL SECURITY;
  ALTER TABLE answers ENABLE ROW LEVEL SECURITY;

  -- Sessions: Allow all operations for now
  CREATE POLICY "Public sessions access" ON sessions FOR ALL USING (true) WITH CHECK (true);

  -- Questions: Allow all operations
  DROP POLICY IF EXISTS "Anyone can read questions" ON questions;
  DROP POLICY IF EXISTS "Anyone can create questions" ON questions;
  DROP POLICY IF EXISTS "Host can update questions" ON questions;
  DROP POLICY IF EXISTS "Host can delete questions" ON questions;
  CREATE POLICY "Public questions access" ON questions FOR ALL USING (true) WITH CHECK (true);

  -- Responses: Allow all operations
  DROP POLICY IF EXISTS "Anyone can read responses" ON responses;
  DROP POLICY IF EXISTS "Anyone can create responses" ON responses;
  CREATE POLICY "Public responses access" ON responses FOR ALL USING (true) WITH CHECK (true);

  -- Answers: Allow all operations
  DROP POLICY IF EXISTS "Anyone can read answers" ON answers;
  DROP POLICY IF EXISTS "Anyone can create answers" ON answers;
  CREATE POLICY "Public answers access" ON answers FOR ALL USING (true) WITH CHECK (true);

  -- Create function to generate unique 6-character code
  CREATE OR REPLACE FUNCTION generate_session_code()
  RETURNS VARCHAR(6) AS $$
  DECLARE
    chars VARCHAR(36) := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    new_code VARCHAR(6);
    exists_code BOOLEAN;
  BEGIN
    LOOP
      SELECT string_agg(substring(chars FROM floor(random() * 36 + 1)::int FOR 1), '')
      INTO new_code
      FROM generate_series(1, 6);

      SELECT EXISTS(SELECT 1 FROM sessions WHERE sessions.code = new_code) INTO exists_code;
      IF NOT exists_code THEN
        RETURN new_code;
      END IF;
    END LOOP;
  END;
  $$ LANGUAGE plpgsql;

  -- Insert trigger for auto-generating code and host_token
  CREATE OR REPLACE FUNCTION set_session_code()
  RETURNS TRIGGER AS $$
  BEGIN
    IF NEW.code IS NULL OR NEW.code = '' THEN
      NEW.code := generate_session_code();
    END IF;
    IF NEW.host_token IS NULL THEN
      NEW.host_token := uuid_generate_v4();
    END IF;
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;

  DROP TRIGGER IF EXISTS before_insert_session ON sessions;

  CREATE TRIGGER before_insert_session
    BEFORE INSERT ON sessions
    FOR EACH ROW
    EXECUTE FUNCTION set_session_code();
