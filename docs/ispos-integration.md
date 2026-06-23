# İşPOS Integration Notes

## Boundary

The backend is the only system component that communicates with İşbankası İşPOS Sanal POS.

The frontend submits payment intent to the backend. The backend prepares the provider request, applies required signing or hashing, sends or returns the provider action, and normalizes the result.

## Required Provider Configuration

Confirm the current official İşbank documentation for:

- Sandbox base URL
- Production base URL
- Merchant ID or client ID fields
- Store key or hash secret
- API username and password requirements
- Supported currencies
- Request encoding
- Hash/signature algorithm
- 3D Secure request and callback format
- Success and failure URL behavior
- Test card numbers and sandbox rules

## Suggested Backend Interface

```java
public interface PaymentGateway {
    PaymentResult initiatePayment(PaymentRequest request);

    PaymentResult handleCallback(ProviderCallback callback);
}
```

## Suggested Status Mapping

Normalize provider-specific statuses into:

- `APPROVED`
- `DECLINED`
- `REDIRECT_REQUIRED`
- `PENDING`
- `FAILED`
- `UNKNOWN`

## Data Storage Guidance

Store only transaction-safe metadata:

- Internal payment ID
- Order reference
- Amount
- Currency
- Normalized status
- Provider transaction ID
- Masked card suffix
- Timestamps

Do not store:

- CVV
- Full card number
- Provider secrets
- Raw request/response payloads containing sensitive values

## Implementation Checklist

- Add typed configuration properties for İşPOS settings.
- Validate all required configuration on backend startup.
- Add provider adapter unit tests with sanitized fixtures.
- Add callback authenticity validation.
- Add idempotency protection for repeated callback/payment submissions.
- Keep sandbox and production settings separate.
