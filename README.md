# UITGo API Gateway Service

API Gateway đóng vai trò là single entry point cho tất cả client requests, xử lý authentication, routing, và cross-cutting concerns.

## Tổng quan

Gateway service là điểm vào duy nhất của hệ thống UITGo, chịu trách nhiệm:
- **JWT Authentication**: Verify JWT tokens từ client, extract user context
- **Request Routing**: Route requests đến đúng microservice dựa trên path
- **Header Injection**: Thêm `X-User-Id` và `X-User-Role` headers cho downstream services
- **Correlation ID**: Generate và propagate `X-Request-Id` để trace requests
- **CORS**: Xử lý CORS cho web clients
- **Request Logging**: Log tất cả requests với timing và user context

## Kiến trúc

```
Client (Mobile/Web)
    ↓
API Gateway (gateway-service:3004)
    ↓ (JWT verification, routing)
    ├──→ auth-service (port 3000) - Authentication
    ├──→ user-service (port 3001) - User profile
    ├──→ trip-command-service (port 3002) - Trip write operations
    ├──→ trip-query-service (port 3003) - Trip read operations
    └──→ driver-stream (ports 8081/8082) - Driver location/status
```

## Endpoints

### Authentication Routes

- `POST /api/v1/sessions` - Login (proxy đến `auth-service/v1/auth/login`)
  - Public endpoint, không cần JWT
  - Body: `{ email, password }`
  - Returns: `{ accessToken, idToken, refreshToken, user }`

### User Routes

- `POST /api/v1/users` - Create user (proxy đến `user-service/v1/users`)
  - Public endpoint
  - Body: `{ authId, fullname, role }`
  
- `GET /api/v1/users/me` - Get current user profile
  - Requires JWT authentication
  - Gateway injects `X-User-Id` header từ JWT payload

### Trip Routes

**Write Operations** (proxy đến `trip-command-service`):
- `POST /api/v1/trips/quote` - Get fare quote
- `POST /api/v1/trips` - Create new trip
- `POST /api/v1/trips/:tripId/accept` - Driver accept trip (requires DRIVER role)
- `POST /api/v1/trips/:tripId/decline` - Driver decline trip
- `POST /api/v1/trips/:tripId/cancel` - Cancel trip
- `POST /api/v1/trips/:tripId/rate` - Rate trip
- `POST /api/v1/trips/:tripId/arrive-pickup` - Driver arrived at pickup
- `POST /api/v1/trips/:tripId/start` - Start trip
- `POST /api/v1/trips/:tripId/finish` - Finish trip

**Read Operations** (proxy đến `trip-query-service`):
- `GET /api/v1/trips/:tripId` - Get trip details (with Redis cache)
- `GET /api/v1/trips/users/:userId/trips` - Get user's trip history

### Driver Routes

- `GET /api/v1/drivers/nearby` - Find nearby drivers (proxy đến `driver-stream`)
  - Query params: `lat`, `lng`, `radius?`, `limit?`
  
- `POST /api/v1/drivers/:id/status` - Update driver status (ONLINE/OFFLINE)
  - Body: `{ status: "ONLINE" | "OFFLINE" }`
  
- `PUT /api/v1/drivers/:id/location` - Update driver location
  - Body: `{ lat, lng, speed?, heading?, ts? }`
  
- `GET /api/v1/drivers/:id/events` - SSE stream for driver assignment events
  - Server-Sent Events (SSE) stream

## JWT Authentication Flow

1. Client gửi request với `Authorization: Bearer <token>`
2. Gateway verify JWT với `JWT_SECRET`
3. Gateway extract `userId` và `role` từ JWT payload
4. Gateway inject headers:
   - `X-User-Id`: User ID từ JWT
   - `X-User-Role`: User role (PASSENGER/DRIVER) từ JWT
5. Gateway forward request đến downstream service với headers

## CQRS Routing Logic

Gateway tự động route requests dựa trên HTTP method:
- **Write operations** (POST, PUT, DELETE) → `trip-command-service`
- **Read operations** (GET) → `trip-query-service`

Điều này cho phép scale read và write operations độc lập.

## Environment Variables

```bash
PORT=3004                                    # Gateway port
JWT_SECRET=your-secret-key                   # Must match auth-service
AUTH_BASE_URL=http://auth-service:3000      # Auth service URL
USER_BASE_URL=http://user-service:3001      # User service URL
TRIP_COMMAND_BASE_URL=http://trip-command-service:3002  # Trip command service
TRIP_QUERY_BASE_URL=http://trip-query-service:3003      # Trip query service
DRIVER_STREAM_BASE_URL=http://driver-stream:8080       # Driver stream service
```

## Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run start:dev

# Build
npm run build

# Run in production mode
npm run start:prod
```

## Docker

```bash
# Build image
docker build -t uitgo-gateway .

# Run container
docker run -p 3004:3004 \
  -e JWT_SECRET=your-secret \
  -e AUTH_BASE_URL=http://auth-service:3000 \
  -e USER_BASE_URL=http://user-service:3001 \
  -e TRIP_COMMAND_BASE_URL=http://trip-command-service:3002 \
  -e TRIP_QUERY_BASE_URL=http://trip-query-service:3003 \
  -e DRIVER_STREAM_BASE_URL=http://driver-stream:8080 \
  uitgo-gateway
```

## Health Check

- `GET /healthz` - Health check endpoint
  - Returns: `{ status: "ok" }`

## Logging

Gateway logs tất cả requests với format:
```
METHOD /path - STATUS_CODE - DURATIONms - user=USER_ID - reqId=REQUEST_ID
```

Example:
```
POST /api/v1/trips - 201 - 245ms - user=u_pass_123 - reqId=abc-123-def
```

## Error Handling

- **401 Unauthorized**: JWT invalid hoặc missing
- **403 Forbidden**: User không có quyền (ví dụ: non-DRIVER gọi accept trip)
- **404 Not Found**: Route không tồn tại
- **500 Internal Server Error**: Downstream service error hoặc timeout

## Timeout

Gateway có HTTP client timeout 5s cho tất cả downstream calls. Nếu service không respond trong 5s, gateway trả về 504 Gateway Timeout.

## CORS

Gateway enable CORS với:
- Origin: `*` (development mode)
- Methods: `GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS`
- Headers: `Content-Type, Authorization`
- Exposed Headers: `X-Request-Id`

## Xem thêm

- **Kiến trúc tổng thể**: Xem [`../architecture/README.md`](../architecture/README.md) để hiểu toàn bộ hệ thống UITGo
- **ARCHITECTURE.md**: [`../architecture/ARCHITECTURE.md`](../architecture/ARCHITECTURE.md) - Kiến trúc chi tiết
- **REPORT.md**: [`../architecture/REPORT.md`](../architecture/REPORT.md) - Báo cáo Module A
