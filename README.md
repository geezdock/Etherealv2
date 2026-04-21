# Ethereal

A premium sanctuary for anonymous thoughts. No friction, no heavy structures. Just an atmospheric space for honest communication.

## Overview

Ethereal is a web application for collecting and sharing anonymous feedback. It features a modern React frontend and a robust Spring Boot backend, making it easy to create, join, and respond to feedback sessions securely and intuitively.

## Features

- 🌟 Create and join feedback sessions with unique codes
- 📝 Submit responses anonymously
- 📊 Dashboard for viewing aggregated feedback
- ⚡ Fast, modern UI built with React, Vite, and Tailwind CSS
- 🔒 Secure backend powered by Spring Boot and JPA

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, Framer Motion, React Router, Axios
- **Backend:** Spring Boot, Spring Data JPA, H2/PostgreSQL
- **Build Tools:** Maven, ESLint

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- Java 17+
- Maven

### Installation

#### Backend

```bash
cd backend
mvn spring-boot:run
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173` and the backend at `http://localhost:8080`.

## Usage

1. Visit the landing page.
2. Create a new feedback session or join an existing one using a session code.
3. Share the session code with participants.
4. Collect and view responses in real time.

## Folder Structure

```
backend/   # Spring Boot backend
frontend/  # React frontend (Vite + Tailwind)
```

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

MIT

---

Let me know if you want to customize any section or add more details!
