# Architecture Decisions

## ADR-001: TypeScript Frontend And Spring Backend

Status: Accepted

The application will use a TypeScript frontend and Spring Boot backend.

Reasoning:

- TypeScript gives typed UI request/response models.
- Spring Boot provides mature validation, security, and integration support.
- Keeping the payment provider behind the backend prevents credential exposure.

## ADR-002: Two Initial User-Facing Pages

Status: Accepted

The first frontend version will expose only:

- `/auth`
- `/payment`

Reasoning:

- This keeps the first implementation focused on the payment flow.
- Operational dashboards, refunds, reports, and saved cards are separate concerns.

## ADR-003: Backend-Only İşPOS Integration

Status: Accepted

The browser must never communicate directly with İşPOS using merchant credentials.

Reasoning:

- Merchant secrets must stay server-side.
- Provider request signing belongs in backend code.
- Payment status normalization is easier to test and evolve server-side.
