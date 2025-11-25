# UIT-Go API Gateway Service

This service acts as the single entrypoint for mobile clients.

## Features

- Centralized JWT verification (using `JWT_SECRET`).
- Public REST API under `/api/v1/*` for:
  - Auth (`/api/v1/sessions`)
  - Users (`/api/v1/users`, `/api/v1/users/me`)
  - Trips (`/api/v1/trips/*`)
  - Drivers (`/api/v1/drivers/*`)
- Proxies requests to internal microservices:
  - `auth-service` (login)
  - `user-service`
  - `trip-service`
  - `driver-stream` (status, location, SSE events)
- Adds `X-User-Id` and `X-User-Role` headers for downstream services.
- Correlation ID via `X-Request-Id` and basic request logging.
- HTTP client timeout (5s) for downstream calls.

## Environment variables

- `PORT` (default: 3003)
- `JWT_SECRET` (must match auth-service)
- `AUTH_BASE_URL` (default: `http://auth-service:3000`)
- `USER_BASE_URL` (default: `http://user-service:3001`)
- `TRIP_BASE_URL` (default: `http://trip-service:3002`)
- `DRIVER_STREAM_BASE_URL` (default: `http://driver-stream:8080`)
