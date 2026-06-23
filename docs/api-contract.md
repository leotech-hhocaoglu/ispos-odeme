# API Contract

Base path: `/api`

All request and response bodies are JSON unless a provider redirect form is explicitly required.

## Error Shape

```json
{
  "code": "VALIDATION_ERROR",
  "message": "Request is invalid.",
  "details": [
    {
      "field": "amount",
      "message": "Amount must be greater than zero."
    }
  ]
}
```

## Auth

### POST `/api/auth/login`

Authenticates a user.

Request:

```json
{
  "username": "operator@example.com",
  "password": "password"
}
```

Response:

```json
{
  "user": {
    "id": "usr_123",
    "username": "operator@example.com",
    "roles": ["PAYMENT_OPERATOR"]
  },
  "accessToken": "token-or-null-when-cookie-session-is-used"
}
```

### POST `/api/auth/logout`

Ends the current session.

Response:

```json
{
  "success": true
}
```

### GET `/api/auth/me`

Returns the current authenticated user.

Response:

```json
{
  "id": "usr_123",
  "username": "operator@example.com",
  "roles": ["PAYMENT_OPERATOR"]
}
```

Unauthenticated response: `401 Unauthorized`.

## Payments

### POST `/api/payments`

Initiates a payment.

Request:

```json
{
  "orderReference": "ORD-2026-0001",
  "amount": "125.50",
  "currency": "TRY",
  "card": {
    "holderName": "Ada Lovelace",
    "number": "4111111111111111",
    "expiryMonth": "12",
    "expiryYear": "2030",
    "cvv": "123"
  }
}
```

Response for approved payment:

```json
{
  "paymentId": "pay_123",
  "orderReference": "ORD-2026-0001",
  "status": "APPROVED",
  "provider": "ISPOS",
  "providerTransactionId": "provider-transaction-id",
  "message": "Payment approved."
}
```

Response for redirect-required payment:

```json
{
  "paymentId": "pay_123",
  "orderReference": "ORD-2026-0001",
  "status": "REDIRECT_REQUIRED",
  "provider": "ISPOS",
  "redirect": {
    "method": "POST",
    "url": "https://provider.example/3d-secure",
    "fields": {
      "providerField": "value"
    }
  }
}
```

Possible statuses:

- `APPROVED`
- `DECLINED`
- `REDIRECT_REQUIRED`
- `PENDING`
- `FAILED`
- `UNKNOWN`

### GET `/api/payments/{paymentId}`

Returns the current normalized payment status.

Response:

```json
{
  "paymentId": "pay_123",
  "orderReference": "ORD-2026-0001",
  "status": "APPROVED",
  "provider": "ISPOS",
  "providerTransactionId": "provider-transaction-id",
  "message": "Payment approved."
}
```

### POST `/api/payments/ispos/callback`

Receives provider callback or 3D Secure return data when required by İşPOS.

This endpoint must:

- Validate provider authenticity.
- Avoid logging sensitive fields.
- Update the transaction status.
- Redirect or return a stable result depending on the provider flow.
