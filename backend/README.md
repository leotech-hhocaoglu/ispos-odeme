# Backend

Spring Boot backend for authentication, payment orchestration, and İşPOS Sanal POS integration.

## Recommended Stack

- Java 21
- Spring Boot 3
- Spring Web
- Spring Security
- Bean Validation
- Actuator

## Responsibilities

- Authenticate users.
- Authorize payment access.
- Validate payment requests.
- Own all İşPOS credentials and request signing.
- Communicate with İşPOS/Sanal POS.
- Normalize provider responses for the frontend.
- Avoid logging sensitive payment data.

## Suggested Structure

```text
src/main/java/.../
  auth/
  payment/
  ispos/
  config/
  common/
src/main/resources/
  application.yml
```

## Environment

Read provider and security settings from environment variables documented in `.env.example`.

No production secret should be committed to this repository.
