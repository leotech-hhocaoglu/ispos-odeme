# Security

## Sensitive Data

Sensitive values include:

- Card PAN
- CVV
- Full expiry date
- İşPOS merchant credentials
- Store key
- API passwords
- Session tokens
- Authentication passwords

## Handling Rules

- Never log sensitive values.
- Never store CVV.
- Mask card PAN when display or audit metadata is needed.
- Keep provider secrets only in environment variables or a secrets manager.
- Keep payment provider communication server-side.
- Use HTTPS in every non-local environment.
- Apply rate limiting to auth and payment endpoints.
- Use CSRF protection when cookie-based sessions are used.
- Use secure, HTTP-only, same-site cookies for session auth when applicable.

## Logging

Allowed payment log fields:

- Internal payment ID
- Order reference
- Amount
- Currency
- Normalized status
- Provider transaction ID
- Masked card suffix only, for example `****1111`
- Timestamp

Forbidden log fields:

- Full card number
- CVV
- Provider password
- Store key
- Raw provider request if it includes sensitive fields
- Raw provider response if it includes sensitive fields

## Validation

Frontend validation improves usability. Backend validation is authoritative.

Backend must validate:

- Authentication and authorization
- Amount format and positive value
- Currency allow-list
- Order reference format and uniqueness
- Card field presence and format
- Provider callback authenticity

## PCI Considerations

Card data handling can affect PCI DSS scope. Prefer İşPOS-supported hosted, redirected, or tokenized flows when available.

If direct card entry is required, confirm compliance obligations before production use.

## Incident-Safe Defaults

- Disable verbose provider logging in production.
- Rotate credentials when leakage is suspected.
- Separate sandbox and production credentials.
- Use different callback secrets per environment.
- Do not reuse test card data in production-like logs or demos.
