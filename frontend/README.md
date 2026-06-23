# Frontend

TypeScript frontend for the İşPOS payment application.

## Required Pages

- `/auth`: authentication page
- `/payment`: authenticated payment page

## Recommended Stack

- React
- Vite
- TypeScript
- React Router

## Responsibilities

- Render authentication and payment flows.
- Guard `/payment` for authenticated users.
- Validate input for user feedback.
- Call only backend `/api` endpoints.
- Avoid storing or logging sensitive card data.

## Suggested Structure

```text
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

## Environment

Uses:

```text
VITE_API_BASE_URL=http://localhost:8080/api
```
