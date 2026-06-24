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
- Keep İşPOS merchant fields and credentials out of browser code.
- Support backend-provided 3D Secure redirects.
- Show centered web-sourced payment infrastructure logos from local frontend
  assets in the payment footer.
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

For the Nginx Docker image, the app is built with:

```text
VITE_API_BASE_URL=/api
```

Nginx then proxies `/api/*` to `BACKEND_UPSTREAM`, which defaults to `http://host.docker.internal:8080`.

Build and push a Linux AMD64 image to the registry at `localhost:11081`:

```bash
docker buildx build --platform linux/amd64 -t localhost:11081/ispos-frontend:latest --push .
```
