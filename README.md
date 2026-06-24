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

## Docker Frontend Deployment

The frontend can be deployed as a Linux AMD64 Nginx image on host port `12016`:

```bash
docker compose up -d --build frontend
```

By default, Nginx serves the SPA and proxies `/api/*` to `http://host.docker.internal:8080`. Override `FRONTEND_HTTP_PORT` or `BACKEND_UPSTREAM` in your environment when the host port or backend address differs.

To build the AMD64 image locally and push it to the registry at `localhost:11081`:

```bash
docker buildx build --platform linux/amd64 -t localhost:11081/ispos-frontend:latest --push ./frontend
```

Run it on the host from the registry with Compose:

```bash
docker compose -f docker-compose.host.yml up -d
```

Or run it directly:

```bash
docker run -d --name ispos-frontend --restart unless-stopped -p 12016:80 --add-host=host.docker.internal:host-gateway -e BACKEND_UPSTREAM=http://host.docker.internal:8080 localhost:11081/ispos-frontend:latest
```
