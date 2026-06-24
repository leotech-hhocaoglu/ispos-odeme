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

Verified sandbox notes on 2026-06-24:

- Virtual POS product: `virtual-pos-product` version `1.1.7`.
- The product exposes separate `Payment` and `3D Payment` operations.
- The sandbox Virtual POS base path is `/api/sandbox-isbank/virtual-pos/v1`.
- `3D Payment` accepts order number, merchant number, card number, expiry month,
  expiry year, numeric currency, amount, CVV, and card statement description.
- TRY is represented by numeric currency code `949` in the İşPOS request.
- İşPOS client ID, client secret, OAuth token, certificate, and merchant number
  are backend-owned and must not be exposed to the frontend.

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
