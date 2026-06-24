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

## Frontend Docker Deployment

Build and run the Linux AMD64 Nginx-hosted frontend on host port `12016`:

```bash
docker compose up -d --build frontend
```

The container serves the React/Vite static build on port `80`, mapped to host port `12016` by `docker-compose.yml`.

Default deployment values:

```text
FRONTEND_HTTP_PORT=12016
BACKEND_UPSTREAM=http://host.docker.internal:8080
```

Use `BACKEND_UPSTREAM` to point Nginx at the Spring API service. The frontend is built with `VITE_API_BASE_URL=/api`, so browser requests stay same-origin and Nginx forwards `/api/*` to the backend.

### Build AMD64 Image For Registry

Use this when building on your local machine and pushing the image to the registry at `localhost:11081`:

```bash
docker buildx build --platform linux/amd64 -t localhost:11081/ispos-frontend:latest --push ./frontend
```

Run it on the host from the registry with Compose:

```bash
docker compose -f docker-compose.host.yml up -d
```

The host Compose file pulls `localhost:11081/ispos-frontend:latest` and maps it to host port `12016`.

Alternatively, run it directly:

```bash
docker run -d \
  --name ispos-frontend \
  --restart unless-stopped \
  -p 12016:80 \
  --add-host=host.docker.internal:host-gateway \
  -e BACKEND_UPSTREAM=http://host.docker.internal:8080 \
  localhost:11081/ispos-frontend:latest
```

If the backend runs on the same Linux host, replace `BACKEND_UPSTREAM` with the backend address reachable from the container, for example `http://172.17.0.1:8080` or a Docker network service name.

## Provider Setup Checklist

- Confirm current İşPOS sandbox endpoint.
- Confirm current request fields.
- Confirm hash/signature algorithm.
- Confirm 3D Secure flow.
- Confirm callback/return URL requirements.
- Confirm sandbox test card rules.
- Store all secrets outside source control.
