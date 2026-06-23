# ispos-odeme

Payment screen project for İşbankası İşPOS Sanal POS support.

## Scope

This project is intended to provide:

- A TypeScript frontend with two initial pages: authentication and payment.
- A Spring Boot backend that owns authentication, validation, and İşPOS integration.
- Documentation for architecture, API contracts, setup, and security.

## Planned Structure

```text
.
├── frontend/              # TypeScript frontend application
├── backend/               # Spring Boot backend application
├── docs/                  # Project documentation
├── AGENTS.md              # Agent/developer implementation guidance
└── .env.example           # Required environment variables
```

## Frontend

Recommended stack:

- React
- Vite
- TypeScript
- React Router

Initial routes:

- `/auth`: user authentication screen
- `/payment`: authenticated payment screen

## Backend

Recommended stack:

- Java 21
- Spring Boot 3
- Spring Security
- Bean Validation

The backend is the only layer that should communicate with İşPOS/Sanal POS.

## Documentation

- [Product requirements](docs/product-requirements.md)
- [Architecture](docs/architecture.md)
- [API contract](docs/api-contract.md)
- [İşPOS integration notes](docs/ispos-integration.md)
- [Security](docs/security.md)
- [Setup](docs/setup.md)

## Configuration

Copy `.env.example` to your local environment configuration and fill in provider-specific values.

Never commit real İşPOS credentials, merchant keys, passwords, tokens, or production callback secrets.
