# AGENTS.md

## Project Mission

Build a secure payment application for İşbankası İşPOS Sanal POS flows.

The product has two user-facing frontend pages:

1. **Auth page**: authenticate an operator or merchant user before payment access.
2. **Payment page**: collect payment details and initiate a card payment through the backend.

The frontend must be TypeScript-based. The backend must be Spring-based.

## Target Architecture

- `frontend/`: TypeScript single-page application.
- `backend/`: Spring Boot API service.
- `docs/`: product, architecture, API, security, and setup documentation.

Recommended defaults:

- Frontend: React + Vite + TypeScript.
- Backend: Java 21 + Spring Boot 3 + Maven.
- API style: REST JSON between frontend and backend.
- Payment provider boundary: only the backend communicates with İşPOS/Sanal POS services.

## Non-Negotiable Security Rules

- Do not send İşPOS merchant credentials to the browser.
- Do not log card PAN, CVV, full expiry, İşPOS secrets, session tokens, or authentication passwords.
- Do not persist CVV under any condition.
- Prefer provider-hosted 3D Secure or redirect/tokenization flows whenever available.
- Keep card handling isolated to the payment page and backend payment endpoint.
- Store all secrets in environment variables or a secrets manager.
- Add validation on both frontend and backend.
- Use HTTPS outside local development.

## Frontend Requirements

The frontend must contain exactly these initial routes:

- `/auth`
- `/payment`

Expected behavior:

- Unauthenticated users are redirected to `/auth`.
- Authenticated users can access `/payment`.
- Payment submission calls the backend only; it must never call İşPOS directly.
- UI should be simple, accessible, responsive, and focused on completing payment safely.

Suggested source layout:

```text
frontend/
  src/
    app/
    pages/
      AuthPage.tsx
      PaymentPage.tsx
    components/
    services/
      api.ts
      auth.ts
      payments.ts
    types/
```

## Backend Requirements

The backend must expose APIs for:

- Authentication.
- Current authenticated session/user lookup.
- Payment initiation.
- Optional payment callback/return handling if İşPOS requires it.

The backend owns:

- İşPOS request signing/hash generation.
- İşPOS credentials and merchant configuration.
- Payment status normalization.
- Server-side validation.
- Audit-safe transaction logging.

Suggested source layout:

```text
backend/
  src/main/java/.../
    auth/
    payment/
    ispos/
    config/
    common/
  src/main/resources/
    application.yml
```

## İşPOS Integration Guidance

Treat İşPOS/Sanal POS integration details as provider-specific and verify them against the current official İşbank documentation before implementation.

The project should keep provider logic behind an internal interface, for example:

```java
public interface PaymentGateway {
    PaymentResult initiatePayment(PaymentRequest request);
}
```

This keeps İşPOS-specific hashing, request fields, URLs, sandbox settings, and response parsing separate from business/payment controller code.

## Documentation Rules

When changing product behavior or public API contracts, update:

- `README.md`
- `docs/product-requirements.md`
- `docs/architecture.md`
- `docs/api-contract.md`
- `docs/ispos-integration.md`
- `docs/security.md`
- `.env.example` when configuration changes

## Development Standards

- Keep frontend and backend validation rules aligned.
- Use typed request/response models on both sides.
- Add tests for payment validation, auth guards, and gateway response parsing.
- Keep provider credentials out of source control.
- Prefer small, explicit modules over broad utility files.

## Initial Definition Of Done

- Auth page exists and can establish a local authenticated session.
- Payment page exists and requires authentication.
- Backend exposes auth and payment endpoints.
- Payment endpoint delegates provider-specific work to an İşPOS adapter/service.
- Configuration is documented in `.env.example`.
- Security-sensitive handling is covered in `docs/security.md`.
