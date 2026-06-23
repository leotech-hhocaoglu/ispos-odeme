# Setup

## Prerequisites

Recommended:

- Node.js 22 LTS or newer
- Java 21
- Spring Boot 3
- Gradle or Maven

## Environment

Create local environment configuration from `.env.example`.

Required groups:

- Frontend API base URL
- Backend server settings
- Auth/session settings
- İşPOS sandbox or production settings

## Suggested Frontend Creation

```bash
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install
npm run dev
```

Expected routes:

- `/auth`
- `/payment`

## Suggested Backend Creation

Use Spring Initializr or an equivalent generator with:

- Spring Web
- Spring Security
- Validation
- Configuration Processor
- Actuator

Suggested package areas:

- `auth`
- `payment`
- `ispos`
- `config`
- `common`

## Local Development Flow

1. Start the backend API.
2. Start the frontend dev server.
3. Log in at `/auth`.
4. Submit a sandbox payment from `/payment`.
5. Verify payment status through backend logs and `/api/payments/{paymentId}`.

## Provider Setup Checklist

- Confirm current İşPOS sandbox endpoint.
- Confirm current request fields.
- Confirm hash/signature algorithm.
- Confirm 3D Secure flow.
- Confirm callback/return URL requirements.
- Confirm sandbox test card rules.
- Store all secrets outside source control.
